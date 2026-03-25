import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Toast } from '../components/layout/Toast';

type NotificationType = 'success' | 'error' | 'info';

interface NotificationContextType {
  showNotification: (message: string, type?: NotificationType) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

/**
 * PROVEEDOR: NotificationProvider
 * Sistema centralizado de mensajes de interfaz (Toasts).
 * Reemplaza los alerts nativos por notificaciones estilizadas de ALBA-OS.
 */
export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notification, setNotification] = useState<{ message: string; type: NotificationType } | null>(null);

  const showNotification = useCallback((message: string, type: NotificationType = 'info') => {
    setNotification({ message, type });
  }, []);

  const clearNotification = useCallback(() => {
    setNotification(null);
  }, []);

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      <AnimatePresence>
        {notification && (
          <Toast 
            message={notification.message} 
            type={notification.type} 
            onClose={clearNotification} 
          />
        )}
      </AnimatePresence>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
