import { Rutina } from "../../entities/Rutina";
import { IRoutineRepository } from "../../repositories/IRoutineRepository";

export class GetRoutinesByTrainer {
    constructor(private routineRepository: IRoutineRepository) { }

    async execute(entrenador_id: string): Promise<Rutina[]> {
        if (!entrenador_id) {
            throw new Error("ID de entrenador requerido.");
        }

        return this.routineRepository.findByTrainer(entrenador_id);
    }
}