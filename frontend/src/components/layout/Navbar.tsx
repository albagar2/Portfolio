import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, Cpu, Database, Activity, User, Layers, GraduationCap, Newspaper } from 'lucide-react';
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
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-1000 ${(scrolled || !isHome) ? 'py-4' : 'py-16'}`} aria-label="Navegación principal">
       <div className="container-custom flex items-center justify-center font-terminal px-4">
          <motion.div 
            layout
            className={`relative p-3 flex items-center gap-2 border-[1.5px] border-white/10 backdrop-blur-3xl transition-all duration-1000 ${
               scrolled ? 'rounded-full px-10 shadow-2xl bg-black/60' : 'rounded-[3rem] px-16 bg-white/5 shadow-2xl'
            }`}
            style={{ boxShadow: `0 0 80px -20px ${getThemeColor()}30` }}
          >
             {/* Logo / Boot Link */}
             <button onClick={() => scrollToSection('hero')} className="flex items-center gap-5 pr-8 border-r border-white/10 group">
                <motion.div 
                  animate={{ rotate: 360 }} 
                  transition={{ duration: 30, repeat: Infinity, ease: "linear" }} 
                  className="w-12 h-12 border border-current rounded-2xl flex items-center justify-center shadow-xl hover:shadow-[0_0_20px_current]" 
                  style={{ color: getThemeColor() }}
                >
                   <Zap size={24} className="fill-current" />
                </motion.div>
                {!scrolled && (
                   <span className="font-mono text-[10px] font-black uppercase tracking-[0.6em] hidden sm:block text-white">
                      ALBA<span style={{ color: getThemeColor() }}>.SYS</span>
                   </span>
                )}
             </button>
             
             {/* Nodos de Navegación */}
             <div className="flex items-center gap-2">
                {NAVBAR_LINKS.map((link) => (
                   <button 
                    key={link.id} 
                    onClick={() => scrollToSection(link.id)}
                    className="relative px-6 py-3.5 rounded-2xl flex items-center gap-4 text-[9px] font-mono uppercase tracking-[0.4em] transition-all duration-700 group"
                    style={{ color: activeTab === link.id ? 'white' : 'rgba(255,255,255,0.2)' }}
                   >
                      <link.icon size={18} className={`transition-all duration-500 ${activeTab === link.id ? 'scale-110' : 'opacity-20'}`} />
                      <span className="hidden lg:block">{link.label}</span>
                      {activeTab === link.id && (
                         <motion.div layoutId="nav-bg" className="absolute inset-0 -z-10 rounded-2xl bg-white/[0.04] shadow-2xl" />
                      )}
                   </button>
                ))}
             </div>

             {/* Selectores de Configuración (Lang y Admin) */}
             <div className="flex items-center gap-4 pl-8 border-l border-white/10">
                <button 
                  onClick={() => setLang(lang === 'es' ? 'en' : 'es')}
                  className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-mono text-[10px] font-black text-white hover:bg-[#D9FF00] hover:text-black transition-all group"
                  title="Cambiar Idioma"
                >
                   {lang.toUpperCase()}
                </button>
                
                <Link to="/admin/dashboard" className="w-12 h-12 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full flex items-center justify-center transition-all group overflow-hidden">
                   <User size={18} className="group-hover:text-[#00FFF0] transition-colors text-white" />
                </Link>
             </div>
          </motion.div>
       </div>
    </nav>
  );
};
