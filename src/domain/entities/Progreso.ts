/**
 * Entidad de Dominio Progreso.
 * Representa un registro de progreso del usuario (con foto).
 */
export interface Progreso {
    id: number;
    usuario_id: string;
    rutina_id?: number | null; // Opcional: a qué rutina se asocia
    comentarios: string;       // Comentarios o métricas del día
    foto_url: string;          // URL de la foto de progreso (Subida a Storage)
    created_at: string;
}

/**
 * Datos necesarios para registrar el progreso.
 */
export interface CreateProgresoData {
    usuario_id: string;
    comentarios: string;
    foto_url: string;
    rutina_id?: number | null;
}