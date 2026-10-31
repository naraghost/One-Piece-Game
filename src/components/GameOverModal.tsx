import React from 'react';
import { RotateCcw, Skull } from 'lucide-react';
import { sound } from '../game/audio';

interface GameOverModalProps {
  score: number;
  totalDefeated: number;
  onRestart: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  score,
  totalDefeated,
  onRestart,
}) => {
  return (
    <div className="absolute inset-0 z-40 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 select-none">
      <div className="w-full max-w-sm bg-slate-900 border-2 border-red-500 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(239,68,68,0.4)] flex flex-col items-center text-center animate-scale-in">
        <div className="w-16 h-16 rounded-full bg-red-950 border-2 border-red-500 flex items-center justify-center shadow-lg mb-3 text-red-500">
          <Skull size={34} />
        </div>

        <h2 className="font-arcade text-2xl sm:text-3xl text-red-500 tracking-wider">
          DERROTADO...
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 mt-1">
          A clava de ferro de Alvida foi pesada demais! Levante-se, o futuro Rei dos Piratas nunca desiste!
        </p>

        {/* Stats */}
        <div className="w-full flex items-center justify-around bg-slate-950/80 border border-slate-800 rounded-xl p-3 my-5">
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-slate-400 font-bold">RECOMPENSA</span>
            <span className="font-mono text-base font-black text-amber-400 tabular-nums">
              {score}
            </span>
          </div>
          <div className="w-px h-8 bg-slate-800" />
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-slate-400 font-bold">INIMIGOS KO</span>
            <span className="font-mono text-base font-black text-rose-400 tabular-nums">
              {totalDefeated}
            </span>
          </div>
        </div>

        {/* Retry Button */}
        <button
          onClick={() => {
            sound.playPunch(1);
            onRestart();
          }}
          className="w-full py-3.5 bg-gradient-to-r from-red-600 to-rose-500 hover:from-red-500 hover:to-rose-400 text-white font-arcade text-sm rounded-xl shadow-lg border border-red-300 flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
        >
          <RotateCcw size={18} />
          <span>TENTAR NOVAMENTE</span>
        </button>
      </div>
    </div>
  );
};
