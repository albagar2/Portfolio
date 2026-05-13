import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Database, Table as TableIcon, RefreshCcw, 
  Search, ChevronRight, Hash, Calendar, 
  Database as DbIcon, Loader2, AlertCircle
} from 'lucide-react';
import { api } from '../../services/api';

const TABLES = [
  { id: 'project', name: 'Proyectos', icon: 'LayoutGrid' },
  { id: 'profile', name: 'Perfiles', icon: 'User' },
  { id: 'contactMessage', name: 'Mensajes', icon: 'Mail' },
  { id: 'user', name: 'Usuarios', icon: 'Shield' },
  { id: 'post', name: 'Blog Posts', icon: 'FileText' },
  { id: 'experience', name: 'Experiencia', icon: 'Briefcase' },
  { id: 'skill', name: 'Habilidades', icon: 'Cpu' },
  { id: 'education', name: 'Educación', icon: 'GraduationCap' },
];

export const DatabaseExplorer = () => {
  const [activeTable, setActiveTable] = useState(TABLES[0].id);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

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

  const filteredData = data.filter(item => 
    JSON.stringify(item).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="py-6 md:py-10 space-y-8 md:space-y-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
           <h1 className="text-3xl md:text-4xl font-black mb-2 flex items-center gap-4">
             Database Engine <Database className="text-primary" />
           </h1>
           <p className="text-sm md:text-base text-foreground/85 font-medium">
             Inspección técnica de tablas y persistencia en Railway.
           </p>
        </div>
        
        <button 
          onClick={() => fetchData(activeTable)}
          disabled={loading}
          className="flex items-center justify-center gap-3 px-6 py-4 bg-foreground/[0.05] hover:bg-foreground/10 border border-border rounded-2xl font-bold transition-all active:scale-95"
        >
          {loading ? <Loader2 className="animate-spin" size={18} /> : <RefreshCcw size={18} />}
          Refrescar
        </button>
      </header>

      <div className="grid lg:grid-cols-[280px_1fr] gap-8">
        {/* Sidebar de Tablas */}
        <aside className="space-y-4">
          <div className="text-[10px] font-black uppercase tracking-widest text-foreground/40 ml-2">Tablas del Sistema</div>
          <div className="flex flex-col gap-2">
            {TABLES.map((table) => (
              <button
                key={table.id}
                onClick={() => setActiveTable(table.id)}
                className={`flex items-center justify-between p-4 rounded-xl font-bold transition-all ${
                  activeTable === table.id 
                    ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                    : 'bg-foreground/[0.03] hover:bg-foreground/[0.08] border border-border'
                }`}
              >
                <div className="flex items-center gap-3">
                  <TableIcon size={18} />
                  <span className="text-sm">{table.name}</span>
                </div>
                {activeTable === table.id && <ChevronRight size={16} />}
              </button>
            ))}
          </div>
        </aside>

        {/* Visualizador de Datos */}
        <main className="space-y-6 overflow-hidden">
          {/* Barra de búsqueda */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40" size={18} />
            <input 
              type="text"
              placeholder={`Buscar en ${activeTable}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-foreground/[0.05] border border-border rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-primary/50 transition-all font-medium"
            />
          </div>

          {error ? (
            <div className="glass-card p-10 flex flex-col items-center gap-4 text-red-400 border-red-500/20 bg-red-500/5">
              <AlertCircle size={48} />
              <p className="font-bold">{error}</p>
            </div>
          ) : (
            <div className="glass-card overflow-x-auto border-border bg-foreground/[0.01]">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border bg-foreground/[0.03]">
                    <th className="p-4 text-[10px] font-black uppercase tracking-widest opacity-50">ID / Metadata</th>
                    <th className="p-4 text-[10px] font-black uppercase tracking-widest opacity-50">Content / Raw Data</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence mode="popLayout">
                    {filteredData.length === 0 ? (
                      <tr>
                        <td colSpan={2} className="p-20 text-center text-foreground/40 font-medium italic">
                          No se encontraron registros...
                        </td>
                      </tr>
                    ) : (
                      filteredData.map((row, i) => (
                        <motion.tr 
                          key={row.id || i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="border-b border-border hover:bg-foreground/[0.02] transition-colors group"
                        >
                          <td className="p-4 align-top w-64">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-primary font-black text-xs">
                                <Hash size={12} /> {row.id?.substring(0, 8)}...
                              </div>
                              <div className="flex items-center gap-2 text-[10px] opacity-40 font-medium">
                                <Calendar size={12} /> {new Date(row.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="bg-slate-950/50 p-4 rounded-xl border border-white/5 font-mono text-[11px] overflow-x-auto max-h-40 overflow-y-auto custom-scrollbar scrollbar-hidden">
                              <pre className="text-blue-300">
                                {JSON.stringify(row, null, 2)}
                              </pre>
                            </div>
                          </td>
                        </motion.tr>
                      ))
                    )}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
