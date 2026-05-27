import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

/**
 * @fileoverview AuthContext.tsx
 * @description Contexto de Autenticación de la aplicación.
 * Proporciona el estado de sesión del usuario y las funciones para iniciar y cerrar sesión.
 */interface User {
  userId: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'EDITOR' | 'VIEWER' | 'GUEST';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (accessToken: string, refreshToken: string, userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // ESTADO LOCAL: Maneja los datos del usuario actual y el estado de carga

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
    window.location.href = '/admin/login';
  }, []);

  const login = useCallback((accessToken: string, refreshToken: string, userData: User) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    setUser(userData);
    setIsLoading(false);
  }, []);

  // Función para verificar si hay una sesión activa al cargar la aplicación
  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const { data } = await api.get('/auth/me');
      if (data.success) {
        setUser(data.data);
      }
    } catch (error: any) {
      console.error('Session validation failed:', error.message);
      // Solo expulsar si el servidor dice explícitamente que no estás autorizado
      if (error.response?.status === 401) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setUser(null);
      }
    } finally {
      setIsLoading(false);
    }
  }, [logout]);

  // EFECTO: Se ejecuta al montar el proveedor para verificar la autenticación
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
