import { sound } from './audio';
import { SpriteRenderer } from './sprites';
import { achievements } from './achievements';
import {
  DamagePopup,
  EnemyAction,
  EntityType,
  FinisherCinematicData,
  GameState,
  InputState,
  Particle,
  PlayerAction,
  PlayerCharacter,
  Projectile,
  StageId,
} from './types';

export interface BaseEntity {
  id: string;
  type: EntityType;
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  facing: 1 | -1;
  width: number;
  height: number;
  hp: number;
  maxHp: number;
  action: PlayerAction | EnemyAction;
  actionTimer: number;
  invulnerableTimer: number;
  dead: boolean;
}

export interface EnemyEntity extends BaseEntity {
  action: EnemyAction;
  attackCooldown: number;
  windupTimer: number;
  targetX: number;
  targetY: number;
  isBrute?: boolean;
  isGunner?: boolean;
  plannedAttack?: 'SLAM' | 'SPIN' | 'ATTACK';
}

export interface ItemEntity {
  id: string;
  type: 'ITEM_MEAT' | 'ITEM_COIN' | 'ITEM_ENERGY' | 'ITEM_APPLE' | 'ITEM_SWORDS';
  x: number;
  y: number;
  z: number;
  vz: number;
  value: number;
  dead: boolean;
}

export interface BarrelEntity {
  id: string;
  x: number;
  y: number;
  hp: number;
  isCracked: boolean;
  dead: boolean;
  contains: 'meat' | 'coin' | 'energy';
}

export interface CrateEntity {
  id: string;
  x: number;
  y: number;
  hp: number;
  isCracked: boolean;
  dead: boolean;
  contains: 'meat' | 'apple' | 'coin';
}

export interface RollingBarrelEntity {
  id: string;
  x: number;
  y: number;
  vx: number;
  rotation: number;
  distanceTraveled: number;
  hitCount: number;
  dead: boolean;
}

export class GameEngine {
  public state: GameState = 'TITLE_MENU';
  public currentStage: StageId = 'STAGE_1_GALLEY';
  public width: number = 800;
  public height: number = 450;
  public camX: number = 0;
  public targetCamX: number = 0;

  // Deck boundaries (2.5D depth plane)
  public minDeckY: number = 260;
  public maxDeckY: number = 410;
  public shipLength: number = 2400;

  // Cinematic Camera Zoom & Arcade High Combo Flourish
  public cameraZoom: number = 1.0;
  public targetZoom: number = 1.0;
  private flourishTriggered: boolean = false;

  // 15+ Combo Finisher Mechanics
  public finisherReady: boolean = false;
  public cinematicFinisherData: FinisherCinematicData | null = null;
  public cinematicFinisherTimer: number = 0;
  public onCinematicFinisher?: (data: FinisherCinematicData | null) => void;

  // Player
  public player = {
    character: 'LUFFY' as PlayerCharacter,
    x: 120,
    y: 330,
    z: 0,
    vx: 0,
    vy: 0,
    vz: 0,
    facing: 1 as 1 | -1,
    hp: 100,
    maxHp: 100,
    energy: 100,
    maxEnergy: 100,
    score: 0,
    combo: 0,
    comboTimer: 0,
    action: 'IDLE' as PlayerAction,
    actionTimer: 0,
    invulnerableTimer: 0,
    walkFrame: 0,
    isDashing: false,
  };

  // Boss Reference
  public boss: EnemyEntity | null = null;
  public bossDefeatedAnimation: number = 0;

  // Entities
  public enemies: EnemyEntity[] = [];
  public barrels: BarrelEntity[] = [];
  public crates: CrateEntity[] = [];
  public rollingBarrels: RollingBarrelEntity[] = [];
  public items: ItemEntity[] = [];
  public particles: Particle[] = [];
  public damagePopups: DamagePopup[] = [];
  public projectiles: Projectile[] = [];

  // Wave Progression
  public wave: number = 1;
  public maxWaves: number = 2;
  public enemiesDefeatedInWave: number = 0;
  public totalEnemiesDefeated: number = 0;

  // Game Feel: Screenshake & Hitstop
  public screenShake: number = 0;
  public hitstopTimer: number = 0;
  public gameTime: number = 0;

  // Callbacks for UI updates & Haptic Feedback
  public onStateChange?: (state: GameState) => void;
  public onHUDUpdate?: (hud: {
    character: PlayerCharacter;
    hp: number;
    maxHp: number;
    energy: number;
    maxEnergy: number;
    score: number;
    combo: number;
    wave: number;
    currentStage?: StageId;
    bossHp?: number;
    bossMaxHp?: number;
    bossType?: 'ALVIDA' | 'MORGAN';
    finisherReady: boolean;
  }) => void;
  public onHitLanded?: (isSpecial: boolean, damage: number) => void;
  public onPlayerDamaged?: (damage: number) => void;

  constructor() {
    this.resetGame();
  }

  public setDimensions(w: number, h: number) {
    this.width = w;
    this.height = h;
    this.minDeckY = h * 0.58;
    this.maxDeckY = h - 35;
  }

  public resetGame() {
    this.currentStage = 'STAGE_1_GALLEY';
    this.player = {
      character: 'LUFFY',
      x: 140,
      y: (this.minDeckY + this.maxDeckY) / 2,
      z: 0,
      vx: 0,
      vy: 0,
      vz: 0,
      facing: 1,
      hp: 100,
      maxHp: 100,
      energy: 100,
      maxEnergy: 100,
      score: 0,
      combo: 0,
      comboTimer: 0,
      action: 'IDLE',
      actionTimer: 0,
      invulnerableTimer: 0,
      walkFrame: 0,
      isDashing: false,
    };
    this.camX = 0;
    this.targetCamX = 0;
    this.wave = 1;
    this.maxWaves = 2;
    this.enemiesDefeatedInWave = 0;
    this.totalEnemiesDefeated = 0;
    this.enemies = [];
    this.barrels = [];
    this.crates = [];
    this.rollingBarrels = [];
    this.items = [];
    this.particles = [];
    this.damagePopups = [];
    this.projectiles = [];
    this.cameraZoom = 1.0;
    this.targetZoom = 1.0;
    this.flourishTriggered = false;
    this.boss = null;
    this.bossDefeatedAnimation = 0;
    this.spawnBreakables();
    this.spawnWave(1);
  }

  // --- Story Mode Progression Helpers ---
  public static getStageIndex(stageId: StageId): number {
    switch (stageId) {
      case 'STAGE_1_GALLEY': return 1;
      case 'STAGE_2_DECK': return 2;
      case 'STAGE_3_BOSS': return 3;
      case 'STAGE_4_BASE_COURTYARD': return 4;
      case 'STAGE_5_FORTRESS_INTERIOR': return 5;
      case 'STAGE_6_MORGAN_SHOWDOWN': return 6;
      default: return 1;
    }
  }

  public static getStageIdByIndex(index: number): StageId {
    switch (index) {
      case 1: return 'STAGE_1_GALLEY';
      case 2: return 'STAGE_2_DECK';
      case 3: return 'STAGE_3_BOSS';
      case 4: return 'STAGE_4_BASE_COURTYARD';
      case 5: return 'STAGE_5_FORTRESS_INTERIOR';
      case 6: return 'STAGE_6_MORGAN_SHOWDOWN';
      default: return 'STAGE_1_GALLEY';
    }
  }

  public static getHighestUnlockedStage(): number {
    try {
      const val = localStorage.getItem('onepiece_story_unlocked_stage');
      return val ? Math.max(1, Math.min(6, parseInt(val, 10))) : 1;
    } catch {
      return 1;
    }
  }

  public static unlockStage(stageNum: number) {
    try {
      const current = GameEngine.getHighestUnlockedStage();
      if (stageNum > current) {
        localStorage.setItem('onepiece_story_unlocked_stage', String(stageNum));
      }
    } catch {
      // ignore
    }
  }

  public static resetStoryProgress() {
    try {
      localStorage.setItem('onepiece_story_unlocked_stage', '1');
    } catch {
      // ignore
    }
  }

  public startStage(stageId: StageId) {
    this.currentStage = stageId;
    this.wave = 1;
    this.maxWaves = (stageId === 'STAGE_3_BOSS' || stageId === 'STAGE_6_MORGAN_SHOWDOWN') ? 1 : 2;

    // Set character: Play as Zoro in Morgan Showdown!
    if (stageId === 'STAGE_6_MORGAN_SHOWDOWN') {
      this.player.character = 'ZORO';
      achievements.recordZoroFreed();
    } else {
      this.player.character = 'LUFFY';
    }

    this.player.x = 140;
    this.player.y = (this.minDeckY + this.maxDeckY) / 2;
    this.player.z = 0;
    this.player.vx = 0;
    this.player.vy = 0;
    this.player.vz = 0;
    this.player.hp = Math.max(90, this.player.hp);
    this.player.action = 'IDLE';
    this.camX = 0;
    this.cameraZoom = 1.0;
    this.targetZoom = 1.0;
    this.flourishTriggered = false;
    this.enemies = [];
    this.barrels = [];
    this.crates = [];
    this.rollingBarrels = [];
    this.items = [];
    this.projectiles = [];
    this.boss = null;
    this.bossDefeatedAnimation = 0;
    this.spawnBreakables();
    this.spawnWave(1);
    this.beginPlaying();
  }

