import React, { useState, useEffect } from 'react';
import { X, Trophy, CheckCircle2, Lock } from 'lucide-react';
import { Achievement, achievements } from '../game/achievements';

interface AchievementsModalProps {
  onClose: () => void;
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({ onClose }) => {
  const [items, setItems] = useState<Achievement[]>([]);

  useEffect(() => {
    setItems(achievements.getAchievements());
  }, []);

  const unlockedCount = items.filter((i) => i.unlocked).length;
  const progressPercent = Math.round((unlockedCount / items.length) * 100);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border-2 border-amber-500/80 rounded-2xl shadow-[0_0_50px_rgba(245,158,11,0.2)] overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-amber-500/30 bg-slate-900/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Trophy size={18} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white font-sans">
                Conquistas de East Blue
              </h2>
              <div className="flex items-center gap-2 text-xs text-amber-400 font-mono">
                <span>{unlockedCount} de {items.length} Desbloqueadas</span>
                <span className="text-slate-500">·</span>
                <span>{progressPercent}%</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-950 h-2 px-5 py-0.5">
          <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Achievements List */}
        <div className="p-4 overflow-y-auto space-y-2.5 flex-1 divide-y divide-slate-800/40">
          {items.map((item) => (
            <div
              key={item.id}
              className={`pt-2.5 first:pt-0 flex items-center gap-3 p-2.5 rounded-xl transition-all ${
                item.unlocked
                  ? 'bg-amber-950/20 border border-amber-500/30'
                  : 'bg-slate-900/30 border border-slate-800/60 opacity-60'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 shadow-inner ${
                  item.unlocked
                    ? 'bg-gradient-to-br from-amber-500/30 to-yellow-600/30 border border-amber-400/50'
                    : 'bg-slate-800 border border-slate-700 text-slate-500'
                }`}
              >
                {item.unlocked ? item.icon : <Lock size={20} className="text-slate-600" />}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-bold truncate ${item.unlocked ? 'text-amber-300' : 'text-slate-400'}`}>
                    {item.title}
                  </span>
                  {item.unlocked && (
                    <span className="text-[11px] text-emerald-400 flex items-center gap-1 shrink-0 font-medium">
                      <CheckCircle2 size={13} />
                      Concluído
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-0.5 leading-snug">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold uppercase tracking-wider text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-md active:scale-95 transition-all"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
