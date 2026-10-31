// Short Dream Mechanics Tutorial Modal Component (Hackathon Demo Edition)
import React, { useState } from 'react';

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TutorialModal: React.FC<TutorialModalProps> = ({ isOpen, onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  if (!isOpen) return null;

  const slides = [
    {
      title: 'I. GRAVITY IS AN EXCEPTION',
      subtitle: 'Falling is merely a question of perspective.',
      tag: 'DREAM PHYSICS',
      color: '#2ee6d6',
      icon: '🌌',
      points: [
        'Stepping on or touching glowing Gravity Catalysts will rotate your entire world.',
        'You can walk along ceilings and vertical walls as if they were solid ground.',
        'Directional leaps adapt to your orientation: leap away from any surface you stand upon.',
      ],
      tip: 'TIP: Use A/D or ◀/▶ to move along surfaces; Space, W, or ▲ to leap.',
    },
    {
      title: 'II. OBSERVATION DEFINES REALITY',
      subtitle: 'What remains unseen refuses to stay fixed.',
      tag: 'THE GAZE',
      color: '#f59e0b',
      icon: '👁️',
      points: [
        'Certain impossible objects change scale when they leave your field of view.',
        'Turn your character\'s back (face away) to allow oversized monolithic barriers to compress.',
        'One self can look away while the other maintains watch to keep unstable structures solid.',
      ],
      tip: 'TIP: Your vision cone indicates what is currently being observed.',
    },
    {
      title: 'III. THE MIRROR & THE MEMORY',
      subtitle: 'You are not alone, and nothing is forgotten.',
      tag: 'MIRROR ME & PERSISTENCE',
      color: '#c084fc',
      icon: '🪞',
      points: [
        'Press [TAB] to switch consciousness between your Real Self and your Reflection.',
        'Press [C] to toggle Mirror Synchrony: moving in one direction guides the reflection symmetrically opposite.',
        'The house remembers: broken glass, shifted pedestals, and unlatched doors persist into future rooms.',
      ],
      tip: 'TIP: Press [M] at any time to inspect everything the house remembers.',
    },
  ];

  const slide = slides[currentSlide];

  return (
    <div className="modal-backdrop">
      <div className="glass-panel modal-content" style={{ maxWidth: 560, border: `1px solid ${slide.color}` }}>
        {/* Header Indicator */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <span className="font-mono" style={{ fontSize: '0.75rem', color: slide.color, background: 'rgba(255, 255, 255, 0.06)', padding: '3px 10px', borderRadius: '4px' }}>
            {slide.tag} • {currentSlide + 1} / 3
          </span>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1rem' }}
          >
            ✕
          </button>
        </div>

        {/* Slide Title */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{ fontSize: '2rem', marginBottom: '6px' }}>{slide.icon}</div>
          <h2 className="font-cinzel" style={{ fontSize: '1.4rem', color: '#f8fafc', marginBottom: '4px' }}>
            {slide.title}
          </h2>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
            "{slide.subtitle}"
          </div>
        </div>

        {/* Bullet Points */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '22px', background: 'rgba(0, 0, 0, 0.3)', padding: '18px', borderRadius: '8px' }}>
          {slide.points.map((pt, idx) => (
            <div key={idx} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', fontSize: '0.88rem', color: '#e2e8f0', lineHeight: '1.5' }}>
              <span style={{ color: slide.color, marginTop: '2px' }}>✦</span>
              <span>{pt}</span>
            </div>
          ))}

          <div style={{ marginTop: '6px', padding: '8px 12px', background: 'rgba(255, 255, 255, 0.04)', borderRadius: '6px', fontSize: '0.78rem', color: slide.color, fontStyle: 'italic' }}>
            {slide.tip}
          </div>
        </div>

        {/* Navigation & Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '6px' }}>
            {slides.map((_, i) => (
              <div
                key={i}
                onClick={() => setCurrentSlide(i)}
                style={{
                  width: i === currentSlide ? 24 : 8,
                  height: 8,
                  borderRadius: 4,
                  background: i === currentSlide ? slide.color : 'rgba(255, 255, 255, 0.2)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
              />
            ))}
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            {currentSlide > 0 && (
              <button
                onClick={() => setCurrentSlide(prev => prev - 1)}
                className="btn-surreal"
                style={{ padding: '8px 16px', fontSize: '0.82rem' }}
              >
                PREVIOUS
              </button>
            )}

            {currentSlide < slides.length - 1 ? (
              <button
                onClick={() => setCurrentSlide(prev => prev + 1)}
                className="btn-surreal btn-cyan"
                style={{ padding: '8px 18px', fontSize: '0.82rem' }}
              >
                NEXT RULE →
              </button>
            ) : (
              <button
                onClick={onClose}
                className="btn-surreal btn-cyan"
                style={{ padding: '8px 22px', fontSize: '0.85rem' }}
              >
                ENTER THE REVERIE ✦
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
