import React, { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ExternalLink, Github, ArrowRight, Code2, Cpu, Rocket, Download, Sparkles, Zap, ShieldCheck, Globe, Activity, Terminal as TerminalIcon, CheckCircle2 } from 'lucide-react';

interface Project {
  id: string; title: string; description: string; technologies: { name: string }[]; imageUrl?: string; liveUrl?: string; githubUrl?: string; category: string;
}

const InteractiveTerminal = () => {
    const [history, setHistory] = useState<string[]>(['ALBA_OS_BOOT_SEQUENCE_OK', 'Initializing kernel...', 'Accessing user_profile.bin', 'Type "help" for a list of commands.']);
    const [input, setInput] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);

    const handleCommand = (e: React.FormEvent) => {
        e.preventDefault();
        const cmd = input.toLowerCase().trim();
        let response = '';
        
        switch(cmd) {
            case 'help': response = 'AVAILABLE_CMDS: bio, skills, projects, stack, clear, whoami'; break;
            case 'bio': response = 'Alba García: Software Architect specializing in high-performance digital ecosystems.'; break;
            case 'skills': response = 'CORE_STACK: React 18, TypeScript, Node.js, PostgreSQL, Cloud_Infra.'; break;
            case 'projects': response = 'SCANNING: [Familiar, EsquelasTV, Mio, Gasoil, GestorProyectos] Found 5 active nodes.'; break;
            case 'stack': response = 'TECH: Next.js, Framer_Motion, Tailwind, Python, SQLite.'; break;
            case 'whoami': response = 'USER: Recruiter_Entity // STATUS: Authorized_Access'; break;
            case 'clear': setHistory([]); setInput(''); return;
            default: response = `ERR: Command "${cmd}" not found in core database.`;
        }
        
        setHistory([...history, `> ${input}`, response]);
        setInput('');
    };

    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [history]);

    return (
        <div className="os-window w-full max-w-2xl mx-auto border-white/10 bg-black/40 backdrop-blur-3xl overflow-hidden mt-12 group hover:border-[#00FFF0]/30 transition-all duration-700 shadow-2xl">
            <div className="os-header bg-white/[0.03] border-b border-white/5 py-3 px-6 flex items-center justify-between">
                <div className="flex gap-2"><div className="w-2 h-2 rounded-full bg-red-500/30" /><div className="w-2 h-2 rounded-full bg-yellow-400/30" /><div className="w-2 h-2 rounded-full bg-green-500/30" /></div>
                <div className="font-mono text-[8px] text-white/30 uppercase tracking-[0.5em] flex items-center gap-2">
                   <TerminalIcon size={12} /> SESSION_TTY_01
                </div>
            </div>
            <div ref={scrollRef} className="p-8 h-48 overflow-y-auto font-mono text-[10px] space-y-2 custom-scrollbar text-white/60">
                {history.map((line, i) => (
                    <div key={i} className={line.startsWith('>') ? 'text-[#00FFF0]' : ''}>{line}</div>
                ))}
            </div>
            <form onSubmit={handleCommand} className="p-4 border-t border-white/5 flex items-center gap-4 bg-white/[0.02]">
                <span className="text-[#00FFF0] font-mono text-[10px] ml-4 animate-pulse">{'>'}</span>
                <input 
                   type="text" 
                   value={input}
                   onChange={(e) => setInput(e.target.value)}
                   className="bg-transparent border-none outline-none font-mono text-[10px] text-white w-full uppercase tracking-widest"
                   placeholder="COMMAND_INPUT..."
                />
            </form>
        </div>
    );
};

