import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Github, Code2, Cpu, Globe, ArrowRight, CheckCircle2, Brain, Activity, Zap } from 'lucide-react';

interface ProjectModalProps {
  project: any;
  isOpen: boolean;
  onClose: () => void;
  t: any;
}

export const ProjectModal = ({ project, isOpen, onClose, t }: ProjectModalProps) => {
  if (!project) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 lg:p-24 overflow-hidden">
      {/* Overlay con Blur dinámico */}
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }} 
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-xl" 
      />

      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 50 }} 
        animate={{ opacity: 1, scale: 1, y: 0 }} 
        exit={{ opacity: 0, scale: 0.9, y: 50 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative os-window w-full max-w-6xl max-h-[90vh] overflow-y-auto custom-scrollbar border-border bg-background/95"
      >
        {/* Header del Modal */}
        <header className="sticky top-0 z-20 os-header bg-background/80 backdrop-blur-md border-border flex items-center justify-between">
           <div className="flex items-center gap-4">
              <div className="flex gap-2">
                 <div className="os-dot bg-red-500/50" />
                 <div className="os-dot bg-yellow-500/50" />
                 <div className="os-dot bg-green-500/50" />
              </div>
              <span className="font-mono text-[9px] font-black uppercase tracking-[0.5em] text-[var(--color-lime)]">
                 PRJ_VIEWER_V1.5 // {project.title}
              </span>
           </div>
           <button 
             onClick={onClose}
             className="w-10 h-10 rounded-full bg-foreground/[0.05] flex items-center justify-center hover:bg-red-500/20 hover:text-red-500 transition-all border border-border"
           >
              <X size={20} />
           </button>
        </header>

        <div className="p-10 lg:p-20 grid lg:grid-cols-2 gap-20">
           {/* Lado Izquierdo: Visuals */}
           <div className="space-y-12">
              <div className="os-window aspect-video overflow-hidden border-border relative group">
                 <img 
                    src={project.imageUrl || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop'} 
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                 <div className="absolute top-8 left-8">
                    <div className="glass-badge border-[var(--color-aqua)]/30 text-[var(--color-aqua)] font-black uppercase tracking-[0.4em] italic text-[8px] bg-black/50">
                       NODE_{project.category}
                    </div>
                 </div>
              </div>

              <div className="space-y-6">
                 <h3 className="font-mono text-[10px] font-black uppercase tracking-[0.4em] text-[var(--color-aqua)]/60 flex items-center gap-4">
                    <Cpu size={14} /> {t.projects.tech_used}
                 </h3>
                 <div className="flex flex-wrap gap-3">
                    {project.technologies?.map((tech: any, i: number) => (
                       <span key={i} className="px-6 py-2 bg-foreground/[0.03] border border-border rounded-xl font-mono text-[9px] font-black uppercase tracking-widest text-foreground/80 flex items-center gap-2">
                          <CheckCircle2 size={10} className="text-[var(--color-lime)]" /> {tech.name}
                       </span>
                    ))}
                 </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-10 border-t border-border">
                 {project.liveUrl && (
                    <a href={project.liveUrl} target="_blank" className="btn-os bg-[var(--color-lime)] text-black px-8 py-5 flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest">
                       {t.projects.live_link} <Globe size={16} />
                    </a>
                 )}
                 {project.githubUrl && (
                    <a href={project.githubUrl} target="_blank" className="btn-os border-2 border-border text-foreground px-8 py-5 flex items-center justify-center gap-3 hover:bg-foreground hover:text-black text-[10px] font-black uppercase tracking-widest">
                       {t.projects.github_link} <Github size={16} />
                    </a>
                 )}
              </div>
           </div>

           {/* Lado Derecho: Contenido */}
           <div className="space-y-12">
              <div>
                 <h2 className="text-7xl lg:text-9xl font-black italic uppercase tracking-tighter leading-none mb-8 text-foreground">
                    {project.title}
                 </h2>
                 <p className="text-xl lg:text-2xl text-foreground/80 font-mono uppercase tracking-[0.2em] leading-relaxed border-l-4 border-[var(--color-lime)] pl-10 mb-12 italic">
                    {project.description}
                 </p>
                 
                  <div className="prose prose-invert max-w-none text-foreground/85 font-mono text-sm leading-relaxed space-y-8 uppercase tracking-[0.15em] opacity-90">
                    <div>
                       <h4 className="flex items-center gap-3 text-[var(--color-lime)] mb-4 font-black">
                          <Globe size={16} /> WHAT_SYSTEM_DOES
                       </h4>
                       <p className="bg-foreground/[0.02] p-6 border-l-2 border-border/30 italic">
                          {project.longDescription || 'System documentation currently in decryption process.'}
                       </p>
                    </div>

                    {project.evolution && (
                       <div>
                          <h4 className="flex items-center gap-3 text-purple-400 mb-4 font-black">
                             <Activity size={16} /> {t.projects.evolution}
                          </h4>
                          <p className="bg-foreground/[0.02] p-6 border-l-2 border-border/30">
                             {project.evolution}
                          </p>
                       </div>
                    )}

                    {project.solved && (
                       <div>
                          <h4 className="flex items-center gap-3 text-[var(--color-aqua)] mb-4 font-black">
                             <CheckCircle2 size={16} /> {t.projects.solved_problems}
                          </h4>
                          <p className="bg-foreground/[0.02] p-6 border-l-2 border-border/30">
                             {project.solved}
                          </p>
                       </div>
                    )}

                    {project.challenges && (
                       <div>
                          <h4 className="flex items-center gap-3 text-red-500 mb-4 font-black">
                             <Brain size={16} /> {t.projects.technical_challenges}
                          </h4>
                          <p className="bg-foreground/[0.02] p-6 border-l-2 border-border/30">
                             {project.challenges}
                          </p>
                       </div>
                    )}

                    {project.limitations && (
                       <div>
                          <h4 className="flex items-center gap-3 text-yellow-500 mb-4 font-black">
                             <Zap size={16} /> {t.projects.limitations}
                          </h4>
                          <div className="bg-yellow-500/5 p-6 border-l-2 border-yellow-500/30 font-bold italic text-foreground/80">
                             {project.limitations}
                          </div>
                       </div>
                    )}
                 </div>
              </div>

              {/* Stats / Metadata */}
              <div className="grid grid-cols-2 gap-8 pt-12 border-t border-border">
                 <div className="os-window p-8 bg-foreground/[0.01]">
                    <div className="font-mono text-[8px] text-[var(--color-aqua)] uppercase tracking-[0.4em] mb-2">STATUS</div>
                    <div className="font-black text-xl text-foreground uppercase italic">PRODUCTION_READY</div>
                 </div>
                 <div className="os-window p-8 bg-foreground/[0.01]">
                    <div className="font-mono text-[8px] text-[var(--color-lime)] uppercase tracking-[0.4em] mb-2">INTEGRITY</div>
                    <div className="font-black text-xl text-foreground uppercase italic">100%_STABLE</div>
                 </div>
              </div>
           </div>
        </div>
      </motion.div>
    </div>
  );
};