  public startStory() {
    this.currentStage = 'STAGE_1_GALLEY';
    this.state = 'PROLOGUE';
    this.onStateChange?.(this.state);
  }

  public beginPlaying() {
    this.state = 'PLAYING';
    sound.playStageBGM();
    this.onStateChange?.(this.state);
  }

  public pauseGame() {
    if (this.state === 'PLAYING') {
      this.state = 'PAUSED';
      this.onStateChange?.(this.state);
    }
  }

  public resumeGame() {
    if (this.state === 'PAUSED') {
      this.state = 'PLAYING';
      this.onStateChange?.(this.state);
    }
  }

  // Spawn Barrels and Crates depending on Stage
  private spawnBreakables() {
    this.barrels = [];
    this.crates = [];

    if (this.currentStage === 'STAGE_1_GALLEY') {
      this.barrels.push(
        { id: `b_1`, x: 290, y: this.minDeckY + 20, hp: 2, isCracked: false, dead: false, contains: 'meat' },
        { id: `b_2`, x: 520, y: this.maxDeckY - 20, hp: 2, isCracked: false, dead: false, contains: 'energy' },
        { id: `b_3`, x: 740, y: (this.minDeckY + this.maxDeckY) / 2, hp: 2, isCracked: false, dead: false, contains: 'coin' },
        { id: `b_4`, x: 1050, y: this.minDeckY + 30, hp: 2, isCracked: false, dead: false, contains: 'meat' }
      );
      this.crates.push(
        { id: `c_1`, x: 410, y: this.maxDeckY - 30, hp: 2, isCracked: false, dead: false, contains: 'apple' },
        { id: `c_2`, x: 620, y: this.minDeckY + 35, hp: 2, isCracked: false, dead: false, contains: 'apple' },
        { id: `c_3`, x: 880, y: this.maxDeckY - 25, hp: 2, isCracked: false, dead: false, contains: 'coin' }
      );
    } else if (this.currentStage === 'STAGE_2_DECK') {
      this.barrels.push(
        { id: `b_1`, x: 280, y: this.minDeckY + 20, hp: 2, isCracked: false, dead: false, contains: 'meat' },
        { id: `b_2`, x: 580, y: this.maxDeckY - 20, hp: 2, isCracked: false, dead: false, contains: 'energy' },
        { id: `b_3`, x: 920, y: (this.minDeckY + this.maxDeckY) / 2, hp: 2, isCracked: false, dead: false, contains: 'meat' }
      );
      this.crates.push(
        { id: `c_1`, x: 440, y: this.minDeckY + 30, hp: 2, isCracked: false, dead: false, contains: 'coin' },
        { id: `c_2`, x: 780, y: this.maxDeckY - 35, hp: 2, isCracked: false, dead: false, contains: 'apple' }
      );
    } else if (this.currentStage === 'STAGE_4_BASE_COURTYARD') {
      // Shells Town Courtyard: Navy storage barrels & supply crates
      this.barrels.push(
        { id: `b_1`, x: 250, y: this.minDeckY + 20, hp: 2, isCracked: false, dead: false, contains: 'meat' },
        { id: `b_2`, x: 620, y: this.maxDeckY - 25, hp: 2, isCracked: false, dead: false, contains: 'energy' },
        { id: `b_3`, x: 850, y: (this.minDeckY + this.maxDeckY) / 2, hp: 2, isCracked: false, dead: false, contains: 'meat' }
      );
      this.crates.push(
        { id: `c_1`, x: 450, y: this.minDeckY + 30, hp: 2, isCracked: false, dead: false, contains: 'apple' },
        { id: `c_2`, x: 720, y: this.maxDeckY - 20, hp: 2, isCracked: false, dead: false, contains: 'coin' }
      );
    } else if (this.currentStage === 'STAGE_5_FORTRESS_INTERIOR') {
      // Marine Tower interior: Heavy armory chests
      this.crates.push(
        { id: `c_1`, x: 320, y: this.minDeckY + 20, hp: 2, isCracked: false, dead: false, contains: 'apple' },
        { id: `c_2`, x: 550, y: this.maxDeckY - 20, hp: 2, isCracked: false, dead: false, contains: 'meat' },
        { id: `c_3`, x: 800, y: (this.minDeckY + this.maxDeckY) / 2, hp: 2, isCracked: false, dead: false, contains: 'coin' }
      );
    } else {
      // Boss stages (Alvida or Morgan)
      this.barrels.push(
        { id: `b_boss_1`, x: 260, y: this.minDeckY + 25, hp: 2, isCracked: false, dead: false, contains: 'meat' },
        { id: `b_boss_2`, x: 600, y: this.maxDeckY - 25, hp: 2, isCracked: false, dead: false, contains: 'energy' }
      );
    }
  }

  // Wave Spawner per Stage
  public spawnWave(wave: number) {
    this.wave = wave;
    this.enemiesDefeatedInWave = 0;
    const baseSpawnX = this.camX + this.width + 60;

    if (this.currentStage === 'STAGE_1_GALLEY') {
      if (wave === 1) {
        for (let i = 0; i < 3; i++) {
          this.enemies.push(this.createGrunt(baseSpawnX + i * 65, this.minDeckY + 25 + i * 40, false));
        }
      } else {
        for (let i = 0; i < 3; i++) {
          this.enemies.push(this.createGrunt(baseSpawnX + i * 60, this.minDeckY + 20 + i * 45, false));
        }
        this.enemies.push(this.createGrunt(baseSpawnX + 220, (this.minDeckY + this.maxDeckY) / 2, true));
      }
    } else if (this.currentStage === 'STAGE_2_DECK') {
      if (wave === 1) {
        for (let i = 0; i < 4; i++) {
          this.enemies.push(this.createGrunt(baseSpawnX + i * 55, this.minDeckY + 15 + i * 35, false));
        }
      } else {
        for (let i = 0; i < 4; i++) {
          this.enemies.push(this.createGrunt(baseSpawnX + i * 50, this.minDeckY + 15 + i * 35, false));
        }
        this.enemies.push(this.createGrunt(baseSpawnX + 230, this.minDeckY + 25, true));
        this.enemies.push(this.createGrunt(baseSpawnX + 270, this.maxDeckY - 25, true));
      }
    } else if (this.currentStage === 'STAGE_3_BOSS') {
      this.state = 'BOSS_INTRO';
      this.onStateChange?.(this.state);
      this.boss = this.createAlvida(baseSpawnX + 160, (this.minDeckY + this.maxDeckY) / 2);
      this.enemies.push(this.boss);
      this.enemies.push(this.createGrunt(baseSpawnX + 80, this.minDeckY + 30, false));
      this.enemies.push(this.createGrunt(baseSpawnX + 80, this.maxDeckY - 25, false));
    } else if (this.currentStage === 'STAGE_4_BASE_COURTYARD') {
      // Shells Town Courtyard: Marines with cutlasses and rifles
      if (wave === 1) {
        for (let i = 0; i < 3; i++) {
          this.enemies.push(this.createMarineGrunt(baseSpawnX + i * 65, this.minDeckY + 20 + i * 40, false));
        }
        this.enemies.push(this.createMarineGrunt(baseSpawnX + 240, (this.minDeckY + this.maxDeckY) / 2, true));
      } else {
        for (let i = 0; i < 4; i++) {
          this.enemies.push(this.createMarineGrunt(baseSpawnX + i * 55, this.minDeckY + 15 + i * 35, i % 2 === 1));
        }
        this.enemies.push(this.createMarineGrunt(baseSpawnX + 260, this.minDeckY + 30, false));
      }
    } else if (this.currentStage === 'STAGE_5_FORTRESS_INTERIOR') {
      // Morgan's Tower: Marine guards protecting the swords
      if (wave === 1) {
        for (let i = 0; i < 4; i++) {
          this.enemies.push(this.createMarineGrunt(baseSpawnX + i * 60, this.minDeckY + 20 + i * 35, i === 2));
        }
      } else {
        for (let i = 0; i < 4; i++) {
          this.enemies.push(this.createMarineGrunt(baseSpawnX + i * 55, this.minDeckY + 15 + i * 35, false));
        }
        this.enemies.push(this.createMarineGrunt(baseSpawnX + 260, (this.minDeckY + this.maxDeckY) / 2, true));
      }
    } else if (this.currentStage === 'STAGE_6_MORGAN_SHOWDOWN') {
      // Showdown: Axe-Hand Morgan boss battle with Zoro!
      this.state = 'BOSS_INTRO';
      this.onStateChange?.(this.state);
      this.boss = this.createMorgan(baseSpawnX + 160, (this.minDeckY + this.maxDeckY) / 2);
      this.enemies.push(this.boss);
      this.enemies.push(this.createMarineGrunt(baseSpawnX + 80, this.minDeckY + 25, false));
      this.enemies.push(this.createMarineGrunt(baseSpawnX + 80, this.maxDeckY - 25, true));
    }
  }

