import { StyleSheet } from 'react-native';

const colors = {
    primary: '#007AFF',
    secondary: '#34C759',
    background: '#F5F5F7',
    card: '#FFFFFF',
    text: '#333333',
    textSecondary: '#666666',
    border: '#DDDDDD',
    danger: '#FF3B30',
    info: '#1DA1F2', // Azul claro para el chat
};

export const ColorPalette = colors;

export const tabsStyles = StyleSheet.create({
    // --- Estilos generales ---
    container: { flex: 1, backgroundColor: colors.background, paddingTop: 20 },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    title: { fontSize: 24, fontWeight: 'bold', color: colors.text, marginBottom: 10 },
    subtitle: { fontSize: 16, color: colors.textSecondary, marginBottom: 20 },

    // --- Dashboard General (index.tsx) ---
    dashboardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    welcomeText: { fontSize: 18, fontWeight: '600', color: colors.text },
    roleBadge: {
        fontSize: 12,
        color: colors.primary,
        fontWeight: 'bold',
        marginTop: 4
    },
    contentBox: {
        backgroundColor: colors.card,
        marginHorizontal: 20,
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    divider: { height: 1, backgroundColor: colors.border, marginVertical: 15 },

    // --- Dashboard del Entrenador ---
    routineItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    routineName: { fontSize: 16, fontWeight: 'bold', color: colors.text },
    videoLink: { color: colors.secondary, fontSize: 12, marginTop: 4 },
    uploadButton: {
        backgroundColor: colors.secondary, // Usa colors.secondary
        padding: 8,
        borderRadius: 5,
        alignItems: 'center',
        marginVertical: 4,
    },
    uploadButtonText: { color: colors.card, fontSize: 12, fontWeight: 'bold' },
    linkButton: {
        backgroundColor: colors.primary, // Usa colors.primary
        padding: 8,
        borderRadius: 5,
        alignItems: 'center',
    },
    linkButtonText: { color: colors.card, fontSize: 14, fontWeight: 'bold' },

    // --- Dashboard del Usuario ---
    planItem: {
        backgroundColor: '#E6F7FF',
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
        borderLeftWidth: 5,
        borderLeftColor: colors.info,
    },
    planName: { fontSize: 16, fontWeight: 'bold', color: colors.info },
    planDates: { fontSize: 14, color: colors.textSecondary, marginTop: 4 },
    progressInput: {
        height: 80,
        borderColor: colors.border,
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
        textAlignVertical: 'top',
        backgroundColor: colors.card,
        color: colors.text,
    },
    progressImagePreview: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        marginVertical: 10,
        backgroundColor: colors.border,
    },

    // --- Historial de Progreso ---
    progressHistoryItem: {
        flexDirection: 'row',
        backgroundColor: colors.card,
        padding: 10,
        borderRadius: 10,
        marginBottom: 10,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.border,
    },
    progressImage: {
        width: 50,
        height: 50,
        borderRadius: 5,
        marginRight: 10,
    },
    progressDetails: { flex: 1 },
    progressComment: { fontSize: 14, fontWeight: 'bold' },
    progressDate: { fontSize: 12, color: colors.textSecondary },

    // --- Asignar Plan (assign-plan.tsx) ---
    formContainer: { padding: 20, backgroundColor: colors.card, flex: 1 },
    pickerContainer: {
        borderColor: colors.border,
        borderWidth: 1,
        borderRadius: 10,
        marginBottom: 15,
        overflow: 'hidden',
    },
    picker: { height: 50, width: '100%' },

});