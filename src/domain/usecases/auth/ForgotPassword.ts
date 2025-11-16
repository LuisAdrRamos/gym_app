import { AuthRepository } from "../../repositories/AuthRepository";

export class ForgotPassword {
    constructor(private authRepository: AuthRepository) { }

    async execute(email: string): Promise<void> {
        // 1. VALIDACIÓN
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new Error("El formato del email no es válido.");
        }

        // 2. Llama al repositorio
        return this.authRepository.forgotPassword(email);
    }
}