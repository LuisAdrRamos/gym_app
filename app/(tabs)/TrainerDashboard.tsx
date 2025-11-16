import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { User } from '@/src/domain/entities/User';
import { tabsStyles } from '../../src/presentation/styles/tabsStyles';
import { useTraining } from '../../src/presentation/hooks/useTraining';
import * as ImagePicker from 'expo-image-picker';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface TrainerDashboardProps {
    user: User;
}

export default function TrainerDashboard({ user }: TrainerDashboardProps) {
    const [routineName, setRoutineName] = useState('');
    const [routineDesc, setRoutineDesc] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadingId, setUploadingId] = useState<number | null>(null);

    const { routines, loading, refetchRoutines, createRoutine, uploadRoutineVideo } = useTraining();

    const handleCreateRoutine = async () => {
        if (!routineName || !routineDesc) {
            Alert.alert("Error", "El nombre y la descripción son obligatorios.");
            return;
        }

        setIsSubmitting(true);
        const data = {
            nombre: routineName,
            descripcion: routineDesc,
            entrenador_id: user.id,
        };

        const result = await createRoutine(data);
        if (result.success) {
            setRoutineName('');
            setRoutineDesc('');
        }
        setIsSubmitting(false);
    };

    const handlePickAndUploadVideo = async (routineId: number) => {
        setUploadingId(routineId);

        try {
            const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (permission.granted === false) {
                Alert.alert("Permiso denegado", "Se necesita acceso a la galería para subir videos.");
                setUploadingId(null);
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Videos,
                allowsEditing: true,
                quality: 0.7,
            });

            if (result.canceled) {
                setUploadingId(null);
                return;
            }

            const asset = result.assets[0];

            // 1. Determinar el tipo MIME y URI
            const fileUri = asset.uri;
            const contentType = asset.mimeType || 'video/mp4';

            // 2. Subir el archivo y actualizar la rutina
            await uploadRoutineVideo(routineId, fileUri, contentType);

            Alert.alert("Éxito", "Video subido y asociado a la rutina.");

        } catch (error) {
            Alert.alert("Error", "No se pudo subir el video.");
        } finally {
            setUploadingId(null);
        }
    };


    const renderRoutineItem = ({ item }: { item: any }) => (
        <View style={tabsStyles.routineItem}>
            <View style={{ flex: 1 }}>
                <Text style={tabsStyles.routineName}>{item.nombre}</Text>
                <Text style={tabsStyles.subtitle}>{item.descripcion}</Text>
                {item.video_url && (
                    <Text style={tabsStyles.videoLink}>
                        <Ionicons name="videocam" /> Video adjunto
                    </Text>
                )}
            </View>

            <View style={{ flexDirection: 'column', alignItems: 'flex-end', gap: 5 }}>
                {/* 1. Botón de Subir Video */}
                <TouchableOpacity
                    style={tabsStyles.uploadButton}
                    onPress={() => handlePickAndUploadVideo(item.id)}
                    disabled={uploadingId !== null}
                >
                    <Text style={tabsStyles.uploadButtonText}>
                        {uploadingId === item.id ? "Subiendo..." : (item.video_url ? "Cambiar Video" : "Subir Video")}
                    </Text>
                </TouchableOpacity>

                {/* 2. Botón de Asignar Plan */}
                <Link
                    href={{
                        pathname: "/(tabs)/assign-plan",
                        params: { routineId: item.id, routineName: item.nombre }
                    }}
                    style={tabsStyles.linkButton}
                    asChild
                >
                    <TouchableOpacity>
                        <Text style={tabsStyles.linkButtonText}>Asignar Plan</Text>
                    </TouchableOpacity>
                </Link>
            </View>
        </View>
    );

    return (
        <View>
            <View style={tabsStyles.contentBox}>
                <Text style={tabsStyles.title}>Nueva Rutina</Text>
                <TextInput
                    style={tabsStyles.progressInput}
                    placeholder="Nombre de la Rutina"
                    value={routineName}
                    onChangeText={setRoutineName}
                />
                <TextInput
                    style={tabsStyles.progressInput}
                    placeholder="Descripción de los ejercicios"
                    value={routineDesc}
                    onChangeText={setRoutineDesc}
                    multiline
                />
                <Button
                    title={isSubmitting ? "Creando..." : "Crear Rutina"}
                    onPress={handleCreateRoutine}
                    disabled={isSubmitting}
                    color={tabsStyles.linkButton.backgroundColor}
                />
            </View>

            <View style={tabsStyles.contentBox}>
                <Text style={tabsStyles.title}>Mis Rutinas Creadas</Text>
                {loading ? (
                    <ActivityIndicator size="large" />
                ) : (
                    <FlatList
                        data={routines}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderRoutineItem}
                        ListEmptyComponent={<Text style={tabsStyles.subtitle}>No has creado ninguna rutina aún.</Text>}
                        refreshing={loading}
                        onRefresh={refetchRoutines}
                    />
                )}
            </View>
        </View>
    );
}