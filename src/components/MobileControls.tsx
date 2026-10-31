// Responsive Touch & Mobile Controls Component
import React from 'react';

interface MobileControlsProps {
  canSwitch: boolean;
  onDirectionChange: (moveX: number, moveY: number) => void;
  onJumpStart: () => void;
  onJumpEnd: () => void;
  onInteract: () => void;
  onSwitch: () => void;
  onToggleSync?: () => void;
}

export const MobileControls: React.FC<MobileControlsProps> = ({
  canSwitch,
  onDirectionChange,
  onJumpStart,
  onJumpEnd,
  onInteract,
  onSwitch,
  onToggleSync,
}) => {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 16,
        left: 16,
        right: 16,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        pointerEvents: 'none',
        zIndex: 90,
      }}
    >
      {/* Left: Direction Pad */}
      <div
        className="glass-panel"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 44px)',
          gridTemplateRows: 'repeat(3, 44px)',
          gap: '4px',
          padding: '8px',
          pointerEvents: 'auto',
        }}
      >
        <div />
        <button
          className="btn-surreal"
          style={{ padding: 0 }}
          onTouchStart={() => onDirectionChange(0, -1)}
          onTouchEnd={() => onDirectionChange(0, 0)}
          onMouseDown={() => onDirectionChange(0, -1)}
          onMouseUp={() => onDirectionChange(0, 0)}
        >
          ▲
        </button>
        <div />

        <button
          className="btn-surreal"
          style={{ padding: 0 }}
          onTouchStart={() => onDirectionChange(-1, 0)}
          onTouchEnd={() => onDirectionChange(0, 0)}
          onMouseDown={() => onDirectionChange(-1, 0)}
          onMouseUp={() => onDirectionChange(0, 0)}
        >
          ◀
        </button>
        <div />
        <button
          className="btn-surreal"
          style={{ padding: 0 }}
          onTouchStart={() => onDirectionChange(1, 0)}
          onTouchEnd={() => onDirectionChange(0, 0)}
          onMouseDown={() => onDirectionChange(1, 0)}
          onMouseUp={() => onDirectionChange(0, 0)}
        >
          ▶
        </button>

        <div />
        <button
          className="btn-surreal"
          style={{ padding: 0 }}
          onTouchStart={() => onDirectionChange(0, 1)}
          onTouchEnd={() => onDirectionChange(0, 0)}
          onMouseDown={() => onDirectionChange(0, 1)}
          onMouseUp={() => onDirectionChange(0, 0)}
        >
          ▼
        </button>
        <div />
      </div>

      {/* Right: Action Buttons */}
      <div
        style={{
          display: 'flex',
          gap: '10px',
          alignItems: 'center',
          pointerEvents: 'auto',
        }}
      >
        {canSwitch && onToggleSync && (
          <button
            onClick={onToggleSync}
            className="btn-surreal"
            style={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              fontSize: '0.72rem',
              fontWeight: 700,
            }}
            title="Toggle Mirror Sync (C)"
          >
            SYNC
          </button>
        )}

        {canSwitch && (
          <button
            onClick={onSwitch}
            className="btn-surreal"
            style={{
              width: 50,
              height: 50,
              borderRadius: '50%',
              borderColor: 'var(--accent-violet)',
              color: 'var(--accent-violet)',
              fontSize: '0.78rem',
              fontWeight: 700,
            }}
            title="Switch Active Self (TAB)"
          >
            TAB
          </button>
        )}

        <button
          onClick={onInteract}
          className="btn-surreal btn-cyan"
          style={{
            width: 52,
            height: 52,
            borderRadius: '50%',
            fontSize: '0.85rem',
            fontWeight: 700,
          }}
          title="Interact (E)"
        >
          [E]
        </button>

        <button
          className="btn-surreal"
          style={{
            width: 58,
            height: 58,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(46, 230, 214, 0.3) 0%, rgba(99, 102, 241, 0.3) 100%)',
            borderColor: 'var(--accent-cyan)',
            fontSize: '0.95rem',
            fontWeight: 700,
          }}
          onTouchStart={onJumpStart}
          onTouchEnd={onJumpEnd}
          onMouseDown={onJumpStart}
          onMouseUp={onJumpEnd}
          title="Jump / Grav Pulse (SPACE)"
        >
          LEAP
        </button>
      </div>
    </div>
  );
};