  private createGrunt(x: number, y: number, isBrute: boolean): EnemyEntity {
    return {
      id: `grunt_${Math.random()}`,
      type: isBrute ? 'ENEMY_BRUTE' : 'ENEMY_GRUNT',
      x,
      y,
      z: 0,
      vx: 0,
      vy: 0,
      vz: 0,
      facing: -1,
      width: isBrute ? 34 : 26,
      height: isBrute ? 58 : 48,
      hp: isBrute ? 70 : 35,
      maxHp: isBrute ? 70 : 35,
      action: 'WALK',
      actionTimer: 0,
      attackCooldown: 1.2 + Math.random() * 0.8,
      windupTimer: 0,
      targetX: x,
      targetY: y,
      invulnerableTimer: 0,
      dead: false,
      isBrute,
    };
  }

  private createMarineGrunt(x: number, y: number, isGunner: boolean): EnemyEntity {
    return {
      id: `marine_${Math.random()}`,
      type: isGunner ? 'ENEMY_MARINE_GUN' : 'ENEMY_MARINE_SWORD',
      x,
      y,
      z: 0,
      vx: 0,
      vy: 0,
      vz: 0,
      facing: -1,
      width: 28,
      height: 50,
      hp: isGunner ? 40 : 45,
      maxHp: isGunner ? 40 : 45,
      action: 'WALK',
      actionTimer: 0,
      attackCooldown: isGunner ? 2.0 + Math.random() * 0.8 : 1.2 + Math.random() * 0.6,
      windupTimer: 0,
      targetX: x,
      targetY: y,
      invulnerableTimer: 0,
      dead: false,
      isGunner,
    };
  }

  private createAlvida(x: number, y: number): EnemyEntity {
    return {
      id: 'boss_alvida',
      type: 'BOSS_ALVIDA',
      x,
      y,
      z: 0,
      vx: 0,
      vy: 0,
      vz: 0,
      facing: -1,
      width: 45,
      height: 70,
      hp: 250,
      maxHp: 250,
      action: 'IDLE',
      actionTimer: 0,
      attackCooldown: 1.5,
      windupTimer: 0,
      targetX: x,
      targetY: y,
      invulnerableTimer: 0,
      dead: false,
    };
  }

  private createMorgan(x: number, y: number): EnemyEntity {
    return {
      id: 'boss_morgan',
      type: 'BOSS_MORGAN',
      x,
      y,
      z: 0,
      vx: 0,
      vy: 0,
      vz: 0,
      facing: -1,
      width: 50,
      height: 75,
      hp: 320,
      maxHp: 320,
      action: 'IDLE',
      actionTimer: 0,
      attackCooldown: 1.6,
      windupTimer: 0,
      targetX: x,
      targetY: y,
      invulnerableTimer: 0,
      dead: false,
    };
  }

  // --- Main Tick (60 FPS Simulation) ---
  public update(dt: number, input: InputState) {
    const clampedDt = Math.min(dt, 0.05);
    this.gameTime += clampedDt;

    if (this.hitstopTimer > 0) {
      this.hitstopTimer -= clampedDt;
      return;
    }

    if (this.state !== 'PLAYING' && this.state !== 'BOSS_INTRO') return;

    // Screenshake decay
    if (this.screenShake > 0) {
      this.screenShake = Math.max(0, this.screenShake - clampedDt * 24);
    }

    // Finisher Cinematic Timer Decay
    if (this.cinematicFinisherTimer > 0) {
      this.cinematicFinisherTimer -= clampedDt;
      if (this.cinematicFinisherTimer <= 0) {
        this.cinematicFinisherData = null;
        this.onCinematicFinisher?.(null);
      }
    }

    // Combo timer decay
    if (this.player.comboTimer > 0) {
      this.player.comboTimer -= clampedDt;
      if (this.player.comboTimer <= 0) {
        this.player.combo = 0;
      }
    }

    // 15+ Combo Finisher Charge Ready
    if (this.player.combo >= 15) {
      if (!this.finisherReady) {
        this.finisherReady = true;
        sound.playFinisherReady();
        this.screenShake = 8;
        this.addMangaText(this.player.x, this.player.y - 75, 'FINISHER READY!!', '#ffd700', 1.8);
      }
    } else {
      this.finisherReady = false;
    }

    // High Combo Camera Zoom & Visual Flourish (20+ hits threshold)
    if (this.player.combo >= 20) {
      this.targetZoom = 1.15;
      if (!this.flourishTriggered) {
        this.flourishTriggered = true;
        sound.playComboFlourish();
        this.screenShake = 12;
        this.addMangaText(this.player.x, this.player.y - 75, '20x COMBO FRENZY!!', '#ff0055', 1.8);
      }
    } else {
      this.targetZoom = 1.0;
      this.flourishTriggered = false;
    }
    // Smooth cinematic zoom interpolation
    this.cameraZoom += (this.targetZoom - this.cameraZoom) * Math.min(1, clampedDt * 5);

    // Update Player
    this.updatePlayer(clampedDt, input);

    // Update Projectiles (Air Slash)
    this.updateProjectiles(clampedDt);

    // Update Enemies
    this.updateEnemies(clampedDt);

    // Update Barrels & Items
    this.updateBarrelsAndItems(clampedDt);

    // Update Particles & Popups
    this.updateParticles(clampedDt);

    // Camera follow player smoothly
    const desiredCamX = Math.max(0, Math.min(this.shipLength - this.width, this.player.x - this.width * 0.35));
    this.camX += (desiredCamX - this.camX) * 0.1;

    // Check Wave Completion
    this.checkWaveProgress();

    // Notify UI HUD
    this.onHUDUpdate?.({
      character: this.player.character,
      hp: this.player.hp,
      maxHp: this.player.maxHp,
      energy: this.player.energy,
      maxEnergy: this.player.maxEnergy,
      score: this.player.score,
      combo: this.player.combo,
      wave: this.wave,
      currentStage: this.currentStage,
      bossHp: this.boss ? this.boss.hp : undefined,
      bossMaxHp: this.boss ? this.boss.maxHp : undefined,
      bossType: this.currentStage === 'STAGE_6_MORGAN_SHOWDOWN' ? 'MORGAN' : 'ALVIDA',
      finisherReady: this.finisherReady,
    });
  }

