import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, ArrowRight, Loader2, ShieldCheck, Sparkles } from 'lucide-react';
import { api } from '../../services/api';

export const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data } = await api.post('/auth/register', { name, email, password });
      if (data.success) {
        setSuccess(true);
        setTimeout(() => navigate('/admin/login'), 2000);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al registrar usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="glass-card p-10 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-blue-600" />
          
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-foreground/[0.05] rounded-full flex items-center justify-center mx-auto mb-6 border border-border group-hover:scale-110 transition-transform">
               <ShieldCheck size={32} className="text-blue-400" />
            </div>
            <h1 className="text-3xl font-black mb-2 tracking-tight">Create Account</h1>
            <p className="text-foreground/85 text-sm font-medium">Únete a la plataforma de gestión de portfolios.</p>
          </div>

          {success ? (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-10 space-y-6">
               <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto border border-green-500/30">
                  <Sparkles className="text-green-400" size={32} />
               </div>
               <h3 className="text-xl font-bold text-green-400">¡Registro Exitoso!</h3>
               <p className="text-foreground/85 text-sm">Redirigiendo al login...</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-foreground/85 block ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/85" size={18} />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-foreground/[0.05] border border-border rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-blue-500/50 transition-all font-medium"
                    placeholder="Tu Nombre"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-foreground/85 block ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/85" size={18} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-foreground/[0.05] border border-border rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-blue-500/50 transition-all font-medium"
                    placeholder="name@example.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-foreground/85 block ml-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/85" size={18} />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-foreground/[0.05] border border-border rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-blue-500/50 transition-all font-medium"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-bold text-center">
                  {error}
                </div>
              )}

              <button
                disabled={loading}
                className="w-full bg-foreground text-slate-950 py-4 rounded-2xl font-black flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50 shadow-xl"
              >
                {loading ? <Loader2 className="animate-spin text-slate-900" /> : <>Registrarme <ArrowRight size={18} /></>}
              </button>

              <div className="text-center pt-4">
                 <Link to="/admin/login" className="text-xs font-bold text-foreground/85 hover:text-blue-400 transition-colors">
                    ¿Ya tienes cuenta? Inicia sesión aquí
                 </Link>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};
