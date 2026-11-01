export type StageId = 
  | 'STAGE_1_GALLEY'            // Porão & Despensa de Alimentos (Alvida)
  | 'STAGE_2_DECK'              // Convés Principal do Navio (Alvida)
  | 'STAGE_3_BOSS'              // Castelo de Popa - Duelo com Alvida
  | 'STAGE_4_BASE_COURTYARD'    // Shells Town - Pátio da Base da Marinha (Zoro amarrado)
  | 'STAGE_5_FORTRESS_INTERIOR' // Shells Town - Torre do Capitão Morgan (Resgatar espadas)
  | 'STAGE_6_MORGAN_SHOWDOWN'   // Shells Town - Duelo Final: Zoro vs Capitão Morgan
  | 'STAGE_7_ORANGE_TOWN';      // Orange Town - Vila Laranja & Frota do Capitão Buggy

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
  | 'ENEMY_MARINE_ELITE'        // Shells Town Captain Morgan's Elite Halberd Guard
  | 'ENEMY_CLOWN_ACROBAT'       // Orange Town Acrobat Knife Juggler
  | 'ENEMY_CLOWN_UNICYCLE'      // Orange Town Unicycle Sword Clown
  | 'BOSS_ALVIDA'
  | 'BOSS_MORGAN'
  | 'BOSS_BUGGY'                // Orange Town Boss: Buggy the Star Clown
  | 'BARREL'
  | 'CRATE'
  | 'BARRICADE'                 // Metal Slug style destructible obstacle
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
  | 'JUGGLE'      // Acrobat Knife Juggler Throw
  | 'SPLIT'       // Buggy Bara Bara Split
  | 'HURT'
  | 'STUNNED'     // Stunned for 1.5s on heavy damage
  | 'FALLEN'
  | 'SPIN'        // Alvida whirlwind spin / Morgan 360 axe cleave / Unicycle spin
  | 'SLAM';       // Alvida mace slam / Morgan ground shockwave

export interface BarricadeEntity {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  hp: number;
  maxHp: number;
  isCracked: boolean;
  dead: boolean;
  type: 'WOODEN_BARRICADE' | 'CLOWN_CANNON_WAGON';
}

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
  type: 'AIR_SLASH' | 'JUGGLER_DAGGER' | 'BUGGY_CHOP';
}

export interface DialogueMessage {
  speaker: 'Luffy' | 'Coby' | 'Alvida' | 'Pirata' | 'Narrador' | 'Zoro' | 'Morgan' | 'Helmeppo' | 'Marinheiro' | 'Buggy' | 'Cabaji' | 'Mohji' | 'Chouchou';
  portrait: 'luffy' | 'coby' | 'alvida' | 'pirate' | 'narrator' | 'zoro' | 'morgan' | 'helmeppo' | 'marine' | 'buggy' | 'cabaji' | 'mohji' | 'chouchou';
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
    | 'zoro_joined'
    | 'orange_town'
    | 'buggy_circus'
    | 'buggy_boss'
    | 'buggy_defeat';
  title?: string;
  sfx?: 'DON' | 'DODON' | 'BAAM' | 'SHING' | 'BASH' | 'KABOOM' | 'GOGOGO';
  bubbleType?: 'normal' | 'shout' | 'thought' | 'narrative';
  expression?: 'grin' | 'angry' | 'shocked' | 'determined' | 'scared';
}
