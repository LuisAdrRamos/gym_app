import { View, Text, Button } from 'react-native';
import React from 'react';
import { useAuth } from '../../src/presentation/hooks/useAuth';

export default function ProfileScreen() {
    const { user, role, logout } = useAuth();

    return (
        <View style={{ flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5F5F7' }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>
                Pantalla de Perfil
            </Text>
            <Text style={{ fontSize: 16, marginBottom: 5 }}>
                Email: {user?.email}
            </Text>
            <Text style={{ fontSize: 16, marginBottom: 5 }}>
                Nombre: {user?.name}
            </Text>
            <Text style={{ fontSize: 16, marginBottom: 30 }}>
                Rol: {role || 'Cargando...'}
            </Text>
            <Button
                title="Cerrar Sesión"
                onPress={logout}
                color="#FF3B30"
            />
        </View>
    );
}