# One Piece GBA: Combo Finisher & Cinematic Specials Plan

Implement an arcade **Combo Finisher** mechanic for Luffy and Zoro at 15+ combo hits, create dramatic **anime cut-in cinematic scenes** for special moves (*Gomu Gomu no Bazooka* and *Santoryu Ougi*), ensure seamless **stage progression from Alvida to Zoro's Shells Town saga**, and **rebalance combat feel** with telegraphed enemy windups and responsive dodge windows.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The Combo Finisher activates dynamically when your combo meter reaches 15 or higher. The Special button will ignite with a golden lightning flare and arcade pulse. Activating it triggers a dynamic anime freeze-frame cut-in before unleashing an explosive screen-clearing blast.

- **Combo Finisher Trigger**: Combo count $\ge 15$ unlocks the Finisher. Activating Special consumes the finisher charge without draining regular energy, granting temporary invulnerability and dealing massive damage to all enemies in range.
- **Cinematic Attack Presentation**: A high-impact 0.6s anime freeze-frame cut-in with character eye-glint, Japanese kanji title banner, dynamic speed lines, and explosive camera zoom, flowing seamlessly into the in-game attack animation without breaking game rhythm.
- **Saga Flow**: Beating Alvida now directly advances the Story Mode into Shells Town Chapter 4 (Courtyard with tied Zoro) instead of stopping at victory, keeping the adventure rolling.
- **Combat Balance**: Grunts, Brutes, Gunners, and Bosses receive visual windup warning flashes (red eye flash / weapon gleam) before attacking, giving the player clear windows to dodge, jump, or interrupt. Player invulnerability on hurt is tuned to prevent unfair chain hits.

---

## 1. Overview & Core Concept

- **What It Does**: Elevates the beat 'em up combat loop with high-reward Combo Finishers at 15+ hits, cinematic anime cut-ins for signature attacks (*Gomu Gomu no Bazooka* and *Santoryu Ougi*), smooth story continuity between the Alvida and Zoro sagas, and balanced, telegraphed combat.
- **Target Experience**: Fast-paced, responsive retro GBA arcade action with genuine shonen manga drama and satisfying crowd control.

---

## 2. User Experience & Visual Design

### A. Combo Finisher UI & Visual Feedback
- **HUD & Virtual Button Awakening**:
  - When combo reaches 15 hits, HUD combo counter bursts with a flame effect *"FINISHER READY!"*.
  - Virtual Special button ignites with swirling golden energy particles and pulsing border glow.
  - Keyboard prompts (Space / U) flash with a glowing finisher tag on the HUD.
- **Cinematic Anime Cut-in**:
  - **Luffy (*Gomu Gomu no Bazooka*)**: Red and gold diagonal split-panel cut-in. Luffy pulls both rubber arms far into the background with determined battle eyes under the straw hat shadow. Bold kanji: 『ゴムゴムのバズーカ!!』. The blast unleashes two gigantic stretching palm shockwaves that push and blast through all surrounding enemies!
  - **Zoro (*Santoryu Ougi: Sanzen Sekai*)**: Emerald green and steel-blue diagonal cut-in. Zoro grins with Wado Ichimonji clamped in his jaw, bandana tied, eyes glowing with demon aura. Bold kanji: 『三刀流奥義 三千世界!!』. Zoro dashes forward slicing the wind in a triple-katana whirlwind!

### B. Combat Balance & Telegraphs
- **Enemy Attack Telegraphs**:
  - Enemies show an exclamation mark warning or red gleam during their attack windup (0.35s–0.5s), giving the player time to react.
  - Pirate gunners and Marine riflemen show an aiming laser line before firing.
  - Bosses (Alvida's Iron Mace Slam and Morgan's 360° Axe Cleave) have pronounced ground warning rings before striking.
- **Player Damage & Recovery**:
  - Extended i-frames (0.55s) after taking heavy hits to eliminate cheap juggle combos.
  - Dash maneuver grants brief evasion priority against grunts.

### C. Seamless Saga Progression: Alvida to Zoro
- Defeating Alvida in Stage 3 plays her KO cutscene, unlocks Stage 4 in Story Mode, and the victory sequence smoothly prompts: *"CONTINUAR PARA SHELLS TOWN (SAGA DO ZORO) ▶"*.
- Story transition automatically loads the Marine Base Courtyard dialogue where Luffy and Coby find Zoro tied to the execution post.

---

## 3. Technical Architecture & System Flow

```
┌─────────────────────────────────────────────────────────────┐
│                       GameEngine                            │
│  - combo >= 15 -> isFinisherReady = true                   │
│  - triggerFinisher() -> activates cinematic state           │
│  - updates enemies with telegraph windup timers             │
└───────────────────────┬─────────────────────────────────────┘
                        │
       ┌────────────────┴────────────────┐
       ▼                                 ▼
┌───────────────────────────┐   ┌───────────────────────────┐
│     Cinematic Cut-In      │   │    Finisher Execution     │
│  - 0.6s hitstop/slowdown  │   │  - Luffy: Dual-arm Bazooka│
│  - Anime eye panel (SVG)  │   │  - Zoro: Santoryu Cleave  │
│  - Japanese calligraphy   │   │  - Screen-clearing blast  │
│  - Screen shake & flash   │   │  - Massive knockback      │
└───────────────────────────┘   └───────────────────────────┘
```

---

## 4. Implementation Steps

1. **Finisher Logic in Engine (`src/game/engine.ts`)**:
   - Add `comboFinisherReady` state flag when `player.combo >= 15`.
   - Update `executePlayerSpecial()`: if `comboFinisherReady` is active, trigger cinematic cut-in and execute full-screen finisher (*Bazooka* for Luffy, *Sanzen Sekai* for Zoro) without consuming standard energy.
   - Reset combo and finisher state after execution.

2. **Cinematic Cut-in Overlay Component (`src/components/FinisherCinematicOverlay.tsx`)**:
   - Render high-voltage anime cut-in bar with character portraits, speed lines, Japanese typography, and glowing borders during the 0.6s finisher windup.

3. **Enemy Telegraphs & Combat Tuning (`src/game/engine.ts` & `src/game/sprites.ts`)**:
   - Add visual telegraph flash on enemies during `windupTimer`.
   - Rebalance hitboxes, enemy attack recovery, and player recovery frames.

4. **Saga Flow Continuation (`src/App.tsx` & `src/components/VictoryModal.tsx`)**:
   - In VictoryModal and engine transition, when Stage 3 is beaten, seamlessly offer direct progression to Stage 4 (Zoro Courtyard).

5. **Verification**:
   - Test 15+ combo charge trigger on mobile controls and keyboard.
   - Verify cinematic cut-in visual timing and enemy clearing blast.
   - Run `lint_applet` and `compile_applet`.
