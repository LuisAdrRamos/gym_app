import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View, ScrollView, Alert } from 'react-native';
import { useAuth } from '../../src/presentation/hooks/useAuth';
import { authStyles } from '../../src/presentation/styles/authStyles';

export default function ForgotPasswordScreen() {
    const [email, setEmail] = useState('');
    const { forgotPassword, loading } = useAuth();
    const router = useRouter();

    const handlePasswordReset = async () => {
        if (!email) return Alert.alert("Error", "Ingresa tu email.");

        const result = await forgotPassword(email);

        if (result.success) {
            Alert.alert(
                "Email Enviado",
                "Si existe una cuenta con ese email, recibirás un enlace para restablecer tu contraseña.",
                [{ text: "OK", onPress: () => router.back() }]
            );
        }
        // Si falla, el hook ya muestra un Alert.
    };

    return (
        <KeyboardAvoidingView
            style={authStyles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
                <View style={authStyles.content}>
                    <Text style={authStyles.title}>Recuperar Contraseña</Text>
                    <Text style={authStyles.subtitle}>
                        Ingresa tu email para recibir un enlace de recuperación.
                    </Text>

                    <TextInput
                        style={authStyles.input}
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />

                    <TouchableOpacity
                        style={[authStyles.button, loading && { opacity: 0.5 }]}
                        onPress={handlePasswordReset}
                        disabled={loading || !email}
                    >
                        {loading ? (
                            <ActivityIndicator color={authStyles.buttonText.color} />
                        ) : (
                            <Text style={authStyles.buttonText}>Enviar Email</Text>
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