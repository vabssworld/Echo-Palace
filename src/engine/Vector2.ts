// 2D Vector Math Utilities
import { Vector2D } from '../types';

export class Vector2 {
  static create(x: number = 0, y: number = 0): Vector2D {
    return { x, y };
  }

  static clone(v: Vector2D): Vector2D {
    return { x: v.x, y: v.y };
  }

  static add(a: Vector2D, b: Vector2D): Vector2D {
    return { x: a.x + b.x, y: a.y + b.y };
  }

  static sub(a: Vector2D, b: Vector2D): Vector2D {
    return { x: a.x - b.x, y: a.y - b.y };
  }

  static scale(v: Vector2D, s: number): Vector2D {
    return { x: v.x * s, y: v.y * s };
  }

  static length(v: Vector2D): number {
    return Math.hypot(v.x, v.y);
  }

  static distance(a: Vector2D, b: Vector2D): number {
    return Math.hypot(a.x - b.x, a.y - b.y);
  }

  static normalize(v: Vector2D): Vector2D {
    const len = Math.hypot(v.x, v.y);
    if (len === 0) return { x: 0, y: 0 };
    return { x: v.x / len, y: v.y / len };
  }

  static dot(a: Vector2D, b: Vector2D): number {
    return a.x * b.x + a.y * b.y;
  }

  static lerp(a: Vector2D, b: Vector2D, t: number): Vector2D {
    return {
      x: a.x + (b.x - a.x) * t,
      y: a.y + (b.y - a.y) * t,
    };
  }

  static angleBetween(a: Vector2D, b: Vector2D): number {
    const dot = Vector2.dot(Vector2.normalize(a), Vector2.normalize(b));
    return Math.acos(Math.max(-1, Math.min(1, dot)));
  }
}
