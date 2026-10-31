// Master Game Engine Coordinator for Reverie
import { FOVSystem, Observer } from '../engine/FOV';
import { MemorySystem } from '../engine/MemorySystem';
import { Physics } from '../engine/Physics';
import { SoundEngine } from '../engine/SoundEngine';
import { ActiveCharacter, GravityDirection, LevelData, LoreNoteData, TileData, Vector2D } from '../types';
import { EntityManager, EntityState } from './Entities';
import { LEVELS } from './Levels';
import { Puzzles } from './Puzzles';
import { GameRenderer } from './Renderer';

export interface GameEngineCallbacks {
  onHUDUpdate: (data: {
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
  }) => void;
  onLoreOpen: (note: LoreNoteData) => void;
  onLevelComplete: (levelId: number) => void;
  onGameEnding: (endingType: 'TRANSCENDENCE' | 'CUSTODIAN' | 'LIBERATION') => void;
  onNotification: (text: string) => void;
}

export class GameEngine {
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private renderer: GameRenderer;
  private callbacks: GameEngineCallbacks;

  private isRunning: boolean = false;
  private animFrameId: number | null = null;
  private lastTime: number = 0;

  // Level & Entity State
  private currentLevelIndex: number = 0;
  private currentLevelData: LevelData = LEVELS[0];
  private tiles: TileData[] = [];
  private entities: EntityState[] = [];
  private player: EntityState;
  private reflection: EntityState | null = null;
  private activeCharacter: ActiveCharacter = 'PLAYER';

  // Mirror Synchrony Mode (Opposite Movement)
  private mirrorSyncMode: boolean = false;

  // Input State
  private keysDown: Set<string> = new Set();
  private touchInput: { moveX: number; moveY: number; jump: boolean } = { moveX: 0, moveY: 0, jump: false };

  // Gravity switch touch debounce timer
  private gravitySwitchCooldown: number = 0;

  // Hint tracking
  private currentHintTier: number = 0;

  constructor(callbacks: GameEngineCallbacks) {
    this.callbacks = callbacks;
    this.renderer = new GameRenderer();
    this.player = EntityManager.createPlayer(100, 480, 'DOWN');
  }

  attachCanvas(canvas: HTMLCanvasElement): void {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
  }

  destroy(): void {
    this.stop();
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
  }

  private handleKeyDown = (e: KeyboardEvent): void => {
    this.keysDown.add(e.code);

    // TAB: Switch Active Character
    if (e.code === 'Tab') {
      e.preventDefault();
      this.toggleActiveCharacter();
    }

    // C: Toggle Mirror Synchrony (Opposite movement)
    if (e.code === 'KeyC') {
      this.toggleMirrorSync();
    }

    // E: Interact
    if (e.code === 'KeyE') {
      this.performInteraction();
    }

    // R: Restart Level
    if (e.code === 'KeyR' && !e.ctrlKey) {
      this.restartLevel();
    }
  };

  private handleKeyUp = (e: KeyboardEvent): void => {
    this.keysDown.delete(e.code);
  };

  toggleMirrorSync(): void {
    if (!this.reflection) return;
    this.mirrorSyncMode = !this.mirrorSyncMode;
    SoundEngine.playWhisper();
    const status = this.mirrorSyncMode ? 'ACTIVE (Opposite Movement)' : 'INDEPENDENT';
    this.callbacks.onNotification(`Mirror Synchrony: ${status}`);
    this.notifyHUD();
  }

