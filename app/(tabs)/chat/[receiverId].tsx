import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    FlatList,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Alert,
    Button,
    // 🟢 CORRECCIÓN: Importar StyleSheet
    StyleSheet
} from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useAuth } from '../../../src/presentation/hooks/useAuth';
import { useChat } from '../../../src/presentation/hooks/useChat';
import { Mensaje } from '@/src/domain/entities/Mensaje';
import { tabsStyles, ColorPalette } from '../../../src/presentation/styles/tabsStyles';
import { Ionicons } from '@expo/vector-icons';

export default function ConversationScreen() {
    const { user: currentUser } = useAuth();
    const navigation = useNavigation();
    const { receiverId, receiverName } = useLocalSearchParams<{ receiverId: string, receiverName: string }>();
    const flatListRef = useRef<FlatList>(null);
    const [messageText, setMessageText] = useState('');

    const { messages, loading, sendMessage, currentUserId } = useChat(receiverId);

    // Ajustar el título de la navegación
    useEffect(() => {
        if (receiverName) {
            navigation.setOptions({ title: receiverName });
        }
    }, [receiverName, navigation]);

    // Auto-scroll cuando llegan nuevos mensajes
    useEffect(() => {
        if (messages.length > 0) {
            flatListRef.current?.scrollToEnd({ animated: true });
        }
    }, [messages]);

    const handleSendMessage = async () => {
        if (messageText.trim() === '') return;

        const content = messageText.trim();
        setMessageText(''); // Limpiar inmediatamente

        const result = await sendMessage(content);
        if (!result.success) {
            Alert.alert("Error", "No se pudo enviar el mensaje.");
            setMessageText(content); // Restaurar si falla
        }
    };

    const renderMessage = ({ item }: { item: Mensaje }) => {
        const isMine = item.sender_id === currentUserId;

        return (
            <View
                style={[
                    styles.messageBubble,
                    isMine ? styles.myMessage : styles.theirMessage,
                    { backgroundColor: isMine ? ColorPalette.primary : ColorPalette.card }
                ]}
            >
                <Text style={{ color: isMine ? 'white' : ColorPalette.text }}>
                    {item.content}
                </Text>
                <Text style={styles.timestamp}>
                    {new Date(item.created_at).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                </Text>
            </View>
        );
    };

    if (loading) {
        return <ActivityIndicator style={tabsStyles.centered} size="large" />;
    }

    return (
        <KeyboardAvoidingView
            style={tabsStyles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
            <FlatList
                ref={flatListRef}
                data={messages}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderMessage}
                contentContainerStyle={styles.listContent}
            />

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.messageInput}
                    placeholder="Escribe un mensaje..."
                    value={messageText}
                    onChangeText={setMessageText}
                    multiline
                />
                <Button
                    title="Enviar"
                    onPress={handleSendMessage}
                    disabled={messageText.trim() === ''}
                    color={ColorPalette.primary}
                />
            </View>
        </KeyboardAvoidingView>
    );
}

// Estilos específicos para la conversación (similares a los de tabsStyles)
const styles = StyleSheet.create({ // <-- El error se resuelve con el import de StyleSheet
    listContent: {
        padding: 10,
    },
    messageBubble: {
        padding: 10,
        borderRadius: 15,
        maxWidth: '80%',
        marginVertical: 4,
        minWidth: 80,
    },
    myMessage: {
        alignSelf: 'flex-end',
    },
    theirMessage: {
        alignSelf: 'flex-start',
        borderWidth: 1,
        borderColor: ColorPalette.border,
    },
    timestamp: {
        fontSize: 10,
        alignSelf: 'flex-end',
        color: 'rgba(255, 255, 255, 0.7)',
        marginTop: 3,
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 10,
        borderTopWidth: 1,
        borderTopColor: ColorPalette.border,
        backgroundColor: ColorPalette.card,
        alignItems: 'center',
    },
    messageInput: {
        flex: 1,
        maxHeight: 100,
        minHeight: 40,
        borderWidth: 1,
        borderColor: ColorPalette.border,
        borderRadius: 20,
        paddingHorizontal: 15,
        marginRight: 10,
        backgroundColor: ColorPalette.background,
        color: ColorPalette.text,
    },
});