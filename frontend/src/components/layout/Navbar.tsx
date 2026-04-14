import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, Cpu, Database, Activity, User, Layers, GraduationCap, Newspaper, TerminalSquare, Sun, Moon } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

interface NavbarProps {
  onOpenContact: () => void;
  lang: string;
  setLang: (l: string) => void;
  isDark: boolean;
  setIsDark: (d: boolean) => void;
  t: any;
}

/**
 * COMPONENTE: Navbar (Sistema de Control de Navegación)
 * Navegación dinámica con scroll suave inteligente y soporte para múltiples idiomas.
 */
export const Navbar = ({ onOpenContact, lang, setLang, isDark, setIsDark, t }: NavbarProps) => {
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
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
        setActiveTab(id);
      }, 150);
      return;
    }

    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setActiveTab(id);
    }
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
      if (observer) observer.disconnect(); 
      window.removeEventListener('scroll', handleScroll); 
    };
  }, [lang, location.pathname]);

  // Colores Temáticos del Sistema según la sección
  const getThemeColor = () => {
    switch (activeTab) {
      case 'skills': return 'var(--color-aqua)';
      case 'projects': return 'var(--color-lime)';
      case 'experience': return '#FF007A';
      case 'education': return '#A855F7';
      case 'posts': return '#6366F1';
      case 'contact': return '#FFB800';
      default: return 'var(--color-aqua)';
    }
  };

  const isHome = location.pathname === '/';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-1000 ${(scrolled || !isHome) ? 'py-4' : 'py-10'}`} aria-label="Navegación principal">
       <div className="container-custom flex flex-col items-center justify-center font-terminal px-4">
          <motion.div 
            layout
            className={`relative p-2 flex items-center justify-between border border-border backdrop-blur-4xl transition-all duration-1000 ${
               scrolled 
               ? 'rounded-full px-4 lg:px-8 shadow-2xl bg-background/95' 
               : 'rounded-[1.5rem] lg:rounded-[4rem] px-6 lg:px-12 bg-background/60 shadow-2xl'
            }`}
            style={{ 
              boxShadow: scrolled ? `0 0 100px -30px ${getThemeColor()}20` : 'none',
              borderColor: `${getThemeColor()}60`,
              maxWidth: '98vw',
              width: '100%'
            }}
          >
             {/* Bloque Izquierdo: Logo (Compacto) */}
             <button onClick={() => scrollToSection('hero')} className="flex items-center gap-2 lg:gap-4 pr-3 lg:pr-6 border-r border-foreground/10 group shrink-0">
                <motion.div 
                  transition={{ duration: 30, repeat: Infinity, ease: "linear" }} 
                  animate={{ rotate: 360 }}
                  className="w-9 h-9 lg:w-12 lg:h-12 border border-current rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-[0_0_10px_current]" 
                  style={{ color: getThemeColor() }}
                >
                   <Zap size={20} className="fill-current" />
                </motion.div>
                {!scrolled && (
                   <span className="font-mono text-[10px] lg:text-[11px] font-black uppercase tracking-[0.3em] lg:tracking-[0.6em] hidden md:block text-foreground transition-colors duration-500">
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
                    style={{ color: activeTab === link.id ? 'hsl(var(--foreground))' : 'hsl(var(--foreground) / 0.65)' }}
                   >
                      <link.icon size={16} className={`transition-all duration-500 ${activeTab === link.id ? 'scale-110' : 'opacity-45 group-hover:opacity-100'}`} style={{ color: activeTab === link.id ? getThemeColor() : '' }} />
                      <span className="hidden xl:block">{link.label}</span>
                      {activeTab === link.id && (
                         <motion.div layoutId="nav-bg" className="absolute inset-0 -z-10 rounded-xl bg-foreground/[0.05]" />
                      )}
                   </button>
                ))}
             </div>
             
             {/* Bloque Derecho: Acciones (Compacto) */}
             <div className="flex items-center gap-2 lg:gap-4 pl-3 lg:pl-6 border-l border-border shrink-0">
                {/* Theme Toggle */}
                <button 
                  onClick={() => setIsDark(!isDark)}
                  className="w-9 h-9 lg:w-11 lg:h-11 rounded-lg bg-foreground/[0.03] border border-border flex items-center justify-center text-foreground hover:border-cyber-blue transition-all"
                >
                   {isDark ? <Sun size={18} /> : <Moon size={18} />}
                </button>

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
                  className="w-9 h-9 lg:w-11 lg:h-11 rounded-lg bg-foreground/[0.03] border border-border flex items-center justify-center font-mono text-[10px] font-black text-foreground hover:border-cyber-blue transition-all"
                >
                   {lang.toUpperCase()}
                </button>
                
                <Link to="/admin/dashboard" className="w-9 h-9 lg:w-11 lg:h-11 bg-foreground/[0.03] border border-border rounded-full flex items-center justify-center transition-all group overflow-hidden">
                   <User size={16} className="group-hover:text-cyber-blue transition-colors text-foreground" />
                </Link>
             </div>
          </motion.div>
       </div>
    </nav>
  );
};
