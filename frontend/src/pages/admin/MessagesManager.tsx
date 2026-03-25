import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Mail, Trash2, CheckCircle, Clock, Search, X } from 'lucide-react';
import { api } from '../../services/api';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export const MessagesManager = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    try {
      const { data } = await api.get('/contact');
      setMessages(data.data || []);
    } catch (err) {
      console.error('Error fetching messages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const markAsRead = async (id: string) => {
    try {
      await api.patch(`/contact/${id}/read`);
      fetchMessages();
    } catch (err) {
       console.error('Error marking as read:', err);
    }
  };

  const deleteMessage = async (id: string) => {
     if (!window.confirm('¿Estás seguro de borrar este mensaje?')) return;
     try {
       await api.delete(`/contact/${id}`);
       fetchMessages();
       if (selectedMessage?.id === id) setSelectedMessage(null);
     } catch (err) {
        console.error('Error deleting message:', err);
     }
  };

  return (
    <div className="py-10 space-y-12">
      <header>
        <h1 className="text-4xl font-black mb-4">Messages.</h1>
        <p className="text-slate-500 font-medium">Buzón de entrada de tu formulario de contacto.</p>
      </header>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* Messages List */}
        <div className="lg:col-span-1 space-y-4">
           {loading ? (
             [1,2,3].map(i => <div key={i} className="h-24 glass-card animate-pulse bg-white/5 opacity-50" />)
           ) : messages.length === 0 ? (
             <div className="p-10 glass-card text-center text-slate-500 font-bold border-dashed">No hay mensajes aún.</div>
           ) : (
             messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  onClick={() => { setSelectedMessage(msg); if(!msg.read) markAsRead(msg.id) }}
                  className={`p-6 glass-card cursor-pointer border transition-all ${
                    selectedMessage?.id === msg.id ? 'border-blue-500/50 bg-blue-500/5 ring-1 ring-blue-500/20' : msg.read ? 'border-white/5' : 'border-blue-500/30 bg-blue-500/5'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                     <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${msg.read ? 'bg-slate-800 text-slate-500' : 'bg-blue-500 text-white'}`}>
                        {msg.read ? 'Leído' : 'Nuevo'}
                     </span>
                     <span className="text-[10px] text-slate-500 font-bold flex items-center gap-1">
                        <Clock size={10} /> {new Date(msg.createdAt).toLocaleDateString()}
                     </span>
                  </div>
                  <h4 className="font-bold truncate">{msg.name}</h4>
                  <p className="text-xs text-slate-500 truncate">{msg.subject}</p>
                </motion.div>
             ))
           )}
        </div>

        {/* Message Viewer */}
        <div className="lg:col-span-2">
           <AnimatePresence mode="wait">
              {selectedMessage ? (
                <motion.div
                  key={selectedMessage.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="glass-card p-10 min-h-[500px] flex flex-col"
                >
                   <div className="flex justify-between items-start mb-10 pb-10 border-b border-white/5">
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400 border border-blue-500/20 shadow-2xl">
                           <UserCheck size={32} />
                        </div>
                        <div>
                           <h2 className="text-2xl font-black mb-1">{selectedMessage.name}</h2>
                           <div className="flex items-center gap-2 text-blue-400 text-sm font-bold">
                              <Mail size={14} /> {selectedMessage.email}
                           </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                         <button onClick={() => deleteMessage(selectedMessage.id)} className="p-3 glass-card rounded-xl text-red-400 hover:bg-red-500/5 border-red-500/20">
                            <Trash2 size={20} />
                         </button>
                      </div>
                   </div>

                   <div className="flex-grow">
                      <div className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Asunto:</div>
                      <h3 className="text-xl font-bold mb-8 text-white">{selectedMessage.subject}</h3>
                      
                      <div className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Mensaje:</div>
                      <p className="text-slate-300 leading-relaxed whitespace-pre-wrap bg-white/5 p-6 rounded-2xl border border-white/5">
                        {selectedMessage.message}
                      </p>
                   </div>
                </motion.div>
              ) : (
                <div className="glass-card p-20 min-h-[500px] flex flex-col items-center justify-center text-center opacity-40">
                   <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-6">
                      <MessageSquare size={40} className="text-slate-600" />
                   </div>
                   <h3 className="text-xl font-bold text-slate-400">Selecciona un mensaje</h3>
                   <p className="text-sm text-slate-500 mt-2">Haz clic en un mensaje de la lista para ver el contenido.</p>
                </div>
              )}
           </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const UserCheck = ({ size }: { size: number }) => <User size={size} />;
import { User } from 'lucide-react';
