import { ITrainingPlanRepository, UserProfileForAssignment } from "../../domain/repositories/ITrainingPlanRepository";
import { PlanEntrenamiento, CreatePlanData } from "../../domain/entities/PlanEntrenamiento";
import { supabase } from "../services/supabaseClient";

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
        // La consulta es a la tabla 'profiles' para obtener la lista de usuarios.
        const { data: users, error } = await supabase
            .from('profiles')
            // Seleccionamos solo los campos necesarios según la interfaz UserProfileForAssignment
            .select('id, name, role, email:auth_users(email)') // Supabase permite joins así (si la FK existe)
            .eq('role', 'Usuario'); // Filtramos solo por el rol 'Usuario'

        if (error) {
            console.error("Error fetching users for assignment:", error.message);
            throw new Error(`Error al obtener la lista de usuarios: ${error.message}`);
        }
        
        // Mapeamos los datos de la consulta para asegurarnos de que el email se extraiga correctamente
        return (users || []).map(user => ({
            id: user.id,
            name: user.name,
            role: user.role,
            // 🟢 ASUNCION: El email es difícil de obtener sin un trigger/vista. 
            // Para el deber, si el name es visible, el email se usará solo en el login.
            email: (user as any).email || 'Email no disponible', 
        })) as UserProfileForAssignment[];
    }
}