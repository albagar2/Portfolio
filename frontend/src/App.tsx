import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, Link, useLocation, Navigate, Outlet, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { 
  Github, Linkedin, Twitter, Menu, X, 
  Code2, ExternalLink, Mail, User, 
  LayoutGrid, Briefcase, GraduationCap, 
  Newspaper, ChevronRight, Download, Sparkles, ArrowRight, Zap, Target, Rocket, Globe, Home as HomeIcon, Cpu, Activity, Database, ShieldAlert, Brain, Send, Loader2, Clock,
  Monitor, Server, Layers, CheckCircle2, ShieldCheck
} from 'lucide-react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { api } from './services/api';

// --- Components ---
import { ProjectCard, EnhancedHero } from './components/layout/EnhancedHero';
import { Login } from './pages/admin/Login';
import { Register } from './pages/admin/Register';
import { AdminLayout } from './pages/admin/AdminLayout';
import { Dashboard } from './pages/admin/Dashboard';
import { ProfileManager } from './pages/admin/ProfileManager';
import { CvManager } from './pages/admin/CvManager';
import { ProjectsManager } from './pages/admin/ProjectsManager';
import { MessagesManager } from './pages/admin/MessagesManager';
import { BlogPostsManager } from './pages/admin/BlogPostsManager';
import { BlogPostDetail } from './pages/BlogPostDetail';

// --- Types ---
interface Project { id: string; title: string; description: string; technologies: { name: string }[]; imageUrl?: string; liveUrl?: string; githubUrl?: string; category: string; }

// --- TRANSLATIONS (UPDATED WITH SKILLS) ---
const translations: any = {
  es: {
    nav: { boot: 'Inicio', systems: 'Sistemas', registry: 'Registro', signal: 'Señal' },
    hero: { system_loaded: 'ALBA_OS_CORE_v1.5_READY', bio_1: 'CONSTRUYENDO EL FUTURO DE LAS', bio_highlight: 'INFRAESTRUCTURAS DIGITALES', bio_2: 'CON INGENIERÍA DE ÉLITE.', btn_deploy: 'DESPLEGAR_SISTEMA', btn_dump: 'VOLCAR_REGISTRO' },
    skills: { title: 'DASHBOARD: TECH_STACK_MATRIX.bin', frontend: 'ESTRUCTURA_FRONT', backend: 'LÓGICA_NÚCLEO', tools: 'HERRAMIENTAS_SOPORTE' },
    projects: { module_title: 'MÓDULO: CORE_SYSTEMS_v1.5' },
    experience: { module_title: 'REGISTRO: TIMELINE_CORE.log', data_core: 'DATA CORE', timeline_desc: 'Trazabilidad secuencial de hitos de ingeniería y despliegues críticos.' },
    education: { module_title: 'REGISTRO: ACADEMIC_NODES.log', data_core: 'ACADEMIC NODES', timeline_desc: 'Validación secuencial de formación académica y certificaciones de ingeniería.' },
    posts: { module_title: 'ARCHIVO: CONTENT_LOGS.bin', read_more: 'LEER_ARTÍCULO' },
    contact: { connect: 'CONECTAR', handshake: 'INICIAR_HANDSHAKE_v1.5', access_node: 'Acceso Nodo', signal_desc: 'Inicializa secuencia de envío. Registro de integridad activado.', user_id: 'ID_USUARIO', signal_email: 'CORREO_SEÑAL', data_packet: 'CONTENIDO_PAQUETE_DATOS', establish_link: 'ESTABLECER_CONEXIÓN', success_title: 'Señal Sincronizada', success_desc: 'Integridad 100% // Paquete entregado' },
    footer: { architecture: 'Arquitectura de Core 2.9 // LISTO', rights: 'TODOS LOS DERECHOS RESERVADOS' }
  },
  en: {
    nav: { boot: 'Boot', systems: 'Systems', registry: 'Registry', signal: 'Signal' },
    hero: { system_loaded: 'ALBA_OS_CORE_v1.5_READY', bio_1: 'BUILDING THE FUTURE OF', bio_highlight: 'DIGITAL INFRASTRUCTURES', bio_2: 'WITH ELITE ENGINEERING.', btn_deploy: 'DEPLOY_SYSTEM', btn_dump: 'DUMP_REGISTRY' },
    skills: { title: 'DASHBOARD: TECH_STACK_MATRIX.bin', frontend: 'FRONTEND_LAYER', backend: 'CORE_LOGIC', tools: 'SUPPORT_TOOLS' },
    projects: { module_title: 'MODULE: CORE_SYSTEMS_v1.5' },
    experience: { module_title: 'REGISTRY: TIMELINE_CORE.log', data_core: 'DATA CORE', timeline_desc: 'Sequential traceability of engineering milestones and critical deployments.' },
    education: { module_title: 'REGISTRY: ACADEMIC_NODES.log', data_core: 'ACADEMIC NODES', timeline_desc: 'Sequential validation of academic training and engineering certifications.' },
    posts: { module_title: 'ARCHIVE: CONTENT_LOGS.bin', read_more: 'READ_ARTICLE' },
    contact: { connect: 'CONNECT', handshake: 'INITIATE_HANDSHAKE_v1.5', access_node: 'Access Node', signal_desc: 'Initializes send sequence. Integrity log activated.', user_id: 'USER_ID', signal_email: 'SIGNAL_EMAIL', data_packet: 'DATA_PACKET_CONTENT', establish_link: 'ESTABLISH_LINK', success_title: 'Signal Synchronized', success_desc: 'Integrity 100% // Packet delivered' },
    footer: { architecture: 'Architecture Core 2.9 // READY', rights: 'ALL RIGHTS RESERVED' }
  }
};

