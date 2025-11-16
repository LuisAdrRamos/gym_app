import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '../../src/presentation/hooks/useAuth';
import { useTraining } from '../../src/presentation/hooks/useTraining';
import { tabsStyles, ColorPalette } from '../../src/presentation/styles/tabsStyles';
import { Picker } from '@react-native-picker/picker';
import { CreatePlanData } from '@/src/domain/entities/PlanEntrenamiento';

export default function AssignPlanScreen() {
    const { user } = useAuth();
    const router = useRouter();
    const { routineId, routineName } = useLocalSearchParams<{ routineId: string, routineName: string }>();

    const { usersList, loading: loadingUsers, assignPlan } = useTraining();

    // 🟢 CORRECCIÓN 1: Inicializamos a cadena vacía para compatibilidad con Picker
    const [selectedUserId, setSelectedUserId] = useState<string | null>('');
    const [planName, setPlanName] = useState(`Plan: ${routineName || ''}`);
    const [startDate, setStartDate] = useState(''); // YYYY-MM-DD
    const [endDate, setEndDate] = useState('');     // YYYY-MM-DD

    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        // Inicializa el selectedUserId con el primer usuario de la lista si está vacío
        if ((!selectedUserId || selectedUserId === '') && usersList.length > 0) {
            setSelectedUserId(usersList[0].id);
        }
    }, [usersList, selectedUserId]);

    // --- Lógica de envío ---
    const handleAssignPlan = async () => {
        if (!user || !selectedUserId || !routineId || !planName || !startDate || !endDate) {
            Alert.alert("Error", "Por favor, complete todos los campos.");
            return;
        }

        setIsSubmitting(true);
        const data: CreatePlanData = {
            entrenador_id: user.id,
            usuario_id: selectedUserId,
            nombre: planName,
            fecha_inicio: startDate,
            fecha_fin: endDate,
        };

        const result = await assignPlan(data);

        if (result.success) {
            router.back();
        }
        setIsSubmitting(false);
    };

    if (loadingUsers) {
        return <ActivityIndicator style={tabsStyles.centered} size="large" />;
    }

    return (
        <ScrollView style={tabsStyles.formContainer}>
            <Text style={tabsStyles.title}>Asignar Rutina</Text>
            <Text style={tabsStyles.subtitle}>Rutina: {routineName}</Text>

            <Text style={tabsStyles.subtitle}>Nombre del Plan:</Text>
            <TextInput
                style={tabsStyles.progressInput}
                value={planName}
                onChangeText={setPlanName}
                placeholder="Ej: Plan de Pecho 4 Semanas"
            />

            <Text style={tabsStyles.subtitle}>Asignar a Usuario:</Text>
            <View style={tabsStyles.pickerContainer}>
                <Picker
                    // 🟢 CORRECCIÓN 2: selectedValue ahora es string o undefined (casteamos para el Picker)
                    selectedValue={(selectedUserId as string) || undefined}
                    // 🟢 CORRECCIÓN 3: Tipado explícito de itemValue (ya resuelto)
                    onValueChange={(itemValue: string) => setSelectedUserId(itemValue)}
                    style={tabsStyles.picker}
                >
                    {usersList.length === 0 ? (
                        <Picker.Item label="No hay usuarios para asignar" value="" enabled={false} />
                    ) : (
                        usersList.map((u) => (
                            <Picker.Item
                                key={u.id}
                                label={`${u.name || u.email}`}
                                value={u.id} // El valor siempre es string
                            />
                        ))
                    )}
                </Picker>
            </View>

            <Text style={tabsStyles.subtitle}>Fecha de Inicio (YYYY-MM-DD):</Text>
            <TextInput
                style={tabsStyles.progressInput}
                value={startDate}
                onChangeText={setStartDate}
                placeholder="YYYY-MM-DD"
                keyboardType="numeric"
            />

            <Text style={tabsStyles.subtitle}>Fecha de Fin (YYYY-MM-DD):</Text>
            <TextInput
                style={tabsStyles.progressInput}
                value={endDate}
                onChangeText={setEndDate}
                placeholder="YYYY-MM-DD"
                keyboardType="numeric"
            />

            <View style={{ marginTop: 20 }}>
                <Button
                    title={isSubmitting ? "Asignando..." : "Asignar Plan"}
                    onPress={handleAssignPlan}
                    disabled={isSubmitting || usersList.length === 0 || !selectedUserId}
                    color={ColorPalette.primary}
                />
            </View>
        </ScrollView>
    );
}