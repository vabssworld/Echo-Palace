// How To Play & Dream Mechanics Modal Component
import React from 'react';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="glass-panel modal-content" style={{ maxWidth: 640 }}>
        <h2 className="font-cinzel" style={{ fontSize: '1.7rem', color: '#f8fafc', marginBottom: '6px', textAlign: 'center' }}>
          RULES OF THE DREAM
        </h2>
        <div style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--accent-cyan)', marginBottom: '20px', fontStyle: 'italic' }}>
          "Reality is a rule. Dreams are an exception."
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '28px' }}>
          {/* Mechanic A: Dream Logic */}
          <div style={{ background: 'rgba(46, 230, 214, 0.06)', borderLeft: '3px solid var(--accent-cyan)', padding: '14px 16px', borderRadius: '4px' }}>
            <h3 className="font-cinzel" style={{ fontSize: '1.05rem', color: 'var(--accent-cyan)', marginBottom: '6px' }}>
              I. DREAM LOGIC (GRAVITY & OBSERVATION)
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#cbd5e1', lineHeight: '1.5', marginBottom: '6px' }}>
              • <strong>4-Way Gravity:</strong> Touch glowing Gravity Catalysts to fall Down, Up, Left, or Right. Walk along ceilings and vertical walls seamlessly.
            </p>
            <p style={{ fontSize: '0.82rem', color: '#cbd5e1', lineHeight: '1.5' }}>
              • <strong>Quantum Observation:</strong> Objects only maintain fixed reality when watched. Turning your back (facing away) causes monolithic barriers to compress or keys to expand!
            </p>
          </div>

          {/* Mechanic B: Mirror Me */}
          <div style={{ background: 'rgba(192, 132, 252, 0.06)', borderLeft: '3px solid var(--accent-violet)', padding: '14px 16px', borderRadius: '4px' }}>
            <h3 className="font-cinzel" style={{ fontSize: '1.05rem', color: 'var(--accent-violet)', marginBottom: '6px' }}>
              II. MIRROR ME (DUAL-SELF SYNCHRONY)
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#cbd5e1', lineHeight: '1.5', marginBottom: '6px' }}>
              • <strong>Independent Consciousness:</strong> Your reflection is not a mere copy. Press <strong>[TAB]</strong> to switch control between Real Self and Reflection.
            </p>
            <p style={{ fontSize: '0.82rem', color: '#cbd5e1', lineHeight: '1.5' }}>
              • <strong>Dual Coordination:</strong> Inactive selves remain physical to hold down pressure plates or keep objects in their field of view. Solve inverted reverse harmonic runes together.
            </p>
          </div>

          {/* Mechanic C: The Room That Remembers */}
          <div style={{ background: 'rgba(245, 158, 11, 0.06)', borderLeft: '3px solid var(--accent-amber)', padding: '14px 16px', borderRadius: '4px' }}>
            <h3 className="font-cinzel" style={{ fontSize: '1.05rem', color: 'var(--accent-amber)', marginBottom: '6px' }}>
              III. THE ROOM THAT REMEMBERS (PERSISTENCE)
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#cbd5e1', lineHeight: '1.5', marginBottom: '6px' }}>
              • <strong>Living World State:</strong> The house records every action into its memory loom. Shatter a mirror in Room 2, and future rooms will maintain the broken passageway.
            </p>
            <p style={{ fontSize: '0.82rem', color: '#cbd5e1', lineHeight: '1.5' }}>
              • <strong>Cross-Room Cascades:</strong> Moving the Celestial Pedestal redirects light across corridors; leaving an observatory hatch unlatched draws wind that aligns suspended bridges!
            </p>
          </div>

          {/* Controls Grid */}
          <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '14px', borderRadius: '8px' }}>
            <h4 style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Controls Reference
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.8rem' }}>
              <div><span className="font-mono" style={{ color: 'var(--accent-cyan)' }}>A / D or ◀ / ▶</span>: Walk</div>
              <div><span className="font-mono" style={{ color: 'var(--accent-cyan)' }}>W / Space / ▲</span>: Jump / Leap</div>
              <div><span className="font-mono" style={{ color: 'var(--accent-violet)' }}>TAB</span>: Switch Active Self</div>
              <div><span className="font-mono" style={{ color: 'var(--accent-violet)' }}>C</span>: Toggle Mirror Sync</div>
              <div><span className="font-mono" style={{ color: 'var(--accent-amber)' }}>E</span>: Interact / Flip Switch</div>
              <div><span className="font-mono" style={{ color: '#cbd5e1' }}>M</span>: House Memory Timeline</div>
              <div><span className="font-mono" style={{ color: '#cbd5e1' }}>R</span>: Restart Current Room</div>
              <div><span className="font-mono" style={{ color: '#cbd5e1' }}>ESC</span>: Pause / Settings</div>
              <div><span className="font-mono" style={{ color: '#cbd5e1' }}>Touch</span>: On-screen dpad & buttons</div>
            </div>
          </div>
        </div>

        <button onClick={onClose} className="btn-surreal btn-cyan" style={{ width: '100%', padding: '12px' }}>
          ENTER THE REVERIE
        </button>
      </div>
    </div>
  );
};
