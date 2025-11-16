import { Progreso, CreateProgresoData } from "../entities/Progreso";

export interface IProgressRepository {
    /**
     * Crea un nuevo registro de progreso (incluyendo la URL de la foto de Storage).
     */
    create(data: CreateProgresoData): Promise<Progreso>;

    /**
     * Obtiene todos los registros de progreso de un usuario específico.
     */
    findByUser(usuario_id: string): Promise<Progreso[]>;
}