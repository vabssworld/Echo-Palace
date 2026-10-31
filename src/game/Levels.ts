// Level Definitions & Architectural Layouts for Reverie
import { LevelData, TileData, BaseEntityData } from '../types';

export const LEVELS: LevelData[] = [
  // =========================================================================
  // LEVEL 1: THE AWAKENING (The Impossible Bedroom)
  // =========================================================================
  {
    id: 1,
    name: 'The Awakening',
    subtitle: 'The Impossible Bedroom',
    storyIntro: [
      'You open your eyes. The ceiling is below you. Or perhaps the floor is above.',
      'A faint whisper lingers in the cold air: "The house remembers. Gravity is only a suggestion."',
    ],
    objective: 'Learn dream physics, flip gravity to reach the upper desk, and unlock the strange door.',
    width: 960,
    height: 600,
    initialGravity: 'DOWN',
    allowReflection: false,
    spawnPlayer: { x: 80, y: 480 },
    hints: [
      'The high balcony is out of reach from the floor. Look for the glowing teal orb.',
      'Stepping on the Gravity Catalyst will shift your world upside-down onto the ceiling.',
      'Flip gravity to UP near the bed, walk along the ceiling to the desk, grab the Key, then flip gravity to RIGHT at the door switch.',
    ],
    loreNotes: [
      {
        id: 'note_1_1',
        x: 260,
        y: 500,
        title: 'Torn Journal Page #1',
        text: [
          '"Reality is a rule. Dreams are an exception."',
          'I built this house to preserve what was lost. But the walls have begun to breathe.',
          'When you change how you fall, the house reshapes itself to catch you.',
        ],
      },
    ],
    tiles: [
      // Outer boundaries
      { x: 0, y: 0, width: 960, height: 28, type: 'WALL', color: '#1e1b4b' },
      { x: 0, y: 560, width: 960, height: 40, type: 'FLOOR', color: '#1e1b4b' },
      { x: 0, y: 0, width: 28, height: 600, type: 'WALL', color: '#1e1b4b' },
      { x: 932, y: 0, width: 28, height: 600, type: 'WALL', color: '#1e1b4b' },

      // Ground platforms & Bedroom Furniture
      { x: 180, y: 510, width: 90, height: 50, type: 'FLOOR', color: '#312e81' },
      { x: 400, y: 520, width: 50, height: 40, type: 'FLOOR', color: '#27272a' },

      // Mid floating platforms
      { x: 500, y: 390, width: 110, height: 20, type: 'FLOOR', color: '#312e81' },
      { x: 670, y: 320, width: 110, height: 20, type: 'FLOOR', color: '#312e81' },

      // High ceiling architecture (Upside down study)
      { x: 120, y: 28, width: 260, height: 40, type: 'FLOOR', color: '#312e81' },
      { x: 380, y: 28, width: 140, height: 24, type: 'FLOOR', color: '#27272a' },

      // Vertical wall ledge on right
      { x: 860, y: 160, width: 72, height: 24, type: 'FLOOR', color: '#312e81' },
      { x: 860, y: 440, width: 72, height: 24, type: 'FLOOR', color: '#312e81' },
    ],
    entities: [
      // Gravity Switch on floor: Inverts gravity to UP
      {
        id: 'grav_orb_up',
        type: 'GRAVITY_SWITCH',
        x: 330,
        y: 520,
        width: 32,
        height: 32,
        properties: { targetGravity: 'UP', label: 'FLIP UP' },
      },
      // Gravity Switch on ceiling: Inverts gravity back to DOWN
      {
        id: 'grav_orb_down',
        type: 'GRAVITY_SWITCH',
        x: 420,
        y: 60,
        width: 32,
        height: 32,
        properties: { targetGravity: 'DOWN', label: 'FLIP DOWN' },
      },
      // Wall gravity switch: Sets gravity to RIGHT
      {
        id: 'grav_orb_right',
        type: 'GRAVITY_SWITCH',
        x: 720,
        y: 280,
        width: 32,
        height: 32,
        properties: { targetGravity: 'RIGHT', label: 'FALL RIGHT' },
      },
      // Key on the inverted ceiling desk
      {
        id: 'key_bedroom',
        type: 'KEY',
        x: 200,
        y: 80,
        width: 22,
        height: 22,
        properties: { targetDoorId: 'door_bedroom_exit' },
      },
      // Locked door leading to Level 2
      {
        id: 'door_bedroom_exit',
        type: 'DOOR',
        x: 875,
        y: 470,
        width: 14,
        height: 70,
        properties: { isOpen: false, requiresKey: 'key_bedroom' },
      },
      // Level exit portal positioned BEHIND the door
      {
        id: 'exit_level_1',
        type: 'EXIT_PORTAL',
        x: 895,
        y: 480,
        width: 32,
        height: 60,
        properties: { targetLevel: 2 },
      },
    ],
  },

  // =========================================================================
  // LEVEL 2: THE OTHER YOU (The Hall of Mirrors)
  // =========================================================================
  {
    id: 2,
    name: 'The Other You',
    subtitle: 'The Hall of Mirrors',
    storyIntro: [
      'A colossal mirror spans the center of the hall.',
      'Your reflection does not simply mimic your steps. It breathes. It watches.',
      'Press [TAB] to switch consciousness, or toggle [C] for Mirror Synchrony.',
    ],
    objective: 'Coordinate with your reflection to depress both pressure plates and shatter the mirror barrier.',
    width: 960,
    height: 600,
    initialGravity: 'DOWN',
    allowReflection: true,
    spawnPlayer: { x: 100, y: 480 },
    spawnReflection: { x: 820, y: 480 },
    hints: [
      'The central barrier divides reality from reflection. You cannot pass alone.',
      'Real Player must step on Plate A (Left) while Reflection steps on Plate B (Right).',
      'Press TAB to switch to Reflection. Approach the glowing fragile mirror and press [E] to permanently shatter it!',
    ],
    loreNotes: [
      {
        id: 'note_2_1',
        x: 180,
        y: 500,
        title: 'Architect\'s Note #2: The Dichotomy',
        text: [
          '"I tried to separate who I was from who I wanted to be."',
          'The mirror became more than glass. It became a container for everything I refused to feel.',
          'If you break the glass, the two worlds will begin to bleed into one another.',
        ],
      },
    ],
    tiles: [
      // Boundaries
      { x: 0, y: 0, width: 960, height: 28, type: 'WALL', color: '#1e1b4b' },
      { x: 0, y: 560, width: 960, height: 40, type: 'FLOOR', color: '#1e1b4b' },
      { x: 0, y: 0, width: 28, height: 600, type: 'WALL', color: '#1e1b4b' },
      { x: 932, y: 0, width: 28, height: 600, type: 'WALL', color: '#1e1b4b' },

      // Central divider wall (lowered base so jump clears easily once glass is broken)
      { x: 470, y: 28, width: 20, height: 250, type: 'WALL', color: '#4338ca' },
      { x: 470, y: 490, width: 20, height: 70, type: 'WALL', color: '#4338ca' },

      // Left chamber platforms (Player side)
      { x: 160, y: 440, width: 120, height: 20, type: 'FLOOR', color: '#312e81' },
      { x: 300, y: 340, width: 110, height: 20, type: 'FLOOR', color: '#312e81' },

      // Right chamber platforms (Reflection side)
      { x: 680, y: 440, width: 120, height: 20, type: 'FLOOR', color: '#312e81' },
      { x: 550, y: 340, width: 110, height: 20, type: 'FLOOR', color: '#312e81' },
    ],
    entities: [
      // Central Fragile Mirror barrier: Can be shattered!
      {
        id: 'fragile_mirror_barrier',
        type: 'FRAGILE_MIRROR',
        x: 475,
        y: 278,
        width: 10,
        height: 212,
        properties: { memoryTag: 'broken_mirror_passage', isBroken: false },
      },
      // Left Pressure Plate (Player side)
      {
        id: 'plate_mirror_left',
        type: 'PRESSURE_PLATE',
        x: 330,
        y: 332,
        width: 36,
        height: 8,
        properties: { targetDoorId: 'door_mirror_vault', color: '#2ee6d6' },
      },
      // Right Pressure Plate (Reflection side)
      {
        id: 'plate_mirror_right',
        type: 'PRESSURE_PLATE',
        x: 590,
        y: 332,
        width: 36,
        height: 8,
        properties: { targetDoorId: 'door_mirror_vault', color: '#c084fc' },
      },
      // Synchronized Vault Door (requires both plates active simultaneously!)
      {
        id: 'door_mirror_vault',
        type: 'DOOR',
        x: 875,
        y: 470,
        width: 14,
        height: 70,
        properties: { isOpen: false, requiresSyncPlates: ['plate_mirror_left', 'plate_mirror_right'] },
      },
      // Exit portal behind door
      {
        id: 'exit_level_2',
        type: 'EXIT_PORTAL',
        x: 895,
        y: 480,
        width: 32,
        height: 60,
        properties: { targetLevel: 3 },
      },
    ],
  },

  // =========================================================================
  // LEVEL 3: THE ROOM THAT REMEMBERS (The Chrono-Library)
  // =========================================================================
  {
    id: 3,
    name: 'The Room That Remembers',
    subtitle: 'The Chrono-Library & Resonant Courtyard',
    storyIntro: [
      'The house holds memory like stone holds heat.',
      'What you broke in the Hall of Mirrors remains shattered here.',
      'Every object moved, every latch left open, echoes into the rooms ahead.',
    ],
    objective: 'Use persistent room memory: move the Celestial Pedestal into the moonbeam socket to raise the portcullis.',
    width: 1000,
    height: 620,
    initialGravity: 'DOWN',
    allowReflection: true,
    spawnPlayer: { x: 70, y: 500 },
    spawnReflection: { x: 180, y: 500 },
    hints: [
      'The Moonbeam Gate blocks the portal. It requires focused moonlight to unlock.',
      'There is a heavy Celestial Pedestal in the west archive. Push it towards the glowing socket on the floor.',
      'Push the Pedestal until it locks into the socket at x: 420. The house will record the event and channel the beam!',
    ],
    loreNotes: [
      {
        id: 'note_3_1',
        x: 220,
        y: 520,
        title: 'Chrono-Archivist Log',
        text: [
          '"We believed we could forget by locking the past in distant rooms."',
          'Yet the house refuses to forget. Push a stone here, and a doorway opens two chambers away.',
          'Notice how the open hatch in the upper mezzanine brings an ethereal draft down into the atrium.',
        ],
      },
    ],
    tiles: [
      // Outer boundaries
      { x: 0, y: 0, width: 1000, height: 28, type: 'WALL', color: '#1e1b4b' },
      { x: 0, y: 580, width: 1000, height: 40, type: 'FLOOR', color: '#1e1b4b' },
      { x: 0, y: 0, width: 28, height: 620, type: 'WALL', color: '#1e1b4b' },
      { x: 972, y: 0, width: 28, height: 620, type: 'WALL', color: '#1e1b4b' },

      // Interior archive book towers
      { x: 260, y: 380, width: 30, height: 200, type: 'WALL', color: '#312e81' },
      { x: 620, y: 300, width: 30, height: 280, type: 'WALL', color: '#312e81' },

      // Mezzanine balcony
      { x: 290, y: 380, width: 200, height: 20, type: 'FLOOR', color: '#312e81' },
      { x: 650, y: 420, width: 180, height: 20, type: 'FLOOR', color: '#312e81' },

      // High skylight ledge
      { x: 740, y: 180, width: 160, height: 20, type: 'FLOOR', color: '#312e81' },
    ],
    entities: [
      // Fractured mirror frame from Level 2: when broken, passage into west archive is open!
      {
        id: 'mirror_passage_library',
        type: 'FRAGILE_MIRROR',
        x: 260,
        y: 200,
        width: 10,
        height: 180,
        properties: { memoryTag: 'broken_mirror_passage', isBroken: false },
      },
      // Pushable Celestial Pedestal (Movable prism)
      {
        id: 'celestial_pedestal',
        type: 'PUSHABLE_BLOCK',
        x: 120,
        y: 540,
        width: 36,
        height: 36,
        properties: {
          targetX: 420,
          targetY: 544,
          memoryTag: 'pedestal_socket',
          color: '#818cf8',
        },
      },
      // Moonbeam Socket target area indicator
      {
        id: 'moonbeam_socket',
        type: 'PRESSURE_PLATE',
        x: 420,
        y: 572,
        width: 44,
        height: 8,
        properties: {
          targetDoorId: 'moonbeam_gate',
          isMemoryTrigger: true,
          color: '#fbbf24',
        },
      },
      // The Moonbeam Gate blocking the exit
      {
        id: 'moonbeam_gate',
        type: 'DOOR',
        x: 900,
        y: 500,
        width: 14,
        height: 80,
        properties: { isOpen: false },
      },
      // Observatory Hatch (interactive: player can open it to let dream breeze in!)
      {
        id: 'observatory_hatch',
        type: 'GRAVITY_SWITCH',
        x: 820,
        y: 140,
        width: 32,
        height: 32,
        properties: {
          targetGravity: 'CYCLE',
          label: 'HATCH',
          isHatch: true,
        },
      },
      // Exit portal
      {
        id: 'exit_level_3',
        type: 'EXIT_PORTAL',
        x: 920,
        y: 510,
        width: 40,
        height: 60,
        properties: { targetLevel: 4 },
      },
    ],
  },

  // =========================================================================
  // LEVEL 4: THE IMPOSSIBLE HOUSE (The Escher Rotunda)
  // =========================================================================
  {
    id: 4,
    name: 'The Impossible House',
    subtitle: 'The Escher Rotunda',
    storyIntro: [
      'The architecture has detached from all Euclidean geometry.',
      'Walls are floors. Floors are ceilings. Objects transform the moment you look away.',
      'Do not trust what remains in your blind spot.',
    ],
    objective: 'Look away from the Quantum Monolith to compress it, then cycle 4-way gravity to navigate the spire.',
    width: 1040,
    height: 660,
    initialGravity: 'DOWN',
    allowReflection: true,
    spawnPlayer: { x: 70, y: 530 },
    spawnReflection: { x: 70, y: 380 },
    hints: [
      'A massive Quantum Monolith blocks the central archway. It is responsive to observation.',
      'Turn your character around to face LEFT (away from the monolith). When it leaves your field of view, it shrinks!',
      'Once past the monolith, use the directional gravity catalysts (Right, Up, Left) to walk across the walls and ceiling to the summit portal.',
    ],
    loreNotes: [
      {
        id: 'note_4_1',
        x: 160,
        y: 540,
        title: 'Quantum Architecture Treatise',
        text: [
          '"Things only maintain their rigid certainty when observed."',
          'In a dream, an impossible staircase only remains steep while you fear its ascent.',
          'Turn your gaze away, and the insurmountable becomes negligible.',
        ],
      },
    ],
    tiles: [
      // Boundaries
      { x: 0, y: 0, width: 1040, height: 28, type: 'WALL', color: '#1e1b4b' },
      { x: 0, y: 620, width: 1040, height: 40, type: 'FLOOR', color: '#1e1b4b' },
      { x: 0, y: 0, width: 28, height: 660, type: 'WALL', color: '#1e1b4b' },
      { x: 1012, y: 0, width: 28, height: 660, type: 'WALL', color: '#1e1b4b' },

      // Central arched barrier corridor
      { x: 260, y: 340, width: 20, height: 280, type: 'WALL', color: '#312e81' },
      { x: 260, y: 28, width: 20, height: 200, type: 'WALL', color: '#312e81' },

      // Floating Escher Spire platforms
      { x: 420, y: 480, width: 120, height: 20, type: 'FLOOR', color: '#312e81' },
      { x: 620, y: 380, width: 120, height: 20, type: 'FLOOR', color: '#312e81' },
      { x: 480, y: 240, width: 140, height: 20, type: 'FLOOR', color: '#312e81' },

      // Ceiling summit ledge
      { x: 780, y: 28, width: 180, height: 30, type: 'FLOOR', color: '#312e81' },
      { x: 940, y: 200, width: 72, height: 24, type: 'FLOOR', color: '#312e81' },
    ],
    entities: [
      // The Quantum Monolith: 68x110 when observed, 20x20 when unobserved!
      {
        id: 'quantum_monolith_arch',
        type: 'QUANTUM_BOX',
        x: 236,
        y: 230,
        width: 68,
        height: 110,
        properties: {
          observedWidth: 68,
          observedHeight: 110,
          unobservedWidth: 20,
          unobservedHeight: 20,
          isObserved: true,
        },
      },
      // Gravity Catalysts: 4-Way Navigation
      {
        id: 'grav_orb_right_rotunda',
        type: 'GRAVITY_SWITCH',
        x: 540,
        y: 440,
        width: 32,
        height: 32,
        properties: { targetGravity: 'RIGHT', label: 'FALL RIGHT' },
      },
      {
        id: 'grav_orb_up_rotunda',
        type: 'GRAVITY_SWITCH',
        x: 960,
        y: 260,
        width: 32,
        height: 32,
        properties: { targetGravity: 'UP', label: 'FALL UP' },
      },
      {
        id: 'grav_orb_down_rotunda',
        type: 'GRAVITY_SWITCH',
        x: 820,
        y: 65,
        width: 32,
        height: 32,
        properties: { targetGravity: 'DOWN', label: 'FALL DOWN' },
      },
      // Floating chandelier bridge affected by Level 3 draft
      {
        id: 'floating_chandelier_bridge',
        type: 'PUSHABLE_BLOCK',
        x: 740,
        y: 360,
        width: 50,
        height: 20,
        properties: {
          draftBridgeX: 740,
          draftBridgeY: 260,
          color: '#fb7185',
        },
      },
      // Exit Portal at the summit
      {
        id: 'exit_level_4',
        type: 'EXIT_PORTAL',
        x: 880,
        y: 35,
        width: 40,
        height: 60,
        properties: { targetLevel: 5 },
      },
    ],
  },

  // =========================================================================
  // LEVEL 5: THE REFLECTION'S WORLD (The Inverted Realm)
  // =========================================================================
  {
    id: 5,
    name: "The Reflection's World",
    subtitle: 'The Inverted Realm & Runic Harmonic Chimes',
    storyIntro: [
      'You step into the reflection’s own domain.',
      'Here, your reflection walks upon the ceiling while you walk upon the floor.',
      'Sound and pattern bridge the divide between your reality and its truth.',
    ],
    objective: 'Play the 4 Harmonic Chimes in forward sequence as Player, then in reverse sequence as Reflection.',
    width: 1040,
    height: 660,
    initialGravity: 'DOWN',
    mirrorGravity: 'UP',
    allowReflection: true,
    spawnPlayer: { x: 80, y: 530 },
    spawnReflection: { x: 80, y: 70 },
    hints: [
      'Four colored Rune Chimes line the hall: 1 (Amber), 2 (Cyan), 3 (Rose), 4 (Indigo).',
      'As Player, step past or interact with pillars 1 -> 2 -> 3 -> 4 to prime the harmonic frequency.',
      'Then switch to Reflection [TAB] walking on the ceiling, and trigger them in reverse: 4 -> 3 -> 2 -> 1!',
    ],
    loreNotes: [
      {
        id: 'note_5_1',
        x: 220,
        y: 540,
        title: 'Reflection\'s Whisper',
        text: [
          '"You have been trying to command me, as if I were a tool."',
          'I am not an echo to be directed. I am the counterpart you abandoned.',
          'Speak to me in reverse, and I will open the gates of memory.',
        ],
      },
    ],
    tiles: [
      // Outer boundaries
      { x: 0, y: 0, width: 1040, height: 28, type: 'WALL', color: '#1e1b4b' },
      { x: 0, y: 620, width: 1040, height: 40, type: 'FLOOR', color: '#1e1b4b' },
      { x: 0, y: 0, width: 28, height: 660, type: 'WALL', color: '#1e1b4b' },
      { x: 1012, y: 0, width: 28, height: 660, type: 'WALL', color: '#1e1b4b' },

      // Mid glass horizontal stratum
      { x: 100, y: 320, width: 240, height: 16, type: 'DREAM_GLASS', color: '#4c1d95' },
      { x: 440, y: 320, width: 240, height: 16, type: 'DREAM_GLASS', color: '#4c1d95' },
      { x: 780, y: 320, width: 220, height: 16, type: 'DREAM_GLASS', color: '#4c1d95' },
    ],
    entities: [
      // 4 Rune Pillars on floor for Player (Indexes 0, 1, 2, 3)
      {
        id: 'rune_floor_0',
        type: 'RUNE_PILLAR',
        x: 200,
        y: 572,
        width: 28,
        height: 48,
        properties: { runeIndex: 0, symbol: '🜂', color: '#f59e0b' },
      },
      {
        id: 'rune_floor_1',
        type: 'RUNE_PILLAR',
        x: 420,
        y: 572,
        width: 28,
        height: 48,
        properties: { runeIndex: 1, symbol: '🜄', color: '#06b6d4' },
      },
      {
        id: 'rune_floor_2',
        type: 'RUNE_PILLAR',
        x: 640,
        y: 572,
        width: 28,
        height: 48,
        properties: { runeIndex: 2, symbol: '🜁', color: '#ec4899' },
      },
      {
        id: 'rune_floor_3',
        type: 'RUNE_PILLAR',
        x: 840,
        y: 572,
        width: 28,
        height: 48,
        properties: { runeIndex: 3, symbol: '🜃', color: '#6366f1' },
      },

      // 4 Inverted Rune Pillars on ceiling for Reflection
      {
        id: 'rune_ceiling_0',
        type: 'RUNE_PILLAR',
        x: 200,
        y: 28,
        width: 28,
        height: 48,
        properties: { runeIndex: 0, symbol: '🜂', color: '#f59e0b', isInverted: true },
      },
      {
        id: 'rune_ceiling_1',
        type: 'RUNE_PILLAR',
        x: 420,
        y: 28,
        width: 28,
        height: 48,
        properties: { runeIndex: 1, symbol: '🜄', color: '#06b6d4', isInverted: true },
      },
      {
        id: 'rune_ceiling_2',
        type: 'RUNE_PILLAR',
        x: 640,
        y: 28,
        width: 28,
        height: 48,
        properties: { runeIndex: 2, symbol: '🜁', color: '#ec4899', isInverted: true },
      },
      {
        id: 'rune_ceiling_3',
        type: 'RUNE_PILLAR',
        x: 840,
        y: 28,
        width: 28,
        height: 48,
        properties: { runeIndex: 3, symbol: '🜃', color: '#6366f1', isInverted: true },
      },

      // Reflection Rift Gate
      {
        id: 'reflection_rift_gate',
        type: 'DOOR',
        x: 940,
        y: 270,
        width: 14,
        height: 100,
        properties: { isOpen: false },
      },

      // Exit Portal
      {
        id: 'exit_level_5',
        type: 'EXIT_PORTAL',
        x: 960,
        y: 290,
        width: 40,
        height: 60,
        properties: { targetLevel: 6 },
      },
    ],
  },

  // =========================================================================
  // LEVEL 6: THE LAST MEMORY (The Core of Remembering)
  // =========================================================================
  {
    id: 6,
    name: 'The Last Memory',
    subtitle: 'The Chronos Core & Memory Loom',
    storyIntro: [
      'The heart of the house. Here, all memories converge.',
      'The choices you made in every previous room have crystallized into the fabric of this chamber.',
      'Gravity, reflection, and memory must become one.',
    ],
    objective: 'Unify all three mechanics: maintain gaze on the quantum bridge, coordinate dual switches, and reach the Core.',
    width: 1200,
    height: 720,
    initialGravity: 'DOWN',
    allowReflection: true,
    spawnPlayer: { x: 80, y: 600 },
    spawnReflection: { x: 80, y: 440 },
    hints: [
      'The Quantum Bridge across the chasm only solidifies when Reflection keeps its eyes on it.',
      'Position Reflection to look right towards the bridge (x: 440), then switch to Player to cross.',
      'On the far side, flip gravity to reach the Apex Dais where the final choice awaits.',
    ],
    loreNotes: [
      {
        id: 'note_6_1',
        x: 200,
        y: 610,
        title: 'The Architect\'s Final Confession',
        text: [
          '"I tried to run from memory by creating this maze."',
          'Now I realize: The house didn\'t trap me. I trapped myself inside my own refusal to remember.',
          'Step into the Core together. Awaken from the reverie.',
        ],
      },
    ],
    tiles: [
      // Outer boundaries
      { x: 0, y: 0, width: 1200, height: 28, type: 'WALL', color: '#1e1b4b' },
      { x: 0, y: 680, width: 1200, height: 40, type: 'FLOOR', color: '#1e1b4b' },
      { x: 0, y: 0, width: 28, height: 720, type: 'WALL', color: '#1e1b4b' },
      { x: 1172, y: 0, width: 28, height: 720, type: 'WALL', color: '#1e1b4b' },

      // Bottom chasm hazard
      { x: 380, y: 680, width: 340, height: 40, type: 'VOID_HAZARD', color: '#450a0a' },

      // Left staging ledges
      { x: 28, y: 480, width: 280, height: 20, type: 'FLOOR', color: '#312e81' },
      { x: 160, y: 360, width: 140, height: 20, type: 'FLOOR', color: '#312e81' },

      // Right sanctuary platforms
      { x: 740, y: 680, width: 432, height: 40, type: 'FLOOR', color: '#1e1b4b' },
      { x: 820, y: 520, width: 200, height: 20, type: 'FLOOR', color: '#312e81' },
      { x: 700, y: 360, width: 180, height: 20, type: 'FLOOR', color: '#312e81' },

      // Apex dais on ceiling
      { x: 500, y: 28, width: 240, height: 32, type: 'FLOOR', color: '#4338ca' },
    ],
    entities: [
      // Quantum Bridge over chasm: solid when observed by reflection
      {
        id: 'quantum_bridge_chasm',
        type: 'QUANTUM_BOX',
        x: 380,
        y: 672,
        width: 340,
        height: 16,
        properties: {
          observedWidth: 340,
          observedHeight: 16,
          unobservedWidth: 20,
          unobservedHeight: 16,
          isObserved: true,
          color: '#38bdf8',
        },
      },
      // Gravity Catalysts
      {
        id: 'grav_orb_up_core',
        type: 'GRAVITY_SWITCH',
        x: 880,
        y: 470,
        width: 32,
        height: 32,
        properties: { targetGravity: 'UP', label: 'ASCEND UP' },
      },
      {
        id: 'grav_orb_down_core',
        type: 'GRAVITY_SWITCH',
        x: 580,
        y: 65,
        width: 32,
        height: 32,
        properties: { targetGravity: 'DOWN', label: 'DESCEND' },
      },
      // Dual Synchronized Core Nexus Plates (with proper contact bounds)
      {
        id: 'plate_core_player',
        type: 'PRESSURE_PLATE',
        x: 540,
        y: 56,
        width: 36,
        height: 10,
        properties: { targetDoorId: 'core_revelation_gate', color: '#2ee6d6' },
      },
      {
        id: 'plate_core_reflection',
        type: 'PRESSURE_PLATE',
        x: 660,
        y: 56,
        width: 36,
        height: 10,
        properties: { targetDoorId: 'core_revelation_gate', color: '#c084fc' },
      },
      // Core Revelation Gate
      {
        id: 'core_revelation_gate',
        type: 'DOOR',
        x: 600,
        y: 28,
        width: 40,
        height: 32,
        properties: { isOpen: false, requiresSyncPlates: ['plate_core_player', 'plate_core_reflection'] },
      },
      // The Final Awakening Core Portal
      {
        id: 'final_core_portal',
        type: 'EXIT_PORTAL',
        x: 595,
        y: 65,
        width: 50,
        height: 60,
        properties: { isGameEnding: true },
      },
    ],
  },
];
