import { IRoutineRepository } from "../../domain/repositories/IRoutineRepository";
import { Rutina, CreateRutinaData } from "../../domain/entities/Rutina";
import { supabase } from "../services/supabaseClient";

export class SupabaseRoutineRepository implements IRoutineRepository {

    async create(data: CreateRutinaData): Promise<Rutina> {
        const { data: newRoutine, error } = await supabase
            .from('rutinas')
            .insert({
                nombre: data.nombre,
                descripcion: data.descripcion,
                entrenador_id: data.entrenador_id,
            })
            .select()
            .single();

        if (error) {
            console.error("Error creating routine:", error.message);
            throw new Error(`Error al crear la rutina: ${error.message}`);
        }
        if (!newRoutine) {
            throw new Error("No se recibió la rutina creada.");
        }
        return newRoutine as Rutina;
    }

    async findByTrainer(entrenador_id: string): Promise<Rutina[]> {
        const { data: routines, error } = await supabase
            .from('rutinas')
            .select('*')
            .eq('entrenador_id', entrenador_id)
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Error fetching routines:", error.message);
            throw new Error(`Error al obtener las rutinas: ${error.message}`);
        }
        return routines || [];
    }

    async updateVideoUrl(routineId: number, videoUrl: string): Promise<Rutina> {
        const { data: updatedRoutine, error } = await supabase
            .from('rutinas')
            .update({ video_url: videoUrl })
            .eq('id', routineId)
            .select()
            .single();

        if (error) {
            console.error("Error updating routine video URL:", error.message);
            throw new Error(`Error al actualizar la URL del video: ${error.message}`);
        }
        if (!updatedRoutine) {
            throw new Error("No se encontró la rutina para actualizar.");
        }
        return updatedRoutine as Rutina;
    }
}