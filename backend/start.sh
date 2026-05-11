#!/bin/sh
set -e

echo "🚀 Iniciando Portfolio Backend..."

# Crear directorio de datos local (para uploads y BD si el volumen no está montado)
mkdir -p ./data/uploads
echo "✅ Directorio de datos creado"

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
