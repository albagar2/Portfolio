import React, { useState, useEffect } from 'react';

/**
 * COMPONENTE: Cursor Personalizado
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
        <div className="fixed inset-0 pointer-events-none z-[400] hidden lg:block text-white/40">
            {/* Elemento central del cursor */}
            <div 
                className="absolute w-12 h-12 border border-[#00FFF0]/30 rounded-full flex items-center justify-center -translate-x-1/2 -translate-y-1/2 transition-all duration-75" 
                style={{ left: pos.x, top: pos.y }}
            >
                <div className="w-[1px] h-3 bg-[#00FFF0] absolute top-[-5px]" />
                <div className="w-[1px] h-3 bg-[#00FFF0] absolute bottom-[-5px]" />
                <div className="w-1.5 h-1.5 bg-[#D9FF00] rounded-full blur-[2px]" />
                
                {/* Visualización de Coordenadas */}
                <div className="absolute top-10 left-12 text-[7px] font-mono text-[#00FFF0] tracking-[0.4em] leading-relaxed uppercase opacity-40">
                   X:{pos.x} <br /> Y:{pos.y} <br /> SYS: HI_FIDELITY_OS
                </div>
            </div>

            {/* Líneas de Escaneo (Ejes) */}
            <div className="fixed left-0 w-screen h-[0.5px] bg-[#00FFF0]/10" style={{ top: pos.y }} />
            <div className="fixed top-0 h-screen w-[0.5px] bg-[#00FFF0]/10" style={{ left: pos.x }} />
        </div>
    );
};
