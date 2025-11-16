/**
 * Entidad de Dominio PlanEntrenamiento.
 * Representa la asignación de rutinas de un entrenador a un usuario
 * para un periodo específico.
 */
export interface PlanEntrenamiento {
    id: number;
    entrenador_id: string; // ID del entrenador que lo asigna
    usuario_id: string;    // ID del usuario al que se le asigna
    nombre: string;
    fecha_inicio: string;  // Fecha de inicio (YYYY-MM-DD)
    fecha_fin: string;     // Fecha de finalización (YYYY-MM-DD)
    created_at: string;
}

/**
 * Datos necesarios para crear o asignar un Plan de Entrenamiento.
 */
export interface CreatePlanData {
    entrenador_id: string;
    usuario_id: string;
    nombre: string;
    fecha_inicio: string;
    fecha_fin: string;
}