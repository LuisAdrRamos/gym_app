import { PlanEntrenamiento, CreatePlanData } from "../entities/PlanEntrenamiento";
import { User } from "../entities/User";

/**
 * Tipo para obtener un perfil básico de usuario para la asignación.
 */
export type UserProfileForAssignment = Pick<User, 'id' | 'name' | 'role' | 'email'>;

export interface ITrainingPlanRepository {
    /**
     * Asigna un nuevo plan de entrenamiento a un usuario.
     */
    assignPlan(data: CreatePlanData): Promise<PlanEntrenamiento>;

    /**
     * Obtiene todos los planes asignados a un usuario específico.
     */
    getPlansByUserId(usuario_id: string): Promise<PlanEntrenamiento[]>;

    /**
     * Obtiene una lista de todos los usuarios con el rol 'Usuario' para ser asignados.
     */
    getAllUsers(): Promise<UserProfileForAssignment[]>;
}