import { Mensaje, SendMensajeData } from "../entities/Mensaje";

// El callback que se ejecutará cuando llegue un nuevo mensaje
export type NewMessageCallback = (message: Mensaje) => void;

export interface IMessageRepository {
    /**
     * Obtiene el historial de mensajes entre dos usuarios.
     */
    getMessages(
        sender_id: string,
        receiver_id: string
    ): Promise<Mensaje[]>;

    /**
     * Envía un nuevo mensaje.
     */
    sendMessage(data: SendMensajeData): Promise<Mensaje>;

    /**
     * Se suscribe a nuevos mensajes en un canal específico (Realtime).
     * @param callback - La función a llamar cuando llega un mensaje nuevo.
     * @returns Una función para desuscribirse.
     */
    subscribeToMessages(
        callback: NewMessageCallback
    ): () => void;
}