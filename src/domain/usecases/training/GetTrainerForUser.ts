// FILE: src/domain/usecases/GetTrainerForUser.ts

import { UserProfile } from "../../entities/PlanEntrenamiento";
import { ITrainingPlanRepository } from "../../repositories/ITrainingPlanRepository";

export class GetTrainerForUser {
    constructor(private planRepository: ITrainingPlanRepository) { }

    async execute(usuario_id: string): Promise<UserProfile | null> {
        if (!usuario_id) return null;
        return this.planRepository.getTrainerByUserId(usuario_id);
    }
}