// Physics & 4-Way Gravity Engine
import { AABB, GravityDirection, Vector2D } from '../types';

export const GRAVITY_MAGNITUDE = 980;
export const MOVE_SPEED = 220;
export const JUMP_FORCE = 440;
export const TERMINAL_VELOCITY = 800;

export interface PhysicsBody {
  x: number;
  y: number;
  width: number;
  height: number;
  vx: number;
  vy: number;
  isGrounded: boolean;
  gravityDirection: GravityDirection;
}

export class Physics {
  static getGravityVector(dir: GravityDirection): Vector2D {
    switch (dir) {
      case 'DOWN':
        return { x: 0, y: 1 };
      case 'UP':
        return { x: 0, y: -1 };
      case 'LEFT':
        return { x: -1, y: 0 };
      case 'RIGHT':
        return { x: 1, y: 0 };
    }
  }

  static getGravityAngle(dir: GravityDirection): number {
    switch (dir) {
      case 'DOWN':
        return 0;
      case 'LEFT':
        return Math.PI * 0.5;
      case 'UP':
        return Math.PI;
      case 'RIGHT':
        return -Math.PI * 0.5;
    }
  }

  static checkAABBOverlap(a: AABB, b: AABB): boolean {
    return (
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y
    );
  }

  /**
   * Contact check with a small epsilon tolerance for surface resting
   */
  static checkContact(a: AABB, b: AABB, tolerance: number = 3): boolean {
    return (
      a.x < b.x + b.width + tolerance &&
      a.x + a.width > b.x - tolerance &&
      a.y < b.y + b.height + tolerance &&
      a.y + a.height > b.y - tolerance
    );
  }

  static updateBody(
    body: PhysicsBody,
    input: { moveX: number; moveY: number; jump: boolean },
    obstacles: AABB[],
    dt: number
  ): void {
    const grav = this.getGravityVector(body.gravityDirection);

    // Accelerate along gravity vector
    body.vx += grav.x * GRAVITY_MAGNITUDE * dt;
    body.vy += grav.y * GRAVITY_MAGNITUDE * dt;

    // Terminal velocity clamp
    const speed = Math.hypot(body.vx, body.vy);
    if (speed > TERMINAL_VELOCITY) {
      const ratio = TERMINAL_VELOCITY / speed;
      body.vx *= ratio;
      body.vy *= ratio;
    }

    // Directional control relative to active gravity orientation
    if (body.gravityDirection === 'DOWN' || body.gravityDirection === 'UP') {
      // Horizontal motion along floor / ceiling
      if (input.moveX !== 0) {
        body.vx = input.moveX * MOVE_SPEED;
      } else {
        body.vx *= Math.pow(0.001, dt);
        if (Math.abs(body.vx) < 5) body.vx = 0;
      }

      // Jump
      if (input.jump && body.isGrounded) {
        if (body.gravityDirection === 'DOWN') {
          body.vy = -JUMP_FORCE;
        } else {
          body.vy = JUMP_FORCE; // Ceiling jump pushes down
        }
        body.isGrounded = false;
      }
    } else {
      // LEFT or RIGHT gravity: Vertical motion along walls
      if (input.moveY !== 0) {
        body.vy = input.moveY * MOVE_SPEED;
      } else {
        body.vy *= Math.pow(0.001, dt);
        if (Math.abs(body.vy) < 5) body.vy = 0;
      }

      // Jump off wall
      if (input.jump && body.isGrounded) {
        if (body.gravityDirection === 'LEFT') {
          body.vx = JUMP_FORCE; // Push away from left wall
        } else {
          body.vx = -JUMP_FORCE; // Push away from right wall
        }
        body.isGrounded = false;
      }
    }

    // Reset grounded flag prior to collision checks
    body.isGrounded = false;

    // Step X Axis
    body.x += body.vx * dt;
    for (const obs of obstacles) {
      if (this.checkAABBOverlap(body, obs)) {
        if (body.vx > 0) {
          body.x = obs.x - body.width;
          if (body.gravityDirection === 'RIGHT') {
            body.isGrounded = true;
          }
        } else if (body.vx < 0) {
          body.x = obs.x + obs.width;
          if (body.gravityDirection === 'LEFT') {
            body.isGrounded = true;
          }
        }
        body.vx = 0;
      }
    }

    // Step Y Axis
    body.y += body.vy * dt;
    for (const obs of obstacles) {
      if (this.checkAABBOverlap(body, obs)) {
        if (body.vy > 0) {
          body.y = obs.y - body.height;
          if (body.gravityDirection === 'DOWN') {
            body.isGrounded = true;
          }
        } else if (body.vy < 0) {
          body.y = obs.y + obs.height;
          if (body.gravityDirection === 'UP') {
            body.isGrounded = true;
          }
        }
        body.vy = 0;
      }
    }
  }
}
