// Interactive Game Entities
import { ActiveCharacter, GravityDirection, Vector2D } from '../types';

export interface EntityState {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  vx: number;
  vy: number;
  isGrounded: boolean;
  gravityDirection: GravityDirection;
  facing: Vector2D;
  isSolid: boolean;
  properties: Record<string, any>;
}

export class EntityManager {
  static createPlayer(x: number, y: number, gravity: GravityDirection = 'DOWN'): EntityState {
    return {
      id: 'player',
      type: 'PLAYER',
      x,
      y,
      width: 24,
      height: 42,
      vx: 0,
      vy: 0,
      isGrounded: false,
      gravityDirection: gravity,
      facing: { x: 1, y: 0 },
      isSolid: true,
      properties: {
        walkTime: 0,
        color: '#2ee6d6',
        auraColor: 'rgba(46, 230, 214, 0.4)',
        characterType: 'PLAYER' as ActiveCharacter,
      },
    };
  }

  static createReflection(x: number, y: number, gravity: GravityDirection = 'DOWN'): EntityState {
    return {
      id: 'reflection',
      type: 'REFLECTION',
      x,
      y,
      width: 24,
      height: 42,
      vx: 0,
      vy: 0,
      isGrounded: false,
      gravityDirection: gravity,
      facing: { x: -1, y: 0 },
      isSolid: true,
      properties: {
        walkTime: 0,
        color: '#c084fc',
        auraColor: 'rgba(192, 132, 252, 0.45)',
        characterType: 'REFLECTION' as ActiveCharacter,
        glitchTimer: 0,
      },
    };
  }

  static createGravitySwitch(
    id: string,
    x: number,
    y: number,
    targetGravity: GravityDirection | 'CYCLE',
    label?: string
  ): EntityState {
    return {
      id,
      type: 'GRAVITY_SWITCH',
      x,
      y,
      width: 32,
      height: 32,
      vx: 0,
      vy: 0,
      isGrounded: false,
      gravityDirection: 'DOWN',
      facing: { x: 0, y: 0 },
      isSolid: false,
      properties: {
        targetGravity,
        label: label || targetGravity,
        pulseTimer: 0,
      },
    };
  }

  static createPressurePlate(id: string, x: number, y: number, targetDoorId: string): EntityState {
    return {
      id,
      type: 'PRESSURE_PLATE',
      x,
      y,
      width: 36,
      height: 8,
      vx: 0,
      vy: 0,
      isGrounded: false,
      gravityDirection: 'DOWN',
      facing: { x: 0, y: 0 },
      isSolid: false,
      properties: {
        isPressed: false,
        targetDoorId,
        color: '#38bdf8',
      },
    };
  }

  static createDoor(
    id: string,
    x: number,
    y: number,
    width: number = 14,
    height: number = 52,
    initiallyOpen: boolean = false
  ): EntityState {
    return {
      id,
      type: 'DOOR',
      x,
      y,
      width,
      height,
      vx: 0,
      vy: 0,
      isGrounded: false,
      gravityDirection: 'DOWN',
      facing: { x: 0, y: 0 },
      isSolid: !initiallyOpen,
      properties: {
        isOpen: initiallyOpen,
        openProgress: initiallyOpen ? 1 : 0,
      },
    };
  }

  static createQuantumBox(
    id: string,
    x: number,
    y: number,
    observedSize: { w: number; h: number },
    unobservedSize: { w: number; h: number },
    initiallyObserved: boolean = true
  ): EntityState {
    return {
      id,
      type: 'QUANTUM_BOX',
      x,
      y,
      width: initiallyObserved ? observedSize.w : unobservedSize.w,
      height: initiallyObserved ? observedSize.h : unobservedSize.h,
      vx: 0,
      vy: 0,
      isGrounded: false,
      gravityDirection: 'DOWN',
      facing: { x: 0, y: 0 },
      isSolid: true,
      properties: {
        isObserved: initiallyObserved,
        observedWidth: observedSize.w,
        observedHeight: observedSize.h,
        unobservedWidth: unobservedSize.w,
        unobservedHeight: unobservedSize.h,
        targetWidth: initiallyObserved ? observedSize.w : unobservedSize.w,
        targetHeight: initiallyObserved ? observedSize.h : unobservedSize.h,
        transformAlpha: 0,
      },
    };
  }

  static createPushableBlock(id: string, x: number, y: number, width: number = 32, height: number = 32): EntityState {
    return {
      id,
      type: 'PUSHABLE_BLOCK',
      x,
      y,
      width,
      height,
      vx: 0,
      vy: 0,
      isGrounded: false,
      gravityDirection: 'DOWN',
      facing: { x: 0, y: 0 },
      isSolid: true,
      properties: {
        color: '#6366f1',
      },
    };
  }

  static createFragileMirror(id: string, x: number, y: number, width: number = 10, height: number = 60): EntityState {
    return {
      id,
      type: 'FRAGILE_MIRROR',
      x,
      y,
      width,
      height,
      vx: 0,
      vy: 0,
      isGrounded: false,
      gravityDirection: 'DOWN',
      facing: { x: 0, y: 0 },
      isSolid: true,
      properties: {
        isBroken: false,
      },
    };
  }

  static createRunePillar(id: string, x: number, y: number, runeIndex: number, symbol: string, color: string): EntityState {
    return {
      id,
      type: 'RUNE_PILLAR',
      x,
      y,
      width: 28,
      height: 48,
      vx: 0,
      vy: 0,
      isGrounded: false,
      gravityDirection: 'DOWN',
      facing: { x: 0, y: 0 },
      isSolid: false,
      properties: {
        runeIndex,
        symbol,
        color,
        isLit: false,
        pulseTimer: 0,
      },
    };
  }

  static createLoreNote(id: string, x: number, y: number, title: string, text: string[]): EntityState {
    return {
      id,
      type: 'LORE_NOTE',
      x,
      y,
      width: 26,
      height: 26,
      vx: 0,
      vy: 0,
      isGrounded: false,
      gravityDirection: 'DOWN',
      facing: { x: 0, y: 0 },
      isSolid: false,
      properties: {
        title,
        text,
        floatTimer: Math.random() * Math.PI * 2,
      },
    };
  }

  static createExitPortal(id: string, x: number, y: number): EntityState {
    return {
      id,
      type: 'EXIT_PORTAL',
      x,
      y,
      width: 44,
      height: 56,
      vx: 0,
      vy: 0,
      isGrounded: false,
      gravityDirection: 'DOWN',
      facing: { x: 0, y: 0 },
      isSolid: false,
      properties: {
        isOpen: false,
        rotationTimer: 0,
      },
    };
  }
}
