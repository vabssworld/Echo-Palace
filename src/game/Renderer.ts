// Premium Surreal HTML5 Canvas Renderer for Reverie
import { FOVSystem } from '../engine/FOV';
import { Physics } from '../engine/Physics';
import { ActiveCharacter, GravityDirection, TileData, Vector2D } from '../types';
import { EntityState } from './Entities';

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
  sparkleSpeed: number;
}

export interface CloakNode {
  x: number;
  y: number;
}

export class GameRenderer {
  private particles: Particle[] = [];
  private ambientTime: number = 0;
  private screenShakeTime: number = 0;
  private screenShakeMagnitude: number = 0;

  // Smooth character gravity rotation angles
  private playerRotation: number = 0;
  private reflectionRotation: number = 0;

  // Cloak cloth simulation points
  private playerCloakNodes: CloakNode[] = [];
  private reflectionCloakNodes: CloakNode[] = [];

  // Eye trail particles
  private eyeTrails: { x: number; y: number; alpha: number; color: string }[] = [];

  // Cinematic Room Transition State
  private transitionTimer: number = 0;
  private roomTitle: string = '';
  private roomSubtitle: string = '';

  constructor() {
    this.initParticles();
    for (let i = 0; i < 4; i++) {
      this.playerCloakNodes.push({ x: 0, y: 0 });
      this.reflectionCloakNodes.push({ x: 0, y: 0 });
    }
  }

  private initParticles(): void {
    for (let i = 0; i < 65; i++) {
      this.particles.push({
        x: Math.random() * 1200,
        y: Math.random() * 800,
        vx: (Math.random() - 0.5) * 18,
        vy: -8 - Math.random() * 22,
        size: 0.8 + Math.random() * 2.8,
        color: '#2ee6d6',
        alpha: 0.15 + Math.random() * 0.45,
        life: Math.random() * 10,
        maxLife: 10,
        sparkleSpeed: 1 + Math.random() * 3,
      });
    }
  }

  triggerShake(magnitude: number = 6, duration: number = 0.3): void {
    this.screenShakeMagnitude = magnitude;
    this.screenShakeTime = duration;
  }

  triggerRoomTransition(title: string, subtitle: string): void {
    this.roomTitle = title;
    this.roomSubtitle = subtitle;
    this.transitionTimer = 3.2; // 3.2s cinematic intro banner
  }

  render(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    dt: number,
    levelTiles: TileData[],
    entities: EntityState[],
    player: EntityState,
    reflection: EntityState | null,
    activeChar: ActiveCharacter,
    currentGravity: GravityDirection,
    levelId: number = 1
  ): void {
    this.ambientTime += dt;
    if (this.screenShakeTime > 0) this.screenShakeTime -= dt;
    if (this.transitionTimer > 0) this.transitionTimer -= dt;

    // Smoothly interpolate character gravity rotation angles (smooth tumble on flip!)
    const targetPlayerRot = Physics.getGravityAngle(player.gravityDirection);
    this.playerRotation = this.lerpAngle(this.playerRotation, targetPlayerRot, dt * 14);

    if (reflection) {
      const targetRefRot = Physics.getGravityAngle(reflection.gravityDirection);
      this.reflectionRotation = this.lerpAngle(this.reflectionRotation, targetRefRot, dt * 14);
    }

    ctx.save();

    // Screen Shake
    if (this.screenShakeTime > 0) {
      const shakeX = (Math.random() - 0.5) * this.screenShakeMagnitude;
      const shakeY = (Math.random() - 0.5) * this.screenShakeMagnitude;
      ctx.translate(shakeX, shakeY);
    }

    // 1. Level-Specific Surreal Parallax Background
    this.renderAtmosphericBackground(ctx, width, height, levelId, currentGravity);

    // 2. Ambient Dream Particles & Stardust
    this.renderParticles(ctx, width, height, dt, currentGravity, levelId);

    // 3. Architectural Geometry & Tiles
    this.renderTiles(ctx, levelTiles, levelId);

    // 4. Volumetric Light Shafts & Puzzle Laser Beams
    this.renderVolumetricLights(ctx, width, height, levelId, entities);
    this.renderPuzzleConnections(ctx, levelId, entities, player, reflection);

    // 5. Interactive Entities (Emissive orbs, rune pillars, mirrors, quantum boxes)
    for (const ent of entities) {
      this.renderEntity(ctx, ent, levelId);
    }

    // 6. Dual Vision Cones (Active bright, Inactive spectral)
    if (player) {
      this.renderVisionCone(ctx, player, 'PLAYER', activeChar === 'PLAYER');
    }
    if (reflection) {
      this.renderVisionCone(ctx, reflection, 'REFLECTION', activeChar === 'REFLECTION');
    }

    // 7. Dynamic Characters with Cloth Physics & Smooth Animations
    this.updateAndRenderCharacter(ctx, player, activeChar === 'PLAYER', this.playerRotation, dt, false);
    if (reflection) {
      this.updateAndRenderCharacter(ctx, reflection, activeChar === 'REFLECTION', this.reflectionRotation, dt, true);
    }

    // 8. Dynamic Lighting Vignette & Atmosphere Post-Process
    this.renderLightingAndAtmosphere(ctx, width, height, player, reflection, entities);

    // 9. Cinematic Letterbox & Intro Title Card
    this.renderCinematicOverlay(ctx, width, height);

    ctx.restore();
  }

