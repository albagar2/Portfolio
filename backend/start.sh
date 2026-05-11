#!/bin/sh
set -e

echo "🚀 Iniciando Portfolio Backend..."

# Crear directorio de datos si no existe (necesario para el volumen de Railway)
mkdir -p /app/data/uploads
echo "✅ Directorios de datos creados en /app/data"

# Crear/sincronizar tablas de la base de datos
echo "📦 Sincronizando esquema de la base de datos..."
npx prisma db push --accept-data-loss
echo "✅ Base de datos sincronizada"

# Poblar la base de datos si está vacía
echo "🌱 Verificando datos iniciales..."
npx tsx prisma/seed.ts
echo "✅ Datos verificados"

# Arrancar el servidor
echo "🌐 Arrancando servidor..."
node dist/index.js
