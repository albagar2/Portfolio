import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';

// --- SERVICIOS Y CONSTANTES ---
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { api } from './services/api';
import { translations } from './constants/translations';

// --- COMPONENTES DE DISEÑO (LAYOUT) ---
import { CustomCursor } from './components/layout/CustomCursor';
import { Navbar } from './components/layout/Navbar';
import { ContactModal } from './components/layout/ContactModal';

// --- PÁGINAS (PÚBLICAS) ---
import { Home } from './pages/Home';
import { BlogPostDetail } from './pages/BlogPostDetail';

// --- PÁGINAS (ADMINISTRACIÓN) ---
import { Login } from './pages/admin/Login';
import { AdminLayout } from './pages/admin/AdminLayout';
import { Dashboard } from './pages/admin/Dashboard';
import { ProfileManager } from './pages/admin/ProfileManager';
import { CvManager } from './pages/admin/CvManager';
import { ProjectsManager } from './pages/admin/ProjectsManager';
import { MessagesManager } from './pages/admin/MessagesManager';
import { BlogPostsManager } from './pages/admin/BlogPostsManager';

/**
 * SISTEMA PROTECTOR DE RUTAS (AuthGuard)
 * Verifica si el usuario tiene una sesión activa antes de permitir el acceso al panel admin.
 */
const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  // Mientras el sistema valida la llave de acceso
  if (isLoading) return (
    <div className="h-screen flex items-center justify-center bg-[#010309] font-mono text-[10px] tracking-[0.6em] font-black text-[var(--color-aqua)] animate-pulse">
        SYSTEM_ACCESS_KEY_SCANNING...
    </div>
  );
  
  // Si la firma digital no es válida, redirige al login
  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;
  
  return <>{children}</>;
};

/**
 * COMPONENTE PRINCIPAL (App Core)
 * Punto de entrada de la aplicación. Gestiona el estado global de datos, el idioma y el enrutamiento.
 */
