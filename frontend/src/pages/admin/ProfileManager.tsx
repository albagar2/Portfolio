import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, Mail, Phone, MapPin, Globe, 
  Github, Linkedin, Twitter, Save, 
  Loader2, BadgeCheck, Sparkles, Image as ImageIcon
} from 'lucide-react';
import { api } from '../../services/api';

interface Profile {
  id: string;
  name: string;
  title: string;
  bio: string;
  email: string;
  phone?: string;
  location?: string;
  avatarUrl?: string;
  resumeUrl?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  websiteUrl?: string;
}

export const ProfileManager = () => {
  const [profile, setProfile] = useState<Partial<Profile>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formDataLocal = new FormData();
    formDataLocal.append('file', file);

    try {
      setUploading(true);
      const { data } = await api.post('/upload', formDataLocal, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setProfile({ ...profile, avatarUrl: data.data.url });
      setMessage({ type: 'success', text: 'Imagen subida correctamente' });
    } catch (err) {
      console.error('Error uploading:', err);
      setMessage({ type: 'error', text: 'Error al subir la imagen' });
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get('/profile');
        if (data.data) setProfile(data.data);
      } catch (err) {
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      if (profile.id) {
        await api.put(`/profile/${profile.id}`, profile);
      } else {
        const { data } = await api.post('/profile', profile);
        setProfile(data.data);
      }
      setMessage({ type: 'success', text: '¡Perfil actualizado con éxito!' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Error al actualizar el perfil.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="h-96 flex items-center justify-center"><Loader2 className="animate-spin text-blue-500" size={48} /></div>;

  return (
    <div className="py-10 space-y-12 max-w-5xl mx-auto">
      <header>
         <h1 className="text-4xl font-black mb-4 flex items-center gap-4">Identity Hub <Sparkles className="text-blue-500" /></h1>
         <p className="text-foreground/85 font-medium tracking-tight">Gestiona tu presencia digital y biografía profesional.</p>
      </header>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Sección 1: Info General */}
        <section className="glass-card p-10 space-y-8 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 opacity-50" />
          <h2 className="text-xl font-bold flex items-center gap-3">
             <User size={20} className="text-blue-400" /> Información General
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-foreground/85 ml-1">Nombre Completo</label>
              <input 
                value={profile.name || ''} 
                onChange={e => setProfile({...profile, name: e.target.value})}
                className="w-full bg-foreground/[0.05] border border-border rounded-xl p-4 outline-none focus:border-blue-500/50 transition-all font-bold"
                placeholder="Alba García López"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-foreground/85 ml-1">Título Profesional</label>
              <input 
                value={profile.title || ''} 
                onChange={e => setProfile({...profile, title: e.target.value})}
                className="w-full bg-foreground/[0.05] border border-border rounded-xl p-4 outline-none focus:border-blue-500/50 transition-all font-bold"
                placeholder="Full-Stack Developer"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-foreground/85 ml-1">Biografía Breve</label>
            <textarea 
              value={profile.bio || ''} 
              onChange={e => setProfile({...profile, bio: e.target.value})}
              className="w-full bg-foreground/[0.05] border border-border rounded-xl p-4 outline-none focus:border-blue-500/50 transition-all min-h-[120px]"
              placeholder="Cuéntale al mundo quién eres..."
            />
          </div>

          <div className="space-y-4 pt-4 border-t border-border mt-10">
            <label className="text-[10px] font-black uppercase tracking-widest text-foreground ml-1">Avatar / Imagen de Perfil</label>
            <div className="flex flex-col md:flex-row gap-8 items-center">
              {/* Preview Avatar */}
              <div className="w-32 h-32 rounded-full bg-foreground/[0.05] border-2 border-border overflow-hidden relative group">
                {profile.avatarUrl ? (
                  <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                ) : (
                  <User size={48} className="absolute inset-0 m-auto opacity-20" />
                )}
                {uploading && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <Loader2 className="animate-spin text-blue-400" />
                  </div>
                )}
              </div>

              <div className="flex-grow space-y-4 w-full">
                <div className="relative">
                  <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40" size={16} />
                  <input 
                    value={profile.avatarUrl || ''} 
                    onChange={e => setProfile({...profile, avatarUrl: e.target.value})}
                    className="w-full bg-foreground/[0.05] border border-border rounded-xl py-4 pl-12 pr-4 outline-none focus:border-blue-500/50 transition-all text-xs font-bold"
                    placeholder="URL de la imagen o selecciona un archivo..."
                  />
                </div>
                
                <label className="flex items-center justify-center gap-3 px-6 py-4 bg-foreground/[0.05] hover:bg-foreground/10 border border-border border-dashed rounded-xl cursor-pointer transition-all active:scale-95 text-[10px] font-black uppercase tracking-widest">
                   {uploading ? 'SUBIENDO...' : 'Subir foto (.png, .jpg)'}
                   <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} disabled={uploading} />
                </label>
              </div>
            </div>
          </div>
        </section>

        {/* Sección 2: Contacto & Ubicación */}
        <section className="glass-card p-10 space-y-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-purple-500 opacity-50" />
          <h2 className="text-xl font-bold flex items-center gap-3">
             <Mail size={20} className="text-purple-400" /> Contacto y Ubicación
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-foreground/85 ml-1">Email Público</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/85" size={16} />
                <input value={profile.email || ''} onChange={e => setProfile({...profile, email: e.target.value})} className="w-full bg-foreground/[0.05] border border-border rounded-xl py-4 pl-12 pr-4 outline-none focus:border-purple-500/50 text-sm font-medium" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-foreground/85 ml-1">Teléfono (Opcional)</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/85" size={16} />
                <input value={profile.phone || ''} onChange={e => setProfile({...profile, phone: e.target.value})} className="w-full bg-foreground/[0.05] border border-border rounded-xl py-4 pl-12 pr-4 outline-none focus:border-purple-500/50 text-sm font-medium" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-foreground/85 ml-1">Ubicación</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/85" size={16} />
                <input value={profile.location || ''} onChange={e => setProfile({...profile, location: e.target.value})} className="w-full bg-foreground/[0.05] border border-border rounded-xl py-4 pl-12 pr-4 outline-none focus:border-purple-500/50 text-sm font-medium" placeholder="Estepona, España" />
              </div>
            </div>
          </div>
        </section>

        {/* Sección 3: Social Hub */}
        <section className="glass-card p-10 space-y-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 opacity-50" />
          <h2 className="text-xl font-bold flex items-center gap-3">
             <Globe size={20} className="text-indigo-400" /> Social Hub
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-foreground/85 ml-1">GitHub URL</label>
              <div className="relative">
                <Github className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/85" size={16} />
                <input value={profile.githubUrl || ''} onChange={e => setProfile({...profile, githubUrl: e.target.value})} className="w-full bg-foreground/[0.05] border border-border rounded-xl py-4 pl-12 pr-4 outline-none focus:border-indigo-500/50 text-xs" placeholder="https://github.com/..." />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-foreground/85 ml-1">LinkedIn URL</label>
              <div className="relative">
                <Linkedin className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/85" size={16} />
                <input value={profile.linkedinUrl || ''} onChange={e => setProfile({...profile, linkedinUrl: e.target.value})} className="w-full bg-foreground/[0.05] border border-border rounded-xl py-4 pl-12 pr-4 outline-none focus:border-indigo-500/50 text-xs" placeholder="https://linkedin.com/in/..." />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-foreground/85 ml-1">Twitter URL</label>
              <div className="relative">
                <Twitter className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/85" size={16} />
                <input value={profile.twitterUrl || ''} onChange={e => setProfile({...profile, twitterUrl: e.target.value})} className="w-full bg-foreground/[0.05] border border-border rounded-xl py-4 pl-12 pr-4 outline-none focus:border-indigo-500/50 text-xs" placeholder="https://twitter.com/..." />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-foreground/85 ml-1">Personal Website</label>
              <div className="relative">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/85" size={16} />
                <input value={profile.websiteUrl || ''} onChange={e => setProfile({...profile, websiteUrl: e.target.value})} className="w-full bg-foreground/[0.05] border border-border rounded-xl py-4 pl-12 pr-4 outline-none focus:border-indigo-500/50 text-xs" placeholder="https://..." />
              </div>
            </div>
          </div>
        </section>

        {/* Notificación y Botón */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-6">
           {message && (
             <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className={`px-6 py-4 rounded-xl font-bold text-sm ${message.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                {message.type === 'success' ? <BadgeCheck className="inline mr-2" size={18} /> : null}
                {message.text}
             </motion.div>
           )}
           <button 
             disabled={saving}
             className="w-full md:w-auto px-12 py-5 bg-foreground text-slate-950 rounded-2xl font-black flex items-center justify-center gap-4 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 shadow-2xl shadow-white/10"
           >
              {saving ? <Loader2 className="animate-spin" /> : <Save size={20} />}
              GUARDAR CAMBIOS
           </button>
        </div>
      </form>
    </div>
  );
};
