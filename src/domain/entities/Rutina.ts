/**
 * Entidad de Dominio Rutina.
 * Representa una rutina de ejercicios creada por un entrenador.
 */
export interface Rutina {
    id: number;
    nombre: string;
    descripcion: string;
    entrenador_id: string; // ID del creador
    created_at: string;
    // URL del video demostrativo subido a Supabase Storage (opcional)
    video_url?: string | null;
}

/**
 * Datos necesarios para crear una nueva rutina.
 */
export interface CreateRutinaData {
    nombre: string;
    descripcion: string;
    entrenador_id: string;
}