export const App = () => {
  // Estado de Datos Maestros (Proyectos, Experiencia, Educación, Posts y Perfil)
  const [data, setData] = useState<any>({ projects: [], exp: [], edu: [], posts: [], profile: null });
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [lang, setLang] = useState('es');
  const [isDark, setIsDark] = useState(true);
  const t = translations[lang];

  const location = useLocation();
  const { scrollYProgress } = useScroll();
  // Resorte para la barra de progreso superior
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  // EFECTO: Gestión de Tema
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') setIsDark(false);
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.remove('light');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.add('light');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  // EFECTO: Scroll automático al inicio en cada cambio de ruta
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // EFECTO: Carga inicial de datos desde la API REST
  useEffect(() => {
    // Configuración de variables CSS para efectos de luz (mouse)
    const handleMove = (e: MouseEvent) => {
      document.body.style.setProperty('--mouse-x', `${e.clientX}px`);
      document.body.style.setProperty('--mouse-y', `${e.clientY}px`);
    };
    window.addEventListener('mousemove', handleMove);

    const fetchData = async () => {
      try {
        const [proj, prof, exp, edu, posts] = await Promise.all([
          api.get('/projects').catch(() => ({ data: { data: [] } })), 
          api.get('/profile').catch(() => ({ data: { data: null } })), 
          api.get('/experience').catch(() => ({ data: { data: [] } })), 
          api.get('/education').catch(() => ({ data: { data: [] } })), 
          api.get('/posts').catch(() => ({ data: { data: [] } }))
        ]);

        // Datasets de Respaldo por si la base de datos está vacía
        const fallbackProjects = [
          { id: '1', title: 'AgriOS Core', category: 'WEB', description: 'Sistema de gestión agrícola inteligente.', status: 'PUBLISHED', technologies: [{name: 'React'}, {name: 'Node.js'}] },
          { id: '2', title: 'CyberGuard Node', category: 'SECURITY', description: 'Dashboard de monitoreo de red.', status: 'PUBLISHED', technologies: [{name: 'TypeScript'}, {name: 'Express'}] }
        ];

        const fallbackExp = [
          { id: '1', position: 'Fullstack Developer', startDate: '2023-01-01', description: 'Desarrollo de infraestructuras escalables y APIs críticas.' },
          { id: '2', position: 'Frontend Engineer', startDate: '2022-01-01', description: 'Creación de interfaces reactivas de alto rendimiento.' }
        ];

        const fallbackEdu = [
          { id: '1', degree: 'Ingeniería de Software', institution: 'Universidad Tech', field: 'Desarrollo de Sistemas', startDate: '2019-01-01' },
          { id: '2', degree: 'Fullstack Bootcamp', institution: 'Cyber Academy', field: 'Web Development', startDate: '2022-01-01' }
        ];

        const fallbackPosts = [
          { id: '1', title: 'Arquitectura de Microservicios 2024', slug: 'microservicios-2024', excerpt: 'Exploración profunda de la escalabilidad y resiliencia en sistemas modernos.', publishedAt: new Date().toISOString(), published: true, tags: [{name: 'System'}] },
          { id: '2', title: 'Deep Dive: Vite + Framer Motion', slug: 'vite-framer-motion', excerpt: 'Cómo crear interfaces ultra-fluidas con el motor de renderizado de nueva generación.', publishedAt: new Date().toISOString(), published: true, tags: [{name: 'Frontend'}] }
        ];

        const backendProjects = (proj.data.data || []).filter((p: any) => p.status === 'PUBLISHED');
        const backendExp = exp.data.data || [];
        const backendEdu = edu.data.data || [];

        const backendPosts = (posts.data.data || []).filter((p: any) => p.published);

        setData({ 
          projects: backendProjects.length > 0 ? backendProjects : fallbackProjects, 
          profile: prof.data.data || { title: 'Junior Web Developer', bio: 'Desarrolladora enfocada en la excelencia técnica.' }, 
          exp: backendExp.length > 0 ? backendExp : fallbackExp, 
          edu: backendEdu.length > 0 ? backendEdu : fallbackEdu,
          posts: backendPosts.length > 0 ? backendPosts : fallbackPosts
        });
      } catch (err) { 
        console.error('CRITICAL_SYSTEM_ERROR (Data Fetch):', err); 
      }
    };

    fetchData();
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  return (
    <NotificationProvider>
      <AuthProvider>
        <div className="min-h-screen transition-colors duration-500 bg-data-feed overflow-x-hidden relative" style={{ backgroundColor: 'hsl(var(--background))' }}>
          {/* Capas de Interfaz Crítica */}
          <CustomCursor />
          <div className="scan-line" aria-hidden="true" />
          
          {/* Gestor de Transiciones de Página */}
          <AnimatePresence mode="wait">
            <motion.div 
              key={location.pathname} 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              transition={{ duration: 0.6 }}
            >
              {/* Solo muestra Navbar fuera del panel administrativo */}
              {!location.pathname.startsWith('/admin') && (
                <Navbar 
                  onOpenContact={() => setIsContactOpen(true)} 
                  lang={lang} 
                  setLang={setLang} 
                  isDark={isDark}
                  setIsDark={setIsDark}
                  t={t} 
                />
              )}

            <main id="main-content">
              <Routes>
                {/* RUTA: Inicio */}
                <Route path="/" element={<Home data={data} scaleX={scaleX} onOpenContact={() => setIsContactOpen(true)} t={t} lang={lang} />} />
                
                {/* RUTA: Detalle de Artículo */}
                <Route path="/blog/:slug" element={<BlogPostDetail lang={lang} />} />
                
                {/* RUTAS DE ADMINISTRACIÓN (Protegidas) */}
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

        {/* Capa de Comunicación (Modal) */}
        <AnimatePresence>
          {isContactOpen && (
            <ContactModal 
              isOpen={isContactOpen} 
              onClose={() => setIsContactOpen(false)} 
              t={t} 
            />
          )}
        </AnimatePresence>
      </div>
    </AuthProvider>
  </NotificationProvider>
);
};

export default App;
