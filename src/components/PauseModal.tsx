import React from 'react';
import { Play, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { sound } from '../game/audio';

interface PauseModalProps {
  onResume: () => void;
  onRestart: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  onResume,
  onRestart,
  isMuted,
  onToggleMute,
}) => {
  return (
    <div className="absolute inset-0 z-40 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 select-none">
      <div className="w-full max-w-xs bg-slate-900 border-2 border-amber-400 rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center animate-scale-in">
        <h2 className="font-arcade text-2xl text-amber-300 tracking-wider mb-5">
          JOGO PAUSADO
        </h2>

        <div className="w-full flex flex-col gap-3">
          <button
            onClick={() => {
              sound.playPunch(1);
              onResume();
            }}
            className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-arcade text-xs font-bold rounded-xl shadow flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
          >
            <Play size={16} />
            <span>CONTINUAR</span>
          </button>

          <button
            onClick={onToggleMute}
            className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-arcade text-xs rounded-xl border border-slate-700 shadow flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
          >
            {isMuted ? <VolumeX size={16} className="text-red-400" /> : <Volume2 size={16} className="text-emerald-400" />}
            <span>{isMuted ? 'SOM: DESLIGADO' : 'SOM: LIGADO'}</span>
          </button>

          <button
            onClick={() => {
              sound.playPunch(2);
              onRestart();
            }}
            className="w-full py-3 bg-red-900/60 hover:bg-red-800 text-red-200 font-arcade text-xs rounded-xl border border-red-800 shadow flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
          >
            <RotateCcw size={16} />
            <span>REINICIAR BATALHA</span>
          </button>
        </div>
      </div>
    </div>
  );
};
