/**
 * Entidad de Dominio Mensaje.
 * Utilizada para el chat en tiempo real entre entrenador y usuario.
 */
export interface Mensaje {
    id: number;
    sender_id: string;      // ID del remitente
    receiver_id: string;    // ID del receptor
    content: string;
    created_at: string;
}

/**
 * Datos necesarios para enviar un mensaje.
 */
export interface SendMensajeData {
    sender_id: string;
    receiver_id: string;
    content: string;
}