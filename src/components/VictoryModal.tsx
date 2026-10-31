import React from 'react';
import { RotateCcw, Trophy, Award, Star } from 'lucide-react';
import { sound } from '../game/audio';
import { StageId } from '../game/types';

interface VictoryModalProps {
  score: number;
  totalDefeated: number;
  maxCombo: number;
  currentStage?: StageId;
  onRestart: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  score,
  totalDefeated,
  maxCombo,
  currentStage,
  onRestart,
}) => {
  const isMorganStage = currentStage === 'STAGE_6_MORGAN_SHOWDOWN';

  let rank = 'B';
  if (score > 18000) rank = 'S';
  else if (score > 12000) rank = 'A';

  return (
    <div className="absolute inset-0 z-40 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 select-none">
      <div className="w-full max-w-md bg-slate-900 border-2 border-amber-400 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(251,191,36,0.3)] flex flex-col items-center text-center animate-scale-in">
        {/* Victory Laurel / Trophy */}
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 border-4 border-white flex items-center justify-center shadow-xl mb-3 text-4xl animate-bounce">
          {isMorganStage ? '🗡️' : '🏆'}
        </div>

        <h2 className="font-arcade text-2xl sm:text-3xl text-amber-300 tracking-wider">
          {isMorganStage ? 'SANTORYU VITORIOSO!' : 'VITÓRIA PIRATA!'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 mt-1">
          {isMorganStage
            ? 'O tirano Capitão Morgan foi fatiado pelo Santoryu de Zoro! Roronoa Zoro agora é o primeiro companheiro do bando!'
            : 'A Capitã Alvida foi mandada para o espaço! Coby agora é livre para seguir seu sonho na Marinha!'}
        </p>

        {/* Stats Grid */}
        <div className="w-full grid grid-cols-3 gap-2.5 my-5">
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-2.5 flex flex-col items-center">
            <span className="text-[10px] text-slate-400 font-bold">RECOMPENSA</span>
            <span className="font-mono text-base font-black text-amber-400 tabular-nums">
              {score}
            </span>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-2.5 flex flex-col items-center">
            <span className="text-[10px] text-slate-400 font-bold">{isMorganStage ? 'INIMIGOS KO' : 'PIRATAS KO'}</span>
            <span className="font-mono text-base font-black text-rose-400 tabular-nums">
              {totalDefeated}
            </span>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-2.5 flex flex-col items-center">
            <span className="text-[10px] text-slate-400 font-bold">CLASSIFICAÇÃO</span>
            <span className="font-arcade text-xl font-black text-purple-400">
              {rank}
            </span>
          </div>
        </div>

        {/* Restart Action Button */}
        <button
          onClick={() => {
            sound.playPunch(2);
            onRestart();
          }}
          className="w-full py-3.5 bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-arcade text-sm rounded-xl shadow-lg border-2 border-amber-200 flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
        >
          <RotateCcw size={18} />
          <span>JOGAR NOVAMENTE</span>
        </button>
      </div>
    </div>
  );
};
