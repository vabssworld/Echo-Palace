// House Memory Timeline Modal Component
import React from 'react';
import { MemorySystem } from '../engine/MemorySystem';
import { GameEvent } from '../types';

interface MemoryLogModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MemoryLogModal: React.FC<MemoryLogModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const events: GameEvent[] = MemorySystem.getEvents();

  return (
    <div className="modal-backdrop">
      <div className="glass-panel modal-content" style={{ maxWidth: 620 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h2 className="font-cinzel" style={{ fontSize: '1.5rem', color: '#f8fafc' }}>
            WHAT THE HOUSE REMEMBERS
          </h2>
          <span className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--accent-amber)', background: 'rgba(245, 158, 11, 0.1)', padding: '3px 10px', borderRadius: '4px' }}>
            {events.length} EVENTS RECORDED
          </span>
        </div>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
          Every action taken leaves a permanent resonance within the architecture of the dream.
        </p>

        {/* Timeline list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '420px', overflowY: 'auto', marginBottom: '24px', paddingRight: '6px' }}>
          {events.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)', fontStyle: 'italic', background: 'rgba(0, 0, 0, 0.2)', borderRadius: '8px' }}>
              The house has not yet formed memories. Explore its rooms and interact with its architecture to leave your imprint.
            </div>
          ) : (
            events.map((evt, idx) => (
              <div
                key={evt.id}
                style={{
                  background: 'rgba(26, 21, 56, 0.55)',
                  border: '1px solid rgba(99, 102, 241, 0.25)',
                  borderLeft: `4px solid ${evt.character === 'PLAYER' ? 'var(--accent-cyan)' : 'var(--accent-violet)'}`,
                  padding: '12px 16px',
                  borderRadius: '6px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    #{events.length - idx} • {evt.roomId}
                  </span>
                  <span
                    className="font-mono"
                    style={{
                      fontSize: '0.72rem',
                      color: evt.character === 'PLAYER' ? 'var(--accent-cyan)' : 'var(--accent-violet)',
                      fontWeight: 600,
                    }}
                  >
                    {evt.character === 'PLAYER' ? 'REAL SELF' : 'REFLECTION'}
                  </span>
                </div>
                <div style={{ fontSize: '0.88rem', color: '#f1f5f9', fontWeight: 500 }}>
                  {evt.description}
                </div>
                <div className="font-mono" style={{ fontSize: '0.68rem', color: 'var(--accent-amber)', opacity: 0.8 }}>
                  ACTION: {evt.action} • TARGET: {evt.objectId}
                </div>
              </div>
            ))
          )}
        </div>

        <button onClick={onClose} className="btn-surreal" style={{ width: '100%', padding: '12px' }}>
          CLOSE TIMELINE
        </button>
      </div>
    </div>
  );
};
