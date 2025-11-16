// src/data/services/supabaseCliente.ts
import { createClient} from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Obtenemos las variables de entorno
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY

// Validamos la existencia de las variables de entorno
if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Faltan las varibles de entorno de Supabase");
};

// Creamos el cliente de supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: AsyncStorage, // Usamos AsyncStorage para persistir la sesión en React Native
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});