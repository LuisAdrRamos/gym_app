// FILE: src/presentation/hooks/useTraining.ts

import { useState, useEffect, useCallback } from 'react';
import { container } from '@/src/di/container';
import { useAuth } from './useAuth';
import { Rutina, CreateRutinaData } from '@/src/domain/entities/Rutina';
import { PlanEntrenamiento } from '@/src/domain/entities/PlanEntrenamiento';
import { CreatePlanData } from '@/src/domain/entities/PlanEntrenamiento';
import { Alert } from 'react-native';

// Definición de un tipo para la lista de usuarios
export interface UserForAssignment {
    id: string;
    name: string;
    email: string;
    role: 'Usuario' | 'Entrenador';
}

export const useTraining = () => {
    const { user, role, loading: authLoading } = useAuth();
    const [routines, setRoutines] = useState<Rutina[]>([]);
    const [plans, setPlans] = useState<PlanEntrenamiento[]>([]);
    const [usersList, setUsersList] = useState<UserForAssignment[]>([]);
    const [loading, setLoading] = useState(true);
    const isTrainer = role === 'Entrenador';

    // --- CARGA DE DATOS ---

    const fetchRoutines = useCallback(async () => {
        if (!isTrainer || !user?.id) return;
        setLoading(true);
        try {
            const fetchedRoutines = await container.getRoutinesByTrainer.execute(user.id);
            setRoutines(fetchedRoutines);
        } catch (error: any) {
            Alert.alert("Error", "No se pudieron cargar las rutinas: " + error.message);
        } finally {
            setLoading(false);
        }
    }, [isTrainer, user?.id]);

    const fetchPlans = useCallback(async () => {
        if (role !== 'Usuario' || !user?.id) return;
        setLoading(true);
        try {
            const fetchedPlans = await container.getPlansForUser.execute(user.id);
            setPlans(fetchedPlans);
        } catch (error: any) {
            Alert.alert("Error", "No se pudieron cargar los planes: " + error.message);
        } finally {
            setLoading(false);
        }
    }, [role, user?.id]);

    // Lógica unificada para cargar usuarios/entrenadores para chat/asignación
    const fetchUsersForChat = useCallback(async () => {
        if (!user?.id) return;
        try {
            let fetchedUsers: UserForAssignment[] = [];

            if (isTrainer) {
                // Lógica del Entrenador: Obtener todos los Usuarios
                const result = await container.getAllUsersForAssignment.execute();
                fetchedUsers = result as UserForAssignment[];

            } else {
                // Lógica del Usuario: Buscar solo a su Entrenador
                const trainerProfile = await container.getTrainerForUser.execute(user.id);

                if (trainerProfile) {
                    fetchedUsers = [{
                        id: trainerProfile.id,
                        name: trainerProfile.name || trainerProfile.email,
                        email: trainerProfile.email,
                        role: trainerProfile.role,
                    } as UserForAssignment];
                }
            }

            setUsersList(fetchedUsers);

        } catch (error: any) {
            Alert.alert("Error", "No se pudo cargar la lista de contactos: " + error.message);
        }
    }, [isTrainer, user?.id]);

    // Efecto que ejecuta las cargas según el rol
    useEffect(() => {
        if (!authLoading && user) {
            fetchUsersForChat();
            if (isTrainer) {
                fetchRoutines();
            } else {
                fetchPlans();
            }
        }
    }, [authLoading, user, isTrainer, fetchRoutines, fetchPlans, fetchUsersForChat]);

    // --- OPERACIONES (Entrenador) ---

    const createRoutine = async (data: CreateRutinaData) => {
        try {
            const newRoutine = await container.createRutina.execute(data);
            setRoutines(prev => [newRoutine, ...prev]);
            Alert.alert("Éxito", "Rutina creada correctamente.");
            return { success: true, routine: newRoutine };
        } catch (error: any) {
            Alert.alert("Error", "Fallo al crear rutina: " + error.message);
            return { success: false, error: error.message };
        }
    };

    const assignPlan = async (data: CreatePlanData) => {
        try {
            const newPlan = await container.assignTrainingPlan.execute(data);
            Alert.alert("Éxito", `Plan '${data.nombre}' asignado correctamente.`);
            return { success: true, plan: newPlan };
        } catch (error: any) {
            Alert.alert("Error", "Fallo al asignar plan: " + error.message);
            return { success: false, error: error.message };
        }
    };

    // --- OPERACIONES (Storage) ---
    const uploadRoutineVideo = async (
        routineId: number,
        fileUri: string,
        contentType: string,
        onProgress?: (progress: number) => void
    ) => {
        if (!user) return { success: false, error: "Usuario no autenticado" };

        // Simulación de progreso
        if (onProgress) {
            onProgress(10);
            await new Promise(resolve => setTimeout(resolve, 300));
            onProgress(50);
            await new Promise(resolve => setTimeout(resolve, 300));
            onProgress(90);
        }

        try {
            // 1. Subir a Storage
            const filePath = `${user.id}/routines/${routineId}/${new Date().getTime()}.${contentType.split('/')[1]}`;
            const uploadResult = await container.storageRepository.upload(
                'videos_ejercicios', // Asegúrate que el bucket se llame así
                filePath,
                fileUri,
                contentType
            );

            // 2. 🟢 (CORREGIDO) Actualizar la URL en la base de datos (tabla 'rutinas')
            const updatedRoutine = await container.routineRepository.updateVideoUrl(
                routineId,
                uploadResult.publicUrl // Guardamos la URL pública
            );

            // 3. 🟢 (CORREGIDO) Actualizar el estado local para que la UI reaccione
            setRoutines(prev =>
                prev.map(r => (r.id === routineId ? updatedRoutine : r))
            );

            if (onProgress) onProgress(100);

            // 4. 🟢 (CORREGIDO) Retornar éxito
            return { success: true, url: updatedRoutine.video_url };

        } catch (error: any) {
            // 5. 🟢 (CORREGIDO) Manejar el error
            console.error("Error en uploadRoutineVideo:", error);
            Alert.alert("Error de Subida", error.message);
            if (onProgress) onProgress(0); // Resetea el progreso
            return { success: false, error: error.message };
        }
    };

    return {
        routines,
        plans,
        usersList,
        loading,
        isTrainer,
        createRoutine,
        assignPlan,
        uploadRoutineVideo,
        refetchRoutines: fetchRoutines,
        refetchPlans: fetchPlans,
        fetchUsersForAssignment: fetchUsersForChat,
    };
};