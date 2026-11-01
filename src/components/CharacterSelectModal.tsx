import React, { useState } from 'react';
import { PlayerCharacter, StageId } from '../game/types';
import { Swords, Zap, Shield, Play, Lock, Sparkles, X, ChevronRight } from 'lucide-react';
import { sound } from '../game/audio';
import { SaveManager } from '../game/storage';

interface CharacterSelectModalProps {
  stageId: StageId;
  stageName: string;
  onConfirm: (character: PlayerCharacter) => void;
  onCancel: () => void;
}

export const CharacterSelectModal: React.FC<CharacterSelectModalProps> = ({
  stageId,
  stageName,
  onConfirm,
  onCancel,
}) => {
  const activeSlot = SaveManager.getActiveSlot();
  const unlockedChars = activeSlot.unlockedCharacters || ['LUFFY'];
  const isZoroUnlocked = unlockedChars.includes('ZORO') || stageId === 'STAGE_6_MORGAN_SHOWDOWN';

  const defaultChar: PlayerCharacter = stageId === 'STAGE_6_MORGAN_SHOWDOWN'
    ? 'ZORO'
    : (activeSlot.character === 'ZORO' && isZoroUnlocked ? 'ZORO' : 'LUFFY');

  const [selectedChar, setSelectedChar] = useState<PlayerCharacter>(defaultChar);

  const handleSelect = (char: PlayerCharacter) => {
    if (char === 'ZORO' && !isZoroUnlocked) {
      sound.playPunch(1);
      return;
    }
    sound.playPunch(2);
    setSelectedChar(char);
    SaveManager.updateActiveSlot({ character: char });
  };

  const handleDeploy = () => {
    sound.playPunch(3);
    onConfirm(selectedChar);
  };

  return (
    <div
      onClick={onCancel}
      className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-scale-in select-none"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-3 border-amber-400 p-4 sm:p-6 shadow-2xl relative flex flex-col max-h-[92vh] overflow-y-auto"
      >
        {/* Close Button */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-slate-400 hover:text-white bg-slate-800 p-2 rounded-none cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 border border-amber-400/60 text-amber-300 font-arcade text-[10px] sm:text-xs">
            <Sparkles size={12} />
            <span>SELEÇÃO DE TRIPULANTE · PRE-FASE</span>
          </div>
          <h2 className="font-heading font-black text-xl sm:text-2xl text-white mt-1">
            Escolha seu Lutador para o Embarque
          </h2>
          <p className="text-xs text-sky-300 font-semibold mt-0.5">
            Destino: <span className="text-amber-300 font-bold">{stageName}</span>
          </p>
        </div>

        {/* Character Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-auto">
          {/* LUFFY CARD */}
          <div
            onClick={() => handleSelect('LUFFY')}
            className={`p-4 border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
              selectedChar === 'LUFFY'
                ? 'bg-red-950/40 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.3)] ring-2 ring-amber-400'
                : 'bg-slate-900/80 border-slate-700 hover:border-slate-500 opacity-80'
            }`}
          >
            {selectedChar === 'LUFFY' && (
              <span className="absolute -top-2.5 right-3 bg-amber-400 text-slate-950 font-arcade text-[9px] px-2 py-0.5 font-bold shadow">
                SELECIONADO
              </span>
            )}

            <div>
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-none bg-red-900/50 border border-amber-400/60 flex items-center justify-center text-3xl">
                  👒
                </div>
                <div>
                  <h3 className="font-heading font-black text-base text-white">Monkey D. Luffy</h3>
                  <span className="text-[11px] font-bold text-amber-400 font-arcade">GOMU GOMU NO MI</span>
                </div>
              </div>

              {/* Stats */}
              <div className="mt-3 space-y-1.5 text-xs text-slate-300">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">Poder:</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((i) => (
                      <span key={i} className="w-3.5 h-1.5 bg-rose-500" />
                    ))}
                    <span className="w-3.5 h-1.5 bg-slate-700" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">Alcance Elástico:</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <span key={i} className="w-3.5 h-1.5 bg-amber-400" />
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">Mobilidade:</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((i) => (
                      <span key={i} className="w-3.5 h-1.5 bg-emerald-400" />
                    ))}
                    <span className="w-3.5 h-1.5 bg-slate-700" />
                  </div>
                </div>
              </div>

              {/* Moves preview */}
              <div className="mt-3 pt-2.5 border-t border-white/10 text-[11px] text-slate-300 space-y-1">
                <p><b className="text-amber-400">Aéreo (Segurar J):</b> Gomu Gomu no Stamp (Impacto em área!)</p>
                <p><b className="text-amber-400">Finisher (15+ Combo):</b> Gomu Gomu no Bazooka!</p>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleSelect('LUFFY');
              }}
              className={`mt-4 w-full py-2 font-arcade text-xs tracking-wider border transition-all cursor-pointer ${
                selectedChar === 'LUFFY'
                  ? 'bg-amber-400 text-slate-950 border-amber-300 font-bold'
                  : 'bg-slate-800 text-slate-300 border-slate-600 hover:text-white'
              }`}
            >
              {selectedChar === 'LUFFY' ? 'ESCOLHIDO' : 'SELECIONAR LUFFY'}
            </button>
          </div>

          {/* ZORO CARD */}
          <div
            onClick={() => handleSelect('ZORO')}
            className={`p-4 border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
              !isZoroUnlocked
                ? 'bg-slate-950/60 border-slate-800 opacity-60 cursor-not-allowed'
                : selectedChar === 'ZORO'
                ? 'bg-emerald-950/40 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)] ring-2 ring-emerald-400'
                : 'bg-slate-900/80 border-slate-700 hover:border-slate-500 opacity-80'
            }`}
          >
            {isZoroUnlocked && selectedChar === 'ZORO' && (
              <span className="absolute -top-2.5 right-3 bg-emerald-400 text-slate-950 font-arcade text-[9px] px-2 py-0.5 font-bold shadow">
                SELECIONADO
              </span>
            )}

            {!isZoroUnlocked && (
              <div className="absolute inset-0 bg-slate-950/70 z-10 flex flex-col items-center justify-center p-4 text-center">
                <Lock size={28} className="text-amber-400 mb-1.5" />
                <span className="font-arcade text-xs text-amber-300">BLOQUEADO</span>
                <p className="text-[11px] text-slate-300 mt-1 max-w-[200px]">
                  Resgate Zoro na Base da Marinha (Fase 4 / 5) para recrutá-lo!
                </p>
              </div>
            )}

            <div>
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-none bg-emerald-900/50 border border-emerald-400/60 flex items-center justify-center text-3xl">
                  ⚔️
                </div>
                <div>
                  <h3 className="font-heading font-black text-base text-white">Roronoa Zoro</h3>
                  <span className="text-[11px] font-bold text-emerald-400 font-arcade">ESTILO SANTORYU</span>
                </div>
              </div>

              {/* Stats */}
              <div className="mt-3 space-y-1.5 text-xs text-slate-300">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">Poder de Corte:</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <span key={i} className="w-3.5 h-1.5 bg-emerald-400" />
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">Velocidade Iai:</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <span key={i} className="w-3.5 h-1.5 bg-teal-400" />
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">Alcance de Lâmina:</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((i) => (
                      <span key={i} className="w-3.5 h-1.5 bg-amber-400" />
                    ))}
                    <span className="w-3.5 h-1.5 bg-slate-700" />
                  </div>
                </div>
              </div>

              {/* Moves preview */}
              <div className="mt-3 pt-2.5 border-t border-white/10 text-[11px] text-slate-300 space-y-1">
                <p><b className="text-emerald-400">Corte Voador (L):</b> Tobu Zangeki lâmina de vento!</p>
                <p><b className="text-emerald-400">Finisher (15+ Combo):</b> Ougi: Sanzen Sekai!</p>
              </div>
            </div>

            <button
              disabled={!isZoroUnlocked}
              onClick={(e) => {
                e.stopPropagation();
                handleSelect('ZORO');
              }}
              className={`mt-4 w-full py-2 font-arcade text-xs tracking-wider border transition-all ${
                !isZoroUnlocked
                  ? 'bg-slate-800 text-slate-500 border-slate-700 cursor-not-allowed'
                  : selectedChar === 'ZORO'
                  ? 'bg-emerald-500 text-slate-950 border-emerald-300 font-bold cursor-pointer'
                  : 'bg-slate-800 text-slate-300 border-slate-600 hover:text-white cursor-pointer'
              }`}
            >
              {!isZoroUnlocked ? 'BLOQUEADO' : selectedChar === 'ZORO' ? 'ESCOLHIDO' : 'SELECIONAR ZORO'}
            </button>
          </div>
        </div>

        {/* Deploy Action */}
        <div className="mt-5 pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-left text-xs text-slate-300">
            Lutador Pronto: <b className="text-amber-400">{selectedChar === 'LUFFY' ? 'Monkey D. Luffy' : 'Roronoa Zoro'}</b>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onCancel}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-arcade text-xs border border-slate-700 cursor-pointer"
            >
              VOLTAR
            </button>
            <button
              onClick={handleDeploy}
              className="flex-1 sm:flex-initial px-6 py-2.5 bg-gradient-to-r from-emerald-600 via-teal-500 to-amber-500 hover:brightness-110 text-white font-arcade text-xs tracking-wider border-2 border-emerald-200 shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <Play size={16} className="fill-white" />
              <span>EMBARCAR NA FASE</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
