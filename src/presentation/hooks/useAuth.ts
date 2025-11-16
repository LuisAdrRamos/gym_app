import { createContext, useContext, useEffect, useState } from 'react';
import { User, UserRole } from '@/src/domain/entities/User';
import { container } from '@/src/di/container';
import { Alert } from 'react-native';

/**
 * Define la estructura del Contexto de Autenticación (el contrato).
 */
interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    role: UserRole | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    register: (email: string, password: string, name: string, role: UserRole) => Promise<{ success: boolean; error?: string }>;
    logout: () => Promise<void>;
    forgotPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
}

// 1. Creamos y exportamos el Contexto (SIN JSX, solo la referencia)
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 2. Este es el hook que contendrá el ViewModel y la lógica de negocio
export const useAuthManager = (): AuthContextType => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // --- MÉTODOS DE AUTENTICACIÓN (Llaman a los Use Cases) ---

    const login = async (email: string, password: string) => {
        try {
            await container.loginUser.execute(email, password);
            return { success: true };
        } catch (error: any) {
            Alert.alert("Error de Login", error.message);
            return { success: false, error: error.message };
        }
    };

    const register = async (email: string, password: string, name: string, role: UserRole) => {
        try {
            await container.registerUser.execute(email, password, name, role);
            return { success: true };
        } catch (error: any) {
            Alert.alert("Error de Registro", error.message);
            return { success: false, error: error.message };
        }
    };

    const logout = async () => {
        try {
            await container.logoutUser.execute();
        } catch (error: any) {
            Alert.alert("Error de Logout", error.message);
        }
    };

    const forgotPassword = async (email: string) => {
        try {
            await container.forgotPassword.execute(email);
            return { success: true };
        } catch (error: any) {
            Alert.alert("Error", error.message);
            return { success: false, error: error.message };
        }
    };

    // --- EFECTO DE SUSCRIPCIÓN ---
    useEffect(() => {
        const unsubscribe = container.authRepository.onAuthStateChange((userFromAuth) => {
            setUser(userFromAuth);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    // --- Valores de retorno ---
    return {
        user,
        isAuthenticated: !!user,
        role: user?.role || null,
        loading,
        login,
        register,
        logout,
        forgotPassword,
    };
};

// 3. Hook Consumidor (este es el que se usa en las vistas .tsx)
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        // Alerta o error que indica que el hook no está envuelto
        throw new Error("useAuth debe usarse dentro de un AuthProvider (definido en _layout.tsx)");
    }
    return context;
};