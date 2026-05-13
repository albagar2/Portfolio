import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Database, Github, Cpu, ShieldAlert, Globe } from 'lucide-react';

interface FooterProps {
  data: any;
  t: any;
  lang: string;
}

/**
 * COMPONENTE: Footer (Sistema de Cierre de Sesión)
 * Muestra información de contacto, redes sociales y créditos de arquitectura.
 */
export const Footer = ({ data, t, lang }: FooterProps) => {
  const profile = data.profile || {};

  // Helper para obtener el campo traducido o el original de respaldo
  const getT = (obj: any, field: string) => {
    if (lang === 'en') {
      const enField = `${field}_en`;
      return obj[enField] || obj[field];
    }
    return obj[field];
  };

  return (
    <footer className="py-24 px-6 lg:px-20 border-t border-border relative overflow-hidden bg-foreground/[0.02]">
      {/* Elementos Decorativos de Fondo */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[1px] bg-gradient-to-r from-transparent via-foreground/[0.05] to-transparent" />
      
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-12 text-center z-10 relative">
        {/* Nodo de Encabezado Logo */}
        <motion.div 
            whileHover={{ scale: 1.1, rotate: 10 }}
            className="w-16 h-16 rounded-[1.5rem] bg-foreground flex items-center justify-center text-background shadow-2xl relative group overflow-hidden transition-all duration-500"
        >
           <Zap size={28} className="fill-current group-hover:scale-110 group-hover:rotate-12 transition-transform" />
        </motion.div>

        {/* Información de Identidad */}
        <div className="space-y-6">
           <h4 className="text-3xl font-mono font-black tracking-[0.4em] uppercase italic text-foreground/50">
              {profile.name?.toUpperCase().replace(/ /g, '_') || 'ALBA_GARCIA_LOPEZ'}
           </h4>
           <div className="text-[var(--color-aqua)] text-[10px] font-mono uppercase tracking-[0.6em] opacity-30">
              {getT(profile, 'title') || t.footer.architecture}
           </div>
           
           {/* Enlaces de Conectividad (Redes) */}
           <div className="flex flex-wrap items-center justify-center gap-10 pt-10">
              {profile.email && (
                 <a href={`mailto:${profile.email}`} className="text-[10px] font-mono text-foreground/95 hover:text-[var(--color-aqua)] transition-colors uppercase tracking-[0.3em] flex items-center gap-3 group">
                    <Database size={14} className="opacity-40 group-hover:opacity-100" /> {profile.email}
                 </a>
              )}
              {profile.githubUrl && (
                 <a href={profile.githubUrl} target="_blank" rel="noreferrer" className="text-[10px] font-mono text-foreground/95 hover:text-foreground transition-colors uppercase tracking-[0.3em] flex items-center gap-3 group">
                    <Github size={14} className="opacity-40 group-hover:opacity-100" /> {lang === 'en' ? 'GITHUB_REPOSITORY' : 'REPOSITORIO_GITHUB'}
                 </a>
              )}
              {profile.linkedinUrl && (
                 <a href={profile.linkedinUrl} target="_blank" rel="noreferrer" className="text-[10px] font-mono text-foreground/95 hover:text-[var(--color-aqua)] transition-colors uppercase tracking-[0.3em] flex items-center gap-3 group">
                    <Cpu size={14} className="opacity-40 group-hover:opacity-100" /> {lang === 'en' ? 'LINKEDIN_NODE' : 'NODO_LINKEDIN'}
                 </a>
              )}
              {profile.websiteUrl && (
                 <a href={profile.websiteUrl} target="_blank" rel="noreferrer" className="text-[10px] font-mono text-foreground/95 hover:text-[var(--color-aqua)] transition-colors uppercase tracking-[0.3em] flex items-center gap-3 group">
                    <Globe size={14} className="opacity-40 group-hover:opacity-100" /> {lang === 'en' ? 'PERSONAL_WEBSITE' : 'WEB_PERSONAL'}
                 </a>
              )}
           </div>

           {/* Créditos de Integridad y Copyright */}
           <div className="flex items-center justify-center gap-4 pt-16 border-t border-border">
              <ShieldAlert size={14} className="text-[#FF007A] opacity-30" />
              <div className="text-[10px] font-mono text-foreground/20 tracking-[0.5em] uppercase font-black">
                 © 2026 {profile.name || 'ALBA GARCÍA LÓPEZ'} // {t.footer.rights}
              </div>
           </div>
        </div>
      </div>
    </footer>
  );
};

