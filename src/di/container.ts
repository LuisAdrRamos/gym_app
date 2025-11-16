import { AuthRepository } from '../domain/repositories/AuthRepository';
import { IRoutineRepository } from '../domain/repositories/IRoutineRepository';
import { ITrainingPlanRepository } from '../domain/repositories/ITrainingPlanRepository';
import { IProgressRepository } from '../domain/repositories/IProgressRepository';
import { IStorageRepository } from '../domain/repositories/IStorageRepository';
import { IMessageRepository } from '../domain/repositories/IMessageRepository';

// --- CASOS DE USO DE AUTH ---
import { RegisterUser } from '../domain/usecases/auth/RegisterUser';
import { LoginUser } from '../domain/usecases/auth/LoginUser';
import { LogoutUser } from '../domain/usecases/auth/LogoutUser';
import { ForgotPassword } from '../domain/usecases/auth/ForgotPassword';
import { UpdateProfile } from '../domain/usecases/auth/UpdateProfile';
import { GetCurrentUser } from '../domain/usecases/auth/GetCurrentUser';

// --- CASOS DE USO DE TRAINING ---
import { CreateRutina } from '../domain/usecases/training/CreateRutina';
import { GetRoutinesByTrainer } from '../domain/usecases/training/GetRutinesByTrainer';
import { GetAllUsersForAssignment } from '../domain/usecases/training/GetAllUsersForAssigment';
import { AssignTrainingPlan } from '../domain/usecases/training/AssignTrainingPlan';
import { GetPlansForUser } from '../domain/usecases/training/GetPlansForUser';
import { GetTrainerForUser } from '../domain/usecases/training/GetTrainerForUser';

// --- CASOS DE USO DE CHAT (Próximos) ---
import { SendMensaje } from '../domain/usecases/chat/SendMensaje';
import { GetMessages } from '../domain/usecases/chat/GetMessages';
import { RegisterProgress } from '../domain/usecases/training/RegisterProgress';

// --- IMPLEMENTACIONES DE DATA ---
import { AuthRepositoryImpl } from '../data/repositories/AuthRepositoryImpl';
import { SupabaseRoutineRepository } from '../data/repositories/SupabaseRoutineRepository';
import { SupabaseTrainingPlanRepository } from '../data/repositories/SupabaseTrainingRepository';
import { SupabaseProgressRepository } from '../data/repositories/SupabaseProgressRepository';
import { SupabaseStorageRepository } from '../data/repositories/SupabaseStorageRepository';
import { SupabaseMessageRepository } from '../data/repositories/SupabaseMessageRepository';


class DIContainer {
    private static instance: DIContainer;

    // --- Instancias de Repositorios ---
    private _authRepository?: AuthRepository;
    private _routineRepository?: IRoutineRepository;
    private _planRepository?: ITrainingPlanRepository;
    private _progressRepository?: IProgressRepository;
    private _storageRepository?: IStorageRepository;
    private _messageRepository?: IMessageRepository;

    // --- Instancias de Casos de Uso ---
    private _registerUser?: RegisterUser;
    private _loginUser?: LoginUser;
    private _logoutUser?: LogoutUser;
    private _forgotPassword?: ForgotPassword;
    private _updateProfile?: UpdateProfile;
    private _getCurrentUser?: GetCurrentUser;

    private _createRutina?: CreateRutina;
    private _getRoutinesByTrainer?: GetRoutinesByTrainer;
    private _getAllUsersForAssignment?: GetAllUsersForAssignment;
    private _assignTrainingPlan?: AssignTrainingPlan;
    private _getPlansForUser?: GetPlansForUser;
    private _getTrainerForUser?: GetTrainerForUser;

    private _registerProgress?: RegisterProgress; // Nuevo

    private _sendMensaje?: SendMensaje;
    private _getMessages?: GetMessages;

    private constructor() { }

    static getInstance(): DIContainer {
        if (!DIContainer.instance) {
            DIContainer.instance = new DIContainer();
        }
        return DIContainer.instance;
    }

    // ====================================================
    // 1. GETTERS DE REPOSITORIOS (Data Layer)
    // ====================================================

    get authRepository(): AuthRepository {
        if (!this._authRepository) {
            this._authRepository = new AuthRepositoryImpl();
        }
        return this._authRepository;
    }

