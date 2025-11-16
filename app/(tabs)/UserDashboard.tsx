import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, FlatList, ActivityIndicator, Image, ScrollView, TouchableOpacity } from 'react-native';
import { User } from '@/src/domain/entities/User';
import { tabsStyles, ColorPalette } from '../../src/presentation/styles/tabsStyles';
import { useTraining } from '../../src/presentation/hooks/useTraining';
import { useProgress } from '../../src/presentation/hooks/useProgress';
import * as ImagePicker from 'expo-image-picker';
import { RegisterProgressData } from '@/src/domain/usecases/training/RegisterProgress';
import { Ionicons } from '@expo/vector-icons';

interface UserDashboardProps {
    user: User;
}

export default function UserDashboard({ user }: UserDashboardProps) {
    const [comment, setComment] = useState('');
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [isSubmittingProgress, setIsSubmittingProgress] = useState(false);
    
    const { plans, loading: loadingPlans, refetchPlans } = useTraining();
    const { progressList, loading: loadingProgress, refetchProgress, registerProgress } = useProgress();

    // --- MANEJO DE IMAGEN ---
    const handlePickImage = async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permission.granted === false) {
            Alert.alert("Permiso denegado", "Se necesita acceso a la galería.");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.8,
            aspect: [4, 3],
        });

        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
        }
    };

    const handleSubmitProgress = async () => {
        if (!imageUri || !comment) {
            Alert.alert("Error", "Por favor, añade un comentario y selecciona una foto.");
            return;
        }
        
        setIsSubmittingProgress(true);
        
        const data: RegisterProgressData = {
            usuario_id: user.id,
            comentarios: comment,
            photoUri: imageUri,
            // rutina_id se deja opcional por ahora
        };

        const result = await registerProgress(data);

        if (result.success) {
            setComment('');
            setImageUri(null);
        }
        setIsSubmittingProgress(false);
    };

    const renderPlanItem = ({ item }: { item: any }) => (
        <View style={tabsStyles.planItem}>
            <Text style={tabsStyles.planName}>{item.nombre}</Text>
            <Text style={tabsStyles.planDates}>
                {`Inicio: ${item.fecha_inicio} | Fin: ${item.fecha_fin}`}
            </Text>
            <Text style={tabsStyles.subtitle}>
                Plan asignado por su entrenador.
            </Text>
        </View>
    );

    const renderProgressItem = ({ item }: { item: any }) => (
        <View style={tabsStyles.progressHistoryItem}>
            <Image 
                source={{ uri: item.foto_url }} 
                style={tabsStyles.progressImage} 
            />
            <View style={tabsStyles.progressDetails}>
                <Text style={tabsStyles.progressComment}>{item.comentarios}</Text>
                <Text style={tabsStyles.progressDate}>
                    <Ionicons name="calendar-outline" size={12} /> {new Date(item.created_at).toLocaleDateString()}
                </Text>
            </View>
        </View>
    );

    return (
        <ScrollView>
            {/* Planes Asignados */}
            <View style={tabsStyles.contentBox}>
                <Text style={tabsStyles.title}>Mis Planes</Text>
                {loadingPlans ? (
                    <ActivityIndicator size="small" />
                ) : (
                    <FlatList
                        data={plans}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderPlanItem}
                        ListEmptyComponent={<Text style={tabsStyles.subtitle}>No tienes planes asignados.</Text>}
                        scrollEnabled={false}
                    />
                )}
            </View>

            {/* Registrar Progreso */}
            <View style={tabsStyles.contentBox}>
                <Text style={tabsStyles.title}>Registrar Progreso</Text>
                <TextInput
                    style={tabsStyles.progressInput}
                    placeholder="Añade comentarios o métricas del día..."
                    value={comment}
                    onChangeText={setComment}
                    multiline
                />
                
                {imageUri && (
                    <Image 
                        source={{ uri: imageUri }} 
                        style={tabsStyles.progressImagePreview} 
                    />
                )}

                <TouchableOpacity
                    style={[tabsStyles.linkButton, { marginBottom: 10, flexDirection: 'row', justifyContent: 'center', gap: 10 }]}
                    onPress={handlePickImage}
                >
                    <Ionicons name="camera-outline" size={20} color="white" />
                    <Text style={tabsStyles.linkButtonText}>{imageUri ? "Cambiar Foto" : "Seleccionar Foto"}</Text>
                </TouchableOpacity>

                <Button
                    title={isSubmittingProgress ? "Guardando..." : "Guardar Progreso"}
                    onPress={handleSubmitProgress}
                    disabled={isSubmittingProgress || !imageUri}
                    // 🟢 CORRECCIÓN: Usamos el objeto ColorPalette.secondary para el color verde
                    color={ColorPalette.secondary} 
                />
            </View>

            {/* Historial de Progreso */}
            <View style={tabsStyles.contentBox}>
                <Text style={tabsStyles.title}>Historial</Text>
                {loadingProgress ? (
                    <ActivityIndicator size="small" />
                ) : (
                    <FlatList
                        data={progressList}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderProgressItem}
                        ListEmptyComponent={<Text style={tabsStyles.subtitle}>Aún no hay registros de progreso.</Text>}
                        scrollEnabled={false}
                        refreshing={loadingProgress}
                        onRefresh={refetchProgress}
                    />
                )}
            </View>
        </ScrollView>
    );
}