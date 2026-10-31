// Persistent World State & Game Event Memory System
import { ActiveCharacter, BaseEntityData, GameEvent, TileData } from '../types';
import { SoundEngine } from './SoundEngine';

class MemorySystemClass {
  private events: GameEvent[] = [];
  private listeners: ((event: GameEvent) => void)[] = [];

  recordEvent(params: {
    levelId: number;
    roomId: string;
    action: string;
    objectId: string;
    character: ActiveCharacter;
    description: string;
    stateDiff?: Record<string, any>;
  }): GameEvent {
    // Avoid duplicate triggers for one-time puzzle events
    const existing = this.events.find(
      e => e.action === params.action && e.objectId === params.objectId && e.levelId === params.levelId
    );
    if (existing) {
      return existing;
    }

    const event: GameEvent = {
      id: `evt_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      timestamp: Date.now(),
      ...params,
    };

    this.events.push(event);
    SoundEngine.playMemoryEvent();

    // Notify listeners
    this.listeners.forEach(fn => fn(event));
    return event;
  }

  hasEvent(action: string, objectId?: string): boolean {
    return this.events.some(e => {
      if (e.action !== action) return false;
      if (objectId && e.objectId !== objectId) return false;
      return true;
    });
  }

  getEvents(): GameEvent[] {
    return [...this.events];
  }

  getEventsForLevel(levelId: number): GameEvent[] {
    return this.events.filter(e => e.levelId === levelId);
  }

  addListener(fn: (event: GameEvent) => void): () => void {
    this.listeners.push(fn);
    return () => {
      this.listeners = this.listeners.filter(l => l !== fn);
    };
  }

  loadEvents(savedEvents: GameEvent[]): void {
    this.events = [...savedEvents];
  }

  clear(): void {
    this.events = [];
  }

  /**
   * Applies persistent world state changes to level entities and tiles.
   * This is where past actions physically alter current and future rooms.
   */
  applyPersistentStateToLevel(
    levelId: number,
    entities: BaseEntityData[],
    tiles: TileData[]
  ): { appliedCount: number; descriptions: string[] } {
    let appliedCount = 0;
    const descriptions: string[] = [];

    // 1. Consequence of Breaking the Mirror in Level 2 / 3
    if (this.hasEvent('BREAK_MIRROR')) {
      for (const ent of entities) {
        if (ent.id === 'fragile_mirror_barrier' || ent.properties?.memoryTag === 'broken_mirror_passage') {
          ent.properties = { ...ent.properties, isBroken: true, isSolid: false };
          (ent as any).isSolid = false;
          appliedCount++;
          descriptions.push('The shattered mirror barrier remains broken, allowing passage.');
        }
      }
      for (const tile of tiles) {
        if (tile.color === '#a855f7' && tile.type === 'MIRROR_SURFACE') {
          tile.type = 'EMPTY';
          appliedCount++;
        }
      }
    }

    // 2. Consequence of Moving the Celestial Pedestal in Level 3
    if (this.hasEvent('MOVE_PEDESTAL')) {
      for (const ent of entities) {
        if (ent.id === 'celestial_pedestal' || ent.properties?.memoryTag === 'pedestal_socket') {
          if (ent.id === 'celestial_pedestal') {
            ent.x = ent.properties?.targetX ?? 420;
            ent.y = ent.properties?.targetY ?? 544;
          }
          appliedCount++;
          descriptions.push('The Celestial Pedestal rests in the memory socket, refracting moonlight.');
        }
        if (ent.id === 'moonbeam_gate') {
          ent.properties = { ...ent.properties, isOpen: true };
          (ent as any).isSolid = false;
          appliedCount++;
        }
      }
    }

    // 3. Consequence of Leaving Observatory Hatch Open
    if (this.hasEvent('LEAVE_DOOR_OPEN')) {
      for (const ent of entities) {
        if (ent.id === 'floating_chandelier_bridge') {
          // The draft pushed the chandelier into a walkable bridge position
          ent.y = ent.properties?.draftBridgeY ?? 260;
          appliedCount++;
          descriptions.push('A dream draft from the open hatch has blown the chandelier into a bridge.');
        }
      }
    }

    // 4. Consequence of Activating Ancient Gyroscope in Level 4
    if (this.hasEvent('ACTIVATE_GYROSCOPE')) {
      for (const ent of entities) {
        if (ent.id === 'gyro_resonance_pillar') {
          ent.properties = { ...ent.properties, isActive: true };
          appliedCount++;
          descriptions.push('The ancient gyroscope hums in resonance with the room architecture.');
        }
      }
    }

    // 5. Consequence of Harmonizing with the Reflection in Level 5
    if (this.hasEvent('HARMONIZE_CHIMES')) {
      for (const ent of entities) {
        if (ent.id === 'reflection_rift_gate') {
          ent.properties = { ...ent.properties, isOpen: true };
          (ent as any).isSolid = false;
          appliedCount++;
          descriptions.push('The harmonic bond between real and reflection unlocks the rift gate.');
        }
      }
    }

    return { appliedCount, descriptions };
  }
}

const globalObj = typeof globalThis !== 'undefined' ? globalThis : (typeof window !== 'undefined' ? window : global);
if (!(globalObj as any).__REVERIE_MEMORY__) {
  (globalObj as any).__REVERIE_MEMORY__ = new MemorySystemClass();
}
export const MemorySystem: MemorySystemClass = (globalObj as any).__REVERIE_MEMORY__;
