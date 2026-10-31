// Credits Modal Component
import React from 'react';

interface CreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreditsModal: React.FC<CreditsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="glass-panel modal-content" style={{ maxWidth: 520, textAlign: 'center' }}>
        <h2 className="font-cinzel" style={{ fontSize: '1.6rem', color: '#f8fafc', marginBottom: '6px' }}>
          REVERIE
        </h2>
        <div style={{ fontSize: '0.85rem', color: 'var(--accent-violet)', fontStyle: 'italic', marginBottom: '24px' }}>
          THE HOUSE THAT REMEMBERS
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', background: 'rgba(0, 0, 0, 0.25)', padding: '20px', borderRadius: '8px', marginBottom: '24px', textAlign: 'left' }}>
          <div>
            <div className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--accent-cyan)' }}>GAMEPLAY & ENGINE ARCHITECTURE</div>
            <div style={{ fontSize: '0.9rem', color: '#f1f5f9' }}>Dream Physics, 4-Way Gravity, & Observation Raycasting</div>
          </div>

          <div>
            <div className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--accent-violet)' }}>MIRROR ME & ROOM MEMORY</div>
            <div style={{ fontSize: '0.9rem', color: '#f1f5f9' }}>Dual Consciousness Synchrony & Persistent Event Cascades</div>
          </div>

          <div>
            <div className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--accent-amber)' }}>PROCEDURAL SOUND DESIGN</div>
            <div style={{ fontSize: '0.9rem', color: '#f1f5f9' }}>Web Audio API Synthesized Ambient Drones & Harmonic Chimes</div>
          </div>

          <div>
            <div className="font-mono" style={{ fontSize: '0.72rem', color: '#94a3b8' }}>ART DIRECTION & INSPIRATION</div>
            <div style={{ fontSize: '0.9rem', color: '#f1f5f9' }}>M.C. Escher, Surrealist Metaphysics, & Lucid Psychology</div>
          </div>
        </div>

        <button onClick={onClose} className="btn-surreal btn-cyan" style={{ width: '100%', padding: '10px' }}>
          CLOSE CREDITS
        </button>
      </div>
    </div>
  );
};
