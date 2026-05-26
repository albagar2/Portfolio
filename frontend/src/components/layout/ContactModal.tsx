import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldAlert, Send, Loader2, CheckCircle2 } from 'lucide-react';
import { api } from '../../services/api';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  t: any;
}

/**
 * COMPONENTE: Modal de Contacto (Signal Gateway)
 * Canal de comunicación directo con validación de paquetes de datos y confirmación de envío.
 */
export const ContactModal = ({ isOpen, onClose, t }: ContactModalProps) => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: 'Portfolio Signal', message: '' });
  const [errorDetails, setErrorDetails] = useState<string | null>(null);

  // Lógica de Envío de Mensaje al Backend
  const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault();
     setLoading(true);
     setErrorDetails(null);
     try {
       await api.post('/contact', formData);
       setIsSuccess(true);
       // Resetear y cerrar tras 3 segundos de éxito
       setTimeout(() => { 
         setIsSuccess(false); 
         onClose(); 
       }, 3000);
     } catch (err: any) {
       console.error('Contact signal failure:', err);
       const validationErrors = err.response?.data?.errors;
       
       // Formateo Detallado de Errores de Zod/Backend
       if (validationErrors) {
         const details = Object.entries(validationErrors)
           .map(([field, msgs]) => `${field.toUpperCase()}: ${(msgs as string[]).join(', ')}`)
           .join(' // ');
         setErrorDetails(details);
       } else {
         setErrorDetails(err.response?.data?.message || t.contact.fail_desc);
       }
     } finally {
       setLoading(false);
     }
  };

  if (!isOpen) return null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[500] flex items-center justify-center p-6 bg-background/80 backdrop-blur-3xl">
      <motion.div initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} className="os-window w-full max-w-2xl border-[#FFB800]/40 overflow-hidden shadow-[0_0_100px_rgba(255,184,0,0.1)] flex flex-col max-h-[90vh]">
        {/* Cabecera del Gateway */}
        <div className="os-header bg-[#FFB800]/10 border-[#FFB800]/20 shrink-0">
          <div className="flex gap-2 mr-6"><div className="os-dot bg-red-500" /><div className="os-dot bg-yellow-400" /><div className="os-dot bg-green-500" /></div>
          <span className="font-mono text-[9px] font-black uppercase tracking-[0.6em] text-[#FFB800]">{t.contact.connect === 'CONTACTO' ? 'ENVIAR_MENSAJE.bin' : 'SEND_MESSAGE.bin'}</span>
          <button onClick={onClose} className="ml-auto p-3 opacity-40 hover:opacity-100 transition-opacity text-foreground"><X size={20} /></button>
        </div>
        
        <div className="p-8 md:p-16 relative overflow-y-auto custom-scrollbar">
          <AnimatePresence mode="wait">
            {!isSuccess ? (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="space-y-12">
                 {/* Mensaje de Bienvenida al Nodo */}
                 <div className="space-y-4">
                    <h2 className="text-6xl font-black italic uppercase tracking-tighter text-foreground">
                      {t.contact.access_node.split(' ')[0]}
                      {t.contact.access_node.split(' ')[1] ? (
                        <>
                          <br />
                          <span className="text-[#FFB800]">{t.contact.access_node.split(' ').slice(1).join(' ')}.</span>
                        </>
                      ) : '.'}
                    </h2>
                    <p className="font-mono text-[9px] text-foreground/85 uppercase tracking-widest leading-relaxed border-l-[3px] border-[#FFB800]/30 pl-8">
                      {t.contact.signal_desc}
                    </p>
                 </div>

                 {/* Panel de Errores Críticos */}
                 {errorDetails && (
                   <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="p-6 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-start gap-5">
                      <ShieldAlert className="text-red-500 shrink-0 mt-1" size={20} />
                      <div className="space-y-2">
                         <div className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500">{t.contact.fail_title}</div>
                         <p className="text-[9px] font-mono text-foreground/85 leading-relaxed uppercase tracking-widest">{errorDetails}</p>
                      </div>
                   </motion.div>
                 )}

                 {/* Formulario de Transmisión */}
                 <form className="space-y-8" onSubmit={handleSubmit}>
                    <div className="grid md:grid-cols-2 gap-8">
                       <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} type="text" placeholder={t.contact.user_id} className="w-full bg-foreground/[0.05] border border-border p-8 rounded-3xl font-mono text-[10px] uppercase tracking-widest focus:border-[#FFB800]/50 outline-none transition-all text-foreground" />
                       <input required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} type="email" placeholder={t.contact.signal_email} className="w-full bg-foreground/[0.05] border border-border p-8 rounded-3xl font-mono text-[10px] uppercase tracking-widest focus:border-[#FFB800]/50 outline-none transition-all text-foreground" />
                    </div>
                    <input required value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} type="text" placeholder={t.contact.subject} className="w-full bg-foreground/[0.05] border border-border p-8 rounded-3xl font-mono text-[10px] uppercase tracking-widest focus:border-[#FFB800]/50 outline-none transition-all text-foreground" />
                    
                    <div className="relative">
                       <textarea required value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} placeholder={t.contact.data_packet} rows={6} className="w-full bg-foreground/[0.05] border border-border p-8 rounded-3xl font-mono text-[10px] uppercase tracking-widest focus:border-[#FFB800]/50 outline-none transition-all resize-none text-foreground" />
                       <div className={`absolute bottom-6 right-8 font-mono text-[9px] font-black uppercase tracking-tighter ${formData.message.length < 10 ? 'text-red-500 animate-pulse' : 'text-foreground/85'}`}>
                          {t.contact.length}: {formData.message.length} / MIN: 10
                       </div>
                    </div>
                    
                    <button disabled={loading} type="submit" className="btn-os w-full bg-[#FFB800] text-black font-black flex items-center justify-center gap-6 py-10 shadow-2xl hover:scale-[1.03] transition-all disabled:opacity-50">
                       {loading ? <Loader2 size={24} className="animate-spin text-black" /> : <Send size={24} />}
                       {t.contact.establish_link}
                    </button>
                 </form>
              </motion.div>
            ) : (
              /* Mensaje de Éxito de Sincronización */
              <motion.div key="success" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="py-24 text-center space-y-12">
                 <div className="w-32 h-32 rounded-full border-[3px] border-[#FFB800] mx-auto flex items-center justify-center text-[#FFB800] shadow-[0_0_50px_rgba(255,184,0,0.3)]">
                    <CheckCircle2 size={60} strokeWidth={3} />
                 </div>
                 <div className="space-y-4">
                     <h4 className="text-4xl font-black italic uppercase text-foreground tracking-widest">
                        {t.contact.success_title.split(' ')[0]}
                        {t.contact.success_title.split(' ')[1] ? (
                          <>
                            <br />
                            <span className="text-[#FFB800]">{t.contact.success_title.split(' ').slice(1).join(' ')}</span>
                          </>
                        ) : ''}
                     </h4>
                    <p className="font-mono text-xs text-[#FFB800] uppercase tracking-[0.4em]">
                       {t.contact.success_desc}
                    </p>
                 </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};
