// FILE: src/domain/usecases/training/GetTrainerForUser.ts
import { UserProfileForAssignment } from "../../repositories/ITrainingPlanRepository"; 
import { ITrainingPlanRepository } from "../../repositories/ITrainingPlanRepository";

// 🟢 NOTA: Renombramos la importación (UserProfileForAssignment) a UserProfile para mantener la consistencia interna.
export class GetTrainerForUser {
    constructor(private planRepository: ITrainingPlanRepository) { }

    async execute(usuario_id: string): Promise<UserProfileForAssignment | null> {
        if (!usuario_id) return null;
        // Llamada al método implementado en el repositorio (Paso 1 anterior)
        return this.planRepository.getTrainerByUserId(usuario_id); 
    }
}