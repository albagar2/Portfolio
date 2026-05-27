import React, { useState, useEffect } from 'react';

/**
 * @fileoverview CustomCursor.tsx
 * @description COMPONENTE: Cursor Personalizado.
 * Renderiza un cursor estilizado siguiendo el mouse con coordenadas X,Y en tiempo real.
 */
export const CustomCursor = () => {
    const [pos, setPos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handle = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
        window.addEventListener('mousemove', handle);
        return () => window.removeEventListener('mousemove', handle);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-[400] hidden lg:block text-foreground/40">
            {/* Elemento central del cursor */}
            <div 
                className="absolute w-12 h-12 border border-foreground/20 rounded-full flex items-center justify-center -translate-x-1/2 -translate-y-1/2 transition-all duration-75" 
                style={{ left: pos.x, top: pos.y, borderColor: 'var(--color-aqua)' }}
            >
                <div className="w-[1px] h-3 absolute top-[-5px]" style={{ backgroundColor: 'var(--color-aqua)' }} />
                <div className="w-[1px] h-3 absolute bottom-[-5px]" style={{ backgroundColor: 'var(--color-aqua)' }} />
                <div className="w-1.5 h-1.5 rounded-full blur-[2px]" style={{ backgroundColor: 'var(--color-lime)' }} />
                
                {/* Visualización de Coordenadas */}
                <div className="absolute top-10 left-12 text-[7px] font-mono tracking-[0.4em] leading-relaxed uppercase opacity-40" style={{ color: 'var(--color-aqua)' }}>
                   X:{pos.x} <br /> Y:{pos.y} <br /> SYS: HI_FIDELITY_OS
                </div>
            </div>

            {/* Líneas de Escaneo (Ejes) */}
            <div className="fixed left-0 w-screen h-[0.5px] opacity-10" style={{ top: pos.y, backgroundColor: 'var(--color-aqua)' }} />
            <div className="fixed top-0 h-screen w-[0.5px] opacity-10" style={{ left: pos.x, backgroundColor: 'var(--color-aqua)' }} />
        </div>
    );
};
