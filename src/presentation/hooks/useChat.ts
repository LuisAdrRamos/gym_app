import { useState, useEffect, useCallback } from 'react';
import { container } from '@/src/di/container';
import { useAuth } from './useAuth';
import { Mensaje, SendMensajeData } from '@/src/domain/entities/Mensaje';
import { Alert } from 'react-native';

export const useChat = (receiverId: string | undefined) => {
    const { user, loading: authLoading } = useAuth();
    const [messages, setMessages] = useState<Mensaje[]>([]);
    const [loading, setLoading] = useState(true);

    const currentUserId = user?.id;

    // --- 1. Cargar Historial ---
    const fetchHistory = useCallback(async () => {
        if (!currentUserId || !receiverId) return;
        setLoading(true);
        try {
            const history = await container.getMessages.getHistory(currentUserId, receiverId);
            setMessages(history);
        } catch (error: any) {
            Alert.alert("Error", "No se pudo cargar el historial de chat.");
        } finally {
            setLoading(false);
        }
    }, [currentUserId, receiverId]);

    // --- 2. Enviar Mensaje ---
    const sendMessage = async (content: string) => {
        if (!currentUserId || !receiverId || content.trim() === '') return { success: false, error: "Datos incompletos" };

        try {
            const data: SendMensajeData = {
                sender_id: currentUserId,
                receiver_id: receiverId,
                content: content.trim(),
            };
            // El mensaje se inserta en la DB y el Realtime se encarga de que se muestre.
            await container.sendMensaje.execute(data);
            return { success: true };
        } catch (error: any) {
            Alert.alert("Error", "Fallo al enviar mensaje: " + error.message);
            return { success: false, error: error.message };
        }
    };

    // --- 3. Suscripción a Realtime ---
    useEffect(() => {
        if (!currentUserId || !receiverId) return;

        // Función que maneja cada nuevo mensaje que llega
        const handleNewMessage = (newMessage: Mensaje) => {
            // Solo procesar si el mensaje es para esta conversación
            const isTargeted =
                (newMessage.sender_id === currentUserId && newMessage.receiver_id === receiverId) ||
                (newMessage.sender_id === receiverId && newMessage.receiver_id === currentUserId);

            if (isTargeted) {
                setMessages(prev => [...prev, newMessage]);
            }
        };

        // Iniciar la suscripción
        const unsubscribe = container.getMessages.subscribe(handleNewMessage);

        return () => unsubscribe(); // Limpieza al desmontar
    }, [currentUserId, receiverId]);

    // Cargar historial al montar
    useEffect(() => {
        if (!authLoading) {
            fetchHistory();
        }
    }, [authLoading, fetchHistory]);


    return {
        messages,
        loading,
        sendMessage,
        fetchHistory,
        currentUserId,
    };
};