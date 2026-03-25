import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Search, Edit2, Trash2, ExternalLink, 
  Github, LayoutGrid, List, X, Loader2, Save,
  Image as ImageIcon, Tag, Hash, Globe
} from 'lucide-react';
import { api } from '../../services/api';

interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  longDescription?: string;
  category: string;
  imageUrl?: string;
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
  status: 'PUBLISHED' | 'DRAFT';
  technologies: { name: string }[];
}

export const ProjectsManager = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState<Partial<Project>>({
    title: '',
    description: '',
    category: 'web',
    status: 'PUBLISHED',
    featured: false,
    technologies: []
  });
  const [techInput, setTechInput] = useState('');

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/projects');
      setProjects(data.data || []);
    } catch (err) {
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const openModal = (project?: Project) => {
    if (project) {
      setEditingProject(project);
      setFormData(project);
    } else {
      setEditingProject(null);
      setFormData({
        title: '',
        description: '',
        category: 'web',
        status: 'PUBLISHED',
        featured: false,
        technologies: []
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Preparamos los datos: convertimos tecnologías de [{name: 'React'}] a ['React']
      const payload = {
        ...formData,
        technologies: formData.technologies?.map((t: any) => typeof t === 'object' ? t.name : t)
      };

      if (editingProject) {
        await api.put(`/projects/${editingProject.id}`, payload);
      } else {
        // Simple slug generation for new projects
        const slug = formData.title?.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '') || 'new-project';
        await api.post('/projects', { ...payload, slug });
      }
      fetchProjects();
      closeModal();
    } catch (err) {
      console.error('Error saving project:', err);
      alert('Error al guardar el proyecto. Revisa la consola.');
    }
  };

  const deleteProject = async (id: string) => {
    if (!window.confirm('¿Eliminar este proyecto definitivamente?')) return;
    try {
      await api.delete(`/projects/${id}`);
      fetchProjects();
    } catch (err) {
      console.error('Error deleting project:', err);
    }
  };

  const addTech = () => {
    if (!techInput.trim()) return;
    const currentTechs = formData.technologies || [];
    if (!currentTechs.find(t => t.name === techInput.trim())) {
      setFormData({ ...formData, technologies: [...currentTechs, { name: techInput.trim() }] });
    }
    setTechInput('');
  };

  const removeTech = (name: string) => {
    setFormData({ ...formData, technologies: formData.technologies?.filter(t => t.name !== name) });
  };

  return (
    <div className="py-10 space-y-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
           <h1 className="text-4xl font-black mb-4">Project Engine.</h1>
           <p className="text-slate-500 font-medium">Gestiona y edita tu galería visual de trabajos.</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="flex items-center gap-4 px-8 py-5 bg-primary rounded-2xl font-bold shadow-2xl shadow-blue-500/20 active:scale-95 transition-all"
        >
          Nuevo Proyecto <Plus size={20} />
        </button>
      </header>

      {/* Grid de Proyectos */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          [1,2,3].map(i => <div key={i} className="h-64 glass-card animate-pulse opacity-50 bg-white/5" />)
        ) : projects.length === 0 ? (
          <div className="col-span-full py-20 glass-card border-dashed flex flex-col items-center gap-4 text-slate-500">
             <LayoutGrid size={48} className="opacity-20" />
             <p className="font-bold uppercase tracking-widest text-xs text-slate-600">No hay proyectos activos</p>
          </div>
        ) : (
          projects.map((project) => (
            <div key={project.id} className="glass-card group flex flex-col">
               <div className="h-40 bg-slate-900 overflow-hidden relative border-b border-white/5">
                  <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-20"><ImageIcon size={48} /></div>
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                     <button onClick={() => openModal(project)} className="p-2 bg-white/10 hover:bg-blue-500/20 rounded-lg backdrop-blur-md border border-white/10"><Edit2 size={16} /></button>
                     <button onClick={() => deleteProject(project.id)} className="p-2 bg-white/10 hover:bg-red-500/20 rounded-lg backdrop-blur-md border border-white/10"><Trash2 size={16} /></button>
                  </div>
               </div>
               <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                     <span className={`w-2 h-2 rounded-full ${project.status === 'PUBLISHED' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                     <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">
                        {project.status === 'PUBLISHED' ? 'Publicado' : 'Borrador'}
                        {project.featured && ' • Destacado'}
                     </span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mb-4">{project.description}</p>
                  
                  <div className="flex flex-wrap gap-2 pt-4 border-t border-white/5">
                     {project.technologies.slice(0, 3).map((t, i) => (
                       <span key={i} className="text-[10px] px-2 py-0.5 bg-white/5 rounded text-white/40">{t.name}</span>
                     ))}
                  </div>
               </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Form */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeModal} className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" />
             
             <motion.div 
               initial={{ opacity: 0, scale: 0.95, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.95, y: 20 }}
               className="relative w-full max-w-2xl glass-card p-0 overflow-hidden shadow-2xl"
             >
                <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/5">
                   <h2 className="text-2xl font-black">{editingProject ? 'Editar Proyecto' : 'Nuevo Proyecto'}</h2>
                   <button onClick={closeModal} className="p-2 hover:bg-white/10 rounded-full transition-all"><X size={24} /></button>
                </div>

                <form onSubmit={handleSave} className="p-8 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                   {/* Col 1 */}
                   <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Título del Proyecto</label>
                         <input 
                           value={formData.title} 
                           onChange={e => setFormData({...formData, title: e.target.value})}
                           className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-blue-500/50 transition-all font-bold"
                           placeholder="E-Commerce API"
                           required
                         />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Categoría</label>
                         <select 
                           value={formData.category} 
                           onChange={e => setFormData({...formData, category: e.target.value})}
                           className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-blue-500/50 transition-all font-bold appearance-none"
                         >
                            <option value="web" className="bg-slate-900">Web Development</option>
                            <option value="api" className="bg-slate-900">API / Backend</option>
                            <option value="arquitectura" className="bg-slate-900">Arquitectura</option>
                         </select>
                      </div>
                   </div>

                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Descripción Corta (Card)</label>
                      <textarea 
                        value={formData.description} 
                        onChange={e => setFormData({...formData, description: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-blue-500/50 transition-all min-h-[100px] text-sm"
                        placeholder="Breve resumen para la tarjeta principal..."
                        required
                      />
                   </div>

                   <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Live Demo URL</label>
                         <div className="relative">
                            <Globe size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                            <input 
                               value={formData.liveUrl || ''} 
                               onChange={e => setFormData({...formData, liveUrl: e.target.value})}
                               className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 outline-none focus:border-blue-500/50 transition-all text-xs"
                               placeholder="https://..."
                            />
                         </div>
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">GitHub URL</label>
                         <div className="relative">
                            <Github size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                            <input 
                               value={formData.githubUrl || ''} 
                               onChange={e => setFormData({...formData, githubUrl: e.target.value})}
                               className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 outline-none focus:border-blue-500/50 transition-all text-xs"
                               placeholder="https://github.com/..."
                            />
                         </div>
                      </div>
                   </div>

                   <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Tecnologías</label>
                      <div className="flex gap-2">
                         <input 
                            value={techInput}
                            onChange={e => setTechInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTech())}
                            className="flex-grow bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-blue-500/50 transition-all text-sm"
                            placeholder="Añadir tecnología (Ej: React)..."
                         />
                         <button type="button" onClick={addTech} className="px-6 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 font-bold text-xs uppercase transition-all">Añadir</button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                         {formData.technologies?.map((tech, i) => (
                           <span key={i} className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-[10px] font-bold">
                              {tech.name}
                              <X size={12} className="cursor-pointer hover:text-white" onClick={() => removeTech(tech.name)} />
                           </span>
                         ))}
                      </div>
                   </div>

                   <div className="flex items-center gap-12 p-6 bg-white/5 rounded-2xl border border-white/5">
                      <label className="flex items-center gap-4 cursor-pointer group">
                         <div className="relative w-6 h-6 border-2 border-white/20 rounded group-hover:border-blue-500 transition-all">
                            {formData.featured && <div className="absolute inset-1 bg-blue-500 rounded-sm" />}
                         </div>
                         <input type="checkbox" className="hidden" checked={formData.featured} onChange={e => setFormData({...formData, featured: e.target.checked})} />
                         <span className="text-sm font-bold text-slate-400 group-hover:text-white transition-colors">Proyecto Destacado</span>
                      </label>

                      <div className="flex items-center gap-4">
                         <span className="text-sm font-bold text-slate-400">Estado:</span>
                         <div className="flex p-1 bg-black/40 rounded-xl border border-white/5">
                            <button 
                              type="button" 
                              onClick={() => setFormData({...formData, status: 'PUBLISHED'})}
                              className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${formData.status === 'PUBLISHED' ? 'bg-green-500 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
                            > Publicado </button>
                            <button 
                              type="button" 
                              onClick={() => setFormData({...formData, status: 'DRAFT'})}
                              className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${formData.status === 'DRAFT' ? 'bg-yellow-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
                            > Borrador </button>
                         </div>
                      </div>
                   </div>
                </form>

                <div className="p-8 bg-black/40 border-t border-white/5 flex gap-4">
                   <button 
                     type="submit" 
                     onClick={handleSave}
                     className="flex-grow bg-primary hover:bg-blue-600 text-primary-foreground py-4 rounded-2xl font-black flex items-center justify-center gap-3 transition-all active:scale-95 shadow-2xl shadow-blue-500/20"
                   >
                      <Save size={20} /> GUARDAR PROYECTO
                   </button>
                   <button onClick={closeModal} className="px-8 py-4 glass-card rounded-2xl font-bold text-slate-400 hover:text-white transition-all">
                      CANCELAR
                   </button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
