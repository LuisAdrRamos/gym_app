import { PlanEntrenamiento } from "../../entities/PlanEntrenamiento";
import { ITrainingPlanRepository } from "../../repositories/ITrainingPlanRepository";

export class GetPlansForUser {
    constructor(private planRepository: ITrainingPlanRepository) { }

    async execute(usuario_id: string): Promise<PlanEntrenamiento[]> {
        if (!usuario_id) {
            throw new Error("ID de usuario requerido.");
        }

        return this.planRepository.getPlansByUserId(usuario_id);
    }
}