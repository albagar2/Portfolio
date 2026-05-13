import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Search, Edit2, Trash2, ExternalLink, 
  Github, LayoutGrid, List, X, Loader2, Save,
  Image as ImageIcon, Tag, Hash, Globe,
  ArrowUp, ArrowDown, MoveVertical, Check, CheckCircle2, Brain, Activity, Zap
} from 'lucide-react';
import { api } from '../../services/api';
import { useNotification } from '../../context/NotificationContext';

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
  challenges?: string;
  solved?: string;
  evolution?: string;
  limitations?: string;
}

export const ProjectsManager = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { showNotification } = useNotification();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReordering, setIsReordering] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState<Partial<Project>>({
    title: '',
    description: '',
    category: 'web',
    status: 'PUBLISHED',
    featured: false,
    technologies: [],
    challenges: '',
    solved: '',
    evolution: '',
    limitations: '',
    manual: ''
  });
  const [techInput, setTechInput] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formDataLocal = new FormData();
    formDataLocal.append('file', file);

    try {
      setUploading(true);
      const { data } = await api.post('/upload', formDataLocal, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setFormData({ ...formData, imageUrl: data.data.url });
      showNotification('Imagen subida con éxito', 'success');
    } catch (err) {
      console.error('Error uploading:', err);
      showNotification('Error al subir la imagen', 'error');
    } finally {
      setUploading(false);
    }
  };

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
        technologies: [],
        challenges: '',
        solved: '',
        evolution: '',
        limitations: '',
        manual: ''
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
      showNotification(editingProject ? 'PROYECTO_ACTUALIZADO_CORRECTAMENTE' : 'PROYECTO_CREADO_CORRECTAMENTE', 'success');
      fetchProjects();
      closeModal();
    } catch (err) {
      console.error('Error saving project:', err);
      showNotification('ERROR_AL_GUARDAR_PROYECTO', 'error');
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

  const moveProject = (index: number, direction: 'up' | 'down') => {
    const newProjects = [...projects];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex < 0 || targetIndex >= newProjects.length) return;
    
    [newProjects[index], newProjects[targetIndex]] = [newProjects[targetIndex], newProjects[index]];
    setProjects(newProjects);
  };

  const saveNewOrder = async () => {
    try {
      setLoading(true);
      const ids = projects.map(p => p.id);
      await api.patch('/projects/reorder', { ids });
      showNotification('Orden actualizado correctamente', 'success');
      setIsReordering(false);
      fetchProjects();
    } catch (err) {
      console.error('Error reordering:', err);
      showNotification('Error al guardar el nuevo orden', 'error');
    } finally {
      setLoading(false);
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
           <p className="text-foreground/85 font-medium">Gestiona y edita tu galería visual de trabajos.</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => {
              if (isReordering) {
                saveNewOrder();
              } else {
                setIsReordering(true);
              }
            }}
            className={`flex items-center gap-4 px-8 py-5 rounded-2xl font-bold transition-all active:scale-95 ${
              isReordering 
                ? 'bg-green-500 text-white shadow-lg shadow-green-500/20' 
                : 'bg-foreground/[0.05] hover:bg-foreground/10 border border-border'
            }`}
          >
            {isReordering ? (
              <>Guardar Orden <Check size={20} /></>
            ) : (
              <>Reordenar <MoveVertical size={20} /></>
            )}
          </button>

          <button 
            onClick={() => openModal()}
            className="flex items-center gap-4 px-8 py-5 bg-primary rounded-2xl font-bold shadow-2xl shadow-blue-500/20 active:scale-95 transition-all text-white"
          >
            Nuevo Proyecto <Plus size={20} />
          </button>
        </div>
      </header>

      {/* Grid de Proyectos */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          [1,2,3].map(i => <div key={i} className="h-64 glass-card animate-pulse opacity-50 bg-foreground/[0.05]" />)
        ) : projects.length === 0 ? (
          <div className="col-span-full py-20 glass-card border-dashed flex flex-col items-center gap-4 text-foreground/85">
             <LayoutGrid size={48} className="opacity-20" />
             <p className="font-bold uppercase tracking-widest text-xs text-foreground/95">No hay proyectos activos</p>
          </div>
        ) : (
          projects.map((project, index) => (
            <motion.div 
              key={project.id} 
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`glass-card group flex flex-col ${isReordering ? 'border-primary/50 bg-primary/5 shadow-xl shadow-primary/10' : ''}`}
            >
               <div className="h-40 bg-foreground/[0.05] overflow-hidden relative border-b border-border">
                  <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-20"><ImageIcon size={48} /></div>
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {isReordering ? (
                        <>
                          <button 
                            disabled={index === 0}
                            onClick={() => moveProject(index, 'up')} 
                            className="p-2 bg-primary/20 hover:bg-primary/40 rounded-lg backdrop-blur-md border border-primary/30 disabled:opacity-30"
                          >
                            <ArrowUp size={16} />
                          </button>
                          <button 
                            disabled={index === projects.length - 1}
                            onClick={() => moveProject(index, 'down')} 
                            className="p-2 bg-primary/20 hover:bg-primary/40 rounded-lg backdrop-blur-md border border-primary/30 disabled:opacity-30"
                          >
                            <ArrowDown size={16} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => openModal(project)} className="p-2 bg-foreground/10 hover:bg-blue-500/20 rounded-lg backdrop-blur-md border border-border"><Edit2 size={16} /></button>
                          <button onClick={() => deleteProject(project.id)} className="p-2 bg-foreground/10 hover:bg-red-500/20 rounded-lg backdrop-blur-md border border-border"><Trash2 size={16} /></button>
                        </>
                      )}
                  </div>
                  {isReordering && (
                    <div className="absolute top-4 left-4">
                      <div className="bg-primary text-white text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center shadow-lg">
                        {index + 1}
                      </div>
                    </div>
                  )}
               </div>
               <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                     <span className={`w-2 h-2 rounded-full ${project.status === 'PUBLISHED' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                     <span className="text-[10px] uppercase font-bold tracking-widest text-foreground/85">
                        {project.status === 'PUBLISHED' ? 'Publicado' : 'Borrador'}
                        {project.featured && ' • Destacado'}
                     </span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                  <p className="text-xs text-foreground/85 line-clamp-2 mb-4">{project.description}</p>
                  
                  <div className="flex flex-wrap gap-2 pt-4 border-t border-border">
                     {project.technologies.slice(0, 3).map((t, i) => (
                       <span key={i} className="text-[10px] px-2 py-0.5 bg-foreground/[0.05] rounded text-foreground/40">{t.name}</span>
                     ))}
                  </div>
               </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Modal Form */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeModal} className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
             
             <motion.div 
               initial={{ opacity: 0, scale: 0.95, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.95, y: 20 }}
               className="relative w-full max-w-2xl glass-card p-0 overflow-hidden shadow-2xl"
             >
                <div className="p-8 border-b border-border flex justify-between items-center bg-foreground/[0.05]">
                   <h2 className="text-2xl font-black">{editingProject ? 'Editar Proyecto' : 'Nuevo Proyecto'}</h2>
                   <button onClick={closeModal} className="p-2 hover:bg-foreground/10 rounded-full transition-all"><X size={24} /></button>
                </div>

                <form onSubmit={handleSave} className="p-8 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                   {/* Col 1 */}
                   <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-foreground/85 ml-1">Título del Proyecto</label>
                         <input 
                           value={formData.title} 
                           onChange={e => setFormData({...formData, title: e.target.value})}
                           className="w-full bg-foreground/[0.05] border border-border rounded-xl p-4 outline-none focus:border-blue-500/50 transition-all font-bold"
                           placeholder="E-Commerce API"
                           required
                         />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-foreground/85 ml-1">Categoría</label>
                         <select 
                           value={formData.category} 
                           onChange={e => setFormData({...formData, category: e.target.value})}
                           className="w-full bg-foreground/[0.05] border border-border rounded-xl p-4 outline-none focus:border-blue-500/50 transition-all font-bold appearance-none"
                         >
                            <option value="web" className="bg-[#0f172a] text-white">Web Development</option>
                            <option value="api" className="bg-[#0f172a] text-white">API / Backend</option>
                            <option value="arquitectura" className="bg-[#0f172a] text-white">Arquitectura</option>
                         </select>
                      </div>
                   </div>

                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-foreground ml-1">Imagen del Proyecto</label>
                      <div className="flex flex-col md:flex-row gap-6">
                         {/* Vista Previa */}
                         <div className="w-full md:w-48 h-32 rounded-2xl bg-foreground/[0.05] border border-border flex items-center justify-center overflow-hidden">
                            {formData.imageUrl ? (
                              <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                              <ImageIcon size={32} className="opacity-20" />
                            )}
                         </div>

                         <div className="flex-grow space-y-4">
                            <div className="relative">
                               <ImageIcon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40" />
                               <input 
                                 value={formData.imageUrl || ''} 
                                 onChange={e => setFormData({...formData, imageUrl: e.target.value})}
                                 className="w-full bg-foreground/[0.05] border border-border rounded-xl py-4 pl-12 pr-4 outline-none focus:border-blue-500/50 transition-all text-xs font-bold"
                                 placeholder="URL de la imagen o sube un archivo..."
                               />
                            </div>
                            
                            <label className="flex items-center justify-center gap-3 px-6 py-4 bg-foreground/[0.05] hover:bg-foreground/10 border border-border border-dashed rounded-xl cursor-pointer transition-all active:scale-95 group">
                               {uploading ? <Loader2 className="animate-spin" size={18} /> : <div className="flex items-center gap-3 font-bold text-[10px] uppercase tracking-widest group-hover:text-blue-400 transition-colors"> <ImageIcon size={18} /> Seleccionar archivo (.png, .jpg) </div>}
                               <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} disabled={uploading} />
                            </label>
                         </div>
                      </div>
                    </div>

                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-foreground ml-1">Descripción Corta (Card)</label>
                      <textarea 
                        value={formData.description} 
                        onChange={e => setFormData({...formData, description: e.target.value})}
                        className="w-full bg-foreground/[0.05] border border-border rounded-xl p-4 outline-none focus:border-blue-500/50 transition-all min-h-[80px] text-sm"
                        placeholder="Breve resumen para la tarjeta principal..."
                        required
                      />
                   </div>

                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[var(--color-lime)] ml-1 flex items-center gap-2"> <Globe size={12} /> Explicación Detallada (Qué hace)</label>
                      <textarea 
                        value={formData.longDescription} 
                        onChange={e => setFormData({...formData, longDescription: e.target.value})}
                        className="w-full bg-foreground/[0.05] border border-border rounded-xl p-4 outline-none focus:border-blue-500/50 transition-all min-h-[120px] text-sm"
                        placeholder="Documentación completa del sistema..."
                      />
                   </div>

                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[var(--color-aqua)] ml-1 flex items-center gap-2"> <CheckCircle2 size={12} /> Problemas Resueltos</label>
                      <textarea 
                        value={formData.solved} 
                        onChange={e => setFormData({...formData, solved: e.target.value})}
                        className="w-full bg-foreground/[0.05] border border-border rounded-xl p-4 outline-none focus:border-blue-500/50 transition-all min-h-[100px] text-sm"
                        placeholder="¿Qué problemas específicos resolvió este sistema?"
                      />
                   </div>

                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-red-400 ml-1 flex items-center gap-2"> <Brain size={12} /> Retos Técnicos</label>
                      <textarea 
                        value={formData.challenges} 
                        onChange={e => setFormData({...formData, challenges: e.target.value})}
                        className="w-full bg-foreground/[0.05] border border-border rounded-xl p-4 outline-none focus:border-blue-500/50 transition-all min-h-[100px] text-sm"
                        placeholder="¿Cuáles fueron los mayores desafíos de ingeniería?"
                      />
                   </div>

                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-purple-400 ml-1 flex items-center gap-2"> <Activity size={12} /> Evolución del Proyecto</label>
                      <textarea 
                        value={formData.evolution} 
                        onChange={e => setFormData({...formData, evolution: e.target.value})}
                        className="w-full bg-foreground/[0.05] border border-border rounded-xl p-4 outline-none focus:border-blue-500/50 transition-all min-h-[100px] text-sm"
                        placeholder="¿Cómo ha evolucionado el proyecto desde su inicio?"
                      />
                   </div>

                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-cyan-400 ml-1 flex items-center gap-2"> <Code2 size={12} /> Manual de Usuario y Funciones</label>
                       <textarea 
                         value={formData.manual} 
                         onChange={e => setFormData({...formData, manual: e.target.value})}
                         className="w-full bg-foreground/[0.05] border border-border rounded-xl p-4 outline-none focus:border-blue-500/50 transition-all min-h-[150px] text-sm font-mono"
                         placeholder="Escribe aquí el manual paso a paso del proyecto..."
                       />
                    </div>

                   <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-foreground/85 ml-1">Live Demo URL</label>
                         <div className="relative">
                            <Globe size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/85" />
                            <input 
                               value={formData.liveUrl || ''} 
                               onChange={e => setFormData({...formData, liveUrl: e.target.value})}
                               className="w-full bg-foreground/[0.05] border border-border rounded-xl py-4 pl-12 pr-4 outline-none focus:border-blue-500/50 transition-all text-xs"
                               placeholder="https://..."
                            />
                         </div>
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-foreground/85 ml-1">GitHub URL</label>
                         <div className="relative">
                            <Github size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/85" />
                            <input 
                               value={formData.githubUrl || ''} 
                               onChange={e => setFormData({...formData, githubUrl: e.target.value})}
                               className="w-full bg-foreground/[0.05] border border-border rounded-xl py-4 pl-12 pr-4 outline-none focus:border-blue-500/50 transition-all text-xs"
                               placeholder="https://github.com/..."
                            />
                         </div>
                      </div>
                   </div>

                   <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-foreground/85 ml-1">Tecnologías</label>
                      <div className="flex gap-2">
                         <input 
                            value={techInput}
                            onChange={e => setTechInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTech())}
                            className="flex-grow bg-foreground/[0.05] border border-border rounded-xl p-4 outline-none focus:border-blue-500/50 transition-all text-sm"
                            placeholder="Añadir tecnología (Ej: React)..."
                         />
                         <button type="button" onClick={addTech} className="px-6 bg-foreground/[0.05] hover:bg-foreground/10 rounded-xl border border-border font-bold text-xs uppercase transition-all">Añadir</button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                         {formData.technologies?.map((tech, i) => (
                           <span key={i} className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-[10px] font-bold">
                              {tech.name}
                              <X size={12} className="cursor-pointer hover:text-foreground" onClick={() => removeTech(tech.name)} />
                           </span>
                         ))}
                      </div>
                   </div>

                   <div className="flex items-center gap-12 p-6 bg-foreground/[0.05] rounded-2xl border border-border">
                      <label className="flex items-center gap-4 cursor-pointer group">
                         <div className="relative w-6 h-6 border-2 border-border rounded group-hover:border-blue-500 transition-all">
                            {formData.featured && <div className="absolute inset-1 bg-blue-500 rounded-sm" />}
                         </div>
                         <input type="checkbox" className="hidden" checked={formData.featured} onChange={e => setFormData({...formData, featured: e.target.checked})} />
                         <span className="text-sm font-bold text-foreground/80 group-hover:text-foreground transition-colors">Proyecto Destacado</span>
                      </label>

                      <div className="flex items-center gap-4">
                         <span className="text-sm font-bold text-foreground/80">Estado:</span>
                         <div className="flex p-1 bg-foreground/[0.05] rounded-xl border border-border">
                            <button 
                              type="button" 
                              onClick={() => setFormData({...formData, status: 'PUBLISHED'})}
                              className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${formData.status === 'PUBLISHED' ? 'bg-green-500 text-foreground shadow-lg' : 'text-foreground/85 hover:text-foreground'}`}
                            > Publicado </button>
                            <button 
                              type="button" 
                              onClick={() => setFormData({...formData, status: 'DRAFT'})}
                              className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${formData.status === 'DRAFT' ? 'bg-yellow-600 text-foreground shadow-lg' : 'text-foreground/85 hover:text-foreground'}`}
                            > Borrador </button>
                         </div>
                      </div>
                   </div>
                </form>

                <div className="p-8 bg-foreground/[0.05] border-t border-border flex gap-4">
                   <button 
                     type="submit" 
                     onClick={handleSave}
                     className="flex-grow bg-primary hover:bg-blue-600 text-primary-foreground py-4 rounded-2xl font-black flex items-center justify-center gap-3 transition-all active:scale-95 shadow-2xl shadow-blue-500/20"
                   >
                      <Save size={20} /> GUARDAR PROYECTO
                   </button>
                   <button onClick={closeModal} className="px-8 py-4 glass-card rounded-2xl font-bold text-foreground/80 hover:text-foreground transition-all">
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
