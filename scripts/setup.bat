@echo off
REM ============================================================
REM Setup Script - Portfolio Application (Windows)
REM Instala todo lo necesario para ejecutar el proyecto
REM ============================================================

set BASE_DIR=%~dp0..
cd /d "%BASE_DIR%"

echo 🚀 Iniciando instalación de Portfolio desde %CD%...

REM 1. Crear .env desde .env.example si no existe
if not exist .env (
    echo 📄 Creando archivo .env desde .env.example...
    copy .env.example .env
    echo ⚠️  Por favor, revisa el archivo .env y configura tus secretos.
)

REM 2. Instalar dependencias del Backend
echo 📦 Instalando dependencias del Backend...
cd backend
call npm install
cd ..

REM 3. Instalar dependencias del Frontend
echo 📦 Instalando dependencias del Frontend...
cd frontend
call npm install
cd ..

REM 4. Iniciar base de datos y correr migraciones (si docker-compose está activo)
echo 🐳 Si tienes Docker corriendo, puedes ejecutar: docker-compose up -d

echo ✅ Instalación completada exitosamente.
echo ➡️  Para iniciar servidor dev del Backend: cd backend ^& npm run dev
echo ➡️  Para iniciar servidor dev del Frontend: cd frontend ^& npm run dev
pause
