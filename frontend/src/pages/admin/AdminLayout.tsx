import React, { useState, useEffect } from 'react';
import { Navigate, Link, useLocation, Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, FolderKanban, MessageSquare, Newspaper,
  Settings, LogOut, ChevronRight, User, Sparkles, Briefcase,
  Database
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

const SIDEBAR_LINKS = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/projects', label: 'Proyectos', icon: FolderKanban },
  { to: '/admin/demos', label: 'Portal Demos', icon: Sparkles },
  { to: '/admin/experience', label: 'Trayectoria', icon: Briefcase },
  { to: '/admin/posts', label: 'Artículos', icon: Newspaper },
  { to: '/admin/messages', label: 'Mensajes', icon: MessageSquare },
  { to: '/admin/database', label: 'Base de Datos', icon: Database, adminOnly: true },
  { to: '/admin/settings', label: 'Perfil Boss', icon: User },
];

export const AdminLayout = () => {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      const fetchUnread = async () => {
        try {
          const res = await api.get('/contact/unread-count');
          setUnreadCount(res.data.data.unreadCount || 0);
        } catch (err) { console.error('Error fetching unread:', err); }
      };
      fetchUnread();
      const interval = setInterval(fetchUnread, 30000); // Poll every 30s
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading) return <div className="h-screen flex items-center justify-center"><Sparkles size={48} className="animate-pulse text-blue-400" /></div>;
  
  const hasAccess = user?.role === 'ADMIN' || user?.role === 'GUEST';
  if (!isAuthenticated || !hasAccess) return <Navigate to="/admin/login" replace />;

  return (
    <div className="dark flex min-h-screen bg-slate-950 text-slate-100 transition-colors duration-500">
      {/* Sidebar */}
      <aside className="w-60 lg:w-72 border-r border-border bg-foreground/[0.02] backdrop-blur-xl p-2 lg:p-8 flex flex-col fixed inset-y-0 left-0 h-[100dvh] z-50">
        <Link to="/" className="flex items-center gap-3 mb-2 lg:mb-12 pl-2">
           <div className="w-6 h-6 lg:w-10 lg:h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-foreground shrink-0">
              <Sparkles size={14} className="lg:w-6 lg:h-6" />
           </div>
           <span className="font-black text-base lg:text-2xl tracking-tight">Admin.</span>
        </Link>

        <nav className="flex flex-col gap-0 lg:gap-2 flex-grow justify-center">
          {SIDEBAR_LINKS.map((link) => {
            if (link.adminOnly && user?.role !== 'ADMIN') return null;
            const isActive = location.pathname === link.to;
              return (
                <Link 
                  key={link.to} 
                  to={link.to}
                  className={`flex items-center gap-2 lg:gap-4 px-3 py-1.5 lg:px-6 lg:py-4 rounded-lg lg:rounded-2xl font-bold text-[11px] lg:text-base transition-all relative shrink-0 ${
                    isActive ? 'bg-primary/10 text-primary border border-primary/20 shadow-sm shadow-blue-500/10' : 'text-foreground/85 hover:text-foreground hover:bg-foreground/[0.05]'
                  }`}
                >
                  <link.icon size={14} className="lg:w-5 lg:h-5 shrink-0" />
                  <span className="truncate">{link.label}</span>
                  {link.to === '/admin/messages' && unreadCount > 0 && (
                    <span className="absolute top-1 lg:top-4 left-6 lg:left-9 w-3 h-3 lg:w-4 lg:h-4 bg-red-500 text-[7px] lg:text-[10px] text-foreground rounded-full flex items-center justify-center border border-slate-900 shadow-sm animate-bounce">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                  {isActive && (
                    <motion.div 
                      layoutId="admin-active-nav"
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-1 h-1 lg:w-1.5 lg:h-1.5 bg-primary rounded-full"
                    />
                  )}
                </Link>
              );
          })}
        </nav>

        <div className="pt-2 lg:pt-8 border-t border-border flex flex-col gap-1 lg:gap-4 shrink-0 mt-auto">
           <div className="flex items-center gap-2 lg:gap-4 px-2 lg:px-4 mb-0 lg:mb-1">
              <div className="w-6 h-6 lg:w-10 lg:h-10 bg-foreground/[0.05] rounded-full flex items-center justify-center border border-border shadow-md overflow-hidden shrink-0">
                 <User size={12} className="lg:w-5 lg:h-5 text-foreground/80" />
              </div>
              <div className="flex flex-col overflow-hidden">
                 <span className="text-[11px] lg:text-sm font-bold truncate">{user?.name}</span>
                 <span className="text-[8px] lg:text-xs text-foreground/85 font-bold uppercase tracking-widest leading-none">{user?.role}</span>
              </div>
           </div>

           <button 
             onClick={logout}
             className="flex items-center gap-2 lg:gap-4 px-3 py-1.5 lg:px-6 lg:py-4 rounded-lg lg:rounded-2xl font-bold text-[11px] lg:text-base text-red-400/70 hover:text-red-400 hover:bg-red-500/5 transition-all w-full shrink-0"
           >
              <LogOut size={14} className="lg:w-5 lg:h-5 shrink-0" />
              <span className="truncate">Cerrar Sesión</span>
           </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow ml-64 lg:ml-72 p-6 lg:p-12 overflow-y-auto">
         <Outlet />
      </main>
    </div>
  );
};
