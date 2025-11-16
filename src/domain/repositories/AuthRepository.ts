import { User, UserRole } from "../entities/User";
import { Session } from "@supabase/supabase-js";

export interface AuthRepository {

    /** Registra un nuevo usuario en el sistema. */
    register(
        email: string,
        password: string,
        name: string,
        role: UserRole
    ): Promise<User>;

    /** Inicia sesión con credenciales. */
    login(email: string, password: string): Promise<User>;

    /** Cierra la sesión del usuario actual. */
    logout(): Promise<void>;

    /** Envía un email para restablecer la contraseña. */
    forgotPassword(email: string): Promise<void>;

    /** Obtiene el usuario actualmente autenticado. */
    getCurrentUser(): Promise<User | null>;

    /** Actualiza la información básica del perfil del usuario (ej: nombre). */
    updateProfile(id: string, name: string): Promise<User>;

    /**
     * Escucha cambios en el estado de autenticación de Supabase.
     * @returns Una función para desuscribirse.
     */
    onAuthStateChange(callback: (user: User | null) => void): () => void;
}