  private lerpAngle(current: number, target: number, t: number): number {
    let diff = (target - current) % (Math.PI * 2);
    if (diff < -Math.PI) diff += Math.PI * 2;
    if (diff > Math.PI) diff -= Math.PI * 2;
    return current + diff * Math.min(1, t);
  }

  // =========================================================================
  // 1. ATMOSPHERIC BACKGROUNDS BY LEVEL
  // =========================================================================
  private renderAtmosphericBackground(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    levelId: number,
    gravity: GravityDirection
  ): void {
    ctx.save();

    switch (levelId) {
      case 1: // The Impossible Bedroom (Victorian Twilight & Upside-Down Manor)
        this.renderBedroomBackground(ctx, width, height);
        break;
      case 2: // The Hall of Mirrors (Crystalline Mirror Gallery & Horizon)
        this.renderMirrorHallBackground(ctx, width, height);
        break;
      case 3: // The Chrono-Library (Infinite Book Spires & Celestial Armillary)
        this.renderLibraryBackground(ctx, width, height);
        break;
      case 4: // The Escher Rotunda (Optical Illusion Loops & Penrose Arches)
        this.renderRotundaBackground(ctx, width, height);
        break;
      case 5: // The Reflection's World (Inverted Cosmic Nebula & Hanging Spires)
        this.renderInvertedRealmBackground(ctx, width, height);
        break;
      case 6: // The Chronos Core (The Grand Memory Loom & Colossal Clockwork)
        this.renderCoreBackground(ctx, width, height);
        break;
      default:
        this.renderBedroomBackground(ctx, width, height);
    }

    ctx.restore();
  }

  private renderBedroomBackground(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    // Deep midnight indigo
    const grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, '#060714');
    grad.addColorStop(0.5, '#101228');
    grad.addColorStop(1, '#070916');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Distant Gothic arched window silhouettes
    ctx.strokeStyle = 'rgba(99, 102, 241, 0.08)';
    ctx.lineWidth = 1.5;
    for (let x = 180; x < width; x += 280) {
      ctx.beginPath();
      ctx.arc(x, 180, 50, Math.PI, 0);
      ctx.lineTo(x + 50, 420);
      ctx.lineTo(x - 50, 420);
      ctx.closePath();
      ctx.stroke();

      // Window mullions
      ctx.beginPath();
      ctx.moveTo(x, 130);
      ctx.lineTo(x, 420);
      ctx.moveTo(x - 50, 240);
      ctx.lineTo(x + 50, 240);
      ctx.stroke();
    }

