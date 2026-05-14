import React, { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Github, ArrowRight, Code2, Rocket, Download, Globe, Terminal as TerminalIcon } from 'lucide-react';

interface Project {
  id: string; title: string; description: string; technologies: { name: string }[]; imageUrl?: string; liveUrl?: string; githubUrl?: string; category: string;
}

const InteractiveTerminal = ({ lang }: { lang: string }) => {
    const isEn = lang === 'en';
    
    const terminalTexts = {
        en: {
            init: ['ALBA_OS_BOOT_SEQUENCE_OK', 'Initializing kernel...', 'Accessing user_profile.bin', 'Type "help" for a list of commands.'],
            help: 'AVAILABLE_CMDS: bio, skills, projects, stack, clear, whoami',
            bio: 'Alba García: Software Architect specializing in high-performance digital ecosystems.',
            skills: 'CORE_STACK: React 18, TypeScript, Node.js, PostgreSQL, Cloud_Infra.',
            projects: 'SCANNING: [Gasoil, EsquelasTV, ALBA-OS, NeuralGuard, CryptoPro, BioSync, EchoVault, GestorPro, ComfortFood] Found 9 active nodes.',
            stack: 'TECH: Next.js, Framer_Motion, Tailwind, Python, SQLite.',
            whoami: 'USER: Recruiter_Entity // STATUS: Authorized_Access',
            err: (cmd: string) => `ERR: Command "${cmd}" not found in core database.`
        },
        es: {
            init: ['ALBA_OS_BOOT_SEQUENCE_OK', 'Inicializando kernel...', 'Accediendo a user_profile.bin', 'Escribe "help" para ver los comandos.'],
            help: 'CMDS_DISPONIBLES: bio, skills, projects, stack, clear, whoami',
            bio: 'Alba García: Arquitecta de Software especializada en ecosistemas digitales de alto rendimiento.',
            skills: 'CORE_STACK: React 18, TypeScript, Node.js, PostgreSQL, Cloud_Infra.',
            projects: 'ESCANEANDO: [Gasoil, EsquelasTV, ALBA-OS, NeuralGuard, CryptoPro, BioSync, EchoVault, GestorPro, ComfortFood] 9 nodos activos.',
            stack: 'TECH: Next.js, Framer_Motion, Tailwind, Python, SQLite.',
            whoami: 'USUARIO: Recruiter_Entity // ESTADO: Acceso_Autorizado',
            err: (cmd: string) => `ERR: Comando "${cmd}" no encontrado en el núcleo.`
        }
    };

    const texts = isEn ? terminalTexts.en : terminalTexts.es;
    
    const [history, setHistory] = useState<string[]>(texts.init);
    const [input, setInput] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);

    // Update history when language changes
    useEffect(() => {
        setHistory(texts.init);
    }, [lang]);

    const handleCommand = (e: React.FormEvent) => {
        e.preventDefault();
        const cmd = input.toLowerCase().trim();
        let response = '';
        
        switch(cmd) {
            case 'help': response = texts.help; break;
            case 'bio': response = texts.bio; break;
            case 'skills': response = texts.skills; break;
            case 'projects': response = texts.projects; break;
            case 'stack': response = texts.stack; break;
            case 'whoami': response = texts.whoami; break;
            case 'clear': setHistory([]); setInput(''); return;
            default: response = texts.err(cmd);
        }
        
        setHistory(prev => [...prev, `> ${input}`, response]);
        setInput('');
    };

    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [history]);

    return (
        <div className="os-window w-full max-w-2xl mx-auto backdrop-blur-3xl overflow-hidden mt-12 group hover:border-[var(--color-aqua)]/30 transition-all duration-700 shadow-2xl border-white/5">
            <div className="os-header bg-white/[0.03] border-b border-white/5 py-3 px-6 flex items-center justify-between">
                <div className="flex gap-2"><div className="w-2 h-2 rounded-full bg-red-500/50 shadow-[0_0_5px_red]" /><div className="w-2 h-2 rounded-full bg-yellow-400/50 shadow-[0_0_5px_yellow]" /><div className="w-2 h-2 rounded-full bg-green-500/50 shadow-[0_0_5px_green]" /></div>
                <div className="font-mono text-[8px] text-foreground/50 uppercase tracking-[0.5em] flex items-center gap-2">
                   <TerminalIcon size={12} className="text-[var(--color-aqua)]" /> SESSION_TTY_01
                </div>
            </div>
            <div ref={scrollRef} className="p-8 h-48 overflow-y-auto font-mono text-[10px] space-y-2 custom-scrollbar text-foreground/90">
                {history.map((line, i) => (
                    <div key={i} className={line.startsWith('>') ? 'text-[var(--color-aqua)]' : ''}>
                        {line.startsWith('>') ? '' : <span className="text-white/20 mr-4">[{new Date().toLocaleTimeString()}]</span>}
                        {line}
                    </div>
                ))}
            </div>
            <form onSubmit={handleCommand} className="p-4 border-t border-white/5 flex items-center gap-4 bg-white/[0.01]">
                <span className="text-[var(--color-aqua)] font-mono text-[10px] ml-4 animate-pulse">ALBA_OS_{'>'}</span>
                <input 
                   type="text" 
                   value={input}
                   onChange={(e) => setInput(e.target.value)}
                   className="bg-transparent border-none outline-none font-mono text-[10px] text-foreground w-full uppercase tracking-widest placeholder:text-foreground/30"
                   placeholder={isEn ? "COMMAND_INPUT..." : "ENTRADA_COMANDO..."}
                />
            </form>
        </div>
    );
};

