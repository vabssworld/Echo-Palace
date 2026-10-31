// Game Canvas Wrapper Component
import React, { useEffect, useRef } from 'react';
import { GameEngine } from '../game/GameEngine';

interface GameCanvasProps {
  engine: GameEngine;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({ engine }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Attach canvas to master engine
    engine.attachCanvas(canvas);

    // Responsive canvas dimension handling
    const updateSize = () => {
      // Internal render resolution matches game world dimensions
      canvas.width = 1100;
      canvas.height = 680;
    };

    updateSize();
    window.addEventListener('resize', updateSize);

    return () => {
      window.removeEventListener('resize', updateSize);
    };
  }, [engine]);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          maxWidth: '1240px',
          maxHeight: '82vh',
          aspectRatio: '1100 / 680',
          boxShadow: '0 0 60px rgba(0, 0, 0, 0.8), 0 0 30px rgba(99, 102, 241, 0.2)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          borderRadius: '8px',
          backgroundColor: '#070814',
          objectFit: 'contain',
        }}
      />
    </div>
  );
};
