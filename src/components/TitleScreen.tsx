import React, { useState, useEffect } from 'react';
import { Play, Sparkles, Trophy, Compass, Volume2, VolumeX, X, Swords, Lock, CheckCircle2, RotateCcw } from 'lucide-react';
import { sound } from '../game/audio';
import { StageId } from '../game/types';
import { GameEngine } from '../game/engine';

interface TitleScreenProps {
  onStart: () => void;
  onSelectStage: (stageId: StageId) => void;
  onOpenAchievements: () => void;
  highScore: number;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  onStart,
  onSelectStage,
  onOpenAchievements,
  highScore,
}) => {
  const [showStageSelect, setShowStageSelect] = useState(false);
  const [selectedArc, setSelectedArc] = useState<'ALVIDA' | 'ZORO'>('ALVIDA');
  const [isMuted, setIsMuted] = useState(sound.getMuted());
  const [unlockedStage, setUnlockedStage] = useState<number>(() => GameEngine.getHighestUnlockedStage());
  const [lockWarning, setLockWarning] = useState<string | null>(null);

  useEffect(() => {
    sound.playTitleBGM();
    setUnlockedStage(GameEngine.getHighestUnlockedStage());
  }, []);

  const handleStart = () => {
    sound.playPunch(2);
    onStart();
  };

  const handleContinueStory = () => {
    sound.playPunch(2);
    const targetStageId = GameEngine.getStageIdByIndex(unlockedStage);
    onSelectStage(targetStageId);
  };

  const handleSelect = (stageId: StageId, stageNum: number) => {
    if (stageNum > unlockedStage) {
      sound.playPunch(1);
      setLockWarning(`Fase ${stageNum} bloqueada! Conclua a fase anterior no Modo História para desbloquear.`);
      window.setTimeout(() => setLockWarning(null), 3500);
      return;
    }
    sound.playPunch(2);
    setShowStageSelect(false);
    onSelectStage(stageId);
  };

  const handleResetProgress = () => {
    if (window.confirm('Deseja reiniciar seu progresso no Modo História? As fases posteriores serão bloqueadas novamente.')) {
      GameEngine.resetStoryProgress();
      setUnlockedStage(1);
      sound.playPunch(2);
    }
  };

  const toggleSound = () => {
    const next = sound.toggleMute();
    setIsMuted(next);
  };

  return (
    <div
      onClick={() => sound.playTitleBGM()}
      className="absolute inset-0 z-30 flex flex-col items-center justify-between p-4 sm:p-8 select-none overflow-hidden bg-gradient-to-b from-[#092b5a] via-[#104a8e] to-[#04162e]"
    >
      {/* Dynamic Animated Sunburst & Ocean Glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-radial from-amber-400/20 via-sky-400/10 to-transparent blur-2xl animate-pulse" />
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-sky-950/80 to-transparent" />
      </div>

      {/* Top Header Bar */}
      <div className="w-full flex items-center justify-between z-10 max-w-4xl">
        <div className="flex items-center gap-2 bg-slate-900/80 border border-amber-400/40 px-3 py-1.5 rounded-none shadow text-xs font-arcade text-amber-300">
          <Trophy size={14} className="text-amber-400" />
          <span>RECORDE:</span>
          <span className="font-mono tabular-nums text-white text-sm">{highScore}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenAchievements();
            }}
            className="flex items-center gap-1.5 bg-amber-500/20 border border-amber-400/80 text-amber-300 px-3 py-1 rounded-none text-xs font-bold hover:bg-amber-500/30 transition-all cursor-pointer shadow"
          >
            <Trophy size={14} />
            <span>CONQUISTAS</span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleSound();
            }}
            className="p-2 rounded-none bg-slate-900/80 border border-white/20 text-white hover:text-amber-300 transition-colors cursor-pointer"
            title="Alternar Som"
          >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} className="text-amber-400" />}
          </button>
          <div className="bg-gradient-to-r from-red-600 to-rose-600 text-white font-arcade text-[10px] sm:text-xs tracking-wider px-3 py-1 rounded-none shadow border border-red-300">
            GBA RETRO ARCADE
          </div>
        </div>
      </div>

      {/* Hero Centerpiece: GBA One Piece Stylized Logo */}
      <div className="flex flex-col items-center text-center z-10 max-w-lg my-auto">
        {/* Straw Hat Jolly Roger Emblem */}
        <div className="relative mb-2 animate-bounce">
          <svg viewBox="0 0 100 100" className="w-24 h-24 sm:w-28 sm:h-28 drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]">
            <path d="M 18 18 L 82 82 M 82 18 L 18 82" stroke="#ffffff" strokeWidth="8" strokeLinecap="round" />
            <circle cx="16" cy="16" r="6" fill="#ffffff" />
            <circle cx="84" cy="84" r="6" fill="#ffffff" />
            <circle cx="84" cy="16" r="6" fill="#ffffff" />
            <circle cx="16" cy="84" r="6" fill="#ffffff" />
            <ellipse cx="50" cy="50" rx="26" ry="24" fill="#ffffff" />
            <circle cx="41" cy="48" r="5" fill="#000000" />
            <circle cx="59" cy="48" r="5" fill="#000000" />
            <ellipse cx="50" cy="40" rx="42" ry="10" fill="#ffd166" stroke="#b07d08" strokeWidth="2.5" />
            <rect x="28" y="23" width="44" height="13" fill="#d90429" />
            <ellipse cx="50" cy="23" rx="24" ry="14" fill="#ffd166" stroke="#b07d08" strokeWidth="2.5" />
            <path d="M 50 74 L 50 88 M 42 84 Q 50 92 58 84" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" fill="none" />
            <path d="M 40 60 Q 50 67 60 60" stroke="#000000" strokeWidth="3" fill="none" />
          </svg>
        </div>

        {/* GBA Marquee Title */}
        <div className="relative">
          <h1 className="font-arcade text-4xl sm:text-6xl md:text-7xl text-transparent bg-clip-text bg-gradient-to-b from-yellow-100 via-amber-300 to-amber-600 tracking-wider drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)] scale-y-110">
            ONE PIECE
          </h1>
          <div className="absolute -inset-1 blur-xs bg-amber-400/20 -z-10 rounded-none" />
        </div>

        <div className="flex items-center gap-2 mt-1">
          <span className="font-heading font-black text-xs sm:text-sm text-rose-300 tracking-wider uppercase bg-slate-950/70 px-3 py-1 rounded-none border border-rose-500/40">
            Arco Alvida
          </span>
          <span className="text-amber-400 font-bold">&</span>
          <span className="font-heading font-black text-xs sm:text-sm text-emerald-300 tracking-wider uppercase bg-slate-950/70 px-3 py-1 rounded-none border border-emerald-500/40">
            Saga do Zoro
          </span>
        </div>

        <p className="text-xs sm:text-sm text-cyan-200 mt-3 max-w-md drop-shadow">
          Reviva o início de East Blue no clássico beat 'em up estilo GBA! Desbloqueie as fases jogando a história em estilo mangá.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mt-6 sm:mt-7 w-full max-w-xs sm:max-w-md">
          {unlockedStage > 1 ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleContinueStory();
              }}
              className="w-full flex-1 px-6 py-3.5 bg-gradient-to-r from-emerald-600 via-teal-500 to-amber-500 hover:brightness-110 text-white font-arcade text-xs sm:text-sm tracking-wider rounded-none shadow-[0_8px_20px_rgba(16,185,129,0.5)] border-2 border-emerald-200 flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer group"
            >
              <Play size={18} className="fill-white group-hover:translate-x-0.5 transition-transform" />
              <span>CONTINUAR (FASE {unlockedStage})</span>
              <Sparkles size={16} className="text-yellow-200 animate-spin" />
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleStart();
              }}
              className="w-full flex-1 px-6 py-3.5 bg-gradient-to-r from-red-600 via-rose-500 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-arcade text-xs sm:text-sm tracking-wider rounded-none shadow-[0_8px_20px_rgba(230,57,70,0.5)] border-2 border-amber-200 flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer group"
            >
              <Play size={18} className="fill-white group-hover:translate-x-0.5 transition-transform" />
              <span>MODO HISTÓRIA</span>
              <Sparkles size={16} className="text-yellow-200 animate-spin" />
            </button>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              sound.playPunch(1);
              setUnlockedStage(GameEngine.getHighestUnlockedStage());
              setShowStageSelect(true);
            }}
            className="w-full flex-1 px-5 py-3.5 bg-slate-900/90 hover:bg-slate-800 text-amber-300 font-arcade text-xs sm:text-sm tracking-wider rounded-none border-2 border-amber-400/60 shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
          >
            <Compass size={18} className="text-amber-400" />
            <span>FASES ({unlockedStage}/6)</span>
          </button>
        </div>
      </div>

      {/* Controls Guide Footer */}
      <div className="z-10 w-full max-w-2xl text-center">
        <div className="bg-slate-950/70 backdrop-blur-xs border border-white/10 rounded-none px-4 py-2 text-[10px] sm:text-xs text-slate-300 flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
          <span><b className="text-amber-400">Mobile:</b> Joystick Virtual + Botões Arcade</span>
          <span>·</span>
          <span><b className="text-amber-400">Teclado:</b> WASD</span>
          <span>·</span>
          <span><b className="text-amber-400">J:</b> Soco / Corte</span>
          <span>·</span>
          <span><b className="text-amber-400">K + J:</b> Corte Aéreo (Air Slash!)</span>
          <span>·</span>
          <span><b className="text-amber-400">L:</b> Pistol / Iai Slash</span>
          <span>·</span>
          <span><b className="text-amber-400">Espaço:</b> Especial (Gatling / Oni Giri)</span>
        </div>
      </div>

      {/* Stage Selection Modal with Story Mode Lock/Unlock Rules */}
      {showStageSelect && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute inset-0 z-40 bg-slate-950/85 backdrop-blur-xs flex items-center justify-center p-4 animate-scale-in"
        >
          <div className="w-full max-w-xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-3 border-amber-400 rounded-none p-5 sm:p-6 shadow-2xl relative max-h-[90vh] flex flex-col">
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
              <span className="font-arcade text-xs text-amber-400 tracking-wider">MODO HISTÓRIA · SELEÇÃO DE FASES</span>
              <h2 className="font-heading font-black text-lg sm:text-xl text-white mt-0.5">
                Escolha o Arco e a Fase
              </h2>
              <p className="text-xs text-slate-300 mt-1">
                Fases são desbloqueadas conforme você as completa na campanha!
              </p>
            </div>

            {/* Lock warning toast */}
            {lockWarning && (
              <div className="bg-red-950/90 border border-red-500 text-red-200 text-xs px-3 py-1.5 rounded-none mb-3 text-center animate-bounce">
                {lockWarning}
              </div>
            )}

            {/* Arc Selector Segmented Tabs */}
            <div className="flex rounded-none bg-slate-950 p-1 mb-3 border border-slate-800">
              <button
                onClick={() => setSelectedArc('ALVIDA')}
                className={`flex-1 py-2 text-xs font-bold rounded-none transition-all ${
                  selectedArc === 'ALVIDA'
                    ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                1. Navio da Alvida (Fases 1-3)
              </button>
              <button
                onClick={() => setSelectedArc('ZORO')}
                className={`flex-1 py-2 text-xs font-bold rounded-none transition-all ${
                  selectedArc === 'ZORO'
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                2. Shells Town · Zoro (Fases 4-6)
              </button>
            </div>

            {/* Stage Cards Container */}
            <div className="flex flex-col gap-2.5 overflow-y-auto flex-1 pr-1">
              {selectedArc === 'ALVIDA' ? (
                <>
                  {/* Stage 1: Always Unlocked */}
                  <button
                    onClick={() => handleSelect('STAGE_1_GALLEY', 1)}
                    className="flex items-center gap-3.5 p-3 rounded-none bg-slate-800/80 hover:bg-slate-700 border border-amber-500/40 text-left transition-all active:scale-[0.98] cursor-pointer"
                  >
                    <div className="w-12 h-12 rounded-none bg-amber-900/60 flex items-center justify-center text-xl border border-amber-400/50 shrink-0">
                      🍖
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-arcade text-[10px] text-amber-300">FASE 1</span>
                        {unlockedStage > 1 ? (
                          <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold">
                            <CheckCircle2 size={12} /> CONCLUÍDA
                          </span>
                        ) : (
                          <span className="text-[10px] text-amber-300 font-bold">DISPONÍVEL</span>
                        )}
                      </div>
                      <h3 className="font-bold text-sm text-white">Despensa do Miss Love Duck</h3>
                      <p className="text-[11px] text-slate-300 truncate">Luffy explode do barril e defende Coby.</p>
                    </div>
                  </button>

                  {/* Stage 2 */}
                  <button
                    onClick={() => handleSelect('STAGE_2_DECK', 2)}
                    className={`flex items-center gap-3.5 p-3 rounded-none text-left transition-all ${
                      unlockedStage >= 2
                        ? 'bg-slate-800/80 hover:bg-slate-700 border border-sky-500/40 cursor-pointer active:scale-[0.98]'
                        : 'bg-slate-900/50 border border-slate-800 opacity-60 cursor-not-allowed'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-none bg-blue-900/60 flex items-center justify-center text-xl border border-sky-400/50 shrink-0">
                      {unlockedStage >= 2 ? '⚓' : <Lock size={20} className="text-slate-400" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-arcade text-[10px] text-sky-300">FASE 2</span>
                        {unlockedStage > 2 ? (
                          <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold">
                            <CheckCircle2 size={12} /> CONCLUÍDA
                          </span>
                        ) : unlockedStage === 2 ? (
                          <span className="text-[10px] text-sky-300 font-bold">DISPONÍVEL</span>
                        ) : (
                          <span className="text-[10px] text-red-400 font-bold">BLOQUEADO</span>
                        )}
                      </div>
                      <h3 className="font-bold text-sm text-white">Convés Principal</h3>
                      <p className="text-[11px] text-slate-300 truncate">
                        {unlockedStage >= 2
                          ? 'Batalha aberta sob o sol contra hordas de piratas.'
                          : 'Bloqueado: Conclua a Fase 1 na História.'}
                      </p>
                    </div>
                  </button>

                  {/* Stage 3 */}
                  <button
                    onClick={() => handleSelect('STAGE_3_BOSS', 3)}
                    className={`flex items-center gap-3.5 p-3 rounded-none text-left transition-all ${
                      unlockedStage >= 3
                        ? 'bg-slate-800/80 hover:bg-slate-700 border border-rose-500/40 cursor-pointer active:scale-[0.98]'
                        : 'bg-slate-900/50 border border-slate-800 opacity-60 cursor-not-allowed'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-none bg-purple-900/60 flex items-center justify-center text-xl border border-rose-400/50 shrink-0">
                      {unlockedStage >= 3 ? '👑' : <Lock size={20} className="text-slate-400" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-arcade text-[10px] text-rose-300">FASE 3 · CHEFE</span>
                        {unlockedStage > 3 ? (
                          <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold">
                            <CheckCircle2 size={12} /> CONCLUÍDA
                          </span>
                        ) : unlockedStage === 3 ? (
                          <span className="text-[10px] text-rose-300 font-bold">DISPONÍVEL</span>
                        ) : (
                          <span className="text-[10px] text-red-400 font-bold">BLOQUEADO</span>
                        )}
                      </div>
                      <h3 className="font-bold text-sm text-white">Castelo de Popa: Capitã Alvida</h3>
                      <p className="text-[11px] text-slate-300 truncate">
                        {unlockedStage >= 3
                          ? 'Duelo final contra a Clava de Ferro de Alvida!'
                          : 'Bloqueado: Conclua a Fase 2 na História.'}
                      </p>
                    </div>
                  </button>
                </>
              ) : (
                <>
                  {/* Stage 4 */}
                  <button
                    onClick={() => handleSelect('STAGE_4_BASE_COURTYARD', 4)}
                    className={`flex items-center gap-3.5 p-3 rounded-none text-left transition-all ${
                      unlockedStage >= 4
                        ? 'bg-slate-800/80 hover:bg-slate-700 border border-emerald-500/40 cursor-pointer active:scale-[0.98]'
                        : 'bg-slate-900/50 border border-slate-800 opacity-60 cursor-not-allowed'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-none bg-emerald-950 flex items-center justify-center text-xl border border-emerald-400/50 shrink-0">
                      {unlockedStage >= 4 ? '🏛️' : <Lock size={20} className="text-slate-400" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-arcade text-[10px] text-emerald-300">FASE 4</span>
                        {unlockedStage > 4 ? (
                          <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold">
                            <CheckCircle2 size={12} /> CONCLUÍDA
                          </span>
                        ) : unlockedStage === 4 ? (
                          <span className="text-[10px] text-emerald-300 font-bold">DISPONÍVEL</span>
                        ) : (
                          <span className="text-[10px] text-red-400 font-bold">BLOQUEADO</span>
                        )}
                      </div>
                      <h3 className="font-bold text-sm text-white">Pátio de Execução de Shells Town</h3>
                      <p className="text-[11px] text-slate-300 truncate">
                        {unlockedStage >= 4
                          ? 'Luffy encontra Zoro amarrado e luta contra soldados da Marinha.'
                          : 'Bloqueado: Derrote a Capitã Alvida na Fase 3!'}
                      </p>
                    </div>
                  </button>

                  {/* Stage 5 */}
                  <button
                    onClick={() => handleSelect('STAGE_5_FORTRESS_INTERIOR', 5)}
                    className={`flex items-center gap-3.5 p-3 rounded-none text-left transition-all ${
                      unlockedStage >= 5
                        ? 'bg-slate-800/80 hover:bg-slate-700 border border-amber-500/40 cursor-pointer active:scale-[0.98]'
                        : 'bg-slate-900/50 border border-slate-800 opacity-60 cursor-not-allowed'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-none bg-amber-950 flex items-center justify-center text-xl border border-amber-400/50 shrink-0">
                      {unlockedStage >= 5 ? '🗡️' : <Lock size={20} className="text-slate-400" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-arcade text-[10px] text-amber-300">FASE 5</span>
                        {unlockedStage > 5 ? (
                          <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold">
                            <CheckCircle2 size={12} /> CONCLUÍDA
                          </span>
                        ) : unlockedStage === 5 ? (
                          <span className="text-[10px] text-amber-300 font-bold">DISPONÍVEL</span>
                        ) : (
                          <span className="text-[10px] text-red-400 font-bold">BLOQUEADO</span>
                        )}
                      </div>
                      <h3 className="font-bold text-sm text-white">Torre do Capitão Morgan</h3>
                      <p className="text-[11px] text-slate-300 truncate">
                        {unlockedStage >= 5
                          ? 'Infiltre a torre e recupere as três espadas do Zoro!'
                          : 'Bloqueado: Conclua a Fase 4 no Pátio.'}
                      </p>
                    </div>
                  </button>

                  {/* Stage 6: Play as Zoro */}
                  <button
                    onClick={() => handleSelect('STAGE_6_MORGAN_SHOWDOWN', 6)}
                    className={`flex items-center gap-3.5 p-3 rounded-none text-left transition-all ${
                      unlockedStage >= 6
                        ? 'bg-emerald-950/70 hover:bg-emerald-900/70 border-2 border-emerald-400 cursor-pointer active:scale-[0.98]'
                        : 'bg-slate-900/50 border border-slate-800 opacity-60 cursor-not-allowed'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-none bg-emerald-700 flex items-center justify-center text-xl border border-yellow-300 shrink-0">
                      {unlockedStage >= 6 ? '🪓' : <Lock size={20} className="text-slate-400" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-arcade text-[10px] text-yellow-300">FASE 6 · ZORO JOGÁVEL!</span>
                        {unlockedStage >= 6 ? (
                          <span className="text-[10px] text-emerald-300 font-bold">CHEFE FINAL</span>
                        ) : (
                          <span className="text-[10px] text-red-400 font-bold">BLOQUEADO</span>
                        )}
                      </div>
                      <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                        <Swords size={14} className="text-emerald-400" />
                        Duelo: Zoro vs Capitão Morgan
                      </h3>
                      <p className="text-[11px] text-emerald-200 truncate">
                        {unlockedStage >= 6
                          ? 'Jogue como Roronoa Zoro e derrote o Mão-de-Machado com Santoryu!'
                          : 'Bloqueado: Recupere as 3 espadas do Zoro na Fase 5.'}
                      </p>
                    </div>
                  </button>
                </>
              )}
            </div>

            {/* Reset Progress Footer */}
            <div className="pt-3 mt-2 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                Progresso: {unlockedStage} de 6 fases liberadas
              </span>

              {unlockedStage > 1 && (
                <button
                  onClick={handleResetProgress}
                  className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
                >
                  <RotateCcw size={12} />
                  <span>Reiniciar História</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