export const ProjectCard: React.FC<{ project: Project; index: number; t: any; onClick?: () => void }> = ({ project, index, t, onClick }) => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative h-full cursor-pointer perspective-1000"
      onClick={onClick}
    >
      {/* Glow Dinámico */}
      <div className="absolute -inset-0.5 bg-gradient-to-br from-[var(--color-aqua)]/30 to-purple-500/30 rounded-[2.5rem] blur-2xl opacity-0 group-hover:opacity-100 transition duration-1000" />
      
      <div className="relative os-window overflow-hidden flex flex-col h-full rounded-[2.2rem] bg-foreground/[0.02] border border-white/10 backdrop-blur-xl group-hover:border-[var(--color-aqua)]/40 transition-all duration-700">
        
        {/* Header de la Tarjeta Estilo OS */}
        <div className="os-header py-4 px-8 bg-white/[0.05] border-b border-white/5 flex justify-between items-center">
            <div className="flex gap-2">
                <div className="w-2 h-2 rounded-full bg-white/10" />
                <div className="w-2 h-2 rounded-full bg-white/10" />
            </div>
            <div className="text-[8px] font-mono font-black text-white/30 uppercase tracking-[0.4em]">
                NODE_0{index + 1}
            </div>
        </div>

        {/* Contenedor Visual */}
        <div className="relative h-56 overflow-hidden">
           {/* Imagen de Fondo */}
           <div className="absolute inset-0 bg-[#000]">
              {project.imageUrl ? (
                <img 
                  src={project.imageUrl} 
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000" 
                  alt={project.title} 
                />
              ) : (
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(var(--color-aqua)_1px,transparent_1px)] [background-size:16px_16px]" />
              )}
           </div>
           
           <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
           
           {!project.imageUrl && (
             <div className="absolute inset-0 flex items-center justify-center">
                <motion.div 
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.8 }}
                  className="w-20 h-20 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-3xl flex items-center justify-center group-hover:bg-[var(--color-aqua)]/10 group-hover:border-[var(--color-aqua)]/30 transition-all"
                >
                   <Code2 size={32} className="text-[var(--color-aqua)] drop-shadow-[0_0_15px_rgba(0,255,240,0.4)]" />
                </motion.div>
             </div>
           )}

           {/* Badge de Categoría */}
           <div className="absolute top-6 left-6">
              <div className="px-5 py-2 rounded-lg bg-black/60 border border-white/10 backdrop-blur-md text-[7px] font-mono font-black text-white/70 uppercase tracking-[0.4em] shadow-xl">
                 {project.category}
              </div>
           </div>

           {/* Indicador de Estado */}
           <div className="absolute bottom-6 left-8 flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-aqua)] shadow-[0_0_10px_var(--color-aqua)] animate-pulse" />
              <div className="text-[8px] font-mono font-black text-[var(--color-aqua)] tracking-[0.3em]">SYSTEM_STABLE</div>
           </div>
        </div>

        {/* Contenido de Texto */}
        <div className="p-10 flex flex-col flex-grow bg-gradient-to-b from-transparent to-white/[0.01]">
          <h3 className="text-4xl font-black mb-4 tracking-tighter uppercase italic text-white group-hover:text-[var(--color-aqua)] transition-all">
             {project.title}
          </h3>
          <p className="text-white/60 font-mono text-[10px] leading-relaxed mb-8 flex-grow uppercase tracking-widest line-clamp-3">
            {project.description}
          </p>
          
          <div className="flex flex-wrap gap-2 mb-10">
            {project.technologies?.slice(0, 3).map((tech, i) => (
              <span key={i} className="text-[7px] font-mono px-3 py-1 bg-white/[0.05] rounded shadow-sm border border-white/5 font-black uppercase tracking-[0.2em] text-white/50">
                 {tech.name}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-4 pt-8 border-t border-white/5">
             {project.liveUrl && (() => {
                const isVideo = /youtube\.com|youtu\.be|vimeo\.com/.test(project.liveUrl);
                return (
                  <a 
                    href={project.liveUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className={`flex-grow flex items-center justify-center gap-3 px-6 py-3 rounded-xl border transition-all duration-300 group/btn ${
                      isVideo 
                        ? 'bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border-red-500/30' 
                        : 'bg-[var(--color-aqua)]/10 hover:bg-[var(--color-aqua)] text-[var(--color-aqua)] hover:text-black border-[var(--color-aqua)]/30'
                    }`}
                  >
                    <span className="text-[9px] font-black uppercase tracking-[0.2em]">
                      {isVideo ? t.projects.video_link : t.projects.live_link}
                    </span>
                    {isVideo ? (
                      <Rocket size={14} className="group-hover/btn:scale-110 transition-transform" />
                    ) : (
                      <Globe size={14} className="group-hover/btn:rotate-12 transition-transform" />
                    )}
                  </a>
                );
             })()}
             {project.githubUrl && (
                <a 
                  href={project.githubUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="p-3 bg-white/5 hover:bg-white text-white/50 hover:text-black rounded-xl border border-white/10 transition-all duration-300"
                  title="Source Code"
                >
                   <Github size={14} />
                </a>
             )}
             {!project.liveUrl && !project.githubUrl && (
                <div className="flex items-center justify-between w-full">
                   <span className="text-[9px] font-mono font-black uppercase tracking-[0.4em] text-white/30 group-hover:text-[var(--color-aqua)] transition-all">
                      INIT_PROTOCOL
                   </span>
                   <ArrowRight size={16} className="text-white/20 group-hover:text-[var(--color-aqua)] group-hover:translate-x-2 transition-all" />
                </div>
             )}
          </div>
        </div>
      </div>
    </motion.article>
  );
};

export const EnhancedHero = ({ profile, t, lang }: { profile: any, t: any, lang: string }) => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);

  return (
    <section className="relative min-h-[110vh] flex items-center justify-center pt-32 pb-40 lg:px-24 bg-background overflow-hidden">
      {/* Background Grid & FX */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-[0.03] pointer-events-none" />
      <div className="hero-glow pointer-events-none" aria-hidden="true" />
      
      {/* Mesh Gradient Animado */}
      <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-[var(--color-aqua)]/10 blur-[150px] rounded-full animate-pulse" />
      <div className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] bg-purple-500/10 blur-[150px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />

      <motion.div style={{ opacity }} className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
         <span className="text-[25rem] md:text-[45rem] font-black text-foreground uppercase tracking-tighter italic leading-none opacity-[0.02] select-none blur-3xl">ALBA</span>
      </motion.div>

      <div className="container-custom relative z-10 w-full text-center">
        <div className="max-w-[1400px] mx-auto space-y-16">
          
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-4 px-10 py-4 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-3xl text-[var(--color-aqua)] font-mono text-[9px] font-black uppercase tracking-[0.6em] mb-4 shadow-[0_0_30px_rgba(0,0,0,0.5)] border-white/10"
          >
             <div className="w-2 h-2 rounded-full bg-[var(--color-aqua)] animate-pulse shadow-[0_0_10px_var(--color-aqua)]" /> {t.hero.system_loaded}
          </motion.div>
          
          <div className="relative group perspective-2000 py-10 overflow-visible flex flex-col items-center justify-center uppercase">
            
            <div className="relative">
               {/* Metadata de Sistema Flotante */}
               <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute -top-10 -left-40 font-mono text-[8px] text-white/20 tracking-[0.5em] hidden xl:block border-l border-white/10 pl-6 py-4"
               >
                  CORE_LINK: STABLE <br /> 
                  DATA_STREAM: [100101...] <br />
                  SYNC_STATUS: 100%
               </motion.div>

               <motion.div 
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 5, repeat: Infinity }}
                  className="absolute -bottom-10 -right-40 font-mono text-[8px] text-white/20 tracking-[0.5em] hidden xl:block border-r border-white/10 pr-6 py-4 text-right"
               >
                  COORDS_X: {Math.random().toFixed(4)} <br /> 
                  COORDS_Y: {Math.random().toFixed(4)} <br />
                  NODE: ALBA_G_V1.5
               </motion.div>

               <motion.h1 
                 className="text-[14vw] md:text-[16vw] font-black tracking-[0.01em] leading-none relative z-10 font-outfit select-none flex items-center justify-center gap-4 filter drop-shadow-[0_0_50px_rgba(0,0,0,0.5)]"
               >
                 {['A', 'L', 'B', 'A'].map((letter, i) => (
                   <motion.span
                     key={i}
                     initial={{ opacity: 0, x: -50, rotateY: -45 }}
                     animate={{ opacity: 1, x: 0, rotateY: 0 }}
                     transition={{ duration: 1.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                     whileHover={{ scale: 1.05, filter: "brightness(1.5)" }}
                     className="text-white relative group/letter"
                   >
                     {letter}
                     <span className="absolute inset-0 text-[var(--color-aqua)]/20 blur-2xl opacity-0 group-hover/letter:opacity-100 transition-opacity">{letter}</span>
                   </motion.span>
                 ))}

                 <motion.span 
                   initial={{ opacity: 0, scale: 0.5 }}
                   animate={{ opacity: 1, scale: 1 }}
                   transition={{ delay: 0.8, type: 'spring' }}
                   className="relative flex items-center ml-10"
                 >
                    {/* El Nodo .G */}
                    <div className="relative group/g px-10 py-6 bg-white/[0.02] border border-white/10 rounded-[2rem] backdrop-blur-3xl hover:border-[var(--color-aqua)]/50 transition-all duration-700 shadow-3xl">
                       <span className="text-10xl md:text-[13rem] font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-[var(--color-aqua)]">
                          G
                       </span>
                       {/* Cantoneras High-Tech */}
                       <div className="absolute -top-3 -left-3 w-8 h-8 border-t-2 border-l-2 border-[var(--color-aqua)] transition-all group-hover/g:w-12 group-hover/g:h-12" />
                       <div className="absolute -bottom-3 -right-3 w-8 h-8 border-b-2 border-r-2 border-[var(--color-aqua)] transition-all group-hover/g:w-12 group-hover/g:h-12" />
                    </div>
                 </motion.span>
               </motion.h1>

               {/* Línea de Escaneo Láser */}
               <motion.div 
                  animate={{ left: ['0%', '100%'], opacity: [0, 1, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                  className="absolute -bottom-4 left-0 w-32 h-[2px] bg-[var(--color-aqua)] shadow-[0_0_20px_var(--color-aqua)] z-20"
               />
            </div>
          </div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="space-y-20 pt-10">
            <p className="text-white/70 text-xl md:text-3xl lg:text-4xl max-w-7xl mx-auto font-mono uppercase tracking-[0.25em] font-black px-12 leading-snug border-l-[6px] border-[var(--color-aqua)]/40 inline-block text-left italic">
              {t.hero.bio_1} <br /> 
              <span className="text-white font-black drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">{t.hero.bio_highlight}</span> <br />
              <span className="text-[var(--color-aqua)] opacity-90">{t.hero.bio_2}</span>
            </p>

            <div className="flex flex-wrap items-center justify-center gap-10">
               <motion.button 
                 whileHover={{ scale: 1.05, boxShadow: "0 0 50px rgba(0, 255, 240, 0.4)" }}
                 whileTap={{ scale: 0.95 }}
                 className="px-20 py-10 bg-[var(--color-aqua)] text-black rounded-full font-black text-[11px] font-mono uppercase tracking-[0.6em] shadow-[0_0_40px_rgba(0,255,240,0.2)]"
                 onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
               >
                  {t.hero.btn_deploy} <Rocket size={20} className="ml-4 inline-block" />
               </motion.button>
               
               <motion.a 
                  href={lang === 'en' ? "/downloads/CV_en.pdf" : "/downloads/CV_es.pdf"}
                  download={lang === 'en' ? "CV_Alba_Garcia_EN.pdf" : "CV_Alba_Garcia_ES.pdf"}
                  whileHover={{ backgroundColor: 'rgba(255,255,255,0.05)', scale: 1.05 }}
                  className="px-20 py-10 border-2 border-white/10 rounded-full font-black text-[11px] font-mono uppercase tracking-[0.6em] flex items-center gap-4 text-white/50 hover:text-white transition-all backdrop-blur-md"
               >
                  {t.hero.btn_dump} <Download size={20} />
               </motion.a>
            </div>
            
            {/* TERMINAL INTERACTIVA - PASANDO LANG */}
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1 }} className="pt-16">
               <InteractiveTerminal lang={lang} />
            </motion.div>

          </motion.div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-30"
      >
        <div className="w-[1px] h-20 bg-gradient-to-b from-transparent via-white to-transparent" />
        <span className="text-[8px] font-mono font-black uppercase tracking-[0.5em] text-white">SCROLL_TO_BOOT</span>
      </motion.div>
    </section>
  );
};

