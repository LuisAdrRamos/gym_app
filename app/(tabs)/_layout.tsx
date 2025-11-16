import { Tabs } from 'expo-router';
import React from 'react';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../src/presentation/hooks/useAuth';
import { Button, Alert } from 'react-native';

export default function TabsLayout() {
    const { logout } = useAuth();
    const handleLogout = async () => {
        Alert.alert(
            "Cerrar Sesión",
            "¿Estás seguro de que deseas cerrar sesión?",
            [
                { text: "Cancelar", style: "cancel" },
                { text: "Cerrar", style: "destructive", onPress: () => logout() }
            ]
        );
    };

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: '#007AFF',
                headerStyle: { backgroundColor: '#FFFFFF' },
                headerTintColor: '#333333',
                headerRight: () => (
                    <Button
                        onPress={handleLogout}
                        title="Salir"
                        color="#FF3B30"
                    />
                ),
                headerTitleStyle: { fontWeight: 'bold' }
            }}
        >
            {/* 1. DASHBOARD DINÁMICO (Contiene TrainerDashboard/UserDashboard) */}
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Dashboard',
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome name="dashboard" size={size} color={color} />
                    ),
                }}
            />

            {/* 2. LISTA DE CONTACTOS DE CHAT */}
            <Tabs.Screen
                name="chat"
                options={{
                    title: 'Chat',
                    headerShown: true,
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="chatbubbles" size={size} color={color} />
                    ),
                }}
            />

            {/* 3. PERFIL */}
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Perfil',
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome name="user" size={size} color={color} />
                    ),
                    headerShown: true,
                }}
            />

            {/* RUTAS OCULTAS QUE NO DEBEN SER PESTAÑAS */}
            <Tabs.Screen name="assign-plan" options={{ href: null, headerShown: false, title: 'Asignar Plan' }} />
            <Tabs.Screen name="TrainerDashboard" options={{ href: null, headerShown: false }} />
            <Tabs.Screen name="UserDashboard" options={{ href: null, headerShown: false }} />
            <Tabs.Screen name="chat/[receiverId]" options={{ href: null, headerShown: true }} />
        </Tabs>
    );
}