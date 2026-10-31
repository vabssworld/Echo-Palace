// Environmental Storytelling Note Modal Component
import React from 'react';
import { LoreNoteData } from '../types';

interface LoreModalProps {
  note: LoreNoteData | null;
  onClose: () => void;
}

export const LoreModal: React.FC<LoreModalProps> = ({ note, onClose }) => {
  if (!note) return null;

  return (
    <div className="modal-backdrop">
      <div className="glass-panel modal-content" style={{ maxWidth: 520, border: '1px solid var(--accent-cyan)' }}>
        <div style={{ textAlign: 'center', marginBottom: '18px' }}>
          <div style={{ fontSize: '1.4rem', marginBottom: '4px' }}>📜</div>
          <h2 className="font-cinzel" style={{ fontSize: '1.4rem', color: '#f8fafc', letterSpacing: '0.1em' }}>
            {note.title}
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px', background: 'rgba(0, 0, 0, 0.25)', padding: '18px', borderRadius: '8px' }}>
          {note.text.map((para, i) => (
            <p key={i} style={{ fontSize: '0.88rem', color: '#e2e8f0', lineHeight: '1.6', fontStyle: 'italic' }}>
              {para}
            </p>
          ))}
        </div>

        <button onClick={onClose} className="btn-surreal btn-cyan" style={{ width: '100%', padding: '10px' }}>
          RETURN NOTE TO REST
        </button>
      </div>
    </div>
  );
};
