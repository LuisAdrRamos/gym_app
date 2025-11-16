import { Mensaje, SendMensajeData } from "../../domain/entities/Mensaje";
import { IMessageRepository, NewMessageCallback } from "../../domain/repositories/IMessageRepository";
import { supabase } from "../services/supabaseClient";
import { RealtimeChannel } from "@supabase/supabase-js";

export class SupabaseMessageRepository implements IMessageRepository {

    private channel: RealtimeChannel | null = null;

    async getMessages(sender_id: string, receiver_id: string): Promise<Mensaje[]> {
        // Obtenemos el historial de mensajes donde (A es sender Y B es receiver) O (B es sender Y A es receiver)
        const { data, error } = await supabase
            .from('mensajes') // Asumiendo que la tabla se llama 'mensajes'
            .select('*')
            .or(`(sender_id.eq.${sender_id},receiver_id.eq.${receiver_id}),(sender_id.eq.${receiver_id},receiver_id.eq.${sender_id})`)
            .order('created_at', { ascending: true });

        if (error) {
            console.error("Error fetching messages:", error.message);
            throw new Error(`Error al obtener los mensajes: ${error.message}`);
        }
        return data || [];
    }

    async sendMessage(data: SendMensajeData): Promise<Mensaje> {
        const { data: newMessage, error } = await supabase
            .from('mensajes')
            .insert({
                sender_id: data.sender_id,
                receiver_id: data.receiver_id,
                content: data.content,
            })
            .select()
            .single();

        if (error) {
            console.error("Error sending message:", error.message);
            throw new Error(`Error al enviar el mensaje: ${error.message}`);
        }
        if (!newMessage) {
            throw new Error("No se recibió el mensaje enviado.");
        }
        return newMessage as Mensaje;
    }

    subscribeToMessages(callback: NewMessageCallback): () => void {
        // Creamos un canal general para la tabla 'mensajes'.
        this.channel = supabase.channel('public:mensajes');

        this.channel
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'mensajes'
                },
                (payload) => {
                    const newMessage = payload.new as Mensaje;
                    callback(newMessage);
                }
            )
            .subscribe((status) => {
                console.log('Suscripción al chat:', status);
            });

        // Devolvemos una función para limpiar (desuscribirse)
        return () => {
            if (this.channel) {
                supabase.removeChannel(this.channel);
                this.channel = null;
            }
        };
    }
}