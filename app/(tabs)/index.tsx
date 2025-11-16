import { View, Text, ActivityIndicator, ScrollView } from 'react-native';
import React from 'react';
import { useAuth } from '../../src/presentation/hooks/useAuth';
import { tabsStyles } from '../../src/presentation/styles/tabsStyles';
import TrainerDashboard from './TrainerDashboard'; // Componentes que crearemos en la raíz de tabs
import UserDashboard from './UserDashboard';

export default function DashboardScreen() {
    const { user, role, loading } = useAuth();

    if (loading || !user) {
        return (
            <View style={tabsStyles.centered}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    // El nombre se toma del perfil, si existe
    const userName = user.name || user.email;

    return (
        <View style={tabsStyles.container}>
            <View style={tabsStyles.dashboardHeader}>
                <View>
                    <Text style={tabsStyles.welcomeText}>¡Hola, {userName}!</Text>
                    <Text style={tabsStyles.roleBadge}>Rol: {role}</Text>
                </View>
            </View>

            {role === 'Entrenador' ? (
                // TrainerDashboard usa FlatList, no necesita ScrollView externa.
                <TrainerDashboard user={user} />
            ) : (
                // UserDashboard debe asegurarse de usar su propia ScrollView interna.
                <UserDashboard user={user} />
            )}
        </View>
    );
}