import { StyleSheet } from 'react-native';

// Definimos una paleta de colores base para los estilos de autenticación
const colors = {
    primary: '#007AFF', // Azul de iOS
    background: '#F5F5F7', // Fondo claro
    card: '#FFFFFF', // Fondo de tarjetas/inputs
    text: '#333333',
    textSecondary: '#666666',
    border: '#DDDDDD',
    success: '#34C759',
    danger: '#FF3B30',
};

export const authStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 30,
        backgroundColor: colors.background,
    },
    content: {
        backgroundColor: colors.card,
        padding: 20,
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
        color: colors.text,
    },
    subtitle: {
        fontSize: 16,
        marginBottom: 30,
        textAlign: 'center',
        color: colors.textSecondary,
    },
    input: {
        height: 50,
        borderColor: colors.border,
        borderWidth: 1,
        borderRadius: 10,
        marginBottom: 15,
        paddingHorizontal: 15,
        fontSize: 16,
        backgroundColor: colors.card,
        color: colors.text,
    },
    button: {
        backgroundColor: colors.primary,
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: colors.card,
        fontSize: 18,
        fontWeight: 'bold',
    },
    linkButton: {
        marginTop: 15,
        padding: 5,
    },
    linkText: {
        textAlign: 'center',
        color: colors.primary,
        fontSize: 15,
    },
    // Estilos de Rol (para Registro)
    roleLabel: {
        fontSize: 16,
        marginBottom: 10,
        fontWeight: '600',
        color: colors.text,
    },
    roleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
        backgroundColor: colors.border, // Fondo gris para el picker/botones de rol
        borderRadius: 10,
        padding: 5,
    },
    roleButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    roleButtonSelected: {
        backgroundColor: colors.card, // Blanco para la opción seleccionada
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    roleText: {
        color: colors.textSecondary,
        fontWeight: '500',
        fontSize: 16,
    },
    roleTextSelected: {
        color: colors.primary,
        fontWeight: 'bold',
    },
});