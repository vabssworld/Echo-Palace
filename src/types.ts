// Reverie: The House That Remembers
// Core Type Definitions

export type GravityDirection = 'DOWN' | 'UP' | 'LEFT' | 'RIGHT';

export type ActiveCharacter = 'PLAYER' | 'REFLECTION';

export interface Vector2D {
  x: number;
  y: number;
}

export interface AABB {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type TileType = 
  | 'EMPTY'
  | 'WALL'
  | 'FLOOR'
  | 'MIRROR_SURFACE'
  | 'VOID_HAZARD'
  | 'DREAM_GLASS'
  | 'ONE_WAY_PLATFORM';

export interface TileData {
  x: number;
  y: number;
  width: number;
  height: number;
  type: TileType;
  color?: string;
}

export type EntityType = 
  | 'PLAYER'
  | 'REFLECTION'
  | 'GRAVITY_SWITCH'
  | 'PRESSURE_PLATE'
  | 'DOOR'
  | 'KEY'
  | 'QUANTUM_BOX'
  | 'QUANTUM_BRIDGE'
  | 'PUSHABLE_BLOCK'
  | 'FRAGILE_MIRROR'
  | 'RUNE_PILLAR'
  | 'LORE_NOTE'
  | 'EXIT_PORTAL'
  | 'MEMORY_SHARD';

export interface BaseEntityData {
  id: string;
  type: EntityType;
  x: number;
  y: number;
  width: number;
  height: number;
  properties?: Record<string, any>;
}

export interface GameEvent {
  id: string;
  levelId: number;
  roomId: string;
  action: string;
  objectId: string;
  character: ActiveCharacter;
  description: string;
  timestamp: number;
  stateDiff?: Record<string, any>;
}

export interface PuzzleDefinition {
  id: string;
  title: string;
  description: string;
  isSolved: boolean;
  checkSolved: (state: any) => boolean;
  onSolve?: (state: any) => void;
}

export interface LoreNoteData {
  id: string;
  x: number;
  y: number;
  title: string;
  text: string[];
}

export interface LevelData {
  id: number;
  name: string;
  subtitle: string;
  storyIntro: string[];
  objective: string;
  width: number;
  height: number;
  initialGravity: GravityDirection;
  mirrorGravity?: GravityDirection; // If reflection is on inverted gravity!
  allowReflection: boolean;
  spawnPlayer: Vector2D;
  spawnReflection?: Vector2D;
  tiles: TileData[];
  entities: BaseEntityData[];
  hints: [string, string, string]; // Subtle, Strong, Direct
  loreNotes: LoreNoteData[];
}

export interface SaveGameData {
  version: number;
  currentLevel: number;
  completedLevels: number[];
  unlockedLevels: number[];
  events: GameEvent[];
  solvedPuzzles: string[];
  collectedNotes: string[];
  endingsUnlocked: string[];
  timestamp: number;
}
