# ============================================================
# Frontend Dockerfile - Multi-stage build
# Stage 1: Build with Vite
# Stage 2: Serve with Nginx for performance and security
# ============================================================

# ---- Stage 1: Build ----
FROM node:20-alpine AS builder

WORKDIR /app

# Enable build arguments for Vite (so we can pass API URL at build time)
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Copy package files
COPY package*.json ./

# Install dependencies (ci uses package-lock)
RUN npm ci

# Copy source and config
COPY . .

# Build application
RUN npm run build

# ---- Stage 2: Production ----
FROM nginx:stable-alpine AS production

# Copy custom Nginx configuration if needed (defaul is fine for SPA with simple setup)
# For SPA routes to work, we need to try_files $uri $uri/ /index.html;
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
    error_page 500 502 503 504 /50x.html; \
    location = /50x.html { \
        root /usr/share/nginx/html; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Copy build artifacts to Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:80/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