  // Player Physics & Actions
  private updatePlayer(dt: number, input: InputState) {
    const p = this.player;

    if (p.invulnerableTimer > 0) {
      p.invulnerableTimer -= dt;
    }

    // Natural passive energy regen
    if (p.energy < p.maxEnergy) {
      p.energy = Math.min(p.maxEnergy, p.energy + dt * 4);
    }

    // Actions state machine
    if (p.action === 'PUNCH_1' || p.action === 'PUNCH_2' || p.action === 'PUNCH_3') {
      p.actionTimer += dt;
      if (p.actionTimer > 0.25) {
        p.action = 'IDLE';
        p.actionTimer = 0;
      }
    } else if (p.action === 'PISTOL') {
      p.actionTimer += dt;
      if (p.actionTimer > (p.character === 'ZORO' ? 0.35 : 0.45)) {
        p.action = 'IDLE';
        p.actionTimer = 0;
      }
    } else if (p.action === 'SPECIAL') {
      p.actionTimer += dt;
      // Zoro Oni Giri dashes fast forward
      if (p.character === 'ZORO') {
        p.vx = p.facing * 350;
      }
      if (p.actionTimer > 0.7) {
        p.action = 'IDLE';
        p.actionTimer = 0;
      }
    } else if (p.action === 'FINISHER') {
      p.actionTimer += dt;
      // Zoro Sanzen Sekai lunges forward cutting through space
      if (p.character === 'ZORO') {
        p.vx = p.facing * 280;
      } else {
        // Luffy Bazooka recoil
        p.vx = -p.facing * 90;
      }
      if (p.actionTimer > 0.95) {
        p.action = 'IDLE';
        p.actionTimer = 0;
        p.vx = 0;
      }
    } else if (p.action === 'HURT') {
      p.actionTimer += dt;
      if (p.actionTimer > 0.35) {
        p.action = 'IDLE';
        p.actionTimer = 0;
      }
    }

    const canMove = p.action === 'IDLE' || p.action === 'WALK' || p.action === 'DASH' || p.action === 'JUMP';

    if (canMove) {
      const isDashing = input.dash;
      p.isDashing = isDashing;
      const baseSpeed = isDashing ? 310 : 195;
      p.vx = 0;
      p.vy = 0;

      if (input.left) {
        p.vx = -baseSpeed;
        p.facing = -1;
      } else if (input.right) {
        p.vx = baseSpeed;
        p.facing = 1;
      }

      if (input.up) {
        p.vy = -baseSpeed * 0.75;
      } else if (input.down) {
        p.vy = baseSpeed * 0.75;
      }

      // Jump
      if (input.justJump && p.z <= 0) {
        p.vz = 360;
        sound.playJump();
        p.action = 'JUMP';
        this.spawnDust(p.x, p.y);
      }

      // Aerial Attack: Traveling Air Slash or Downward Plunge
      if (p.z > 15 && (input.justPunch || input.justPistol) && p.action !== 'AIR_ATTACK') {
        if (input.down) {
          // Downward plunge
          p.action = 'AIR_ATTACK';
          p.vz = -460;
          p.vx = p.facing * 190;
          if (p.character === 'ZORO') {
            sound.playPunch(2);
            this.addMangaText(p.x, p.y - 70, 'KATANA PLUNGE!!', '#52b788', 1.3);
          } else {
            sound.playRubberStretch();
            this.addMangaText(p.x, p.y - 70, 'GOMU GOMU NO STAMP!!', '#ffb703', 1.3);
          }
        } else {
          // Aerial Traveling Slash Attack!
          this.executeAerialSlash();
        }
      }

      // Ground Attacks
      if (p.z <= 0) {
        // Attack: 3-hit combo
        if (input.justPunch) {
          if (p.action === 'PUNCH_1') {
            p.action = 'PUNCH_2';
            p.actionTimer = 0;
            sound.playPunch(2);
          } else if (p.action === 'PUNCH_2') {
            p.action = 'PUNCH_3';
            p.actionTimer = 0;
            sound.playPunch(3);
          } else {
            p.action = 'PUNCH_1';
            p.actionTimer = 0;
            sound.playPunch(1);
          }

          if (p.character === 'ZORO') {
            const dmg = p.action === 'PUNCH_3' ? 32 : p.action === 'PUNCH_2' ? 22 : 18;
            this.executePlayerAttack(dmg, p.action === 'PUNCH_3' ? 75 : 55, false, p.action === 'PUNCH_3');
          } else {
            this.executePlayerAttack(p.action === 'PUNCH_3' ? 24 : 14, 45, false, p.action === 'PUNCH_3');
          }
        }

        // Secondary Attack: Pistol (Luffy) or Flying Slash (Zoro)
        if (input.justPistol) {
          p.action = 'PISTOL';
          p.actionTimer = 0;
          p.vx = 0;
          p.vy = 0;
          if (p.character === 'ZORO') {
            sound.playPunch(2);
            this.executePlayerAttack(35, 200, false, true);
            this.addMangaText(p.x + p.facing * 40, p.y - 50, 'FLYING SLASH!!', '#4ade80', 1.3);
          } else {
            sound.playRubberStretch();
            this.executePlayerAttack(30, 230, false, true);
          }
        }

        // Special Attack: Gatling / Oni Giri OR Combo Finisher if ready!
        if (input.justSpecial) {
          if (this.finisherReady) {
            this.executeComboFinisher();
          } else if (p.energy >= 40) {
            p.energy -= 40;
            p.action = 'SPECIAL';
            p.actionTimer = 0;
            p.vx = 0;
            p.vy = 0;
            this.screenShake = 12;

            if (p.character === 'ZORO') {
              sound.playHeavySmash();
              this.executePlayerAttack(70, 180, true, true);
              this.addMangaText(p.x + p.facing * 50, p.y - 65, 'SANTORYU: ONI GIRI!!', '#22c55e', 1.5);
            } else {
              sound.playGatlingBurst();
              this.executePlayerAttack(55, 150, true, true);
              this.addMangaText(p.x + p.facing * 50, p.y - 60, 'GOMU GOMU NO!!', '#ff0055', 1.4);
            }
          }
        }
      }

      // Movement animation
      if (p.vx !== 0 || p.vy !== 0) {
        p.walkFrame += dt * (isDashing ? 45 : 30);
        if (p.z <= 0 && p.action !== 'AIR_ATTACK') {
          p.action = isDashing ? 'DASH' : 'WALK';
          if (isDashing && Math.random() < 0.3) {
            this.spawnDust(p.x, p.y);
          }
        }
      } else if (p.z <= 0 && (p.action === 'WALK' || p.action === 'DASH' || p.action === 'JUMP')) {
        p.action = 'IDLE';
      }
    }

    // Apply Z Gravity for Jump & Aerial Stamp
    if (p.z > 0 || p.vz !== 0) {
      p.z += p.vz * dt;
      p.vz -= 850 * dt;
      if (p.z <= 0) {
        p.z = 0;
        p.vz = 0;
        if (p.action === 'AIR_ATTACK') {
          sound.playHeavySmash();
          this.screenShake = 9;
          this.executePlayerAttack(30, 80, true, true);
          this.spawnHitSparks(p.x, p.y);
          p.action = 'IDLE';
        } else if (p.action === 'JUMP') {
          p.action = 'IDLE';
        }
      }
    }

    // Update coordinates & bounds
    p.x += p.vx * dt;
    p.y += p.vy * dt;

    p.x = Math.max(40, Math.min(this.shipLength - 40, p.x));
    p.y = Math.max(this.minDeckY + 5, Math.min(this.maxDeckY, p.y));
  }

  // Cinematic 15+ Combo Finisher Move (Gomu Gomu no Bazooka / Santoryu Sanzen Sekai)
  public executeComboFinisher() {
    const p = this.player;
    const isZoro = p.character === 'ZORO';

    const cinematic: FinisherCinematicData = isZoro
      ? {
          character: 'ZORO',
          moveName: 'SANTORYU OUGI: SANZEN SEKAI!!',
          japaneseTitle: '三・千・世・界',
          subTitle: 'Técnica Secreta das Três Espadas: Três Mil Mundos!',
        }
      : {
          character: 'LUFFY',
          moveName: 'GOMU GOMU NO BAZOOKA!!',
          japaneseTitle: 'ゴムゴムのバズーカ',
          subTitle: 'Poder de destruição elástica máxima!',
        };

    if (isZoro) {
      sound.playSantoryuWhirlwind();
    } else {
      sound.playBazookaBlast();
    }

    this.cinematicFinisherData = cinematic;
    this.cinematicFinisherTimer = 0.95;
    this.onCinematicFinisher?.(cinematic);

    p.action = 'FINISHER';
    p.actionTimer = 0;
    p.invulnerableTimer = 1.4;
    p.vx = 0;
    p.vy = 0;
    this.screenShake = 24;
    this.hitstopTimer = 0.16;

    const blastDamage = isZoro ? 145 : 130;
    const blastReach = 320;
    let hitCount = 0;

    // Hit all enemies in the devastating cinematic sweep
    this.enemies.forEach((enemy) => {
      if (enemy.dead) return;
      const dx = (enemy.x - p.x) * p.facing;
      const dy = Math.abs(enemy.y - p.y);

      if (dx >= -40 && dx <= blastReach && dy <= 75) {
        hitCount++;
        enemy.hp -= blastDamage;
        enemy.invulnerableTimer = 0.35;
        enemy.action = 'HURT';
        enemy.vx = p.facing * 520;
        enemy.vz = 240;

        p.score += blastDamage * 25;
        this.spawnHitSparks(enemy.x, enemy.y - 30);
        this.addDamagePopup(
          enemy.x + (Math.random() * 20 - 10),
          enemy.y - 50 - enemy.z,
          `${blastDamage}!`,
          isZoro ? '#22c55e' : '#ff0055',
          2.0
        );

        if (enemy.hp <= 0) {
          this.defeatEnemy(enemy);
        }
      }
    });

    // Annihilate breakables caught in the finisher shockwave
    this.barrels.forEach((barrel) => {
      if (barrel.dead) return;
      const dx = (barrel.x - p.x) * p.facing;
      if (dx >= -30 && dx <= blastReach && Math.abs(barrel.y - p.y) <= 60) {
        barrel.dead = true;
        this.destroyBarrel(barrel);
      }
    });

    this.crates.forEach((crate) => {
      if (crate.dead) return;
      const dx = (crate.x - p.x) * p.facing;
      if (dx >= -30 && dx <= blastReach && Math.abs(crate.y - p.y) <= 60) {
        crate.dead = true;
        this.destroyCrate(crate);
      }
    });

    this.addMangaText(p.x + p.facing * 85, p.y - 85, cinematic.moveName, isZoro ? '#22c55e' : '#ff0055', 2.0);

    // Reset combo and consume finisher charge
    p.combo = 0;
    this.finisherReady = false;

    if (hitCount > 0) {
      this.onHitLanded?.(true, blastDamage);
    }
  }

