// Puzzle Logic & Solvers Engine
import { MemorySystem } from '../engine/MemorySystem';
import { SoundEngine } from '../engine/SoundEngine';
import { ActiveCharacter, GameEvent } from '../types';
import { EntityState } from './Entities';

export interface PuzzleContext {
  levelId: number;
  player: EntityState;
  reflection: EntityState | null;
  activeChar: ActiveCharacter;
  entities: EntityState[];
  onSolvePuzzle: (puzzleId: string, title: string) => void;
  onOpenDoor: (doorId: string) => void;
}

export class PuzzleEngine {
  private solvedPuzzles: Set<string> = new Set();
  
  // Level 5 Chimes State
  private playerRuneSequence: number[] = [];
  private reflectionRuneSequence: number[] = [];

  resetLevelState(): void {
    this.playerRuneSequence = [];
    this.reflectionRuneSequence = [];
  }

  isSolved(puzzleId: string): boolean {
    return this.solvedPuzzles.has(puzzleId);
  }

  markSolved(puzzleId: string, title: string, ctx: PuzzleContext): void {
    if (this.solvedPuzzles.has(puzzleId)) return;
    this.solvedPuzzles.add(puzzleId);
    SoundEngine.playPuzzleSolved();
    ctx.onSolvePuzzle(puzzleId, title);
  }

