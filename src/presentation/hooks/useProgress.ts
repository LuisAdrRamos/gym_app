import { useState, useEffect, useCallback } from 'react';
import { container } from '@/src/di/container';
import { useAuth } from './useAuth';
import { Progreso } from '@/src/domain/entities/Progreso';
import { RegisterProgressData } from '@/src/domain/usecases/training/RegisterProgress';
import { Alert } from 'react-native';

export const useProgress = () => {
    const { user, loading: authLoading } = useAuth();
    const [progressList, setProgressList] = useState<Progreso[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchProgress = useCallback(async () => {
        if (!user?.id) return;
        setLoading(true);
        try {
            const fetchedProgress = await container.progressRepository.findByUser(user.id);
            setProgressList(fetchedProgress);
        } catch (error: any) {
            Alert.alert("Error", "No se pudo cargar el historial de progreso: " + error.message);
        } finally {
            setLoading(false);
        }
    }, [user?.id]);

    useEffect(() => {
        if (!authLoading && user) {
            fetchProgress();
        }
    }, [authLoading, user, fetchProgress]);


    const registerProgress = async (data: RegisterProgressData) => {
        if (!user) return { success: false, error: "Usuario no autenticado" };

        try {
            // El Use Case ya maneja la subida a Storage y el registro en la DB
            const newProgress = await container.registerProgress.execute(data);

            // Actualizar estado local
            setProgressList(prev => [newProgress, ...prev]);

            Alert.alert("Éxito", "Tu progreso ha sido registrado y la foto subida.");
            return { success: true, progress: newProgress };
        } catch (error: any) {
            Alert.alert("Error de Registro", error.message);
            return { success: false, error: error.message };
        }
    };

    return {
        progressList,
        loading,
        registerProgress,
        refetchProgress: fetchProgress,
    };
};