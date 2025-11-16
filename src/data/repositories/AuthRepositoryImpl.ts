import { User, UserRole } from "../../domain/entities/User";
import { AuthRepository } from "../../domain/repositories/AuthRepository";
// 🟢 CORREGIDO: Ruta de importación del cliente
import { Subscription, User as SupabaseUser } from "@supabase/supabase-js";
import { supabase } from "../services/supabaseClient";

/**
 * Interfaz local para la tabla 'profiles'.
 * Necesaria para tipar la respuesta de la DB.
 */
interface SupabaseProfile {
    id: string;
    name: string;
    role: UserRole;
}

export class AuthRepositoryImpl implements AuthRepository {

    private _subscription: Subscription | null = null;

    // --- Mapeo de Supabase Auth + Profile a Entidad User (Método auxiliar) ---
    private async _mapToUser(supabaseUser: SupabaseUser): Promise<User | null> {
        try {
            // 1. Obtener datos del perfil (nombre y rol)
            // 🟢 CORREGIDO: Se tipa explícitamente la respuesta de la DB para evitar errores de 'never'
            const { data: profile, error } = await supabase
                .from('profiles')
                .select('name, role')
                .eq('id', supabaseUser.id)
                .returns<SupabaseProfile[]>() // <-- Tipado para la respuesta
                .single();

            const profileData = profile;

            if (error || !profileData) {
                // Esto podría ocurrir si el perfil aún no se crea o hay un RLS.
                console.warn('Profile not found or RLS error for user:', supabaseUser.id);

                // Retornamos un objeto User con valores seguros/por defecto
                return {
                    id: supabaseUser.id,
                    email: supabaseUser.email || 'unknown@email.com',
                    name: profileData?.name || 'Nombre Desconocido', // 🟢 CORREGIDO: Se accede de forma segura con ?
                    role: profileData?.role || 'Usuario', // 🟢 CORREGIDO: Se accede de forma segura con ?
                } as User;
            }

            // 2. Mapear a la entidad de Dominio completa
            return {
                id: supabaseUser.id,
                email: supabaseUser.email || 'unknown@email.com',
                name: profileData.name,
                role: profileData.role,
            };

        } catch (error) {
            console.error('Error in _mapToUser:', error);
            return null;
        }
    }

    // --- Implementaciones de AuthRepository ---

    async register(
        email: string,
        password: string,
        name: string,
        role: UserRole
    ): Promise<User> {
        // 1. Crear usuario en Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
        });

        if (authError) {
            throw new Error(authError.message);
        }
        if (!authData.user) {
            throw new Error("Error desconocido al crear usuario.");
        }

        // 2. Insertar datos de perfil (nombre y rol) en la tabla 'profiles'
        const { error: profileError } = await supabase
            .from('profiles')
            .insert({
                id: authData.user.id,
                name,
                role,
            });

        if (profileError) {
            // Si falla la inserción del perfil, eliminamos el usuario de Auth por consistencia.
            await supabase.auth.admin.deleteUser(authData.user.id);
            throw new Error(`Error al guardar el perfil: ${profileError.message}`);
        }

        // 3. Retornar la entidad User mapeada
        return this._mapToUser(authData.user) as Promise<User>;
    }

    async login(email: string, password: string): Promise<User> {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            throw new Error(error.message);
        }
        if (!data.user) {
            throw new Error("Credenciales inválidas.");
        }

        // Retornar la entidad User mapeada
        return this._mapToUser(data.user) as Promise<User>;
    }

    async logout(): Promise<void> {
        const { error } = await supabase.auth.signOut();
        if (error) {
            throw new Error(error.message);
        }
    }

    async forgotPassword(email: string): Promise<void> {
        const { error } = await supabase.auth.resetPasswordForEmail(email);

        if (error) {
            throw new Error(error.message);
        }
    }

    async getCurrentUser(): Promise<User | null> {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return null;
        }

        // Retornar la entidad User mapeada
        return this._mapToUser(user);
    }

    async updateProfile(id: string, name: string): Promise<User> {
        // 1. Actualizar el campo 'name' en la tabla 'profiles'
        const { error: profileError } = await supabase
            .from('profiles')
            .update({ name })
            .eq('id', id);
        // Ya no usamos .select().single() para simplificar y solo verificar el error.

        if (profileError) {
            throw new Error(`Error al actualizar el perfil: ${profileError.message}`);
        }

        // 2. Forzar la obtención del objeto User actualizado
        // La actualización de Auth se maneja internamente por Supabase,
        // pero necesitamos forzar la recarga del perfil.
        return this.getCurrentUser() as Promise<User>;
    }


    onAuthStateChange(callback: (user: User | null) => void): () => void {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (_event, session) => {
                if (session?.user) {
                    // Obtener los datos completos del perfil y Auth
                    const user = await this._mapToUser(session.user);
                    callback(user);
                } else {
                    callback(null);
                }
            }
        );

        // Guardamos la referencia a la suscripción para desuscribirnos
        this._subscription = subscription;
        // Retornamos la función de desuscripción de Supabase
        return () => {
            if (this._subscription) {
                this._subscription.unsubscribe();
                this._subscription = null;
            }
        };
    }
}