export const ProjectCard: React.FC<{ project: Project; index: number }> = ({ project, index }) => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative h-full"
    >
      <div className="absolute -inset-0.5 bg-gradient-to-br from-[#D9FF00]/20 to-[#00FFF0]/20 rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-100 transition duration-1000" />
      <div className="relative os-window overflow-hidden flex flex-col h-full rounded-[2.5rem] border border-white/5 bg-[#010309]/90 backdrop-blur-3xl hover:border-[#D9FF00]/50 transition-all duration-700">
        <div className="relative h-60 bg-[#0a0f1d] overflow-hidden border-b border-white/5">
           <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#D9FF00_1px,transparent_1px)] [background-size:16px_16px]" />
           <div className="absolute inset-0 bg-gradient-to-t from-[#010309] via-transparent to-transparent" />
           <motion.div whileHover={{ scale: 1.1 }} className="absolute inset-0 flex items-center justify-center">
              <div className="p-10 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-3xl shadow-2xl transition-all group-hover:bg-[#D9FF00]/5">
                 <Code2 size={44} className="text-[#D9FF00] drop-shadow-[0_0_15px_rgba(217,255,0,0.5)]" />
              </div>
           </motion.div>
           <div className="absolute top-8 left-8">
              <div className="glass-badge border-[#D9FF00]/30 text-[#D9FF00] font-black uppercase tracking-[0.4em] italic text-[8px] bg-[#D9FF00]/5">
                 MODULE_{project.category}
              </div>
           </div>
        </div>

        <div className="p-12 flex flex-col flex-grow">
          <h3 className="text-4xl font-black mb-4 tracking-tighter uppercase italic leading-none text-white group-hover:text-[#D9FF00] transition-all font-outfit">
             {project.title}
          </h3>
          <p className="text-slate-500 font-mono text-[10px] leading-relaxed mb-10 flex-grow uppercase tracking-widest opacity-60">
            {project.description}
          </p>
          <div className="flex flex-wrap gap-2.5 mb-10">
            {project.technologies?.slice(0, 4).map((tech, i) => (
              <span key={i} className="text-[8px] font-mono px-4 py-1.5 bg-white/5 rounded-full border border-white/10 font-black uppercase tracking-[0.2em] text-[#D9FF00]/50">
                 {tech.name}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-10 pt-10 border-t border-white/10">
            <span className="flex items-center gap-2 text-[10px] font-mono font-black uppercase tracking-[0.4em] text-white hover:text-[#D9FF00] transition-colors cursor-pointer"><Globe size={14} /> BOOT_PRJ</span>
            <span className="flex items-center gap-2 text-[10px] font-mono font-black uppercase tracking-[0.4em] text-white hover:text-[#D9FF00] transition-colors cursor-pointer"><Github size={14} /> SRC_CODE</span>
          </div>
        </div>
      </div>
    </motion.article>
  );
};

export const EnhancedHero = ({ profile, t }: { profile: any, t: any }) => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 400], [0.3, 0]);

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-56 pb-24 lg:px-24 overflow-hidden bg-[#010309]">
      <div className="hero-glow pointer-events-none" aria-hidden="true" />
      <motion.div style={{ opacity }} className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
         <span className="text-[20rem] md:text-[35rem] font-black text-white uppercase tracking-tighter italic leading-none opacity-20 select-none blur-2xl">ALBA</span>
      </motion.div>

      <div className="container-custom relative z-10 w-full text-center">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-4 px-10 py-3 rounded-full bg-[#00FFF0]/5 border border-[#00FFF0]/30 backdrop-blur-3xl text-[#00FFF0] font-mono text-[9px] font-black uppercase tracking-[0.6em] mb-4 shadow-2xl"
          >
             <Zap size={14} className="fill-current animate-pulse" /> {t.hero.system_loaded}
          </motion.div>
          
          <div className="relative group perspective-1000">
            {/* Capa de Brillo/Glow Dinámico Detrás del Título */}
            <motion.div 
               style={{ y: y1 }}
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="absolute inset-0 flex items-center justify-center -z-10 blur-[120px] opacity-30 group-hover:opacity-50 transition-opacity duration-1000"
            >
               <div className="w-[80%] h-32 bg-gradient-to-r from-[#00FFF0] via-[#D9FF00] to-[#FF007A]" />
            </motion.div>

            <motion.h1 
              style={{ y: y1 }}
              initial={{ opacity: 0, scale: 0.9, rotateX: -20 }}
              animate={{ opacity: 1, scale: 1, rotateX: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="text-9xl md:text-[15rem] lg:text-[18rem] font-black tracking-tighter leading-[0.7] text-white italic uppercase relative z-10 font-outfit select-none"
            >
              <span className="relative inline-block">
                ALBA
                {/* Efecto de Glitch Sutil (Capa Superior) */}
                <motion.span 
                   animate={{ 
                      x: [0, 2, -2, 0], 
                      opacity: [1, 0.8, 1] 
                   }} 
                   transition={{ 
                      duration: 0.2, 
                      repeat: Infinity, 
                      repeatType: "mirror",
                      repeatDelay: 5 
                   }}
                   className="absolute inset-0 text-[#00FFF0] opacity-20 translate-x-[2px] translate-y-[-1px] pointer-events-none"
                >
                  ALBA
                </motion.span>
              </span>
              <span className="relative inline-block ml-2 translate-y-[0.05em]">
                 <span className="text-transparent bg-clip-text bg-gradient-to-br from-[#00FFF0] via-[#D9FF00] to-[#00FFF0] bg-[length:200%_auto] animate-gradient-flow">.G</span>
                 {/* Nodo de Interfaz en el punto */}
                 <motion.div 
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute -bottom-2 right-0 w-8 h-8 rounded-full border border-[#D9FF00]/50 -z-10 blur-sm" 
                 />
              </span>
            </motion.h1>
          </div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="space-y-12">
            <p className="text-slate-400 text-xl md:text-3xl lg:text-4xl max-w-7xl mx-auto font-mono uppercase tracking-[0.2em] font-black px-12 leading-tight border-l-[4px] border-[#00FFF0]/20 inline-block text-left opacity-90">
              {t.hero.bio_1} <br /> 
              <span className="text-[#00FFF0]">{t.hero.bio_highlight}</span> <br />
              <span className="italic text-white underline decoration-[#D9FF00]/40 underline-offset-8">{t.hero.bio_2}</span>
            </p>

            <div className="flex flex-wrap items-center justify-center gap-8 pt-6">
               <motion.button 
                 whileHover={{ scale: 1.05, boxShadow: "0 0 50px rgba(0, 255, 240, 0.3)" }}
                 whileTap={{ scale: 0.95 }}
                 className="px-16 py-8 bg-[#00FFF0] text-black rounded-full font-black text-[10px] font-mono uppercase tracking-[0.5em] shadow-3xl transition-all"
                 onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
               >
                  {t.hero.btn_deploy} <Rocket size={20} className="ml-3 inline-block" />
               </motion.button>
               
               <motion.a 
                  href="/downloads/CV-Alba-Garcia-Lopez.pdf"
                  download="CV-Alba-Garcia-Lopez.pdf"
                  whileHover={{ backgroundColor: 'white', color: 'black', scale: 1.05 }}
                  className="px-16 py-8 border-2 border-white/20 rounded-full font-black text-[10px] font-mono uppercase tracking-[0.5em] flex items-center gap-4 transition-all text-white"
               >
                  {t.hero.btn_dump} <Download size={20} />
               </motion.a>
            </div>
            
            {/* TERMINAL INTERACTIVA - EL FACTOR WOW DEFINITIVO */}
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }} className="pt-10">
               <InteractiveTerminal />
            </motion.div>

          </motion.div>
        </div>
      </div>
    </section>
  );
};
