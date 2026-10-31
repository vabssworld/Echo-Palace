// Pause & Settings Modal Component (with Hackathon Chamber Quick Jump)
import React, { useState } from 'react';
import { SoundEngine } from '../engine/SoundEngine';
import { StorageManager } from '../utils/Storage';

interface PauseModalProps {
  isOpen: boolean;
  onResume: () => void;
  onRestartLevel: () => void;
  onSelectLevel: (levelId: number) => void;
  onOpenTutorial: () => void;
  onReturnToTitle: () => void;
  onResetSave: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  isOpen,
  onResume,
  onRestartLevel,
  onSelectLevel,
  onOpenTutorial,
  onReturnToTitle,
  onResetSave,
}) => {
  const [masterVol, setMasterVol] = useState(0.7);
  const [musicVol, setMusicVol] = useState(0.5);
  const [sfxVol, setSfxVol] = useState(0.8);
  const [isMuted, setIsMuted] = useState(SoundEngine.isMuted());
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  if (!isOpen) return null;

  const handleMasterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setMasterVol(val);
    SoundEngine.setMasterVolume(val);
  };

  const handleMusicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setMusicVol(val);
    SoundEngine.setMusicVolume(val);
  };

  const handleSfxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setSfxVol(val);
    SoundEngine.setSfxVolume(val);
  };

  const handleMuteToggle = () => {
    const muted = SoundEngine.toggleMute();
    setIsMuted(muted);
  };

  const chambers = [
    { id: 1, name: 'The Awakening' },
    { id: 2, name: 'The Other You' },
    { id: 3, name: 'The Room That Remembers' },
    { id: 4, name: 'The Impossible House' },
    { id: 5, name: "The Reflection's World" },
    { id: 6, name: 'The Last Memory' },
  ];

  return (
    <div className="modal-backdrop">
      <div className="glass-panel modal-content" style={{ maxWidth: 520 }}>
        <h2 className="font-cinzel" style={{ fontSize: '1.6rem', color: '#f8fafc', marginBottom: '6px', textAlign: 'center' }}>
          REVERIE PAUSED
        </h2>
        <p style={{ textAlign: 'center', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
          The house pauses its remembering.
        </p>

        {/* Hackathon Chamber Quick Jump */}
        <div style={{ marginBottom: '20px', background: 'rgba(0, 0, 0, 0.25)', padding: '14px', borderRadius: '8px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
            ⚡ Hackathon Chamber Select (Quick Jump)
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
            {chambers.map(c => (
              <button
                key={c.id}
                onClick={() => {
                  onSelectLevel(c.id);
                  onResume();
                }}
                className="btn-surreal"
                style={{ padding: '6px 8px', fontSize: '0.72rem', textAlign: 'center', justifyContent: 'center' }}
                title={`Jump to Room 0${c.id}: ${c.name}`}
              >
                0{c.id}: {c.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Audio Sliders */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px', background: 'rgba(0, 0, 0, 0.25)', padding: '14px', borderRadius: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.82rem' }}>Audio Master Mute</span>
            <button onClick={handleMuteToggle} className="btn-surreal" style={{ padding: '4px 12px', fontSize: '0.75rem' }}>
              {isMuted ? '🔇 UNMUTE' : '🔊 MUTED: OFF'}
            </button>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '3px' }}>
              <span>Master Volume</span>
              <span>{Math.round(masterVol * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={masterVol}
              onChange={handleMasterChange}
              style={{ width: '100%', accentColor: 'var(--accent-cyan)' }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '3px' }}>
              <span>Music Volume</span>
              <span>{Math.round(musicVol * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={musicVol}
              onChange={handleMusicChange}
              style={{ width: '100%', accentColor: 'var(--accent-violet)' }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '3px' }}>
              <span>Sound Effects</span>
              <span>{Math.round(sfxVol * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={sfxVol}
              onChange={handleSfxChange}
              style={{ width: '100%', accentColor: 'var(--accent-amber)' }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button onClick={onResume} className="btn-surreal btn-cyan" style={{ width: '100%', padding: '10px' }}>
            ▶ RESUME REVERIE
          </button>
          <button onClick={onOpenTutorial} className="btn-surreal" style={{ width: '100%', padding: '10px' }}>
            📖 DREAM MECHANICS TUTORIAL [T]
          </button>
          <button onClick={onRestartLevel} className="btn-surreal" style={{ width: '100%', padding: '10px' }}>
            🔄 RESTART CURRENT ROOM [R]
          </button>
          <button onClick={onReturnToTitle} className="btn-surreal" style={{ width: '100%', padding: '10px' }}>
            🏠 RETURN TO TITLE MENU
          </button>

          {!showConfirmReset ? (
            <button
              onClick={() => setShowConfirmReset(true)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--accent-rose)',
                fontSize: '0.75rem',
                marginTop: '6px',
                cursor: 'pointer',
                opacity: 0.7,
              }}
            >
              Reset All Saved Progress
            </button>
          ) : (
            <div style={{ marginTop: '8px', textAlign: 'center', background: 'rgba(244, 63, 94, 0.1)', padding: '10px', borderRadius: '6px' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--accent-rose)', marginBottom: '6px' }}>
                Are you certain? All remembered room states will be forgotten.
              </div>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                <button
                  onClick={() => {
                    onResetSave();
                    setShowConfirmReset(false);
                  }}
                  className="btn-surreal"
                  style={{ background: 'var(--accent-rose)', borderColor: 'var(--accent-rose)', padding: '6px 12px', fontSize: '0.75rem' }}
                >
                  Confirm Reset
                </button>
                <button
                  onClick={() => setShowConfirmReset(false)}
                  className="btn-surreal"
                  style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
