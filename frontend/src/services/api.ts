import axios from 'axios';

/**
 * @fileoverview api.ts
 * @description Servicio de cliente HTTP (axios) para la comunicación con el backend.
 * Incluye interceptores para manejar tokens de autenticación y su refresco.
 */// URL base desde variable de entorno o detectar entorno de producción
// Base URL from environment variable or detect production
const API_URL = import.meta.env.VITE_API_URL || 
  (window.location.hostname.includes('railway.app') || window.location.hostname.includes('vercel.app') 
    ? 'https://portfolio-production-93a3.up.railway.app/api' 
    : 'http://localhost:8080/api');

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Variables para manejar la cola de refresco de tokens (Token Refresh Queue)
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Interceptor de Petición: Adjuntar el token de acceso a todas las solicitudes
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de Respuesta: Manejar tokens expirados con flujo de Refresh Token y sistema de colas
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Evitar bucles infinitos: solo reintentar una vez y solo para errores 401
    if (error.response?.status === 401 && !originalRequest._retry) {
      
      // Si ya estamos refrescando, empujamos esta petición a la cola
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('refreshToken');

      if (refreshToken) {
        try {
          // Intentar obtener un nuevo token de acceso
          const { data } = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
          
          if (data.success) {
            const { accessToken, refreshToken: newRefreshToken } = data.data;
            
            // Almacenar nuevos tokens
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', newRefreshToken);
            
            // Volver a ejecutar la petición original con el nuevo token
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            
            // Procesar el resto de la cola con el nuevo token
            processQueue(null, accessToken);
            
            return api(originalRequest);
          }
        } catch (refreshError) {
          processQueue(refreshError, null);
          // Falló el refresco del token -> Cerrar sesión
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          // No redirigir automáticamente aquí para no romper la navegación pública
          // El AuthGuard se encargará de redirigir si la ruta es protegida
        } finally {
          isRefreshing = false;
        }
      }
    }

    return Promise.reject(error);
  }
);
