import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Search, Edit2, Trash2, ExternalLink, 
  X, Loader2, Save, Image as ImageIcon, 
  Tag, Newspaper, FileText, CheckCircle, 
  Eye, EyeOff, Calendar, LayoutGrid
} from 'lucide-react';
import { api } from '../../services/api';

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  published: boolean;
  publishedAt?: string;
  tags: { name: string }[];
}

export const BlogPostsManager = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [formData, setFormData] = useState<Partial<Post>>({
    title: '',
    excerpt: '',
    content: '',
    published: false,
    tags: []
  });
  const [tagInput, setTagInput] = useState('');

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/posts');
      setPosts(data.data || []);
    } catch (err) {
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const openModal = (post?: Post) => {
    if (post) {
      setEditingPost(post);
      setFormData(post);
    } else {
      setEditingPost(null);
      setFormData({
        title: '',
        excerpt: '',
        content: '',
        published: false,
        tags: []
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPost(null);
    setFormData({ title: '', excerpt: '', content: '', published: false, tags: [] });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        tags: formData.tags?.map((t: any) => typeof t === 'object' ? t.name : t)
      };

      if (editingPost) {
        await api.put(`/posts/${editingPost.id}`, payload);
      } else {
        const slug = formData.title?.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '') || 'new-post';
        await api.post('/posts', { ...payload, slug });
      }
      fetchPosts();
      closeModal();
    } catch (err) {
      console.error('Error saving post:', err);
      alert('Error al guardar el artículo. Revisa la consola.');
    }
  };

  const deletePost = async (id: string) => {
    if (!window.confirm('¿Eliminar este artículo definitivamente?')) return;
    try {
      await api.delete(`/posts/${id}`);
      fetchPosts();
    } catch (err) {
      console.error('Error deleting post:', err);
    }
  };

  const addTag = () => {
    if (!tagInput.trim()) return;
    const currentTags = formData.tags || [];
    if (!currentTags.find(t => t.name === tagInput.trim())) {
      setFormData({ ...formData, tags: [...currentTags, { name: tagInput.trim() }] });
    }
    setTagInput('');
  };

  const removeTag = (name: string) => {
    setFormData({ ...formData, tags: formData.tags?.filter(t => t.name !== name) });
  };

  return (
    <div className="py-10 space-y-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
           <div className="flex items-center gap-3 text-indigo-400 font-bold uppercase tracking-[0.3em] text-[10px] mb-4">
              <Newspaper size={14} className="fill-current" /> Blog Engine v2.0
           </div>
           <h1 className="text-5xl font-black tracking-tight leading-tight">
              Artículos <span className="text-slate-600">& Publicaciones.</span>
           </h1>
        </div>
        <button 
          onClick={() => openModal()}
          className="flex items-center gap-4 px-8 py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black shadow-2xl shadow-indigo-500/20 active:scale-95 transition-all"
        >
          NUEVO ARTÍCULO <Plus size={20} />
        </button>
      </header>

      {/* Grid de Artículos */}
      <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
        {loading ? (
          [1,2].map(i => <div key={i} className="h-64 glass-card animate-pulse opacity-50 bg-white/5" />)
        ) : posts.length === 0 ? (
          <div className="col-span-full py-20 glass-card border-dashed flex flex-col items-center gap-6 text-slate-500">
             <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center border border-white/10 opacity-20">
                <FileText size={48} />
             </div>
             <p className="font-bold uppercase tracking-[0.2em] text-[10px] text-slate-600">No hay publicaciones en el archivo</p>
          </div>
        ) : (
          posts.map((post) => (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} key={post.id} className="glass-card group flex flex-col border-white/5 hover:border-indigo-500/30 overflow-hidden">
               <div className="p-8 flex-grow space-y-6">
                  <div className="flex items-start justify-between">
                     <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full blur-[2px] ${post.published ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-yellow-500 shadow-[0_0_8px_#eab308]'}`} />
                        <span className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-500">
                           {post.published ? 'Publicado' : 'Borrador'} • {post.tags.length} Tags
                        </span>
                     </div>
                     <div className="flex gap-2">
                        <button onClick={() => openModal(post)} className="p-3 bg-white/5 hover:bg-indigo-500/20 rounded-xl border border-white/5 transition-all text-indigo-400"><Edit2 size={16} /></button>
                        <button onClick={() => deletePost(post.id)} className="p-3 bg-white/5 hover:bg-red-500/20 rounded-xl border border-white/5 transition-all text-red-400"><Trash2 size={16} /></button>
                     </div>
                  </div>

                  <h3 className="text-3xl font-black tracking-tighter uppercase italic leading-none group-hover:text-indigo-400 transition-colors">{post.title}</h3>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed line-clamp-2 italic border-l-2 border-white/5 pl-6">{post.excerpt}</p>
                  
                  <div className="flex flex-wrap gap-2 pt-4">
                     {post.tags.map((t, i) => (
                       <span key={i} className="text-[10px] px-3 py-1 bg-white/5 rounded-lg border border-white/5 font-black uppercase text-slate-500 tracking-wider">#{t.name}</span>
                     ))}
                  </div>
               </div>
               
               <div className="px-8 py-5 bg-white/5 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-600 uppercase tracking-widest font-black">
                  <div className="flex items-center gap-3"><Calendar size={14} /> {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'SIN FECHA'}</div>
                  <div className="text-indigo-400/50">SLUG: {post.slug}</div>
               </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Modal Form */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeModal} className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" />
             
             <motion.div 
               initial={{ opacity: 0, scale: 0.9, y: 30 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.9, y: 30 }}
               className="relative w-full max-w-4xl glass-card p-0 overflow-hidden shadow-3xl"
             >
                <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/5">
                   <h2 className="text-2xl font-black flex items-center gap-4"><FileText size={24} className="text-indigo-400" /> {editingPost ? 'Editar Artículo' : 'Nuevo Artículo'}</h2>
                   <button onClick={closeModal} className="p-2 hover:bg-white/10 rounded-full transition-all"><X size={24} /></button>
                </div>

                <form onSubmit={handleSave} className="p-10 space-y-10 max-h-[75vh] overflow-y-auto custom-scrollbar">
                   <div className="grid md:grid-cols-3 gap-10">
                      <div className="md:col-span-2 space-y-10">
                         <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Título de la Publicación</label>
                            <input 
                              value={formData.title} 
                              onChange={e => setFormData({...formData, title: e.target.value})}
                              className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 outline-none focus:border-indigo-500/50 transition-all font-black text-xl italic uppercase tracking-tighter"
                              placeholder="FUTURISMO DIGITAL EN EL SIGLO XXI"
                              required
                            />
                         </div>

                         <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Extracto / Resumen (Excerpt)</label>
                            <textarea 
                              value={formData.excerpt} 
                              onChange={e => setFormData({...formData, excerpt: e.target.value})}
                              className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 outline-none focus:border-indigo-500/50 transition-all min-h-[120px] text-sm leading-relaxed"
                              placeholder="Una breve introducción que captará la atención del lector..."
                              required
                            />
                         </div>
                      </div>

                      <div className="space-y-10">
                         <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Estado de Publicación</label>
                            <div className="flex p-2 bg-black/40 rounded-2xl border border-white/5">
                               <button 
                                 type="button" 
                                 onClick={() => setFormData({...formData, published: true})}
                                 className={`flex-grow py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all gap-2 flex items-center justify-center ${formData.published ? 'bg-green-600 text-white shadow-xl' : 'text-slate-500 hover:text-white'}`}
                               > <Eye size={14} /> Publicado </button>
                               <button 
                                 type="button" 
                                 onClick={() => setFormData({...formData, published: false})}
                                 className={`flex-grow py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all gap-2 flex items-center justify-center ${!formData.published ? 'bg-yellow-600 text-white shadow-xl' : 'text-slate-500 hover:text-white'}`}
                               > <EyeOff size={14} /> Borrador </button>
                            </div>
                         </div>

                         <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Tags / Etiquetas</label>
                            <div className="flex gap-4">
                               <input 
                                  value={tagInput}
                                  onChange={e => setTagInput(e.target.value)}
                                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                                  className="flex-grow bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:border-indigo-500/50 transition-all text-xs"
                                  placeholder="Tag (Ej: IA)..."
                               />
                               <button type="button" onClick={addTag} className="p-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black transition-all"><Plus size={20} /></button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                               {formData.tags?.map((tag, i) => (
                                 <span key={i} className="flex items-center gap-2 px-3 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400 text-[10px] font-black uppercase tracking-widest">
                                    #{tag.name}
                                    <X size={12} className="cursor-pointer hover:text-white" onClick={() => removeTag(tag.name)} />
                                 </span>
                               ))}
                            </div>
                         </div>
                      </div>
                   </div>

                   <div className="space-y-4">
                      <div className="flex items-center justify-between ml-1">
                         <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Contenido Principal (Markdown / HTML)</label>
                         <div className="text-[9px] font-mono text-indigo-400/40 uppercase tracking-widest">Format: rich_text_stream.txt</div>
                      </div>
                      <textarea 
                        value={formData.content} 
                        onChange={e => setFormData({...formData, content: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-[2.5rem] p-10 outline-none focus:border-indigo-500/50 transition-all min-h-[400px] text-sm font-mono leading-relaxed text-slate-300"
                        placeholder="Escribe el contenido de tu artículo aquí... Utiliza Markdown para estructurar el texto."
                        required
                      />
                   </div>
                </form>

                <div className="p-10 bg-black/40 border-t border-white/5 flex gap-6">
                   <button 
                     type="submit" 
                     onClick={handleSave}
                     className="flex-grow bg-indigo-600 hover:bg-indigo-500 text-white py-6 rounded-[2rem] font-black flex items-center justify-center gap-4 transition-all active:scale-95 shadow-2xl shadow-indigo-500/40"
                   >
                      <Save size={24} /> DESPLEGAR ARTÍCULO
                   </button>
                   <button onClick={closeModal} className="px-12 py-6 glass-card rounded-[2rem] font-bold text-slate-400 hover:text-white transition-all uppercase text-xs tracking-widest">
                      Abortar
                   </button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