const CustomCursor = () => {
    const [pos, setPos] = useState({ x: 0, y: 0 });
    useEffect(() => {
        const handle = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
        window.addEventListener('mousemove', handle);
        return () => window.removeEventListener('mousemove', handle);
    }, []);
    return (
        <div className="fixed inset-0 pointer-events-none z-[400] hidden lg:block text-white/40">
            <div className="absolute w-12 h-12 border border-[#00FFF0]/30 rounded-full flex items-center justify-center -translate-x-1/2 -translate-y-1/2 transition-all duration-75" style={{ left: pos.x, top: pos.y }}>
                <div className="w-[1px] h-3 bg-[#00FFF0] absolute top-[-5px]" />
                <div className="w-[1px] h-3 bg-[#00FFF0] absolute bottom-[-5px]" />
                <div className="w-1.5 h-1.5 bg-[#D9FF00] rounded-full blur-[2px]" />
                <div className="absolute top-10 left-12 text-[7px] font-mono text-[#00FFF0] tracking-[0.4em] leading-relaxed uppercase opacity-40">
                   X:{pos.x} <br /> Y:{pos.y} <br /> SYS: HI_FIDELITY_OS
                </div>
            </div>
            <div className="fixed left-0 w-screen h-[0.5px] bg-[#00FFF0]/10" style={{ top: pos.y }} />
            <div className="fixed top-0 h-screen w-[0.5px] bg-[#00FFF0]/10" style={{ left: pos.x }} />
        </div>
    );
};

const SkillMatrix = ({ t }: { t: any }) => {
  const skills = [
    { cat: t.skills.frontend, items: ['React 18', 'TypeScript', 'Tailwind', 'Framer', 'Next.js'], color: '#00FFF0', icon: Monitor },
    { cat: t.skills.backend, items: ['Node.js', 'Express', 'Python', 'PostgreSQL', 'SQLite'], color: '#D9FF00', icon: Server },
    { cat: t.skills.tools, items: ['Git/GitHub', 'Docker', 'Vite', 'Clean Architecture', 'REST APIs'], color: '#FF007A', icon: Layers },
  ];

  return (
    <div className="grid lg:grid-cols-3 gap-12">
       {skills.map((s, i) => (
         <div key={i} className="os-window p-10 border-white/5 bg-white/[0.02]">
            <div className="flex items-center gap-4 mb-10 px-4">
               <s.icon size={20} style={{ color: s.color }} />
               <span className="font-mono text-[9px] font-black uppercase tracking-[0.4em]" style={{ color: s.color }}>{s.cat}</span>
            </div>
            <div className="space-y-4">
               {s.items.map((item, idx) => (
                 <div key={idx} className="relative group">
                    <div className="flex justify-between items-center mb-2 px-4">
                       <span className="font-mono text-[10px] text-white/60 tracking-widest">{item}</span>
                       <span className="font-mono text-[8px] opacity-20 group-hover:opacity-100 transition-opacity" style={{ color: s.color }}>ACCESS_OK</span>
                    </div>
                    <div className="h-[2px] w-full bg-white/5 rounded-full overflow-hidden">
                       <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: '100%' }}
                        transition={{ duration: 1.5, delay: idx * 0.1 }}
                        className="h-full" 
                        style={{ backgroundColor: s.color, boxShadow: `0 0 15px ${s.color}` }} 
                       />
                    </div>
                 </div>
               ))}
            </div>
         </div>
       ))}
    </div>
  );
}

