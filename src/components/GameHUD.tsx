import React from 'react';
import { Volume2, VolumeX, Pause, Sparkles, Trophy } from 'lucide-react';
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
  onPause,
  isMuted,
  onToggleMute,
  onOpenAchievements,
}) => {
  const hpPercent = Math.max(0, Math.min(100, (hp / maxHp) * 100));
  const energyPercent = Math.max(0, Math.min(100, (energy / maxEnergy) * 100));

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
        scale: 'scale-125 animate-pulse',
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
        scale: 'scale-115',
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
        scale: 'scale-110',
        multiplier: 'x2.0',
        shakeClass: '',
      };
    }
    return {
      bg: 'from-amber-400 to-orange-500',
      border: 'border-amber-300',
      textGlow: 'drop-shadow-[0_0_6px_rgba(251,191,36,0.6)]',
      rank: 'NICE!',
      scale: 'scale-105',
      multiplier: 'x1.5',
      shakeClass: '',
    };
  };

  const comboStyle = getComboStyle(combo);

  return (
    <header className="absolute top-0 left-0 right-0 p-2 sm:p-4 pointer-events-none select-none z-20 flex flex-col gap-2">
      <div className="w-full flex items-start justify-between">
        {/* ========================================================= */}
        {/* TOP-LEFT: AUTHENTIC ONE PIECE GBA HEALTH BAR & JOLLY ROGER */}
        {/* ========================================================= */}
        <div className="flex items-start pointer-events-auto">
          {/* Character Jolly Roger / Emblem */}
          <div className="relative flex flex-col items-center z-10 -mr-2">
            <div className={`w-13 h-13 sm:w-16 sm:h-16 rounded-full p-0.5 border-2 shadow-xl flex items-center justify-center ${
              character === 'ZORO'
                ? 'bg-gradient-to-b from-emerald-500 via-green-600 to-teal-800 border-green-400'
                : 'bg-gradient-to-b from-amber-500 via-orange-600 to-amber-700 border-red-700'
            }`}>
              <div className="w-full h-full rounded-full bg-black flex items-center justify-center relative overflow-hidden">
                {character === 'ZORO' ? (
                  /* Zoro's Santoryu Three Katana Crest */
                  <svg viewBox="0 0 60 60" className="w-full h-full p-1 drop-shadow-md">
                    {/* Crossed Katanas */}
                    <line x1="10" y1="50" x2="50" y2="10" stroke="#f8fafc" strokeWidth="3.5" strokeLinecap="round" />
                    <line x1="50" y1="50" x2="10" y2="10" stroke="#f8fafc" strokeWidth="3.5" strokeLinecap="round" />
                    {/* Horizontal Katana in mouth */}
                    <line x1="6" y1="30" x2="54" y2="30" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" />
                    
                    {/* Skull with Black Bandana */}
                    <ellipse cx="30" cy="30" rx="14" ry="13" fill="#ffffff" stroke="#000000" strokeWidth="1.2" />
                    {/* Black Bandana */}
                    <path d="M 16 26 Q 30 18 44 26 L 44 18 Q 30 12 16 18 Z" fill="#0f172a" />
                    <circle cx="25" cy="31" r="2.8" fill="#000000" />
                    <circle cx="35" cy="31" r="2.8" fill="#000000" />
                    {/* Swordsman Earring */}
                    <circle cx="16" cy="34" r="1.5" fill="#fbbf24" />
                    <circle cx="14" cy="36" r="1.5" fill="#fbbf24" />
                  </svg>
                ) : (
                  /* Luffy's Straw Hat Jolly Roger */
                  <svg viewBox="0 0 60 60" className="w-full h-full p-1 drop-shadow-md">
                    {/* Crossed Bones */}
                    <path d="M 12 12 L 48 48 M 48 12 L 12 48" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" />
                    <circle cx="10" cy="10" r="3.5" fill="#ffffff" />
                    <circle cx="50" cy="50" r="3.5" fill="#ffffff" />
                    <circle cx="50" cy="10" r="3.5" fill="#ffffff" />
                    <circle cx="10" cy="50" r="3.5" fill="#ffffff" />

                    {/* Skull */}
                    <ellipse cx="30" cy="31" rx="16" ry="14" fill="#ffffff" stroke="#000000" strokeWidth="1.2" />
                    <circle cx="24" cy="30" r="3.2" fill="#000000" />
                    <circle cx="36" cy="30" r="3.2" fill="#000000" />
                    <path d="M 23 38 Q 30 43 37 38" stroke="#000000" strokeWidth="1.5" fill="none" />

                    {/* Straw Hat on Skull */}
                    <ellipse cx="30" cy="24" rx="24" ry="6.5" fill="#ffd500" stroke="#b27b00" strokeWidth="1.5" />
                    <rect x="18" y="14" width="24" height="7" fill="#e60012" />
                    <ellipse cx="30" cy="14" rx="14" ry="8" fill="#ffd500" stroke="#b27b00" strokeWidth="1.5" />
                  </svg>
                )}
              </div>
            </div>

            {/* Hanging Golden Anchor on Chain */}
            <div className="flex flex-col items-center -mt-1">
              <div className="w-1.5 h-1.5 bg-slate-300 border border-slate-700 rounded-full" />
              <div className="w-1.5 h-1.5 bg-slate-300 border border-slate-700 rounded-full -mt-0.5" />
              <div className="w-5 h-5 flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-full h-full drop-shadow">
                  <circle cx="12" cy="4" r="2.5" fill="none" stroke="#ffd166" strokeWidth="2" />
                  <line x1="12" y1="6" x2="12" y2="21" stroke="#ffd166" strokeWidth="2.5" />
                  <line x1="6" y1="10" x2="18" y2="10" stroke="#ffd166" strokeWidth="2.5" />
                  <path d="M 4 16 Q 12 24 20 16" fill="none" stroke="#ffd166" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </div>
            </div>
          </div>

          {/* GBA Ornate Wood/Gold Health Bar Frame */}
          <div className="flex flex-col mt-2">
            <div className={`relative pl-3 pr-2 py-1 border-2 rounded-r-md shadow-2xl flex items-center ${
              character === 'ZORO'
                ? 'bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 border-green-900'
                : 'bg-gradient-to-r from-orange-600 via-amber-600 to-amber-700 border-red-800'
            }`}>
              <div className={`absolute -left-1 top-0 bottom-0 w-2 ${character === 'ZORO' ? 'bg-green-900' : 'bg-red-800'}`} />
              
              {/* Inner Health Bar Slot */}
              <div className="relative w-36 sm:w-56 h-5 sm:h-6 bg-black border-2 border-amber-900 rounded-xs overflow-hidden shadow-inner p-0.5">
                <div
                  className={`h-full transition-all duration-150 border-r-2 ${
                    character === 'ZORO'
                      ? 'bg-gradient-to-r from-[#a7f3d0] via-[#34d399] to-[#059669] border-emerald-900'
                      : 'bg-gradient-to-r from-[#ffe066] via-[#ffc300] to-[#ff9e00] border-amber-800'
                  }`}
                  style={{ width: `${hpPercent}%` }}
                />
                <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/25 pointer-events-none" />

                <div className="absolute inset-0 flex items-center justify-end px-2 text-[10px] sm:text-xs font-mono font-black text-amber-950 drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)]">
                  <span className="tabular-nums">{Math.round(hp)}/{maxHp}</span>
                </div>
              </div>

              <div className="w-1.5 h-4 bg-amber-300 ml-1 rounded-xs border border-amber-800" />
            </div>

            {/* Sub-bar: SP / Special Bar & Score */}
            <div className="flex items-center justify-between pl-3 pr-1 mt-1 text-xs">
              <div className="flex items-center gap-1">
                <span className={`font-mono font-black text-[9px] drop-shadow ${character === 'ZORO' ? 'text-emerald-300' : 'text-cyan-300'}`}>
                  {character === 'ZORO' ? 'ONI' : 'SP'}
                </span>
                <div className={`w-20 sm:w-32 h-2.5 bg-slate-950 border rounded-xs p-0.5 overflow-hidden ${
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
              </div>

              <div className="font-arcade text-[10px] sm:text-xs text-amber-300 drop-shadow ml-2">
                <span>BERRIES: </span>
                <span className="font-mono text-white tabular-nums">{score}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* CENTER / RIGHT: HIGH-INTENSITY ANIMATED COMBO MULTIPLIER */}
        {/* ========================================================= */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {combo > 1 && (
            <div
              className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 shadow-2xl transition-all duration-200 bg-gradient-to-r ${comboStyle.bg} ${comboStyle.border} ${comboStyle.scale} ${comboStyle.shakeClass}`}
            >
              <div className="flex flex-col items-center leading-none">
                <span className="text-[9px] font-black tracking-widest text-yellow-200 uppercase font-mono">
                  {comboStyle.rank}
                </span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className={`text-base sm:text-lg font-black text-white font-mono ${comboStyle.textGlow}`}>
                    {combo}
                  </span>
                  <span className="text-[10px] font-bold text-yellow-300 font-sans">
                    HITS
                  </span>
                </div>
              </div>

              {/* Multiplier Badge */}
              <div className="bg-black/60 border border-yellow-300/60 px-1.5 py-0.5 rounded-md text-[10px] font-mono font-bold text-yellow-300 shrink-0">
                {comboStyle.multiplier}
              </div>
            </div>
          )}

          {/* Stage Name Badge */}
          <div className="bg-slate-900/90 border-2 border-amber-400/70 px-2.5 py-1 rounded-md text-xs font-arcade text-amber-300 shadow-lg flex items-center gap-1.5">
            <span className={`text-[10px] font-bold px-1 rounded ${stageBadge.isBoss ? 'bg-rose-500 text-white' : 'bg-amber-400 text-slate-950'}`}>
              {stageBadge.label}
            </span>
            {!stageBadge.isBoss && <span>ONDA {wave}/2</span>}
          </div>

          {/* Trophy Cabinet / Achievements Button */}
          {onOpenAchievements && (
            <button
              onClick={onOpenAchievements}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-md bg-amber-500/20 border border-amber-400/80 text-amber-300 flex items-center justify-center hover:bg-amber-500/40 active:scale-95 transition-all shadow"
              title="Conquistas"
            >
              <Trophy size={16} />
            </button>
          )}

          <button
            onClick={onToggleMute}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-md bg-slate-900/90 border border-slate-700 text-slate-200 flex items-center justify-center hover:bg-slate-800 active:scale-95 transition-all shadow"
            title="Som"
          >
            {isMuted ? <VolumeX size={16} className="text-red-400" /> : <Volume2 size={16} className="text-emerald-400" />}
          </button>

          <button
            onClick={onPause}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-md bg-slate-900/90 border border-slate-700 text-slate-200 flex items-center justify-center hover:bg-slate-800 active:scale-95 transition-all shadow"
            title="Pausar"
          >
            <Pause size={16} />
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* BOSS HEALTH BAR: ALVIDA OR AXE-HAND MORGAN */}
      {/* ========================================================= */}
      {bossHp !== undefined && bossMaxHp !== undefined && (
        <div className="w-full max-w-md mx-auto pointer-events-none mt-1 animate-fade-in">
          <div className={`border-2 rounded-xl p-2 shadow-2xl flex items-center gap-2.5 ${
            bossType === 'MORGAN'
              ? 'bg-slate-950/95 border-amber-500'
              : 'bg-slate-950/95 border-purple-500'
          }`}>
            <div className={`w-9 h-9 rounded-full border-2 border-yellow-300 flex items-center justify-center text-lg shrink-0 shadow ${
              bossType === 'MORGAN'
                ? 'bg-gradient-to-tr from-amber-700 to-blue-800'
                : 'bg-gradient-to-tr from-purple-800 to-pink-600'
            }`}>
              {bossType === 'MORGAN' ? '🪓' : '👑'}
            </div>
            <div className="flex-1 flex flex-col gap-0.5">
              <div className="flex items-center justify-between text-xs font-arcade">
                <span className={bossType === 'MORGAN' ? 'text-amber-400 font-bold' : 'text-purple-300'}>
                  {bossType === 'MORGAN' ? 'CAPITÃO MORGAN MÃO-DE-MACHADO' : 'CAPITÃ ALVIDA DA CLAVA'}
                </span>
                <span className="font-mono text-white tabular-nums">
                  {Math.max(0, Math.round(bossHp))}/{bossMaxHp}
                </span>
              </div>
              <div className={`h-3.5 bg-black rounded-xs overflow-hidden border p-0.5 ${
                bossType === 'MORGAN' ? 'border-amber-400/80' : 'border-purple-400/80'
              }`}>
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

      {/* Bottom-left Comic Energy Indicator */}
      <div className="fixed bottom-24 sm:bottom-6 left-3 sm:left-6 pointer-events-none flex items-center gap-2 opacity-90">
        <div className="flex gap-1 bg-black/60 p-1.5 rounded-lg border border-amber-400/40">
          <div className={`w-2.5 h-3.5 rounded-xs transition-colors ${energy >= 40 ? 'bg-cyan-400 shadow-[0_0_8px_#22d3ee]' : 'bg-slate-700'}`} />
          <div className={`w-2.5 h-3.5 rounded-xs transition-colors ${energy >= 80 ? 'bg-cyan-400 shadow-[0_0_8px_#22d3ee]' : 'bg-slate-700'}`} />
          <div className={`w-2.5 h-3.5 rounded-xs transition-colors ${energy >= 100 ? 'bg-purple-400 shadow-[0_0_8px_#c084fc]' : 'bg-slate-700'}`} />
        </div>
      </div>
    </header>
  );
};
