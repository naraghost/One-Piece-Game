import React, { useEffect, useState } from 'react';
import { Achievement, achievements } from '../game/achievements';
import { sound } from '../game/audio';

export const AchievementToast: React.FC = () => {
  const [current, setCurrent] = useState<Achievement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = achievements.onUnlock((ach) => {
      setCurrent(ach);
      setIsVisible(true);
      // Play retro fanfare sound / chime
      sound.playPowerup();
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        try {
          navigator.vibrate([60, 40, 80]);
        } catch {
          // ignore
        }
      }

      // Hide after 4 seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 4000);

      return () => clearTimeout(timer);
    });

    return unsubscribe;
  }, []);

  if (!current || !isVisible) return null;

  return (
    <div className="fixed top-16 sm:top-20 left-1/2 -translate-x-1/2 z-50 pointer-events-none transition-all duration-300 transform animate-bounce">
      <div className="flex items-center gap-3 bg-gradient-to-r from-amber-950 via-slate-900 to-amber-950 border-2 border-amber-400 rounded-xl px-4 py-2.5 shadow-[0_10px_30px_rgba(0,0,0,0.8)] border-b-4 border-b-amber-600 min-w-[280px] max-w-sm">
        {/* Shiny Icon Box */}
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-400 to-yellow-600 border border-amber-200 flex items-center justify-center text-2xl shadow shrink-0">
          {current.icon}
        </div>

        {/* Text Details */}
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] uppercase font-black tracking-wider text-amber-400 font-mono">
              ★ CONQUISTA DESBLOQUEADA!
            </span>
          </div>
          <span className="text-sm font-bold text-white drop-shadow font-sans">
            {current.title}
          </span>
          <span className="text-xs text-amber-200/80 leading-tight">
            {current.description}
          </span>
        </div>
      </div>
    </div>
  );
};
