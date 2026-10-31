// Field-Of-View & Raycast Visibility Engine
import { AABB, Vector2D } from '../types';
import { Vector2 } from './Vector2';

export interface Observer {
  x: number;
  y: number;
  facing: Vector2D; // Normalized facing vector
  fovAngle: number; // In radians, e.g. Math.PI * 0.75 (135 degrees)
  range: number;    // Sight radius in pixels
}

export class FOVSystem {
  /**
   * Checks if a line segment between p1 and p2 intersects an axis-aligned bounding box.
   */
  static lineIntersectsAABB(p1: Vector2D, p2: Vector2D, box: AABB): boolean {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;

    let tmin = 0;
    let tmax = 1;

    // X axis check
    if (Math.abs(dx) < 1e-8) {
      if (p1.x < box.x || p1.x > box.x + box.width) return false;
    } else {
      const ood = 1.0 / dx;
      let t1 = (box.x - p1.x) * ood;
      let t2 = (box.x + box.width - p1.x) * ood;
      if (t1 > t2) [t1, t2] = [t2, t1];
      tmin = Math.max(tmin, t1);
      tmax = Math.min(tmax, t2);
      if (tmin > tmax) return false;
    }

    // Y axis check
    if (Math.abs(dy) < 1e-8) {
      if (p1.y < box.y || p1.y > box.y + box.height) return false;
    } else {
      const ood = 1.0 / dy;
      let t1 = (box.y - p1.y) * ood;
      let t2 = (box.y + box.height - p1.y) * ood;
      if (t1 > t2) [t1, t2] = [t2, t1];
      tmin = Math.max(tmin, t1);
      tmax = Math.min(tmax, t2);
      if (tmin > tmax) return false;
    }

    return true;
  }

  /**
   * Checks if an observer can clearly see a target AABB without wall occlusions
   * and within the observer's facing field-of-view cone.
   */
  static canSee(observer: Observer, target: AABB, occluders: AABB[]): boolean {
    const obsPos: Vector2D = { x: observer.x, y: observer.y };
    
    // Test points on target: center, top-left, bottom-right
    const testPoints: Vector2D[] = [
      { x: target.x + target.width * 0.5, y: target.y + target.height * 0.5 },
      { x: target.x + 4, y: target.y + 4 },
      { x: target.x + target.width - 4, y: target.y + target.height - 4 },
    ];

    for (const pt of testPoints) {
      const toTarget = Vector2.sub(pt, obsPos);
      const dist = Vector2.length(toTarget);

      // Range check
      if (dist > observer.range) continue;
      if (dist < 5) return true; // Right next to observer

      // Angle / Cone check
      const dirToTarget = Vector2.normalize(toTarget);
      const facingNorm = Vector2.normalize(observer.facing);
      const dot = Vector2.dot(facingNorm, dirToTarget);
      const angle = Math.acos(Math.max(-1, Math.min(1, dot)));

      // If outside vision cone, cannot see
      if (angle > observer.fovAngle * 0.5) continue;

      // Raycast check through occluders
      let occluded = false;
      for (const occ of occluders) {
        // Skip occluder if it is the target itself
        if (
          Math.abs(occ.x - target.x) < 1 &&
          Math.abs(occ.y - target.y) < 1 &&
          Math.abs(occ.width - target.width) < 1
        ) {
          continue;
        }

        if (this.lineIntersectsAABB(obsPos, pt, occ)) {
          occluded = true;
          break;
        }
      }

      if (!occluded) {
        return true;
      }
    }

    return false;
  }

  /**
   * Check if any observer in a list can see the target.
   */
  static isObservedByAny(observers: Observer[], target: AABB, occluders: AABB[]): boolean {
    for (const obs of observers) {
      if (this.canSee(obs, target, occluders)) {
        return true;
      }
    }
    return false;
  }
}
