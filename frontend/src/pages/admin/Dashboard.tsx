import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FolderKanban, MessageSquare, Newspaper, 
  Plus, ArrowRight, UserCheck, Sparkles,
  Mail, Clock, ChevronRight, Zap, Target
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';

const StatCard = ({ title, value, icon: Icon, color, delay = 0 }: any) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay, duration: 0.5 }}
    className="glass-card p-8 flex items-center justify-between group overflow-hidden relative border-white/5 hover:border-white/10"
  >
    <div className={`absolute -right-10 -top-10 w-40 h-40 ${color} opacity-0 group-hover:opacity-10 transition-all duration-700 blur-[80px] rounded-full`} />
    <div className="z-10">
      <div className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-3">{title}</div>
      <div className="text-4xl font-black tracking-tighter bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">{value}</div>
    </div>
    <div className={`z-10 p-4 rounded-2xl ${color} bg-opacity-10 border border-current border-opacity-20 text-opacity-80 group-hover:scale-110 transition-transform`}>
      <Icon size={24} />
    </div>
  </motion.div>
);

export const Dashboard = () => {
  const [data, setData] = useState({
    projects: [],
    messages: [],
    posts: [],
    loading: true
  });

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [projects, messages, posts] = await Promise.all([
          api.get('/projects'),
          api.get('/contact'),
          api.get('/posts')
        ]);
        setData({
          projects: projects.data.data || [],
          messages: messages.data.data || [],
          posts: posts.data.data || [],
          loading: false
        });
      } catch (err) {
        console.error('Error dashboard data:', err);
      }
    };
    fetchAll();
  }, []);

  return (
    <div className="space-y-12 py-6">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
           <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-blue-400 font-black uppercase tracking-[0.3em] text-[10px] mb-4"
           >
              <Zap size={14} className="fill-current" /> System Operational
           </motion.div>
           <h1 className="text-5xl font-black tracking-tight leading-tight">
              Dashboard <span className="text-slate-600">Overview.</span>
           </h1>
        </div>
        
        <div className="flex gap-4">
          <Link to="/admin/projects" className="flex items-center gap-4 px-8 py-4 bg-white text-black rounded-2xl font-black shadow-2xl active:scale-95 transition-all">
             NUEVO PROYECTO <Plus size={20} />
          </Link>
        </div>
      </header>

      {/* Grid de Stats con Animación */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Proyectos" value={data.projects.length} icon={FolderKanban} color="text-blue-500 bg-blue-500" delay={0} />
        <StatCard title="Mensajes" value={data.messages.length} icon={MessageSquare} color="text-purple-500 bg-purple-500" delay={0.1} />
        <StatCard title="Artículos" value={data.posts.length} icon={Newspaper} color="text-indigo-500 bg-indigo-500" delay={0.2} />
        <StatCard title="Salud" value="99%" icon={Target} color="text-green-500 bg-green-500" delay={0.3} />
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
         {/* Bandeja de Entrada PRO */}
         <div className="lg:col-span-2 glass-card p-10 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                <Mail size={120} />
            </div>
            
            <h3 className="text-xl font-bold mb-10 flex items-center justify-between">
               Inbox Reciente
               <Link to="/admin/messages" className="text-xs text-blue-400 font-bold border-b border-blue-500/20 pb-1 hover:border-blue-500 transition-all flex items-center gap-2">
                  EXPLORAR TODO <ChevronRight size={14} />
               </Link>
            </h3>

            <div className="space-y-4">
               {data.loading ? (
                 [1,2,3].map(i => <div key={i} className="h-20 bg-white/5 rounded-2xl animate-pulse" />)
               ) : data.messages.length === 0 ? (
                 <div className="py-20 text-center text-slate-500 font-bold uppercase tracking-widest text-xs">No hay mensajes nuevos</div>
                 ) : (
                   data.messages.slice(0, 4).map((msg: any) => (
                    <Link key={msg.id} to="/admin/messages" className="block outline-none">
                       <motion.div 
                          whileHover={{ x: 5 }}
                          className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/[0.07] transition-all flex items-center justify-between group"
                       >
                          <div className="flex items-center gap-6">
                             <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center border border-white/10 group-hover:text-blue-400 transition-colors">
                                <Mail size={20} />
                             </div>
                             <div>
                                <div className="font-bold text-sm text-white">{msg.name}</div>
                                <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1 flex items-center gap-2">
                                   <Clock size={10} /> {new Date(msg.createdAt).toLocaleDateString()} • {msg.subject}
                                </div>
                             </div>
                          </div>
                          <ChevronRight size={18} className="text-slate-700 group-hover:text-blue-400 transition-colors" />
                       </motion.div>
                    </Link>
                   ))
                 )}
            </div>
         </div>

         {/* Acciones Rápidas & Estado */}
         <div className="space-y-8">
            <div className="glass-card p-10 bg-gradient-to-br from-blue-600/10 to-transparent border-blue-500/20">
               <h3 className="text-xl font-bold mb-8">Estado Vital</h3>
               <div className="space-y-8">
                  <div className="flex items-center justify-between text-sm">
                     <span className="font-bold text-slate-500">Uso Base de Datos</span>
                     <span className="font-black text-blue-400">Normal</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                     <span className="font-bold text-slate-500">SSL Security</span>
                     <span className="font-black text-green-400 flex items-center gap-2 uppercase tracking-widest text-[10px]">Active <Sparkles size={12} /></span>
                  </div>
                  <button className="w-full py-4 mt-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[10px] font-black tracking-[0.2em] transition-all">
                     REALIZAR BACKUP
                  </button>
               </div>
            </div>

            <div className="glass-card p-10 space-y-6">
                <h3 className="text-xs font-black text-slate-600 uppercase tracking-widest">Atajos Rápidos</h3>
                <Link to="/admin/experience" className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/5 transition-all text-sm font-bold opacity-70 hover:opacity-100">
                    <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400"><Clock size={16} /></div>
                    Actualizar CV
                </Link>
                <Link to="/admin/settings" className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/5 transition-all text-sm font-bold opacity-70 hover:opacity-100">
                    <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400"><UserCheck size={16} /></div>
                    Editar Perfil Boss
                </Link>
            </div>
         </div>
      </div>
    </div>
  );
};
