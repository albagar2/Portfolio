#!/bin/bash
# ============================================================
# Setup Script - Portfolio Application (Linux/macOS)
# Instala todo lo necesario para ejecutar el proyecto
# ============================================================

set -e # Exit on error

# Obtener la ruta de la raíz del proyecto (un nivel arriba de scripts/)
BASE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$BASE_DIR"

echo "🚀 Iniciando instalación de Portfolio desde $PWD..."

# 1. Crear .env desde .env.example si no existe
if [ ! -f .env ]; then
  echo "📄 Creando archivo .env desde .env.example..."
  cp .env.example .env
  echo "⚠️  Por favor, revisa el archivo .env y configura tus secretos."
fi

# 2. Instalar dependencias del Backend
echo "📦 Instalando dependencias del Backend..."
cd backend && npm install
cd ..

# 3. Instalar dependencias del Frontend
echo "📦 Instalando dependencias del Frontend..."
cd frontend && npm install
cd ..

# 4. Iniciar base de datos y correr migraciones (si docker-compose está activo)
echo "🐳 Si tienes Docker corriendo, puedes ejecutar: docker-compose up -d"

echo "✅ Instalación completada exitosamente."
echo "➡️  Para iniciar servidor dev del Backend: cd backend && npm run dev"
echo "➡️  Para iniciar servidor dev del Frontend: cd frontend && npm run dev"