  startLevel(levelId: number): void {
    const found = LEVELS.find(l => l.id === levelId);
    if (!found) return;

    this.currentLevelData = found;
    this.currentLevelIndex = LEVELS.indexOf(found);
    this.currentHintTier = 0;
    this.gravitySwitchCooldown = 0;
    // Mirror sync defaults to true in Level 2 (introduction) and Level 5
    this.mirrorSyncMode = found.id === 2 || found.id === 5;
    Puzzles.resetLevelState();

    // Deep clone tiles
    this.tiles = found.tiles.map(t => ({ ...t }));

    // Spawn entities
    this.entities = found.entities.map(e => ({
      ...e,
      vx: 0,
      vy: 0,
      isGrounded: false,
      gravityDirection: found.initialGravity,
      facing: { x: 0, y: 0 },
      isSolid: e.type === 'DOOR' ? !e.properties?.isOpen : e.type !== 'GRAVITY_SWITCH' && e.type !== 'PRESSURE_PLATE' && e.type !== 'EXIT_PORTAL' && e.type !== 'LORE_NOTE' && e.type !== 'RUNE_PILLAR',
      properties: { ...e.properties },
    }));

    // Player spawn
    this.player = EntityManager.createPlayer(
      found.spawnPlayer.x,
      found.spawnPlayer.y,
      found.initialGravity
    );
    this.activeCharacter = 'PLAYER';

    // Trigger cinematic room banner transition
    this.renderer.triggerRoomTransition(found.name, found.subtitle);

    // Reflection spawn (if level allows)
    if (found.allowReflection && found.spawnReflection) {
      const refGrav = found.mirrorGravity || found.initialGravity;
      this.reflection = EntityManager.createReflection(
        found.spawnReflection.x,
        found.spawnReflection.y,
        refGrav
      );
    } else {
      this.reflection = null;
    }

    // Apply Memory System Persistent Consequences
    const memoryImpact = MemorySystem.applyPersistentStateToLevel(
      found.id,
      this.entities,
      this.tiles
    );

    if (memoryImpact.appliedCount > 0) {
      this.callbacks.onNotification(memoryImpact.descriptions[0] || 'The house remembers your past actions.');
    }

    this.notifyHUD();
    this.start();
  }

