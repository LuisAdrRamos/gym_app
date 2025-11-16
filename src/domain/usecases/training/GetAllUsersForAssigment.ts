import { ITrainingPlanRepository, UserProfileForAssignment } from "../../repositories/ITrainingPlanRepository";

export class GetAllUsersForAssignment {
    constructor(private planRepository: ITrainingPlanRepository) { }

    async execute(): Promise<UserProfileForAssignment[]> {
        // La lógica de negocio está en el repositorio (solo trae rol 'Usuario')
        return this.planRepository.getAllUsers();
    }
}