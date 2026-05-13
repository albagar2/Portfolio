import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Cpu, Database, GraduationCap, Newspaper, Clock, ArrowRight, Brain, User, Github } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SkillMatrix } from '../components/sections/SkillMatrix';
import { ProjectCard, EnhancedHero } from '../components/layout/EnhancedHero';
import { ProjectModal } from '../components/layout/ProjectModal';
import { GithubFeed } from '../components/sections/GithubFeed';
import { Footer } from '../components/layout/Footer';

interface HomeProps {
  data: any;
  scaleX: any;
  onOpenContact: () => void;
  t: any;
  lang: string;
}

/**
 * PÁGINA: Home (Nodo Principal)
 * Estructura de la página central del portafolio.
 * Orquesta todas las secciones principales (Hero, Skills, Proyectos, Experiencia, Blog).
 */
export const Home = ({ data, scaleX, onOpenContact, t, lang }: HomeProps) => {
  const [selectedProject, setSelectedProject] = React.useState<any>(null);

  // Helper para obtener el campo traducido o el original de respaldo
  const getT = (obj: any, field: string) => {
    if (!obj) return '';
    if (lang === 'en') {
      const enField = `${field}_en`;
      return obj[enField] || obj[field] || '';
    }
    return obj[field] || '';
  };

  return (
    <div className="pb-40 relative lg:px-20 overflow-x-hidden scroll-smooth">
      {/* Barra de Progreso de Scroll Superior */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-[4px] z-[101] origin-left bg-[var(--color-aqua)] shadow-[0_0_15px_var(--color-aqua)]" 
        style={{ scaleX }} 
      />

      {/* SECCIÓN HERO (Presentación Principal) */}
      <header id="hero" className="mb-20 scroll-mt-32">
         <EnhancedHero profile={data.profile} t={t} lang={lang} />
      </header>

      {/* SECCIÓN SOBRE MÍ (Nuevo) */}
      <section id="about" className="py-32 px-6 lg:px-0 scroll-mt-32">
         <motion.div 
           initial={{ opacity: 0, y: 50 }} 
           whileInView={{ opacity: 1, y: 0 }} 
           className="os-window max-w-7xl mx-auto overflow-hidden border-border"
         >
            <header className="os-header bg-foreground/[0.02]">
               <div className="flex gap-2 mr-6"><div className="os-dot bg-[var(--color-aqua)]/50" /><div className="os-dot bg-[var(--color-aqua)]/30" /><div className="os-dot bg-[var(--color-aqua)]/10" /></div>
               <span className="font-mono text-[9px] font-black uppercase tracking-[0.5em] text-foreground flex items-center gap-3">
                  <User size={14} /> {t.about.title}
               </span>
            </header>
            <div className="p-12 lg:p-24 grid lg:grid-cols-2 gap-20 items-center">
               <div className="space-y-10">
                  <h2 className="text-6xl lg:text-8xl font-black italic uppercase tracking-tighter leading-none text-foreground">
                     {t.about.subtitle}
                  </h2>
                  <p className="text-xl lg:text-2xl text-foreground/85 font-mono uppercase tracking-widest leading-relaxed border-l-4 border-[var(--color-aqua)] pl-10">
                     {getT(data.profile, 'bio')}
                  </p>
               </div>
               <div className="relative group perspective-1000">
                  <div className="absolute -inset-4 bg-gradient-to-br from-[var(--color-aqua)]/20 to-transparent blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="os-window p-10 bg-foreground/[0.02] rotate-2 group-hover:rotate-0 transition-transform duration-700">
                     <div className="aspect-square bg-foreground/10 rounded-2xl overflow-hidden relative">
                        <img 
                          src={data.profile?.avatarUrl || "/media/profile-photo.jpg"} 
                          alt="Alba García" 
                          className="w-full h-full object-cover grayscale brightness-75 hover:grayscale-0 hover:brightness-100 transition-all duration-1000"
                          onError={(e) => {
                             (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1000&auto=format&fit=crop';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                        <div className="absolute bottom-8 left-8 right-8 space-y-2">
                           <div className="text-[10px] font-mono text-[var(--color-aqua)] font-black tracking-[0.4em]">ADDR: 0xALBA_G</div>
                           <div className="text-2xl font-black text-foreground italic uppercase">{getT(data.profile, 'title')}</div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </motion.div>
      </section>
      
      {/* SECCIÓN SKILL MATRIX (Matriz de Habilidades) */}
      <section id="skills" className="py-20 px-6 lg:px-0">
         <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="os-window max-w-full overflow-hidden border-border">
            <header className="os-header bg-foreground/[0.02]">
               <div className="flex gap-2 mr-6"><div className="os-dot bg-foreground/20" /><div className="os-dot bg-foreground/10" /><div className="os-dot bg-foreground/5" /></div>
               <span className="font-mono text-[9px] font-black uppercase tracking-[0.5em] text-foreground flex items-center gap-3">
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
         <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="os-window max-w-full overflow-hidden border-[var(--color-aqua)]/20 shadow-[0_0_50px_rgba(0,0,0,0.3)]">
            <header className="os-header bg-foreground/[0.03] border-b border-white/5">
               <div className="flex gap-2 mr-6"><div className="os-dot bg-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.5)]" /><div className="os-dot bg-yellow-500/50 shadow-[0_0_10px_rgba(234,179,8,0.5)]" /><div className="os-dot bg-green-500/50 shadow-[0_0_10px_rgba(34,197,94,0.5)]" /></div>
               <span className="font-mono text-[9px] font-black uppercase tracking-[0.5em] text-foreground/70 flex items-center gap-3">
                  <Cpu size={14} /> {t.projects.module_title}
               </span>
            </header>
            <div className="p-10 lg:p-24 bg-gradient-to-b from-transparent to-foreground/[0.02]">
               <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
                  {data.projects.map((p: any, idx: number) => (
                    <article key={p.id} className="h-full">
                       <ProjectCard project={{...p, title: getT(p, 'title'), description: getT(p, 'description')}} index={idx} t={t} onClick={() => setSelectedProject(p)} />
                    </article>
                  ))}
               </div>
            </div>
         </motion.div>
      </section>

      {/* MODAL DE PROYECTO */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectModal 
            project={{...selectedProject, title: getT(selectedProject, 'title'), description: getT(selectedProject, 'description'), longDescription: getT(selectedProject, 'longDescription')}} 
            isOpen={!!selectedProject} 
            onClose={() => setSelectedProject(null)} 
            t={t} 
          />
        )}
      </AnimatePresence>

      {/* SECCIÓN GITHUB (En Tiempo Real) */}
      <section id="github" className="py-20 px-6 lg:px-0">
         <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="os-window max-w-full overflow-hidden border-[var(--color-aqua)]/10">
            <header className="os-header bg-[var(--color-aqua)]/10 border-[var(--color-aqua)]/20">
               <div className="flex gap-2 mr-6"><div className="os-dot bg-[var(--color-aqua)]/50" /><div className="os-dot bg-[var(--color-aqua)]/30" /><div className="os-dot bg-[var(--color-aqua)]/10" /></div>
               <span className="font-mono text-[9px] font-black uppercase tracking-[0.5em] text-[var(--color-aqua)] flex items-center gap-3">
                  <Github size={14} /> LIVE_GITHUB_REPOSITORY_FEED_v1.5
               </span>
            </header>
            <div className="p-10 lg:p-24">
               <GithubFeed t={t} />
            </div>
         </motion.div>
      </section>

      {/* SECCIÓN EXPERIENCIA (Registro de Tiempos) */}
      <section id="experience" className="py-20 px-6 lg:px-0">
         <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="os-window max-w-full overflow-hidden border-[#FF007A]/10">
            <header className="os-header bg-[#FF007A]/10 border-[#FF007A]/20">
               <div className="flex gap-2 mr-6"><div className="os-dot bg-foreground/[0.2]" /><div className="os-dot bg-foreground/[0.1]" /><div className="os-dot bg-foreground/[0.05]" /></div>
               <span className="font-mono text-[9px] font-black uppercase tracking-[0.5em] text-[#FF007A] flex items-center gap-3">
                  <Database size={14} /> {t.experience.module_title}
               </span>
            </header>
            <div className="p-10 lg:p-32 grid lg:grid-cols-5 gap-20 lg:gap-32">
              <aside className="lg:col-span-2 space-y-8">
                 <h3 className="text-[8rem] lg:text-[10rem] font-black italic uppercase leading-none tracking-tighter opacity-[0.05] select-none text-foreground transition-opacity hover:opacity-10 cursor-default">
                    {t.experience.data_core.split(' ')[0]} <br /> {t.experience.data_core.split(' ')[1]}.
                 </h3>
                 <p className="font-mono text-[10px] text-foreground/85 uppercase tracking-[0.5em] border-l-[3px] border-[#FF007A]/40 pl-10 max-w-sm leading-relaxed">
                    {t.experience.timeline_desc}
                 </p>
              </aside>
              <div className="lg:col-span-3 space-y-40 lg:space-y-56 pr-10">
                 {data.exp.map((exp: any) => (
                   <article key={exp.id} className="relative group pl-12 border-l-[3px] border-border hover:border-[#FF007A] transition-all duration-1000">
                      <div className="absolute top-0 left-[-8.5px] w-4 h-4 bg-[#FF007A] rounded-full shadow-[0_0_25px_#FF007A] group-hover:scale-125 transition-transform" />
                      <div className="text-[10px] font-mono font-black text-[#FF007A] uppercase tracking-[0.6em] mb-4 flex items-center gap-4">
                         <div className="w-8 h-[1px] bg-[#FF007A]/50" /> LOG_{new Date(exp.startDate).getFullYear()} // SECTOR: PROD
                      </div>
                      <h4 className="text-6xl font-black tracking-tighter uppercase italic text-foreground group-hover:text-[#FF007A] transition-colors leading-none mb-8">{getT(exp, 'position')}</h4>
                      <p className="text-foreground/85 leading-relaxed font-mono text-[11px] uppercase tracking-[0.2em] opacity-80 border-t border-border pt-10">{getT(exp, 'description')}</p>
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
               <div className="flex gap-2 mr-6"><div className="os-dot bg-foreground/[0.2]" /><div className="os-dot bg-foreground/[0.1]" /><div className="os-dot bg-foreground/[0.05]" /></div>
               <span className="font-mono text-[9px] font-black uppercase tracking-[0.5em] text-purple-400 flex items-center gap-3">
                  <GraduationCap size={14} /> {t.education.module_title}
               </span>
            </header>
            <div className="p-10 lg:p-32 grid lg:grid-cols-5 gap-20 lg:gap-32">
              <aside className="lg:col-span-2 space-y-8">
                 <h3 className="text-[8rem] lg:text-[10rem] font-black italic uppercase leading-none tracking-tighter opacity-[0.05] select-none text-foreground">
                    {t.education.data_core.split(' ')[0]} <br /> {t.education.data_core.split(' ')[1]}.
                 </h3>
                 <p className="font-mono text-[10px] text-foreground/85 uppercase tracking-[0.5em] border-l-[3px] border-purple-500/40 pl-10 max-w-sm leading-relaxed">
                    {t.education.timeline_desc}
                 </p>
              </aside>
              <div className="lg:col-span-3 space-y-24 pr-10">
                 {data.edu.map((edu: any) => (
                   <article key={edu.id} className="relative group pl-12 border-l-[3px] border-border hover:border-purple-500 transition-all duration-1000">
                      <div className="absolute top-0 left-[-8.5px] w-4 h-4 bg-purple-500 rounded-full shadow-[0_0_25px_rgba(168,85,247,0.5)] group-hover:scale-125 transition-transform" />
                      <div className="text-[10px] font-mono font-black text-purple-400 uppercase tracking-[0.6em] mb-4 flex items-center gap-4">
                         <div className="w-8 h-[1px] bg-purple-500/50" /> LOG_{new Date(edu.startDate).getFullYear()} // SECTOR: ACAD
                      </div>
                      <h4 className="text-5xl font-black tracking-tighter uppercase italic text-foreground group-hover:text-purple-400 transition-colors leading-none mb-3">{getT(edu, 'degree')}</h4>
                      <p className="text-purple-400/60 font-mono text-[10px] uppercase font-bold tracking-widest mb-6">{edu.institution} // {getT(edu, 'field')}</p>
                      {edu.description && <p className="text-foreground/85 leading-relaxed font-mono text-[11px] uppercase tracking-[0.2em] opacity-80 border-t border-border pt-6">{getT(edu, 'description')}</p>}
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
                       <div className="glass-card p-12 lg:p-16 border-border hover:border-indigo-500/30 transition-all duration-700 bg-foreground/[0.01] hover:bg-foreground/[0.03] flex flex-col h-full relative overflow-hidden">
                          {/* Fondo Dinámico de Tarjeta */}
                          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl rounded-full group-hover:bg-indigo-500/10 transition-colors" />
                          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500/5 blur-3xl rounded-full" />
                          
                          <header className="flex items-center justify-between mb-10 relative z-10">
                             <div className="flex gap-3">
                                {post.tags?.slice(0, 2).map((tag: any, i: number) => (
                                   <span key={i} className="text-[9px] font-black font-mono px-4 py-1.5 bg-indigo-500/10 rounded-xl border border-indigo-500/20 text-indigo-400 uppercase tracking-[0.2em]">#{tag.name}</span>
                                ))}
                             </div>
                             <time className="text-[9px] font-black font-mono text-foreground/95 uppercase tracking-[0.3em] flex items-center gap-2">
                                <Clock size={12} /> {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'LOG_STREAMING'}
                             </time>
                          </header>

                          <h3 className="text-4xl lg:text-5xl font-black tracking-tighter uppercase italic leading-[0.9] text-foreground group-hover:text-indigo-400 transition-all duration-500 mb-8 relative z-10 pr-10">
                             {getT(post, 'title')}
                          </h3>
                          
                          <p className="text-foreground/85 font-mono text-[10px] leading-relaxed mb-12 line-clamp-3 uppercase tracking-widest opacity-100 italic border-l-2 border-border pl-8 flex-grow relative z-10">
                             {getT(post, 'excerpt')}
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
            <h2 className="text-7xl lg:text-[10rem] font-black italic uppercase mb-16 tracking-tighter leading-none opacity-[0.03] text-foreground select-none">{t.contact.connect}.</h2>
            <button 
               onClick={onOpenContact} 
               className="btn-os bg-[#FFB800] text-black shadow-[0_0_50px_rgba(255,184,0,0.3)] px-24 py-10 text-xs hover:px-32 transition-all duration-1000"
            >
               {t.contact.handshake}
            </button>
         </motion.div>
      </section>
      
      {/* FINALIZACIÓN TOTAL DEL SISTEMA */}
      <Footer data={data} t={t} lang={lang} />
    </div>
  );
};
