import { PlanEntrenamiento, CreatePlanData } from "../../entities/PlanEntrenamiento";
import { ITrainingPlanRepository } from "../../repositories/ITrainingPlanRepository";

export class AssignTrainingPlan {
    constructor(private planRepository: ITrainingPlanRepository) { }

    async execute(data: CreatePlanData): Promise<PlanEntrenamiento> {
        // Validación de negocio: Campos esenciales
        if (!data.usuario_id || !data.entrenador_id || !data.nombre || !data.fecha_inicio || !data.fecha_fin) {
            throw new Error("Todos los campos del plan son obligatorios.");
        }

        return this.planRepository.assignPlan(data);
    }
}