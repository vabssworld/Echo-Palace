import { Vector2 } from './src/engine/Vector2';
import { Physics } from './src/engine/Physics';
import { FOVSystem, Observer } from './src/engine/FOV';
import { MemorySystem } from './src/engine/MemorySystem';
import { LEVELS } from './src/game/Levels';
import { Puzzles, PuzzleContext } from './src/game/Puzzles';
import { EntityManager, EntityState } from './src/game/Entities';
import { Storage } from './src/utils/Storage';
import { GravityDirection, ActiveCharacter, BaseEntityData, TileData } from './src/types';

let totalTests = 0;
let passedTests = 0;

function assert(condition: boolean, testName: string) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✓ [PASS] ${testName}`);
  } else {
    console.error(`  ✗ [FAIL] ${testName}`);
    process.exitCode = 1;
  }
}

console.log('====================================================');
console.log('REVERIE: COMPREHENSIVE AUTOMATED VERIFICATION SUITE');
console.log('====================================================\n');

// ----------------------------------------------------
// 1. Vector2 and 4-Way Physics Suite
// ----------------------------------------------------
console.log('SECTION 1: Vector2 & 4-Way Gravity Physics');
const v1 = Vector2.create(3, 4);
assert(Vector2.length(v1) === 5, 'Vector2 length calculation (3,4 -> 5)');
const norm = Vector2.normalize(v1);
assert(Math.abs(Vector2.length(norm) - 1) < 0.001, 'Vector2 normalized length is 1.0');

const gDown = Physics.getGravityVector('DOWN');
assert(gDown.x === 0 && gDown.y > 0, 'Gravity DOWN vector has positive Y');

const gUp = Physics.getGravityVector('UP');
assert(gUp.x === 0 && gUp.y < 0, 'Gravity UP vector has negative Y');

const gLeft = Physics.getGravityVector('LEFT');
assert(gLeft.x < 0 && gLeft.y === 0, 'Gravity LEFT vector has negative X');

const gRight = Physics.getGravityVector('RIGHT');
assert(gRight.x > 0 && gRight.y === 0, 'Gravity RIGHT vector has positive X');

// Collision Box Tests
const boxA = { x: 100, y: 100, width: 40, height: 40 };
const boxB = { x: 130, y: 120, width: 40, height: 40 };
const boxC = { x: 200, y: 200, width: 40, height: 40 };

assert(Physics.checkAABBOverlap(boxA, boxB), 'AABB overlapping detection true for intersecting boxes');
assert(!Physics.checkAABBOverlap(boxA, boxC), 'AABB collision false for disjoint boxes');

// Contact check with margin across orientations
const floorBox = { x: 100, y: 140, width: 100, height: 20 };
assert(Physics.checkContact(boxA, floorBox, 3), 'Physics.checkContact succeeds for surface contact with margin');

// Grounded & collision checks across all 4 orientations via Physics.updateBody
const pDown = { x: 100, y: 100, width: 32, height: 48, vx: 0, vy: 0, isGrounded: false, gravityDirection: 'DOWN' as GravityDirection };
const obstacles = [{ x: 50, y: 140, width: 200, height: 20 }];
Physics.updateBody(pDown, { moveX: 0, moveY: 0, jump: false }, obstacles, 0.1);
assert(pDown.isGrounded, 'Grounded detection works in DOWN gravity (on floor)');

const pUp = { x: 100, y: 41, width: 32, height: 48, vx: 0, vy: 0, isGrounded: false, gravityDirection: 'UP' as GravityDirection };
const ceilObs = [{ x: 50, y: 20, width: 200, height: 20 }];
Physics.updateBody(pUp, { moveX: 0, moveY: 0, jump: false }, ceilObs, 0.1);
assert(pUp.isGrounded, 'Grounded detection works in UP gravity (on ceiling)');

const pLeft = { x: 41, y: 100, width: 32, height: 48, vx: 0, vy: 0, isGrounded: false, gravityDirection: 'LEFT' as GravityDirection };
const leftObs = [{ x: 20, y: 50, width: 20, height: 200 }];
Physics.updateBody(pLeft, { moveX: 0, moveY: 0, jump: false }, leftObs, 0.1);
assert(pLeft.isGrounded, 'Grounded detection works in LEFT gravity (on left wall)');

const pRight = { x: 100, y: 100, width: 32, height: 48, vx: 0, vy: 0, isGrounded: false, gravityDirection: 'RIGHT' as GravityDirection };
const rightObs = [{ x: 120, y: 50, width: 20, height: 200 }];
Physics.updateBody(pRight, { moveX: 0, moveY: 0, jump: false }, rightObs, 0.1);
assert(pRight.isGrounded, 'Grounded detection works in RIGHT gravity (on right wall)');

// ----------------------------------------------------
// 2. Field of View & Quantum Observation Suite
// ----------------------------------------------------
console.log('\nSECTION 2: Quantum Observation & FOV Raycasting');
const observerRight: Observer = {
  x: 200,
  y: 300,
  facing: { x: 1, y: 0 },
  fovAngle: Math.PI * 0.75, // 135 deg
  range: 600,
};

const targetInFront = { x: 350, y: 290, width: 40, height: 40 };
const targetBehind = { x: 100, y: 290, width: 40, height: 40 };

const canSeeFront = FOVSystem.canSee(observerRight, targetInFront, []);
assert(canSeeFront, 'Observer looking forward (facing +X) sees target in front');

const canSeeBehind = FOVSystem.canSee(observerRight, targetBehind, []);
assert(!canSeeBehind, 'Observer looking forward cannot see target behind them');

// Line-of-sight occlusion by an opaque wall
const wallObstacle = { x: 270, y: 250, width: 20, height: 100 };
const canSeeOccluded = FOVSystem.canSee(observerRight, targetInFront, [wallObstacle]);
assert(!canSeeOccluded, 'Opaque wall obstacle occludes visibility line-of-sight');

// Dual observer check (both player and reflection)
const observerLeft: Observer = {
  x: 500,
  y: 300,
  facing: { x: -1, y: 0 },
  fovAngle: Math.PI * 0.75,
  range: 600,
};
assert(
  FOVSystem.isObservedByAny([observerRight, observerLeft], targetInFront, []),
  'isObservedByAny detects observation when at least one observer has line-of-sight'
);

// ----------------------------------------------------
// 3. Persistent Memory System Suite
// ----------------------------------------------------
console.log('\nSECTION 3: Persistent Room Memory Cascades');
MemorySystem.clear();
assert(MemorySystem.getEvents().length === 0, 'MemorySystem initialized clean');

MemorySystem.recordEvent({
  levelId: 2,
  roomId: 'mirror_hall',
  action: 'BREAK_MIRROR',
  objectId: 'fragile_mirror_barrier',
  character: 'PLAYER',
  description: 'Player shattered the grand chamber mirror.'
});
assert(MemorySystem.hasEvent('BREAK_MIRROR'), 'MemorySystem records BREAK_MIRROR event');

// Cross-room cascade test: Level 3 entities physically transform
const l3Data = LEVELS.find(l => l.id === 3)!;
const l3Entities: BaseEntityData[] = l3Data.entities.map(e => ({ ...e, properties: { ...e.properties } }));
const l3Tiles: TileData[] = l3Data.tiles.map(t => ({ ...t }));

const impactMirror = MemorySystem.applyPersistentStateToLevel(3, l3Entities, l3Tiles);
assert(impactMirror.appliedCount > 0, 'Room 3 inherits persistent physical changes from Room 2 mirror break');
const brokenPassage = l3Entities.find(e => e.properties?.memoryTag === 'broken_mirror_passage');
assert(brokenPassage !== undefined && brokenPassage.properties?.isBroken === true, 'Room 3 mirror passage opened');
assert((brokenPassage as any)?.isSolid === false, 'Room 3 mirror passage solid collision cleared');

// Cross-room cascade test: Observatory Hatch open blows Chandelier in Level 4
MemorySystem.recordEvent({
  levelId: 4,
  roomId: 'observatory',
  action: 'LEAVE_DOOR_OPEN',
  objectId: 'sky_hatch',
  character: 'PLAYER',
  description: 'Observatory celestial hatch left open to night drafts.'
});
const l4Data = LEVELS.find(l => l.id === 4)!;
const l4Entities: BaseEntityData[] = l4Data.entities.map(e => ({ ...e, properties: { ...e.properties } }));
const l4Tiles: TileData[] = l4Data.tiles.map(t => ({ ...t }));
const impactChandelier = MemorySystem.applyPersistentStateToLevel(4, l4Entities, l4Tiles);
assert(impactChandelier.appliedCount > 0, 'Chandelier bridge descends due to draft from open hatch');
const chandelier = l4Entities.find(e => e.id === 'floating_chandelier_bridge');
assert(chandelier !== undefined && chandelier.y === 260, 'Chandelier positioned at walkable bridge level (y=260)');

// ----------------------------------------------------
// 4. Chamber Puzzles & Multi-Mechanic Interconnection
// ----------------------------------------------------
console.log('\nSECTION 4: Interconnected Chamber Puzzles');

// Level 1: Bedroom Key & Exit Door
const l1Data = LEVELS.find(l => l.id === 1)!;
const l1Entities: EntityState[] = l1Data.entities.map(e => ({
  ...e,
  vx: 0,
  vy: 0,
  isGrounded: false,
  gravityDirection: 'DOWN' as GravityDirection,
  facing: { x: 0, y: 0 },
  isSolid: e.type === 'DOOR',
  properties: { ...e.properties },
}));

const p1 = EntityManager.createPlayer(l1Data.spawnPlayer.x, l1Data.spawnPlayer.y, 'DOWN');
let solvedName = '';
const l1Ctx: PuzzleContext = {
  levelId: 1,
  player: p1,
  reflection: null,
  activeChar: 'PLAYER',
  entities: l1Entities,
  onSolvePuzzle: (id, title) => { solvedName = title; },
  onOpenDoor: (doorId) => {},
};

// Simulate picking up key
const bedroomKey = l1Entities.find(e => e.id === 'key_bedroom')!;
bedroomKey.properties.isCollected = true;
Puzzles.update(l1Ctx);
assert(Puzzles.isSolved('l1_p1_inversion'), 'Level 1 Inversion Key puzzle solved');
assert(MemorySystem.hasEvent('COLLECT_KEY'), 'MemorySystem records COLLECT_KEY event');

// Level 2: Dual Synchronized Pressure Plates
Puzzles.resetLevelState();
const l2Data = LEVELS.find(l => l.id === 2)!;
const l2Entities: EntityState[] = l2Data.entities.map(e => ({
  ...e,
  vx: 0,
  vy: 0,
  isGrounded: false,
  gravityDirection: 'DOWN' as GravityDirection,
  facing: { x: 0, y: 0 },
  isSolid: e.type === 'DOOR' && !e.properties?.isOpen,
  properties: { ...e.properties },
}));

const p2 = EntityManager.createPlayer(l2Data.spawnPlayer.x, l2Data.spawnPlayer.y, 'DOWN');
const r2 = EntityManager.createReflection(l2Data.spawnReflection!.x, l2Data.spawnReflection!.y, 'DOWN');
const plateLeft = l2Entities.find(e => e.id === 'plate_mirror_left')!;
const plateRight = l2Entities.find(e => e.id === 'plate_mirror_right')!;
const doorMirror = l2Entities.find(e => e.id === 'door_mirror_vault')!;

const l2Ctx: PuzzleContext = {
  levelId: 2,
  player: p2,
  reflection: r2,
  activeChar: 'PLAYER',
  entities: l2Entities,
  onSolvePuzzle: (id, title) => {},
  onOpenDoor: (doorId) => {
    const door = l2Entities.find(e => e.id === doorId);
    if (door) {
      door.properties.isOpen = true;
      door.isSolid = false;
    }
  },
};

// Only 1 plate pressed -> door remains closed
plateLeft.properties.isPressed = true;
plateRight.properties.isPressed = false;
Puzzles.update(l2Ctx);
assert(!doorMirror.properties.isOpen, 'Door remains closed when only one character stands on pressure plate');

// Both plates pressed simultaneously
plateRight.properties.isPressed = true;
Puzzles.update(l2Ctx);
assert(doorMirror.properties.isOpen, 'Door opens when both Player and Reflection stand on plates simultaneously');
assert(Puzzles.isSolved('l2_p3_sync_plates'), 'Level 2 Dual Synchrony puzzle marked solved');

// Level 5: Harmonic Chimes reverse sequence communication
Puzzles.resetLevelState();
const l5Data = LEVELS.find(l => l.id === 5)!;
const l5Entities: EntityState[] = l5Data.entities.map(e => ({
  ...e,
  vx: 0,
  vy: 0,
  isGrounded: false,
  gravityDirection: 'DOWN' as GravityDirection,
  facing: { x: 0, y: 0 },
  isSolid: e.type === 'DOOR',
  properties: { ...e.properties },
}));

const p5 = EntityManager.createPlayer(l5Data.spawnPlayer.x, l5Data.spawnPlayer.y, 'DOWN');
const r5 = EntityManager.createReflection(l5Data.spawnReflection!.x, l5Data.spawnReflection!.y, 'UP');
const riftGate = l5Entities.find(e => e.id === 'reflection_rift_gate')!;

const l5Ctx: PuzzleContext = {
  levelId: 5,
  player: p5,
  reflection: r5,
  activeChar: 'PLAYER',
  entities: l5Entities,
  onSolvePuzzle: (id, title) => {},
  onOpenDoor: (doorId) => {
    const door = l5Entities.find(e => e.id === doorId);
    if (door) {
      door.properties.isOpen = true;
      door.isSolid = false;
    }
  },
};

// Player strikes runic pillars in forward sequence 0 -> 1 -> 2 -> 3
Puzzles.triggerRune(0, 'PLAYER', false);
Puzzles.triggerRune(1, 'PLAYER', false);
Puzzles.triggerRune(2, 'PLAYER', false);
Puzzles.triggerRune(3, 'PLAYER', false);

// Reflection answers in reverse harmonic sequence 3 -> 2 -> 1 -> 0
Puzzles.triggerRune(3, 'REFLECTION', true);
Puzzles.triggerRune(2, 'REFLECTION', true);
Puzzles.triggerRune(1, 'REFLECTION', true);
Puzzles.triggerRune(0, 'REFLECTION', true);

Puzzles.update(l5Ctx);
assert(Puzzles.isSolved('l5_p9_reverse_chimes'), 'Level 5 Harmonic Chimes reverse sequence solved');
assert(MemorySystem.hasEvent('HARMONIZE_CHIMES'), 'MemorySystem records HARMONIZE_CHIMES persistent event');

// ----------------------------------------------------
// 5. Narrative Endings Evaluation
// ----------------------------------------------------
console.log('\nSECTION 5: Grand Finale & Narrative Endings');

function evaluateEnding(): 'TRANSCENDENCE' | 'LIBERATION' | 'CUSTODIAN' {
  const brokeMirror = MemorySystem.hasEvent('BREAK_MIRROR');
  const harmonized = MemorySystem.hasEvent('HARMONIZE_CHIMES');

  if (brokeMirror && harmonized) {
    return 'TRANSCENDENCE';
  } else if (harmonized) {
    return 'LIBERATION';
  } else {
    return 'CUSTODIAN';
  }
}

// Case A: Transcendence (Shattered barrier + harmonized minds)
assert(evaluateEnding() === 'TRANSCENDENCE', 'Transcendence ending evaluated when both mirror broken & chimes harmonized');

// Case B: Liberation (Harmonized minds, unbroken mirror)
MemorySystem.clear();
MemorySystem.recordEvent({
  levelId: 5,
  roomId: 'harmonic_chamber',
  action: 'HARMONIZE_CHIMES',
  objectId: 'rift_gate',
  character: 'REFLECTION',
  description: 'Chimes harmonized'
});
assert(evaluateEnding() === 'LIBERATION', "Mirror's Liberation ending evaluated when harmonized without broken mirror");

// Case C: Custodian (Neither condition met)
MemorySystem.clear();
assert(evaluateEnding() === 'CUSTODIAN', 'Eternal Custodian ending evaluated when neither condition met');

console.log('\n====================================================');
console.log(`FINAL RESULTS: ${passedTests} / ${totalTests} assertions passed (${Math.round((passedTests/totalTests)*100)}%)`);
console.log('====================================================\n');

if (passedTests === totalTests) {
  console.log('✓ ALL SYSTEMS FULLY OPERATIONAL AND VERIFIED!');
} else {
  console.error('✗ SOME TESTS FAILED.');
  process.exit(1);
}
