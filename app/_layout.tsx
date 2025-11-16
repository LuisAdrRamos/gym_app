import { Slot, useRouter, useSegments } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { AuthContext, useAuthManager, useAuth } from '../src/presentation/hooks/useAuth';

// Componente AuthProvider (JSX)
const AuthProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
    const contextValue = useAuthManager();
    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

// Componente que usa el hook useAuth y maneja la lógica de redirección
function InitialLayout() {
    const { isAuthenticated, loading } = useAuth();
    const router = useRouter();
    const segments = useSegments();

    useEffect(() => {
        if (loading) return;

        const inAuthGroup = segments[0] === 'auth';

        if (!isAuthenticated && !inAuthGroup) {
            router.replace('/auth/login');
        }
        else if (isAuthenticated && inAuthGroup) {
            // 🟢 CORRECCIÓN DE RUTA: Redirige al grupo raíz de pestañas
            router.replace('/(tabs)');
        }

    }, [isAuthenticated, loading, segments, router]);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    return <Slot />;
}

export default function RootLayout() {
    return (
        <AuthProvider>
            <InitialLayout />
        </AuthProvider>
    );
}