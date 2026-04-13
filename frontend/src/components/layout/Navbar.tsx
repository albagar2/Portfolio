import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, Cpu, Database, Activity, User, Layers, GraduationCap, Newspaper, TerminalSquare } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

interface NavbarProps {
  onOpenContact: () => void;
  lang: string;
  setLang: (l: string) => void;
  t: any;
}

/**
 * COMPONENTE: Navbar (Sistema de Control de Navegación)
 * Navegación dinámica con scroll suave inteligente y soporte para múltiples idiomas.
 */
export const Navbar = ({ onOpenContact, lang, setLang, t }: NavbarProps) => {
  const [scrolled, setScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState('hero');
  const navigate = useNavigate();
  const location = useLocation();

  // Configuración de los nodos de navegación expandidos
  const NAVBAR_LINKS = [
    { id: 'hero', label: t.nav.boot, icon: Zap },
    { id: 'skills', label: t.nav.skills, icon: Cpu },
    { id: 'projects', label: t.nav.projects, icon: Layers },
    { id: 'experience', label: t.nav.experience, icon: Database },
    { id: 'education', label: t.nav.education, icon: GraduationCap },
    { id: 'posts', label: t.nav.posts, icon: Newspaper },
    { id: 'contact', label: t.nav.signal, icon: Activity },
  ];

  // Lógica de Scroll Suave con Redirección a Home si es necesario
  const scrollToSection = (id: string) => {
    if (id === 'contact') { onOpenContact(); return; }
    
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      return;
    }

    setActiveTab(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  // Observador de Intersección para detectar la sección activa
  useEffect(() => {
    const observerOptions = { root: null, rootMargin: '-250px 0px -250px 0px', threshold: 0 };
    const observerCallback = (entries: any) => { 
      entries.forEach((entry: any) => { 
        if (entry.isIntersecting) setActiveTab(entry.target.id); 
      }); 
    };
    const observer = new IntersectionObserver(observerCallback, observerOptions);
    NAVBAR_LINKS.forEach(link => { 
      const el = document.getElementById(link.id); 
      if (el) observer.observe(el); 
    });

    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    
    return () => { 
      observer.disconnect(); 
      window.removeEventListener('scroll', handleScroll); 
    };
  }, [lang]);

  // Colores Temáticos del Sistema según la sección
  const getThemeColor = () => {
    switch (activeTab) {
      case 'skills': return '#00FFF0';
      case 'projects': return '#D9FF00';
      case 'experience': return '#FF007A';
      case 'education': return '#A855F7';
      case 'posts': return '#6366F1';
      case 'contact': return '#FFB800';
      default: return '#00FFF0';
    }
  };

  const isHome = location.pathname === '/';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-1000 ${(scrolled || !isHome) ? 'py-4' : 'py-10'}`} aria-label="Navegación principal">
       <div className="container-custom flex flex-col items-center justify-center font-terminal px-4">
          <motion.div 
            layout
            className={`relative p-2 flex items-center justify-between border border-white/10 backdrop-blur-4xl transition-all duration-1000 ${
               scrolled 
               ? 'rounded-full px-4 lg:px-8 shadow-2xl bg-black/85' 
               : 'rounded-[1.5rem] lg:rounded-[4rem] px-6 lg:px-12 bg-white/5 shadow-2xl'
            }`}
            style={{ 
              boxShadow: `0 0 100px -30px ${getThemeColor()}20`,
              borderColor: `${getThemeColor()}30`,
              maxWidth: '98vw',
              width: '100%'
            }}
          >
             {/* Bloque Izquierdo: Logo (Compacto) */}
             <button onClick={() => scrollToSection('hero')} className="flex items-center gap-2 lg:gap-4 pr-3 lg:pr-6 border-r border-white/10 group shrink-0">
                <motion.div 
                  transition={{ duration: 30, repeat: Infinity, ease: "linear" }} 
                  animate={{ rotate: 360 }}
                  className="w-9 h-9 lg:w-12 lg:h-12 border border-current rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-[0_0_10px_current]" 
                  style={{ color: getThemeColor() }}
                >
                   <Zap size={20} className="fill-current" />
                </motion.div>
                {!scrolled && (
                   <span className="font-mono text-[10px] lg:text-[11px] font-black uppercase tracking-[0.3em] lg:tracking-[0.6em] hidden md:block text-white">
                      ALBA<span style={{ color: getThemeColor() }}>.SYS</span>
                   </span>
                )}
             </button>
             
             {/* Bloque Central: Nodos (Gap mínimo de seguridad) */}
             <div className="flex items-center gap-0.5 lg:gap-1.5 overflow-hidden">
                {NAVBAR_LINKS.map((link) => (
                   <button 
                    key={link.id} 
                    onClick={() => scrollToSection(link.id)}
                    className="relative px-2 lg:px-5 py-3 rounded-xl flex items-center gap-2 text-[9px] lg:text-[10px] font-mono uppercase tracking-[0.1em] lg:tracking-[0.3em] transition-all duration-500 group"
                    style={{ color: activeTab === link.id ? 'white' : 'rgba(255,255,255,0.2)' }}
                   >
                      <link.icon size={16} className={`transition-all duration-500 ${activeTab === link.id ? 'scale-110' : 'opacity-20 group-hover:opacity-100'}`} style={{ color: activeTab === link.id ? getThemeColor() : '' }} />
                      <span className="hidden xl:block">{link.label}</span>
                      {activeTab === link.id && (
                         <motion.div layoutId="nav-bg" className="absolute inset-0 -z-10 rounded-xl bg-white/[0.06]" />
                      )}
                   </button>
                ))}
             </div>
             
             {/* Bloque Derecho: Acciones (Compacto) */}
             <div className="flex items-center gap-2 lg:gap-4 pl-3 lg:pl-6 border-l border-white/10 shrink-0">
                <a 
                  href="/PORTAL_DEMOS.html" 
                  target="_blank" 
                  className="px-3 lg:px-6 h-9 lg:h-11 rounded-lg bg-cyber-blue/10 border border-cyber-blue/30 flex items-center justify-center font-mono text-[9px] font-black text-cyber-blue hover:bg-cyber-blue hover:text-black transition-all group tracking-[0.1em] lg:tracking-[0.3em] uppercase"
                >
                   <TerminalSquare size={14} className="lg:mr-2" />
                   <span className="hidden lg:block">DEMOS</span>
                </a>

                <button 
                  onClick={() => setLang(lang === 'es' ? 'en' : 'es')}
                  className="w-9 h-9 lg:w-11 lg:h-11 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center font-mono text-[10px] font-black text-white hover:border-cyber-blue transition-all"
                >
                   {lang.toUpperCase()}
                </button>
                
                <Link to="/admin/dashboard" className="w-9 h-9 lg:w-11 lg:h-11 bg-white/5 border border-white/10 rounded-full flex items-center justify-center transition-all group overflow-hidden">
                   <User size={16} className="group-hover:text-cyber-blue transition-colors text-white" />
                </Link>
             </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: scrolled ? 0 : 1, y: scrolled ? -10 : 0 }}
            className="mt-4 flex items-center gap-3 px-6 py-1.5 rounded-full border border-cyber-blue/20 bg-black/40 backdrop-blur-md pointer-events-none"
          >
             <Zap size={10} className="text-cyber-blue animate-pulse" />
             <span className="text-[8px] font-mono text-cyber-blue uppercase tracking-[0.5em] font-bold">
                ALBA_OS_CORE_V1.5_READY
             </span>
          </motion.div>
       </div>
    </nav>
  );
};