const ContactModal = ({ isOpen, onClose, t }: { isOpen: boolean, onClose: () => void, t: any }) => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: 'Portfolio Signal', message: '' });
  const [errorDetails, setErrorDetails] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault();
     setLoading(true);
     setErrorDetails(null);
     try {
       await api.post('/contact', formData);
       setIsSuccess(true);
       setTimeout(() => { setIsSuccess(false); onClose(); }, 3000);
     } catch (err: any) {
       console.error('Contact signal failure:', err);
       const validationErrors = err.response?.data?.errors;
       if (validationErrors) {
         const details = Object.entries(validationErrors)
           .map(([field, msgs]) => `${field.toUpperCase()}: ${(msgs as string[]).join(', ')}`)
           .join(' // ');
         setErrorDetails(details);
       } else {
         setErrorDetails(err.response?.data?.message || 'Error en la transmisión. Reintente.');
       }
     } finally {
       setLoading(false);
     }
  };

  if (!isOpen) return null;
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[500] flex items-center justify-center p-6 bg-black/80 backdrop-blur-3xl">
      <motion.div initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} className="os-window w-full max-w-2xl border-[#FFB800]/40 overflow-hidden">
        <div className="os-header bg-[#FFB800]/10 border-[#FFB800]/20">
          <div className="flex gap-2 mr-6"><div className="os-dot bg-red-500" /><div className="os-dot bg-yellow-400" /><div className="os-dot bg-green-500" /></div>
          <span className="font-mono text-[9px] font-black uppercase tracking-[0.6em] text-[#FFB800]">SIGNAL_GATEWAY.bin</span>
          <button onClick={onClose} className="ml-auto p-3 opacity-40 hover:opacity-100 transition-opacity text-white"><X size={20} /></button>
        </div>
        
        <div className="p-16 relative">
          <AnimatePresence mode="wait">
            {!isSuccess ? (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="space-y-12">
                 <div className="space-y-4">
                    <h2 className="text-6xl font-black italic uppercase italic tracking-tighter text-white">{t.contact.access_node.split(' ')[0]} <br /> <span className="text-[#FFB800]">{t.contact.access_node.split(' ')[1]}.</span></h2>
                    <p className="font-mono text-[9px] text-slate-500 uppercase tracking-widest leading-relaxed border-l-[3px] border-[#FFB800]/30 pl-8">{t.contact.signal_desc}</p>
                 </div>

                 {errorDetails && (
                   <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="p-6 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-start gap-5">
                      <ShieldAlert className="text-red-500 shrink-0 mt-1" size={20} />
                      <div className="space-y-2">
                         <div className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500">Transmisión Fallida</div>
                         <p className="text-[9px] font-mono text-white/60 leading-relaxed uppercase tracking-widest">{errorDetails}</p>
                      </div>
                   </motion.div>
                 )}

                 <form className="space-y-8" onSubmit={handleSubmit}>
                    <div className="grid md:grid-cols-2 gap-8">
                       <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} type="text" placeholder={t.contact.user_id} className="w-full bg-white/5 border border-white/10 p-8 rounded-3xl font-mono text-[10px] uppercase tracking-widest focus:border-[#FFB800]/50 outline-none transition-all text-white" />
                       <input required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} type="email" placeholder={t.contact.signal_email} className="w-full bg-white/5 border border-white/10 p-8 rounded-3xl font-mono text-[10px] uppercase tracking-widest focus:border-[#FFB800]/50 outline-none transition-all text-white" />
                    </div>
                    <input required value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} type="text" placeholder="SUBJECT // ASUNTO" className="w-full bg-white/5 border border-white/10 p-8 rounded-3xl font-mono text-[10px] uppercase tracking-widest focus:border-[#FFB800]/50 outline-none transition-all text-white" />
                    
                    <div className="relative">
                       <textarea required value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} placeholder={t.contact.data_packet} rows={6} className="w-full bg-white/5 border border-white/10 p-8 rounded-3xl font-mono text-[10px] uppercase tracking-widest focus:border-[#FFB800]/50 outline-none transition-all resize-none text-white" />
                       <div className={`absolute bottom-6 right-8 font-mono text-[9px] font-black uppercase tracking-tighter ${formData.message.length < 10 ? 'text-red-500 animate-pulse' : 'text-slate-500'}`}>
                          Len: {formData.message.length} / MIN: 10
                       </div>
                    </div>
                    
                    <button disabled={loading} type="submit" className="btn-os w-full bg-[#FFB800] text-black font-black flex items-center justify-center gap-6 py-10 shadow-2xl hover:scale-[1.03] transition-all disabled:opacity-50">
                       {loading ? <Loader2 size={24} className="animate-spin text-black" /> : <Send size={24} />}
                       {t.contact.establish_link}
                    </button>
                 </form>
              </motion.div>
            ) : (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="py-24 text-center space-y-12">
                 <div className="w-32 h-32 rounded-full border-[3px] border-[#FFB800] mx-auto flex items-center justify-center text-[#FFB800] shadow-[0_0_50px_rgba(255,184,0,0.3)]">
                    <CheckCircle2 size={60} strokeWidth={3} />
                 </div>
                 <div className="space-y-4">
                    <h4 className="text-4xl font-black italic uppercase text-white tracking-widest">{t.contact.success_title.split(' ')[0]} <br /> {t.contact.success_title.split(' ')[1]}.</h4>
                    <p className="font-mono text-xs text-[#FFB800] uppercase tracking-[0.4em]">{t.contact.success_desc}</p>
                 </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};

