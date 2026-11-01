# One Piece: Romance Dawn & Orange Town - Metal Slug Style Stage & Dynamic Weather

A cinematic expansion to the East Blue beat 'em up featuring dynamic marine weather particles, overlay layering bug fixes, new circus-themed enemy types, and a brand new linear scrolling progression stage for Orange Town inspired by classic 2D scrolling arcade shooters (Metal Slug style), complete with animated comic cutscenes.

## User Review & Critical Decisions

> [!IMPORTANT]
> The following design decisions were confirmed during Phase 1 clarification:

- **Confirmed Decision 1 (Atmospheric Weather)**: Alvida's ship stage will feature layered atmospheric weather: ocean sea spray mist drifting across the sea horizon and gentle diagonal rain droplets with water ripples on the deck floorboards.
- **Confirmed Decision 2 (Buggy Circus Enemies)**: Two new distinct circus enemy variants for the Buggy pirate crew:
  1. *Acrobat Knife Jugglers*: Fast, agile acrobats who perform backflips and throw curved juggling daggers.
  2. *Unicycle Clown Sword Fighters*: Rapid mobile combatants balancing on single wheels with twin cutlasses and spinning dash slices.
- **Confirmed Decision 3 (Linear Scrolling Progression)**: The Orange Town Buggy stage will abandon static waves in favor of a true *Metal Slug / Final Fight* linear scrolling advance: the camera scrolls forward as the player travels down the streets of Orange Town, encountering destructible barricades, barricaded clown cannons, and environmental ambush gates before reaching the big-top circus boss arena.
- **Confirmed Decision 4 (Finisher Overlay Bug Fix)**: Fix the `FinisherCinematicOverlay` persistence bug:
  - Add explicit lifecycle guards so that cinematic overlays immediately self-terminate and clear state upon stage transition, victory, game over, or cutscene trigger.
  - Ensure cutscenes (`CutsceneOverlay`) and dialogue boxes always render above any lingering combat visual effects with proper z-indexing (`z-50` for cutscenes, `z-35` for finisher overlays, clean unmounting).

---

## 1. Overview & Core Concept

- **What It Does**: Enhances visual immersion in East Blue stages with real-time procedural weather particles (sea spray and rain), guarantees clean UI transitions without persistent finisher cut-in overlays, adds circus-themed enemy archetypes with distinct combat behaviors, and introduces a dedicated continuous-advance Orange Town level with cinematic manga cutscenes.
- **Target Audience**: Fans of retro arcade beat 'em ups (Capcom CPS-2, Neo-Geo Metal Slug, GBA One Piece) looking for dynamic combat, fluid movement, and authentic manga aesthetic.
- **Key Value**: Replaces wave-bound waiting with high-energy continuous forward momentum, richer enemy counter-play, and seamless narrative cutscenes.

---

## 2. User Experience & Visual Design

### Key User Flows

1. **Alvida Ship Atmosphere**: When playing Stage 1, 2, or 3, dynamic mist particles drift over the ocean backdrop, while delicate diagonal rain streaks and deck splash rings bring the ship to life without distracting from combat readability.
2. **Smooth Special Move Finisher**: Triggering Luffy's *Gomu Gomu no Bazooka* or Zoro's *Sanzen Sekai* plays the high-impact manga cut-in. When dialogue triggers or the stage ends, the overlay cleanly clears without lingering on top of text or subsequent screens.
3. **Orange Town Metal Slug Style March**:
   - **Opening Cinematic**: Animated manga scene introducing Buggy the Clown and the ruined streets of Orange Town with Mayor Boodle's dog Chouchou and the circus crew.
   - **Forward Push**: The camera unlocks and tracks the player smoothly across a wide 2400px street scene.
   - **Destructible Barricades**: Wooden barricades and clown carnival wagons block forward progress until demolished.
   - **New Enemies**: Acrobat knife jugglers jumping from rooftops, unicycle clowns darting across streets, and circus cannon crews.
   - **Big-Top Arena**: Reaching the final tent triggers the duel against Buggy the Star Clown with special Bara Bara no Mi splitting body mechanics.

### Visual Identity & Theme

- **Color Palette**:
  - Sky/Weather: Deep ocean blue (`#0f2b48`), atmospheric sea spray (`#e0f2fe/30`), rain sheen (`#93c5fd/40`).
  - Orange Town: Mediterranean terracotta tiles (`#c2410c`), sunny stucco walls (`#fef3c7`), circus striped banners (`#ef4444` and `#ffffff`), and Buggy purple/gold accents (`#7e22ce`).
