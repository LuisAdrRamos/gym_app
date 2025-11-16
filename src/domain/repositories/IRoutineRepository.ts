import { Rutina, CreateRutinaData } from "../entities/Rutina";

export interface IRoutineRepository {
    /**
     * Crea una nueva rutina en la base de datos.
     */
    create(data: CreateRutinaData): Promise<Rutina>;

    /**
         * Obtiene todas las rutinas creadas por un entrenador específico.
         * @param entrenador_id - El ID del entrenador.
         * @returns Una lista de rutinas. [cite: 333, 334]
         */
    findByTrainer(entrenador_id: string): Promise<Rutina[]>;

    /**
     * Actualiza la URL del video de una rutina específica después de la subida a Storage.
     */
    updateVideoUrl(routineId: number, videoUrl: string): Promise<Rutina>;
}