import { Mensaje } from "../../entities/Mensaje";
import { IMessageRepository, NewMessageCallback } from "../../repositories/IMessageRepository";

export class GetMessages {
    constructor(private messageRepository: IMessageRepository) { }

    /**
     * Obtiene el historial de mensajes de una conversación.
     */
    async getHistory(user1_id: string, user2_id: string): Promise<Mensaje[]> {
        if (!user1_id || !user2_id) {
            return [];
        }
        return this.messageRepository.getMessages(user1_id, user2_id);
    }

    /**
     * Devuelve la función de suscripción para Realtime.
     */
    subscribe(callback: NewMessageCallback): () => void {
        return this.messageRepository.subscribeToMessages(callback);
    }
}