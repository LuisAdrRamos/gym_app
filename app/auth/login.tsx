import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View, ScrollView } from 'react-native';
import { useAuth } from '../../src/presentation/hooks/useAuth';
import { authStyles } from '../../src/presentation/styles/authStyles';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, loading } = useAuth();
    const router = useRouter();

    const handleLogin = async () => {
        if (!email || !password) return;

        // El hook 'login' llama al UseCase e internamente muestra el Alert en caso de error.
        const result = await login(email, password);

        if (result.success) {
            // El _layout.tsx se encarga de la redirección automática a /(tabs)
            // No hacemos nada aquí.
        }
    };

    return (
        <KeyboardAvoidingView
            style={authStyles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
                <View style={authStyles.content}>
                    <Text style={authStyles.title}>GYM App</Text>
                    <Text style={authStyles.subtitle}>Inicia Sesión</Text>

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
                        placeholder="Contraseña"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />

                    <TouchableOpacity
                        style={authStyles.linkButton}
                        onPress={() => router.push('/auth/forgotPassword')}
                    >
                        <Text style={authStyles.linkText}>¿Olvidaste tu contraseña?</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[authStyles.button, loading && { opacity: 0.5 }]}
                        onPress={handleLogin}
                        disabled={loading || !email || !password}
                    >
                        {loading ? (
                            <ActivityIndicator color={authStyles.buttonText.color} />
                        ) : (
                            <Text style={authStyles.buttonText}>Entrar</Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={authStyles.linkButton}
                        onPress={() => router.push('/auth/register')}
                    >
                        <Text style={authStyles.linkText}>¿No tienes cuenta? Regístrate</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}