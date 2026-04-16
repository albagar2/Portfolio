import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, ArrowRight, Loader2, Sparkles, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data } = await api.post('/auth/login', { email, password });
      if (data.success) {
        const { accessToken, refreshToken } = data.data.tokens;
        login(accessToken, refreshToken, data.data.user);
        navigate('/admin/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="glass-card p-10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-600" />
          
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-blue-500/20">
               <Sparkles size={32} className="text-blue-400" />
            </div>
            <h1 className="text-3xl font-black mb-2 tracking-tight">Admin Access</h1>
            <p className="text-foreground/85 text-sm font-medium">Inicia sesión para gestionar tu imperio.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-foreground/80 block ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/85 group-focus-within:text-blue-400 transition-colors" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-foreground/[0.05] border border-border rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-blue-500/50 focus:bg-foreground/[0.08] transition-all"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-foreground/80 block ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/85 group-focus-within:text-blue-400 transition-colors" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-foreground/[0.05] border border-border rounded-2xl py-4 pl-12 pr-12 outline-none focus:border-blue-500/50 focus:bg-foreground/[0.08] transition-all"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-blue-400 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-bold text-center">
                {error}
              </motion.div>
            )}

            <button
              disabled={loading}
              className="w-full bg-primary hover:bg-blue-600 text-primary-foreground py-4 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-xl shadow-blue-600/20 transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" /> : <>Entrar <ArrowRight size={18} /></>}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};
