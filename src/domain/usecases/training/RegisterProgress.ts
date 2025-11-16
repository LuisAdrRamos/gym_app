import { Progreso, CreateProgresoData } from "../../entities/Progreso";
import { IProgressRepository } from "../../repositories/IProgressRepository";
import { IStorageRepository } from "../../repositories/IStorageRepository";

// Define los datos que vienen del frontend (URI local)
export interface RegisterProgressData {
    usuario_id: string;
    comentarios: string;
    photoUri: string; // La URI local de la foto
    rutina_id?: number | null;
}

export class RegisterProgress {
    constructor(
        private progressRepository: IProgressRepository,
        private storageRepository: IStorageRepository
    ) { }

    async execute(data: RegisterProgressData): Promise<Progreso> {
        // 1. Validaciones básicas
        if (!data.usuario_id || !data.photoUri) {
            throw new Error("ID de usuario y URI de la foto son requeridos.");
        }

        // 2. Subir la imagen a Storage
        const filePath = `${data.usuario_id}/progreso/${Date.now()}.jpeg`;
        const uploadResult = await this.storageRepository.upload(
            'fotos_progreso', // Bucket definido en el deber
            filePath,
            data.photoUri,
            'image/jpeg'
        );

        // 3. Crear el registro en la DB (usando la URL pública)
        const progressData: CreateProgresoData = {
            usuario_id: data.usuario_id,
            comentarios: data.comentarios,
            foto_url: uploadResult.publicUrl, // URL que la app usará para mostrar la imagen
            rutina_id: data.rutina_id,
        };

        return this.progressRepository.create(progressData);
    }
}