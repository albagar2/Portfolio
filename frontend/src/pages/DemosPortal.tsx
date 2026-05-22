import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { api } from '../services/api';

interface Demo {
  id: string;
  title: string;
  codeName: string;
  description: string;
  url: string;
  themeColor: string; // Tailwind class or hex
  btnText: string;
}

export const DemosPortal = () => {
  const [demos, setDemos] = useState<Demo[]>([]);
  const [statuses, setStatuses] = useState<Record<string, 'checking' | 'online' | 'offline'>>({});
  const [logs, setLogs] = useState<string[]>([
    '> system_init... OK',
    '> kernel_loaded... OK',
    '> scan_all_urls --verbose'
  ]);

  useEffect(() => {
    // Add specific body classes for this page
    document.documentElement.classList.add('dark');
    document.body.style.backgroundColor = '#02040a';
    document.body.style.backgroundImage = `
      radial-gradient(circle at 50% -20%, #1a1a2e 0%, transparent 80%),
      linear-gradient(rgba(0, 240, 255, 0.02) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0, 240, 255, 0.02) 1px, transparent 1px)
    `;
    document.body.style.backgroundSize = '100% 100%, 30px 30px, 30px 30px';
    document.body.style.color = '#c9d1d9';

    const fetchDemos = async () => {
      try {
        const { data } = await api.get('/demos');
        const loadedDemos = data.data || [];
        setDemos(loadedDemos);
        
        // Init statuses
        const initialStatuses: Record<string, 'checking'> = {};
        loadedDemos.forEach((d: Demo) => initialStatuses[d.id] = 'checking');
        setStatuses(initialStatuses);

        // Ping them
        loadedDemos.forEach((demo: Demo) => checkStatus(demo));
      } catch (err) {
        addLog('> ERROR: Failed to load demos from Mainframe');
      }
    };

    fetchDemos();

    return () => {
      // Cleanup styles
      document.body.style.backgroundImage = '';
      document.body.style.backgroundSize = '';
      document.body.style.backgroundColor = '';
      document.body.style.color = '';
    };
  }, []);

  const addLog = (msg: string) => {
    setLogs(prev => [...prev, msg]);
  };

  const checkStatus = async (demo: Demo) => {
    try {
      const { data } = await api.get(`/demos/status?url=${encodeURIComponent(demo.url)}`);
      const isOnline = data.isOnline;
      setStatuses(prev => ({ ...prev, [demo.id]: isOnline ? 'online' : 'offline' }));
      
      const statusColor = isOnline ? 'text-green-500' : 'text-red-500';
      const statusText = isOnline ? 'UP' : 'DOWN';
      addLog(`> Scan URL [${demo.codeName}]: <span class="${statusColor}">${statusText}</span>`);
    } catch (err) {
      setStatuses(prev => ({ ...prev, [demo.id]: 'offline' }));
      addLog(`> Scan URL [${demo.codeName}]: <span class="text-red-500">DOWN</span>`);
    }
  };

  // Helper to resolve colors since Tailwind classes might not be fully injected or user inputs Hex
  const resolveColor = (colorStr: string) => {
    if (colorStr.startsWith('#')) return colorStr;
    const colorMap: Record<string, string> = {
      'cyber-blue': '#00f0ff',
      'cyber-purple': '#bc13fe',
      'cyber-green': '#39ff14',
      'orange-500': '#f97316',
      'pink-500': '#ec4899',
      'cyan-400': '#22d3ee',
      'yellow-500': '#eab308',
      'red-500': '#ef4444',
      'white': '#ffffff'
    };
    return colorMap[colorStr] || colorStr;
  };

  return (
    <div className="font-sans min-h-screen relative overflow-hidden">
      {/* Scanline Effect */}
      <style>{`
        @keyframes scanline {
            0% { bottom: 100%; }
            100% { bottom: -100px; }
        }
        .portal-scanline {
            width: 100%;
            height: 100px;
            z-index: 5;
            background: linear-gradient(0deg, transparent 0%, rgba(0, 240, 255, 0.05) 50%, transparent 100%);
            opacity: 0.1;
            position: fixed;
            top: 0;
            left: 0;
            animation: scanline 10s linear infinite;
            pointer-events: none;
        }
        .portal-glass-card {
            background: rgba(13, 17, 23, 0.8);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.05);
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .portal-glass-card:hover {
            box-shadow: 0 0 30px rgba(0, 240, 255, 0.15);
            transform: translateY(-5px);
        }
        .portal-cyber-btn {
            position: relative;
            background: transparent;
            border: 1px solid currentColor;
            clip-path: polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0 30%);
            transition: all 0.3s;
        }
        .portal-cyber-btn:hover:not(:disabled) {
            background: currentColor;
            color: black !important;
            padding-left: 2rem;
        }
      `}</style>
      <div className="portal-scanline"></div>

      <main className="max-w-7xl mx-auto px-6 py-16 relative z-10 pt-32">
        <header className="mb-20 space-y-4">
          <div className="flex items-center gap-4 font-mono text-xs tracking-[0.5em] uppercase" style={{ color: '#00f0ff' }}>
              <span className="animate-pulse">●</span>
              <span>Alba-OS v4.0 — Mainframe Demo Access</span>
          </div>
          <h1 className="text-6xl font-black text-white tracking-tighter">
              SISTEMA <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">MULTIVERSE</span>
          </h1>
          <p className="max-w-xl text-gray-400 font-mono text-sm border-l-2 pl-6" style={{ borderColor: '#bc13fe' }}>
              Acceso centralizado a microservicios. El sistema realiza un barrido en vivo para verificar la integridad de las demos antes de la conexión.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {demos.map(demo => {
            const hexColor = resolveColor(demo.themeColor);
            const status = statuses[demo.id] || 'checking';
            
            let statusDotColor = '#4b5563'; // gray
            let statusTextClass = 'text-gray-400';
            if (status === 'online') { statusDotColor = '#39ff14'; statusTextClass = 'text-green-400'; }
            if (status === 'offline') { statusDotColor = '#ff003c'; statusTextClass = 'text-red-400'; }

            return (
              <motion.div 
                key={demo.id} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="portal-glass-card rounded-2xl p-8 group overflow-hidden"
                style={{ '--hover-border': hexColor } as any}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = hexColor)}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)')}
              >
                <div className="flex justify-between items-start mb-6">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-mono mb-1 uppercase tracking-tighter" style={{ color: hexColor }}>
                          {demo.codeName}
                        </span>
                        <h3 className="text-2xl font-bold text-white transition-colors" 
                            onMouseEnter={(e) => (e.currentTarget.style.color = hexColor)}
                            onMouseLeave={(e) => (e.currentTarget.style.color = 'white')}
                        >
                          {demo.title}
                        </h3>
                    </div>
                    <div className="px-3 py-1 rounded-full border border-gray-800 bg-black/40 text-[10px] font-bold font-mono flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full shadow-[0_0_10px_currentColor]" style={{ color: statusDotColor, backgroundColor: statusDotColor }}></span>
                        <span className={`uppercase ${statusTextClass}`}>{status}</span>
                    </div>
                </div>
                <p className="text-gray-400 text-sm mb-8 leading-relaxed line-clamp-3">{demo.description}</p>
                <div className="space-y-4">
                    <a 
                      href={demo.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={`portal-cyber-btn w-full block text-center py-3 text-sm font-bold uppercase tracking-widest ${status === 'offline' ? 'opacity-50 pointer-events-none' : ''}`}
                      style={{ color: hexColor }}
                    >
                        {status === 'offline' ? 'OFFLINE' : demo.btnText}
                    </a>
                </div>
              </motion.div>
            );
          })}
        </div>

        <footer className="mt-16 portal-glass-card rounded-xl p-6 font-mono text-[10px] text-gray-500">
            <div className="space-y-1">
                {logs.map((log, i) => (
                  <p key={i} dangerouslySetInnerHTML={{ __html: log }} />
                ))}
            </div>
        </footer>
      </main>
    </div>
  );
};
