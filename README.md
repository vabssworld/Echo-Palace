# REVERIE: THE HOUSE THAT REMEMBERS

> *"Reality is a rule. Dreams are an exception."*

**REVERIE** is a complete, fully playable, browser-based surreal puzzle-adventure game crafted with React, TypeScript, HTML5 Canvas, CSS, and procedural Web Audio API synthesis.

---

## 🌌 The Premise & World

You awaken inside an impossible house with no memory of who you are or how you entered. Normal physics does not exist, gravity is only a suggestion, your reflection operates with its own consciousness, and the house remembers your every action.

```
"The house remembers.
The mirror lies.
Gravity is only a suggestion.
Find the exit before the house forgets you."
```

---

## 🕹️ The Three Core Gameplay Mechanics

### 1. Dream Logic (4-Way Gravity & Quantum Observation)
- **4-Directional Gravity:** Step on or activate Gravity Catalysts to fall **DOWN**, **UP**, **LEFT**, or **RIGHT**. Walk smoothly along ceilings and vertical walls.
- **Quantum Observation Raycasting:** Physical reality is unstable when unobserved. A geometric field-of-view cone and raycast occlusion system tracks what is in your sightline:
  - Turning your back on the **Quantum Monolith** causes it to compress to a miniature stepping stone.
  - Cooperate with your reflection: one watches an unstable quantum bridge to keep it solid while the other crosses the void!

### 2. Mirror Me (Dual Consciousness & Reflection Synchrony)
- **Independent Reflection Entity:** Press **`[TAB]`** (or touch the Mind badge) to switch control between your **Real Self** (ethereal cyan cloak) and your **Mirror Reflection** (spectral violet glitch).
- **Physical Inactive Presence:** The inactive self remains in the world holding down pressure plates, anchoring sightlines, or blocking hazards.
- **Runic Counterpoint Communication:** Level 5 introduces musical harmonic chimes where the Player plays forward ($1 \rightarrow 2 \rightarrow 3 \rightarrow 4$) and the ceiling-bound Reflection plays the exact inverted reverse sequence ($4 \rightarrow 3 \rightarrow 2 \rightarrow 1$).

### 3. The Room That Remembers (Persistent Event Memory)
- **Living World State:** Every key action is stored in the `MemorySystem`:
  - Shattering the fragile mirror partition in Room 2 permanently removes the barrier in subsequent rooms, allowing your reflection to roam freely into your wing.
  - Relocating the heavy Celestial Pedestal in the Chrono-Library redirects moonlight into the locked portcullis.
  - Leaving the upper observatory hatch unlatched draws an ethereal dream draft into the courtyard, pushing a suspended chandelier into place as a walkable bridge.
- **Live Memory Timeline:** Press **`[M]`** at any time to open the **What The House Remembers** log.

---

## 🏰 Level Progression & Puzzles

| Level | Title | Location | Core Puzzle & Mechanics |
| :--- | :--- | :--- | :--- |
| **01** | **The Awakening** | *The Impossible Bedroom* | Bedpost gravity flip to UP, ceiling walk across hanging furniture, wall-switch to RIGHT, Silver Key grab. |
| **02** | **The Other You** | *The Hall of Mirrors* | Reflection introduction, TAB switching, dual synchronized pressure plates, fragile mirror shatter. |
| **03** | **The Room That Remembers** | *The Chrono-Library* | Cross-room persistent consequences, pushable Celestial Pedestal, moonlight refraction, observatory draft. |
| **04** | **The Impossible House** | *The Escher Rotunda* | 4-way gravity carousel, Quantum Monolith observation-shrink, suspended draft bridge traversal. |
| **05** | **The Reflection's World** | *The Inverted Realm* | Inverted gravity (Player on floor, Reflection on ceiling), reverse harmonic chimes ($0123 \rightarrow 3210$). |
| **06** | **The Last Memory** | *The Chronos Core* | Grand combination of all 3 mechanics: reflection gaze-holding on quantum bridge, dual Apex Core Nexus, 3 distinct story endings! |

---

## 🏆 Multiple Story Endings

Depending on how you treat your reflection and the choices recorded in the memory log:
1. **Ending I: The True Lucid Awakening (Synchrony):** Shattered the mirror, listened to your reflection, and unlocked the true morning light.
2. **Ending II: The Eternal Custodian:** Solved the house alone while subjugating your reflection, becoming its eternal curator.
3. **Ending III: The Mirror's Liberation:** Freed your reflection through the harmonic counterpoint to step into reality while you maintain the sanctuary.

---

## 🎮 Controls & Live Hackathon Demonstration

### Desktop Keyboard & Mouse
| Key / Input | Action |
| :--- | :--- |
| **`A` / `D`** or **`◀` / `▶`** | Walk horizontally / vertically along walls |
| **`W` / `Space`** or **`▲`** | Jump / Leap against active gravity |
| **`TAB`** or **Click Mind Badge** | Switch Active Consciousness (Real Self $\leftrightarrow$ Reflection) |
| **`C`** or **Click Sync Button** | Toggle Mirror Synchrony (Opposite Movement) |
| **`E`** or **Touch [E]** | Interact (Touch switch, shatter mirror, resonate rune, read notes) |
| **`T`** or **Click Rules** | Open **Dream Mechanics Tutorial** (3 core rules) |
| **`M`** or **Click Memories** | Open **What The House Remembers** persistent timeline |
| **`R`** or **Click Restart** | Restart current room (preserves global persistent memories) |
| **`ESC`** or **Click Menu** | Pause Menu & **Hackathon Chamber Select (Quick Jump to any room)** |

### Live Hackathon Demo Features
- **Auto Tutorial on New Game:** Automatically introduces the 3 dream rules without spoiling solutions.
- **Hackathon Chamber Select:** Access via Pause Menu (`[ESC]`) to jump instantly to any of the 6 chambers during presentations.
- **Safe Room Restart (`[R]`):** Restarts the active room without wiping global persistent memory events.
- **State Persistence:** LocalStorage auto-saves room progress and persistent world events.

### Mobile / Tablet Touch Controls
- **Virtual D-Pad:** 4-way direction pad on bottom-left.
- **Action Buttons:** Dedicated `[E]` Interact, `LEAP` Jump, `TAB` Switch, and `SYNC` toggle on bottom-right.

---

## 🔊 Sound Design

- **100% Procedural Web Audio API:** Zero external audio dependencies or broken URLs.
- Dreamy ambient synth chords (Dm9, Bbmaj7#11, Cadd9, Asus4) with slow LFO resonant filters.
- Responsive sound effects: footstep clicks, sub-bass gravity whooshes, dual-tone character switch chimes, pressure plate mechanical clicks, and triumphant dream chords on puzzle completion.
- Full volume sliders and mute toggles in the Pause Menu.

---

## 🚀 How to Run & Play

The project is compiled into an ultra-fast, self-contained bundle.

### Option 1: Direct File Opening
Double-click `index.html` in any modern web browser (Chrome, Edge, Firefox, Safari).

### Option 2: Local HTTP Server (Recommended)
Run any local server in the project directory:
```bash
# Using Python
python -m http.server 8080

# Using Node / npx
npx serve .
```
Then navigate to `http://localhost:8080`.

### Rebuilding from Source
```bash
# Compiles src/index.tsx into dist/bundle.js & dist/bundle.css
node build.js
```
