import { useState, useEffect, useCallback } from 'react';
import { container } from '@/src/di/container';
import { useAuth } from './useAuth';
import { Rutina, CreateRutinaData } from '@/src/domain/entities/Rutina';
import { PlanEntrenamiento } from '@/src/domain/entities/PlanEntrenamiento';
import { CreatePlanData } from '@/src/domain/entities/PlanEntrenamiento';
import { Alert } from 'react-native';

// Definición de un tipo para la lista de usuarios (sin la complejidad de la entidad User completa)
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

    const fetchUsersForAssignment = useCallback(async () => {
        if (!isTrainer) return;
        try {
            const fetchedUsers = await container.getAllUsersForAssignment.execute();
            // La entidad UserForAssignment coincide con el retorno del Use Case (UserProfileForAssignment)
            setUsersList(fetchedUsers as UserForAssignment[]);
        } catch (error: any) {
            Alert.alert("Error", "No se pudo cargar la lista de usuarios: " + error.message);
        }
    }, [isTrainer]);

    // Efecto que ejecuta las cargas según el rol
    useEffect(() => {
        if (!authLoading && user) {
            if (isTrainer) {
                fetchRoutines();
                fetchUsersForAssignment();
            } else {
                fetchPlans();
            }
        }
    }, [authLoading, user, isTrainer, fetchRoutines, fetchPlans, fetchUsersForAssignment]);

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
    // Simula la subida de videos
    const uploadRoutineVideo = async (routineId: number, fileUri: string, contentType: string) => {
        if (!user) return { success: false, error: "Usuario no autenticado" };

        try {
            // 1. Subir a Storage
            const filePath = `${user.id}/routines/${routineId}/${new Date().getTime()}.${contentType.split('/')[1]}`;
            const uploadResult = await container.storageRepository.upload(
                'videos_ejercicios',
                filePath,
                fileUri,
                contentType
            );

            // 2. Actualizar URL en la DB
            const updatedRoutine = await container.routineRepository.updateVideoUrl(routineId, uploadResult.publicUrl);

            // 3. Actualizar estado local
            setRoutines(prev => prev.map(r => r.id === routineId ? updatedRoutine : r));

            return { success: true, url: updatedRoutine.video_url };
        } catch (error: any) {
            Alert.alert("Error de Subida", error.message);
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
        // Funciones para recargar
        refetchRoutines: fetchRoutines,
        refetchPlans: fetchPlans,
        fetchUsersForAssignment,
    };
};