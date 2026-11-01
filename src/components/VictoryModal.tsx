import React from 'react';
import { RotateCcw, Trophy, Award, Home, Play, Sparkles } from 'lucide-react';
import { sound } from '../game/audio';
import { StageId } from '../game/types';

interface VictoryModalProps {
  score: number;
  totalDefeated: number;
  maxCombo: number;
  currentStage?: StageId;
  onRestart: () => void;
  onProceedNextStage?: () => void;
  onReturnToMenu?: () => void;
  onReplayCampaign?: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  score,
  totalDefeated,
  maxCombo,
  currentStage,
  onRestart,
  onProceedNextStage,
  onReturnToMenu,
  onReplayCampaign,
}) => {
  const isMorganStage = currentStage === 'STAGE_6_MORGAN_SHOWDOWN';
  const isAlvidaStage = currentStage === 'STAGE_3_BOSS';
  const isOrangeTownStage = currentStage === 'STAGE_7_ORANGE_TOWN';
  const isCampaignFinished = isOrangeTownStage;
  const canProceed = !isCampaignFinished && Boolean(onProceedNextStage);

  let rank = 'B';
  if (score > 18000) rank = 'S';
  else if (score > 12000) rank = 'A';

  return (
    <div className="absolute inset-0 z-40 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="w-full max-w-md bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-3 border-amber-400 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(251,191,36,0.35)] flex flex-col items-center text-center animate-scale-in text-white">
        
        {/* Victory Laurel / Icon Badge */}
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-300 border-4 border-white flex items-center justify-center shadow-xl mb-3 text-4xl animate-bounce">
          {isOrangeTownStage ? '🎪' : isMorganStage ? '🗡️' : isAlvidaStage ? '⚓' : '🏆'}
        </div>

        <h2 className="font-arcade text-2xl sm:text-3xl text-amber-300 tracking-wider">
          {isOrangeTownStage
            ? 'CAMPANHA CONCLUÍDA!'
            : isMorganStage
            ? 'SANTORYU VITORIOSO!'
            : isAlvidaStage
            ? 'ALVIDA DERROTADA!'
            : 'VITÓRIA PIRATA!'}
        </h2>

        <p className="text-xs sm:text-sm text-slate-300 mt-1.5 leading-relaxed">
          {isOrangeTownStage
            ? 'Parabéns! Você concluiu todos os estágios do Modo História! Os piratas de Buggy foram derrotados e o bando do Chapéu de Palha conquistou os mares do East Blue!'
            : isMorganStage
            ? 'O tirano Capitão Morgan foi fatiado pelo Santoryu de Zoro! Roronoa Zoro agora é o primeiro companheiro do bando! A rota para Orange Town se abriu!'
            : isAlvidaStage
            ? 'A Capitã Alvida foi mandada para o espaço com o Gomu Gomu no Bazooka! Rumores dizem que o temido Caçador de Piratas Zoro está preso na Base da Marinha de Shells Town!'
            : 'Fase completada com sucesso! Continue navegando na Grand Line!'}
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
            <span className="text-[10px] text-slate-400 font-bold">{isMorganStage ? 'MARINHEIROS' : 'PIRATAS KO'}</span>
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

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-2.5">
          {/* If Campaign is fully finished */}
          {isCampaignFinished ? (
            <>
              {/* Play Again (Restart Campaign from Stage 1, leaving current stage behind) */}
              <button
                onClick={() => {
                  sound.playPunch(2);
                  onReplayCampaign?.();
                }}
                className="w-full py-3.5 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-arcade text-xs sm:text-sm rounded-xl shadow-lg border-2 border-green-300 flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer animate-pulse"
              >
                <Sparkles size={18} />
                <span>JOGAR NOVAMENTE (REINICIAR CAMPANHA)</span>
              </button>

              {/* Return to Menu */}
              <button
                onClick={() => {
                  sound.playPunch(1);
                  onReturnToMenu?.();
                }}
                className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-amber-300 font-arcade text-xs sm:text-sm rounded-xl border border-amber-400/60 flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer shadow"
              >
                <Home size={17} />
                <span>VOLTAR AO MENU PRINCIPAL</span>
              </button>

              {/* Replay this stage */}
              <button
                onClick={() => {
                  sound.playPunch(1);
                  onRestart();
                }}
                className="w-full py-2 text-slate-400 hover:text-white font-sans text-xs underline cursor-pointer"
              >
                Repetir Apenas Esta Fase (Orange Town)
              </button>
            </>
          ) : (
            <>
              {/* Normal stage progression */}
              {canProceed && (
                <button
                  onClick={() => {
                    sound.playPunch(2);
                    onProceedNextStage?.();
                  }}
                  className="w-full py-3.5 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-arcade text-xs sm:text-sm rounded-xl shadow-lg border-2 border-green-300 flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer animate-pulse"
                >
                  <Award size={18} />
                  <span>
                    {isAlvidaStage
                      ? 'AVANÇAR: SAGA DO ZORO (SHELLS TOWN) ▶'
                      : isMorganStage
                      ? 'AVANÇAR: VILA LARANJA (ORANGE TOWN) ▶'
                      : 'PRÓXIMA FASE ▶'}
                  </span>
                </button>
              )}

              {/* Repeat Stage */}
              <button
                onClick={() => {
                  sound.playPunch(2);
                  onRestart();
                }}
                className="w-full py-2.5 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-arcade text-xs rounded-xl shadow border border-amber-300 flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
              >
                <RotateCcw size={16} />
                <span>REPETIR FASE</span>
              </button>

              {/* Return to Menu */}
              {onReturnToMenu && (
                <button
                  onClick={() => {
                    sound.playPunch(1);
                    onReturnToMenu();
                  }}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-amber-200 font-arcade text-xs rounded-xl border border-slate-700 flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
                >
                  <Home size={15} />
                  <span>VOLTAR AO MENU</span>
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
