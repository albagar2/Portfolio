import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Cpu, Database, GraduationCap, Newspaper, Clock, ArrowRight, Brain } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SkillMatrix } from '../components/sections/SkillMatrix';
import { ProjectCard, EnhancedHero } from '../components/layout/EnhancedHero';
import { Footer } from '../components/layout/Footer';

interface HomeProps {
  data: any;
  scaleX: any;
  onOpenContact: () => void;
  t: any;
}

/**
 * PÁGINA: Home (Nodo Principal)
 * Estructura de la página central del portafolio.
 * Orquesta todas las secciones principales (Hero, Skills, Proyectos, Experiencia, Blog).
 */
export const Home = ({ data, scaleX, onOpenContact, t }: HomeProps) => {
  return (
    <div className="pb-40 relative lg:px-20 overflow-x-hidden">
      {/* Barra de Progreso de Scroll Superior */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-[4px] z-[101] origin-left bg-[#00FFF0] shadow-[0_0_15px_#00FFF0]" 
        style={{ scaleX }} 
      />

      {/* SECCIÓN HERO (Presentación Principal) */}
      <header id="hero" className="mb-20">
         <EnhancedHero profile={data.profile} t={t} />
      </header>
      
      {/* SECCIÓN SKILL MATRIX (Matriz de Habilidades) */}
      <section id="skills" className="py-20 px-6 lg:px-0">
         <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="os-window max-w-full overflow-hidden border-white/5">
            <header className="os-header bg-white/[0.03] border-white/10">
               <div className="flex gap-2 mr-6"><div className="os-dot bg-white/20" /><div className="os-dot bg-white/10" /><div className="os-dot bg-white/5" /></div>
               <span className="font-mono text-[9px] font-black uppercase tracking-[0.5em] text-white flex items-center gap-3">
                  <Activity size={14} /> {t.skills.title}
               </span>
            </header>
            <div className="p-10 lg:p-24 overflow-hidden">
               <SkillMatrix t={t} />
            </div>
         </motion.div>
      </section>

      {/* SECCIÓN PROYECTOS (Sistemas Core) */}
      <section id="projects" className="py-20 px-6 lg:px-0">
         <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="os-window max-w-full overflow-hidden border-[#D9FF00]/10">
            <header className="os-header bg-[#D9FF00]/10 border-[#D9FF00]/20">
               <div className="flex gap-2 mr-6"><div className="os-dot bg-red-500/50" /><div className="os-dot bg-yellow-500/50" /><div className="os-dot bg-green-500/50" /></div>
               <span className="font-mono text-[9px] font-black uppercase tracking-[0.5em] text-[#D9FF00] flex items-center gap-3">
                  <Cpu size={14} /> {t.projects.module_title}
               </span>
            </header>
            <div className="p-10 lg:p-24">
               <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
                  {data.projects.map((p: any, idx: number) => (
                    <article key={p.id} className="h-full">
                       <ProjectCard project={p} index={idx} />
                    </article>
                  ))}
               </div>
            </div>
         </motion.div>
      </section>

      {/* SECCIÓN EXPERIENCIA (Registro de Tiempos) */}
      <section id="experience" className="py-20 px-6 lg:px-0">
         <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="os-window max-w-full overflow-hidden border-[#FF007A]/10">
            <header className="os-header bg-[#FF007A]/10 border-[#FF007A]/20">
               <div className="flex gap-2 mr-6"><div className="os-dot bg-white/20" /><div className="os-dot bg-white/10" /><div className="os-dot bg-white/5" /></div>
               <span className="font-mono text-[9px] font-black uppercase tracking-[0.5em] text-[#FF007A] flex items-center gap-3">
                  <Database size={14} /> {t.experience.module_title}
               </span>
            </header>
            <div className="p-10 lg:p-32 grid lg:grid-cols-5 gap-20 lg:gap-32">
              <aside className="lg:col-span-2 space-y-8">
                 <h3 className="text-[8rem] lg:text-[10rem] font-black italic uppercase leading-none tracking-tighter opacity-[0.05] select-none text-white transition-opacity hover:opacity-10 cursor-default">
                    {t.experience.data_core.split(' ')[0]} <br /> {t.experience.data_core.split(' ')[1]}.
                 </h3>
                 <p className="font-mono text-[10px] text-slate-500 uppercase tracking-[0.5em] border-l-[3px] border-[#FF007A]/40 pl-10 max-w-sm leading-relaxed">
                    {t.experience.timeline_desc}
                 </p>
              </aside>
              <div className="lg:col-span-3 space-y-40 lg:space-y-56 pr-10">
                 {data.exp.map((exp: any) => (
                   <article key={exp.id} className="relative group pl-12 border-l-[3px] border-white/5 hover:border-[#FF007A] transition-all duration-1000">
                      <div className="absolute top-0 left-[-8.5px] w-4 h-4 bg-[#FF007A] rounded-full shadow-[0_0_25px_#FF007A] group-hover:scale-125 transition-transform" />
                      <div className="text-[10px] font-mono font-black text-[#FF007A] uppercase tracking-[0.6em] mb-4 flex items-center gap-4">
                         <div className="w-8 h-[1px] bg-[#FF007A]/50" /> LOG_{new Date(exp.startDate).getFullYear()} // SECTOR: PROD
                      </div>
                      <h4 className="text-6xl font-black tracking-tighter uppercase italic text-white group-hover:text-[#FF007A] transition-colors leading-none mb-8">{exp.position}</h4>
                      <p className="text-slate-500 leading-relaxed font-mono text-[11px] uppercase tracking-[0.2em] opacity-80 border-t border-white/5 pt-10">{exp.description}</p>
                   </article>
                 ))}
              </div>
            </div>
         </motion.div>
      </section>

      {/* SECCIÓN EDUCACIÓN (Nodos Académicos) */}
      <section id="education" className="py-20 px-6 lg:px-0">
         <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="os-window max-w-full overflow-hidden border-purple-500/10">
            <header className="os-header bg-purple-500/10 border-purple-500/20">
               <div className="flex gap-2 mr-6"><div className="os-dot bg-white/20" /><div className="os-dot bg-white/10" /><div className="os-dot bg-white/5" /></div>
               <span className="font-mono text-[9px] font-black uppercase tracking-[0.5em] text-purple-400 flex items-center gap-3">
                  <GraduationCap size={14} /> {t.education.module_title}
               </span>
            </header>
            <div className="p-10 lg:p-32 grid lg:grid-cols-5 gap-20 lg:gap-32">
              <aside className="lg:col-span-2 space-y-8">
                 <h3 className="text-[8rem] lg:text-[10rem] font-black italic uppercase leading-none tracking-tighter opacity-[0.05] select-none text-white">
                    {t.education.data_core.split(' ')[0]} <br /> {t.education.data_core.split(' ')[1]}.
                 </h3>
                 <p className="font-mono text-[10px] text-slate-500 uppercase tracking-[0.5em] border-l-[3px] border-purple-500/40 pl-10 max-w-sm leading-relaxed">
                    {t.education.timeline_desc}
                 </p>
              </aside>
              <div className="lg:col-span-3 space-y-24 pr-10">
                 {data.edu.map((edu: any) => (
                   <article key={edu.id} className="relative group pl-12 border-l-[3px] border-white/5 hover:border-purple-500 transition-all duration-1000">
                      <div className="absolute top-0 left-[-8.5px] w-4 h-4 bg-purple-500 rounded-full shadow-[0_0_25px_rgba(168,85,247,0.5)] group-hover:scale-125 transition-transform" />
                      <div className="text-[10px] font-mono font-black text-purple-400 uppercase tracking-[0.6em] mb-4 flex items-center gap-4">
                         <div className="w-8 h-[1px] bg-purple-500/50" /> LOG_{new Date(edu.startDate).getFullYear()} // SECTOR: ACAD
                      </div>
                      <h4 className="text-5xl font-black tracking-tighter uppercase italic text-white group-hover:text-purple-400 transition-colors leading-none mb-3">{edu.degree}</h4>
                      <p className="text-purple-400/60 font-mono text-[10px] uppercase font-bold tracking-widest mb-6">{edu.institution} // {edu.field}</p>
                      {edu.description && <p className="text-slate-500 leading-relaxed font-mono text-[11px] uppercase tracking-[0.2em] opacity-80 border-t border-white/5 pt-6">{edu.description}</p>}
                   </article>
                 ))}
              </div>
            </div>
         </motion.div>
      </section>

      {/* SECCIÓN BLOG / ARTÍCULOS (Content Logs) */}
      <section id="posts" className="py-20 px-6 lg:px-0">
         <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="os-window max-w-full overflow-hidden border-indigo-500/10">
            <header className="os-header bg-indigo-500/10 border-indigo-500/20">
               <div className="flex gap-2 mr-6"><div className="os-dot bg-indigo-500/30" /><div className="os-dot bg-indigo-500/20" /><div className="os-dot bg-indigo-500/10" /></div>
               <span className="font-mono text-[9px] font-black uppercase tracking-[0.5em] text-indigo-400 flex items-center gap-3">
                  <Newspaper size={14} /> {t.posts.module_title}
               </span>
            </header>
            <div className="p-10 lg:p-24">
               <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
                  {data.posts.map((post: any) => (
                    <article key={post.id} className="group relative">
                       <div className="glass-card p-12 lg:p-16 border-white/5 hover:border-indigo-500/30 transition-all duration-700 bg-white/[0.01] hover:bg-white/[0.03] flex flex-col h-full relative overflow-hidden">
                          {/* Fondo Dinámico de Tarjeta */}
                          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl rounded-full group-hover:bg-indigo-500/10 transition-colors" />
                          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500/5 blur-3xl rounded-full" />
                          
                          <header className="flex items-center justify-between mb-10 relative z-10">
                             <div className="flex gap-3">
                                {post.tags?.slice(0, 2).map((tag: any, i: number) => (
                                   <span key={i} className="text-[9px] font-black font-mono px-4 py-1.5 bg-indigo-500/10 rounded-xl border border-indigo-500/20 text-indigo-400 uppercase tracking-[0.2em]">#{tag.name}</span>
                                ))}
                             </div>
                             <time className="text-[9px] font-black font-mono text-slate-600 uppercase tracking-[0.3em] flex items-center gap-2">
                                <Clock size={12} /> {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'LOG_STREAMING'}
                             </time>
                          </header>

                          <h3 className="text-4xl lg:text-5xl font-black tracking-tighter uppercase italic leading-[0.9] text-white group-hover:text-indigo-400 transition-all duration-500 mb-8 relative z-10 pr-10">
                             {post.title}
                          </h3>
                          
                          <p className="text-slate-500 font-mono text-[10px] leading-relaxed mb-12 line-clamp-3 uppercase tracking-widest opacity-60 italic border-l-2 border-white/5 pl-8 flex-grow relative z-10">
                             {post.excerpt}
                          </p>

                          <Link to={`/blog/${post.slug}`} className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.5em] flex items-center gap-6 group/btn w-fit relative z-10">
                             <div className="flex items-center justify-center w-12 h-12 rounded-full border border-indigo-500/20 group-hover/btn:border-indigo-500/50 transition-all">
                                <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                             </div>
                             {t.posts.read_more}
                          </Link>
                       </div>
                    </article>
                  ))}
               </div>
            </div>
         </motion.div>
      </section>

      {/* FOOTER CALL TO ACTION (Handshake) */}
      <section id="contact" className="py-40 px-6 lg:px-0">
         <motion.div whileHover={{ scale: 1.01 }} className="os-window p-20 lg:p-48 text-center border-[#FFB800]/20 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-[#FFB800]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            <Brain size={80} className="mx-auto text-[#FFB800] mb-12 animate-pulse opacity-40 shadow-2xl" />
            <h2 className="text-7xl lg:text-[10rem] font-black italic uppercase mb-16 tracking-tighter leading-none opacity-[0.03] text-white select-none">{t.contact.connect}.</h2>
            <button 
               onClick={onOpenContact} 
               className="btn-os bg-[#FFB800] text-black shadow-[0_0_50px_rgba(255,184,0,0.3)] px-24 py-10 text-xs hover:px-32 transition-all duration-1000"
            >
               {t.contact.handshake}
            </button>
         </motion.div>
      </section>
      
      {/* FINALIZACIÓN TOTAL DEL SISTEMA */}
      <Footer data={data} t={t} />
    </div>
  );
};
