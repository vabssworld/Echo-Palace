// Master Application Component for Reverie
import React, { useEffect, useMemo, useState } from 'react';
import { CreditsModal } from './components/CreditsModal';
import { EndingModal } from './components/EndingModal';
import { GameCanvas } from './components/GameCanvas';
import { HintModal } from './components/HintModal';
import { HowToPlayModal } from './components/HowToPlayModal';
import { HUD } from './components/HUD';
import { LoreModal } from './components/LoreModal';
import { MainMenu } from './components/MainMenu';
import { MemoryLogModal } from './components/MemoryLogModal';
import { MobileControls } from './components/MobileControls';
import { PauseModal } from './components/PauseModal';
import { TutorialModal } from './components/TutorialModal';
import { SoundEngine } from './engine/SoundEngine';
import { GameEngine } from './game/GameEngine';
import { LEVELS } from './game/Levels';
import { ActiveCharacter, GravityDirection, LoreNoteData } from './types';
import { StorageManager } from './utils/Storage';

export const App: React.FC = () => {
  const [gameState, setGameState] = useState<'MENU' | 'PLAYING' | 'ENDING'>('MENU');
  const [hasSave, setHasSave] = useState(StorageManager.hasSave());

  // HUD State
  const [hudData, setHudData] = useState({
    levelId: 1,
    levelName: 'The Awakening',
    levelSubtitle: 'The Impossible Bedroom',
    objective: 'Explore dream physics and find the exit.',
    activeChar: 'PLAYER' as ActiveCharacter,
    playerGravity: 'DOWN' as GravityDirection,
    reflectionGravity: 'DOWN' as GravityDirection,
    canSwitch: false,
    mirrorSyncMode: false,
    activeHint: null as string | null,
  });

  // Notification Toast
  const [notification, setNotification] = useState<string | null>(null);

  // Modals
  const [showPause, setShowPause] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [showMemoryLog, setShowMemoryLog] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showCredits, setShowCredits] = useState(false);
  const [activeLoreNote, setActiveLoreNote] = useState<LoreNoteData | null>(null);
  const [endingType, setEndingType] = useState<'TRANSCENDENCE' | 'CUSTODIAN' | 'LIBERATION' | null>(null);

  const [completedLevels, setCompletedLevels] = useState<number[]>([]);

  // Initialize GameEngine singleton
  const engine = useMemo(() => {
    return new GameEngine({
      onHUDUpdate: (data) => {
        setHudData(data);
      },
      onLoreOpen: (note) => {
        setActiveLoreNote(note);
      },
      onLevelComplete: (completedLvlId) => {
        setCompletedLevels(prev => {
          const next = Array.from(new Set([...prev, completedLvlId]));
          StorageManager.saveProgress(completedLvlId + 1, next);
          return next;
        });
      },
      onGameEnding: (type) => {
        setEndingType(type);
        setGameState('ENDING');
      },
      onNotification: (text) => {
        setNotification(text);
      },
    });
  }, []);

  // Notification timeout
  useEffect(() => {
    if (!notification) return;
    const t = setTimeout(() => {
      setNotification(null);
    }, 3500);
    return () => clearTimeout(t);
  }, [notification]);

  // Global ESC key listener for Pause
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Escape' && gameState === 'PLAYING') {
        setShowPause(prev => !prev);
      }
      if (e.code === 'KeyM' && gameState === 'PLAYING') {
        setShowMemoryLog(prev => !prev);
      }
      if (e.code === 'KeyT' && gameState === 'PLAYING') {
        setShowTutorial(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState]);

  // Audio start on first gesture
  const startAudio = () => {
    SoundEngine.init();
    SoundEngine.ensureContext();
  };

  const handleNewGame = () => {
    startAudio();
    StorageManager.clearProgress();
    setCompletedLevels([]);
    setHasSave(false);
    setGameState('PLAYING');
    engine.startLevel(1);
    StorageManager.saveProgress(1, []);
    setShowTutorial(true); // Launch short 3-rule tutorial on New Game!
  };

  const handleSelectLevel = (levelId: number) => {
    startAudio();
    setGameState('PLAYING');
    engine.startLevel(levelId);
  };

  const handleContinue = () => {
    startAudio();
    const save = StorageManager.loadProgress();
    const startLvl = save?.currentLevel || 1;
    setCompletedLevels(save?.completedLevels || []);
    setGameState('PLAYING');
    engine.startLevel(startLvl);
  };

  const handleRestartLevel = () => {
    setShowPause(false);
    engine.restartLevel();
  };

  const handleReturnToTitle = () => {
    engine.stop();
    setShowPause(false);
    setGameState('MENU');
    setHasSave(StorageManager.hasSave());
  };

  const handleResetSave = () => {
    StorageManager.clearProgress();
    setHasSave(false);
    setCompletedLevels([]);
    setShowPause(false);
    setGameState('MENU');
  };

  const currentLevelHints = LEVELS.find(l => l.id === hudData.levelId)?.hints || [
    'Observe the surreal architecture carefully.',
    'Objects and gravity respond to your perspective.',
    'Interact with the environment to clear your path.',
  ];

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
      {gameState === 'MENU' && (
        <MainMenu
          hasSave={hasSave}
          onNewGame={handleNewGame}
          onContinue={handleContinue}
          onOpenHowToPlay={() => setShowHowToPlay(true)}
          onOpenMemoryLog={() => setShowMemoryLog(true)}
          onOpenSettings={() => setShowPause(true)}
          onOpenCredits={() => setShowCredits(true)}
        />
      )}

      {gameState === 'PLAYING' && (
        <>
          <HUD
            levelId={hudData.levelId}
            levelName={hudData.levelName}
            levelSubtitle={hudData.levelSubtitle}
            objective={hudData.objective}
            activeChar={hudData.activeChar}
            playerGravity={hudData.playerGravity}
            reflectionGravity={hudData.reflectionGravity}
            canSwitch={hudData.canSwitch}
            mirrorSyncMode={hudData.mirrorSyncMode}
            activeHint={hudData.activeHint}
            notification={notification}
            onToggleSwitch={() => engine.toggleActiveCharacter()}
            onToggleMirrorSync={() => engine.toggleMirrorSync()}
            onOpenTutorial={() => setShowTutorial(true)}
            onOpenHint={() => setShowHint(true)}
            onOpenMemoryLog={() => setShowMemoryLog(true)}
            onRestartRoom={() => engine.restartLevel()}
            onOpenPause={() => setShowPause(true)}
          />

          <GameCanvas engine={engine} />

          <MobileControls
            canSwitch={hudData.canSwitch}
            onDirectionChange={(mx, my) => engine.setTouchInput(mx, my, false)}
            onJumpStart={() => engine.setTouchInput(0, 0, true)}
            onJumpEnd={() => engine.setTouchInput(0, 0, false)}
            onInteract={() => engine.performInteraction()}
            onSwitch={() => engine.toggleActiveCharacter()}
            onToggleSync={() => engine.toggleMirrorSync()}
          />
        </>
      )}

      {/* Modals */}
      <PauseModal
        isOpen={showPause}
        onResume={() => setShowPause(false)}
        onRestartLevel={handleRestartLevel}
        onSelectLevel={handleSelectLevel}
        onOpenTutorial={() => {
          setShowPause(false);
          setShowTutorial(true);
        }}
        onReturnToTitle={handleReturnToTitle}
        onResetSave={handleResetSave}
      />

      <TutorialModal
        isOpen={showTutorial}
        onClose={() => setShowTutorial(false)}
      />

      <HowToPlayModal
        isOpen={showHowToPlay}
        onClose={() => setShowHowToPlay(false)}
      />

      <MemoryLogModal
        isOpen={showMemoryLog}
        onClose={() => setShowMemoryLog(false)}
      />

      <HintModal
        isOpen={showHint}
        hints={currentLevelHints}
        currentTier={1}
        onRevealNextTier={() => engine.showNextHint()}
        onClose={() => setShowHint(false)}
      />

      <LoreModal
        note={activeLoreNote}
        onClose={() => setActiveLoreNote(null)}
      />

      <EndingModal
        endingType={endingType}
        onRestart={() => {
          setEndingType(null);
          handleNewGame();
        }}
        onReturnTitle={() => {
          setEndingType(null);
          setGameState('MENU');
        }}
      />

      <CreditsModal
        isOpen={showCredits}
        onClose={() => setShowCredits(false)}
      />
    </div>
  );
};
