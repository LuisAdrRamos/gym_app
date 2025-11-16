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

    // 🟢 Lógica unificada para cargar usuarios/entrenadores para chat/asignación
    const fetchUsersForChat = useCallback(async () => {
        if (!user?.id) return;
        try {
            let fetchedUsers: UserForAssignment[] = [];

            if (isTrainer) {
                // 1. Lógica del Entrenador: Obtener todos los Usuarios para asignar/chatear
                const result = await container.getAllUsersForAssignment.execute();
                fetchedUsers = result as UserForAssignment[];

            } else {
                // 2. Lógica del Usuario: Buscar solo a su Entrenador
                const trainerProfile = await container.getTrainerForUser.execute(user.id);

                if (trainerProfile) {
                    // Mapeamos el perfil del entrenador al tipo de la lista
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


    // 🟢 Efecto que ejecuta las cargas según el rol
    useEffect(() => {
        if (!authLoading && user) {
            // Siempre cargamos la lista de chat/asignación, independientemente del rol.
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
    // Simula la subida de videos
    const uploadRoutineVideo = async (
        routineId: number,
        fileUri: string,
        contentType: string,
        // 🟢 ACEPTAR FUNCIÓN DE PROGRESO
        onProgress?: (progress: number) => void
    ) => {
        if (!user) return { success: false, error: "Usuario no autenticado" };

        // 🟢 SIMULACIÓN DE PROGRESO (Reemplazar con la lógica real si estuviera disponible)
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
                'videos_ejercicios',
                filePath,
                fileUri,
                contentType
            );
            // ... (resto del código)
            if (onProgress) onProgress(100); // 🟢 Progreso al 100%
            // ...
        } catch (error: any) {
            // ...
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
        fetchUsersForAssignment: fetchUsersForChat,
    };
};