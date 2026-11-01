/**
 * One Piece Beat 'Em Up - Multi-Slot Save Management System
 * Supports 3 independent pirate log save slots with progress preview,
 * character unlocks, stage completion, high scores, and berries.
 */

import { PlayerCharacter } from './types';

export interface SaveSlot {
  id: 'slot-1' | 'slot-2' | 'slot-3';
  name: string;
  character: PlayerCharacter;
  unlockedStage: number; // 1 to 7
  unlockedCharacters: PlayerCharacter[];
  highScore: number;
  berries: number;
  totalDefeated: number;
  playTimeMinutes: number;
  createdAt: number;
  updatedAt: number;
}

const STORAGE_KEY_SLOTS = 'one_piece_save_slots_v2';
const STORAGE_KEY_ACTIVE = 'one_piece_active_save_slot_v2';

const DEFAULT_SLOTS: Record<string, SaveSlot> = {
  'slot-1': {
    id: 'slot-1',
    name: 'Bando do Chapéu de Palha',
    character: 'LUFFY',
    unlockedStage: 1,
    unlockedCharacters: ['LUFFY'],
    highScore: 0,
    berries: 1200,
    totalDefeated: 0,
    playTimeMinutes: 0,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  'slot-2': {
    id: 'slot-2',
    name: 'Caçador de Piratas',
    character: 'ZORO',
    unlockedStage: 1,
    unlockedCharacters: ['LUFFY'],
    highScore: 0,
    berries: 500,
    totalDefeated: 0,
    playTimeMinutes: 0,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  'slot-3': {
    id: 'slot-3',
    name: 'Novo Registro de Bordo',
    character: 'LUFFY',
    unlockedStage: 1,
    unlockedCharacters: ['LUFFY'],
    highScore: 0,
    berries: 0,
    totalDefeated: 0,
    playTimeMinutes: 0,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
};

export class SaveManager {
  private static cachedSlots: Record<string, SaveSlot> | null = null;

  public static getSlots(): Record<string, SaveSlot> {
    if (this.cachedSlots) return this.cachedSlots;

    try {
      const raw = localStorage.getItem(STORAGE_KEY_SLOTS);
      if (raw) {
        const parsed = JSON.parse(raw);
        const slots: Record<string, SaveSlot> = { ...DEFAULT_SLOTS, ...parsed };
        this.cachedSlots = slots;
        return slots;
      }
    } catch (e) {
      console.warn('Failed to load save slots, initializing defaults', e);
    }

    // Check legacy migration
    const legacyHighScore = Number(localStorage.getItem('one_piece_alvida_highscore')) || 0;
    const legacyStage = Number(localStorage.getItem('one_piece_unlocked_stage')) || 1;

    const initial: Record<string, SaveSlot> = { ...DEFAULT_SLOTS };
    if (legacyHighScore > 0 || legacyStage > 1) {
      initial['slot-1'].highScore = legacyHighScore;
      initial['slot-1'].unlockedStage = Math.max(1, Math.min(7, legacyStage));
      if (legacyStage >= 5) {
        initial['slot-1'].unlockedCharacters = ['LUFFY', 'ZORO'];
      }
    }

    this.cachedSlots = initial;
    this.persist();
    return initial;
  }

  public static getActiveSlotId(): 'slot-1' | 'slot-2' | 'slot-3' {
    try {
      const active = localStorage.getItem(STORAGE_KEY_ACTIVE);
      if (active === 'slot-1' || active === 'slot-2' || active === 'slot-3') {
        return active;
      }
    } catch {
      // ignore
    }
    return 'slot-1';
  }

  public static getAllSlots(): Record<string, SaveSlot> {
    return this.getSlots();
  }

  public static setActiveSlotId(slotId: 'slot-1' | 'slot-2' | 'slot-3') {
    try {
      localStorage.setItem(STORAGE_KEY_ACTIVE, slotId);
    } catch {
      // ignore
    }
  }

  public static setActiveSlot(slotId: 'slot-1' | 'slot-2' | 'slot-3'): SaveSlot {
    this.setActiveSlotId(slotId);
    return this.getActiveSlot();
  }

  public static getActiveSlot(): SaveSlot {
    const slots = this.getSlots();
    const activeId = this.getActiveSlotId();
    return slots[activeId] || slots['slot-1'];
  }

  public static updateActiveSlot(partial: Partial<SaveSlot>): SaveSlot {
    const slots = this.getSlots();
    const activeId = this.getActiveSlotId();
    const current = slots[activeId] || slots['slot-1'];

    const updated: SaveSlot = {
      ...current,
      ...partial,
      updatedAt: Date.now(),
    };

    slots[activeId] = updated;
    this.cachedSlots = slots;
    this.persist();
    return updated;
  }

  public static resetSlot(slotId: 'slot-1' | 'slot-2' | 'slot-3'): SaveSlot {
    const slots = this.getSlots();
    const fresh: SaveSlot = {
      ...DEFAULT_SLOTS[slotId],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    slots[slotId] = fresh;
    this.cachedSlots = slots;
    this.persist();
    return fresh;
  }

  public static recordStageCleared(stageNum: number, score: number, berriesEarned: number) {
    const active = this.getActiveSlot();
    const nextStage = Math.max(active.unlockedStage, stageNum + 1);
    const newCharacters = [...active.unlockedCharacters];

    // Zoro unlocks when rescuing him / beating Shells Town stage 4/5
    if (stageNum >= 4 && !newCharacters.includes('ZORO')) {
      newCharacters.push('ZORO');
    }

    this.updateActiveSlot({
      unlockedStage: Math.min(7, nextStage),
      unlockedCharacters: newCharacters,
      highScore: Math.max(active.highScore, score),
      berries: active.berries + berriesEarned,
    });
  }

  public static deleteSlot(slotId: 'slot-1' | 'slot-2' | 'slot-3'): SaveSlot {
    const slots = this.getSlots();
    const fresh: SaveSlot = {
      ...DEFAULT_SLOTS[slotId],
      name: `Slot ${slotId.replace('slot-', '')} (Vazio)`,
      unlockedStage: 1,
      unlockedCharacters: ['LUFFY'],
      character: 'LUFFY',
      highScore: 0,
      berries: 0,
      totalDefeated: 0,
      playTimeMinutes: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    slots[slotId] = fresh;
    this.cachedSlots = slots;
    this.persist();
    return fresh;
  }

  public static restartStoryCampaign(): SaveSlot {
    const active = this.getActiveSlot();
    // Restart story campaign from Stage 1, preserving berries and unlocked crew
    return this.updateActiveSlot({
      unlockedStage: 1,
    });
  }

  public static resetAllSlots(): Record<string, SaveSlot> {
    const fresh: Record<string, SaveSlot> = {
      'slot-1': { ...DEFAULT_SLOTS['slot-1'], createdAt: Date.now(), updatedAt: Date.now() },
      'slot-2': { ...DEFAULT_SLOTS['slot-2'], createdAt: Date.now(), updatedAt: Date.now() },
      'slot-3': { ...DEFAULT_SLOTS['slot-3'], createdAt: Date.now(), updatedAt: Date.now() },
    };
    this.cachedSlots = fresh;
    this.persist();
    return fresh;
  }

  private static persist() {
    if (!this.cachedSlots) return;
    try {
      localStorage.setItem(STORAGE_KEY_SLOTS, JSON.stringify(this.cachedSlots));
    } catch (e) {
      console.warn('Could not persist save slots to localStorage', e);
    }
  }
}
