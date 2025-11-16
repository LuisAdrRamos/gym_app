import { AuthRepository } from "../../repositories/AuthRepository";
import { User } from "../../entities/User";

export class LoginUser {
    constructor(private authRepository: AuthRepository) { }

    async execute(email: string, password: string): Promise<User> {

        // 1. VALIDACIONES DE NEGOCIO
        if (!email || !password) {
            throw new Error("Email y contraseña son requeridos.");
        }

        // No es necesario validar el formato aquí si el AuthProvider lo hace,
        // pero lo mantenemos por seguridad.
        if (!email.includes("@")) {
            throw new Error("Email inválido.");
        }

        // 2. Llama al Repositorio para ejecutar la acción
        return this.authRepository.login(email, password);
    }
}