- **Typography & Layout**:
  - Arcade headers: `Bungee` for stage alerts (`"GO! ▶"`, `"BARRICADA!"`).
  - Dialogue font: `Bricolage Grotesque` and `Plus Jakarta Sans` with high contrast speech balloons and portrait avatars.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Procedural Canvas Weather vs. DOM Elements**
  - *Chosen Approach*: Procedural canvas particle pool inside `SpriteRenderer` and `GameEngine`.
  - *Why*: Ensures zero DOM overhead, perfectly synchronized with camera scrolling, and zero lag or memory leaks.
- **Decision 2: Finisher Overlay State Management**
  - *Chosen Approach*: Add automatic dismissal callbacks and event unmount triggers in `App.tsx` and `FinisherCinematicOverlay.tsx`, resetting `finisherData` whenever `gameState !== 'PLAYING'`.
  - *Why*: Completely eliminates the overlay stuck bug regardless of whether the player finishes the boss or triggers a dialogue.
- **Decision 3: Metal Slug Linear Camera & Barricade Walls**
  - *Chosen Approach*: Dynamic `maxCamX` camera boundary locked to destructible barricade entity coordinates until the barricade is destroyed, triggering a classic flashing `"GO! ▶"` prompt.
  - *Why*: Captures the authentic arcade progression feel of Metal Slug and Streets of Rage without rigid wave countdowns.

---

## 4. Technical Architecture & Data Strategy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                 APP.TSX                                     │
│  State: gameState ('TITLE_MENU' | 'PLAYING' | 'PROLOGUE' | 'VICTORY' etc.)   │
│  Active Dialogues | Finisher State Manager | Mute State                     │
└──────────────┬──────────────────────────────┬───────────────────────────────┘
               │                              │
               ▼                              ▼
 ┌───────────────────────────┐  ┌─────────────────────────────────────────────┐
 │    GameHUD & Overlays     │  │             GAME CANVAS (60 FPS)            │
 │ • Z-Index 50: Cutscenes   │  │ • Background Weather Particles              │
 │ • Z-Index 45: Modals      │  │   (Sea spray, sea mist, rain droplets)      │
 │ • Z-Index 35: Finisher FX │  │ • Parallax Orange Town Street Scenery       │
 │   (Auto-clears on exit)   │  │ • Linear Camera Scroll (0px -> 2400px)      │
 └───────────────────────────┘  └──────────────────────┬──────────────────────┘
                                                       │
                                                       ▼
                                ┌─────────────────────────────────────────────┐
                                │             GAME ENGINE SIMULATION          │
                                │ • Continuous linear scrolling bounds        │
                                │ • Destructible barricades with HP & smash   │
                                │ • New Enemy AI: Acrobat Knife Juggler,      │
                                │   Unicycle Clown Swordsman                  │
                                │ • Barricade Clear "GO! ▶" Prompts           │
                                └─────────────────────────────────────────────┘
```

### Component & File Work Breakdown

1. **Weather System (`src/game/weather.ts` & `src/game/sprites.ts`)**:
   - Create lightweight weather simulator generating sea spray mist puffs and angled rain droplets with puddle ripples on the ship deck.
2. **Finisher Overlay Fix (`src/components/FinisherCinematicOverlay.tsx` & `src/App.tsx`)**:
   - Add auto-dismiss timeout safeguards and lifecycle cleanup: if `gameState` changes to cutscene or victory/modal, clear `finisherData` immediately.
3. **Orange Town Linear Scrolling Stage (`src/game/engine.ts` & `src/game/sprites.ts`)**:
   - Implement `isLinearStage` mode for `STAGE_7_ORANGE_TOWN` with extended track length (2400px).
   - Add `BarricadeEntity` blocking player and camera advance until smashed.
   - Render flashing `"AVANCE! GO! ▶"` street arrow when barricades fall.
4. **New Circus Enemy Variants (`src/game/types.ts`, `src/game/sprites.ts`, `src/game/engine.ts`)**:
   - `ENEMY_CLOWN_ACROBAT`: High-jump, backflip, throwing curved juggler daggers.
   - `ENEMY_CLOWN_UNICYCLE`: Rapid ground wheels, spinning twin-cutlass dash.
5. **Cinematic Cutscenes for Orange Town (`src/game/dialogues.ts`)**:
   - Add rich animated comic dialogues for Orange Town: meeting Buggy, Cabaji, Mohji, and Chouchou.
