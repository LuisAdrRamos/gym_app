import { ITrainingPlanRepository, UserProfileForAssignment } from "../../domain/repositories/ITrainingPlanRepository";
import { PlanEntrenamiento, CreatePlanData } from "../../domain/entities/PlanEntrenamiento";
import { supabase } from "../services/supabaseClient";

type UserProfile = UserProfileForAssignment;

export class SupabaseTrainingPlanRepository implements ITrainingPlanRepository {

    async assignPlan(data: CreatePlanData): Promise<PlanEntrenamiento> {
        const { data: newPlan, error } = await supabase
            .from('planes_entrenamiento')
            .insert({
                entrenador_id: data.entrenador_id,
                usuario_id: data.usuario_id,
                nombre: data.nombre,
                fecha_inicio: data.fecha_inicio,
                fecha_fin: data.fecha_fin,
            })
            .select()
            .single();

        if (error) {
            console.error("Error assigning plan:", error.message);
            throw new Error(`Error al asignar el plan: ${error.message}`);
        }
        if (!newPlan) {
            throw new Error("No se recibió el plan creado.");
        }
        return newPlan as PlanEntrenamiento;
    }

    async getPlansByUserId(usuario_id: string): Promise<PlanEntrenamiento[]> {
        const { data: plans, error } = await supabase
            .from('planes_entrenamiento')
            .select('*')
            .eq('usuario_id', usuario_id)
            .order('fecha_inicio', { ascending: true });

        if (error) {
            console.error("Error fetching user plans:", error.message);
            throw new Error(`Error al obtener los planes: ${error.message}`);
        }
        return plans || [];
    }

    async getAllUsers(): Promise<UserProfileForAssignment[]> {
        const { data: users, error } = await supabase
            .from('profiles')
            // 🟢 CORRECCIÓN: Seleccionar solo campos de 'profiles'
            .select('id, name, role, email') // Quitamos ':auth_users(email)'
            .eq('role', 'Usuario');

        if (error) {
            console.error("Error fetching users for assignment:", error.message);
            throw new Error(`Error al obtener la lista de usuarios: ${error.message}`);
        }

        // Mapeamos los datos de la consulta para asegurarnos de que el email se extraiga correctamente
        // Ahora 'user.email' debería existir si se llenó correctamente el campo
        return (users || []).map(user => ({
            id: user.id,
            name: user.name,
            role: user.role,
            email: user.email || 'Email no disponible',
        })) as UserProfileForAssignment[];
    }

    /**
     * Obtiene el perfil del entrenador para un usuario.
     */
    async getTrainerByUserId(usuario_id: string): Promise<UserProfile | null> {
        // 1. Encontrar los planes asignados a este usuario
        const { data: plans, error: planError } = await supabase
            .from('planes_entrenamiento')
            .select('entrenador_id')
            .eq('usuario_id', usuario_id)
            .limit(1);

        if (planError || !plans || plans.length === 0) {
            return null;
        }

        const entrenador_id = plans[0].entrenador_id;

        // 2. Obtener el perfil del entrenador (usando los campos correctos: name, role, email)
        const { data: trainer, error: trainerError } = await supabase
            .from('profiles')
            // 🟢 CORRECCIÓN DE CAMPOS: Usar name y email
            .select('id, name, role, email')
            .eq('id', entrenador_id)
            .single();

        if (trainerError) {
            console.error("Error fetching trainer profile:", trainerError.message);
            return null;
        }

        // 3. Mapear a la entidad UserProfileForAssignment
        return {
            id: trainer.id,
            name: trainer.name,
            role: trainer.role,
            email: trainer.email,
        } as UserProfile;
    }
}