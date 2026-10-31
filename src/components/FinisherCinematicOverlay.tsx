import React from 'react';
import { FinisherCinematicData } from '../game/types';

interface FinisherCinematicOverlayProps {
  cinematicData: FinisherCinematicData | null;
}

export const FinisherCinematicOverlay: React.FC<FinisherCinematicOverlayProps> = ({
  cinematicData,
}) => {
  if (!cinematicData) return null;

  const isZoro = cinematicData.character === 'ZORO';

  return (
    <div className="absolute inset-0 z-50 pointer-events-none flex items-center justify-center overflow-hidden animate-in fade-in zoom-in-95 duration-100">
      {/* Darkened Cinematic Shutter Backdrop with Action Lines */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" />

      {/* Extreme Radial Speed Lines */}
      <div
        className="absolute inset-0 opacity-40 mix-blend-screen"
        style={{
          backgroundImage: isZoro
            ? 'repeating-conic-gradient(from 0deg, rgba(34,197,94,0.3) 0deg 3deg, transparent 3deg 8deg)'
            : 'repeating-conic-gradient(from 0deg, rgba(239,68,68,0.35) 0deg 3deg, transparent 3deg 8deg)',
        }}
      />

      {/* Diagonal Anime Eye-Cut-In Banner */}
      <div
        className={`relative w-full h-36 sm:h-44 border-y-4 border-black shadow-[0_0_50px_rgba(0,0,0,0.9)] flex items-center justify-between px-4 sm:px-12 -rotate-1 transform transition-all ${
          isZoro
            ? 'bg-gradient-to-r from-emerald-950 via-green-800 to-slate-950'
            : 'bg-gradient-to-r from-red-950 via-rose-700 to-amber-950'
        }`}
      >
        {/* Accent Edge Flares */}
        <div
          className={`absolute inset-x-0 top-0 h-1 ${
            isZoro ? 'bg-gradient-to-r from-transparent via-emerald-300 to-transparent' : 'bg-gradient-to-r from-transparent via-yellow-300 to-transparent'
          }`}
        />
        <div
          className={`absolute inset-x-0 bottom-0 h-1 ${
            isZoro ? 'bg-gradient-to-r from-transparent via-teal-400 to-transparent' : 'bg-gradient-to-r from-transparent via-red-400 to-transparent'
          }`}
        />

        {/* Left: Intense Anime Eyes Graphic Banner */}
        <div className="flex items-center gap-4 sm:gap-6 z-10">
          <div className="w-24 h-24 sm:w-32 sm:h-32 border-3 border-black bg-black flex items-center justify-center overflow-hidden shadow-2xl relative rotate-2">
            {isZoro ? (
              // Zoro Demon Aura Eye-Cut-In
              <svg viewBox="0 0 120 100" className="w-full h-full">
                <rect width="120" height="100" fill="#0f281e" />
                {/* Bandana */}
                <path d="M 0 0 L 120 0 L 120 45 L 0 45 Z" fill="#1b263b" />
                {/* Face & Fierce Eyes */}
                <rect y="40" width="120" height="60" fill="#f2d7b5" />
                {/* Demon Eye Slit */}
                <path d="M 15 50 L 55 56" stroke="#000000" strokeWidth="4" />
                <path d="M 105 50 L 65 56" stroke="#000000" strokeWidth="4" />
                <polygon points="25,54 48,58 46,64 25,62" fill="#000000" />
                <polygon points="95,54 72,58 74,64 95,62" fill="#000000" />
                {/* Glowing Green Demon Iris */}
                <circle cx="37" cy="58" r="4.5" fill="#4ade80" />
                <circle cx="83" cy="58" r="4.5" fill="#4ade80" />
                <circle cx="37" cy="58" r="2" fill="#ffffff" />
                <circle cx="83" cy="58" r="2" fill="#ffffff" />
                {/* Clenched Teeth & Katana in mouth */}
                <rect x="10" y="76" width="100" height="14" fill="#ffffff" stroke="#000000" strokeWidth="2.5" />
                <line x1="30" y1="76" x2="30" y2="90" stroke="#000000" strokeWidth="1.5" />
                <line x1="60" y1="76" x2="60" y2="90" stroke="#000000" strokeWidth="1.5" />
                <line x1="90" y1="76" x2="90" y2="90" stroke="#000000" strokeWidth="1.5" />
                {/* Demon aura smoke streaks */}
                <path d="M 37 54 Q 30 30 15 20" stroke="#22c55e" strokeWidth="2.5" fill="none" opacity="0.8" />
                <path d="M 83 54 Q 90 30 105 20" stroke="#22c55e" strokeWidth="2.5" fill="none" opacity="0.8" />
              </svg>
            ) : (
              // Luffy Fierce Battle Gaze Eye-Cut-In
              <svg viewBox="0 0 120 100" className="w-full h-full">
                <rect width="120" height="100" fill="#3a0007" />
                {/* Straw Hat Brim Shadow */}
                <path d="M 0 0 L 120 0 L 120 38 L 0 38 Z" fill="#c49000" />
                <path d="M 0 30 L 120 30 L 120 40 L 0 40 Z" fill="#9d0208" />
                {/* Deep Eye Shadow */}
                <rect y="38" width="120" height="20" fill="#4a0404" opacity="0.6" />
                {/* Face */}
                <rect y="40" width="120" height="60" fill="#ffe5c4" />
                {/* Fierce Angry Eyes */}
                <path d="M 18 52 L 52 57" stroke="#000000" strokeWidth="4.5" strokeLinecap="round" />
                <path d="M 102 52 L 68 57" stroke="#000000" strokeWidth="4.5" strokeLinecap="round" />
                <ellipse cx="36" cy="62" rx="6" ry="7.5" fill="#000000" />
                <ellipse cx="84" cy="62" rx="6" ry="7.5" fill="#000000" />
                <circle cx="34" cy="59" r="2.5" fill="#ffffff" />
                <circle cx="82" cy="59" r="2.5" fill="#ffffff" />
                {/* Under Eye Scar with Stitches */}
                <path d="M 30 72 Q 36 75 42 73" stroke="#000000" strokeWidth="2.5" fill="none" />
                <line x1="33" y1="70" x2="33" y2="76" stroke="#000000" strokeWidth="2" />
                <line x1="38" y1="70" x2="38" y2="76" stroke="#000000" strokeWidth="2" />
                {/* Steaming Clenched Teeth */}
                <path d="M 35 84 Q 60 88 85 84 Z" fill="#ffffff" stroke="#000000" strokeWidth="2.5" />
              </svg>
            )}
          </div>

          {/* Move Typography & Japanese Calligraphy */}
          <div className="flex flex-col">
            <span
              className={`font-arcade text-xs sm:text-sm tracking-widest uppercase font-black ${
                isZoro ? 'text-emerald-300' : 'text-amber-300'
              }`}
            >
              ★ {cinematicData.subTitle} ★
            </span>
            <h1 className="font-arcade text-xl sm:text-3xl md:text-4xl text-white font-black tracking-wider drop-shadow-[0_4px_8px_rgba(0,0,0,1)] uppercase">
              {cinematicData.moveName}
            </h1>
            <span
              className={`font-mono text-sm sm:text-base font-extrabold tracking-widest mt-0.5 ${
                isZoro ? 'text-teal-200' : 'text-yellow-200'
              }`}
            >
              {cinematicData.japaneseTitle}
            </span>
          </div>
        </div>

        {/* Right: Giant Japanese Onomatopoeia Stamp (BAAAAN!! / DON!!) */}
        <div className="hidden sm:flex flex-col items-end z-10">
          <span className="font-arcade text-4xl sm:text-5xl text-yellow-300 font-black tracking-widest drop-shadow-[0_4px_12px_rgba(0,0,0,1)] -rotate-3">
            {isZoro ? 'どどんっ!!' : 'バァァン!!'}
          </span>
          <span className="bg-black text-white font-arcade text-xs px-2 py-0.5 border border-white/20 mt-1 uppercase tracking-wider">
            COMBO FINISHER!
          </span>
        </div>
      </div>
    </div>
  );
};
