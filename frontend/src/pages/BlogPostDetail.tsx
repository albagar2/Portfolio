import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, useScroll, useSpring } from 'framer-motion';
import { ArrowLeft, Calendar, Tag, Clock, Share2, Sparkles, Terminal, List, Code2, ChevronRight, Zap } from 'lucide-react';
import { api } from '../services/api';
import { useNotification } from '../context/NotificationContext';

/**
 * COMPONENTE: TypewriterTitle
 * Crea un efecto de tecleado mecánico para los títulos del blog.
 */
const TypewriterTitle = ({ text }: { text: string }) => {
  const [displayText, setDisplayText] = useState('');
  
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setDisplayText(text.substring(0, index));
      index++;
      if (index > text.length) clearInterval(interval);
    }, 50);
    return () => clearInterval(interval);
  }, [text]);

  return (
    <h1 className="text-5xl md:text-[8rem] font-black italic uppercase tracking-tighter leading-[0.85] text-foreground drop-shadow-2xl">
      {displayText}<span className="animate-pulse">_</span>
    </h1>
  );
};

/**
 * PÁGINA: BlogPostDetail
 * Detalles extendidos de artículos con sistema de logs, resaltado y navegación técnica.
 */
export const BlogPostDetail = ({ lang }: { lang: string }) => {
  const { slug } = useParams();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { showNotification } = useNotification();

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  // Helper para obtener el campo traducido o el original de respaldo
  const getT = (obj: any, field: string) => {
    if (lang === 'en') {
      const enField = `${field}_en`;
      return obj[enField] || obj[field];
    }
    return obj[field];
  };

  // EFECTO: Carga de datos
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await api.get(`/posts/slug/${slug}`);
        setPost(data.data);
      } catch (err) {
        console.error('Error fetching post:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
    window.scrollTo(0, 0);
  }, [slug]);

  const postTitle = useMemo(() => post ? getT(post, 'title') : '', [post, lang]);
  const postExcerpt = useMemo(() => post ? getT(post, 'excerpt') : '', [post, lang]);
  const postContent = useMemo(() => post ? getT(post, 'content') : '', [post, lang]);

  // LÓGICA: Procesamiento de Contenido (Headers y Code Blocks)
  const processedContent = useMemo(() => {
    if (!postContent) return { html: '', headings: [] };
    
    const headings: { id: string, text: string }[] = [];
    let html = postContent
      // Bloques de Código (```code```)
      .replace(/```([\s\S]*?)```/g, (_match: string, code: string) => {
        const highlighted = code
          .replace(/const|let|var|function|return|if|else|for|while|import|export|from|await|async/g, '<span class="text-indigo-400">$0</span>')
          .replace(/".*?"|'.*?'|`.*?`/g, '<span class="text-lime-300">$0</span>')
          .replace(/\/\/.*/g, '<span class="text-foreground/85 italic">$0</span>');
        return `<div class="os-window my-12 border-border bg-black/40 backdrop-blur-3xl overflow-hidden group">
                  <header class="os-header bg-foreground/[0.03] border-b border-border py-3 px-6 flex items-center justify-between">
                    <div class="flex gap-2"><div class="w-2 h-2 rounded-full bg-red-500/30"></div><div class="w-2 h-2 rounded-full bg-yellow-400/30"></div><div class="w-2 h-2 rounded-full bg-green-500/30"></div></div>
                    <span class="font-mono text-[8px] text-indigo-400 uppercase tracking-widest flex items-center gap-2"><div class="w-1.5 h-1.5 rounded-full bg-[var(--color-aqua)] animate-pulse"></div> SRC_CODE_BLOCK</span>
                  </header>
                  <pre class="p-8 font-mono text-sm leading-relaxed overflow-x-auto text-foreground/70"><code>${highlighted}</code></pre>
                </div>`;
      })
      // Títulos dinámicos con ID para TOC
      .replace(/^# (.*$)/gim, (_: string, text: string) => {
        const id = text.toLowerCase().trim().replace(/[^\w]/g, '-');
        headings.push({ id, text });
        return `<h1 id="${id}" class="text-4xl font-black italic uppercase tracking-tighter text-foreground mt-16 mb-8">${text}</h1>`;
      })
      .replace(/^## (.*$)/gim, (_: string, text: string) => {
        const id = text.toLowerCase().trim().replace(/[^\w]/g, '-');
        headings.push({ id, text });
        return `<h2 id="${id}" class="text-3xl font-black italic uppercase tracking-tighter text-indigo-400 mt-20 mb-6 border-l-[4px] border-indigo-500 pl-8">${text}</h2>`;
      })
      .replace(/^### (.*$)/gim, (_: string, text: string) => {
        const id = text.toLowerCase().trim().replace(/[^\w]/g, '-');
        headings.push({ id, text });
        return `<h3 id="${id}" class="text-xl font-bold uppercase tracking-widest text-foreground/80 mt-12 mb-4">${text}</h3>`;
      })
      // Formato básico
      .replace(/^\* (.*$)/gim, '<li class="ml-10 list-disc text-foreground/80 mb-4 font-medium leading-relaxed">$1</li>')
      .replace(/\*\*(.*)\*\*/gim, '<strong class="text-indigo-300 font-black">$1</strong>')
      .replace(/\n\n/g, '</p><p class="mb-8 leading-loose text-lg text-foreground/80 font-medium">')
      .replace(/\n/g, '<br />');

    return { html: `<p class="mb-8 leading-loose text-lg text-foreground/80 font-medium">${html}</p>`, headings };
  }, [postContent, lang]);

  // CÁLCULO: Tiempo de lectura (Sincronización)
  const syncTime = useMemo(() => {
    if (!postContent) return 0;
    const words = postContent.split(/\s+/).length;
    return Math.ceil(words / 200);
  }, [postContent]);

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    showNotification('TRANSMIT_OK: NODE_LINK_DUMPED_TO_CLIPBOARD', 'success');
  };

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center font-mono">
       <div className="flex flex-col items-center gap-6">
          <Terminal className="text-[var(--color-aqua)] animate-pulse" size={48} />
          <div className="text-[10px] text-[var(--color-aqua)] uppercase tracking-[0.5em] animate-pulse">INITIATING_DUMP_STREAM...</div>
       </div>
    </div>
  );

  if (!post) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center">
       <h1 className="text-6xl font-black text-foreground/10 mb-8 uppercase italic tracking-tighter">ERROR 404: ARCHIVE_NOT_FOUND</h1>
       <Link to="/" className="px-10 py-5 bg-foreground text-black font-black rounded-2xl">REBOOT_TO_HOME</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#010309] text-foreground selection:bg-[var(--color-aqua)] selection:text-black pb-32">
       {/* Barra de Progreso de Lectura Superior */}
       <motion.div 
         className="fixed top-0 left-0 right-0 h-[4px] bg-[var(--color-aqua)] z-[100] origin-left shadow-[0_0_15px_var(--color-aqua)]" 
         style={{ scaleX }} 
       />
       
       <div className="fixed inset-0 opacity-[0.02] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-0 " />
       
       {/* HERO DEL POST (Visual Impact) */}
       <header className="relative h-[85vh] w-full flex items-center justify-center pt-20 overflow-hidden border-b border-border bg-slate-950">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,1)_100%)] z-[5]" />
          <div className="absolute inset-0 bg-grid-white/[0.02] z-0" />
          
          <div className="max-w-6xl w-full px-12 relative z-10">
             <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
                <div className="flex items-center gap-4">
                   <div className="glass-badge border-[var(--color-aqua)]/30 text-[var(--color-aqua)] font-mono text-[9px] px-6 py-2">PROTOCOL_LOG_V2</div>
                   {post.tags?.[0] && <span className="text-foreground/30 font-mono text-[10px] uppercase tracking-[0.4em]">#{post.tags[0].name}</span>}
                </div>
                
                <TypewriterTitle text={postTitle} />

                <div className="flex flex-wrap items-center gap-10 font-mono text-[10px] text-foreground/85 uppercase tracking-[0.4em] font-black pt-10">
                   <div className="flex items-center gap-3"><Calendar size={14} className="text-foreground/20" /> {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}</div>
                   <div className="flex items-center gap-3"><Clock size={14} className="text-[var(--color-aqua)]" /> {lang === 'en' ? 'TIME_TO_SYNC' : 'TIEMPO_SINCR'} : {syncTime} MIN</div>
                   <button onClick={handleShare} className="group flex items-center gap-3 hover:text-foreground transition-colors border-b border-white/0 hover:border-border pb-1">
                      <Share2 size={14} /> {lang === 'en' ? 'SHARE_DATA_NODE' : 'COMPARTIR_NODO'}
                   </button>
                </div>
             </motion.div>
          </div>
       </header>

       {/* CONTENIDO + SIDEBAR (Layout Técnico) */}
       <main className="max-w-7xl mx-auto px-6 lg:px-12 grid lg:grid-cols-12 gap-20 pt-20 relative z-10">
          
          {/* SIDEBAR: Índice de Contenidos Interactivo */}
          <aside className="lg:col-span-3 hidden lg:block sticky top-40 h-fit space-y-12">
             <div className="space-y-6">
                <div className="flex items-center gap-4 text-[10px] font-mono font-black text-[var(--color-aqua)] uppercase tracking-[0.5em] mb-12 border-b border-border pb-4">
                   <List size={16} /> LOG_EXPLORER
                </div>
                <nav className="space-y-6 border-l border-border pl-8">
                   {processedContent.headings.map((h, i) => (
                      <a 
                        key={i} 
                        href={`#${h.id}`} 
                        className="group flex flex-col gap-1 text-[10px] font-mono uppercase tracking-[0.3em] text-foreground/85 hover:text-[var(--color-aqua)] transition-all"
                      >
                         <span className="text-[8px] opacity-30">HEADER_0{i+1}</span>
                         <span className="flex items-center gap-3"><ChevronRight size={10} className="group-hover:translate-x-1 transition-transform" /> {h.text}</span>
                      </a>
                   ))}
                </nav>
             </div>

             <div className="p-10 os-window bg-[var(--color-lime)]/5 border-[var(--color-lime)]/10 rounded-3xl">
                <Zap size={24} className="text-[var(--color-lime)] mb-6 animate-pulse" />
                <h4 className="text-[10px] font-black font-mono text-[var(--color-lime)] mb-4 uppercase tracking-[0.5em]">SYSTEM_ACTION</h4>
                <p className="text-[9px] font-mono text-foreground/80 uppercase leading-relaxed mb-10 tracking-tighter opacity-70 italic border-l border-[var(--color-lime)]/20 pl-4">{lang === 'en' ? 'LOOKING FOR ELITE ENGINEERING SOLUTIONS? ESTABLISH CONNECTION.' : '¿BUSCAS SOLUCIONES DE INGENIERÍA DE ÉLITE? ESTABLECE CONEXIÓN.'}</p>
                <Link to="/#contact" className="text-[10px] font-black text-foreground hover:text-[var(--color-lime)] uppercase tracking-[0.6em] flex items-center gap-6 transition-all group">
                   START_HANDSHAKE <ArrowLeft className="rotate-180 group-hover:translate-x-3 transition-transform" size={14} />
                </Link>
             </div>
          </aside>

          {/* CUERPO DEL ARTÍCULO (Lectura Clean) */}
          <article className="lg:col-span-9 max-w-4xl">
             <Link to="/" className="inline-flex items-center gap-6 text-foreground/85 hover:text-[var(--color-aqua)] font-black text-[10px] uppercase tracking-[0.5em] mb-24 transition-all group">
                <ArrowLeft size={16} className="group-hover:-translate-x-2 transition-transform" /> {lang === 'en' ? 'BACK_TO_DUMP_ARCHIVE' : 'VOLVER_AL_ARCHIVO'}
             </Link>

             <div className="glass-card p-12 lg:p-24 border-border bg-slate-950/40 backdrop-blur-3xl shadow-3xl rounded-[3rem]">
                {postExcerpt && (
                   <div className="relative mb-32">
                      <div className="absolute -left-12 top-0 bottom-0 w-[4px] bg-gradient-to-b from-[var(--color-aqua)] to-transparent rounded-full" />
                      <p className="text-3xl font-light text-slate-300 leading-relaxed italic opacity-90 pl-8 font-outfit">
                        {postExcerpt}
                      </p>
                      <div className="mt-8 text-[9px] font-black text-[var(--color-aqua)]/30 uppercase tracking-[0.8em] font-mono pr-8 text-right">ABSTRACT_LOG_O1</div>
                   </div>
                )}

                <div 
                   className="content-body"
                   dangerouslySetInnerHTML={{ __html: processedContent.html }} 
                />
             </div>

             {/* Footer con Estética de Transmisión */}
             <footer className="mt-40 border-t border-border pt-20 flex flex-col items-center text-center">
                <Code2 size={64} className="text-slate-900 mb-12 opacity-50" />
                <h3 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-foreground mb-8">END_OF_TRANSMISSION</h3>
                <p className="text-foreground/85 font-mono text-[10px] uppercase tracking-[0.6em] mb-20 italic">{lang === 'en' ? 'AUTHOR' : 'AUTOR'}: ALBA_BOSS // SECTOR: CORE_DUMP</p>
                
                <div className="flex flex-wrap justify-center gap-12">
                   <button 
                      onClick={handleShare} 
                      className="px-16 py-6 border-2 border-border rounded-2xl font-black text-[10px] uppercase tracking-[0.5em] hover:bg-foreground hover:text-black transition-all hover:scale-105"
                   >
                      RETRANSMIT_DATA
                   </button>
                   <Link 
                      to="/" 
                      className="px-16 py-6 bg-[var(--color-aqua)] text-black rounded-2xl font-black text-[10px] uppercase tracking-[0.5em] hover:shadow-[0_0_40px_rgba(0,255,240,0.5)] transition-all hover:scale-105"
                   >
                      NEXT_ARCHIVE
                   </Link>
                </div>
             </footer>
          </article>
       </main>
    </div>
  );
};