    get routineRepository(): IRoutineRepository {
        if (!this._routineRepository) {
            this._routineRepository = new SupabaseRoutineRepository();
        }
        return this._routineRepository;
    }

    get planRepository(): ITrainingPlanRepository {
        if (!this._planRepository) {
            this._planRepository = new SupabaseTrainingPlanRepository();
        }
        return this._planRepository;
    }

    get progressRepository(): IProgressRepository {
        if (!this._progressRepository) {
            this._progressRepository = new SupabaseProgressRepository();
        }
        return this._progressRepository;
    }

    get storageRepository(): IStorageRepository {
        if (!this._storageRepository) {
            this._storageRepository = new SupabaseStorageRepository();
        }
        return this._storageRepository;
    }

    get messageRepository(): IMessageRepository {
        if (!this._messageRepository) {
            this._messageRepository = new SupabaseMessageRepository();
        }
        return this._messageRepository;
    }

    // ====================================================
    // 2. GETTERS DE CASOS DE USO (Domain Layer)
    // ====================================================

    // --- AUTH ---
    get registerUser(): RegisterUser {
        if (!this._registerUser) {
            this._registerUser = new RegisterUser(this.authRepository);
        }
        return this._registerUser;
    }
    get loginUser(): LoginUser {
        if (!this._loginUser) { this._loginUser = new LoginUser(this.authRepository); }
        return this._loginUser;
    }
    get logoutUser(): LogoutUser {
        if (!this._logoutUser) { this._logoutUser = new LogoutUser(this.authRepository); }
        return this._logoutUser;
    }
    get forgotPassword(): ForgotPassword {
        if (!this._forgotPassword) { this._forgotPassword = new ForgotPassword(this.authRepository); }
        return this._forgotPassword;
    }
    get updateProfile(): UpdateProfile {
        if (!this._updateProfile) { this._updateProfile = new UpdateProfile(this.authRepository); }
        return this._updateProfile;
    }
    get getCurrentUser(): GetCurrentUser {
        if (!this._getCurrentUser) { this._getCurrentUser = new GetCurrentUser(this.authRepository); }
        return this._getCurrentUser;
    }

    // --- TRAINING (RUTINAS Y PLANES) ---
    get createRutina(): CreateRutina {
        if (!this._createRutina) {
            this._createRutina = new CreateRutina(this.routineRepository);
        }
        return this._createRutina;
    }

    get getRoutinesByTrainer(): GetRoutinesByTrainer {
        if (!this._getRoutinesByTrainer) {
            this._getRoutinesByTrainer = new GetRoutinesByTrainer(this.routineRepository);
        }
        return this._getRoutinesByTrainer;
    }

    get getAllUsersForAssignment(): GetAllUsersForAssignment {
        if (!this._getAllUsersForAssignment) {
            this._getAllUsersForAssignment = new GetAllUsersForAssignment(this.planRepository);
        }
        return this._getAllUsersForAssignment;
    }

    get assignTrainingPlan(): AssignTrainingPlan {
        if (!this._assignTrainingPlan) {
            this._assignTrainingPlan = new AssignTrainingPlan(this.planRepository);
        }
        return this._assignTrainingPlan;
    }

    get getPlansForUser(): GetPlansForUser {
        if (!this._getPlansForUser) {
            this._getPlansForUser = new GetPlansForUser(this.planRepository);
        }
        return this._getPlansForUser;
    }

    get getTrainerForUser(): GetTrainerForUser {
        if (!this._getTrainerForUser) {
            this._getTrainerForUser = new GetTrainerForUser(this.planRepository);
        }
        return this._getTrainerForUser;
    }

    // --- PROGRESS (NUEVO) ---
    get registerProgress(): RegisterProgress {
        if (!this._registerProgress) {
            // Este Use Case necesita el repositorio de progreso Y el de storage
            this._registerProgress = new RegisterProgress(this.progressRepository, this.storageRepository);
        }
        return this._registerProgress;
    }

    // --- CHAT ---
    get sendMensaje(): SendMensaje {
        if (!this._sendMensaje) {
            this._sendMensaje = new SendMensaje(this.messageRepository);
        }
        return this._sendMensaje;
    }
    get getMessages(): GetMessages {
        if (!this._getMessages) {
            this._getMessages = new GetMessages(this.messageRepository);
        }
        return this._getMessages;
    }
}

export const container = DIContainer.getInstance();