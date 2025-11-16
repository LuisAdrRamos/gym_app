import { IStorageRepository, UploadResult } from "@/src/domain/repositories/IStorageRepository";
import { supabase } from "../services/supabaseClient";

export class SupabaseStorageRepository implements IStorageRepository {

    /**
     * Sube un archivo (video, imagen) a un bucket de Supabase.
     */
    async upload(
        bucket: string,
        filePath: string,
        fileUri: string,
        contentType: string
    ): Promise<UploadResult> {

        // 1. Crear el objeto FormData para manejar el archivo local
        const formData = new FormData();
        const fileName = filePath.split('/').pop() || 'file'; // Obtener el nombre del archivo

        // Nota: El 'as any' es necesario para cumplir con la interfaz de FormData en RN/Web
        formData.append('file', {
            uri: fileUri,
            name: fileName,
            type: contentType,
        } as any);

        // 2. Subir el archivo al Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from(bucket)
            .upload(filePath, formData, {
                upsert: true, // Sobrescribe si el archivo ya existe
            });

        if (uploadError) {
            console.error("Error uploading file:", uploadError.message);
            throw new Error(`Error al subir el archivo a Storage: ${uploadError.message}`);
        }

        if (!uploadData) {
            throw new Error("No se recibió respuesta de Supabase Storage.");
        }

        // 3. Obtener la URL pública (necesaria para guardar en PostgreSQL y mostrar en la app)
        const { data: urlData } = supabase.storage
            .from(bucket)
            .getPublicUrl(uploadData.path);

        if (!urlData) {
            throw new Error("No se pudo obtener la URL pública.");
        }

        return {
            publicUrl: urlData.publicUrl,
            path: uploadData.path,
        };
    }
}