// Cinematic Narrative Ending Modal Component
import React from 'react';
import { MemorySystem } from '../engine/MemorySystem';

interface EndingModalProps {
  endingType: 'TRANSCENDENCE' | 'CUSTODIAN' | 'LIBERATION' | null;
  onRestart: () => void;
  onReturnTitle: () => void;
}

export const EndingModal: React.FC<EndingModalProps> = ({
  endingType,
  onRestart,
  onReturnTitle,
}) => {
  if (!endingType) return null;

  const events = MemorySystem.getEvents();

  const endingDetails = {
    TRANSCENDENCE: {
      title: 'ENDING I: THE TRUE LUCID AWAKENING',
      tagline: 'When the mirror and the wanderer become whole.',
      color: '#2ee6d6',
      text: [
        'You did not conquer your reflection; you listened to it. You shattered the barrier that divided your fears from your truth.',
        'At the Core of Remembering, the two silhouettes reach across the impossible geometry and clasp hands.',
        'The inverted walls, the four-way gravity, the shifting clocks—all dissolve like mist beneath a golden sun.',
        'You open your eyes in the waking world, complete and unburdened.',
      ],
    },
    CUSTODIAN: {
      title: 'ENDING II: THE ETERNAL CUSTODIAN',
      tagline: 'The house remembers your dominion forever.',
      color: '#f59e0b',
      text: [
        'You mastered the house’s geometry. You solved its intricate clockwork through pure will.',
        'Yet you kept your reflection at a distance—a tool to hold doors, a shadow to bear weights.',
        'The house admires your intellect. It reconfigures its rooms around your footsteps. You are no longer a prisoner; you are its eternal curator.',
        'You will walk these impossible hallways for all time, lucid and alone.',
      ],
    },
    LIBERATION: {
      title: 'ENDING III: THE MIRROR\'S LIBERATION',
      tagline: 'The shadow steps into the dawn.',
      color: '#c084fc',
      text: [
        'Through the reverse harmonic chimes, you granted voice and agency to your reflection.',
        'As the Core opens, your mirror self turns, bows with gratitude, and steps first through the threshold of reality.',
        'A mysterious balance is struck: the house remains as a sanctuary for your memories, while your freed spirit walks the earth.',
        'Reality is a rule. Dreams are an exception.',
      ],
    },
  }[endingType];

  return (
    <div className="modal-backdrop">
      <div className="glass-panel modal-content" style={{ maxWidth: 660, border: `1px solid ${endingDetails.color}` }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div className="font-mono" style={{ fontSize: '0.8rem', color: endingDetails.color, letterSpacing: '0.15em', marginBottom: '8px' }}>
            CONVERGENCE OF MEMORIES
          </div>
          <h1 className="font-cinzel" style={{ fontSize: '1.8rem', color: '#f8fafc', marginBottom: '6px' }}>
            {endingDetails.title}
          </h1>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
            "{endingDetails.tagline}"
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '28px', background: 'rgba(0, 0, 0, 0.3)', padding: '22px', borderRadius: '8px' }}>
          {endingDetails.text.map((p, idx) => (
            <p key={idx} style={{ fontSize: '0.9rem', color: '#e2e8f0', lineHeight: '1.65' }}>
              {p}
            </p>
          ))}
        </div>

        {/* Journey Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '28px', textAlign: 'center' }}>
          <div style={{ background: 'rgba(26, 21, 56, 0.5)', padding: '10px', borderRadius: '6px' }}>
            <div className="font-mono" style={{ fontSize: '1.2rem', color: 'var(--accent-cyan)', fontWeight: 700 }}>6 / 6</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>ROOMS UNLOCKED</div>
          </div>
          <div style={{ background: 'rgba(26, 21, 56, 0.5)', padding: '10px', borderRadius: '6px' }}>
            <div className="font-mono" style={{ fontSize: '1.2rem', color: 'var(--accent-amber)', fontWeight: 700 }}>{events.length}</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>PERSISTENT MEMORIES</div>
          </div>
          <div style={{ background: 'rgba(26, 21, 56, 0.5)', padding: '10px', borderRadius: '6px' }}>
            <div className="font-mono" style={{ fontSize: '1.2rem', color: 'var(--accent-violet)', fontWeight: 700 }}>10+</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>PUZZLES SOLVED</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={onRestart} className="btn-surreal btn-cyan" style={{ flex: 1, padding: '12px' }}>
            ✦ DREAM A NEW DREAM
          </button>
          <button onClick={onReturnTitle} className="btn-surreal" style={{ flex: 1, padding: '12px' }}>
            🏠 MAIN TITLE
          </button>
        </div>
      </div>
    </div>
  );
};
