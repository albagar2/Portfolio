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
    { cat: t.skills.frontend, items: ['React 18', 'TypeScript', 'Tailwind', 'Framer', 'Next.js'], color: '#00FFF0', icon: Monitor },
    { cat: t.skills.backend, items: ['Node.js', 'Express', 'Python', 'PostgreSQL', 'SQLite'], color: '#D9FF00', icon: Server },
    { cat: t.skills.tools, items: ['Git/GitHub', 'Docker', 'Vite', 'Clean Architecture', 'REST APIs'], color: '#FF007A', icon: Layers },
  ];

  return (
    <div className="grid lg:grid-cols-3 gap-12">
       {skills.map((s, i) => (
         <div key={i} className="os-window p-10 border-white/5 bg-white/[0.02]">
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
                       <span className="font-mono text-[10px] text-white/60 tracking-widest">{item}</span>
                       <span className="font-mono text-[8px] opacity-20 group-hover:opacity-100 transition-opacity" style={{ color: s.color }}>
                          ACCESS_OK
                       </span>
                    </div>

                    {/* Barra de Sistema */}
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
