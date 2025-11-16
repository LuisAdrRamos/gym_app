#!/bin/bash
#
# Script para inicializar la estructura de carpetas de Clean Architecture
# para el Deber N°6 (GYM App) con Supabase.

set -e

echo "🚀 Creando la estructura de carpetas de Clean Architecture para GYM_APP..."

# 1. Crear la estructura principal de la capa de Lógica de Negocio (Domain)
mkdir -p src/domain/entities
mkdir -p src/domain/repositories
mkdir -p src/domain/usecases/auth
mkdir -p src/domain/usecases/training
mkdir -p src/domain/usecases/chat

# 2. Crear la estructura de la capa de Datos (Data)
mkdir -p src/data/datasources        # Clases que hablan con Supabase (Auth, DB, Storage)
mkdir -p src/data/repositories       # Implementaciones de Repositorios
mkdir -p src/data/services           # Cliente de Supabase

# 3. Crear la estructura de Inyección de Dependencias (DI)
mkdir -p src/di

# 4. Crear la estructura de la capa de Presentación (Presentation)
mkdir -p src/presentation/hooks      # ViewModels (useAuth, useChat, useTraining)
mkdir -p src/presentation/styles     # Temas y estilos globales

# 5. Crear la estructura de Vistas (App - Expo Router)
mkdir -p app/\(tabs\)
mkdir -p app/auth
mkdir -p app/training

echo "✨ Creando archivos base del Dominio..."

# --- ENTIDADES (MODELOS) ---
# Usuario y Tablas de la DB
touch src/domain/entities/User.ts
touch src/domain/entities/Rutina.ts
touch src/domain/entities/PlanEntrenamiento.ts
touch src/domain/entities/Progreso.ts
touch src/domain/entities/Mensaje.ts

# --- REPOSITORIOS (CONTRATOS/INTERFACES) ---
touch src/domain/repositories/AuthRepository.ts
touch src/domain/repositories/TrainingRepository.ts
touch src/domain/repositories/ChatRepository.ts

# --- CASOS DE USO (LÓGICA) ---
# Autenticación (Patrón reutilizado)
touch src/domain/usecases/auth/LoginUser.ts
touch src/domain/usecases/auth/RegisterUser.ts
touch src/domain/usecases/auth/LogoutUser.ts
touch src/domain/usecases/auth/ForgotPassword.ts
touch src/domain/usecases/auth/UpdateProfile.ts
touch src/domain/usecases/auth/GetCurrentUser.ts

# Entrenamiento (CRUD de rutinas y progreso)
touch src/domain/usecases/training/CreateRutina.ts
touch src/domain/usecases/training/GetRutinas.ts
touch src/domain/usecases/training/UpdateProgreso.ts

# Chat (Realtime)
touch src/domain/usecases/chat/SendMensaje.ts
touch src/domain/usecases/chat/GetMessages.ts


echo "✅ Estructura creada con éxito en el directorio 'src/' y 'app/'!"