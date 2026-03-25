import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Briefcase, GraduationCap, Plus, Edit2, 
  Trash2, Calendar, MapPin, ExternalLink, 
  X, Save, Loader2, Sparkles, AlertCircle
} from 'lucide-react';
import { api } from '../../services/api';

interface Experience {
  id: string;
  company: string;
  position: string;
  description: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  location?: string;
}

interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description?: string;
}

export const CvManager = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [educations, setEducations] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modals for Experience
  const [isExpModalOpen, setIsExpModalOpen] = useState(false);
  const [editingExp, setEditingExp] = useState<Experience | null>(null);
  const [expFormData, setExpFormData] = useState<Partial<Experience>>({
    company: '', position: '', description: '', startDate: '', current: false
  });

  // Modals for Education
  const [isEduModalOpen, setIsEduModalOpen] = useState(false);
  const [editingEdu, setEditingEdu] = useState<Education | null>(null);
  const [eduFormData, setEduFormData] = useState<Partial<Education>>({
    institution: '', degree: '', field: '', startDate: '', current: false
  });

  const fetchData = async () => {
    try {
      const [expRes, eduRes] = await Promise.all([
        api.get('/experience'),
        api.get('/education')
      ]);
      setExperiences(expRes.data.data || []);
      setEducations(eduRes.data.data || []);
    } catch (err) {
      console.error('Error fetching CV data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Experience Logic
  const openExpModal = (exp?: Experience) => {
    if (exp) {
      setEditingExp(exp);
      setExpFormData({ ...exp, startDate: exp.startDate.split('T')[0], endDate: exp.endDate?.split('T')[0] });
    } else {
      setEditingExp(null);
      setExpFormData({ company: '', position: '', description: '', startDate: '', current: false, location: '' });
    }
    setIsExpModalOpen(true);
  };

  const handleSaveExp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Formatear fechas para el backend (espera ISO datetime)
      // Los inputs de tipo date devuelven "YYYY-MM-DD"
      const dataToSave = {
        ...expFormData,
        startDate: expFormData.startDate ? new Date(expFormData.startDate).toISOString() : undefined,
        endDate: (expFormData.endDate && !expFormData.current) 
          ? new Date(expFormData.endDate).toISOString() 
          : null
      };

      // Limpiar campos que no deben enviarse o que pueden causar conflicto
      const { id, ...payload } = dataToSave as any;

      if (editingExp) {
        await api.put(`/experience/${editingExp.id}`, payload);
      } else {
        await api.post('/experience', payload);
      }
      fetchData();
      setIsExpModalOpen(false);
    } catch (err: any) { 
      console.error('Error saving experience:', err);
      const errorMsg = err.response?.data?.message || 'Error al guardar';
      const validationErrors = err.response?.data?.errors;
      
      if (validationErrors) {
        const details = Object.entries(validationErrors)
          .map(([field, msgs]) => `${field}: ${(msgs as string[]).join(', ')}`)
          .join('\n');
        alert(`${errorMsg}:\n${details}`);
      } else {
        alert(errorMsg);
      }
    }
  };

  const deleteExp = async (id: string) => {
    if (!window.confirm('¿Eliminar esta experiencia?')) return;
    try {
      await api.delete(`/experience/${id}`);
      fetchData();
    } catch (err) { console.error('Error deleting experience:', err); }
  };

  // Education Logic
  const openEduModal = (edu?: Education) => {
    if (edu) {
      setEditingEdu(edu);
      setEduFormData({ ...edu, startDate: edu.startDate.split('T')[0], endDate: edu.endDate?.split('T')[0] });
    } else {
      setEditingEdu(null);
      setEduFormData({ institution: '', degree: '', field: '', startDate: '', current: false, description: '' });
    }
    setIsEduModalOpen(true);
  };

  const handleSaveEdu = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const dataToSave = {
        ...eduFormData,
        startDate: eduFormData.startDate ? new Date(eduFormData.startDate).toISOString() : undefined,
        endDate: (eduFormData.endDate && !eduFormData.current) 
          ? new Date(eduFormData.endDate).toISOString() 
          : null
      };

      const { id, ...payload } = dataToSave as any;

      if (editingEdu) {
        await api.put(`/education/${editingEdu.id}`, payload);
      } else {
        await api.post('/education', payload);
      }
      fetchData();
      setIsEduModalOpen(false);
    } catch (err: any) { 
      console.error('Error saving education:', err);
      const errorMsg = err.response?.data?.message || 'Error al guardar';
      alert(errorMsg);
    }
  };

  const deleteEdu = async (id: string) => {
    if (!window.confirm('¿Eliminar esta formación académica?')) return;
    try {
      await api.delete(`/education/${id}`);
      fetchData();
    } catch (err) { console.error('Error deleting education:', err); }
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-slate-950 text-blue-400 font-black animate-pulse">CARGANDO RECORRIDO...</div>;

  return (
    <div className="py-10 space-y-20 max-w-6xl mx-auto">
      <header>
         <h1 className="text-4xl font-black mb-4">Journey Engine.</h1>
         <p className="text-slate-500 font-medium">Construye tu línea de tiempo profesional y académica.</p>
      </header>

      {/* --- SECCIÓN EXPERIENCIA --- */}
      <section className="space-y-8">
        <div className="flex items-end justify-between">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center border border-blue-500/20 text-blue-400">
                 <Briefcase size={24} />
              </div>
              <h2 className="text-2xl font-black">Experiencia Laboral</h2>
           </div>
           <button onClick={() => openExpModal()} className="px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 font-bold text-xs flex items-center gap-2 transition-all active:scale-95">
              <Plus size={16} /> AÑADIR EXPERIENCIA
           </button>
        </div>

        <div className="grid gap-6">
          {experiences.length === 0 ? (
            <div className="p-12 glass-card border-dashed text-center text-slate-500 font-bold uppercase tracking-widest text-xs">Aún no has añadido experiencias laborales</div>
          ) : (
            experiences.map((exp) => (
              <div key={exp.id} className="glass-card p-8 group relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                   <button onClick={() => openExpModal(exp)} className="p-2 bg-blue-500/10 hover:bg-blue-500/20 rounded-lg border border-blue-500/20 text-blue-400"><Edit2 size={16} /></button>
                   <button onClick={() => deleteExp(exp.id)} className="p-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg border border-red-500/20 text-red-400"><Trash2 size={16} /></button>
                </div>
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                   <div className="space-y-2">
                      <h3 className="text-xl font-black">{exp.position}</h3>
                      <p className="text-blue-400 font-bold">{exp.company}</p>
                      <div className="flex items-center gap-4 text-xs text-slate-500 font-medium">
                         <span className="flex items-center gap-1.5"><Calendar size={14} /> {new Date(exp.startDate).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })} - {exp.current ? 'Actualidad' : exp.endDate ? new Date(exp.endDate).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }) : ''}</span>
                         {exp.location && <span className="flex items-center gap-1.5"><MapPin size={14} /> {exp.location}</span>}
                      </div>
                      <p className="mt-4 text-sm text-slate-400 leading-relaxed max-w-2xl">{exp.description}</p>
                   </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* --- SECCIÓN EDUCACIÓN --- */}
      <section className="space-y-8">
        <div className="flex items-end justify-between">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-500/20 rounded-2xl flex items-center justify-center border border-purple-500/20 text-purple-400">
                 <GraduationCap size={24} />
              </div>
              <h2 className="text-2xl font-black">Educación</h2>
           </div>
           <button onClick={() => openEduModal()} className="px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 font-bold text-xs flex items-center gap-2 transition-all active:scale-95">
              <Plus size={16} /> AÑADIR EDUCACIÓN
           </button>
        </div>

        <div className="grid gap-6">
          {educations.length === 0 ? (
            <div className="p-12 glass-card border-dashed text-center text-slate-500 font-bold uppercase tracking-widest text-xs">Aún no has añadido formación académica</div>
          ) : (
            educations.map((edu) => (
              <div key={edu.id} className="glass-card p-8 group relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                   <button onClick={() => openEduModal(edu)} className="p-2 bg-purple-500/10 hover:bg-purple-500/20 rounded-lg border border-purple-500/20 text-purple-400"><Edit2 size={16} /></button>
                   <button onClick={() => deleteEdu(edu.id)} className="p-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg border border-red-500/20 text-red-400"><Trash2 size={16} /></button>
                </div>
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                   <div className="space-y-2">
                      <h3 className="text-xl font-black">{edu.degree}</h3>
                      <p className="text-purple-400 font-bold">{edu.institution} <span className="text-slate-500 mx-2">//</span> {edu.field}</p>
                      <div className="flex items-center gap-4 text-xs text-slate-500 font-medium">
                         <span className="flex items-center gap-1.5"><Calendar size={14} /> {new Date(edu.startDate).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })} - {edu.current ? 'Actualidad' : edu.endDate ? new Date(edu.endDate).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }) : ''}</span>
                      </div>
                      {edu.description && <p className="mt-4 text-sm text-slate-400 leading-relaxed max-w-2xl">{edu.description}</p>}
                   </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* --- MODAL EXPERIENCIA --- */}
      <AnimatePresence>
        {isExpModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsExpModalOpen(false)} className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" />
             <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative w-full max-w-2xl glass-card p-0 overflow-hidden shadow-3xl">
                <div className="p-8 border-b border-white/5 bg-white/5 flex justify-between items-center">
                   <h2 className="text-2xl font-black flex items-center gap-3"><Briefcase size={24} /> {editingExp ? 'Editar' : 'Añadir'} Experiencia</h2>
                   <button onClick={() => setIsExpModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-all"><X size={24} /></button>
                </div>

                <form onSubmit={handleSaveExp} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                   <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Empresa</label>
                         <input value={expFormData.company} onChange={e => setExpFormData({...expFormData, company: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-blue-500/50 transition-all font-bold" required />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Puesto / Cargo</label>
                         <input value={expFormData.position} onChange={e => setExpFormData({...expFormData, position: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-blue-500/50 transition-all font-bold" required />
                      </div>
                   </div>

                   <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Fecha Inicio</label>
                         <input type="date" value={expFormData.startDate} onChange={e => setExpFormData({...expFormData, startDate: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-blue-500/50 transition-all font-medium" required />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Fecha Fin (Si aplica)</label>
                         <input type="date" disabled={expFormData.current} value={expFormData.endDate || ''} onChange={e => setExpFormData({...expFormData, endDate: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-blue-500/50 transition-all font-medium disabled:opacity-30" />
                      </div>
                   </div>

                   <div className="grid md:grid-cols-2 gap-6 items-center">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Ubicación (Ej: Remoto, Madrid...)</label>
                         <div className="relative group">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={16} />
                            <input 
                               value={expFormData.location || ''} 
                               onChange={e => setExpFormData({...expFormData, location: e.target.value})} 
                               placeholder="Remoto / Madrid, ES..."
                               className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 outline-none focus:border-blue-500/50 transition-all font-bold" 
                            />
                         </div>
                      </div>

                      <div className="flex items-center gap-4 p-5 bg-white/5 rounded-xl border border-white/10 self-end h-[58px] cursor-pointer hover:bg-white/[0.08] transition-all" onClick={() => setExpFormData({...expFormData, current: !expFormData.current})}>
                         <div className={`w-6 h-6 rounded-md border flex items-center justify-center transition-all ${expFormData.current ? 'bg-blue-500 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'border-white/20 bg-white/5'}`}>
                            {expFormData.current && <Save size={14} className="text-white" />}
                         </div>
                         <span className="text-sm font-bold text-slate-300">Es mi puesto actual</span>
                      </div>
                   </div>

                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Descripción de tareas y logros</label>
                      <textarea value={expFormData.description} onChange={e => setExpFormData({...expFormData, description: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-blue-500/50 transition-all min-h-[150px] text-sm leading-relaxed" required />
                   </div>
                </form>

                <div className="p-8 bg-black/40 border-t border-white/5">
                   <button type="submit" onClick={handleSaveExp} className="w-full bg-blue-500 hover:bg-blue-600 text-white py-5 rounded-2xl font-black flex items-center justify-center gap-3 shadow-2xl shadow-blue-500/20 active:scale-95 transition-all">
                      <Save size={20} /> GUARDAR EXPERIENCIA
                   </button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- MODAL EDUCACIÓN --- */}
      <AnimatePresence>
        {isEduModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsEduModalOpen(false)} className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" />
             <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative w-full max-w-2xl glass-card p-0 overflow-hidden shadow-3xl">
                <div className="p-8 border-b border-white/5 bg-white/5 flex justify-between items-center">
                   <h2 className="text-2xl font-black flex items-center gap-3"><GraduationCap size={24} /> {editingEdu ? 'Editar' : 'Añadir'} Educación</h2>
                   <button onClick={() => setIsEduModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-all"><X size={24} /></button>
                </div>

                <form onSubmit={handleSaveEdu} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Institución / Universidad</label>
                      <input value={eduFormData.institution} onChange={e => setEduFormData({...eduFormData, institution: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-purple-500/50 transition-all font-bold" required />
                   </div>

                   <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Título / Grado</label>
                         <input value={eduFormData.degree} onChange={e => setEduFormData({...eduFormData, degree: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-purple-500/50 transition-all font-bold" required />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Campo de estudio</label>
                         <input value={eduFormData.field} onChange={e => setEduFormData({...eduFormData, field: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-purple-500/50 transition-all font-bold" required />
                      </div>
                   </div>

                   <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Fecha Inicio</label>
                         <input type="date" value={eduFormData.startDate} onChange={e => setEduFormData({...eduFormData, startDate: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-purple-500/50 transition-all font-medium" required />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Fecha Fin (Si aplica)</label>
                         <input type="date" disabled={eduFormData.current} value={eduFormData.endDate || ''} onChange={e => setEduFormData({...eduFormData, endDate: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-purple-500/50 transition-all font-medium disabled:opacity-30" />
                      </div>
                   </div>

                   <div className="flex items-center gap-4 p-5 bg-white/5 rounded-xl border border-white/10 cursor-pointer hover:bg-white/[0.08] transition-all" onClick={() => setEduFormData({...eduFormData, current: !eduFormData.current})}>
                      <div className={`w-6 h-6 rounded-md border flex items-center justify-center transition-all ${eduFormData.current ? 'bg-purple-500 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.5)]' : 'border-white/20 bg-white/5'}`}>
                         {eduFormData.current && <Save size={14} className="text-white" />}
                      </div>
                      <span className="text-sm font-bold text-slate-300">Es mi formación actual</span>
                   </div>

                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Información adicional (Opcional)</label>
                      <textarea value={eduFormData.description} onChange={e => setEduFormData({...eduFormData, description: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-purple-500/50 transition-all min-h-[100px] text-sm leading-relaxed" />
                   </div>
                </form>

                <div className="p-8 bg-black/40 border-t border-white/5">
                   <button type="submit" onClick={handleSaveEdu} className="w-full bg-purple-500 hover:bg-purple-600 text-white py-5 rounded-2xl font-black flex items-center justify-center gap-3 shadow-2xl shadow-purple-500/20 active:scale-95 transition-all">
                      <Save size={20} /> GUARDAR FORMACIÓN
                   </button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
