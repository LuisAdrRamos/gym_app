export interface UploadResult {
    /** URL pública del archivo subido. */
    publicUrl: string;
    /** Ruta interna (path) del archivo en el bucket. */
    path: string;
}

export interface IStorageRepository {
    /**
     * Sube un archivo (imagen o video) a un bucket específico.
     * @param bucket - Nombre del bucket (ej: 'videos_ejercicios', 'fotos_progreso').
     * @param filePath - Ruta única dentro del bucket (ej: 'user_id/fecha.jpg').
     * @param fileUri - URI local del archivo en el dispositivo (obtenido de ImagePicker).
     * @param contentType - Tipo MIME del archivo (ej: 'video/mp4', 'image/jpeg').
     */
    upload(
        bucket: string,
        filePath: string,
        fileUri: string,
        contentType: string
    ): Promise<UploadResult>;
}