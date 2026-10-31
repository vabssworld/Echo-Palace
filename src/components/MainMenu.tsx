// Main Title Menu Component
import React, { useEffect, useRef } from 'react';
import { StorageManager } from '../utils/Storage';

interface MainMenuProps {
  hasSave: boolean;
  onNewGame: () => void;
  onContinue: () => void;
  onOpenHowToPlay: () => void;
  onOpenMemoryLog: () => void;
  onOpenSettings: () => void;
  onOpenCredits: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  hasSave,
  onNewGame,
  onContinue,
  onOpenHowToPlay,
  onOpenMemoryLog,
  onOpenSettings,
  onOpenCredits,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Background animated particle canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const onResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);

    const particles = Array.from({ length: 70 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.8,
      vy: -0.3 - Math.random() * 0.7,
      size: 1 + Math.random() * 2.5,
      color: Math.random() > 0.5 ? '#2ee6d6' : '#c084fc',
      alpha: 0.2 + Math.random() * 0.5,
    }));

    const render = () => {
      ctx.fillStyle = '#060712';
      ctx.fillRect(0, 0, width, height);

      // Deep glowing central orb
      const grad = ctx.createRadialGradient(
        width * 0.5,
        height * 0.45,
        50,
        width * 0.5,
        height * 0.45,
        width * 0.5
      );
      grad.addColorStop(0, 'rgba(67, 56, 202, 0.25)');
      grad.addColorStop(0.5, 'rgba(126, 34, 206, 0.12)');
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Particles
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < 0) p.y = height;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, zIndex: 0 }} />

      <div
        className="glass-panel"
        style={{
          position: 'relative',
          zIndex: 10,
          padding: '44px 56px',
          textAlign: 'center',
          maxWidth: 580,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '24px',
          animation: 'scaleUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <div>
          <h1
            className="font-cinzel"
            style={{
              fontSize: '3.4rem',
              fontWeight: 700,
              background: 'linear-gradient(135deg, #f8fafc 0%, #2ee6d6 50%, #c084fc 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '0.22em',
              marginBottom: '6px',
              textShadow: '0 0 35px rgba(46, 230, 214, 0.35)',
            }}
          >
            REVERIE
          </h1>
          <div
            className="font-cinzel"
            style={{
              fontSize: '1.05rem',
              color: 'var(--accent-violet)',
              letterSpacing: '0.2em',
              fontWeight: 600,
              marginBottom: '12px',
            }}
          >
            THE HOUSE THAT REMEMBERS
          </div>
          <p
            style={{
              fontSize: '0.9rem',
              color: 'var(--text-muted)',
              fontStyle: 'italic',
              letterSpacing: '0.04em',
            }}
          >
            "Reality is a rule. Dreams are an exception."
          </p>
        </div>

        {/* Buttons List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', maxWidth: 280 }}>
          <button onClick={onNewGame} className="btn-surreal btn-cyan" style={{ width: '100%', padding: '12px 24px', fontSize: '0.95rem' }}>
            ✦ NEW GAME
          </button>
          
          <button
            onClick={onContinue}
            disabled={!hasSave}
            className="btn-surreal"
            style={{ width: '100%', padding: '12px 24px', fontSize: '0.95rem' }}
          >
            ▶ CONTINUE
          </button>

          <button onClick={onOpenHowToPlay} className="btn-surreal" style={{ width: '100%', padding: '10px 20px' }}>
            📖 HOW TO PLAY
          </button>

          <button onClick={onOpenMemoryLog} className="btn-surreal" style={{ width: '100%', padding: '10px 20px' }}>
            📜 HOUSE MEMORIES
          </button>

          <button onClick={onOpenSettings} className="btn-surreal" style={{ width: '100%', padding: '10px 20px' }}>
            ⚙️ SETTINGS
          </button>

          <button onClick={onOpenCredits} className="btn-surreal" style={{ width: '100%', padding: '10px 20px' }}>
            ✦ CREDITS
          </button>
        </div>

        <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.3)', letterSpacing: '0.08em' }}>
          VER 1.0 • SURREAL PUZZLE ADVENTURE
        </div>
      </div>
    </div>
  );
};
