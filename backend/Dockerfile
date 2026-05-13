# ============================================================
# Backend Dockerfile - Optimized for Fast Builds
# ============================================================

# ---- Stage 1: Build & Dependencies ----
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar archivos de configuración
COPY package*.json ./
COPY prisma ./prisma/

# Instalar TODAS las dependencias de golpe (builder necesita devDependencies)
# Usamos --prefer-offline para acelerar instalaciones repetidas
RUN npm ci --prefer-offline --no-audit

# Generar Prisma Client
RUN npx prisma generate

# Copiar código y compilar
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# ---- Stage 2: Production ----
FROM node:20-alpine AS production

# Crear usuario no-root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S portfolio -u 1001

WORKDIR /app

# Copiar SOLO lo necesario del builder para evitar reinstalar
COPY package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Crear directorios y dar permisos
RUN mkdir -p logs uploads data && \
    chown -R portfolio:nodejs /app && \
    chmod -R 755 /app/data

USER portfolio
EXPOSE 4000

# Iniciar directamente
CMD ["node", "dist/index.js"]
