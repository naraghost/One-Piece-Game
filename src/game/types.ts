export type StageId = 
  | 'STAGE_1_GALLEY'            // Porão & Despensa de Alimentos (Alvida)
  | 'STAGE_2_DECK'              // Convés Principal do Navio (Alvida)
  | 'STAGE_3_BOSS'              // Castelo de Popa - Duelo com Alvida
  | 'STAGE_4_BASE_COURTYARD'    // Shells Town - Pátio da Base da Marinha (Zoro amarrado)
  | 'STAGE_5_FORTRESS_INTERIOR' // Shells Town - Torre do Capitão Morgan (Resgatar espadas)
  | 'STAGE_6_MORGAN_SHOWDOWN';  // Shells Town - Duelo Final: Zoro vs Capitão Morgan

export type GameState = 
  | 'TITLE_MENU'
  | 'PROLOGUE'
  | 'STAGE_TRANSITION'
  | 'PLAYING'
  | 'BOSS_INTRO'
  | 'PAUSED'
  | 'VICTORY'
  | 'GAME_OVER';

export type EntityType = 
  | 'PLAYER'
  | 'ENEMY_GRUNT'
  | 'ENEMY_BRUTE'
  | 'ENEMY_GUNNER'
  | 'ENEMY_MARINE_SWORD'
  | 'ENEMY_MARINE_GUN'
  | 'BOSS_ALVIDA'
  | 'BOSS_MORGAN'
  | 'BARREL'
  | 'CRATE'
  | 'ROLLING_BARREL'
  | 'ITEM_MEAT'
  | 'ITEM_COIN'
  | 'ITEM_ENERGY'
  | 'ITEM_APPLE'
  | 'ITEM_SWORDS';

export interface Vector2D {
  x: number;
  y: number;
}

export interface InputState {
  left: boolean;
  right: boolean;
  up: boolean;
  down: boolean;
  punch: boolean;
  pistol: boolean;
  jump: boolean;
  special: boolean;
  dash: boolean;
  justPunch: boolean;
  justPistol: boolean;
  justJump: boolean;
  justSpecial: boolean;
  justDash: boolean;
}

export type PlayerCharacter = 'LUFFY' | 'ZORO';

export type PlayerAction = 
  | 'IDLE'
  | 'WALK'
  | 'DASH'
  | 'JUMP'
  | 'AIR_ATTACK'  // Gomu Gomu no Stamp / Zoro Aerial Slash
  | 'PUNCH_1'     // Luffy Punch 1 / Zoro Slash 1
  | 'PUNCH_2'     // Luffy Punch 2 / Zoro Slash 2
  | 'PUNCH_3'     // Luffy Punch 3 / Zoro Santoryu Cross Slash
  | 'PISTOL'      // Luffy Pistol / Zoro Flying Slash (Iai / Wind Blade)
  | 'SPECIAL'     // Luffy Gatling / Zoro Oni Giri (Demon Slash)
  | 'FINISHER'    // Luffy Bazooka / Zoro Sanzen Sekai (Cinematic Finisher)
  | 'HURT'
  | 'FALLEN';

export interface FinisherCinematicData {
  character: PlayerCharacter;
  moveName: string;
  japaneseTitle: string;
  subTitle: string;
}

export type EnemyAction = 
  | 'IDLE'
  | 'WALK'
  | 'ATTACK_WINDUP'
  | 'ATTACK'
  | 'HURT'
  | 'FALLEN'
  | 'SPIN'        // Alvida whirlwind spin / Morgan 360 axe cleave
  | 'SLAM';       // Alvida mace slam / Morgan ground shockwave

export interface HitBox {
  x: number;
  y: number;
  width: number;
  height: number;
  damage: number;
  knockbackX: number;
  knockbackY: number;
  isSpecial?: boolean;
}

export interface DamagePopup {
  id: string;
  x: number;
  y: number;
  text: string;
  color: string;
  scale: number;
  life: number;
  maxLife: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  life: number;
  maxLife: number;
  shape?: 'spark' | 'splinter' | 'smoke' | 'star' | 'slash';
}

export interface Projectile {
  id: string;
  owner: 'PLAYER' | 'ENEMY';
  character?: PlayerCharacter;
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  damage: number;
  life: number;
  maxLife: number;
  facing: 1 | -1;
  hitEntities: Set<string>;
  type: 'AIR_SLASH';
}

export interface DialogueMessage {
  speaker: 'Luffy' | 'Coby' | 'Alvida' | 'Pirata' | 'Narrador' | 'Zoro' | 'Morgan' | 'Helmeppo' | 'Marinheiro';
  portrait: 'luffy' | 'coby' | 'alvida' | 'pirate' | 'narrator' | 'zoro' | 'morgan' | 'helmeppo' | 'marine';
  text: string;
  scene?: 
    | 'whirlpool' 
    | 'barrel_sea' 
    | 'barrel_fish' 
    | 'barrel_burst' 
    | 'galley' 
    | 'deck' 
    | 'alvida_intro' 
    | 'victory'
    | 'marine_courtyard'
    | 'zoro_bound'
    | 'morgan_tower'
    | 'zoro_freed'
    | 'morgan_boss'
    | 'zoro_joined';
  title?: string;
  sfx?: 'DON' | 'DODON' | 'BAAM' | 'SHING' | 'BASH' | 'KABOOM' | 'GOGOGO';
  bubbleType?: 'normal' | 'shout' | 'thought' | 'narrative';
  expression?: 'grin' | 'angry' | 'shocked' | 'determined' | 'scared';
}
