export type UserRole = 'Entrenador' | 'Usuario';

export interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole; // <-- El diferenciador clave
    avatar_url?: string;
}