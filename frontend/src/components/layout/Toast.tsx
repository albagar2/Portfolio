import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, X, CheckCircle2, AlertCircle } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
}

/**
 * COMPONENTE: Toast Notification (Sistema de Alerta de Interfaz)
 * Notificaciones no bloqueantes con estética de terminal ALBA-OS.
 */
export const Toast = ({ message, type = 'info', onClose }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const colors = {
    success: { text: '#D9FF00', bg: 'rgba(217, 255, 0, 0.05)', border: 'rgba(217, 255, 0, 0.2)' },
    error: { text: '#FF007A', bg: 'rgba(255, 0, 122, 0.05)', border: 'rgba(255, 0, 122, 0.2)' },
    info: { text: '#00FFF0', bg: 'rgba(0, 255, 240, 0.05)', border: 'rgba(0, 255, 240, 0.2)' },
  };

  const config = colors[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.9 }}
      className="fixed bottom-10 left-10 z-[200] flex items-center gap-6 px-10 py-6 rounded-2xl backdrop-blur-3xl border shadow-2xl overflow-hidden group"
      style={{ backgroundColor: config.bg, borderColor: config.border }}
    >
      {/* Indicador de Tipo de Log */}
      <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/5" style={{ color: config.text }}>
        {type === 'success' ? <CheckCircle2 size={20} /> : type === 'error' ? <AlertCircle size={20} /> : <Terminal size={20} />}
      </div>

      <div className="flex flex-col">
        <span className="text-[8px] font-mono font-black uppercase tracking-[0.4em] mb-1 opacity-40" style={{ color: config.text }}>
          SYSTEM_NOTIFICATION: {type.toUpperCase()}
        </span>
        <p className="font-mono text-[11px] font-black uppercase tracking-widest text-white">
          {message}
        </p>
      </div>

      <button 
        onClick={onClose}
        className="ml-4 p-2 hover:bg-white/5 rounded-full transition-colors opacity-30 hover:opacity-100"
      >
        <X size={14} className="text-white" />
      </button>

      {/* Barra de Progreso Interna del Toast */}
      <motion.div 
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0 }}
        transition={{ duration: 4, ease: "linear" }}
        className="absolute bottom-0 left-0 right-0 h-[2px] origin-left"
        style={{ backgroundColor: config.text }}
      />
    </motion.div>
  );
};
