import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutGrid, User, Mail, Shield, 
  FileText, Briefcase, Cpu, GraduationCap,
  RefreshCcw, Search, ChevronRight, 
  Loader2, AlertCircle, Calendar, ExternalLink
} from 'lucide-react';
import { api } from '../../services/api';

const CATEGORIES = [
  { id: 'project', name: 'Mis Proyectos', description: 'Trabajos y demostraciones', icon: LayoutGrid, color: 'bg-blue-500' },
  { id: 'profile', name: 'Mi Perfil', description: 'Información personal y bio', icon: User, color: 'bg-purple-500' },
  { id: 'contactMessage', name: 'Mensajes Recibidos', description: 'Consultas de visitantes', icon: Mail, color: 'bg-green-500' },
  { id: 'post', name: 'Blog / Noticias', description: 'Artículos publicados', icon: FileText, color: 'bg-orange-500' },
  { id: 'experience', name: 'Experiencia', description: 'Historial laboral', icon: Briefcase, color: 'bg-indigo-500' },
  { id: 'skill', name: 'Habilidades', description: 'Tecnologías y niveles', icon: Cpu, color: 'bg-cyan-500' },
];

export const DatabaseExplorer = () => {
  const [activeCat, setActiveCat] = useState(CATEGORIES[0].id);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  const fetchData = async (id: string) => {
    setLoading(true);
    try {
      const { data: response } = await api.get(`/system/db?table=${id}`);
      setData(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(activeCat);
  }, [activeCat]);

  const filtered = data.filter(item => 
    JSON.stringify(item).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="py-6 md:py-10 space-y-8 max-w-7xl mx-auto px-4">
      <header className="space-y-4">
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter">
          Gestor de Información<span className="text-primary">.</span>
        </h1>
        <p className="text-lg text-foreground/60 font-medium max-w-2xl">
          Aquí puedes ver todos los datos que tienes guardados en tu portfolio de forma clara y organizada.
        </p>
      </header>

      {/* Selector de Categorías Gigante */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCat(cat.id)}
            className={`p-6 rounded-3xl transition-all flex flex-col items-center gap-4 text-center border-2 ${
              activeCat === cat.id 
                ? 'bg-primary/10 border-primary shadow-xl shadow-primary/10' 
                : 'bg-foreground/[0.03] border-transparent hover:border-foreground/10'
            }`}
          >
            <div className={`p-4 rounded-2xl ${cat.color} text-white shadow-lg`}>
              <cat.icon size={24} />
            </div>
            <div>
              <div className="font-bold text-sm">{cat.name}</div>
              <div className="text-[10px] opacity-40 font-bold uppercase tracking-widest mt-1">{data.length && activeCat === cat.id ? `${data.length} ítems` : cat.id}</div>
            </div>
          </button>
        ))}
      </div>

      <div className="space-y-6">
        <div className="relative">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-foreground/20" size={20} />
          <input 
            type="text"
            placeholder="Buscar cualquier dato..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-foreground/[0.03] border border-border rounded-3xl py-6 pl-16 pr-6 outline-none focus:border-primary/50 transition-all font-bold text-lg"
          />
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center gap-4 opacity-40">
            <Loader2 className="animate-spin" size={48} />
            <p className="font-bold tracking-widest uppercase text-xs">Cargando datos...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            <AnimatePresence mode="popLayout">
              {filtered.map((item, i) => (
                <motion.div
                  key={item.id || i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass-card p-8 hover:border-primary/40 transition-all group relative overflow-hidden"
                >
                  {/* Decoración de fondo */}
                  <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/20 transition-colors" />
                  
                  <div className="flex items-start justify-between mb-6">
                    <div className="space-y-1">
                      <div className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Registro Oficial</div>
                      <h3 className="text-xl font-black tracking-tight leading-none">
                        {item.title || item.name || item.company || item.subject || 'Sin Título'}
                      </h3>
                    </div>
                    {item.createdAt && (
                      <div className="flex items-center gap-2 text-[10px] font-bold opacity-30">
                        <Calendar size={12} /> {new Date(item.createdAt).toLocaleDateString()}
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    {/* Campos de texto */}
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(item).map(([key, val]: [string, any]) => {
                        if (['id', 'createdAt', 'updatedAt', 'title', 'name', 'company', 'subject', 'bio', 'description', 'manual', 'content'].includes(key)) return null;
                        if (typeof val === 'object' || !val) return null;
                        if (String(val).length > 50) return null;
                        
                        return (
                          <div key={key} className="space-y-1">
                            <div className="text-[10px] font-black uppercase tracking-widest opacity-30">{key}</div>
                            <div className="text-sm font-bold truncate">{String(val)}</div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Descripciones largas */}
                    {['bio', 'description', 'manual'].map(key => item[key] && (
                      <div key={key} className="pt-4 border-t border-border/50">
                        <div className="text-[10px] font-black uppercase tracking-widest opacity-30 mb-2">{key}</div>
                        <p className="text-xs leading-relaxed font-medium opacity-70 line-clamp-2 group-hover:line-clamp-none transition-all">
                          {item[key]}
                        </p>
                      </div>
                    ))}

                    {/* Imágenes */}
                    {['avatarUrl', 'imageUrl'].map(key => item[key] && (
                      <div key={key} className="pt-4">
                         <img src={item[key]} alt="Preview" className="w-full h-32 object-cover rounded-2xl border border-border" />
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                     <span className="text-[10px] font-mono opacity-30">{item.id}</span>
                     <button className="flex items-center gap-2 text-xs font-black text-primary uppercase tracking-widest">
                       Ver Detalles <ExternalLink size={14} />
                     </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};
