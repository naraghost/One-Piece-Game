import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Pause, Sparkles, Trophy, Maximize, Minimize, Smartphone } from 'lucide-react';
import { PlayerCharacter, StageId } from '../game/types';

interface GameHUDProps {
  character?: PlayerCharacter;
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
  finisherReady?: boolean;
  onPause: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenAchievements?: () => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  character = 'LUFFY',
  hp,
  maxHp,
  energy,
  maxEnergy,
  score,
  combo,
  wave,
  currentStage = 'STAGE_1_GALLEY',
  bossHp,
  bossMaxHp,
  bossType = 'ALVIDA',
  finisherReady = false,
  onPause,
  isMuted,
  onToggleMute,
  onOpenAchievements,
}) => {
  const hpPercent = Math.max(0, Math.min(100, (hp / maxHp) * 100));
  const energyPercent = Math.max(0, Math.min(100, (energy / maxEnergy) * 100));

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPortrait, setIsPortrait] = useState(false);

  useEffect(() => {
    const checkOrientation = () => {
      const portrait = typeof window !== 'undefined' && window.innerHeight > window.innerWidth;
      setIsPortrait(portrait);
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    document.addEventListener('fullscreenchange', checkOrientation);
    return () => {
      window.removeEventListener('resize', checkOrientation);
      document.removeEventListener('fullscreenchange', checkOrientation);
    };
  }, []);

  const handleToggleLandscape = async () => {
    try {
      if (!document.fullscreenElement) {
        if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
        }
        // Try orientation lock to landscape if supported
        if ('orientation' in screen && 'lock' in (screen.orientation as unknown as { lock: (o: string) => Promise<void> })) {
          try {
            await (screen.orientation as unknown as { lock: (o: string) => Promise<void> }).lock('landscape');
          } catch {
            // Orientation lock may not be allowed without installed PWA, fullscreen handles orientation on mobile browsers
          }
        }
        setIsFullscreen(true);
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        }
        setIsFullscreen(false);
      }
    } catch {
      // Graceful fallback
    }
  };

  // Determine stage title badge
  const getStageBadge = (stage: StageId) => {
    switch (stage) {
      case 'STAGE_1_GALLEY':
        return { label: 'ALVIDA · DESPENSA', isBoss: false };
      case 'STAGE_2_DECK':
        return { label: 'ALVIDA · CONVÉS', isBoss: false };
      case 'STAGE_3_BOSS':
        return { label: 'CHEFE · ALVIDA', isBoss: true };
      case 'STAGE_4_BASE_COURTYARD':
        return { label: 'SHELLS TOWN · PÁTIO', isBoss: false };
      case 'STAGE_5_FORTRESS_INTERIOR':
        return { label: 'SHELLS TOWN · TORRE', isBoss: false };
      case 'STAGE_6_MORGAN_SHOWDOWN':
        return { label: 'CHEFE · MORGAN', isBoss: true };
      default:
        return { label: 'EAST BLUE', isBoss: false };
    }
  };

  const stageBadge = getStageBadge(currentStage);

  // Dynamic Combo Tier: Scaling, Shake & Color Shifting
  const getComboStyle = (count: number) => {
    if (count >= 20) {
      return {
        bg: 'from-fuchsia-600 via-purple-600 to-indigo-700',
        border: 'border-yellow-300',
        textGlow: 'drop-shadow-[0_0_12px_rgba(217,70,239,0.9)]',
        rank: 'PIRATE KING!',
        scale: 'scale-110 sm:scale-125 animate-pulse',
        multiplier: 'x4.0',
        shakeClass: 'animate-bounce',
      };
    }
    if (count >= 12) {
      return {
        bg: 'from-red-600 via-rose-600 to-amber-600',
        border: 'border-amber-300',
        textGlow: 'drop-shadow-[0_0_10px_rgba(244,63,94,0.8)]',
        rank: character === 'ZORO' ? 'SANTORYU!' : 'GOMU GOMU!',
        scale: 'scale-105 sm:scale-115',
        multiplier: 'x3.0',
        shakeClass: 'animate-pulse',
      };
    }
    if (count >= 6) {
      return {
        bg: 'from-amber-500 via-orange-600 to-red-600',
        border: 'border-yellow-200',
        textGlow: 'drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]',
        rank: 'GREAT!',
        scale: 'scale-100 sm:scale-105',
        multiplier: 'x2.0',
        shakeClass: '',
      };
    }
    return {
      bg: 'from-amber-400 to-orange-500',
      border: 'border-amber-300',
      textGlow: 'drop-shadow-[0_0_6px_rgba(251,191,36,0.6)]',
      rank: 'NICE!',
      scale: 'scale-95 sm:scale-100',
      multiplier: 'x1.5',
      shakeClass: '',
    };
  };

  const comboStyle = getComboStyle(combo);

  return (
    <>
      {/* ========================================================= */}
      {/* MOBILE PORTRAIT PROMPT TO ROTATE TO LANDSCAPE */}
      {/* ========================================================= */}
      {isPortrait && (
        <div className="fixed top-1 left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
          <button
            onClick={handleToggleLandscape}
            className="bg-amber-500/95 text-slate-950 font-arcade text-[10px] px-3 py-1 rounded-full shadow-lg border border-yellow-200 flex items-center gap-1.5 animate-pulse hover:bg-amber-400 active:scale-95 cursor-pointer"
          >
            <Smartphone size={13} className="rotate-90 text-slate-950" />
            <span>MODO PAISAGEM RECOMENDADO</span>
          </button>
        </div>
      )}

      {/* ========================================================= */}
      {/* MAIN TOP HUD BAR: ZERO-COLLISION DEDICATED LANES */}
      {/* ========================================================= */}
      <header className="absolute top-0 left-0 right-0 p-2 sm:p-3 pointer-events-none select-none z-30 flex flex-col gap-1.5">
        <div className="w-full flex items-start justify-between gap-2">
          
          {/* TOP-LEFT: AUTHENTIC ONE PIECE GBA HEALTH BAR & JOLLY ROGER */}
          <div className="flex items-start pointer-events-auto shrink-0">
            {/* Character Jolly Roger / Emblem */}
            <div className="relative flex flex-col items-center z-10 -mr-2">
              <div
                className={`w-11 h-11 sm:w-14 sm:h-14 rounded-full p-0.5 border-2 shadow-xl flex items-center justify-center ${
                  character === 'ZORO'
                    ? 'bg-gradient-to-b from-emerald-500 via-green-600 to-teal-800 border-green-400'
                    : 'bg-gradient-to-b from-amber-500 via-orange-600 to-amber-700 border-red-700'
                }`}
              >
                <div className="w-full h-full rounded-full bg-black flex items-center justify-center relative overflow-hidden">
                  {character === 'ZORO' ? (
                    <svg viewBox="0 0 60 60" className="w-full h-full p-1 drop-shadow-md">
                      <line x1="10" y1="50" x2="50" y2="10" stroke="#f8fafc" strokeWidth="3.5" strokeLinecap="round" />
                      <line x1="50" y1="50" x2="10" y2="10" stroke="#f8fafc" strokeWidth="3.5" strokeLinecap="round" />
                      <line x1="6" y1="30" x2="54" y2="30" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" />
                      <ellipse cx="30" cy="30" rx="14" ry="13" fill="#ffffff" stroke="#000000" strokeWidth="1.2" />
                      <path d="M 16 26 Q 30 18 44 26 L 44 18 Q 30 12 16 18 Z" fill="#0f172a" />
                      <circle cx="25" cy="31" r="2.8" fill="#000000" />
                      <circle cx="35" cy="31" r="2.8" fill="#000000" />
                      <circle cx="16" cy="34" r="1.5" fill="#fbbf24" />
                      <circle cx="14" cy="36" r="1.5" fill="#fbbf24" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 60 60" className="w-full h-full p-1 drop-shadow-md">
                      <path d="M 12 12 L 48 48 M 48 12 L 12 48" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" />
                      <circle cx="10" cy="10" r="3.5" fill="#ffffff" />
                      <circle cx="50" cy="50" r="3.5" fill="#ffffff" />
                      <circle cx="50" cy="10" r="3.5" fill="#ffffff" />
                      <circle cx="10" cy="50" r="3.5" fill="#ffffff" />
                      <ellipse cx="30" cy="31" rx="16" ry="14" fill="#ffffff" stroke="#000000" strokeWidth="1.2" />
                      <circle cx="24" cy="30" r="3.2" fill="#000000" />
                      <circle cx="36" cy="30" r="3.2" fill="#000000" />
                      <path d="M 23 38 Q 30 43 37 38" stroke="#000000" strokeWidth="1.5" fill="none" />
                      <ellipse cx="30" cy="24" rx="24" ry="6.5" fill="#ffd500" stroke="#b27b00" strokeWidth="1.5" />
                      <rect x="18" y="14" width="24" height="7" fill="#e60012" />
                      <ellipse cx="30" cy="14" rx="14" ry="8" fill="#ffd500" stroke="#b27b00" strokeWidth="1.5" />
                    </svg>
                  )}
                </div>
              </div>
            </div>

            {/* GBA Ornate Wood/Gold Health Bar Frame */}
            <div className="flex flex-col mt-1 sm:mt-1.5">
              <div
                className={`relative pl-3 pr-2 py-1 border-2 rounded-r-md shadow-2xl flex items-center ${
                  character === 'ZORO'
                    ? 'bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 border-green-900'
                    : 'bg-gradient-to-r from-orange-600 via-amber-600 to-amber-700 border-red-800'
                }`}
              >
                <div className={`absolute -left-1 top-0 bottom-0 w-2 ${character === 'ZORO' ? 'bg-green-900' : 'bg-red-800'}`} />
                
                {/* Responsive Health Bar Slot */}
                <div className="relative w-28 xs:w-36 sm:w-52 h-4 sm:h-5 bg-black border-2 border-amber-900 rounded-xs overflow-hidden shadow-inner p-0.5">
                  <div
                    className={`h-full transition-all duration-150 border-r-2 ${
                      character === 'ZORO'
                        ? 'bg-gradient-to-r from-[#a7f3d0] via-[#34d399] to-[#059669] border-emerald-900'
                        : 'bg-gradient-to-r from-[#ffe066] via-[#ffc300] to-[#ff9e00] border-amber-800'
                    }`}
                    style={{ width: `${hpPercent}%` }}
                  />
                  <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/25 pointer-events-none" />

                  <div className="absolute inset-0 flex items-center justify-end px-1.5 text-[9px] sm:text-[11px] font-mono font-black text-amber-950 drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)]">
                    <span className="tabular-nums">{Math.round(hp)}/{maxHp}</span>
                  </div>
                </div>

                <div className="w-1.5 h-3.5 bg-amber-300 ml-1 rounded-xs border border-amber-800" />
              </div>

              {/* Sub-bar: SP / Energy Bar & Berries */}
              <div className="flex items-center justify-between pl-3 pr-1 mt-0.5 text-xs">
                <div className="flex items-center gap-1">
                  <span className={`font-mono font-black text-[8px] sm:text-[9px] drop-shadow ${character === 'ZORO' ? 'text-emerald-300' : 'text-cyan-300'}`}>
                    {character === 'ZORO' ? 'ONI' : 'SP'}
                  </span>
                  <div className={`w-16 xs:w-22 sm:w-28 h-2 sm:h-2.5 bg-slate-950 border rounded-xs p-0.5 overflow-hidden ${
                    character === 'ZORO' ? 'border-emerald-400' : 'border-cyan-400'
                  }`}>
                    <div
                      className={`h-full transition-all duration-100 ${
                        character === 'ZORO'
                          ? 'bg-gradient-to-r from-emerald-600 to-teal-300'
                          : 'bg-gradient-to-r from-blue-500 to-cyan-400'
                      }`}
                      style={{ width: `${energyPercent}%` }}
                    />
                  </div>
                  {/* Energy Pip Ticks placed cleanly in HUD */}
                  <div className="flex gap-0.5 ml-1">
                    <div className={`w-1.5 h-2 rounded-xs ${energy >= 40 ? 'bg-cyan-400' : 'bg-slate-700'}`} />
                    <div className={`w-1.5 h-2 rounded-xs ${energy >= 80 ? 'bg-cyan-400' : 'bg-slate-700'}`} />
                    <div className={`w-1.5 h-2 rounded-xs ${energy >= 100 ? 'bg-purple-400' : 'bg-slate-700'}`} />
                  </div>
                </div>

                <div className="font-arcade text-[9px] sm:text-[10px] text-amber-300 drop-shadow ml-1.5">
                  <span className="hidden xs:inline">BERRIES: </span>
                  <span className="font-mono text-white tabular-nums">{score}</span>
                </div>
              </div>
            </div>
          </div>

          {/* TOP-RIGHT: COMPACT SLENDER TOOLBAR & STAGE BADGE (No UI overlap) */}
          <div className="flex items-center gap-1.5 sm:gap-2 pointer-events-auto shrink-0">
            {/* Stage Name Badge */}
            <div className="bg-slate-900/90 border border-amber-400/80 px-2 py-1 rounded-md text-[9px] sm:text-xs font-arcade text-amber-300 shadow flex items-center gap-1">
              <span className={`text-[8px] sm:text-[9px] font-bold px-1 rounded ${stageBadge.isBoss ? 'bg-rose-500 text-white' : 'bg-amber-400 text-slate-950'}`}>
                {stageBadge.label}
              </span>
              {!stageBadge.isBoss && <span className="hidden xs:inline">ONDA {wave}/2</span>}
            </div>

            {/* Quick Action Buttons Pill */}
            <div className="bg-slate-900/90 border border-slate-700/80 rounded-lg p-0.5 sm:p-1 flex items-center gap-1 shadow">
              {/* Landscape / Fullscreen Toggle */}
              <button
                onClick={handleToggleLandscape}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded bg-slate-800 text-amber-300 hover:bg-slate-700 flex items-center justify-center transition-all cursor-pointer"
                title={isFullscreen ? 'Sair da Tela Cheia' : 'Modo Paisagem / Tela Cheia'}
              >
                {isFullscreen ? <Minimize size={14} /> : <Maximize size={14} />}
              </button>

              {/* Trophy Achievements */}
              {onOpenAchievements && (
                <button
                  onClick={onOpenAchievements}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded bg-amber-500/20 text-amber-300 hover:bg-amber-500/40 flex items-center justify-center transition-all cursor-pointer"
                  title="Conquistas"
                >
                  <Trophy size={14} />
                </button>
              )}

              {/* Sound */}
              <button
                onClick={onToggleMute}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded bg-slate-800 text-slate-200 hover:bg-slate-700 flex items-center justify-center transition-all cursor-pointer"
                title="Som"
              >
                {isMuted ? <VolumeX size={14} className="text-red-400" /> : <Volume2 size={14} className="text-emerald-400" />}
              </button>

              {/* Pause */}
              <button
                onClick={onPause}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded bg-slate-800 text-slate-200 hover:bg-slate-700 flex items-center justify-center transition-all cursor-pointer"
                title="Pausar"
              >
                <Pause size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* FINISHER READY ALERT BANNER (Centered, standalone lane) */}
        {/* ========================================================= */}
        {finisherReady && (
          <div className="w-full flex justify-center pointer-events-none mt-0.5 animate-bounce">
            <div className="bg-gradient-to-r from-red-600 via-amber-500 to-rose-600 border-2 border-yellow-300 px-3 py-0.5 sm:py-1 rounded-full shadow-[0_0_25px_rgba(239,68,68,0.95),0_0_12px_rgba(251,191,36,0.95)] flex items-center gap-1.5 sm:gap-2">
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-yellow-200 animate-spin" />
              <span className="font-arcade text-[8px] sm:text-xs text-white font-black tracking-wider sm:tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
                {character === 'ZORO'
                  ? '★ FINISHER: SANTORYU SANZEN SEKAI! (ESPECIAL) ★'
                  : '★ FINISHER: GOMU GOMU NO BAZOOKA! (ESPECIAL) ★'}
              </span>
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-yellow-200 animate-spin" />
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* BOSS HEALTH BAR: ALVIDA OR AXE-HAND MORGAN */}
        {/* ========================================================= */}
        {bossHp !== undefined && bossMaxHp !== undefined && (
          <div className="w-full max-w-sm sm:max-w-md mx-auto pointer-events-none mt-0.5 animate-fade-in">
            <div
              className={`border-2 rounded-xl p-1.5 sm:p-2 shadow-2xl flex items-center gap-2 ${
                bossType === 'MORGAN'
                  ? 'bg-slate-950/95 border-amber-500'
                  : 'bg-slate-950/95 border-purple-500'
              }`}
            >
              <div
                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-yellow-300 flex items-center justify-center text-base sm:text-lg shrink-0 shadow ${
                  bossType === 'MORGAN'
                    ? 'bg-gradient-to-tr from-amber-700 to-blue-800'
                    : 'bg-gradient-to-tr from-purple-800 to-pink-600'
                }`}
              >
                {bossType === 'MORGAN' ? '🪓' : '👑'}
              </div>
              <div className="flex-1 flex flex-col gap-0.5">
                <div className="flex items-center justify-between text-[10px] sm:text-xs font-arcade">
                  <span className={bossType === 'MORGAN' ? 'text-amber-400 font-bold truncate max-w-[180px] sm:max-w-none' : 'text-purple-300 truncate max-w-[180px] sm:max-w-none'}>
                    {bossType === 'MORGAN' ? 'CAPITÃO MORGAN MÃO-DE-MACHADO' : 'CAPITÃ ALVIDA DA CLAVA'}
                  </span>
                  <span className="font-mono text-white tabular-nums">
                    {Math.max(0, Math.round(bossHp))}/{bossMaxHp}
                  </span>
                </div>
                <div
                  className={`h-2.5 sm:h-3.5 bg-black rounded-xs overflow-hidden border p-0.5 ${
                    bossType === 'MORGAN' ? 'border-amber-400/80' : 'border-purple-400/80'
                  }`}
                >
                  <div
                    className={`h-full transition-all duration-150 ${
                      bossType === 'MORGAN'
                        ? 'bg-gradient-to-r from-amber-600 via-orange-500 to-red-500'
                        : 'bg-gradient-to-r from-purple-600 via-pink-500 to-rose-400'
                    }`}
                    style={{ width: `${Math.max(0, (bossHp / bossMaxHp) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* ========================================================= */}
      {/* FLOATING COMBO MULTIPLIER (ISOLATED LANE, NEVER OVERLAPS) */}
      {/* ========================================================= */}
      {combo > 1 && (
        <aside className="absolute top-16 sm:top-20 right-3 sm:right-5 pointer-events-none select-none z-30">
          <div
            className={`relative flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl border-2 shadow-2xl transition-all duration-150 bg-gradient-to-r ${comboStyle.bg} ${comboStyle.border} ${comboStyle.scale} ${comboStyle.shakeClass}`}
          >
            <div className="flex flex-col items-center leading-none">
              <span className="text-[8px] sm:text-[9px] font-black tracking-widest text-yellow-200 uppercase font-mono">
                {comboStyle.rank}
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className={`text-base sm:text-lg font-black text-white font-mono ${comboStyle.textGlow}`}>
                  {combo}
                </span>
                <span className="text-[9px] sm:text-[10px] font-bold text-yellow-300 font-sans">
                  HITS
                </span>
              </div>
            </div>

            <div className="bg-black/60 border border-yellow-300/60 px-1 py-0.5 rounded-md text-[9px] sm:text-[10px] font-mono font-bold text-yellow-300 shrink-0">
              {comboStyle.multiplier}
            </div>
          </div>
        </aside>
      )}
    </>
  );
};

