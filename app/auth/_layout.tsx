import { Stack } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

export default function AuthLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false, // Ocultar el header para las pantallas de login/registro
            }}
        >
            {/* Las rutas dentro de 'auth/' */}
            <Stack.Screen name="login" />
            <Stack.Screen name="register" />
            <Stack.Screen name="forgotPassword" options={{ headerShown: true, title: 'Recuperar' }} />
        </Stack>
    );
}