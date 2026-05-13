import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Database, Table as TableIcon, RefreshCcw, 
  Search, ChevronRight, Hash, Calendar, 
  Loader2, AlertCircle, Eye, Copy, 
  Check, Image as ImageIcon, Link as LinkIcon
} from 'lucide-react';
import { api } from '../../services/api';

const TABLES = [
  { id: 'project', name: 'Proyectos', icon: 'LayoutGrid', color: 'text-blue-400' },
  { id: 'profile', name: 'Perfiles', icon: 'User', color: 'text-purple-400' },
  { id: 'contactMessage', name: 'Mensajes', icon: 'Mail', color: 'text-green-400' },
  { id: 'user', name: 'Usuarios', icon: 'Shield', color: 'text-red-400' },
  { id: 'post', name: 'Blog Posts', icon: 'FileText', color: 'text-orange-400' },
  { id: 'experience', name: 'Experiencia', icon: 'Briefcase', color: 'text-indigo-400' },
  { id: 'skill', name: 'Habilidades', icon: 'Cpu', color: 'text-cyan-400' },
  { id: 'education', name: 'Educación', icon: 'GraduationCap', color: 'text-pink-400' },
];

export const DatabaseExplorer = () => {
  const [activeTable, setActiveTable] = useState(TABLES[0].id);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  const fetchData = async (tableId: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data: response } = await api.get(`/system/db?table=${tableId}`);
      setData(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al conectar con la base de datos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(activeTable);
  }, [activeTable]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredData = data.filter(item => 
    JSON.stringify(item).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="py-6 md:py-10 space-y-8 max-w-[1600px] mx-auto">
      {/* Header Premium */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4 md:px-0">
        <div className="space-y-2">
           <div className="flex items-center gap-3 text-primary font-black text-xs uppercase tracking-[0.3em]">
             <Database size={14} /> System Core Inspector
           </div>
           <h1 className="text-3xl md:text-5xl font-black tracking-tighter">
             Database Explorer<span className="text-primary">.</span>
           </h1>
           <p className="text-sm md:text-base text-foreground/60 font-medium max-w-xl">
             Visualización intuitiva de la persistencia de datos en tiempo real. 
             Inspecciona, verifica y gestiona el estado de tu ecosistema Railway.
           </p>
        </div>
        
        <button 
          onClick={() => fetchData(activeTable)}
          disabled={loading}
          className="flex items-center justify-center gap-3 px-8 py-5 bg-foreground text-background rounded-2xl font-black transition-all active:scale-95 disabled:opacity-50 shadow-2xl shadow-white/5"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : <RefreshCcw size={20} />}
          REFRESCAR MOTOR
        </button>
      </header>

      <div className="grid lg:grid-cols-[320px_1fr] gap-8 px-4 md:px-0">
        {/* Selector de Tablas (Estilo Sidebar) */}
        <aside className="space-y-6">
          <div className="glass-card p-6 space-y-4">
            <div className="text-[10px] font-black uppercase tracking-widest text-foreground/40 mb-4 px-2">Esquema de Datos</div>
            <div className="flex flex-col gap-2">
              {TABLES.map((table) => (
                <button
                  key={table.id}
                  onClick={() => setActiveTable(table.id)}
                  className={`flex items-center justify-between p-4 rounded-xl font-bold transition-all group ${
                    activeTable === table.id 
                      ? 'bg-primary text-white shadow-xl shadow-primary/30' 
                      : 'bg-foreground/[0.03] hover:bg-foreground/[0.08] border border-border'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <TableIcon size={18} className={activeTable === table.id ? 'text-white' : 'text-primary'} />
                    <span className="text-sm">{table.name}</span>
                  </div>
                  <ChevronRight size={16} className={`transition-transform ${activeTable === table.id ? 'translate-x-0' : '-translate-x-2 opacity-0 group-hover:opacity-100'}`} />
                </button>
              ))}
            </div>
          </div>

          <div className="glass-card p-6 bg-primary/5 border-primary/20">
             <div className="flex items-center gap-3 text-primary font-bold text-xs mb-2">
                <AlertCircle size={14} /> Nota Técnica
             </div>
             <p className="text-[10px] text-foreground/60 leading-relaxed font-medium">
               Los cambios realizados en el volumen de Railway son persistentes. 
               Esta vista muestra los últimos 50 registros de la tabla seleccionada.
             </p>
          </div>
        </aside>

        {/* Panel de Contenido */}
        <main className="space-y-8 overflow-hidden">
          {/* Barra de Filtro Inteligente */}
          <div className="relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-foreground/30 group-focus-within:text-primary transition-colors" size={20} />
            <input 
              type="text"
              placeholder={`Filtrar registros en ${activeTable.toUpperCase()}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-foreground/[0.03] border border-border rounded-3xl py-6 pl-16 pr-6 outline-none focus:border-primary/50 focus:bg-foreground/[0.05] transition-all font-bold text-lg shadow-inner"
            />
          </div>

          {error ? (
            <div className="glass-card p-20 flex flex-col items-center gap-6 text-red-400 border-red-500/20 bg-red-500/5 text-center">
              <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20">
                <AlertCircle size={40} />
              </div>
              <div className="space-y-2">
                <p className="text-2xl font-black tracking-tight">System Link Failure</p>
                <p className="text-sm opacity-60 max-w-xs mx-auto">{error}</p>
              </div>
            </div>
          ) : (
            <div className="grid gap-6">
              <AnimatePresence mode="popLayout">
                {filteredData.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }}
                    className="p-32 glass-card text-center flex flex-col items-center gap-6 opacity-40 italic"
                  >
                    <Search size={48} />
                    <p className="text-xl font-medium tracking-tight">No se han encontrado registros que coincidan...</p>
                  </motion.div>
                ) : (
                  filteredData.map((row, i) => (
                    <motion.div 
                      key={row.id || i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="glass-card group hover:border-primary/40 transition-all duration-500 overflow-hidden relative"
                    >
                      {/* Badge de ID y Fecha */}
                      <div className="flex flex-col md:flex-row items-center justify-between p-6 bg-foreground/[0.02] border-b border-border gap-4">
                        <div className="flex items-center gap-4">
                           <div className="p-3 bg-primary/10 rounded-xl text-primary">
                             <Hash size={18} />
                           </div>
                           <div className="flex flex-col">
                              <span className="text-[10px] font-black text-foreground/40 uppercase tracking-widest">Database Record ID</span>
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-sm font-bold text-primary">{row.id}</span>
                                <button 
                                  onClick={() => handleCopy(row.id, row.id)}
                                  className="p-1 hover:bg-foreground/10 rounded transition-colors"
                                >
                                  {copiedId === row.id ? <Check size={14} className="text-green-500" /> : <Copy size={14} className="opacity-40" />}
                                </button>
                              </div>
                           </div>
                        </div>
                        <div className="flex items-center gap-4 text-xs font-bold text-foreground/60">
                           <Calendar size={14} /> {new Date(row.createdAt).toLocaleString()}
                        </div>
                      </div>

                      {/* Contenido Inteligente */}
                      <div className="p-8 grid md:grid-cols-[1fr_350px] gap-12">
                        <div className="space-y-6">
                           {/* Renderizado dinámico de campos principales */}
                           <div className="grid sm:grid-cols-2 gap-8">
                              {Object.entries(row).map(([key, value]) => {
                                // Saltamos IDs y fechas que ya mostramos arriba, y campos muy largos
                                if (['id', 'createdAt', 'updatedAt', 'refreshToken', 'password'].includes(key)) return null;
                                if (typeof value === 'string' && value.length > 100) return null;
                                if (typeof value === 'object') return null;

                                return (
                                  <div key={key} className="space-y-1">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-foreground/30">{key.replace(/Url$/, ' URL')}</span>
                                    <div className="flex items-center gap-2">
                                      {key.toLowerCase().includes('url') && value ? <LinkIcon size={12} className="text-primary" /> : null}
                                      <span className="text-sm font-bold truncate max-w-full">
                                        {value === true ? 'VERDADERO' : value === false ? 'FALSO' : value || '—'}
                                      </span>
                                    </div>
                                  </div>
                                );
                              })}
                           </div>

                           {/* Renderizado de campos de texto largo (manual, bio, description) */}
                           {Object.entries(row).map(([key, value]) => {
                              if (typeof value === 'string' && value.length > 100 && !key.toLowerCase().includes('url')) {
                                return (
                                  <div key={key} className="space-y-2 pt-4 border-t border-border/50">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-foreground/30">{key}</span>
                                    <p className="text-xs leading-relaxed font-medium opacity-80 line-clamp-3 hover:line-clamp-none transition-all cursor-help">
                                      {value}
                                    </p>
                                  </div>
                                );
                              }
                              return null;
                           })}
                        </div>

                        {/* Sidebar del Record (Imágenes y JSON Raw) */}
                        <div className="space-y-6">
                           {/* Preview de Imágenes */}
                           {Object.entries(row).map(([key, value]) => {
                              if (typeof value === 'string' && (value.includes('http') && (value.match(/\.(jpg|jpeg|png|webp|gif|svg)/i) || key.toLowerCase().includes('avatar') || key.toLowerCase().includes('image')))) {
                                return (
                                  <div key={key} className="space-y-2">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-foreground/30">Preview: {key}</span>
                                    <div className="relative aspect-video rounded-2xl overflow-hidden border border-border group/img">
                                      <img src={value} alt="Preview" className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-1000" />
                                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                                        <button onClick={() => window.open(value, '_blank')} className="p-3 bg-white text-black rounded-full shadow-2xl">
                                           <ImageIcon size={20} />
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                );
                              }
                              return null;
                           })}

                           {/* Botón para ver JSON Crudo */}
                           <button 
                             onClick={() => setSelectedItem(selectedItem?.id === row.id ? null : row)}
                             className="w-full py-4 bg-foreground/[0.03] hover:bg-foreground/[0.08] border border-border rounded-xl font-bold text-xs flex items-center justify-center gap-3 transition-all"
                           >
                              <Eye size={16} />
                              {selectedItem?.id === row.id ? 'OCULTAR JSON' : 'INSPECCIONAR RAW JSON'}
                           </button>

                           {selectedItem?.id === row.id && (
                             <motion.div 
                               initial={{ opacity: 0, height: 0 }}
                               animate={{ opacity: 1, height: 'auto' }}
                               className="bg-slate-950 p-4 rounded-xl border border-primary/20 font-mono text-[10px] text-blue-300 overflow-x-auto"
                             >
                               <pre>{JSON.stringify(row, null, 2)}</pre>
                             </motion.div>
                           )}
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