  // Aerial traveling slash attack (Zoro Tobu Zangeki or Luffy Vacuum Slash)
  public executeAerialSlash() {
    const p = this.player;
    sound.playAirSlash();
    this.screenShake = 6;

    const projId = `air_slash_${Math.random()}`;
    const speed = p.facing * 460;
    this.projectiles.push({
      id: projId,
      owner: 'PLAYER',
      character: p.character,
      x: p.x + p.facing * 35,
      y: p.y,
      z: p.z,
      vx: speed,
      vy: 0,
      width: 48,
      height: 32,
      damage: p.character === 'ZORO' ? 44 : 36,
      life: 0,
      maxLife: 1.3,
      facing: p.facing,
      hitEntities: new Set<string>(),
      type: 'AIR_SLASH',
    });

    if (p.character === 'ZORO') {
      this.addMangaText(p.x + p.facing * 30, p.y - 75, 'TOBU ZANGEKI!!', '#22c55e', 1.4);
    } else {
      this.addMangaText(p.x + p.facing * 30, p.y - 75, 'GOMU GOMU NO AIR SLASH!!', '#ff0055', 1.4);
    }

    // Trailing air bursts
    for (let i = 0; i < 6; i++) {
      this.particles.push({
        x: p.x + p.facing * 30,
        y: p.y - p.z,
        vx: p.facing * (150 + Math.random() * 100),
        vy: (Math.random() - 0.5) * 80,
        color: p.character === 'ZORO' ? '#4ade80' : '#fde047',
        size: 3 + Math.random() * 3,
        life: 0,
        maxLife: 0.3,
        shape: 'slash',
      });
    }

    // Gentle aerial hang time
    p.vz = Math.max(p.vz, 120);
  }

