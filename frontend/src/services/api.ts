import axios from 'axios';

// Base URL from environment variable or default local
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4001/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Variables to handle Token Refresh Queue
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

// Request Interceptor: Attach the access token to all requests
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

// Response Interceptor: Handle expired tokens with Refresh Token flow and Queue system
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Avoid infinite loops: only retry once and only for 401s
    if (error.response?.status === 401 && !originalRequest._retry) {
      
      // If we are already refreshing, we push this request to the queue
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
          // Attempt to get a new access token
          const { data } = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
          
          if (data.success) {
            const { accessToken, refreshToken: newRefreshToken } = data.data;
            
            // Store new tokens
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', newRefreshToken);
            
            // Re-run original request with new token
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            
            // Process the rest of the queue with the new token
            processQueue(null, accessToken);
            
            return api(originalRequest);
          }
        } catch (refreshError) {
          processQueue(refreshError, null);
          // Refresh token failed -> Logout
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
