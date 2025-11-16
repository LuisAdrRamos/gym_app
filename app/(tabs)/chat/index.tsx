import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, Pressable, Alert } from 'react-native';
import { Link } from 'expo-router';
import { useAuth } from '../../../src/presentation/hooks/useAuth';
import { useTraining } from '../../../src/presentation/hooks/useTraining';
import { tabsStyles, ColorPalette } from '../../../src/presentation/styles/tabsStyles';
import { Ionicons } from '@expo/vector-icons';

export default function ChatListScreen() {
    const { user: currentUser } = useAuth();
    // 🟢 CORRECCIÓN: usersList ya está disponible en el hook
    const { usersList, loading: loadingUsers, fetchUsersForAssignment } = useTraining();
    const [users, setUsers] = useState<typeof usersList>([]);

    useEffect(() => {
        // Filtramos para mostrar a todos EXCEPTO a mí mismo
        if (usersList.length > 0 && currentUser) {
            // Nota: usersList solo trae rol 'Usuario'. Si queremos entrenadores, hay que recargar.
            // Para el deber, asumiremos que usersList incluye a todos los perfiles visibles.
            const otherUsers = usersList.filter(u => u.id !== currentUser.id);
            setUsers(otherUsers);
        }
    }, [usersList, currentUser]);

    // Ejecutamos la carga al montar, asegurando que se cargue la lista de perfiles
    useEffect(() => {
        fetchUsersForAssignment();
    }, [fetchUsersForAssignment]);


    if (loadingUsers || !currentUser) {
        return <ActivityIndicator style={tabsStyles.centered} size="large" />;
    }

    // ... (renderUserItem y return de la vista son correctos) ...
    const renderUserItem = ({ item }: { item: typeof usersList[0] }) => (
        <Link
            href={{
                pathname: "/(tabs)/chat/[receiverId]",
                params: { receiverId: item.id, receiverName: item.name || item.email }
            }}
            asChild
        >
            <Pressable style={tabsStyles.routineItem}>
                <View>
                    <Text style={tabsStyles.routineName}>{item.name || item.email}</Text>
                    <Text style={{ fontSize: 12, color: ColorPalette.textSecondary }}>
                        Rol: {item.role}
                    </Text>
                </View>
                <Ionicons name="chatbox-outline" size={24} color={ColorPalette.primary} />
            </Pressable>
        </Link>
    );

    return (
        <View style={tabsStyles.container}>
            <FlatList
                data={users}
                keyExtractor={(item) => item.id}
                renderItem={renderUserItem}
                contentContainerStyle={{ paddingHorizontal: 20 }}
                ListEmptyComponent={<Text style={tabsStyles.subtitle}>No hay otros usuarios para chatear.</Text>}
            />
        </View>
    );
}