  start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTime = performance.now();
    if (typeof requestAnimationFrame !== 'undefined') {
      this.loop(this.lastTime);
    }
  }

  stop(): void {
    this.isRunning = false;
    if (this.animFrameId !== null) {
      if (typeof cancelAnimationFrame !== 'undefined') {
        cancelAnimationFrame(this.animFrameId);
      }
      this.animFrameId = null;
    }
  }

  getMemorySystem(): typeof MemorySystem {
    return MemorySystem;
  }

  restartLevel(): void {
    this.callbacks.onNotification('Restarting current room...');
    this.startLevel(this.currentLevelData.id);
  }

  toggleActiveCharacter(): void {
    if (!this.reflection) return;

    this.activeCharacter = this.activeCharacter === 'PLAYER' ? 'REFLECTION' : 'PLAYER';
    SoundEngine.playSwitchCharacter(this.activeCharacter === 'REFLECTION');
    this.renderer.triggerShake(3, 0.15);

    const charName = this.activeCharacter === 'PLAYER' ? 'Real Self' : 'Mirror Reflection';
    this.callbacks.onNotification(`Shifted consciousness to: ${charName}`);
    this.notifyHUD();
  }

  setActiveCharacter(char: ActiveCharacter): void {
    if (char === 'REFLECTION' && !this.reflection) return;
    if (this.activeCharacter !== char) {
      this.toggleActiveCharacter();
    }
  }

  setTouchInput(moveX: number, moveY: number, jump: boolean): void {
    this.touchInput = { moveX, moveY, jump };
  }

  showNextHint(): void {
    this.currentHintTier = Math.min(3, this.currentHintTier + 1);
    this.notifyHUD();
  }

  private notifyHUD(): void {
    const hint =
      this.currentHintTier > 0
        ? this.currentLevelData.hints[this.currentHintTier - 1]
        : null;

    this.callbacks.onHUDUpdate({
      levelId: this.currentLevelData.id,
      levelName: this.currentLevelData.name,
      levelSubtitle: this.currentLevelData.subtitle,
      objective: this.currentLevelData.objective,
      activeChar: this.activeCharacter,
      playerGravity: this.player.gravityDirection,
      reflectionGravity: this.reflection ? this.reflection.gravityDirection : this.player.gravityDirection,
      canSwitch: !!this.reflection,
      mirrorSyncMode: this.mirrorSyncMode,
      activeHint: hint,
    });
  }

  private loop = (time: number): void => {
    if (!this.isRunning) return;
    const dt = Math.min((time - this.lastTime) / 1000, 0.05);
    this.lastTime = time;

    this.update(dt);
    this.render(dt);

    this.animFrameId = requestAnimationFrame(this.loop);
  };

  private update(dt: number): void {
    if (this.gravitySwitchCooldown > 0) {
      this.gravitySwitchCooldown -= dt;
    }

    // 1. Gather Directional Inputs
    let moveX = 0;
    let moveY = 0;
    if (this.keysDown.has('KeyA') || this.keysDown.has('ArrowLeft')) moveX -= 1;
    if (this.keysDown.has('KeyD') || this.keysDown.has('ArrowRight')) moveX += 1;
    if (this.keysDown.has('KeyW') || this.keysDown.has('ArrowUp')) moveY -= 1;
    if (this.keysDown.has('KeyS') || this.keysDown.has('ArrowDown')) moveY += 1;

    if (this.touchInput.moveX !== 0) moveX = this.touchInput.moveX;
    if (this.touchInput.moveY !== 0) moveY = this.touchInput.moveY;

    // Jump detection: Space, Touch, or Directional jump relative to gravity
    const activeGrav = this.activeCharacter === 'PLAYER' ? this.player.gravityDirection : (this.reflection?.gravityDirection ?? 'DOWN');
    let jump = this.keysDown.has('Space') || this.touchInput.jump;
    if (activeGrav === 'DOWN' && (this.keysDown.has('KeyW') || this.keysDown.has('ArrowUp'))) jump = true;
    if (activeGrav === 'UP' && (this.keysDown.has('KeyS') || this.keysDown.has('ArrowDown'))) jump = true;
    if (activeGrav === 'LEFT' && (this.keysDown.has('KeyD') || this.keysDown.has('ArrowRight'))) jump = true;
    if (activeGrav === 'RIGHT' && (this.keysDown.has('KeyA') || this.keysDown.has('ArrowLeft'))) jump = true;

    // 2. Build Solid Obstacles List
    const tileObstacles = this.tiles.filter(t => t.type !== 'EMPTY' && t.type !== 'VOID_HAZARD');
    const entityObstacles = this.entities.filter(e => e.isSolid);
    const allObstacles = [...tileObstacles, ...entityObstacles];

    // 3. Update Active Character and Mirror Reflection
    if (this.activeCharacter === 'PLAYER') {
      Physics.updateBody(this.player, { moveX, moveY, jump }, allObstacles, dt);
      if (moveX !== 0 || moveY !== 0) {
        this.player.facing = {
          x: moveX !== 0 ? Math.sign(moveX) : this.player.facing.x,
          y: moveY !== 0 ? Math.sign(moveY) : this.player.facing.y,
        };
      }

      if (this.reflection) {
        if (this.mirrorSyncMode) {
          // Mirror synchrony: Opposite horizontal movement!
          const refMoveX = -moveX;
          Physics.updateBody(this.reflection, { moveX: refMoveX, moveY, jump }, allObstacles, dt);
          if (refMoveX !== 0) {
            this.reflection.facing = { x: Math.sign(refMoveX), y: this.reflection.facing.y };
          }
        } else {
          // Inactive reflection rests physically
          Physics.updateBody(this.reflection, { moveX: 0, moveY: 0, jump: false }, allObstacles, dt);

          // Autonomous Reflection guidance in Level 2: walks to mirror once plates are pressed
          if (this.currentLevelData.id === 2) {
            const vaultDoor = this.entities.find(e => e.id === 'door_mirror_vault');
            const mirror = this.entities.find(e => e.id === 'fragile_mirror_barrier');
            if (vaultDoor?.properties.isOpen && mirror && !mirror.properties.isBroken) {
              if (this.reflection.x > 505) {
                this.reflection.x -= 70 * dt;
                this.reflection.facing = { x: -1, y: 0 };
              }
            }
          }
        }
      }
    } else if (this.reflection) {
      // Direct independent control of reflection
      Physics.updateBody(this.reflection, { moveX, moveY, jump }, allObstacles, dt);
      if (moveX !== 0 || moveY !== 0) {
        this.reflection.facing = {
          x: moveX !== 0 ? Math.sign(moveX) : this.reflection.facing.x,
          y: moveY !== 0 ? Math.sign(moveY) : this.reflection.facing.y,
        };
      }

      // Real player rests physically
      Physics.updateBody(this.player, { moveX: 0, moveY: 0, jump: false }, allObstacles, dt);
    }

    // 4. Update Pushable Blocks with Cooperative Wall Collision Handling
    for (const ent of this.entities) {
      if (ent.type === 'PUSHABLE_BLOCK') {
        Physics.updateBody(ent as any, { moveX: 0, moveY: 0, jump: false }, tileObstacles, dt);

        const activeEnt = this.activeCharacter === 'PLAYER' ? this.player : this.reflection;
        if (activeEnt && Physics.checkAABBOverlap(activeEnt, ent)) {
          let pushSpeed = 120;
          // Dual cooperation speed boost if both characters are assisting
          if (this.reflection && Math.hypot(this.reflection.x - ent.x, this.reflection.y - ent.y) < 85) {
            pushSpeed = 210;
          }

          const pushDelta = (activeEnt.vx > 0 ? pushSpeed : -pushSpeed) * dt;
          const oldX = ent.x;
          ent.x += pushDelta;

          // Check if block hits wall; revert if so
          for (const tile of tileObstacles) {
            if (Physics.checkAABBOverlap(ent, tile)) {
              ent.x = oldX;
              break;
            }
          }
        }
      }
    }

    // 5. Update Quantum Observation Transformations
    this.updateQuantumObservation(tileObstacles);

    // 6. Update Pressure Plates (with contact tolerance)
    this.updatePressurePlates();

    // 7. Check Void Hazards
    this.checkVoidHazards();

    // 8. Auto-detect Gravity Switches (Touch/Step trigger) & Keys & Portals
    this.checkEntityCollisions();

    // 9. Update Puzzle Logic
    Puzzles.update({
      levelId: this.currentLevelData.id,
      player: this.player,
      reflection: this.reflection,
      activeChar: this.activeCharacter,
      entities: this.entities,
      onSolvePuzzle: (id, title) => {
        this.renderer.triggerShake(5, 0.4);
        this.callbacks.onNotification(`Puzzle Solved: ${title}`);
      },
      onOpenDoor: (doorId) => {
        const door = this.entities.find(e => e.id === doorId);
        if (door) {
          door.properties.isOpen = true;
          door.isSolid = false;
        }
      },
    });
  }

  private updateQuantumObservation(occluders: TileData[]): void {
    const observers: Observer[] = [];

    // Real player observer
    observers.push({
      x: this.player.x + this.player.width * 0.5,
      y: this.player.y + this.player.height * 0.5,
      facing: this.player.facing,
      fovAngle: Math.PI * 0.75, // 135 degrees
      range: 420,
    });

    // Reflection observer (if present)
    if (this.reflection) {
      observers.push({
        x: this.reflection.x + this.reflection.width * 0.5,
        y: this.reflection.y + this.reflection.height * 0.5,
        facing: this.reflection.facing,
        fovAngle: Math.PI * 0.75,
        range: 420,
      });
    }

    for (const ent of this.entities) {
      if (ent.type === 'QUANTUM_BOX') {
        const wasObserved = !!ent.properties.isObserved;
        const isNowObserved = FOVSystem.isObservedByAny(observers, ent, occluders);

        if (wasObserved !== isNowObserved) {
          const targetW = isNowObserved ? ent.properties.observedWidth : ent.properties.unobservedWidth;
          const targetH = isNowObserved ? ent.properties.observedHeight : ent.properties.unobservedHeight;

          // Prevent expanding if player is inside the target footprint
          if (isNowObserved) {
            const expandedBox = { x: ent.x, y: ent.y, width: targetW, height: targetH };
            if (Physics.checkAABBOverlap(this.player, expandedBox)) {
              continue; // Delay expansion until player exits footprint
            }
          }

          ent.properties.isObserved = isNowObserved;
          SoundEngine.playTransform();
          this.renderer.triggerShake(3, 0.2);

          ent.width = targetW;
          ent.height = targetH;

          const msg = isNowObserved
            ? 'Object crystallized under direct observation.'
            : 'Unobserved: The object shifts its physical scale.';
          this.callbacks.onNotification(msg);
        }
      }
    }
  }

  private updatePressurePlates(): void {
    const colliders = [this.player];
    if (this.reflection) colliders.push(this.reflection);
    const pushables = this.entities.filter(e => e.type === 'PUSHABLE_BLOCK');
    colliders.push(...pushables);

    for (const ent of this.entities) {
      if (ent.type === 'PRESSURE_PLATE') {
        const wasPressed = !!ent.properties.isPressed;
        let isNowPressed = false;

        for (const c of colliders) {
          if (Physics.checkContact(c, ent, 3)) {
            isNowPressed = true;
            break;
          }
        }

        if (wasPressed !== isNowPressed) {
          ent.properties.isPressed = isNowPressed;
          if (isNowPressed) {
            SoundEngine.playPlatePress();
          }

          const targetDoorId = ent.properties.targetDoorId;
          const door = this.entities.find(e => e.id === targetDoorId);
          if (door && !door.properties.requiresSyncPlates) {
            door.properties.isOpen = isNowPressed;
            door.isSolid = !isNowPressed;
            if (isNowPressed) SoundEngine.playDoorOpen();
          }
        }
      }
    }
  }

  private checkVoidHazards(): void {
    const hazards = this.tiles.filter(t => t.type === 'VOID_HAZARD');
    for (const h of hazards) {
      if (Physics.checkAABBOverlap(this.player, h)) {
        SoundEngine.playGravityShift('DOWN');
        this.callbacks.onNotification('Fell into the dream void. Reconstituting...');
        this.player.x = this.currentLevelData.spawnPlayer.x;
        this.player.y = this.currentLevelData.spawnPlayer.y;
        this.player.vx = 0;
        this.player.vy = 0;
      }
      if (this.reflection && Physics.checkAABBOverlap(this.reflection, h)) {
        this.callbacks.onNotification('Reflection fell into the void. Reconstituting...');
        const spawn = this.currentLevelData.spawnReflection || this.currentLevelData.spawnPlayer;
        this.reflection.x = spawn.x;
        this.reflection.y = spawn.y;
        this.reflection.vx = 0;
        this.reflection.vy = 0;
      }
    }
  }

  private checkEntityCollisions(): void {
    const active = this.activeCharacter === 'PLAYER' ? this.player : this.reflection;
    if (!active) return;

    for (const ent of this.entities) {
      // Automatic touch/step trigger on Gravity Switch
      if (ent.type === 'GRAVITY_SWITCH' && this.gravitySwitchCooldown <= 0) {
        if (Physics.checkContact(active, ent, 4)) {
          this.triggerGravitySwitch(ent);
          this.gravitySwitchCooldown = 0.5; // Debounce
        }
      }

      // Collect Key
      if (ent.type === 'KEY' && !ent.properties.isCollected) {
        if (Physics.checkContact(active, ent, 6)) {
          ent.properties.isCollected = true;
          ent.x = -999;
          SoundEngine.playPuzzleSolved();
          this.callbacks.onNotification('Collected Dream Key!');

          const targetDoor = this.entities.find(e => e.id === ent.properties.targetDoorId);
          if (targetDoor) {
            targetDoor.properties.isOpen = true;
            targetDoor.isSolid = false;
            SoundEngine.playDoorOpen();
          }
        }
      }

      // Automatic step trigger on Rune Pillars (Level 5)
      if (ent.type === 'RUNE_PILLAR' && !ent.properties.isLit) {
        if (Physics.checkContact(active, ent, 2)) {
          ent.properties.isLit = true;
          const runeIdx = ent.properties.runeIndex;
          const isInverted = !!ent.properties.isInverted;
          Puzzles.triggerRune(runeIdx, this.activeCharacter, isInverted);
          setTimeout(() => {
            ent.properties.isLit = false;
          }, 600);
          this.callbacks.onNotification(`Resonated Rune: ${ent.properties.symbol}`);
        }
      }

      // Exit Portal
      if (ent.type === 'EXIT_PORTAL') {
        if (Physics.checkContact(this.player, ent, 4)) {
          if (ent.properties.isGameEnding) {
            this.triggerGameEnding();
          } else {
            const nextLvl = ent.properties.targetLevel || this.currentLevelData.id + 1;
            this.callbacks.onLevelComplete(this.currentLevelData.id);
            this.startLevel(nextLvl);
          }
        }
      }
    }
  }

  private triggerGravitySwitch(switchEnt: EntityState): void {
    const active = this.activeCharacter === 'PLAYER' ? this.player : this.reflection;
    if (!active) return;

    const target = switchEnt.properties.targetGravity as GravityDirection | 'CYCLE';
    let newGravity: GravityDirection = 'DOWN';

    if (target === 'CYCLE') {
      const cycleMap: Record<GravityDirection, GravityDirection> = {
        DOWN: 'RIGHT',
        RIGHT: 'UP',
        UP: 'LEFT',
        LEFT: 'DOWN',
      };
      newGravity = cycleMap[active.gravityDirection];
    } else {
      newGravity = target;
    }

    active.gravityDirection = newGravity;
    SoundEngine.playGravityShift(newGravity);
    this.renderer.triggerShake(7, 0.35);

    MemorySystem.recordEvent({
      levelId: this.currentLevelData.id,
      roomId: this.currentLevelData.name,
      action: 'ACTIVATE_GRAVITY_SWITCH',
      objectId: switchEnt.id,
      character: this.activeCharacter,
      description: `Shifted gravity direction to ${newGravity}.`,
    });

    this.callbacks.onNotification(`Gravity rotated to: ${newGravity}`);
    this.notifyHUD();
  }

  performInteraction(): void {
    const active = this.activeCharacter === 'PLAYER' ? this.player : this.reflection;
    if (!active) return;

    let nearest: EntityState | null = null;
    let minDist = 55;

    for (const ent of this.entities) {
      const cx = ent.x + ent.width * 0.5;
      const cy = ent.y + ent.height * 0.5;
      const ax = active.x + active.width * 0.5;
      const ay = active.y + active.height * 0.5;
      const d = Math.hypot(cx - ax, cy - ay);

      if (d < minDist) {
        minDist = d;
        nearest = ent;
      }
    }

    if (!nearest) return;

    switch (nearest.type) {
      case 'GRAVITY_SWITCH': {
        if (nearest.properties.isHatch) {
          MemorySystem.recordEvent({
            levelId: this.currentLevelData.id,
            roomId: this.currentLevelData.name,
            action: 'LEAVE_DOOR_OPEN',
            objectId: nearest.id,
            character: this.activeCharacter,
            description: 'Unlatched the observatory hatch, allowing dream wind to pour into adjacent chambers.',
          });
          this.callbacks.onNotification('Opened observatory hatch. A dream draft pours into the house.');
        }
        this.triggerGravitySwitch(nearest);
        break;
      }

      case 'FRAGILE_MIRROR': {
        if (!nearest.properties.isBroken) {
          nearest.properties.isBroken = true;
          nearest.isSolid = false;
          SoundEngine.playDoorOpen();
          this.renderer.triggerShake(8, 0.4);

          MemorySystem.recordEvent({
            levelId: this.currentLevelData.id,
            roomId: this.currentLevelData.name,
            action: 'BREAK_MIRROR',
            objectId: nearest.id,
            character: this.activeCharacter,
            description: 'Shattered the mirror barrier separating reality from reflection.',
          });

          this.callbacks.onNotification('The mirror shattered. The house will remember this.');
        }
        break;
      }

      case 'RUNE_PILLAR': {
        const runeIdx = nearest.properties.runeIndex;
        const isInverted = !!nearest.properties.isInverted;
        Puzzles.triggerRune(runeIdx, this.activeCharacter, isInverted);
        nearest.properties.isLit = true;
        setTimeout(() => {
          nearest!.properties.isLit = false;
        }, 800);
        this.callbacks.onNotification(`Resonated Rune: ${nearest.properties.symbol}`);
        break;
      }

      case 'LORE_NOTE': {
        SoundEngine.playWhisper();
        const note = this.currentLevelData.loreNotes.find(n => n.id === nearest!.id);
        if (note) {
          this.callbacks.onLoreOpen(note);
        }
        break;
      }
    }
  }

  private triggerGameEnding(): void {
    SoundEngine.playPuzzleSolved();

    const brokeMirror = MemorySystem.hasEvent('BREAK_MIRROR');
    const harmonized = MemorySystem.hasEvent('HARMONIZE_CHIMES');

    if (brokeMirror && harmonized) {
      this.callbacks.onGameEnding('TRANSCENDENCE');
    } else if (harmonized) {
      this.callbacks.onGameEnding('LIBERATION');
    } else {
      this.callbacks.onGameEnding('CUSTODIAN');
    }
  }

  private render(dt: number): void {
    if (!this.ctx || !this.canvas) return;
    this.renderer.render(
      this.ctx,
      this.canvas.width,
      this.canvas.height,
      dt,
      this.tiles,
      this.entities,
      this.player,
      this.reflection,
      this.activeCharacter,
      this.player.gravityDirection,
      this.currentLevelData.id
    );
  }
}
