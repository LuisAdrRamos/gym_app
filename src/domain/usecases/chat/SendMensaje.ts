import { Mensaje, SendMensajeData } from "../../entities/Mensaje";
import { IMessageRepository } from "../../repositories/IMessageRepository";

export class SendMensaje {
    constructor(private messageRepository: IMessageRepository) { }

    async execute(data: SendMensajeData): Promise<Mensaje> {
        if (!data.content || data.content.trim() === '') {
            throw new Error("El mensaje no puede estar vacío.");
        }
        if (!data.sender_id || !data.receiver_id) {
            throw new Error("Sender y Receiver ID son obligatorios.");
        }

        return this.messageRepository.sendMessage(data);
    }
}