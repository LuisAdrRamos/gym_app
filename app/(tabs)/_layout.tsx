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
                // 🟢 MOVEMOS EL BOTÓN SALIR AL HEADER DERECHO DEL GRUPO TABS
                headerRight: () => (
                    <Button
                        onPress={handleLogout}
                        title="Salir"
                        color="#FF3B30"
                    />
                ),
                headerTitleStyle: { fontWeight: 'bold' },
                headerShown: true, // Aseguramos que todas las pestañas tengan el header de SALIR
            }}
        >
            {/* 1. DASHBOARD (Ruta index.tsx) */}
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Dashboard',
                    // Permitimos que el header se muestre para que el botón Salir sea visible
                    // Aunque la vista index.tsx no tiene un título propio, el layout le da 'Dashboard'.
                    headerShown: true,
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome name="dashboard" size={size} color={color} />
                    ),
                }}
            />

            {/* 2. CHAT (Ruta chat/index.tsx) */}
            <Tabs.Screen
                // La ruta base es la carpeta 'chat', Expo busca chat/index.tsx
                name="chat"
                options={{
                    title: 'Chat',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="chatbubbles" size={size} color={color} />
                    ),
                    // headerShown: true se hereda de screenOptions
                }}
            />

            {/* 3. PERFIL (Ruta profile.tsx) */}
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Perfil',
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome name="user" size={size} color={color} />
                    ),
                    // headerShown: true se hereda de screenOptions
                }}
            />

            {/* RUTAS OCULTAS QUE NO DEBEN SER PESTAÑAS (Componentes / Vistas Secundarias) */}

            {/* Las rutas TrainerDashboard.tsx y UserDashboard.tsx son componentes, se ocultan: */}
            <Tabs.Screen name="TrainerDashboard" options={{ href: null, headerShown: false }} />
            <Tabs.Screen name="UserDashboard" options={{ href: null, headerShown: false }} />

            {/* assign-plan.tsx (Vista modal/secundaria) */}
            <Tabs.Screen name="assign-plan" options={{ href: null, headerShown: true, title: 'Asignar Plan' }} />

            {/* chat/[receiverId].tsx (Vista dinámica de conversación) */}
            <Tabs.Screen name="chat/[receiverId]" options={{ href: null, headerShown: true }} />
        </Tabs>
    );
}