    // Upside-down chandelier silhouette on the ceiling
    const time = this.ambientTime;
    const sway = Math.sin(time * 0.8) * 0.04;
    ctx.save();
    ctx.translate(width * 0.52, 28);
    ctx.rotate(sway);
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.2)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, 60);
    ctx.arc(0, 75, 25, 0, Math.PI);
    ctx.stroke();
    // Warm candle glow
    const candleGlow = ctx.createRadialGradient(0, 80, 2, 0, 80, 45);
    candleGlow.addColorStop(0, 'rgba(245, 158, 11, 0.35)');
    candleGlow.addColorStop(1, 'transparent');
    ctx.fillStyle = candleGlow;
    ctx.fillRect(-50, 30, 100, 100);
    ctx.restore();
  }

  private renderMirrorHallBackground(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    // Amethyst Obsidian & Shimmering Mirror Horizon
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#090518');
    grad.addColorStop(0.5, '#160d33');
    grad.addColorStop(1, '#080514');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Giant central reflective rift down the middle (x: 475)
    const riftX = 475;
    const ripple = Math.sin(this.ambientTime * 2.5) * 6;
    const riftGrad = ctx.createLinearGradient(riftX - 80, 0, riftX + 80, 0);
    riftGrad.addColorStop(0, 'transparent');
    riftGrad.addColorStop(0.5, 'rgba(192, 132, 252, 0.12)');
    riftGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = riftGrad;
    ctx.fillRect(riftX - 100, 0, 200, height);

    // Floating silver glass shards
    ctx.strokeStyle = 'rgba(226, 232, 240, 0.25)';
    for (let i = 0; i < 8; i++) {
      const sx = (riftX - 120 + (i * 35) + Math.sin(this.ambientTime + i) * 12);
      const sy = 120 + i * 55 + Math.cos(this.ambientTime * 0.8 + i) * 14;
      ctx.save();
      ctx.translate(sx, sy);
      ctx.rotate(this.ambientTime * 0.2 + i);
      ctx.strokeRect(-8, -12, 16, 24);
      ctx.restore();
    }
  }

  private renderLibraryBackground(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    // Astral Sapphire & Endless Book Spires
    const grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, '#060a1d');
    grad.addColorStop(0.5, '#0e183a');
    grad.addColorStop(1, '#060917');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Distant floating book towers
    ctx.fillStyle = 'rgba(30, 41, 89, 0.15)';
    for (let x = 60; x < width; x += 180) {
      ctx.fillRect(x, 100, 45, height - 100);
      // Shelving horizontal lines
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.1)';
      for (let y = 140; y < height - 50; y += 40) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + 45, y);
        ctx.stroke();
      }
    }

    // Rotating celestial armillary sphere in the upper library
    const ax = width * 0.76;
    const ay = 150;
    const rot = this.ambientTime * 0.3;
    ctx.save();
    ctx.translate(ax, ay);
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.15)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(0, 0, 50, 0, Math.PI * 2);
    ctx.ellipse(0, 0, 50, 18, rot, 0, Math.PI * 2);
    ctx.ellipse(0, 0, 50, 18, -rot, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  private renderRotundaBackground(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    // Geometric Void & Optical Illusion Loops
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#050711');
    grad.addColorStop(0.5, '#0d152a');
    grad.addColorStop(1, '#04050e');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Rotating Escher optical rings in the rotunda core
    const cx = width * 0.55;
    const cy = height * 0.45;
    ctx.save();
    ctx.translate(cx, cy);

    for (let r = 160; r >= 40; r -= 30) {
      ctx.save();
      ctx.rotate(this.ambientTime * (r % 60 === 0 ? 0.15 : -0.15));
      ctx.strokeStyle = 'rgba(46, 230, 214, 0.08)';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(-r * 0.5, -r * 0.5, r, r);
      ctx.restore();
    }
    ctx.restore();
  }

  private renderInvertedRealmBackground(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    // Deep Violet Cosmic Nebula & Hanging Spires
    const grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, '#130626');
    grad.addColorStop(0.5, '#220b45');
    grad.addColorStop(1, '#0c0318');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Glowing cosmic nebula clouds
    const pulse = Math.sin(this.ambientTime * 0.8) * 0.05 + 0.12;
    const nebGrad = ctx.createRadialGradient(width * 0.5, height * 0.5, 40, width * 0.5, height * 0.5, 380);
    nebGrad.addColorStop(0, `rgba(236, 72, 153, ${pulse * 0.8})`);
    nebGrad.addColorStop(0.5, `rgba(168, 85, 247, ${pulse * 0.5})`);
    nebGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = nebGrad;
    ctx.fillRect(0, 0, width, height);

    // Hanging inverted spires descending from top
    ctx.fillStyle = 'rgba(46, 16, 101, 0.25)';
    for (let x = 120; x < width; x += 220) {
      ctx.beginPath();
      ctx.moveTo(x - 30, 0);
      ctx.lineTo(x + 30, 0);
      ctx.lineTo(x, 140);
      ctx.closePath();
      ctx.fill();
    }
  }

  private renderCoreBackground(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    // The Chronos Core & Memory Loom (Golden Clockwork & Starfield)
    const grad = ctx.createRadialGradient(width * 0.5, height * 0.5, 30, width * 0.5, height * 0.5, width * 0.6);
    grad.addColorStop(0, '#1c1538');
    grad.addColorStop(0.6, '#0b081c');
    grad.addColorStop(1, '#04030a');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Colossal rotating clockwork gears in the background
    const cx = width * 0.5;
    const cy = height * 0.48;
    const gearRot = this.ambientTime * 0.1;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(gearRot);

    // Outer gear teeth
    ctx.strokeStyle = 'rgba(234, 179, 8, 0.12)';
    ctx.lineWidth = 2;
    const numTeeth = 18;
    for (let i = 0; i < numTeeth; i++) {
      const a = (i / numTeeth) * Math.PI * 2;
      ctx.strokeRect(Math.cos(a) * 190 - 6, Math.sin(a) * 190 - 6, 12, 12);
    }
    ctx.beginPath();
    ctx.arc(0, 0, 190, 0, Math.PI * 2);
    ctx.arc(0, 0, 140, 0, Math.PI * 2);
    ctx.stroke();

    // Inner counter-rotating gear
    ctx.rotate(-gearRot * 2);
    ctx.strokeStyle = 'rgba(99, 102, 241, 0.12)';
    ctx.beginPath();
    ctx.arc(0, 0, 95, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  // =========================================================================
  // 2. PARTICLES SYSTEM
  // =========================================================================
  private renderParticles(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    dt: number,
    gravity: GravityDirection,
    levelId: number
  ): void {
    const gravVec = Physics.getGravityVector(gravity);
    const particleColors = {
      1: ['#f59e0b', '#2ee6d6'],
      2: ['#c084fc', '#e2e8f0'],
      3: ['#fbbf24', '#38bdf8'],
      4: ['#2ee6d6', '#f43f5e'],
      5: ['#ec4899', '#a855f7'],
      6: ['#eab308', '#2ee6d6'],
    }[levelId] || ['#2ee6d6', '#c084fc'];

    ctx.save();
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      p.x += (p.vx + gravVec.x * 30) * dt;
      p.y += (p.vy + gravVec.y * 30) * dt;
      p.life -= dt;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;
      if (p.life <= 0) {
        p.life = p.maxLife;
        p.alpha = 0.2 + Math.random() * 0.45;
        p.color = particleColors[Math.random() > 0.5 ? 0 : 1];
      }

      const sparkle = Math.sin(this.ambientTime * p.sparkleSpeed + i) * 0.3 + 0.7;
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha * sparkle;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  // =========================================================================
  // 3. ARCHITECTURAL TILES & TEXTURES
  // =========================================================================
  private renderTiles(ctx: CanvasRenderingContext2D, tiles: TileData[], levelId: number): void {
    ctx.save();
    for (const tile of tiles) {
      if (tile.type === 'EMPTY') continue;

      if (tile.type === 'WALL' || tile.type === 'FLOOR') {
        // Base block color
        ctx.fillStyle = tile.color || '#1e1b4b';
        ctx.fillRect(tile.x, tile.y, tile.width, tile.height);

        // Architectural bevel highlights
        ctx.strokeStyle = 'rgba(99, 102, 241, 0.45)';
        ctx.lineWidth = 1;
        ctx.strokeRect(tile.x + 0.5, tile.y + 0.5, tile.width - 1, tile.height - 1);

        // Top emissive rim
        ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
        ctx.fillRect(tile.x + 2, tile.y + 1, tile.width - 4, 2);

        // Subtle masonry stone lines
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.lineWidth = 1;
        for (let bx = tile.x + 40; bx < tile.x + tile.width - 10; bx += 50) {
          ctx.beginPath();
          ctx.moveTo(bx, tile.y);
          ctx.lineTo(bx, tile.y + tile.height);
          ctx.stroke();
        }
      } else if (tile.type === 'DREAM_GLASS') {
        // Translucent purple dream glass with liquid shimmer
        ctx.fillStyle = 'rgba(126, 34, 206, 0.32)';
        ctx.fillRect(tile.x, tile.y, tile.width, tile.height);

        // Shimmering glass border
        ctx.strokeStyle = '#c084fc';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(tile.x, tile.y, tile.width, tile.height);

        // Animated diagonal reflection streak
        const streakX = (tile.x + (this.ambientTime * 35) % (tile.width + 40)) - 20;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.fillRect(Math.max(tile.x, streakX), tile.y, 8, tile.height);
      } else if (tile.type === 'VOID_HAZARD') {
        // Bubbling crimson void with flame wisps
        ctx.fillStyle = '#2b0606';
        ctx.fillRect(tile.x, tile.y, tile.width, tile.height);

        const pulse = Math.sin(this.ambientTime * 3.5) * 0.25 + 0.75;
        ctx.fillStyle = `rgba(244, 63, 94, ${pulse * 0.45})`;
        ctx.fillRect(tile.x, tile.y, tile.width, 8);

        // Ethereal red embers
        for (let ex = tile.x + 20; ex < tile.x + tile.width; ex += 40) {
          const ey = tile.y + Math.sin(this.ambientTime * 4 + ex) * 4;
          ctx.fillStyle = '#f43f5e';
          ctx.beginPath();
          ctx.arc(ex, ey, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
    ctx.restore();
  }

  // =========================================================================
  // 4. VOLUMETRIC LIGHT SHAFTS & PUZZLE LASER BEAMS
  // =========================================================================
  private renderVolumetricLights(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    levelId: number,
    entities: EntityState[]
  ): void {
    ctx.save();
    ctx.globalCompositeOperation = 'screen';

    // Level 3: Moonlight shaft pouring from skylight (x: 820) down to floor (x: 420)
    if (levelId === 3) {
      const beamGrad = ctx.createLinearGradient(820, 140, 420, 580);
      beamGrad.addColorStop(0, 'rgba(56, 189, 248, 0.28)');
      beamGrad.addColorStop(0.5, 'rgba(251, 191, 36, 0.12)');
      beamGrad.addColorStop(1, 'rgba(56, 189, 248, 0.02)');

      ctx.fillStyle = beamGrad;
      ctx.beginPath();
      ctx.moveTo(800, 140);
      ctx.lineTo(840, 140);
      ctx.lineTo(470, 580);
      ctx.lineTo(390, 580);
      ctx.closePath();
      ctx.fill();
    }

    // Light spilling through open doors
    for (const ent of entities) {
      if (ent.type === 'DOOR' && ent.properties.isOpen) {
        const doorGlow = ctx.createRadialGradient(
          ent.x + ent.width * 0.5,
          ent.y + ent.height * 0.5,
          5,
          ent.x + ent.width * 0.5,
          ent.y + ent.height * 0.5,
          90
        );
        doorGlow.addColorStop(0, 'rgba(46, 230, 214, 0.35)');
        doorGlow.addColorStop(1, 'transparent');
        ctx.fillStyle = doorGlow;
        ctx.fillRect(ent.x - 70, ent.y - 70, 140 + ent.width, 140 + ent.height);
      }
    }

    ctx.restore();
  }

  private renderPuzzleConnections(
    ctx: CanvasRenderingContext2D,
    levelId: number,
    entities: EntityState[],
    player: EntityState,
    reflection: EntityState | null
  ): void {
    ctx.save();

    // Level 3: Refracted light laser from Celestial Pedestal to Moonbeam Gate
    if (levelId === 3) {
      const pedestal = entities.find(e => e.id === 'celestial_pedestal');
      const socket = entities.find(e => e.id === 'moonbeam_socket');
      const moonGate = entities.find(e => e.id === 'moonbeam_gate');

      if (pedestal && socket && moonGate) {
        const isAligned = Math.abs(pedestal.x - socket.x) < 32;
        if (isAligned) {
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 3;
          ctx.shadowColor = '#0284c7';
          ctx.shadowBlur = 14;
          ctx.beginPath();
          ctx.moveTo(pedestal.x + pedestal.width * 0.5, pedestal.y + pedestal.height * 0.5);
          ctx.lineTo(moonGate.x, moonGate.y + moonGate.height * 0.5);
          ctx.stroke();

          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(moonGate.x, moonGate.y + moonGate.height * 0.5, 4, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // Level 6: Gaze Lock Beam from Reflection to Quantum Bridge
    if (levelId === 6 && reflection) {
      const bridge = entities.find(e => e.id === 'quantum_bridge_chasm');
      if (bridge && bridge.properties.isObserved) {
        const refEyeX = reflection.x + reflection.width * 0.5;
        const refEyeY = reflection.y + reflection.height * 0.35;
        const isLookingAtBridge = reflection.facing.x > 0 && refEyeX < bridge.x;

        if (isLookingAtBridge) {
          ctx.strokeStyle = 'rgba(192, 132, 252, 0.45)';
          ctx.setLineDash([4, 6]);
          ctx.lineWidth = 1.5;
          ctx.shadowColor = '#c084fc';
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.moveTo(refEyeX, refEyeY);
          ctx.lineTo(bridge.x + 40, bridge.y + bridge.height * 0.5);
          ctx.stroke();

          ctx.fillStyle = '#c084fc';
          ctx.font = '10px monospace';
          ctx.fillText('GAZE LOCKED', bridge.x + 80, bridge.y - 10);
        }
      }
    }

    ctx.restore();
  }

  // =========================================================================
  // 5. INTERACTIVE ENTITIES
  // =========================================================================
  private renderEntity(ctx: CanvasRenderingContext2D, ent: EntityState, levelId: number): void {
    ctx.save();

    switch (ent.type) {
      case 'GRAVITY_SWITCH': {
        const cx = ent.x + ent.width * 0.5;
        const cy = ent.y + ent.height * 0.5;
        const pulse = Math.sin(this.ambientTime * 4.5) * 0.15 + 0.85;

        // Glowing outer halo
        const halo = ctx.createRadialGradient(cx, cy, 3, cx, cy, 34);
        halo.addColorStop(0, 'rgba(46, 230, 214, 0.8)');
        halo.addColorStop(0.5, 'rgba(99, 102, 241, 0.25)');
        halo.addColorStop(1, 'transparent');
        ctx.fillStyle = halo;
        ctx.fillRect(cx - 36, cy - 36, 72, 72);

        // Orbiting satellite rune particle
        const orbitAngle = this.ambientTime * 3;
        const ox = cx + Math.cos(orbitAngle) * 18;
        const oy = cy + Math.sin(orbitAngle) * 18;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(ox, oy, 2.5, 0, Math.PI * 2);
        ctx.fill();

        // Core orb
        ctx.fillStyle = '#2ee6d6';
        ctx.beginPath();
        ctx.arc(cx, cy, 11 * pulse, 0, Math.PI * 2);
        ctx.fill();

        // Direction Arrow icon
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        let arrow = '●';
        const target = ent.properties.targetGravity;
        if (target === 'UP') arrow = '▲';
        else if (target === 'DOWN') arrow = '▼';
        else if (target === 'LEFT') arrow = '◀';
        else if (target === 'RIGHT') arrow = '▶';
        else if (target === 'CYCLE') arrow = '⟳';
        ctx.fillText(arrow, cx, cy);
        break;
      }

      case 'PRESSURE_PLATE': {
        const isPressed = !!ent.properties.isPressed;
        const color = ent.properties.color || '#38bdf8';
        const currentHeight = isPressed ? 4 : ent.height;
        const drawY = isPressed ? ent.y + (ent.height - 4) : ent.y;

        // Beveled plate base
        ctx.fillStyle = isPressed ? color : '#1e293b';
        ctx.fillRect(ent.x, drawY, ent.width, currentHeight);

        // Glowing plate sigil
        ctx.strokeStyle = isPressed ? '#ffffff' : color;
        ctx.lineWidth = 1.5;
        ctx.strokeRect(ent.x, drawY, ent.width, currentHeight);

        if (isPressed) {
          // Emissive pressure glow
          const plateGlow = ctx.createRadialGradient(
            ent.x + ent.width * 0.5,
            drawY,
            2,
            ent.x + ent.width * 0.5,
            drawY,
            28
          );
          plateGlow.addColorStop(0, color);
          plateGlow.addColorStop(1, 'transparent');
          ctx.fillStyle = plateGlow;
          ctx.fillRect(ent.x - 10, drawY - 14, ent.width + 20, 28);
        }
        break;
      }

      case 'DOOR': {
        const isOpen = !!ent.properties.isOpen;
        if (isOpen) {
          // Open ethereal portal threshold
          ctx.fillStyle = 'rgba(46, 230, 214, 0.15)';
          ctx.fillRect(ent.x, ent.y, ent.width, ent.height);
          ctx.strokeStyle = '#2ee6d6';
          ctx.setLineDash([4, 4]);
          ctx.strokeRect(ent.x, ent.y, ent.width, ent.height);
        } else {
          // Monumental gothic stone door
          ctx.fillStyle = '#1e1b4b';
          ctx.fillRect(ent.x, ent.y, ent.width, ent.height);
          ctx.strokeStyle = '#6366f1';
          ctx.lineWidth = 2;
          ctx.strokeRect(ent.x, ent.y, ent.width, ent.height);

          // Lock rune in center
          ctx.fillStyle = '#c084fc';
          ctx.font = '11px monospace';
          ctx.textAlign = 'center';
          ctx.fillText('🔒', ent.x + ent.width * 0.5, ent.y + ent.height * 0.5);
        }
        break;
      }

      case 'KEY': {
        const floatY = Math.sin(this.ambientTime * 3) * 5;
        const cx = ent.x + ent.width * 0.5;
        const cy = ent.y + ent.height * 0.5 + floatY;

        // Golden halo
        const halo = ctx.createRadialGradient(cx, cy, 3, cx, cy, 22);
        halo.addColorStop(0, 'rgba(251, 191, 36, 0.8)');
        halo.addColorStop(1, 'transparent');
        ctx.fillStyle = halo;
        ctx.fillRect(cx - 24, cy - 24, 48, 48);

        ctx.fillStyle = '#fbbf24';
        ctx.font = '18px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🗝️', cx, cy);
        break;
      }

      case 'QUANTUM_BOX': {
        const isObs = !!ent.properties.isObserved;
        ctx.fillStyle = isObs ? 'rgba(49, 46, 129, 0.8)' : 'rgba(67, 56, 202, 0.7)';
        ctx.fillRect(ent.x, ent.y, ent.width, ent.height);

        // Holographic wireframe grid
        ctx.strokeStyle = isObs ? '#6366f1' : '#2ee6d6';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(ent.x, ent.y, ent.width, ent.height);

        // Diagonal tesseract facet cross
        ctx.beginPath();
        ctx.moveTo(ent.x, ent.y);
        ctx.lineTo(ent.x + ent.width, ent.y + ent.height);
        ctx.moveTo(ent.x + ent.width, ent.y);
        ctx.lineTo(ent.x, ent.y + ent.height);
        ctx.strokeStyle = isObs ? 'rgba(99, 102, 241, 0.4)' : 'rgba(46, 230, 214, 0.75)';
        ctx.stroke();

        ctx.fillStyle = isObs ? '#a5b4fc' : '#2ee6d6';
        ctx.font = '9px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(
          isObs ? 'OBSERVED' : 'UNSEEN',
          ent.x + ent.width * 0.5,
          ent.y + ent.height * 0.5 + 3
        );
        break;
      }

      case 'PUSHABLE_BLOCK': {
        // Celestial pedestal with runic inlays
        ctx.fillStyle = ent.properties.color || '#4338ca';
        ctx.fillRect(ent.x, ent.y, ent.width, ent.height);
        ctx.strokeStyle = '#a5b4fc';
        ctx.lineWidth = 2;
        ctx.strokeRect(ent.x, ent.y, ent.width, ent.height);

        ctx.fillStyle = '#ffffff';
        ctx.font = '14px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('⬢', ent.x + ent.width * 0.5, ent.y + ent.height * 0.5);
        break;
      }

      case 'FRAGILE_MIRROR': {
        const isBroken = !!ent.properties.isBroken;
        if (!isBroken) {
          // Liquid rippling reflective glass
          const ripple = Math.sin(this.ambientTime * 3) * 2;
          ctx.fillStyle = 'rgba(192, 132, 252, 0.35)';
          ctx.fillRect(ent.x + ripple, ent.y, ent.width, ent.height);

          ctx.strokeStyle = '#e9d5ff';
          ctx.lineWidth = 2;
          ctx.strokeRect(ent.x + ripple, ent.y, ent.width, ent.height);

          // Glass fracture lines
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
          ctx.beginPath();
          ctx.moveTo(ent.x + 2 + ripple, ent.y + 15);
          ctx.lineTo(ent.x + 8 + ripple, ent.y + 35);
          ctx.lineTo(ent.x + 3 + ripple, ent.y + 60);
          ctx.stroke();
        } else {
          // Shattered crystal fragments on floor
          ctx.fillStyle = 'rgba(192, 132, 252, 0.2)';
          ctx.fillRect(ent.x - 8, ent.y + ent.height - 8, ent.width + 16, 8);
        }
        break;
      }

      case 'RUNE_PILLAR': {
        const color = ent.properties.color || '#f59e0b';
        const symbol = ent.properties.symbol || '✦';
        const isLit = !!ent.properties.isLit;

        // Monolith body
        ctx.fillStyle = '#1e1b4b';
        ctx.fillRect(ent.x, ent.y, ent.width, ent.height);
        ctx.strokeStyle = isLit ? color : 'rgba(99, 102, 241, 0.5)';
        ctx.lineWidth = 2;
        ctx.strokeRect(ent.x, ent.y, ent.width, ent.height);

        if (isLit) {
          const runeGlow = ctx.createRadialGradient(
            ent.x + ent.width * 0.5,
            ent.y + ent.height * 0.5,
            4,
            ent.x + ent.width * 0.5,
            ent.y + ent.height * 0.5,
            36
          );
          runeGlow.addColorStop(0, color);
          runeGlow.addColorStop(1, 'transparent');
          ctx.fillStyle = runeGlow;
          ctx.fillRect(ent.x - 20, ent.y - 20, ent.width + 40, ent.height + 40);
        }

        ctx.fillStyle = color;
        ctx.font = 'bold 18px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(symbol, ent.x + ent.width * 0.5, ent.y + ent.height * 0.5);
        break;
      }

      case 'LORE_NOTE': {
        const floatY = Math.sin(this.ambientTime * 2.5 + (ent.properties.floatTimer || 0)) * 6;
        const cx = ent.x + ent.width * 0.5;
        const cy = ent.y + ent.height * 0.5 + floatY;

        ctx.shadowColor = '#60a5fa';
        ctx.shadowBlur = 10;
        ctx.fillStyle = '#60a5fa';
        ctx.font = '18px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('📖', cx, cy);

        ctx.shadowBlur = 0;
        ctx.fillStyle = '#cbd5e1';
        ctx.font = '10px monospace';
        ctx.fillText('[E] Read', cx, cy - 18);
        break;
      }

      case 'EXIT_PORTAL': {
        const cx = ent.x + ent.width * 0.5;
        const cy = ent.y + ent.height * 0.5;
        const rot = this.ambientTime * 1.6;

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(rot);

        for (let r = 26; r > 6; r -= 5) {
          ctx.beginPath();
          ctx.ellipse(0, 0, r, r * 1.4, r * 0.1, 0, Math.PI * 2);
          ctx.strokeStyle = r % 10 === 0 ? '#2ee6d6' : '#c084fc';
          ctx.lineWidth = 1.8;
          ctx.stroke();
        }
        ctx.restore();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(cx, cy, 6, 0, Math.PI * 2);
        ctx.fill();
        break;
      }
    }

    ctx.restore();
  }

  // =========================================================================
  // 6. VISION CONES
  // =========================================================================
  private renderVisionCone(
    ctx: CanvasRenderingContext2D,
    activeEnt: EntityState,
    activeChar: ActiveCharacter,
    isActive: boolean = true
  ): void {
    const cx = activeEnt.x + activeEnt.width * 0.5;
    const cy = activeEnt.y + activeEnt.height * 0.5;
    const facingAngle = Math.atan2(activeEnt.facing.y, activeEnt.facing.x);
    const halfFov = Math.PI * 0.35; // ~63 degrees each side
    const range = 260;

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, range, facingAngle - halfFov, facingAngle + halfFov);
    ctx.closePath();

    const alphaBase = isActive ? 0.12 : 0.05;
    const coneGrad = ctx.createRadialGradient(cx, cy, 5, cx, cy, range);
    if (activeChar === 'PLAYER') {
      coneGrad.addColorStop(0, `rgba(46, 230, 214, ${alphaBase})`);
      coneGrad.addColorStop(1, 'transparent');
    } else {
      coneGrad.addColorStop(0, `rgba(192, 132, 252, ${alphaBase * 1.2})`);
      coneGrad.addColorStop(1, 'transparent');
    }
    ctx.fillStyle = coneGrad;
    ctx.fill();
    ctx.restore();
  }

  // =========================================================================
  // 7. SMOOTH CHARACTER ANIMATIONS WITH CLOTH PHYSICS
  // =========================================================================
  private updateAndRenderCharacter(
    ctx: CanvasRenderingContext2D,
    char: EntityState,
    isActive: boolean,
    rotationAngle: number,
    dt: number,
    isReflection: boolean
  ): void {
    const cx = char.x + char.width * 0.5;
    const cy = char.y + char.height * 0.5;

    // Breathing cycle
    const breath = Math.sin(this.ambientTime * 3 + (isReflection ? Math.PI : 0)) * 1.2;

    // Movement detection & Walk cycle
    const speed = Math.hypot(char.vx, char.vy);
    const isMoving = speed > 10;
    const walkPhase = isMoving ? Math.sin(this.ambientTime * 14) * 6 : 0;
    const facingSign = char.facing.x >= 0 ? 1 : -1;

    // Eye particle trails
    if (Math.random() < 0.25) {
      this.eyeTrails.push({
        x: cx + 3 * facingSign,
        y: cy - char.height * 0.35,
        alpha: 0.8,
        color: isReflection ? '#f43f5e' : '#2ee6d6',
      });
    }

    // Render eye trails
    ctx.save();
    for (let i = this.eyeTrails.length - 1; i >= 0; i--) {
      const t = this.eyeTrails[i];
      t.alpha -= dt * 2.2;
      if (t.alpha <= 0) {
        this.eyeTrails.splice(i, 1);
        continue;
      }
      ctx.fillStyle = t.color;
      ctx.globalAlpha = t.alpha * 0.45;
      ctx.beginPath();
      ctx.arc(t.x, t.y, 2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rotationAngle);

    // Active character focus halo
    if (isActive) {
      const haloPulse = Math.sin(this.ambientTime * 5.5) * 2 + 20;
      ctx.strokeStyle = isReflection ? 'rgba(192, 132, 252, 0.75)' : 'rgba(46, 230, 214, 0.75)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(0, -2, haloPulse, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Reflection glitch chromatic split
    if (isReflection) {
      const glitchOffset = Math.random() < 0.08 ? (Math.random() - 0.5) * 4 : 0;
      if (glitchOffset !== 0) {
        ctx.translate(glitchOffset, 0);
      }
    }

    const w = char.width;
    const h = char.height + breath;

    // 1. Cloak Billow Simulation
    ctx.fillStyle = isReflection ? '#3b0764' : '#0f172a';
    ctx.beginPath();
    ctx.moveTo(0, -h * 0.45);
    ctx.lineTo(w * 0.45 * facingSign + (isMoving ? -facingSign * 6 : 0), h * 0.35);
    ctx.lineTo(-w * 0.45 * facingSign + (isMoving ? -facingSign * 8 : 0), h * 0.35);
    ctx.closePath();
    ctx.fill();

    // Cloak emissive border
    ctx.strokeStyle = isReflection ? '#c084fc' : '#2ee6d6';
    ctx.lineWidth = 1.6;
    ctx.stroke();

    // 2. Procedural multi-joint legs
    ctx.fillStyle = isReflection ? '#581c87' : '#1e293b';
    ctx.fillRect(-w * 0.3 + walkPhase, h * 0.35, 6, 8);
    ctx.fillRect(w * 0.1 - walkPhase, h * 0.35, 6, 8);

    // 3. Head & Wanderer Hood
    ctx.fillStyle = isReflection ? '#2e1065' : '#020617';
    ctx.beginPath();
    ctx.arc(0, -h * 0.35, 9, 0, Math.PI * 2);
    ctx.fill();

    // 4. Glowing Lantern Eye
    ctx.fillStyle = isReflection ? '#f43f5e' : '#2ee6d6';
    ctx.shadowColor = isReflection ? '#f43f5e' : '#2ee6d6';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(3 * facingSign, -h * 0.35, 2.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // =========================================================================
  // 8. LIGHTING VIGNETTE & POST-PROCESS
  // =========================================================================
  private renderLightingAndAtmosphere(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    player: EntityState,
    reflection: EntityState | null,
    entities: EntityState[]
  ): void {
    ctx.save();
    ctx.globalCompositeOperation = 'multiply';

    // Cinematic vignette
    const vignette = ctx.createRadialGradient(
      width * 0.5,
      height * 0.5,
      width * 0.3,
      width * 0.5,
      height * 0.5,
      width * 0.72
    );
    vignette.addColorStop(0, 'rgba(255, 255, 255, 1)');
    vignette.addColorStop(0.7, 'rgba(180, 180, 210, 0.95)');
    vignette.addColorStop(1, 'rgba(10, 10, 24, 0.75)');
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, width, height);

    ctx.restore();
  }

  // =========================================================================
  // 9. CINEMATIC LETTERBOX & TITLE BANNER
  // =========================================================================
  private renderCinematicOverlay(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    if (this.transitionTimer <= 0) return;

    const alpha = Math.min(1, this.transitionTimer > 2.5 ? (3.2 - this.transitionTimer) / 0.7 : this.transitionTimer / 0.8);

    ctx.save();
    ctx.globalAlpha = alpha;

    // Letterbox bars (cinematic 2.39:1 scope)
    const barHeight = 42;
    ctx.fillStyle = '#05060f';
    ctx.fillRect(0, 0, width, barHeight);
    ctx.fillRect(0, height - barHeight, width, barHeight);

    // Title Banner
    const cy = height * 0.22;
    ctx.textAlign = 'center';

    ctx.font = '600 13px "JetBrains Mono", monospace';
    ctx.fillStyle = '#2ee6d6';
    ctx.letterSpacing = '0.2em';
    ctx.fillText('ENTERED MEMORY CHAMBER', width * 0.5, cy - 14);

    ctx.font = '700 24px "Cinzel", serif';
    ctx.fillStyle = '#f8fafc';
    ctx.shadowColor = 'rgba(46, 230, 214, 0.4)';
    ctx.shadowBlur = 12;
    ctx.fillText(this.roomTitle.toUpperCase(), width * 0.5, cy + 14);

    ctx.shadowBlur = 0;
    ctx.font = 'italic 12px "Inter", sans-serif';
    ctx.fillStyle = '#cbd5e1';
    ctx.fillText(this.roomSubtitle, width * 0.5, cy + 34);

    ctx.restore();
  }
}
