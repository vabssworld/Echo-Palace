// 3-Tier Progressive Hint Modal Component
import React, { useState } from 'react';

interface HintModalProps {
  isOpen: boolean;
  hints: [string, string, string];
  currentTier: number;
  onRevealNextTier: () => void;
  onClose: () => void;
}

export const HintModal: React.FC<HintModalProps> = ({
  isOpen,
  hints,
  currentTier,
  onRevealNextTier,
  onClose,
}) => {
  if (!isOpen) return null;

  const tierLabels = [
    { name: 'I. SUBTLE WHISPER', color: '#38bdf8' },
    { name: 'II. GUIDING INTENTION', color: '#c084fc' },
    { name: 'III. ARCHITECTURAL TRUTH', color: '#f59e0b' },
  ];

  return (
    <div className="modal-backdrop">
      <div className="glass-panel modal-content" style={{ maxWidth: 540 }}>
        <h2 className="font-cinzel" style={{ fontSize: '1.5rem', color: '#f8fafc', marginBottom: '8px', textAlign: 'center' }}>
          THE HOUSE WHISPERS
        </h2>
        <p style={{ textAlign: 'center', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '24px' }}>
          Hints are revealed gradually to preserve the beauty of discovery.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '28px' }}>
          {hints.map((hintText, idx) => {
            const isRevealed = idx < currentTier;
            const tierInfo = tierLabels[idx];

            return (
              <div
                key={idx}
                style={{
                  background: isRevealed ? 'rgba(30, 27, 75, 0.6)' : 'rgba(15, 23, 42, 0.4)',
                  border: `1px solid ${isRevealed ? tierInfo.color : 'rgba(255, 255, 255, 0.08)'}`,
                  borderRadius: '8px',
                  padding: '14px 18px',
                  opacity: isRevealed ? 1 : 0.4,
                  transition: 'all 0.3s ease',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span className="font-mono" style={{ fontSize: '0.72rem', color: tierInfo.color, fontWeight: 600 }}>
                    {tierInfo.name}
                  </span>
                  {!isRevealed && (
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>🔒 VEILED</span>
                  )}
                </div>

                <div style={{ fontSize: '0.85rem', color: isRevealed ? '#f1f5f9' : '#64748b', fontStyle: isRevealed ? 'normal' : 'italic', lineHeight: '1.5' }}>
                  {isRevealed ? hintText : 'This realization remains hidden beneath the subconscious.'}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          {currentTier < 3 && (
            <button onClick={onRevealNextTier} className="btn-surreal btn-cyan" style={{ flex: 1, padding: '12px' }}>
              REVEAL NEXT TIER ({currentTier + 1}/3)
            </button>
          )}
          <button onClick={onClose} className="btn-surreal" style={{ flex: 1, padding: '12px' }}>
            RETURN TO EXPLORATION
          </button>
        </div>
      </div>
    </div>
  );
};
