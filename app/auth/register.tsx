import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View, ScrollView } from 'react-native';
import { useAuth } from '../../src/presentation/hooks/useAuth';
import { authStyles } from '../../src/presentation/styles/authStyles';
import { UserRole } from '../../src/domain/entities/User'; // Importar el tipo de rol

export default function RegisterScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState(''); // Estado para el nombre (obligatorio)
    const [role, setRole] = useState<UserRole>('Usuario'); // Estado para el rol (default: Usuario)
    const { register, loading } = useAuth();
    const router = useRouter();

    const handleRegister = async () => {
        if (!email || !password || !name || !role) return;

        const result = await register(email, password, name, role);

        if (result.success) {
            // Éxito: Se muestra el Alert desde el hook, y el _layout.tsx redirige.
            router.replace('/auth/login'); // En la práctica, vamos a login para que el usuario confirme su email
        }
    };

    const isButtonDisabled = loading || !email || !password || !name || !role || name.length < 2 || password.length < 6;

    return (
        <KeyboardAvoidingView
            style={authStyles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
                <View style={authStyles.content}>
                    <Text style={authStyles.title}>Crear Cuenta</Text>
                    <Text style={authStyles.subtitle}>Únete como Entrenador o Usuario.</Text>

                    {/* Campo de Nombre */}
                    <TextInput
                        style={authStyles.input}
                        placeholder="Nombre completo"
                        value={name}
                        onChangeText={setName}
                        autoCapitalize="words"
                    />

                    <TextInput
                        style={authStyles.input}
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />

                    <TextInput
                        style={authStyles.input}
                        placeholder="Contraseña (mín. 6 caracteres)"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />

                    {/* Selector de Rol */}
                    <Text style={authStyles.roleLabel}>Selecciona tu rol:</Text>
                    <View style={authStyles.roleContainer}>
                        {/* Botón: Usuario */}
                        <TouchableOpacity
                            style={[authStyles.roleButton, role === 'Usuario' && authStyles.roleButtonSelected]}
                            onPress={() => setRole('Usuario')}
                        >
                            <Text style={role === 'Usuario' ? authStyles.roleTextSelected : authStyles.roleText}>Usuario</Text>
                        </TouchableOpacity>

                        {/* Botón: Entrenador */}
                        <TouchableOpacity
                            style={[authStyles.roleButton, role === 'Entrenador' && authStyles.roleButtonSelected]}
                            onPress={() => setRole('Entrenador')}
                        >
                            <Text style={role === 'Entrenador' ? authStyles.roleTextSelected : authStyles.roleText}>Entrenador</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={[authStyles.button, isButtonDisabled && { opacity: 0.5, backgroundColor: authStyles.input.borderColor }]}
                        onPress={handleRegister}
                        disabled={isButtonDisabled}
                    >
                        {loading ? (
                            <ActivityIndicator color={authStyles.buttonText.color} />
                        ) : (
                            <Text style={authStyles.buttonText}>Registrarme</Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={authStyles.linkButton}
                        onPress={() => router.back()}
                    >
                        <Text style={authStyles.linkText}>Volver a Iniciar Sesión</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}