  update(ctx: PuzzleContext): void {
    // -----------------------------------------------------------------------
    // Level 1 Puzzles
    // -----------------------------------------------------------------------
    if (ctx.levelId === 1) {
      // Puzzle 1: First Inversion & Key Grab
      const key = ctx.entities.find(e => e.id === 'key_bedroom');
      if (key && key.properties.isCollected && !this.isSolved('l1_p1_inversion')) {
        this.markSolved('l1_p1_inversion', 'The Inverted Key', ctx);
        MemorySystem.recordEvent({
          levelId: 1,
          roomId: 'bedroom',
          action: 'COLLECT_KEY',
          objectId: 'key_bedroom',
          character: ctx.activeChar,
          description: 'Collected the Silver Key from the inverted ceiling desk.',
        });
        ctx.onOpenDoor('door_bedroom_exit');
      }
    }

    // -----------------------------------------------------------------------
    // Level 2 Puzzles
    // -----------------------------------------------------------------------
    if (ctx.levelId === 2) {
      // Puzzle 3: Dual Pressure Plates Synchronized Vault
      const leftPlate = ctx.entities.find(e => e.id === 'plate_mirror_left');
      const rightPlate = ctx.entities.find(e => e.id === 'plate_mirror_right');
      const vaultDoor = ctx.entities.find(e => e.id === 'door_mirror_vault');

      if (leftPlate && rightPlate && vaultDoor) {
        const isLeftPressed = !!leftPlate.properties.isPressed;
        const isRightPressed = !!rightPlate.properties.isPressed;

        if (isLeftPressed && isRightPressed && !vaultDoor.properties.isOpen) {
          vaultDoor.properties.isOpen = true;
          vaultDoor.isSolid = false;
          SoundEngine.playDoorOpen();
          this.markSolved('l2_p3_sync_plates', 'Dual Sigil Synchronization', ctx);
          MemorySystem.recordEvent({
            levelId: 2,
            roomId: 'mirror_hall',
            action: 'SYNC_PLATES',
            objectId: 'door_mirror_vault',
            character: ctx.activeChar,
            description: 'Player and Reflection simultaneously depressed the dual mirror sigils.',
          });
        }
      }

      // Puzzle 4: Shatter Fragile Mirror
      const mirror = ctx.entities.find(e => e.id === 'fragile_mirror_barrier');
      if (mirror && mirror.properties.isBroken && !this.isSolved('l2_p4_shatter_mirror')) {
        this.markSolved('l2_p4_shatter_mirror', 'Shattered Boundary', ctx);
      }
    }

    // -----------------------------------------------------------------------
    // Level 3 Puzzles
    // -----------------------------------------------------------------------
    if (ctx.levelId === 3) {
      // Puzzle 5: Move Celestial Pedestal to Moonbeam Socket
      const pedestal = ctx.entities.find(e => e.id === 'celestial_pedestal');
      const socket = ctx.entities.find(e => e.id === 'moonbeam_socket');
      const moonGate = ctx.entities.find(e => e.id === 'moonbeam_gate');

      if (pedestal && socket && moonGate) {
        const dist = Math.abs(pedestal.x - socket.x);
        if (dist < 28 && !this.isSolved('l3_p5_celestial_pedestal')) {
          pedestal.x = socket.x; // Lock into place
          moonGate.properties.isOpen = true;
          moonGate.isSolid = false;
          SoundEngine.playDoorOpen();
          this.markSolved('l3_p5_celestial_pedestal', 'The Refracted Moonlight', ctx);
          MemorySystem.recordEvent({
            levelId: 3,
            roomId: 'chrono_library',
            action: 'MOVE_PEDESTAL',
            objectId: 'celestial_pedestal',
            character: ctx.activeChar,
            description: 'Pushed the Celestial Pedestal onto the moonbeam rune, refracting light.',
            stateDiff: { pedestalLocked: true, gateOpen: true },
          });
        }
      }
    }

    // -----------------------------------------------------------------------
    // Level 4 Puzzles
    // -----------------------------------------------------------------------
    if (ctx.levelId === 4) {
      // Puzzle 7: Quantum Monolith Unobserved Shrink
      const monolith = ctx.entities.find(e => e.id === 'quantum_monolith_arch');
      if (monolith && !monolith.properties.isObserved && !this.isSolved('l4_p7_quantum_shrink')) {
        // Player slipped past while unobserved
        if (ctx.player.x > 320) {
          this.markSolved('l4_p7_quantum_shrink', 'The Blind Spot Paradox', ctx);
          MemorySystem.recordEvent({
            levelId: 4,
            roomId: 'escher_rotunda',
            action: 'QUANTUM_OBSERVE',
            objectId: 'quantum_monolith_arch',
            character: ctx.activeChar,
            description: 'Turned gaze away to shrink the quantum monolith and bypass the archway.',
          });
        }
      }
    }

    // -----------------------------------------------------------------------
    // Level 5 Puzzles: Runic Chimes Pattern Communication
    // -----------------------------------------------------------------------
    if (ctx.levelId === 5) {
      // Player must input 0, 1, 2, 3
      // Reflection must input 3, 2, 1, 0
      const riftGate = ctx.entities.find(e => e.id === 'reflection_rift_gate');
      if (
        this.playerRuneSequence.length >= 4 &&
        this.reflectionRuneSequence.length >= 4 &&
        !this.isSolved('l5_p9_reverse_chimes') &&
        riftGate
      ) {
        const isPlayerCorrect = this.playerRuneSequence.slice(-4).join('') === '0123';
        const isReflectionCorrect = this.reflectionRuneSequence.slice(-4).join('') === '3210';

        if (isPlayerCorrect && isReflectionCorrect) {
          riftGate.properties.isOpen = true;
          riftGate.isSolid = false;
          SoundEngine.playDoorOpen();
          this.markSolved('l5_p9_reverse_chimes', 'Harmonic Counterpoint', ctx);
          MemorySystem.recordEvent({
            levelId: 5,
            roomId: 'inverted_realm',
            action: 'HARMONIZE_CHIMES',
            objectId: 'reflection_rift_gate',
            character: ctx.activeChar,
            description: 'Played forward chime sequence as Player and reverse sequence as Reflection.',
          });
        }
      }
    }

    // -----------------------------------------------------------------------
    // Level 6 Puzzles: Grand Combination Finale
    // -----------------------------------------------------------------------
    if (ctx.levelId === 6) {
      // Puzzle 10: Quantum Gaze Bridge Crossing
      const bridge = ctx.entities.find(e => e.id === 'quantum_bridge_chasm');
      if (bridge && bridge.properties.isObserved && !this.isSolved('l6_p11_gaze_bridge')) {
        if (ctx.player.x > 740 && ctx.reflection && ctx.reflection.x < 360) {
          this.markSolved('l6_p11_gaze_bridge', 'The Quantum Anchored Bridge', ctx);
          MemorySystem.recordEvent({
            levelId: 6,
            roomId: 'chronos_core',
            action: 'QUANTUM_ANCHOR',
            objectId: 'quantum_bridge_chasm',
            character: 'REFLECTION',
            description: 'Reflection held eye gaze on the quantum bridge while Player crossed the chasm.',
          });
        }
      }

      // Puzzle 11: Dual Apex Core Nexus
      const playerPlate = ctx.entities.find(e => e.id === 'plate_core_player');
      const refPlate = ctx.entities.find(e => e.id === 'plate_core_reflection');
      const coreGate = ctx.entities.find(e => e.id === 'core_revelation_gate');

      if (playerPlate && refPlate && coreGate) {
        if (playerPlate.properties.isPressed && refPlate.properties.isPressed && !coreGate.properties.isOpen) {
          coreGate.properties.isOpen = true;
          coreGate.isSolid = false;
          SoundEngine.playDoorOpen();
          this.markSolved('l6_p10_core_revelation', 'The Unified Paradox', ctx);
          MemorySystem.recordEvent({
            levelId: 6,
            roomId: 'chronos_core',
            action: 'CORE_SYNCHRONY',
            objectId: 'final_core_portal',
            character: ctx.activeChar,
            description: 'Both selves stood on the Apex Core Nexus, opening the final awakening rift.',
          });
        }
      }
    }
  }

  // Handle rune activation for pattern communication
  triggerRune(runeIndex: number, character: ActiveCharacter, isInverted: boolean): void {
    SoundEngine.playRuneTone(runeIndex);

    if (character === 'PLAYER' && !isInverted) {
      this.playerRuneSequence.push(runeIndex);
      if (this.playerRuneSequence.length > 8) this.playerRuneSequence.shift();
    } else if (character === 'REFLECTION' && isInverted) {
      this.reflectionRuneSequence.push(runeIndex);
      if (this.reflectionRuneSequence.length > 8) this.reflectionRuneSequence.shift();
    }
  }

  getPlayerChimeSequence(): number[] {
    return [...this.playerRuneSequence];
  }

  getReflectionChimeSequence(): number[] {
    return [...this.reflectionRuneSequence];
  }
}

const globalObj = typeof globalThis !== 'undefined' ? globalThis : (typeof window !== 'undefined' ? window : global);
if (!(globalObj as any).__REVERIE_PUZZLES__) {
  (globalObj as any).__REVERIE_PUZZLES__ = new PuzzleEngine();
}
export const Puzzles: PuzzleEngine = (globalObj as any).__REVERIE_PUZZLES__;