  // Update flying projectiles (Air Slash traveling forward)
  private updateProjectiles(dt: number) {
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const proj = this.projectiles[i];
      proj.life += dt;
      proj.x += proj.vx * dt;
      proj.y += proj.vy * dt;

      // Trailing motion particles
      if (Math.random() < 0.45) {
        this.particles.push({
          x: proj.x,
          y: proj.y - proj.z + (Math.random() * 16 - 8),
          vx: -proj.facing * (50 + Math.random() * 40),
          vy: (Math.random() - 0.5) * 20,
          color: proj.character === 'ZORO' ? 'rgba(74, 222, 128, 0.7)' : 'rgba(255, 183, 3, 0.7)',
          size: 3,
          life: 0,
          maxLife: 0.25,
          shape: 'slash',
        });
      }

      // Check lifespan or arena limits
      if (proj.life >= proj.maxLife || proj.x < 0 || proj.x > this.shipLength) {
        this.projectiles.splice(i, 1);
        continue;
      }

      // 1. Collision against Enemies
      this.enemies.forEach((enemy) => {
        if (enemy.dead || enemy.invulnerableTimer > 0 || proj.hitEntities.has(enemy.id)) return;

        const dx = Math.abs(enemy.x - proj.x);
        const dy = Math.abs(enemy.y - proj.y);

        if (dx < 38 && dy < 46) {
          proj.hitEntities.add(enemy.id);
          enemy.hp -= proj.damage;
          enemy.invulnerableTimer = 0.2;
          enemy.action = 'HURT';
          enemy.vx = proj.facing * 220;
          enemy.vz = 90;

          this.player.combo++;
          this.player.comboTimer = 2.5;
          this.player.score += proj.damage * 20;

          achievements.recordCombo(this.player.combo);
          this.screenShake = 7;
          this.hitstopTimer = 0.04;
          sound.playHitImpact(false);
          this.spawnHitSparks(enemy.x, enemy.y - 30);
          this.addDamagePopup(
            enemy.x,
            enemy.y - 45 - enemy.z,
            Math.round(proj.damage).toString(),
            proj.character === 'ZORO' ? '#22c55e' : '#ff0055',
            1.2
          );

          if (enemy.hp <= 0) {
            this.defeatEnemy(enemy);
          }

          this.onHitLanded?.(false, proj.damage);
        }
      });

      // 2. Collision against Barrels
      this.barrels.forEach((barrel) => {
        if (barrel.dead || proj.hitEntities.has(barrel.id)) return;
        const dx = Math.abs(barrel.x - proj.x);
        const dy = Math.abs(barrel.y - proj.y);

        if (dx < 32 && dy < 36) {
          proj.hitEntities.add(barrel.id);
          barrel.hp--;
          if (barrel.hp <= 0) {
            barrel.dead = true;
            this.destroyBarrel(barrel);
          } else {
            barrel.isCracked = true;
            sound.playPunch(1);
            this.spawnSplinters(barrel.x, barrel.y - 20, 6);
          }
        }
      });

      // 3. Collision against Crates
      this.crates.forEach((crate) => {
        if (crate.dead || proj.hitEntities.has(crate.id)) return;
        const dx = Math.abs(crate.x - proj.x);
        const dy = Math.abs(crate.y - proj.y);

        if (dx < 32 && dy < 36) {
          proj.hitEntities.add(crate.id);
          crate.hp--;
          if (crate.hp <= 0) {
            crate.dead = true;
            this.destroyCrate(crate);
          } else {
            crate.isCracked = true;
            sound.playPunch(1);
            this.spawnSplinters(crate.x, crate.y - 20, 6);
          }
        }
      });
    }
  }

  // Attack execution against enemies and breakables
  public executePlayerAttack(damage: number, reachX: number, isSpecial: boolean = false, isHeavy: boolean = false) {
    const p = this.player;
    let hitCount = 0;

    // 1. Check Enemies
    this.enemies.forEach((enemy) => {
      if (enemy.dead || enemy.invulnerableTimer > 0) return;

      const dx = (enemy.x - p.x) * p.facing;
      const dy = Math.abs(enemy.y - p.y);

      if (dx > -20 && dx < reachX && dy < 48) {
        hitCount++;
        enemy.hp -= damage;
        enemy.invulnerableTimer = isSpecial ? 0.15 : 0.28;
        enemy.action = 'HURT';
        enemy.vx = p.facing * (isHeavy ? 280 : 160);
        enemy.vz = isHeavy ? 180 : 60;

        p.combo++;
        p.comboTimer = 2.4;
        p.score += damage * 15 * Math.min(4, Math.floor(p.combo / 5) + 1);

        // Record combo milestone
        achievements.recordCombo(p.combo);

        this.screenShake = isSpecial ? 10 : 5;
        this.hitstopTimer = isHeavy ? 0.08 : 0.04;
        sound.playHitImpact(isHeavy);

        this.spawnHitSparks(enemy.x, enemy.y - 30);
        this.addDamagePopup(
          enemy.x + (Math.random() * 20 - 10),
          enemy.y - 45 - enemy.z,
          Math.round(damage).toString(),
          isSpecial ? '#ff0055' : p.character === 'ZORO' ? '#22c55e' : '#ffd166',
          isHeavy ? 1.4 : 1.0
        );

        if (enemy.hp <= 0) {
          this.defeatEnemy(enemy);
        }
      }
    });

    // 2. Check Barrels
    this.barrels.forEach((barrel) => {
      if (barrel.dead) return;
      const dx = (barrel.x - p.x) * p.facing;
      const dy = Math.abs(barrel.y - p.y);

      if (dx > -15 && dx < reachX && dy < 38) {
        hitCount++;
        barrel.hp--;
        if (barrel.hp <= 0) {
          barrel.dead = true;
          this.destroyBarrel(barrel);
        } else {
          barrel.isCracked = true;
          sound.playPunch(1);
          this.spawnSplinters(barrel.x, barrel.y - 20, 6);
        }
      }
    });

    // 3. Check Crates
    this.crates.forEach((crate) => {
      if (crate.dead) return;
      const dx = (crate.x - p.x) * p.facing;
      const dy = Math.abs(crate.y - p.y);

      if (dx > -15 && dx < reachX && dy < 38) {
        hitCount++;
        crate.hp--;
        if (crate.hp <= 0) {
          crate.dead = true;
          this.destroyCrate(crate);
        } else {
          crate.isCracked = true;
          sound.playPunch(1);
          this.spawnSplinters(crate.x, crate.y - 20, 6);
        }
      }
    });

    // Callback for Mobile Haptic Vibration
    if (hitCount > 0) {
      this.onHitLanded?.(isSpecial, damage);
    }
  }

  private destroyCrate(crate: CrateEntity) {
    sound.playBarrelSmash();
    this.screenShake = 6;
    this.spawnSplinters(crate.x, crate.y - 20, 16);
    this.addMangaText(crate.x, crate.y - 40, 'SMASH!!', '#e09f3e');

    if (crate.contains === 'apple') {
      this.items.push({
        id: `apple_${Math.random()}`,
        type: 'ITEM_APPLE',
        x: crate.x + 18,
        y: crate.y,
        z: 25,
        vz: 130,
        value: 30,
        dead: false,
      });
    } else if (crate.contains === 'meat') {
      this.items.push({
        id: `meat_${Math.random()}`,
        type: 'ITEM_MEAT',
        x: crate.x + 18,
        y: crate.y,
        z: 25,
        vz: 130,
        value: 35,
        dead: false,
      });
    } else {
      this.items.push({
        id: `coin_${Math.random()}`,
        type: 'ITEM_COIN',
        x: crate.x + 18,
        y: crate.y,
        z: 25,
        vz: 140,
        value: 350,
        dead: false,
      });
    }
  }

  private destroyBarrel(barrel: BarrelEntity) {
    sound.playBarrelSmash();
    this.screenShake = 6;
    this.spawnSplinters(barrel.x, barrel.y - 20, 18);
    this.addMangaText(barrel.x, barrel.y - 40, 'CRASH!!', '#d4a373');

    if (barrel.contains === 'meat') {
      this.items.push({
        id: `meat_${Math.random()}`,
        type: 'ITEM_MEAT',
        x: barrel.x,
        y: barrel.y,
        z: 25,
        vz: 120,
        value: 40,
        dead: false,
      });
    } else if (barrel.contains === 'energy') {
      this.items.push({
        id: `energy_${Math.random()}`,
        type: 'ITEM_ENERGY',
        x: barrel.x,
        y: barrel.y,
        z: 25,
        vz: 120,
        value: 50,
        dead: false,
      });
    } else {
      this.items.push({
        id: `coin_${Math.random()}`,
        type: 'ITEM_COIN',
        x: barrel.x,
        y: barrel.y,
        z: 25,
        vz: 140,
        value: 500,
        dead: false,
      });
    }
  }

  private defeatEnemy(enemy: EnemyEntity) {
    enemy.dead = true;
    this.totalEnemiesDefeated++;
    this.enemiesDefeatedInWave++;
    this.player.score += (enemy.type === 'BOSS_ALVIDA' || enemy.type === 'BOSS_MORGAN') ? 10000 : enemy.isBrute ? 800 : 400;

    // Track in achievements manager
    achievements.recordEnemyDefeated();

    this.spawnDefeatParticles(enemy.x, enemy.y - 30);

    // If final wave in Stage 5, drop Zoro's Three Swords!
    if (this.currentStage === 'STAGE_5_FORTRESS_INTERIOR' && this.wave === this.maxWaves) {
      const active = this.enemies.filter((e) => !e.dead);
      if (active.length === 0) {
        this.items.push({
          id: 'zoro_swords',
          type: 'ITEM_SWORDS',
          x: enemy.x,
          y: enemy.y,
          z: 30,
          vz: 140,
          value: 1000,
          dead: false,
        });
        this.addMangaText(enemy.x, enemy.y - 60, 'AS ESPADAS DO ZORO!!', '#ffd700', 1.5);
      }
    }

    // Meat & Apple Drop Sustainability: If player HP is low (<75), 35% chance to drop meat/apples
    if (this.player.hp < 75 && Math.random() < 0.35 && enemy.type !== 'BOSS_ALVIDA' && enemy.type !== 'BOSS_MORGAN') {
      const isMeat = Math.random() < 0.6;
      this.items.push({
        id: `drop_${Math.random()}`,
        type: isMeat ? 'ITEM_MEAT' : 'ITEM_APPLE',
        x: enemy.x,
        y: enemy.y,
        z: 25,
        vz: 130,
        value: isMeat ? 35 : 25,
        dead: false,
      });
    }

    if (enemy.type === 'BOSS_ALVIDA') {
      GameEngine.unlockStage(4);
      achievements.recordBossDefeated('ALVIDA');
      sound.playHeavySmash();
      sound.playVictoryFanfare();
      this.screenShake = 18;
      this.hitstopTimer = 0.15;
      this.addMangaText(enemy.x, enemy.y - 80, 'BAZOOKA!! KO!!', '#ff0055', 2.2);

      window.setTimeout(() => {
        this.state = 'VICTORY';
        this.onStateChange?.(this.state);
      }, 1600);
    } else if (enemy.type === 'BOSS_MORGAN') {
      GameEngine.unlockStage(6);
      achievements.recordBossDefeated('MORGAN');
      sound.playHeavySmash();
      sound.playVictoryFanfare();
      this.screenShake = 22;
      this.hitstopTimer = 0.2;
      this.addMangaText(enemy.x, enemy.y - 80, 'ONI GIRI!! KO!!', '#22c55e', 2.4);

      window.setTimeout(() => {
        this.state = 'VICTORY';
        this.onStateChange?.(this.state);
      }, 1600);
    }
  }

  // Enemies AI Update with Fair Telegraph Warnings & Windup Timers
  private updateEnemies(dt: number) {
    const p = this.player;

    this.enemies.forEach((enemy) => {
      if (enemy.dead) return;

      if (enemy.invulnerableTimer > 0) {
        enemy.invulnerableTimer -= dt;
      }

      // Air gravity for knockback
      if (enemy.z > 0 || enemy.vz !== 0) {
        enemy.z += enemy.vz * dt;
        enemy.vz -= 850 * dt;
        if (enemy.z <= 0) {
          enemy.z = 0;
          enemy.vz = 0;
          if (enemy.action === 'FALLEN') {
            enemy.action = 'IDLE';
          }
        }
      }

      // Update position
      enemy.x += enemy.vx * dt;
      enemy.y += enemy.vy * dt;
      enemy.vx *= 0.88;
      enemy.vy *= 0.88;

      enemy.y = Math.max(this.minDeckY, Math.min(this.maxDeckY, enemy.y));

      // AI Logic: HURT interrupts any windup or attack!
      if (enemy.action === 'HURT') {
        enemy.actionTimer += dt;
        if (enemy.actionTimer > 0.3) {
          enemy.action = 'IDLE';
          enemy.actionTimer = 0;
        }
        return;
      }

      const dx = p.x - enemy.x;
      const dy = p.y - enemy.y;
      const dist = Math.hypot(dx, dy);

      enemy.facing = dx > 0 ? 1 : -1;

      // Handle Telegraph Windup State (player can dodge or hit them to interrupt!)
      if (enemy.action === 'ATTACK_WINDUP') {
        enemy.windupTimer -= dt;
        enemy.vx = 0;
        enemy.vy = 0;

        if (enemy.windupTimer <= 0) {
          // Release planned attack!
          if (enemy.type === 'BOSS_MORGAN') {
            const attackType = enemy.plannedAttack || 'ATTACK';
            enemy.action = attackType;
            enemy.actionTimer = 0;
            if (attackType === 'SLAM') {
              enemy.attackCooldown = 2.4;
              sound.playHeavySmash();
              this.screenShake = 10;
              this.executeEnemyAttack(enemy, 35, 95);
              this.addMangaText(enemy.x, enemy.y - 70, 'AXE SLAM!!', '#e63946');
            } else if (attackType === 'SPIN') {
              enemy.attackCooldown = 2.8;
              sound.playPunch(3);
              this.screenShake = 8;
              this.executeEnemyAttack(enemy, 30, 110);
              this.addMangaText(enemy.x, enemy.y - 70, '360° CLEAVE!!', '#d90429');
            } else {
              enemy.attackCooldown = 1.6;
              sound.playPunch(2);
              this.executeEnemyAttack(enemy, 25, 80);
            }
          } else if (enemy.type === 'BOSS_ALVIDA') {
            const attackType = enemy.plannedAttack || 'ATTACK';
            enemy.action = attackType;
            enemy.actionTimer = 0;
            if (attackType === 'SLAM') {
              enemy.attackCooldown = 2.0;
              sound.playHeavySmash();
              this.screenShake = 9;
              this.executeEnemyAttack(enemy, 30, 85);
              this.addMangaText(enemy.x, enemy.y - 65, 'IRON MACE!!', '#9d4edd');
            } else {
              enemy.attackCooldown = 1.4;
              sound.playPunch(2);
              this.executeEnemyAttack(enemy, 20, 70);
            }
          } else {
            enemy.action = 'ATTACK';
            enemy.actionTimer = 0;
            enemy.attackCooldown = enemy.isGunner ? 2.5 : 1.5;
            sound.playPunch(1);
            this.executeEnemyAttack(enemy, enemy.isGunner ? 14 : enemy.isBrute ? 18 : 10, enemy.isGunner ? 260 : 45);
          }
        }
        return;
      }

      if (enemy.type === 'BOSS_MORGAN') {
        // Axe-Hand Morgan AI: Slam, Whirlwind Spin, and Axe Cleave
        enemy.actionTimer += dt;
        if (enemy.attackCooldown > 0) {
          enemy.attackCooldown -= dt;
        }

        if (dist > 90) {
          enemy.action = 'WALK';
          const speed = 110;
          enemy.vx = (dx / dist) * speed;
          enemy.vy = (dy / dist) * speed * 0.7;
        } else if (enemy.attackCooldown <= 0) {
          // Enter Telegraph Windup
          const rand = Math.random();
          enemy.action = 'ATTACK_WINDUP';
          enemy.windupTimer = 0.5;
          enemy.plannedAttack = rand < 0.35 ? 'SLAM' : rand < 0.7 ? 'SPIN' : 'ATTACK';
        } else {
          enemy.action = 'IDLE';
        }
      } else if (enemy.type === 'BOSS_ALVIDA') {
        // Alvida AI
        enemy.actionTimer += dt;
        if (enemy.attackCooldown > 0) {
          enemy.attackCooldown -= dt;
        }

        if (dist > 80) {
          enemy.action = 'WALK';
          const speed = 120;
          enemy.vx = (dx / dist) * speed;
          enemy.vy = (dy / dist) * speed * 0.7;
        } else if (enemy.attackCooldown <= 0) {
          // Enter Telegraph Windup
          const rand = Math.random();
          enemy.action = 'ATTACK_WINDUP';
          enemy.windupTimer = 0.48;
          enemy.plannedAttack = rand < 0.45 ? 'SLAM' : 'ATTACK';
        } else {
          enemy.action = 'IDLE';
        }
      } else {
        // Standard Grunts & Riflemen
        if (enemy.attackCooldown > 0) {
          enemy.attackCooldown -= dt;
        }

        const preferredDist = enemy.isGunner ? 180 : 50;

        if (dist > preferredDist + 20) {
          enemy.action = 'WALK';
          const speed = enemy.isBrute ? 100 : 130;
          enemy.vx = (dx / dist) * speed;
          enemy.vy = (dy / dist) * speed * 0.7;
        } else if (enemy.attackCooldown <= 0 && Math.abs(dy) < 32) {
          // Enter Telegraph Windup
          enemy.action = 'ATTACK_WINDUP';
          enemy.windupTimer = enemy.isGunner ? 0.6 : 0.38;
        } else {
          enemy.action = 'IDLE';
        }
      }
    });
  }

  private executeEnemyAttack(enemy: EnemyEntity, damage: number, reach: number) {
    const p = this.player;
    if (p.invulnerableTimer > 0) return;

    const dx = (p.x - enemy.x) * enemy.facing;
    const dy = Math.abs(p.y - enemy.y);

    if (dx > -15 && dx < reach && dy < 38) {
      p.hp -= damage;
      p.invulnerableTimer = 0.6;
      p.action = 'HURT';
      p.vx = enemy.facing * 180;
      p.combo = 0;

      this.screenShake = 8;
      sound.playHitImpact(true);
      this.onPlayerDamaged?.(damage);

      this.addDamagePopup(p.x, p.y - 50, `-${damage}`, '#e63946', 1.3);

      if (p.hp <= 0) {
        p.hp = 0;
        this.state = 'GAME_OVER';
        sound.playGameOver();
        this.onStateChange?.(this.state);
      }
    }
  }

  // Barrels, Rolling Barrels and Items Update
  private updateBarrelsAndItems(dt: number) {
    const p = this.player;

    // 1. Rolling barrels physics
    this.rollingBarrels.forEach((rb) => {
      rb.x += rb.vx * dt;
      rb.distanceTraveled += Math.abs(rb.vx * dt);
      rb.rotation += rb.vx * dt * 0.08;

      // Hit enemies in path (Bowling effect!)
      this.enemies.forEach((enemy) => {
        if (enemy.dead || enemy.invulnerableTimer > 0) return;
        const dist = Math.hypot(enemy.x - rb.x, enemy.y - rb.y);
        if (dist < 36) {
          rb.hitCount++;
          enemy.hp -= 40;
          enemy.invulnerableTimer = 0.25;
          enemy.action = 'HURT';
          enemy.vx = Math.sign(rb.vx) * 260;
          enemy.vz = 140;
          sound.playHeavySmash();
          this.screenShake = 8;
          this.spawnHitSparks(enemy.x, enemy.y - 25);
          this.addDamagePopup(enemy.x, enemy.y - 45, '40', '#ff9f1c');
          this.addMangaText(enemy.x, enemy.y - 65, 'STRIKE!!', '#ff5400', 1.3);

          if (rb.hitCount >= 2) {
            achievements.recordBarrelStrike();
          }

          if (enemy.hp <= 0) {
            this.defeatEnemy(enemy);
          }
          rb.dead = true;
          this.destroyBarrel({ id: rb.id, x: rb.x, y: rb.y, hp: 0, isCracked: true, dead: true, contains: 'meat' });
        }
      });

      if (rb.distanceTraveled > 580 || rb.x < 30 || rb.x > this.shipLength - 30) {
        rb.dead = true;
        this.destroyBarrel({ id: rb.id, x: rb.x, y: rb.y, hp: 0, isCracked: true, dead: true, contains: 'coin' });
      }
    });
    this.rollingBarrels = this.rollingBarrels.filter((rb) => !rb.dead);

    // 2. Items pickup
    this.items.forEach((item) => {
      if (item.dead) return;

      if (item.z > 0 || item.vz !== 0) {
        item.z += item.vz * dt;
        item.vz -= 600 * dt;
        if (item.z <= 0) {
          item.z = 0;
          item.vz = 0;
        }
      }

      const dist = Math.hypot(item.x - p.x, item.y - p.y);
      if (dist < 34) {
        item.dead = true;
        if (item.type === 'ITEM_MEAT') {
          p.hp = Math.min(p.maxHp, p.hp + item.value);
          sound.playMeatPickup();
          achievements.recordMeatEaten();
          this.addMangaText(p.x, p.y - 50, '+HP CARNE!', '#52b788', 1.2);
        } else if (item.type === 'ITEM_APPLE') {
          p.hp = Math.min(p.maxHp, p.hp + item.value);
          p.energy = Math.min(p.maxEnergy, p.energy + item.value);
          sound.playMeatPickup();
          achievements.recordMeatEaten();
          this.addMangaText(p.x, p.y - 50, '+MAÇÃ FRESCA!', '#e63946', 1.2);
        } else if (item.type === 'ITEM_ENERGY') {
          p.energy = Math.min(p.maxEnergy, p.energy + item.value);
          sound.playMeatPickup();
          this.addMangaText(p.x, p.y - 50, '+ENERGIA!', '#00b4d8', 1.2);
        } else if (item.type === 'ITEM_COIN') {
          p.score += item.value;
          sound.playMeatPickup();
          this.addMangaText(p.x, p.y - 50, `+${item.value} BERRIES!`, '#ffd166', 1.2);
        } else if (item.type === 'ITEM_SWORDS') {
          // Retrieved Zoro's Swords!
          p.score += 2500;
          sound.playPowerup();
          achievements.recordZoroFreed();
          GameEngine.unlockStage(6);
          this.addMangaText(p.x, p.y - 60, 'ESPADAS RECUPERADAS!', '#ffd700', 1.6);

          // Transition to freeing Zoro & Morgan Showdown
          window.setTimeout(() => {
            this.state = 'STAGE_TRANSITION';
            this.onStateChange?.(this.state);
          }, 1200);
        }
      }
    });

    this.items = this.items.filter((item) => !item.dead);
  }

  // Wave & Stage advancement check
  private checkWaveProgress() {
    const activeEnemies = this.enemies.filter((e) => !e.dead);
    if (activeEnemies.length === 0) {
      if (this.wave < this.maxWaves) {
        this.wave++;
        this.spawnWave(this.wave);
        this.addMangaText(this.player.x, this.player.y - 70, `ONDA ${this.wave}!`, '#ffbe0b', 1.4);
      } else {
        // Stage cleared
        if (this.currentStage === 'STAGE_1_GALLEY') {
          GameEngine.unlockStage(2);
          this.state = 'STAGE_TRANSITION';
          this.onStateChange?.(this.state);
        } else if (this.currentStage === 'STAGE_2_DECK') {
          GameEngine.unlockStage(3);
          this.state = 'STAGE_TRANSITION';
          this.onStateChange?.(this.state);
        } else if (this.currentStage === 'STAGE_4_BASE_COURTYARD') {
          GameEngine.unlockStage(5);
          this.state = 'STAGE_TRANSITION';
          this.onStateChange?.(this.state);
        }
      }
    }
  }

  // Advance to Next Stage in Story Mode
  public proceedToNextStage() {
    if (this.currentStage === 'STAGE_1_GALLEY') {
      this.startStage('STAGE_2_DECK');
    } else if (this.currentStage === 'STAGE_2_DECK') {
      this.startStage('STAGE_3_BOSS');
    } else if (this.currentStage === 'STAGE_3_BOSS') {
      this.startStage('STAGE_4_BASE_COURTYARD');
    } else if (this.currentStage === 'STAGE_4_BASE_COURTYARD') {
      this.startStage('STAGE_5_FORTRESS_INTERIOR');
    } else if (this.currentStage === 'STAGE_5_FORTRESS_INTERIOR') {
      this.startStage('STAGE_6_MORGAN_SHOWDOWN');
    }
  }

  // Particle & FX management
  private updateParticles(dt: number) {
    this.particles.forEach((pt) => {
      pt.x += pt.vx * dt;
      pt.y += pt.vy * dt;
      pt.life += dt;
    });
    this.particles = this.particles.filter((pt) => pt.life < pt.maxLife);

    this.damagePopups.forEach((dp) => {
      dp.y -= dt * 45;
      dp.life += dt;
    });
    this.damagePopups = this.damagePopups.filter((dp) => dp.life < dp.maxLife);
  }

  public spawnHitSparks(x: number, y: number) {
    for (let i = 0; i < 8; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 70 + Math.random() * 120;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: this.player.character === 'ZORO' ? (Math.random() > 0.5 ? '#22c55e' : '#86efac') : (Math.random() > 0.5 ? '#ffff00' : '#ff5400'),
        size: 3 + Math.random() * 3,
        life: 0,
        maxLife: 0.22,
        shape: 'spark',
      });
    }
  }

  public spawnSplinters(x: number, y: number, count: number = 12) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 50 + Math.random() * 140;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 60,
        color: Math.random() > 0.5 ? '#b08968' : '#7f4f24',
        size: 4 + Math.random() * 4,
        life: 0,
        maxLife: 0.45,
        shape: 'splinter',
      });
    }
  }

  public spawnDefeatParticles(x: number, y: number) {
    for (let i = 0; i < 16; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 80 + Math.random() * 180;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: Math.random() > 0.5 ? '#ffd166' : '#ef476f',
        size: 4 + Math.random() * 4,
        life: 0,
        maxLife: 0.4,
        shape: 'star',
      });
    }
  }

  public spawnDust(x: number, y: number) {
    for (let i = 0; i < 3; i++) {
      this.particles.push({
        x: x - this.player.facing * (10 + Math.random() * 15),
        y: y - 2,
        vx: -this.player.facing * (30 + Math.random() * 30),
        vy: -(15 + Math.random() * 20),
        color: 'rgba(255, 255, 255, 0.45)',
        size: 5 + Math.random() * 4,
        life: 0,
        maxLife: 0.35,
        shape: 'smoke',
      });
    }
  }

  public addDamagePopup(x: number, y: number, text: string, color: string = '#ffd166', scale: number = 1) {
    this.damagePopups.push({
      id: `dp_${Math.random()}`,
      x,
      y,
      text,
      color,
      scale,
      life: 0,
      maxLife: 0.65,
    });
  }

  public addMangaText(x: number, y: number, text: string, color: string = '#ff0055', scale: number = 1.6) {
    this.damagePopups.push({
      id: `manga_${Math.random()}`,
      x,
      y,
      text,
      color,
      scale,
      life: 0,
      maxLife: 0.85,
    });
  }

  // Render Full 2.5D World
  public render(ctx: CanvasRenderingContext2D) {
    this.draw(ctx);
  }

  public draw(ctx: CanvasRenderingContext2D) {
    ctx.save();

    // 1. Screenshake
    if (this.screenShake > 0) {
      const sx = (Math.random() - 0.5) * this.screenShake;
      const sy = (Math.random() - 0.5) * this.screenShake;
      ctx.translate(sx, sy);
    }

    // 1b. Cinematic Camera Zoom (Smooth arcade flourish centered on player)
    const playerScreenX = this.player.x - this.camX;
    const playerScreenY = this.player.y - this.player.z;
    if (this.cameraZoom !== 1.0) {
      ctx.translate(playerScreenX, playerScreenY);
      ctx.scale(this.cameraZoom, this.cameraZoom);
      ctx.translate(-playerScreenX, -playerScreenY);
    }

    // 2. Parallax Background
    SpriteRenderer.drawBackground(ctx, this.camX, this.width, this.height, this.gameTime, this.currentStage);

    // 3. Depth-Sorted Entities
    const renderables: { y: number; draw: () => void }[] = [];

    // Air Slash Flying Projectiles
    this.projectiles.forEach((proj) => {
      const screenX = proj.x - this.camX;
      if (screenX > -100 && screenX < this.width + 100) {
        renderables.push({
          y: proj.y,
          draw: () => {
            SpriteRenderer.drawAirSlash(
              ctx,
              screenX,
              proj.y - proj.z,
              proj.facing,
              this.gameTime,
              proj.character
            );
          },
        });
      }
    });

    // Barrels
    this.barrels.forEach((barrel) => {
      if (barrel.dead) return;
      const screenX = barrel.x - this.camX;
      if (screenX > -50 && screenX < this.width + 50) {
        renderables.push({
          y: barrel.y,
          draw: () => SpriteRenderer.drawBarrel(ctx, screenX, barrel.y, barrel.isCracked),
        });
      }
    });

    // Crates
    this.crates.forEach((crate) => {
      if (crate.dead) return;
      const screenX = crate.x - this.camX;
      if (screenX > -50 && screenX < this.width + 50) {
        renderables.push({
          y: crate.y,
          draw: () => SpriteRenderer.drawCrate(ctx, screenX, crate.y, crate.isCracked),
        });
      }
    });

    // Rolling Barrels
    this.rollingBarrels.forEach((rb) => {
      if (rb.dead) return;
      const screenX = rb.x - this.camX;
      if (screenX > -50 && screenX < this.width + 50) {
        renderables.push({
          y: rb.y,
          draw: () => SpriteRenderer.drawRollingBarrel(ctx, screenX, rb.y, rb.rotation),
        });
      }
    });

    // Items
    this.items.forEach((item) => {
      if (item.dead) return;
      const screenX = item.x - this.camX;
      if (screenX > -50 && screenX < this.width + 50) {
        renderables.push({
          y: item.y,
          draw: () => {
            if (item.type === 'ITEM_MEAT') {
              SpriteRenderer.drawMeat(ctx, screenX, item.y - item.z, this.gameTime);
            } else if (item.type === 'ITEM_APPLE') {
              SpriteRenderer.drawApple(ctx, screenX, item.y - item.z, this.gameTime);
            } else if (item.type === 'ITEM_SWORDS') {
              SpriteRenderer.drawSwordsItem(ctx, screenX, item.y - item.z, this.gameTime);
            } else {
              SpriteRenderer.drawCoin(ctx, screenX, item.y - item.z, this.gameTime);
            }
          },
        });
      }
    });

    // Enemies
    this.enemies.forEach((enemy) => {
      if (enemy.dead) return;
      const screenX = enemy.x - this.camX;
      if (screenX > -100 && screenX < this.width + 100) {
        renderables.push({
          y: enemy.y,
          draw: () => {
            if (enemy.invulnerableTimer > 0 && Math.floor(this.gameTime * 30) % 2 === 0) {
              ctx.filter = 'brightness(2.2)';
            }
            if (enemy.type === 'BOSS_ALVIDA') {
              SpriteRenderer.drawAlvida(
                ctx,
                screenX,
                enemy.y,
                enemy.z,
                enemy.facing,
                enemy.action,
                enemy.actionTimer
              );
            } else if (enemy.type === 'BOSS_MORGAN') {
              SpriteRenderer.drawMorgan(
                ctx,
                screenX,
                enemy.y,
                enemy.z,
                enemy.facing,
                enemy.action,
                enemy.actionTimer,
                enemy.actionTimer * 30
              );
            } else if (enemy.type === 'ENEMY_MARINE_SWORD' || enemy.type === 'ENEMY_MARINE_GUN') {
              SpriteRenderer.drawMarineGrunt(
                ctx,
                screenX,
                enemy.y,
                enemy.z,
                enemy.facing,
                enemy.action,
                enemy.actionTimer,
                enemy.actionTimer * 30,
                enemy.type === 'ENEMY_MARINE_GUN'
              );
            } else {
              SpriteRenderer.drawPirateGrunt(
                ctx,
                screenX,
                enemy.y,
                enemy.z,
                enemy.facing,
                enemy.action,
                enemy.actionTimer,
                enemy.isBrute
              );
            }
            ctx.filter = 'none';
          },
        });
      }
    });

    // Player (Luffy or Zoro!)
    renderables.push({
      y: this.player.y,
      draw: () => {
        if (this.player.invulnerableTimer > 0 && Math.floor(this.gameTime * 30) % 2 === 0) {
          ctx.filter = 'brightness(2.2)';
        }

        if (this.player.character === 'ZORO') {
          SpriteRenderer.drawZoro(
            ctx,
            playerScreenX,
            this.player.y,
            this.player.z,
            this.player.facing,
            this.player.action,
            this.player.actionTimer,
            this.player.walkFrame
          );
        } else {
          SpriteRenderer.drawLuffy(
            ctx,
            playerScreenX,
            this.player.y,
            this.player.z,
            this.player.facing,
            this.player.action,
            this.player.actionTimer,
            this.player.walkFrame
          );
        }
        ctx.filter = 'none';
      },
    });

    // Sort by Y for 2.5D visual depth
    renderables.sort((a, b) => a.y - b.y);
    renderables.forEach((r) => r.draw());

    // 4. Render Particles
    this.particles.forEach((pt) => {
      const px = pt.x - this.camX;
      ctx.fillStyle = pt.color;
      if (pt.shape === 'splinter') {
        ctx.fillRect(px, pt.y, pt.size, pt.size * 0.4);
      } else {
        ctx.beginPath();
        ctx.arc(px, pt.y, pt.size, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // 5. Render Manga Damage Popups & Text
    this.damagePopups.forEach((dp) => {
      const px = dp.x - this.camX;
      ctx.save();
      ctx.font = `900 ${Math.round(18 * dp.scale)}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 4;
      ctx.strokeText(dp.text, px, dp.y);
      ctx.fillStyle = dp.color;
      ctx.fillText(dp.text, px, dp.y);
      ctx.restore();
    });

    // 6. Cinematic Speed Lines & Arcade High Combo Flourish
    if (this.player.combo >= 20) {
      const intensity = Math.min(1.0, (this.player.combo - 18) / 8);
      SpriteRenderer.drawSpeedLines(
        ctx,
        this.width,
        this.height,
        this.gameTime,
        intensity,
        playerScreenX,
        playerScreenY
      );
    }

    ctx.restore();
  }
}