const Navbar = ({ onOpenContact, lang, setLang, t }: { onOpenContact: () => void, lang: string, setLang: (l: string) => void, t: any }) => {
  const [scrolled, setScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState('hero');
  const navigate = useNavigate();
  const location = useLocation();

  const NAVBAR_LINKS = [
    { id: 'hero', label: t.nav.boot, icon: Zap },
    { id: 'projects', label: t.nav.systems, icon: Cpu },
    { id: 'experience', label: t.nav.registry, icon: Database },
    { id: 'contact', label: t.nav.signal, icon: Activity },
  ];

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

  useEffect(() => {
    const observerOptions = { root: null, rootMargin: '-250px 0px -250px 0px', threshold: 0 };
    const observerCallback = (entries: any) => { entries.forEach((entry: any) => { if (entry.isIntersecting) setActiveTab(entry.target.id); }); };
    const observer = new IntersectionObserver(observerCallback, observerOptions);
    NAVBAR_LINKS.forEach(link => { const el = document.getElementById(link.id); if (el) observer.observe(el); });
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => { observer.disconnect(); window.removeEventListener('scroll', handleScroll); };
  }, [lang]);

  const getThemeColor = () => {
    switch (activeTab) {
      case 'projects': return '#D9FF00';
      case 'experience': return '#FF007A';
      case 'contact': return '#FFB800';
      default: return '#00FFF0';
    }
  };

  const isHome = location.pathname === '/';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-1000 ${(scrolled || !isHome) ? 'py-4' : 'py-16'}`} aria-label="Navegación principal">
       <div className="container-custom flex items-center justify-center font-terminal">
          <motion.div 
            layout
            className={`relative p-3 flex items-center gap-2 border-[1.5px] border-white/10 backdrop-blur-3xl transition-all duration-1000 ${scrolled ? 'rounded-full px-10 shadow-2xl bg-black/60 shadow-black' : 'rounded-[3rem] px-16 bg-white/5 shadow-2xl shadow-black/60'}`}
            style={{ boxShadow: `0 0 80px -20px ${getThemeColor()}30` }}
          >
             <button onClick={() => scrollToSection('hero')} className="flex items-center gap-5 pr-8 border-r border-white/10 group">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }} className="w-12 h-12 border border-current rounded-2xl flex items-center justify-center shadow-xl" style={{ color: getThemeColor() }}>
                   <Zap size={24} className="fill-current" />
                </motion.div>
                {!scrolled && <span className="font-mono text-[10px] font-black uppercase tracking-[0.6em] hidden sm:block text-white">ALBA<span style={{ color: getThemeColor() }}>.SYS</span></span>}
             </button>
             
             <div className="flex items-center gap-2">
                {NAVBAR_LINKS.map((link) => (
                   <button 
                    key={link.id} 
                    onClick={() => scrollToSection(link.id)}
                    className="relative px-6 py-3.5 rounded-2xl flex items-center gap-4 text-[9px] font-mono uppercase tracking-[0.4em] transition-all duration-700 group overflow-hidden"
                    style={{ color: activeTab === link.id ? 'white' : 'rgba(255,255,255,0.2)' }}
                   >
                      <link.icon size={18} className={`transition-all duration-500 ${activeTab === link.id ? 'scale-110' : 'opacity-20'}`} />
                      <span className="hidden lg:block">{link.label}</span>
                      {activeTab === link.id && <motion.div layoutId="nav-bg" className="absolute inset-0 -z-10 rounded-2xl bg-white/[0.04] shadow-2xl" />}
                   </button>
                ))}
             </div>

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

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <div className="h-screen flex items-center justify-center bg-[#010309] text-[#00FFF0] font-mono text-[10px] tracking-[0.6em] font-black text-white">SYSTEM_ACCESS_KEY_SCAN...</div>;
  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;
  return <>{children}</>;
};

export const App = () => {
  const [data, setData] = useState<{projects: Project[]; exp: any[]; edu: any[]; posts: any[]; profile: any;}>({ projects: [], exp: [], edu: [], posts: [], profile: null });
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [lang, setLang] = useState('es');
  const t = translations[lang];

  const location = useLocation();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      document.body.style.setProperty('--mouse-x', `${e.clientX}px`);
      document.body.style.setProperty('--mouse-y', `${e.clientY}px`);
    };
    window.addEventListener('mousemove', handleMove);
    const fetchData = async () => {
      try {
        const [proj, prof, exp, edu, posts] = await Promise.all([
          api.get('/projects'), api.get('/profile').catch(() => ({ data: { data: null } })), api.get('/experience'), api.get('/education'), api.get('/posts')
        ]);
        setData({ 
          projects: (proj.data.data || []).filter((p: any) => p.status === 'PUBLISHED'), 
          profile: prof.data.data, 
          exp: exp.data.data || [], 
          edu: edu.data.data || [],
          posts: (posts.data.data || []).filter((p: any) => p.published)
        });
      } catch (err) { console.error(err); }
    };
    fetchData();
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  return (
    <AuthProvider>
      <div className="bg-[#010309] min-h-screen selection:bg-[#D9FF00] selection:text-black bg-data-feed">
        <CustomCursor />
        <div className="scan-line" aria-hidden="true" />
        
        <AnimatePresence mode="wait">
          <motion.div key={location.pathname} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1 }}>
            {!location.pathname.startsWith('/admin') && (
              <Navbar onOpenContact={() => setIsContactOpen(true)} lang={lang} setLang={setLang} t={t} />
            )}
            <main id="main-content">
              <Routes>
                <Route path="/" element={<Home data={data} scaleX={scaleX} onOpenContact={() => setIsContactOpen(true)} t={t} />} />
                <Route path="/blog/:slug" element={<BlogPostDetail />} />
                <Route path="/admin/login" element={<Login />} />
                <Route path="/admin" element={<AuthGuard><AdminLayout /></AuthGuard>}>
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="projects" element={<ProjectsManager />} />
                  <Route path="experience" element={<CvManager />} />
                  <Route path="posts" element={<BlogPostsManager />} />
                  <Route path="messages" element={<MessagesManager />} />
                  <Route path="settings" element={<ProfileManager />} />
                </Route>
              </Routes>
            </main>
          </motion.div>
        </AnimatePresence>

        <AnimatePresence>
          {isContactOpen && <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} t={t} />}
        </AnimatePresence>
      </div>
    </AuthProvider>
  );
};

const Home = ({ data, scaleX, onOpenContact, t }: { data: any, scaleX: any, onOpenContact: () => void, t: any }) => {
  return (
    <div className="pb-40 relative lg:px-20">
      <motion.div className="fixed top-0 left-0 right-0 h-[4px] z-[101] origin-left bg-[#00FFF0]" style={{ scaleX }} />
      <header id="hero" className="mb-20"><EnhancedHero profile={data.profile} t={t} /></header>
      
      {/* SECCIÓN SKILL MATRIX (SÚPER NIVEL EMPRESAL) */}
      <section id="skills" className="py-20 px-6 lg:px-0">
         <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="os-window max-w-full overflow-hidden border-white/5">
            <header className="os-header bg-white/[0.03] border-white/10">
               <div className="flex gap-2 mr-6"><div className="os-dot bg-white/20" /><div className="os-dot bg-white/10" /><div className="os-dot bg-white/5" /></div>
               <span className="font-mono text-[9px] font-black uppercase tracking-[0.5em] text-white flex items-center gap-3"><Activity size={14} /> {t.skills.title}</span>
            </header>
            <div className="p-10 lg:p-24">
               <SkillMatrix t={t} />
            </div>
         </motion.div>
      </section>

      <section id="projects" className="py-20 px-6 lg:px-0">
         <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="os-window max-w-full overflow-hidden border-[#D9FF00]/10">
            <header className="os-header bg-[#D9FF00]/10 border-[#D9FF00]/20">
               <div className="flex gap-2 mr-6"><div className="os-dot bg-red-500/50" /><div className="os-dot bg-yellow-500/50" /><div className="os-dot bg-green-500/50" /></div>
               <span className="font-mono text-[9px] font-black uppercase tracking-[0.5em] text-[#D9FF00] flex items-center gap-3"><Cpu size={14} /> {t.projects.module_title}</span>
            </header>
            <div className="p-10 lg:p-24">
               <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
                  {data.projects.map((p: any, idx: number) => <article key={p.id}><ProjectCard project={p} index={idx} /></article>)}
               </div>
            </div>
         </motion.div>
      </section>

      <section id="experience" className="py-20 px-6 lg:px-0">
         <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="os-window max-w-full overflow-hidden border-[#FF007A]/10">
            <header className="os-header bg-[#FF007A]/10 border-[#FF007A]/20">
               <div className="flex gap-2 mr-6"><div className="os-dot bg-white/20" /><div className="os-dot bg-white/10" /><div className="os-dot bg-white/5" /></div>
               <span className="font-mono text-[9px] font-black uppercase tracking-[0.5em] text-[#FF007A] flex items-center gap-3"><Database size={14} /> {t.experience.module_title}</span>
            </header>
            <div className="p-10 lg:p-32 grid lg:grid-cols-5 gap-20 lg:gap-32">
              <aside className="lg:col-span-2 space-y-8">
                 <h3 className="text-[10rem] font-black italic uppercase leading-none tracking-tighter opacity-[0.05] select-none text-white">{t.experience.data_core.split(' ')[0]} <br /> {t.experience.data_core.split(' ')[1]}.</h3>
                 <p className="font-mono text-[10px] text-slate-500 uppercase tracking-[0.5em] border-l-[3px] border-[#FF007A]/40 pl-10 max-w-sm leading-relaxed">{t.experience.timeline_desc}</p>
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

      <section id="education" className="py-20 px-6 lg:px-0">
         <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="os-window max-w-full overflow-hidden border-purple-500/10">
            <header className="os-header bg-purple-500/10 border-purple-500/20">
               <div className="flex gap-2 mr-6"><div className="os-dot bg-white/20" /><div className="os-dot bg-white/10" /><div className="os-dot bg-white/5" /></div>
               <span className="font-mono text-[9px] font-black uppercase tracking-[0.5em] text-purple-400 flex items-center gap-3"><GraduationCap size={14} /> {t.education.module_title}</span>
            </header>
            <div className="p-10 lg:p-32 grid lg:grid-cols-5 gap-20 lg:gap-32">
              <aside className="lg:col-span-2 space-y-8">
                 <h3 className="text-[10rem] font-black italic uppercase leading-none tracking-tighter opacity-[0.05] select-none text-white">{t.education.data_core.split(' ')[0]} <br /> {t.education.data_core.split(' ')[1]}.</h3>
                 <p className="font-mono text-[10px] text-slate-500 uppercase tracking-[0.5em] border-l-[3px] border-purple-500/40 pl-10 max-w-sm leading-relaxed">{t.education.timeline_desc}</p>
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

      {/* SECCIÓN BLOG / ARTÍCULOS */}
      <section id="posts" className="py-20 px-6 lg:px-0">
         <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="os-window max-w-full overflow-hidden border-indigo-500/10">
            <header className="os-header bg-indigo-500/10 border-indigo-500/20">
               <div className="flex gap-2 mr-6"><div className="os-dot bg-indigo-500/30" /><div className="os-dot bg-indigo-500/20" /><div className="os-dot bg-indigo-500/10" /></div>
               <span className="font-mono text-[9px] font-black uppercase tracking-[0.5em] text-indigo-400 flex items-center gap-3"><Newspaper size={14} /> {t.posts.module_title}</span>
            </header>
            <div className="p-10 lg:p-24">
               <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
                  {data.posts.map((post: any) => (
                    <article key={post.id} className="group relative">
                       <div className="glass-card p-12 lg:p-16 border-white/5 hover:border-indigo-500/30 transition-all duration-700 bg-white/[0.01] hover:bg-white/[0.03] flex flex-col h-full relative overflow-hidden">
                          {/* Card Background Pattern */}
                          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl rounded-full group-hover:bg-indigo-500/10 transition-colors" />
                          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500/5 blur-3xl rounded-full" />
                          
                          <div className="flex items-center justify-between mb-10 relative z-10">
                             <div className="flex gap-3">
                                {post.tags?.slice(0, 2).map((tag: any, i: number) => (
                                   <span key={i} className="text-[9px] font-black font-mono px-4 py-1.5 bg-indigo-500/10 rounded-xl border border-indigo-500/20 text-indigo-400 uppercase tracking-[0.2em]">#{tag.name}</span>
                                ))}
                             </div>
                             <time className="text-[9px] font-black font-mono text-slate-600 uppercase tracking-[0.3em] flex items-center gap-2">
                                <Clock size={12} /> {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'LOG_00'}
                             </time>
                          </div>

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

      <section id="contact" className="py-40 px-6 lg:px-0">
         <motion.div whileHover={{ scale: 1.01 }} className="os-window p-20 lg:p-48 text-center border-[#FFB800]/20 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-[#FFB800]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            <Brain size={80} className="mx-auto text-[#FFB800] mb-12 animate-pulse opacity-40" />
            <h2 className="text-[10rem] font-black italic uppercase mb-16 tracking-tighter leading-none opacity-[0.03] text-white">{t.contact.connect}.</h2>
            <button onClick={onOpenContact} className="btn-os bg-[#FFB800] text-black shadow-4xl px-24 py-10 text-xs">{t.contact.handshake}</button>
         </motion.div>
      </section>
      
      <Footer data={data} t={t} />
    </div>
  );
};

const Footer = ({ data, t }: { data: any, t: any }) => {
  const profile = data.profile || {};
  return (
    <footer className="py-24 px-6 lg:px-20 border-t border-white/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-12 text-center z-10 relative">
        <div className="w-16 h-16 rounded-[2rem] bg-white flex items-center justify-center text-black shadow-2xl relative group overflow-hidden transition-all hover:scale-110">
           <Zap size={28} className="fill-current group-hover:animate-pulse" />
        </div>
        <div className="space-y-4">
           <h4 className="text-3xl font-mono font-black tracking-[0.4em] uppercase italic text-white/40">{profile.name?.toUpperCase().replace(/ /g, '_') || 'ALBA_GARCIA_LOPEZ'}</h4>
           <div className="text-[#00FFF0] text-[10px] font-mono uppercase tracking-[0.6em] opacity-50">{profile.title || t.footer.architecture}</div>
           
           <div className="flex flex-wrap items-center justify-center gap-8 pt-8">
              {profile.email && (
                 <a href={`mailto:${profile.email}`} className="text-[9px] font-mono text-slate-500 hover:text-white transition-colors uppercase tracking-widest flex items-center gap-2">
                    <Database size={12} /> {profile.email}
                 </a>
              )}
              {profile.githubUrl && (
                 <a href={profile.githubUrl} target="_blank" rel="noreferrer" className="text-[9px] font-mono text-slate-500 hover:text-white transition-colors uppercase tracking-widest flex items-center gap-2">
                    <Github size={12} /> GITHUB_REPO
                 </a>
              )}
              {profile.linkedinUrl && (
                 <a href={profile.linkedinUrl} target="_blank" rel="noreferrer" className="text-[9px] font-mono text-slate-500 hover:text-white transition-colors uppercase tracking-widest flex items-center gap-2">
                    <Cpu size={12} /> LINKEDIN_NODE
                 </a>
              )}
           </div>

           <div className="flex items-center justify-center gap-4 pt-10 border-t border-white/5">
              <ShieldAlert size={14} className="text-[#FF007A] opacity-40" />
              <div className="text-[9px] font-mono text-white/30 tracking-[0.4em] uppercase font-black">
                 © 2026 {profile.name || 'ALBA GARCÍA LÓPEZ'} // {t.footer.rights}
              </div>
           </div>
        </div>
      </div>
    </footer>
  );
};

export default App;
