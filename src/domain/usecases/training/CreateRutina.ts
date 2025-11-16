import { Rutina, CreateRutinaData } from "../../entities/Rutina";
import { IRoutineRepository } from "../../repositories/IRoutineRepository";

export class CreateRutina {
    constructor(private routineRepository: IRoutineRepository) {}

    async execute(data: CreateRutinaData): Promise<Rutina> {
        // Validación de negocio: El nombre es obligatorio y el creador debe existir
        if (!data.nombre || data.nombre.trim() === '') {
            throw new Error("El nombre de la rutina es obligatorio.");
        }
        if (!data.entrenador_id) {
            throw new Error("ID de entrenador requerido.");
        }
        
        return this.routineRepository.create(data);
    }
}