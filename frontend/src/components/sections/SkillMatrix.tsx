import React from 'react';
import { motion } from 'framer-motion';
import { Monitor, Server, Layers } from 'lucide-react';

interface SkillMatrixProps {
  t: any;
}

/**
 * COMPONENTE: Skill Matrix
 * Dashboard visual que muestra el Stack Tecnológico dividido en capas (Frontend, Backend, Tools).
 */
export const SkillMatrix = ({ t }: SkillMatrixProps) => {
  // Configuración de las categorías de habilidades y sus iconos
  const skills = [
    { cat: t.skills.frontend, items: [{n: 'React 18', p: 95}, {n: 'TypeScript', p: 90}, {n: 'Tailwind', p: 98}, {n: 'Framer', p: 85}, {n: 'Next.js', p: 80}], color: 'var(--color-aqua)', icon: Monitor },
    { cat: t.skills.backend, items: [{n: 'Node.js', p: 88}, {n: 'Express', p: 92}, {n: 'Python', p: 75}, {n: 'PostgreSQL', p: 85}, {n: 'SQLite', p: 90}], color: 'var(--color-lime)', icon: Server },
    { cat: t.skills.tools, items: [{n: 'Git/GitHub', p: 95}, {n: 'Docker', p: 70}, {n: 'Vite', p: 92}, {n: 'Clean Architecture', p: 80}, {n: 'REST APIs', p: 98}], color: 'var(--color-rose)', icon: Layers },
  ];

  return (
    <div className="grid lg:grid-cols-3 gap-12">
       {skills.map((s, i) => (
         <div key={i} className="os-window p-10 hover:bg-foreground/[0.02] transition-all">
            {/* Cabecera de Categoría */}
            <div className="flex items-center gap-4 mb-10 px-4">
               <s.icon size={20} style={{ color: s.color }} />
               <span className="font-mono text-[9px] font-black uppercase tracking-[0.4em]" style={{ color: s.color }}>
                  {s.cat}
               </span>
            </div>

            {/* Listado de Tecnologías con Barras de Progreso Animadas */}
            <div className="space-y-6">
               {s.items.map((item, idx) => (
                 <div key={idx} className="relative group">
                    <div className="flex justify-between items-center mb-2 px-4">
                       <span className="font-mono text-[10px] text-foreground/85 tracking-widest">{item.n}</span>
                       <span className="font-mono text-[8px] font-black" style={{ color: s.color }}>
                          {item.p}%
                       </span>
                    </div>

                    {/* Barra de Sistema */}
                    <div className="h-[3px] w-full bg-foreground/5 rounded-full overflow-hidden">
                       <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: `${item.p}%` }}
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
