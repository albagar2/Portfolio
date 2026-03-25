# ============================================================
# Backend Dockerfile - Multi-stage build
# Etapa 1: Build con TypeScript
# Etapa 2: Producción con imagen slim
# ============================================================

# ---- Stage 1: Build ----
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./
COPY prisma ./prisma/

# Instalar dependencias
RUN npm ci

# Generar Prisma Client
RUN npx prisma generate

# Copiar código fuente
COPY tsconfig.json ./
COPY src ./src

# Compilar TypeScript
RUN npm run build

# ---- Stage 2: Production ----
FROM node:20-alpine AS production

# Crear usuario no-root para seguridad
RUN addgroup -g 1001 -S nodejs && \
    adduser -S portfolio -u 1001

WORKDIR /app

# Copiar archivos necesarios
COPY package*.json ./
COPY prisma ./prisma/

# Instalar solo dependencias de producción
RUN npm ci --only=production

# Generar Prisma Client para producción
RUN npx prisma generate

# Copiar build
COPY --from=builder /app/dist ./dist

# Crear directorio de logs y uploads
RUN mkdir -p logs uploads && chown -R portfolio:nodejs logs uploads

# Cambiar usuario
USER portfolio

# Exponer puerto
EXPOSE 4000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:4000/api/health || exit 1

# Iniciar servidor
CMD ["node", "dist/index.js"]
