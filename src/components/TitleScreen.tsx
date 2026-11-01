import React, { useState, useEffect } from 'react';
import {
  Play,
  Sparkles,
  Trophy,
  Compass,
  Volume2,
  VolumeX,
  X,
  Swords,
  Lock,
  CheckCircle2,
  RotateCcw,
  Maximize,
  Save,
  BookOpen,
  ChevronRight,
  Anchor,
  Flame,
  Ship,
  MapPin,
} from 'lucide-react';
import { sound } from '../game/audio';
import { StageId, PlayerCharacter } from '../game/types';
import { GameEngine } from '../game/engine';
import { SaveManager, SaveSlot } from '../game/storage';
import { CharacterSelectModal } from './CharacterSelectModal';
import { SaveSlotsModal } from './SaveSlotsModal';
import { CharacterGalleryModal } from './CharacterGalleryModal';

interface TitleScreenProps {
  onStart: (character?: PlayerCharacter) => void;
  onSelectStage: (stageId: StageId, character?: PlayerCharacter) => void;
  onOpenAchievements: () => void;
  highScore: number;
}

type MenuTab = 'LEGEND_LOG' | 'FREE_LOG' | 'DREAM_LOG' | 'SAVES' | 'GALLERY' | 'OPTIONS';

export const TitleScreen: React.FC<TitleScreenProps> = ({
  onStart,
  onSelectStage,
  onOpenAchievements,
  highScore,
}) => {
  const [allSlots, setAllSlots] = useState<Record<string, SaveSlot>>(() => SaveManager.getAllSlots());
  const [activeSlot, setActiveSlot] = useState<SaveSlot>(() => SaveManager.getActiveSlot());
  const [unlockedStage, setUnlockedStage] = useState<number>(() => GameEngine.getHighestUnlockedStage());
  const [activeTab, setActiveTab] = useState<MenuTab>('LEGEND_LOG');
  const [showStageSelect, setShowStageSelect] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [characterSelectTarget, setCharacterSelectTarget] = useState<{ stageId: StageId; name: string } | null>(null);
  const [selectedArc, setSelectedArc] = useState<'ALVIDA' | 'ZORO' | 'BUGGY'>('ALVIDA');
  const [isMuted, setIsMuted] = useState(sound.getMuted());
  const [lockWarning, setLockWarning] = useState<string | null>(null);

  const handleQuickSwitchSlot = (slotId: 'slot-1' | 'slot-2' | 'slot-3') => {
    sound.playPunch(1);
    const switched = SaveManager.setActiveSlot(slotId);
    setActiveSlot(switched);
    setUnlockedStage(switched.unlockedStage);
    setAllSlots(SaveManager.getAllSlots());
  };

  // Dynamic dialogue comment based on selected menu tab
  const getCobyDialogue = () => {
    switch (activeTab) {
      case 'LEGEND_LOG':
        return unlockedStage >= 7
          ? 'Luffy-san! Desbloqueamos a rota para Orange Town e a frota do Buggy!'
          : unlockedStage >= 4
          ? 'Chegamos a Shells Town! O temível Caçador de Piratas Zoro está preso na base!'
          : 'Luffy-san, vamos escapar do navio da Capitã Alvida e navegar rumo ao East Blue!';
      case 'FREE_LOG':
        return 'Aqui você pode reviver qualquer fase desbloqueada e lutar como Luffy ou Zoro!';
      case 'DREAM_LOG':
        return 'O Modo Sobrevivência testa sua coragem contra hordas intermináveis de piratas e marinheiros!';
      case 'SAVES':
        return 'Seus registros de bordo guardam todo o seu progresso, berries e tripulantes recrutados!';
      case 'GALLERY':
        return 'Veja detalhes dos combatentes, seus golpes característicos e estatísticas de combate!';
      default:
        return 'Grandes aventuras nos aguardam pelos mares do Grand Line!';
    }
  };

  useEffect(() => {
    sound.playTitleBGM();
    const current = SaveManager.getActiveSlot();
    setActiveSlot(current);
    setUnlockedStage(current.unlockedStage);
    setAllSlots(SaveManager.getAllSlots());
  }, []);

  const handleStartLegendLog = () => {
    sound.playPunch(2);
    const targetStageId = GameEngine.getStageIdByIndex(unlockedStage);
    const stageName = getStageTitle(targetStageId);
    // Show character selector before launching!
    setCharacterSelectTarget({ stageId: targetStageId, name: stageName });
  };

  const handleStageCardClick = (stageId: StageId, stageNum: number, name: string) => {
    if (stageNum > unlockedStage) {
      sound.playPunch(1);
      setLockWarning(`Fase ${stageNum} bloqueada! Conclua as fases anteriores para desbloquear.`);
      window.setTimeout(() => setLockWarning(null), 3500);
      return;
    }
    sound.playPunch(2);
    setCharacterSelectTarget({ stageId, name });
  };

  const handleConfirmDeploy = (character: PlayerCharacter) => {
    if (!characterSelectTarget) return;
    const { stageId } = characterSelectTarget;
    setCharacterSelectTarget(null);
    setShowStageSelect(false);
    onSelectStage(stageId, character);
  };

  const toggleSound = () => {
    const next = sound.toggleMute();
    setIsMuted(next);
  };

  const getStageTitle = (stageId: StageId): string => {
    switch (stageId) {
      case 'STAGE_1_GALLEY': return 'Porão do Miss Love Duck';
      case 'STAGE_2_DECK': return 'Convés Principal da Alvida';
      case 'STAGE_3_BOSS': return 'Duelo com a Capitã Alvida';
      case 'STAGE_4_BASE_COURTYARD': return 'Pátio da Base de Shells Town';
      case 'STAGE_5_FORTRESS_INTERIOR': return 'Torre do Capitão Morgan';
      case 'STAGE_6_MORGAN_SHOWDOWN': return 'Duelo: Zoro vs Morgan Mão-de-Machado';
      case 'STAGE_7_ORANGE_TOWN': return 'Orange Town: Frota do Capitão Buggy';
      default: return 'Mar do East Blue';
    }
  };

  return (
    <div
      onClick={() => sound.playTitleBGM()}
      className="absolute inset-0 z-30 flex flex-col justify-between p-3 sm:p-6 select-none overflow-hidden bg-[#0c1a2d]"
    >
      {/* 1. Grand Line Nautical Chart Background (Pirate Warriors Map Style) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Parchment Sea Map Texture */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#1e3a5f_0%,#09182a_75%,#040d18_100%)] opacity-95" />
        
        {/* Subtle Map Grid Lines & Compass Rose */}
        <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="nautical-grid" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#60a5fa" strokeWidth="0.8" strokeDasharray="3,3" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#nautical-grid)" />
          {/* Giant Grand Line Compass Rose on Right */}
          <g transform="translate(680, 260)" stroke="#f59e0b" strokeWidth="1.5" fill="none">
            <circle r="120" strokeDasharray="4,4" />
            <circle r="140" strokeWidth="0.8" />
            <path d="M 0 -150 L 15 -25 L 0 0 L -15 -25 Z" fill="#f59e0b" />
            <path d="M 0 150 L 15 25 L 0 0 L -15 25 Z" fill="#d97706" />
            <path d="M -150 0 L -25 -15 L 0 0 L -25 15 Z" fill="#b45309" />
            <path d="M 150 0 L 25 -15 L 0 0 L 25 15 Z" fill="#f59e0b" />
          </g>
        </svg>

        {/* Ambient Sea Mist & Golden Rays */}
        <div className="absolute -top-16 left-1/4 w-[600px] h-[600px] rounded-full bg-radial from-amber-400/15 via-sky-500/5 to-transparent blur-3xl animate-pulse" />
      </div>

      {/* 2. Top Header Bar with Direct Slot 1, 2, 3 Switchers, Ezequiel Credits & Utilities */}
      <div className="w-full flex flex-wrap items-center justify-between gap-3 z-10 max-w-6xl mx-auto">
        {/* Left: Direct Slot 1, 2, 3 Quick-Switch Buttons */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-slate-950/85 p-1 border border-amber-500/40 rounded-xl shadow-lg backdrop-blur-xs">
            <span className="text-[10px] font-bold text-amber-400/90 uppercase px-1.5 hidden sm:inline flex items-center gap-1">
              <Save size={12} className="text-amber-400" />
              <span>Saves:</span>
            </span>
            {(['slot-1', 'slot-2', 'slot-3'] as const).map((sid, idx) => {
              const s = allSlots[sid];
              const isCurrent = activeSlot.id === sid;
              return (
                <button
                  key={sid}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleQuickSwitchSlot(sid);
                  }}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                    isCurrent
                      ? 'bg-amber-500 text-slate-950 font-black shadow-[0_0_10px_rgba(245,158,11,0.6)] scale-105 border border-amber-200'
                      : 'bg-slate-900/90 text-amber-200/70 hover:bg-slate-800 hover:text-white border border-slate-800'
                  }`}
                  title={`Slot ${idx + 1}: ${s?.name || 'Novo Jogo'} - Fase ${s?.unlockedStage || 1}/7`}
                >
                  {isCurrent && <span className="text-slate-950 text-[10px] font-black">★</span>}
                  <span>Slot {idx + 1}</span>
                  <span className={`text-[10px] px-1 py-0.2 rounded font-mono ${isCurrent ? 'bg-black/20 text-slate-950' : 'bg-slate-800 text-amber-300'}`}>
                    Fase {s?.unlockedStage || 1}
                  </span>
                </button>
              );
            })}
            <button
              onClick={(e) => {
                e.stopPropagation();
                sound.playPunch(1);
                setShowSaveModal(true);
              }}
              className="p-1 px-2 text-xs text-amber-300 hover:text-white bg-slate-900 hover:bg-slate-800 rounded-lg border border-slate-700 cursor-pointer font-bold"
              title="Gerenciar, Criar ou Excluir Saves"
            >
              ⚙️
            </button>
          </div>
        </div>

        {/* Center: Author Credit Badge - "Criado por Ezequiel" */}
        <div className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500/20 via-yellow-500/30 to-amber-500/20 border-2 border-amber-400/80 px-3.5 py-1 rounded-full text-xs font-bold text-amber-200 shadow-[0_0_12px_rgba(245,158,11,0.4)] backdrop-blur-xs">
          <span className="text-sm">👑</span>
          <span className="font-heading tracking-wide">
            Criado por <b className="text-amber-300 font-black underline underline-offset-2">Ezequiel</b>
          </span>
        </div>

        {/* Right Utilities: Achievements, High Score, Fullscreen, Mute */}
        <div className="flex items-center gap-2">
          <div className="hidden lg:flex items-center gap-1.5 bg-slate-900/80 border border-white/20 px-3 py-1.5 text-xs font-arcade text-emerald-300 rounded-lg">
            <Trophy size={13} className="text-yellow-400" />
            <span>RECORDE:</span>
            <span className="font-mono text-white text-sm">{highScore}</span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenAchievements();
            }}
            className="flex items-center gap-1.5 bg-amber-500/20 border border-amber-400/80 text-amber-300 px-3 py-1 text-xs font-bold hover:bg-amber-500/30 transition-all cursor-pointer shadow rounded-lg"
          >
            <Trophy size={14} />
            <span className="hidden sm:inline">CONQUISTAS</span>
          </button>

          <button
            onClick={async (e) => {
              e.stopPropagation();
              try {
                if (!document.fullscreenElement) {
                  await document.documentElement.requestFullscreen?.();
                  if ('orientation' in screen && 'lock' in (screen.orientation as unknown as { lock: (o: string) => Promise<void> })) {
                    await (screen.orientation as unknown as { lock: (o: string) => Promise<void> }).lock('landscape').catch(() => {});
                  }
                } else {
                  await document.exitFullscreen?.();
                }
              } catch {
                // ignore
              }
            }}
            className="p-2 bg-slate-900/90 border border-white/20 text-amber-300 hover:text-white transition-colors cursor-pointer rounded-lg"
            title="Modo Paisagem / Tela Cheia"
          >
            <Maximize size={16} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleSound();
            }}
            className="p-2 bg-slate-900/90 border border-white/20 text-white hover:text-amber-300 transition-colors cursor-pointer rounded-lg"
            title="Alternar Som"
          >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} className="text-amber-400" />}
          </button>
        </div>
      </div>

      {/* 3. Main Center Content: Pirate Warriors 4 Styled Menu & Character Showcase */}
      <div className="w-full max-w-6xl mx-auto my-auto grid grid-cols-1 md:grid-cols-12 gap-6 items-center z-10 py-2">
        {/* Left Column: Game Logo & Angled Floating Action Planks */}
        <div className="md:col-span-7 flex flex-col items-start text-left">
          {/* Embossed One Piece Pirate Warriors Style Logo Banner */}
          <div className="mb-4">
            <div className="flex items-center gap-2">
              <span className="font-arcade text-[10px] tracking-widest text-amber-300 bg-red-950/80 border border-red-500/60 px-2.5 py-0.5 uppercase">
                ONE PIECE RETRO ARCADE
              </span>
              <span className="text-amber-400 text-xs font-bold">·</span>
              <span className="font-arcade text-[10px] tracking-wider text-sky-300">
                GRAND LINE SAGA
              </span>
            </div>

            <h1 className="font-arcade text-3xl sm:text-5xl md:text-6xl text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 via-amber-400 to-amber-600 tracking-wider drop-shadow-[0_4px_10px_rgba(0,0,0,0.9)] mt-1">
              ONE PIECE
            </h1>
            <div className="font-heading font-black text-xs sm:text-sm text-amber-200 tracking-widest uppercase flex items-center gap-2 mt-0.5">
              <span>PIRATE CHRONICLES</span>
              <span className="text-rose-500 font-bold">•</span>
              <span className="text-emerald-400">EAST BLUE DAWN</span>
            </div>
          </div>

          {/* Tilted Nautical Wooden Plank Action Banners (Pirate Warriors 4 Match!) */}
          <div className="flex flex-col gap-2.5 w-full max-w-md">
            {/* 1. LEGEND LOG (Modo História) */}
            <button
              onMouseEnter={() => setActiveTab('LEGEND_LOG')}
              onClick={handleStartLegendLog}
              className={`group flex items-center justify-between px-5 py-3 border-l-4 transition-all transform hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer shadow-lg ${
                activeTab === 'LEGEND_LOG'
                  ? 'bg-gradient-to-r from-red-600 via-rose-600 to-red-800 border-amber-300 text-white shadow-[0_4px_16px_rgba(225,29,72,0.4)]'
                  : 'bg-slate-900/90 hover:bg-slate-800 border-slate-600 text-slate-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-none bg-black/40 flex items-center justify-center text-amber-300 font-bold">
                  ☠️
                </div>
                <div>
                  <div className="font-arcade text-xs sm:text-sm tracking-wider font-bold">
                    LEGEND LOG
                  </div>
                  <div className="text-[10px] text-amber-200 font-sans">
                    Modo História · Continuar jornada (Fase {unlockedStage})
                  </div>
                </div>
              </div>
              <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>

            {/* 2. FREE LOG (Seleção de Fases Livres) */}
            <button
              onMouseEnter={() => setActiveTab('FREE_LOG')}
              onClick={() => {
                sound.playPunch(1);
                setShowStageSelect(true);
              }}
              className={`group flex items-center justify-between px-5 py-3 border-l-4 transition-all transform hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer shadow-lg ${
                activeTab === 'FREE_LOG'
                  ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-800 border-amber-300 text-white shadow-[0_4px_16px_rgba(16,185,129,0.4)]'
                  : 'bg-slate-900/90 hover:bg-slate-800 border-slate-600 text-slate-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-none bg-black/40 flex items-center justify-center text-emerald-300 font-bold">
                  🗺️
                </div>
                <div>
                  <div className="font-arcade text-xs sm:text-sm tracking-wider font-bold">
                    FREE LOG
                  </div>
                  <div className="text-[10px] text-emerald-200 font-sans">
                    Navegação Livre · Escolha qualquer fase e tripulante
                  </div>
                </div>
              </div>
              <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>

            {/* 3. DREAM LOG (Modo Desafio / Sobrevivência) */}
            <button
              onMouseEnter={() => setActiveTab('DREAM_LOG')}
              onClick={() => {
                sound.playPunch(2);
                // Start Boss Showdown or Challenge stage directly!
                onSelectStage('STAGE_6_MORGAN_SHOWDOWN', 'ZORO');
              }}
              className={`group flex items-center justify-between px-5 py-3 border-l-4 transition-all transform hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer shadow-lg ${
                activeTab === 'DREAM_LOG'
                  ? 'bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 border-amber-200 text-white shadow-[0_4px_16px_rgba(245,158,11,0.4)]'
                  : 'bg-slate-900/90 hover:bg-slate-800 border-slate-600 text-slate-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-none bg-black/40 flex items-center justify-center text-yellow-300 font-bold">
                  ⚔️
                </div>
                <div>
                  <div className="font-arcade text-xs sm:text-sm tracking-wider font-bold">
                    DREAM LOG
                  </div>
                  <div className="text-[10px] text-yellow-200 font-sans">
                    Duelo dos Sonhos · Batalha Imediata com Roronoa Zoro
                  </div>
                </div>
              </div>
              <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>

            {/* 4. SAVE SLOTS (Registros de Bordo) */}
            <button
              onMouseEnter={() => setActiveTab('SAVES')}
              onClick={() => {
                sound.playPunch(1);
                setShowSaveModal(true);
              }}
              className={`group flex items-center justify-between px-5 py-2.5 border-l-4 transition-all cursor-pointer ${
                activeTab === 'SAVES'
                  ? 'bg-gradient-to-r from-sky-700 to-blue-800 border-amber-300 text-white shadow'
                  : 'bg-slate-900/80 hover:bg-slate-800 border-slate-700 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <Save size={16} className="text-sky-300" />
                <span className="font-arcade text-xs">REGISTROS DE BORDO (SAVES)</span>
              </div>
              <span className="text-[10px] text-amber-300 font-arcade">3 SLOTS</span>
            </button>

            {/* 5. GALLERY (Galeria de Piratas e Golpes) */}
            <button
              onMouseEnter={() => setActiveTab('GALLERY')}
              onClick={() => {
                sound.playPunch(1);
                setShowGalleryModal(true);
              }}
              className={`group flex items-center justify-between px-5 py-2.5 border-l-4 transition-all cursor-pointer ${
                activeTab === 'GALLERY'
                  ? 'bg-gradient-to-r from-purple-700 to-indigo-800 border-amber-300 text-white shadow'
                  : 'bg-slate-900/80 hover:bg-slate-800 border-slate-700 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <BookOpen size={16} className="text-purple-300" />
                <span className="font-arcade text-xs">GALERIA DE PIRATAS</span>
              </div>
              <span className="text-[10px] text-purple-200 font-arcade">GOLPES</span>
            </button>
          </div>
        </div>

        {/* Right Column: Character Showcase & Manga Comic Dialogue Balloon */}
        <div className="md:col-span-5 flex flex-col items-center justify-center relative">
          {/* Animated Comic Speech Bubble with Coby / Nami (Pirate Warriors Match!) */}
          <div className="relative mb-3 bg-white text-slate-900 p-3 sm:p-4 rounded-none border-2 border-slate-950 shadow-2xl max-w-xs animate-bounce-subtle">
            <div className="flex items-center gap-2 mb-1 border-b border-slate-200 pb-1">
              <span className="text-base">👓</span>
              <span className="font-arcade text-[10px] font-bold text-rose-600">COBY</span>
              <span className="text-[10px] text-slate-400 font-sans">Comentário</span>
            </div>
            <p className="text-xs font-heading font-bold leading-snug text-slate-800">
              "{getCobyDialogue()}"
            </p>
            {/* Bubble Tail */}
            <div className="absolute -bottom-2.5 left-8 w-4 h-4 bg-white border-b-2 border-r-2 border-slate-950 rotate-45" />
          </div>

          {/* Character Showcase Art Card */}
          <div className="relative w-56 sm:w-64 h-72 sm:h-80 bg-gradient-to-b from-amber-500/10 via-slate-800/40 to-slate-900/80 border-2 border-amber-400/50 flex flex-col items-center justify-end p-4 shadow-2xl overflow-hidden group">
            {/* Behind Aura Rings */}
            <div className="absolute top-1/4 w-40 h-40 rounded-full bg-amber-400/15 blur-2xl animate-pulse" />

            {/* Character Graphic */}
            <div className="my-auto text-6xl sm:text-7xl drop-shadow-[0_10px_15px_rgba(0,0,0,0.8)] transform group-hover:scale-105 transition-transform">
              {activeTab === 'DREAM_LOG' ? '⚔️' : activeTab === 'FREE_LOG' ? '🗺️' : '👒'}
            </div>

            <div className="w-full text-center z-10 pt-2 border-t border-amber-400/40 bg-slate-950/80 p-2">
              <span className="font-arcade text-[9px] text-amber-400 tracking-wider">
                {activeTab === 'DREAM_LOG' ? 'ESPADACHIM RECRUTADO' : 'CAPITÃO PIRATA'}
              </span>
              <h3 className="font-heading font-black text-sm text-white">
                {activeTab === 'DREAM_LOG' ? 'Roronoa Zoro' : 'Monkey D. Luffy'}
              </h3>
              <p className="text-[10px] text-slate-300 font-sans">
                {activeTab === 'DREAM_LOG' ? 'Santoryu · Três Mil Mundos' : 'Gomu Gomu no Mi · Bazooka'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Controls Footer Bar */}
      <div className="z-10 w-full max-w-4xl mx-auto text-center">
        <div className="bg-slate-950/85 backdrop-blur-xs border border-white/10 px-4 py-2 text-[10px] sm:text-xs text-slate-300 flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
          <span><b className="text-amber-400">Mobile:</b> Joystick Virtual + Botões Touch</span>
          <span>·</span>
          <span><b className="text-amber-400">Teclado:</b> WASD</span>
          <span>·</span>
          <span><b className="text-amber-400">J:</b> Ataque</span>
          <span>·</span>
          <span><b className="text-amber-400">Segurar J no Ar:</b> Gomu Gomu no Stamp!</span>
          <span>·</span>
          <span><b className="text-amber-400">K + J:</b> Corte Aéreo (20 SP)</span>
          <span>·</span>
          <span><b className="text-amber-400">Espaço:</b> Especial (Gatling / Oni Giri / Finisher 15+ Combo)</span>
        </div>
      </div>

      {/* 5. Free Log / Stage Selection Modal */}
      {showStageSelect && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="fixed inset-0 z-40 bg-slate-950/85 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-scale-in"
        >
          <div className="w-full max-w-2xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-3 border-amber-400 p-4 sm:p-6 shadow-2xl relative max-h-[90vh] flex flex-col">
            <button
              onClick={() => {
                sound.playPunch(1);
                setShowStageSelect(false);
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-white bg-slate-800 p-2 rounded-none cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="text-center mb-3">
              <span className="font-arcade text-xs text-amber-400 tracking-wider">FREE LOG · MAPA DO GRAND LINE</span>
              <h2 className="font-heading font-black text-lg sm:text-xl text-white mt-0.5">
                Seleção de Fases Desbloqueadas
              </h2>
              <p className="text-xs text-slate-300 mt-1">
                Conclua as fases no Legend Log para desbloqueá-las permanentemente no Free Log!
              </p>
            </div>

            {lockWarning && (
              <div className="bg-red-950/90 border border-red-500 text-red-200 text-xs px-3 py-1.5 mb-3 text-center animate-bounce">
                {lockWarning}
              </div>
            )}

            {/* Arc Tabs (Alvida, Shells Town, Orange Town) */}
            <div className="flex rounded-none bg-slate-950 p-1 mb-3 border border-slate-800">
              <button
                onClick={() => setSelectedArc('ALVIDA')}
                className={`flex-1 py-2 text-xs font-bold transition-all cursor-pointer ${
                  selectedArc === 'ALVIDA'
                    ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                1. Navio Alvida (1-3)
              </button>
              <button
                onClick={() => setSelectedArc('ZORO')}
                className={`flex-1 py-2 text-xs font-bold transition-all cursor-pointer ${
                  selectedArc === 'ZORO'
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                2. Shells Town · Zoro (4-6)
              </button>
              <button
                onClick={() => setSelectedArc('BUGGY')}
                className={`flex-1 py-2 text-xs font-bold transition-all cursor-pointer ${
                  selectedArc === 'BUGGY'
                    ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                3. Orange Town · Buggy (7)
              </button>
            </div>

            {/* Stage Cards Container */}
            <div className="flex flex-col gap-2.5 overflow-y-auto flex-1 pr-1">
              {selectedArc === 'ALVIDA' && (
                <>
                  <button
                    onClick={() => handleStageCardClick('STAGE_1_GALLEY', 1, 'Despensa do Miss Love Duck')}
                    className="flex items-center gap-3.5 p-3 bg-slate-800/80 hover:bg-slate-700 border border-amber-500/40 text-left transition-all cursor-pointer"
                  >
                    <div className="w-12 h-12 bg-amber-900/60 flex items-center justify-center text-xl border border-amber-400/50 shrink-0">
                      🍖
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-arcade text-[10px] text-amber-300">FASE 1</span>
                        <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold">
                          <CheckCircle2 size={12} /> {unlockedStage > 1 ? 'CONCLUÍDA' : 'DISPONÍVEL'}
                        </span>
                      </div>
                      <h3 className="font-bold text-sm text-white">Despensa do Miss Love Duck</h3>
                      <p className="text-[11px] text-slate-300 truncate">Luffy explode do barril e defende Coby.</p>
                    </div>
                  </button>

                  <button
                    onClick={() => handleStageCardClick('STAGE_2_DECK', 2, 'Convés Principal')}
                    className={`flex items-center gap-3.5 p-3 text-left transition-all ${
                      unlockedStage >= 2
                        ? 'bg-slate-800/80 hover:bg-slate-700 border border-sky-500/40 cursor-pointer'
                        : 'bg-slate-900/50 border border-slate-800 opacity-60 cursor-not-allowed'
                    }`}
                  >
                    <div className="w-12 h-12 bg-blue-900/60 flex items-center justify-center text-xl border border-sky-400/50 shrink-0">
                      {unlockedStage >= 2 ? '⚓' : <Lock size={20} className="text-slate-400" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-arcade text-[10px] text-sky-300">FASE 2</span>
                        <span className={`text-[10px] font-bold ${unlockedStage >= 2 ? 'text-sky-300' : 'text-red-400'}`}>
                          {unlockedStage >= 2 ? 'DISPONÍVEL' : 'BLOQUEADO'}
                        </span>
                      </div>
                      <h3 className="font-bold text-sm text-white">Convés Principal</h3>
                      <p className="text-[11px] text-slate-300 truncate">Batalha aberta contra os piratas da Alvida.</p>
                    </div>
                  </button>

                  <button
                    onClick={() => handleStageCardClick('STAGE_3_BOSS', 3, 'Castelo de Popa: Capitã Alvida')}
                    className={`flex items-center gap-3.5 p-3 text-left transition-all ${
                      unlockedStage >= 3
                        ? 'bg-slate-800/80 hover:bg-slate-700 border border-rose-500/40 cursor-pointer'
                        : 'bg-slate-900/50 border border-slate-800 opacity-60 cursor-not-allowed'
                    }`}
                  >
                    <div className="w-12 h-12 bg-purple-900/60 flex items-center justify-center text-xl border border-rose-400/50 shrink-0">
                      {unlockedStage >= 3 ? '👑' : <Lock size={20} className="text-slate-400" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-arcade text-[10px] text-rose-300">FASE 3 · CHEFE</span>
                        <span className={`text-[10px] font-bold ${unlockedStage >= 3 ? 'text-rose-300' : 'text-red-400'}`}>
                          {unlockedStage >= 3 ? 'DISPONÍVEL' : 'BLOQUEADO'}
                        </span>
                      </div>
                      <h3 className="font-bold text-sm text-white">Castelo de Popa: Capitã Alvida</h3>
                      <p className="text-[11px] text-slate-300 truncate">Duelo final contra a Clava de Ferro da Alvida!</p>
                    </div>
                  </button>
                </>
              )}

              {selectedArc === 'ZORO' && (
                <>
                  <button
                    onClick={() => handleStageCardClick('STAGE_4_BASE_COURTYARD', 4, 'Pátio de Execução de Shells Town')}
                    className={`flex items-center gap-3.5 p-3 text-left transition-all ${
                      unlockedStage >= 4
                        ? 'bg-slate-800/80 hover:bg-slate-700 border border-emerald-500/40 cursor-pointer'
                        : 'bg-slate-900/50 border border-slate-800 opacity-60 cursor-not-allowed'
                    }`}
                  >
                    <div className="w-12 h-12 bg-emerald-950 flex items-center justify-center text-xl border border-emerald-400/50 shrink-0">
                      {unlockedStage >= 4 ? '🏛️' : <Lock size={20} className="text-slate-400" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-arcade text-[10px] text-emerald-300">FASE 4</span>
                        <span className={`text-[10px] font-bold ${unlockedStage >= 4 ? 'text-emerald-300' : 'text-red-400'}`}>
                          {unlockedStage >= 4 ? 'DISPONÍVEL' : 'BLOQUEADO'}
                        </span>
                      </div>
                      <h3 className="font-bold text-sm text-white">Pátio de Shells Town (Zoro Preso)</h3>
                      <p className="text-[11px] text-slate-300 truncate">Lute contra soldados e as Elites de Alabarda do Morgan.</p>
                    </div>
                  </button>

                  <button
                    onClick={() => handleStageCardClick('STAGE_5_FORTRESS_INTERIOR', 5, 'Torre do Capitão Morgan')}
                    className={`flex items-center gap-3.5 p-3 text-left transition-all ${
                      unlockedStage >= 5
                        ? 'bg-slate-800/80 hover:bg-slate-700 border border-amber-500/40 cursor-pointer'
                        : 'bg-slate-900/50 border border-slate-800 opacity-60 cursor-not-allowed'
                    }`}
                  >
                    <div className="w-12 h-12 bg-amber-950 flex items-center justify-center text-xl border border-amber-400/50 shrink-0">
                      {unlockedStage >= 5 ? '🗡️' : <Lock size={20} className="text-slate-400" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-arcade text-[10px] text-amber-300">FASE 5</span>
                        <span className={`text-[10px] font-bold ${unlockedStage >= 5 ? 'text-amber-300' : 'text-red-400'}`}>
                          {unlockedStage >= 5 ? 'DISPONÍVEL' : 'BLOQUEADO'}
                        </span>
                      </div>
                      <h3 className="font-bold text-sm text-white">Torre do Capitão Morgan</h3>
                      <p className="text-[11px] text-slate-300 truncate">Recupere as três espadas do Zoro guardadas na fortaleza.</p>
                    </div>
                  </button>

                  <button
                    onClick={() => handleStageCardClick('STAGE_6_MORGAN_SHOWDOWN', 6, 'Duelo: Zoro vs Capitão Morgan')}
                    className={`flex items-center gap-3.5 p-3 text-left transition-all ${
                      unlockedStage >= 6
                        ? 'bg-emerald-950/70 hover:bg-emerald-900/70 border-2 border-emerald-400 cursor-pointer'
                        : 'bg-slate-900/50 border border-slate-800 opacity-60 cursor-not-allowed'
                    }`}
                  >
                    <div className="w-12 h-12 bg-emerald-700 flex items-center justify-center text-xl border border-yellow-300 shrink-0">
                      {unlockedStage >= 6 ? '🪓' : <Lock size={20} className="text-slate-400" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-arcade text-[10px] text-yellow-300">FASE 6 · ZORO LIBERADO</span>
                        <span className={`text-[10px] font-bold ${unlockedStage >= 6 ? 'text-emerald-300' : 'text-red-400'}`}>
                          {unlockedStage >= 6 ? 'CHEFE FINAL' : 'BLOQUEADO'}
                        </span>
                      </div>
                      <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                        <Swords size={14} className="text-emerald-400" />
                        Duelo: Zoro vs Capitão Morgan
                      </h3>
                      <p className="text-[11px] text-emerald-200 truncate">Derrote o Mão-de-Machado com o Estilo Três Espadas!</p>
                    </div>
                  </button>
                </>
              )}

              {selectedArc === 'BUGGY' && (
                <button
                  onClick={() => handleStageCardClick('STAGE_7_ORANGE_TOWN', 7, 'Orange Town: Vila Laranja')}
                  className={`flex items-center gap-3.5 p-3 text-left transition-all ${
                    unlockedStage >= 7
                      ? 'bg-orange-950/70 hover:bg-orange-900/70 border-2 border-orange-400 cursor-pointer'
                      : 'bg-slate-900/50 border border-slate-800 opacity-60 cursor-not-allowed'
                  }`}
                >
                  <div className="w-12 h-12 bg-orange-900 flex items-center justify-center text-xl border border-orange-300 shrink-0">
                    {unlockedStage >= 7 ? '🎪' : <Lock size={20} className="text-slate-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-arcade text-[10px] text-orange-300">FASE 7 · NOVO ARCO!</span>
                      <span className={`text-[10px] font-bold ${unlockedStage >= 7 ? 'text-amber-300' : 'text-red-400'}`}>
                        {unlockedStage >= 7 ? 'DESBLOQUEADA' : 'BLOQUEADO'}
                      </span>
                    </div>
                    <h3 className="font-bold text-sm text-white">Orange Town: Frota do Capitão Buggy</h3>
                    <p className="text-[11px] text-orange-200 truncate">
                      {unlockedStage >= 7
                        ? 'Enfrente a tripulação circense do palhaço Buggy nas ruas da cidade!'
                        : 'Bloqueado: Derrote o Capitão Morgan na Fase 6 para desbloquear!'}
                    </p>
                  </div>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 6. Pre-Stage Character Selector Modal */}
      {characterSelectTarget && (
        <CharacterSelectModal
          stageId={characterSelectTarget.stageId}
          stageName={characterSelectTarget.name}
          onConfirm={handleConfirmDeploy}
          onCancel={() => setCharacterSelectTarget(null)}
        />
      )}

      {/* 7. Save Slots Modal */}
      {showSaveModal && (
        <SaveSlotsModal
          onClose={() => {
            setShowSaveModal(false);
            const current = SaveManager.getActiveSlot();
            setActiveSlot(current);
            setUnlockedStage(current.unlockedStage);
            setAllSlots(SaveManager.getAllSlots());
          }}
          onSlotChanged={(slot) => {
            setActiveSlot(slot);
            setUnlockedStage(slot.unlockedStage);
            setAllSlots(SaveManager.getAllSlots());
          }}
        />
      )}

      {/* 8. Interactive Character Gallery Modal */}
      {showGalleryModal && (
        <CharacterGalleryModal onClose={() => setShowGalleryModal(false)} />
      )}
    </div>
  );
};
