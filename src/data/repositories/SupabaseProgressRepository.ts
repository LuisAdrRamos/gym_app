import { IProgressRepository } from "../../domain/repositories/IProgressRepository";
import { Progreso, CreateProgresoData } from "../../domain/entities/Progreso";
import { supabase } from "../services/supabaseClient";

export class SupabaseProgressRepository implements IProgressRepository {

    async create(data: CreateProgresoData): Promise<Progreso> {
        const { data: newProgress, error } = await supabase
            .from('progreso')
            .insert({
                usuario_id: data.usuario_id,
                comentarios: data.comentarios,
                foto_url: data.foto_url,
                rutina_id: data.rutina_id, // Puede ser null
            })
            .select()
            .single();

        if (error) {
            console.error("Error creating progress record:", error.message);
            throw new Error(`Error al crear el registro de progreso: ${error.message}`);
        }
        if (!newProgress) {
            throw new Error("No se recibió el registro creado.");
        }
        return newProgress as Progreso;
    }

    async findByUser(usuario_id: string): Promise<Progreso[]> {
        const { data: progressList, error } = await supabase
            .from('progreso')
            .select('*')
            .eq('usuario_id', usuario_id)
            .order('created_at', { ascending: false }); // Más reciente primero

        if (error) {
            console.error("Error fetching progress:", error.message);
            throw new Error(`Error al obtener el progreso: ${error.message}`);
        }
        return progressList || [];
    }
}