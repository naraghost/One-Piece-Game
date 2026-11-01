import React, { useState } from 'react';
import { SaveManager, SaveSlot } from '../game/storage';
import { sound } from '../game/audio';
import { Trophy, CheckCircle2, RotateCcw, X, PlusCircle, Calendar, Coins, Compass } from 'lucide-react';

interface SaveSlotsModalProps {
  onClose: () => void;
  onSlotChanged: (slot: SaveSlot) => void;
}

export const SaveSlotsModal: React.FC<SaveSlotsModalProps> = ({ onClose, onSlotChanged }) => {
  const [slots, setSlots] = useState<Record<string, SaveSlot>>(() => SaveManager.getSlots());
  const [activeSlotId, setActiveSlotId] = useState<'slot-1' | 'slot-2' | 'slot-3'>(() => SaveManager.getActiveSlotId());

  const handleSelectSlot = (slotId: 'slot-1' | 'slot-2' | 'slot-3') => {
    sound.playPunch(2);
    SaveManager.setActiveSlotId(slotId);
    setActiveSlotId(slotId);
    const updated = SaveManager.getActiveSlot();
    onSlotChanged(updated);
  };

  const handleResetSlot = (slotId: 'slot-1' | 'slot-2' | 'slot-3') => {
    if (window.confirm(`Deseja reiniciar os dados do ${slotId.toUpperCase()}? O progresso salvo será redefinido.`)) {
      sound.playPunch(1);
      const fresh = SaveManager.resetSlot(slotId);
      setSlots({ ...SaveManager.getSlots() });
      if (activeSlotId === slotId) {
        onSlotChanged(fresh);
      }
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-scale-in select-none"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-3 border-amber-400 p-4 sm:p-6 shadow-2xl relative flex flex-col max-h-[92vh] overflow-y-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white bg-slate-800 p-2 rounded-none cursor-pointer"
        >
          <X size={18} />
        </button>

        <div className="text-center mb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 border border-amber-400/60 text-amber-300 font-arcade text-[10px] sm:text-xs">
            <Compass size={12} />
            <span>SISTEMA DE ARQUIVOS · REGISTROS DE BORDO</span>
          </div>
          <h2 className="font-heading font-black text-xl sm:text-2xl text-white mt-1">
            Gerenciador de Saves (3 Slots)
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Crie novos jogos independentes ou troque entre seus diários de navegação pirata!
          </p>
        </div>

        {/* 3 Save Slot Cards */}
        <div className="flex flex-col gap-3 my-auto">
          {(['slot-1', 'slot-2', 'slot-3'] as const).map((slotId, idx) => {
            const slot = slots[slotId];
            const isActive = activeSlotId === slotId;
            const hasProgress = slot.unlockedStage > 1 || slot.highScore > 0 || slot.berries > 0;

            return (
              <div
                key={slotId}
                onClick={() => handleSelectSlot(slotId)}
                className={`p-4 border-2 transition-all cursor-pointer relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                  isActive
                    ? 'bg-amber-950/40 border-amber-400 shadow-[0_0_16px_rgba(245,158,11,0.3)] ring-2 ring-amber-400'
                    : 'bg-slate-900/80 border-slate-700 hover:border-slate-500'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className={`w-12 h-12 flex items-center justify-center text-2xl border ${
                    isActive ? 'bg-amber-500/30 border-amber-400 text-amber-300' : 'bg-slate-800 border-slate-600 text-slate-400'
                  }`}>
                    {slot.character === 'ZORO' ? '⚔️' : '👒'}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-arcade text-xs text-amber-300 tracking-wider">
                        SLOT {idx + 1}
                      </span>
                      {isActive && (
                        <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/60 font-arcade text-[9px] px-2 py-0.5 font-bold flex items-center gap-1">
                          <CheckCircle2 size={10} /> ATIVO
                        </span>
                      )}
                    </div>
                    <h3 className="font-heading font-black text-sm sm:text-base text-white">
                      {slot.name}
                    </h3>
                    <div className="flex items-center gap-3 text-[11px] text-slate-300 mt-1">
                      <span className="flex items-center gap-1 text-sky-300">
                        <Compass size={12} /> Fase {slot.unlockedStage}/7
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1 text-amber-400">
                        <Coins size={12} /> {slot.berries} Berries
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1 text-yellow-300">
                        <Trophy size={12} /> {slot.highScore} pts
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                  {hasProgress && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleResetSlot(slotId);
                      }}
                      className="px-2.5 py-1.5 bg-slate-800 hover:bg-red-950/60 hover:text-red-400 text-slate-400 font-arcade text-[10px] border border-slate-700 flex items-center gap-1 cursor-pointer"
                      title="Reiniciar Slot"
                    >
                      <RotateCcw size={12} />
                      <span>Limpar</span>
                    </button>
                  )}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectSlot(slotId);
                    }}
                    className={`px-4 py-1.5 font-arcade text-xs border tracking-wider transition-all cursor-pointer ${
                      isActive
                        ? 'bg-amber-400 text-slate-950 border-amber-300 font-bold'
                        : 'bg-slate-800 text-slate-300 border-slate-600 hover:text-white'
                    }`}
                  >
                    {isActive ? 'SELECIONADO' : 'CARREGAR'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            Slot Ativo: <b className="text-amber-300">{slots[activeSlotId]?.name}</b>
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-arcade text-xs border border-slate-700 cursor-pointer"
          >
            FECHAR
          </button>
        </div>
      </div>
    </div>
  );
};
