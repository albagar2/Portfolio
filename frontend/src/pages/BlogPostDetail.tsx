import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Tag, Clock, Share2, Sparkles } from 'lucide-react';
import { api } from '../services/api';

export const BlogPostDetail = () => {
  const { slug } = useParams();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
       <div className="flex flex-col items-center gap-6">
          <Sparkles className="text-indigo-500 animate-pulse" size={48} />
          <div className="font-mono text-[10px] text-indigo-400 uppercase tracking-[0.5em] animate-pulse">Data Stream Initializing...</div>
       </div>
    </div>
  );

  if (!post) return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
       <h1 className="text-6xl font-black text-white/10 mb-8 uppercase italic tracking-tighter">404 // Post Not Found</h1>
       <Link to="/" className="px-10 py-5 bg-white text-black font-black rounded-2xl hover:scale-105 transition-all">VOLVER AL INICIO</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-indigo-500 selection:text-white pb-32 overflow-x-hidden">
       {/* Ambient Bacground Effects */}
       <div className="fixed inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
       <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[150px] rounded-full pointer-events-none" />
       <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 blur-[150px] rounded-full pointer-events-none" />
       
       {/* Hero Section */}
       <div className="relative h-[75vh] w-full overflow-hidden">
          {post.coverImage ? (
             <motion.img 
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.4 }}
                transition={{ duration: 1.5 }}
                src={post.coverImage} 
                className="w-full h-full object-cover grayscale"
             />
          ) : (
             <div className="w-full h-full bg-slate-900 flex items-center justify-center opacity-10">
                <div className="w-full h-full bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:32px_32px]" />
             </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          
          <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center z-10 pt-20 pb-24">
             <motion.div 
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8 max-w-5xl"
             >
                <div className="flex flex-wrap items-center justify-center gap-4 mb-4">
                   {post.tags?.map((tag: any, i: number) => (
                      <span key={i} className="px-6 py-2 bg-indigo-500/10 border border-indigo-500/30 rounded-full text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] backdrop-blur-md">
                         #{tag.name}
                      </span>
                   ))}
                </div>

                <h1 className="text-6xl md:text-[9rem] font-black italic uppercase tracking-tighter leading-[0.85] text-white drop-shadow-2xl">
                   {post.title}
                </h1>

                <div className="flex flex-wrap items-center justify-center gap-10 pt-10 font-mono text-[10px] text-slate-500 uppercase tracking-[0.4em] font-black">
                   <div className="flex items-center gap-3"><Calendar size={14} className="text-indigo-500" /> {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}</div>
                   <div className="flex items-center gap-3"><Clock size={14} className="text-indigo-500" /> 5 MIN_DATA_STREAM</div>
                   <div className="px-6 py-2 border border-white/10 rounded-xl opacity-40 hover:opacity-100 transition-opacity cursor-pointer flex items-center gap-3">
                      <Share2 size={12} /> SHARE_NODE
                   </div>
                </div>
             </motion.div>
          </div>
       </div>

       <div className="max-w-4xl mx-auto px-6 relative z-20 -mt-16">
          <Link to="/" className="inline-flex items-center gap-4 text-slate-500 hover:text-indigo-400 font-black text-[10px] uppercase tracking-[0.3em] mb-12 transition-all group p-4 glass-card border-white/5">
             <ArrowLeft size={16} className="group-hover:-translate-x-2 transition-transform" /> VOLVER AL ARCHIVO_CORE
          </Link>

          <div className="glass-card p-12 lg:p-24 border-white/10 bg-slate-950/50 backdrop-blur-2xl shadow-3xl">
             {post.excerpt && (
                <div className="relative mb-20">
                   <div className="absolute -left-10 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-500 to-transparent rounded-full" />
                   <blockquote className="italic text-2xl md:text-3xl text-slate-300 leading-relaxed font-light tracking-tight">
                      {post.excerpt}
                   </blockquote>
                </div>
             )}

             <div className="prose prose-invert prose-indigo max-w-none 
                prose-headings:font-black prose-headings:italic prose-headings:uppercase prose-headings:tracking-tighter prose-headings:text-white
                prose-p:text-slate-400 prose-p:leading-loose prose-p:text-lg prose-p:font-medium
                prose-strong:text-indigo-400 prose-strong:font-black
                prose-code:text-indigo-300 prose-code:bg-indigo-500/10 prose-code:px-2 prose-code:py-0.5 prose-code:rounded prose-code:font-mono
                prose-img:rounded-3xl prose-img:shadow-2xl prose-img:border prose-img:border-white/5
             ">
                <div 
                   className="content-body space-y-8"
                   dangerouslySetInnerHTML={{ 
                      __html: post.content
                         .replace(/^# (.*$)/gim, '<h1 className="text-4xl font-black italic uppercase tracking-tighter text-white mb-6">$1</h1>')
                         .replace(/^## (.*$)/gim, '<h2 className="text-3xl font-black italic uppercase tracking-tighter text-indigo-400 mt-12 mb-4">$1</h2>')
                         .replace(/^### (.*$)/gim, '<h3 className="text-xl font-bold uppercase tracking-widest text-white/80 mt-8 mb-3">$1</h3>')
                         .replace(/^\* (.*$)/gim, '<li className="ml-6 list-disc text-slate-400 mb-2">$1</li>')
                         .replace(/^\- (.*$)/gim, '<li className="ml-6 list-dash text-slate-400 mb-2">$1</li>')
                         .replace(/\*\*(.*)\*\*/gim, '<strong className="text-indigo-300 font-black">$1</strong>')
                         .replace(/\n/g, '<br />') 
                   }} 
                />
             </div>
          </div>

          <footer className="mt-20 pt-16 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-32 h-[1px] bg-gradient-to-r from-indigo-500 to-transparent" />
             <div className="flex items-center gap-8 group">
                <div className="relative">
                   <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-600 to-blue-600 p-[2px] transition-transform duration-700 group-hover:rotate-12">
                      <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center font-black italic text-2xl text-white">A</div>
                   </div>
                   <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-indigo-500 rounded-full border-4 border-slate-950 flex items-center justify-center">
                      <Sparkles size={10} className="text-white animate-pulse" />
                   </div>
                </div>
                <div className="space-y-1">
                   <div className="text-[10px] font-mono text-indigo-400 uppercase tracking-[0.4em] font-black group-hover:translate-x-1 transition-transform">CORE_ARCHITECT_LOG</div>
                   <div className="text-2xl font-black text-white uppercase italic tracking-tighter leading-none">ALBA BOSS</div>
                   <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest pt-1 flex items-center gap-3">
                      <div className="w-4 h-[1px] bg-slate-800" /> STATUS: DEPLOYING_KNOWLEDGE
                   </div>
                </div>
             </div>
             
             <Link to="/" className="btn-os bg-white text-black px-12 py-6 rounded-2xl font-black text-xs uppercase hover:scale-105 active:scale-95 shadow-2xl transition-all hover:bg-indigo-50 flex items-center gap-4">
                <ArrowLeft size={14} /> EXPLORAR OTROS LOGS
             </Link>
          </footer>
       </div>
    </div>
  );
};
