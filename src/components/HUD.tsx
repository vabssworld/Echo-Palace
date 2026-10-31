// In-Game Surreal HUD Component
import React from 'react';
import { Puzzles } from '../game/Puzzles';
import { ActiveCharacter, GravityDirection } from '../types';

interface HUDProps {
  levelId: number;
  levelName: string;
  levelSubtitle: string;
  objective: string;
  activeChar: ActiveCharacter;
  playerGravity: GravityDirection;
  reflectionGravity: GravityDirection;
  canSwitch: boolean;
  mirrorSyncMode: boolean;
  activeHint: string | null;
  notification: string | null;
  onToggleSwitch: () => void;
  onToggleMirrorSync: () => void;
  onOpenTutorial: () => void;
  onOpenHint: () => void;
  onOpenMemoryLog: () => void;
  onRestartRoom: () => void;
  onOpenPause: () => void;
}

export const HUD: React.FC<HUDProps> = ({
  levelId,
  levelName,
  levelSubtitle,
  objective,
  activeChar,
  playerGravity,
  canSwitch,
  mirrorSyncMode,
  notification,
  onToggleSwitch,
  onToggleMirrorSync,
  onOpenTutorial,
  onOpenHint,
  onOpenMemoryLog,
  onRestartRoom,
  onOpenPause,
}) => {
  const getGravityRotation = (dir: GravityDirection) => {
    switch (dir) {
      case 'DOWN': return 0;
      case 'LEFT': return 90;
      case 'UP': return 180;
      case 'RIGHT': return 270;
    }
  };

  const runeSymbols = ['🜂', '🜄', '🜁', '🜃'];
  const playerSequence = Puzzles.getPlayerChimeSequence();
  const reflectionSequence = Puzzles.getReflectionChimeSequence();

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '16px 24px', pointerEvents: 'none', zIndex: 100 }}>
      {/* Toast Notification */}
      {notification && (
        <div className="notification-toast font-mono">
          {notification}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', maxWidth: 1200, margin: '0 auto' }}>
        {/* Left: Level Info & Objective */}
        <div className="glass-panel" style={{ padding: '12px 20px', pointerEvents: 'auto', display: 'flex', flexDirection: 'column', gap: '4px', maxWidth: 420 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', background: 'rgba(46, 230, 214, 0.1)', padding: '2px 8px', borderRadius: '4px' }}>
              ROOM 0{levelId}
            </span>
            <span className="font-cinzel" style={{ fontSize: '1rem', fontWeight: 600, color: '#f8fafc' }}>
              {levelName}
            </span>
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
            {levelSubtitle}
          </div>
          <div style={{ marginTop: '6px', fontSize: '0.82rem', color: '#e2e8f0', display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
            <span style={{ color: 'var(--accent-amber)' }}>✦</span>
            <span>{objective}</span>
          </div>

          {/* Level 5 Chimes Sequence Visualizer */}
          {levelId === 5 && (
            <div style={{ marginTop: '8px', padding: '6px 10px', background: 'rgba(0,0,0,0.3)', borderRadius: '6px', fontSize: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--accent-cyan)', marginBottom: '2px' }}>
                <span>Player Order (0-1-2-3):</span>
                <span>{playerSequence.map(i => runeSymbols[i] || i).join(' ') || 'none'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--accent-violet)' }}>
                <span>Reflection Reverse (3-2-1-0):</span>
                <span>{reflectionSequence.map(i => runeSymbols[i] || i).join(' ') || 'none'}</span>
              </div>
            </div>
          )}
        </div>

        {/* Center: Gravity Compass & Active Character Pill & Mirror Sync */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', pointerEvents: 'auto' }}>
          {/* Gravity Compass */}
          <div
            className="glass-panel"
            style={{ padding: '8px 14px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'default' }}
            title={`Current Gravity: ${playerGravity}`}
          >
            <div
              style={{
                width: 22,
                height: 22,
                borderRadius: '50%',
                border: '1px solid var(--accent-cyan)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transform: `rotate(${getGravityRotation(playerGravity)}deg)`,
                transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                color: 'var(--accent-cyan)',
                fontSize: '0.75rem',
              }}
            >
              ▼
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>GRAVITY</span>
              <span className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>
                {playerGravity}
              </span>
            </div>
          </div>

          {/* Active Character Badge / Switcher */}
          {canSwitch && (
            <button
              onClick={onToggleSwitch}
              className="glass-panel"
              style={{
                padding: '8px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                cursor: 'pointer',
                background:
                  activeChar === 'PLAYER'
                    ? 'linear-gradient(135deg, rgba(46, 230, 214, 0.15) 0%, rgba(30, 27, 75, 0.8) 100%)'
                    : 'linear-gradient(135deg, rgba(192, 132, 252, 0.2) 0%, rgba(30, 27, 75, 0.8) 100%)',
                borderColor: activeChar === 'PLAYER' ? 'var(--accent-cyan)' : 'var(--accent-violet)',
                transition: 'all 0.3s ease',
              }}
              title="Click or press TAB to switch character"
            >
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: activeChar === 'PLAYER' ? 'var(--accent-cyan)' : 'var(--accent-violet)',
                  boxShadow: `0 0 10px ${activeChar === 'PLAYER' ? 'var(--accent-cyan)' : 'var(--accent-violet)'}`,
                }}
              />
              <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>MIND [TAB]</span>
                <span className="font-mono" style={{ fontSize: '0.8rem', fontWeight: 600, color: activeChar === 'PLAYER' ? 'var(--accent-cyan)' : 'var(--accent-violet)' }}>
                  {activeChar === 'PLAYER' ? 'REAL SELF' : 'REFLECTION'}
                </span>
              </div>
            </button>
          )}

          {/* Mirror Synchrony Toggle Button */}
          {canSwitch && (
            <button
              onClick={onToggleMirrorSync}
              className="glass-panel"
              style={{
                padding: '8px 14px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'pointer',
                border: `1px solid ${mirrorSyncMode ? 'var(--accent-violet)' : 'rgba(255,255,255,0.1)'}`,
                background: mirrorSyncMode ? 'rgba(192, 132, 252, 0.15)' : 'rgba(15, 23, 42, 0.6)',
                transition: 'all 0.3s ease',
              }}
              title="Toggle Opposite Movement Link [C]"
            >
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>MIRROR SYNC [C]</span>
              <span className="font-mono" style={{ fontSize: '0.75rem', fontWeight: 600, color: mirrorSyncMode ? 'var(--accent-violet)' : '#64748b' }}>
                {mirrorSyncMode ? 'OPPOSITE' : 'INDEPENDENT'}
              </span>
            </button>
          )}
        </div>

        {/* Right: Quick Action Controls */}
        <div style={{ display: 'flex', gap: '8px', pointerEvents: 'auto' }}>
          <button
            onClick={onOpenTutorial}
            className="btn-surreal"
            style={{ padding: '8px 12px', fontSize: '0.78rem' }}
            title="Short Dream Rules Tutorial [T]"
          >
            📖 RULES [T]
          </button>
          <button
            onClick={onOpenHint}
            className="btn-surreal"
            style={{ padding: '8px 12px', fontSize: '0.78rem' }}
            title="Request dream clue"
          >
            💡 HINT
          </button>
          <button
            onClick={onOpenMemoryLog}
            className="btn-surreal"
            style={{ padding: '8px 12px', fontSize: '0.78rem' }}
            title="Inspect persistent house memories [M]"
          >
            📜 MEMORIES [M]
          </button>
          <button
            onClick={onRestartRoom}
            className="btn-surreal"
            style={{ padding: '8px 12px', fontSize: '0.78rem' }}
            title="Restart current room [R]"
          >
            🔄 RESTART [R]
          </button>
          <button
            onClick={onOpenPause}
            className="btn-surreal"
            style={{ padding: '8px 12px', fontSize: '0.78rem' }}
            title="Pause Menu [ESC]"
          >
            ⏸ MENU
          </button>
        </div>
      </div>
    </div>
  );
};
