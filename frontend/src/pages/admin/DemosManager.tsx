import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, X, Loader2, Save, MoveVertical, Check, Terminal } from 'lucide-react';
import { api } from '../../services/api';
import { useNotification } from '../../context/NotificationContext';

export const DemosManager = () => {
  const [demos, setDemos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { showNotification } = useNotification();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReordering, setIsReordering] = useState(false);
  const [editingDemo, setEditingDemo] = useState<any | null>(null);
  
  const [formData, setFormData] = useState<any>({
    title: '',
    codeName: '',
    description: '',
    url: '',
    themeColor: 'cyan-400',
    btnText: 'Open Demo',
    status: 'ACTIVE'
  });

  const fetchDemos = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/demos');
      setDemos(data.data || []);
    } catch (err) {
      console.error('Error fetching demos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDemos();
  }, []);

  const openModal = (demo?: any) => {
    if (demo) {
      setEditingDemo(demo);
      setFormData(demo);
    } else {
      setEditingDemo(null);
      setFormData({
        title: '',
        codeName: 'Project_0X',
        description: '',
        url: '',
        themeColor: 'cyan-400',
        btnText: 'Open Demo',
        status: 'ACTIVE'
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingDemo(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingDemo) {
        await api.put(`/demos/${editingDemo.id}`, formData);
      } else {
        await api.post('/demos', formData);
      }
      showNotification('Demo guardada correctamente', 'success');
      fetchDemos();
      closeModal();
    } catch (err) {
      console.error('Error saving demo:', err);
      showNotification('Error al guardar demo', 'error');
    }
  };

  const deleteDemo = async (id: string) => {
    if (!window.confirm('¿Eliminar esta demo?')) return;
    try {
      await api.delete(`/demos/${id}`);
      fetchDemos();
    } catch (err) {
      console.error('Error deleting demo:', err);
    }
  };

  const moveDemo = (index: number, direction: 'up' | 'down') => {
    const newDemos = [...demos];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newDemos.length) return;
    [newDemos[index], newDemos[targetIndex]] = [newDemos[targetIndex], newDemos[index]];
    setDemos(newDemos);
  };

  const saveNewOrder = async () => {
    try {
      setLoading(true);
      const ids = demos.map(d => d.id);
      await api.patch('/demos/reorder', { ids });
      showNotification('Orden actualizado correctamente', 'success');
      setIsReordering(false);
      fetchDemos();
    } catch (err) {
      console.error('Error reordering:', err);
      showNotification('Error al guardar el nuevo orden', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-6 md:py-10 space-y-8 md:space-y-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8">
        <div className="space-y-2">
           <h1 className="text-3xl md:text-4xl font-black mb-2 md:mb-4">Portal Demos.</h1>
           <p className="text-sm md:text-base text-foreground/85 font-medium">Gestiona los enlaces públicos del portal cyberpunk.</p>
        </div>
        <div className="flex flex-row items-center gap-3 md:gap-4 flex-wrap">
          <button 
            onClick={() => {
              if (isReordering) saveNewOrder();
              else setIsReordering(true);
            }}
            className={`flex-1 md:flex-none flex items-center justify-center gap-3 md:gap-4 px-4 md:px-8 py-4 md:py-5 rounded-2xl font-bold transition-all active:scale-95 text-xs md:text-sm ${
              isReordering 
                ? 'bg-green-500 text-white shadow-lg shadow-green-500/20' 
                : 'bg-foreground/[0.05] hover:bg-foreground/10 border border-border'
            }`}
          >
            {isReordering ? (
              <><span className="hidden xs:inline">Guardar Orden</span> <Check size={18} /></>
            ) : (
              <><span className="hidden xs:inline">Reordenar</span> <MoveVertical size={18} /></>
            )}
          </button>
          <button 
            onClick={() => openModal()}
            className="flex-1 md:flex-none flex items-center justify-center gap-3 md:gap-4 px-4 md:px-8 py-4 md:py-5 bg-primary rounded-2xl font-bold shadow-2xl shadow-blue-500/20 active:scale-95 transition-all text-white text-xs md:text-sm"
          >
            <span className="hidden xs:inline">Nueva Demo</span> <Plus size={20} />
          </button>
        </div>
      </header>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          [1,2,3].map(i => <div key={i} className="h-40 glass-card animate-pulse opacity-50 bg-foreground/[0.05]" />)
        ) : demos.length === 0 ? (
          <div className="col-span-full py-20 glass-card border-dashed flex flex-col items-center gap-4 text-foreground/85">
             <Terminal size={48} className="opacity-20" />
             <p className="font-bold uppercase tracking-widest text-xs text-foreground/95">No hay demos configuradas</p>
          </div>
        ) : (
          demos.map((demo, index) => (
            <div key={demo.id} className="glass-card p-6 flex flex-col border border-border bg-foreground/[0.02]">
              <div className="flex justify-between items-start mb-4">
                 <div>
                    <span className="text-[10px] font-mono text-blue-400 mb-1 uppercase block">{demo.codeName}</span>
                    <h3 className="text-xl font-bold text-foreground">{demo.title}</h3>
                 </div>
                 <div className="flex gap-2">
                   {isReordering ? (
                     <>
                       <button disabled={index === 0} onClick={() => moveDemo(index, 'up')} className="p-2 hover:bg-primary/20 rounded disabled:opacity-30">↑</button>
                       <button disabled={index === demos.length - 1} onClick={() => moveDemo(index, 'down')} className="p-2 hover:bg-primary/20 rounded disabled:opacity-30">↓</button>
                     </>
                   ) : (
                     <>
                       <button onClick={() => openModal(demo)} className="p-2 hover:bg-blue-500/20 rounded"><Edit2 size={16} /></button>
                       <button onClick={() => deleteDemo(demo.id)} className="p-2 hover:bg-red-500/20 rounded"><Trash2 size={16} /></button>
                     </>
                   )}
                 </div>
              </div>
              <p className="text-sm text-foreground/70 mb-4 line-clamp-2 flex-grow">{demo.description}</p>
              <div className="flex items-center gap-2 text-xs font-mono bg-foreground/5 p-2 rounded truncate text-foreground/60">
                 <span style={{ color: demo.themeColor.includes('500') ? demo.themeColor.replace('bg-', '') : 'inherit' }}>●</span>
                 {demo.url}
              </div>
            </div>
          ))
        )}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeModal} className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
             <motion.div 
               initial={{ opacity: 0, scale: 0.95, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.95, y: 20 }}
               className="relative w-full max-w-xl glass-card p-0 overflow-hidden shadow-2xl"
             >
                <div className="p-6 border-b border-border flex justify-between items-center bg-foreground/[0.05]">
                   <h2 className="text-xl font-black">{editingDemo ? 'Editar Demo' : 'Nueva Demo'}</h2>
                   <button onClick={closeModal} className="p-2 hover:bg-foreground/10 rounded-full"><X size={20} /></button>
                </div>
                <form onSubmit={handleSave} className="p-6 space-y-6">
                   <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-foreground/85">Título</label>
                        <input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-foreground/[0.05] border border-border rounded p-3 text-sm font-bold" required />
                     </div>
                     <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-foreground/85">CodeName (Estado/Etiqueta)</label>
                        <select value={formData.codeName} onChange={e => setFormData({...formData, codeName: e.target.value})} className="w-full bg-foreground/[0.05] border border-border rounded p-3 text-sm font-mono" required>
                           <option value="OPERATIVO">OPERATIVO</option>
                           <option value="STANDBY">STANDBY</option>
                           <option value="BETA_TEST">BETA_TEST</option>
                           <option value="DOCKER-DEPLOY">DOCKER-DEPLOY</option>
                           <option value="CORE_SYSTEM">CORE_SYSTEM</option>
                           <option value="MAINTENANCE">MAINTENANCE</option>
                           <option value="OFFLINE">OFFLINE</option>
                        </select>
                     </div>
                   </div>
                   
                   <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-foreground/85">Descripción</label>
                      <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-foreground/[0.05] border border-border rounded p-3 text-sm min-h-[80px]" required />
                   </div>

                   <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-foreground/85">URL Pública</label>
                      <input type="url" value={formData.url} onChange={e => {
                        const newUrl = e.target.value;
                        let newBtnText = formData.btnText;
                        if (newUrl.includes('youtube.com') || newUrl.includes('youtu.be')) {
                          newBtnText = 'Iniciar Vídeo';
                        } else if (newBtnText === 'Iniciar Vídeo') {
                          newBtnText = 'Iniciar Demo';
                        }
                        setFormData({...formData, url: newUrl, btnText: newBtnText});
                      }} className="w-full bg-foreground/[0.05] border border-border rounded p-3 text-sm font-mono" placeholder="https://..." required />
                   </div>

                   <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-foreground/85">Color (Clase Tailwind)</label>
                        <select value={formData.themeColor} onChange={e => setFormData({...formData, themeColor: e.target.value})} className="w-full bg-foreground/[0.05] border border-border rounded p-3 text-sm">
                           <option value="#00f0ff">Cyber Blue</option>
                           <option value="#bc13fe">Cyber Purple</option>
                           <option value="#39ff14">Cyber Green</option>
                           <option value="#f97316">Orange</option>
                           <option value="#ec4899">Pink</option>
                           <option value="#22d3ee">Cyan</option>
                           <option value="#eab308">Yellow</option>
                           <option value="#ef4444">Red</option>
                           <option value="#ffffff">White</option>
                        </select>
                     </div>
                     <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-foreground/85">Texto Botón</label>
                        <input value={formData.btnText} onChange={e => setFormData({...formData, btnText: e.target.value})} className="w-full bg-foreground/[0.05] border border-border rounded p-3 text-sm" placeholder="Open Demo" required />
                     </div>
                   </div>

                   <button type="submit" className="w-full bg-primary hover:bg-blue-600 text-white py-4 rounded-xl font-black flex items-center justify-center gap-2">
                      <Save size={18} /> GUARDAR DEMO
                   </button>
                </form>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
