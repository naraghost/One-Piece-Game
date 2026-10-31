/**
 * One Piece Beat 'Em Up - Achievements System
 * Tracks milestones, persists to localStorage, and notifies listeners.
 */

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: number;
  category: 'combat' | 'combo' | 'story' | 'secret';
}

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'FIRST_BLOOD',
    title: 'Primeiro Golpe',
    description: 'Derrote seu primeiro inimigo em alto-mar.',
    icon: '⚔️',
    unlocked: false,
    category: 'combat',
  },
  {
    id: 'COMBO_10',
    title: 'Sequência Furiosa',
    description: 'Atinja uma sequência de 10 golpes consecutivos (10 Hits).',
    icon: '⚡',
    unlocked: false,
    category: 'combo',
  },
  {
    id: 'COMBO_25',
    title: 'Mestre do Combo',
    description: 'Alcance 25 golpes sem quebrar a sequência de ataque.',
    icon: '🔥',
    unlocked: false,
    category: 'combo',
  },
  {
    id: 'DEFEAT_100',
    title: '100 Inimigos Vencidos',
    description: 'Derrube 100 piratas e marinheiros no total.',
    icon: '☠️',
    unlocked: false,
    category: 'combat',
  },
  {
    id: 'ALVIDA_DEFEATED',
    title: 'Voe, Clava de Ferro!',
    description: 'Derrote a Capitã Alvida e liberte o Coby.',
    icon: '👑',
    unlocked: false,
    category: 'story',
  },
  {
    id: 'BARREL_BOWLING',
    title: 'Strike de Barril',
    description: 'Quebre um barril rolante que acerte pelo menos 2 marinheiros ou piratas.',
    icon: '🎳',
    unlocked: false,
    category: 'combat',
  },
  {
    id: 'MEAT_GLUTTON',
    title: 'Carneeeeee!!',
    description: 'Recupere vida comendo pedaços de carne deixados pelo chão.',
    icon: '🍖',
    unlocked: false,
    category: 'secret',
  },
  {
    id: 'ZORO_RECRUITED',
    title: 'O Caçador de Piratas',
    description: 'Recupere as três espadas e recrute Roronoa Zoro para seu bando.',
    icon: '🗡️',
    unlocked: false,
    category: 'story',
  },
  {
    id: 'SANTORYU_MASTER',
    title: 'Estilo Três Espadas',
    description: 'Derrote o Capitão Morgan "Mão-de-Machado" controlando Zoro.',
    icon: '🌪️',
    unlocked: false,
    category: 'combat',
  },
];

const STORAGE_KEY = 'one_piece_gba_achievements_v1';
const STATS_KEY = 'one_piece_gba_stats_v1';

export interface GameStats {
  enemiesDefeated: number;
  highestCombo: number;
  meatEaten: number;
  alvidaBeaten: boolean;
  zoroFreed: boolean;
  morganBeaten: boolean;
  barrelStrikes: number;
}

class AchievementsManager {
  private achievements: Achievement[] = [];
  private listeners: ((achievement: Achievement) => void)[] = [];
  private stats: GameStats = {
    enemiesDefeated: 0,
    highestCombo: 0,
    meatEaten: 0,
    alvidaBeaten: false,
    zoroFreed: false,
    morganBeaten: false,
    barrelStrikes: 0,
  };

  constructor() {
    this.loadState();
  }

  private loadState() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Record<string, number>;
        this.achievements = INITIAL_ACHIEVEMENTS.map((a) => ({
          ...a,
          unlocked: Boolean(parsed[a.id]),
          unlockedAt: parsed[a.id] || undefined,
        }));
      } else {
        this.achievements = [...INITIAL_ACHIEVEMENTS];
      }

      const storedStats = localStorage.getItem(STATS_KEY);
      if (storedStats) {
        this.stats = { ...this.stats, ...JSON.parse(storedStats) };
      }
    } catch {
      this.achievements = [...INITIAL_ACHIEVEMENTS];
    }
  }

  private saveState() {
    try {
      const unlockMap: Record<string, number> = {};
      this.achievements.forEach((a) => {
        if (a.unlocked && a.unlockedAt) {
          unlockMap[a.id] = a.unlockedAt;
        }
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(unlockMap));
      localStorage.setItem(STATS_KEY, JSON.stringify(this.stats));
    } catch {
      // ignore storage errors
    }
  }

  public getAchievements(): Achievement[] {
    return [...this.achievements];
  }

  public getStats(): GameStats {
    return { ...this.stats };
  }

  public onUnlock(listener: (achievement: Achievement) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  public unlock(id: string): void {
    const ach = this.achievements.find((a) => a.id === id);
    if (!ach || ach.unlocked) return;

    ach.unlocked = true;
    ach.unlockedAt = Date.now();
    this.saveState();

    // Notify all UI listeners
    this.listeners.forEach((listener) => {
      try {
        listener(ach);
      } catch (e) {
        console.error('Error invoking achievement listener', e);
      }
    });
  }

  public recordEnemyDefeated(): void {
    this.stats.enemiesDefeated += 1;
    this.unlock('FIRST_BLOOD');
    if (this.stats.enemiesDefeated >= 100) {
      this.unlock('DEFEAT_100');
    }
    this.saveState();
  }

  public recordCombo(combo: number): void {
    if (combo > this.stats.highestCombo) {
      this.stats.highestCombo = combo;
    }
    if (combo >= 10) {
      this.unlock('COMBO_10');
    }
    if (combo >= 25) {
      this.unlock('COMBO_25');
    }
    this.saveState();
  }

  public recordMeatEaten(): void {
    this.stats.meatEaten += 1;
    this.unlock('MEAT_GLUTTON');
    this.saveState();
  }

  public recordBarrelStrike(): void {
    this.stats.barrelStrikes += 1;
    this.unlock('BARREL_BOWLING');
    this.saveState();
  }

  public recordBossDefeated(boss: 'ALVIDA' | 'MORGAN'): void {
    if (boss === 'ALVIDA') {
      this.stats.alvidaBeaten = true;
      this.unlock('ALVIDA_DEFEATED');
    } else if (boss === 'MORGAN') {
      this.stats.morganBeaten = true;
      this.unlock('SANTORYU_MASTER');
    }
    this.saveState();
  }

  public recordZoroFreed(): void {
    this.stats.zoroFreed = true;
    this.unlock('ZORO_RECRUITED');
    this.saveState();
  }

  public resetAll(): void {
    this.achievements = INITIAL_ACHIEVEMENTS.map((a) => ({ ...a, unlocked: false, unlockedAt: undefined }));
    this.stats = {
      enemiesDefeated: 0,
      highestCombo: 0,
      meatEaten: 0,
      alvidaBeaten: false,
      zoroFreed: false,
      morganBeaten: false,
      barrelStrikes: 0,
    };
    this.saveState();
  }
}

export const achievements = new AchievementsManager();
