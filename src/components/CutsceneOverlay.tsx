import React, { useState } from 'react';
import { DialogueMessage } from '../game/types';
import { sound } from '../game/audio';
import { BookOpen, FastForward, ChevronRight, Sparkles } from 'lucide-react';

interface CutsceneOverlayProps {
  dialogues: DialogueMessage[];
  onComplete: () => void;
}

// ==========================================
// BESPOKE MANGA CHARACTER PORTRAITS (SVG)
// ==========================================

const MangaLuffyPortrait: React.FC<{ expression?: string }> = ({ expression }) => (
  <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow">
    {/* Manga Speed/Action rays behind head */}
    <g stroke="#000000" strokeWidth="1.5" opacity="0.15">
      <line x1="10" y1="10" x2="35" y2="35" />
      <line x1="90" y1="10" x2="65" y2="35" />
      <line x1="5" y1="50" x2="30" y2="50" />
      <line x1="95" y1="50" x2="70" y2="50" />
    </g>

    {/* Neck & Red Vest Collar */}
    <path d="M 40 82 L 40 98 L 60 98 L 60 82 Z" fill="#ffdfba" stroke="#000000" strokeWidth="2.5" />
    <path d="M 32 90 L 40 82 L 40 98 L 26 100 Z" fill="#d90429" stroke="#000000" strokeWidth="2.5" />
    <path d="M 68 90 L 60 82 L 60 98 L 74 100 Z" fill="#d90429" stroke="#000000" strokeWidth="2.5" />

    {/* Luffy Face Contour */}
    <path
      d="M 28 42 C 28 66 38 82 50 82 C 62 82 72 66 72 42 Z"
      fill="#ffe5c4"
      stroke="#000000"
      strokeWidth="2.8"
      strokeLinejoin="round"
    />
    {/* Ears */}
    <path d="M 26 48 C 22 48 22 60 28 62" fill="#ffe5c4" stroke="#000000" strokeWidth="2.5" />
    <path d="M 74 48 C 78 48 78 60 72 62" fill="#ffe5c4" stroke="#000000" strokeWidth="2.5" />

    {/* Spiky Black Anime Hair */}
    <path
      d="M 26 40 L 22 48 L 28 48 L 23 58 L 30 54 L 27 34 L 36 28 L 44 26 L 52 26 L 62 28 L 72 34 L 70 54 L 76 58 L 71 48 L 77 48 L 73 40 Z"
      fill="#111111"
      stroke="#000000"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />

    {/* Eyes & Eyebrows */}
    <ellipse cx="40" cy="50" rx="4" ry="4.5" fill="#000000" />
    <ellipse cx="60" cy="50" rx="4" ry="4.5" fill="#000000" />
    <circle cx="39" cy="48" r="1.2" fill="#ffffff" />
    <circle cx="59" cy="48" r="1.2" fill="#ffffff" />
    {/* Eyebrows */}
    <path d="M 34 43 Q 40 40 45 44" stroke="#000000" strokeWidth="3" fill="none" strokeLinecap="round" />
    <path d="M 66 43 Q 60 40 55 44" stroke="#000000" strokeWidth="3" fill="none" strokeLinecap="round" />

    {/* Iconic Under-Eye Scar with 2 Stitches */}
    <path d="M 37 57 Q 40 60 44 59" stroke="#000000" strokeWidth="2.5" fill="none" />
    <line x1="39" y1="56" x2="39" y2="61" stroke="#000000" strokeWidth="2" />
    <line x1="42" y1="56" x2="42" y2="61" stroke="#000000" strokeWidth="2" />

    {/* Nose */}
    <path d="M 50 52 L 48 57 L 51 57" stroke="#000000" strokeWidth="2" fill="none" />

    {/* Famous Toothy Grin */}
    <path
      d="M 34 64 Q 50 78 66 64 Z"
      fill="#ffffff"
      stroke="#000000"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
    <line x1="50" y1="64" x2="50" y2="73" stroke="#000000" strokeWidth="1.5" />
    <line x1="42" y1="65" x2="42" y2="71" stroke="#000000" strokeWidth="1.5" />
    <line x1="58" y1="65" x2="58" y2="71" stroke="#000000" strokeWidth="1.5" />

    {/* Iconic Straw Hat & Red Ribbon */}
    <ellipse cx="50" cy="32" rx="44" ry="11" fill="#f4c430" stroke="#000000" strokeWidth="2.8" />
    <path d="M 26 31 C 26 14 36 10 50 10 C 64 10 74 14 74 31 Z" fill="#f4c430" stroke="#000000" strokeWidth="2.8" />
    {/* Red Ribbon */}
    <path d="M 27 28 C 34 25 66 25 73 28 L 74 33 C 66 30 34 30 26 33 Z" fill="#d90429" stroke="#000000" strokeWidth="2" />
  </svg>
);

const MangaZoroPortrait: React.FC<{ expression?: string }> = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow">
    {/* Inked Action Crosshatch */}
    <g stroke="#000000" strokeWidth="1" opacity="0.15">
      <line x1="0" y1="80" x2="25" y2="95" />
      <line x1="0" y1="70" x2="35" y2="95" />
      <line x1="100" y1="80" x2="75" y2="95" />
    </g>

    {/* Muscular Neck & Dark Green Haramaki */}
    <path d="M 36 80 L 36 98 L 64 98 L 64 80 Z" fill="#eed2b0" stroke="#000000" strokeWidth="2.5" />
    <path d="M 28 92 L 36 82 L 64 82 L 72 92 L 72 100 L 28 100 Z" fill="#2d6a4f" stroke="#000000" strokeWidth="2.5" />

    {/* Zoro Face & Jawline */}
    <path
      d="M 26 38 C 26 64 36 80 50 82 C 64 80 74 64 74 38 Z"
      fill="#f2d7b5"
      stroke="#000000"
      strokeWidth="2.8"
    />

    {/* Zoro 3 Golden Hoop Earrings (Left Ear) */}
    <circle cx="23" cy="54" r="3" fill="none" stroke="#e09f3e" strokeWidth="2.2" />
    <circle cx="21" cy="59" r="3" fill="none" stroke="#e09f3e" strokeWidth="2.2" />
    <circle cx="23" cy="64" r="3" fill="none" stroke="#e09f3e" strokeWidth="2.2" />

    {/* Green Crew Cut Hair */}
    <path
      d="M 24 38 L 22 26 L 30 20 L 38 15 L 50 14 L 62 15 L 70 20 L 78 26 L 76 38 L 72 34 L 66 32 L 50 32 L 34 32 L 28 34 Z"
      fill="#40916c"
      stroke="#000000"
      strokeWidth="2.5"
    />

    {/* Zoro Dark Bandana Wrapped */}
    <path d="M 24 32 Q 50 28 76 32 L 75 40 Q 50 36 25 40 Z" fill="#1b263b" stroke="#000000" strokeWidth="2.5" />

    {/* Fierce Narrow Eyes & Furrowed Brow */}
    <path d="M 33 46 L 45 49" stroke="#000000" strokeWidth="3.5" strokeLinecap="round" />
    <path d="M 67 46 L 55 49" stroke="#000000" strokeWidth="3.5" strokeLinecap="round" />
    {/* Zoro Eyes with glint */}
    <polygon points="36,49 44,51 43,54 36,53" fill="#000000" />
    <polygon points="64,49 56,51 57,54 64,53" fill="#000000" />
    <circle cx="40" cy="51" r="1" fill="#ffffff" />
    <circle cx="60" cy="51" r="1" fill="#ffffff" />

    {/* Sharp Nose */}
    <path d="M 50 52 L 47 61 L 52 61" stroke="#000000" strokeWidth="2.2" fill="none" />

    {/* Determined Smirk with Katana Glint */}
    <path d="M 37 69 Q 50 72 63 67" stroke="#000000" strokeWidth="3" fill="none" strokeLinecap="round" />
    {/* Clenched Teeth */}
    <path d="M 42 69 L 58 68" stroke="#000000" strokeWidth="1.5" />

    {/* Wado Ichimonji White Katana Tsuka (Hilt) in mouth / behind shoulder */}
    <g transform="translate(48, 66) rotate(-14)">
      <rect x="-35" y="-5" width="70" height="9" fill="#f8f9fa" stroke="#000000" strokeWidth="2" rx="2" />
      <circle cx="-35" cy="-0.5" r="4.5" fill="#ffd166" stroke="#000000" strokeWidth="1.5" />
      <line x1="-25" y1="-5" x2="-20" y2="4" stroke="#000000" strokeWidth="1.5" />
      <line x1="-15" y1="-5" x2="-10" y2="4" stroke="#000000" strokeWidth="1.5" />
      <line x1="10" y1="-5" x2="15" y2="4" stroke="#000000" strokeWidth="1.5" />
      <line x1="20" y1="-5" x2="25" y2="4" stroke="#000000" strokeWidth="1.5" />
    </g>
  </svg>
);

const MangaCobyPortrait: React.FC = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow">
    {/* Round terrified face */}
    <ellipse cx="50" cy="55" rx="24" ry="24" fill="#ffe5d9" stroke="#000000" strokeWidth="2.5" />
    {/* Pink Center-Parted Hair */}
    <path
      d="M 26 50 C 24 30 35 18 50 18 C 65 18 76 30 74 50 L 68 44 C 62 28 54 26 50 34 C 46 26 38 28 32 44 Z"
      fill="#f72585"
      stroke="#000000"
      strokeWidth="2.5"
    />
    {/* Round Glasses */}
    <circle cx="41" cy="52" r="9" fill="rgba(255,255,255,0.7)" stroke="#000000" strokeWidth="2.5" />
    <circle cx="59" cy="52" r="9" fill="rgba(255,255,255,0.7)" stroke="#000000" strokeWidth="2.5" />
    <line x1="50" y1="52" x2="50" y2="52" stroke="#000000" strokeWidth="3" />
    {/* Big scared eyes */}
    <circle cx="41" cy="52" r="3.5" fill="#000000" />
    <circle cx="59" cy="52" r="3.5" fill="#000000" />
    <circle cx="40" cy="50" r="1.2" fill="#ffffff" />
    <circle cx="58" cy="50" r="1.2" fill="#ffffff" />
    {/* Trembling mouth */}
    <path d="M 44 68 Q 47 66 50 68 Q 53 70 56 68" stroke="#000000" strokeWidth="2" fill="none" />
    {/* Big Anime Sweat Drop */}
    <path d="M 68 40 C 68 40 73 45 73 48 C 73 50 71 52 68 52 C 65 52 63 50 63 48 C 63 45 68 40 68 40 Z" fill="#00b4d8" stroke="#000000" strokeWidth="1.5" />
  </svg>
);

const MangaAlvidaPortrait: React.FC = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow">
    {/* Voluminous Curly Black Hair */}
    <ellipse cx="50" cy="45" rx="36" ry="34" fill="#1b1b1e" stroke="#000000" strokeWidth="2.5" />
    {/* Broad Angry Face */}
    <ellipse cx="50" cy="56" rx="26" ry="24" fill="#ffccd5" stroke="#000000" strokeWidth="2.5" />
    {/* Freckles */}
    <circle cx="36" cy="58" r="1" fill="#7209b7" />
    <circle cx="40" cy="60" r="1" fill="#7209b7" />
    <circle cx="64" cy="58" r="1" fill="#7209b7" />
    <circle cx="60" cy="60" r="1" fill="#7209b7" />
    {/* Angry Eyes */}
    <path d="M 36 48 L 46 51" stroke="#000000" strokeWidth="3" />
    <path d="M 64 48 L 54 51" stroke="#000000" strokeWidth="3" />
    <circle cx="42" cy="53" r="3" fill="#000000" />
    <circle cx="58" cy="53" r="3" fill="#000000" />
    {/* Snarl Mouth with Lipstick */}
    <path d="M 38 67 Q 50 75 62 67 Z" fill="#9d0208" stroke="#000000" strokeWidth="2" />
    {/* Pirate Hat with Pink Feather & Heart */}
    <path d="M 22 28 Q 50 18 78 28 L 74 36 Q 50 26 26 36 Z" fill="#3a0ca3" stroke="#000000" strokeWidth="2" />
    <path d="M 46 25 C 46 22 43 20 40 20 C 37 20 35 22 35 25 C 35 29 46 34 46 34 C 46 34 57 29 57 25 C 57 22 55 20 52 20 C 49 20 46 22 46 25 Z" fill="#ff70a6" />
    {/* Spiked Club silhouette */}
    <rect x="76" y="28" width="9" height="50" rx="3" fill="#111111" stroke="#ffd166" strokeWidth="1.5" />
    <circle cx="80.5" cy="38" r="2" fill="#ffd166" />
    <circle cx="80.5" cy="52" r="2" fill="#ffd166" />
  </svg>
);

const MangaMorganPortrait: React.FC = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow">
    {/* Broad Shoulders & Marine Coat */}
    <path d="M 15 88 L 30 76 L 70 76 L 85 88 L 85 100 L 15 100 Z" fill="#f8f9fa" stroke="#000000" strokeWidth="2.5" />
    <rect x="24" y="78" width="14" height="6" fill="#ffd166" stroke="#000000" strokeWidth="1.5" />
    <rect x="62" y="78" width="14" height="6" fill="#ffd166" stroke="#000000" strokeWidth="1.5" />

    {/* Head & Blonde Military Buzzcut */}
    <path d="M 30 42 C 30 24 38 18 50 18 C 62 18 70 24 70 42 Z" fill="#ffe5b4" stroke="#000000" strokeWidth="2.5" />
    <path d="M 28 34 L 50 16 L 72 34 L 70 40 L 30 40 Z" fill="#fcd34d" stroke="#000000" strokeWidth="2" />

    {/* Cold Steel/Glint Eyes with Brow */}
    <path d="M 35 44 L 46 47" stroke="#000000" strokeWidth="3" />
    <path d="M 65 44 L 54 47" stroke="#000000" strokeWidth="3" />
    <polygon points="38,47 45,48 44,51 38,50" fill="#000000" />
    <polygon points="62,47 55,48 56,51 62,50" fill="#000000" />
    {/* Red Glint in right eye */}
    <circle cx="41" cy="49" r="1.2" fill="#ff0055" />

    {/* Iconic Metallic Steel Jaw Plate */}
    <path
      d="M 28 56 L 34 82 L 66 82 L 72 56 L 64 54 L 50 58 L 36 54 Z"
      fill="#adb5bd"
      stroke="#000000"
      strokeWidth="2.5"
    />
    {/* Heavy Rivets on Steel Jaw */}
    <circle cx="34" cy="62" r="1.8" fill="#111111" />
    <circle cx="44" cy="65" r="1.8" fill="#111111" />
    <circle cx="56" cy="65" r="1.8" fill="#111111" />
    <circle cx="66" cy="62" r="1.8" fill="#111111" />
    <line x1="50" y1="58" x2="50" y2="82" stroke="#495057" strokeWidth="2" />
  </svg>
);

const MangaGenericPortrait: React.FC<{ type: string }> = ({ type }) => (
  <div className="w-full h-full flex flex-col items-center justify-center text-4xl bg-gradient-to-b from-slate-200 to-slate-400">
    {type === 'pirate' && '🏴‍☠️'}
    {type === 'marine' && '⚓'}
    {type === 'helmeppo' && '👔'}
    {type === 'narrator' && '📜'}
  </div>
);

export const CutsceneOverlay: React.FC<CutsceneOverlayProps> = ({
  dialogues,
  onComplete,
}) => {
  const [index, setIndex] = useState(0);

  const current = dialogues[index];

  const handleNext = () => {
    sound.playPunch(1);
    if (index < dialogues.length - 1) {
      setIndex(index + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    sound.playPunch(2);
    onComplete();
  };

  if (!current) return null;

  // Determine Manga Onomatopoeia text and style
  const getMangaSFX = () => {
    if (current.sfx) return current.sfx;
    if (current.scene === 'barrel_burst') return 'KABOOOM!!';
    if (current.speaker === 'Luffy') return 'DON!! どんっ';
    if (current.speaker === 'Zoro') return 'SHING!! ズバッ';
    if (current.speaker === 'Alvida' || current.speaker === 'Morgan') return 'DODON!! どどんっ';
    if (current.scene === 'whirlpool') return 'ZUUUM!!';
    return 'DON!! どん';
  };

  const isShout = current.text.includes('!!') || current.text.includes('?!') || current.speaker === 'Alvida' || current.speaker === 'Luffy';

  return (
    <div
      onClick={handleNext}
      className="absolute inset-0 z-[60] bg-black/90 backdrop-blur-md flex flex-col justify-between p-3 sm:p-6 cursor-pointer select-none overflow-hidden"
    >
      {/* Halftone / Manga Screentone Texture Effect */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
          backgroundSize: '12px 12px',
        }}
      />

      {/* Top Header Manga Chapter Banner */}
      <div className="w-full flex items-center justify-between z-10 max-w-4xl mx-auto pt-1 sm:pt-2">
        <div className="flex items-center gap-2 bg-white text-black font-arcade text-xs sm:text-sm font-black px-4 py-1.5 rounded-none shadow-[4px_4px_0px_#000000] border-3 border-black uppercase tracking-wider">
          <BookOpen size={16} className="text-red-600" />
          <span>{current.title || 'ONE PIECE: MANGÁ ARCADE'}</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-neutral-900 border-2 border-neutral-700 text-amber-300 font-mono text-xs px-3 py-1 shadow">
            QUADRO {index + 1} / {dialogues.length}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleSkip();
            }}
            className="flex items-center gap-1.5 text-xs text-neutral-300 hover:text-white bg-black/80 px-3 py-1.5 border-2 border-neutral-600 shadow-[3px_3px_0px_#404040] transition-colors cursor-pointer"
          >
            <FastForward size={14} />
            <span>PULAR</span>
          </button>
        </div>
      </div>

      {/* Main Manga Comic Page Stage */}
      <div className="w-full max-w-4xl mx-auto flex-1 my-2 sm:my-4 flex flex-col justify-center relative">
        <div className="w-full bg-[#fdfbf7] border-4 border-black shadow-[8px_8px_0px_rgba(0,0,0,0.8)] p-3 sm:p-5 relative flex flex-col gap-3">
          
          {/* Manga Corner Stamp */}
          <div className="absolute top-2 right-2 text-[9px] font-mono text-neutral-400 font-bold">
            週刊少年ジャンプ · SHONEN JUMP STYLE
          </div>

          {/* Top Panel: Dynamic Manga Action Scene / Screentone Art */}
          <div className="w-full h-36 sm:h-52 bg-neutral-950 border-3 border-black relative overflow-hidden flex items-center justify-center shadow-inner">
            
            {/* Manga Action Speed Lines Background */}
            <div className="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neutral-800 via-black to-black" />

            {/* Giant Japanese Manga Onomatopoeia (DON!! どんっ) */}
            <div className="absolute -top-1 left-3 sm:left-6 font-arcade text-3xl sm:text-6xl text-amber-300/85 -rotate-6 tracking-widest drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)] z-0 select-none">
              {getMangaSFX()}
            </div>

            {/* Animated Scene Representation */}
            <div className="relative z-10 flex items-center justify-around w-full px-6">
              {current.scene === 'whirlpool' && (
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-full border-4 border-dashed border-cyan-400 animate-spin" />
                  <div className="text-4xl animate-bounce">🌊 ⛵ 🌊</div>
                  <span className="font-arcade text-lg sm:text-2xl text-yellow-300 bg-black/70 px-3 py-1 border border-yellow-400">
                    GRANDE REDEMOINHO!
                  </span>
                </div>
              )}

              {current.scene === 'barrel_sea' && (
                <div className="flex items-center gap-6">
                  <div className="text-5xl animate-bounce">🛢️</div>
                  <div className="flex flex-col text-left">
                    <span className="font-arcade text-lg sm:text-2xl text-cyan-300">À DERIVA NO MAR</span>
                    <span className="text-xs text-neutral-300">O barril flutua nas águas de East Blue...</span>
                  </div>
                </div>
              )}

              {current.scene === 'barrel_fish' && (
                <div className="flex items-center gap-6">
                  <div className="text-5xl">🎣 🛢️</div>
                  <span className="font-arcade text-lg sm:text-2xl text-amber-300 bg-red-950 px-3 py-1 border border-amber-400">
                    PESCADO PELO MISS LOVE DUCK!
                  </span>
                </div>
              )}

              {current.scene === 'galley' && (
                <div className="flex items-center gap-6">
                  <div className="text-5xl">🍞 🍎 🍖</div>
                  <span className="font-arcade text-lg sm:text-2xl text-emerald-400">
                    DESPENSA DO NAVIO
                  </span>
                </div>
              )}

              {current.scene === 'barrel_burst' && (
                <div className="flex flex-col items-center animate-bounce">
                  <div className="font-arcade text-3xl sm:text-6xl text-red-500 font-black tracking-wider bg-yellow-300 px-6 py-2 border-4 border-black -rotate-3 shadow-[6px_6px_0px_#000000]">
                    KABOOOOM!! 💥
                  </div>
                  <span className="font-arcade text-xs sm:text-sm text-black bg-white px-3 py-0.5 mt-2 border-2 border-black font-bold">
                    LUFFY DESPERTA DO BARRIL!
                  </span>
                </div>
              )}

              {current.scene === 'deck' && (
                <div className="flex items-center gap-6">
                  <div className="text-5xl">☀️ ⚓ ⚔️</div>
                  <span className="font-arcade text-lg sm:text-2xl text-amber-300">
                    CONVÉS PRINCIPAL SOB O SOL
                  </span>
                </div>
              )}

              {current.scene === 'alvida_intro' && (
                <div className="flex items-center gap-8">
                  <div className="flex flex-col items-center">
                    <span className="text-4xl sm:text-5xl">👑 🔨</span>
                    <span className="font-arcade text-xs text-rose-400 mt-1">CAPITÃ ALVIDA</span>
                  </div>
                  <span className="font-arcade text-xl sm:text-3xl text-yellow-300 font-black animate-pulse">
                    VS
                  </span>
                  <div className="flex flex-col items-center">
                    <span className="text-4xl sm:text-5xl">👒 🥊</span>
                    <span className="font-arcade text-xs text-amber-300 mt-1">MONKEY D. LUFFY</span>
                  </div>
                </div>
              )}

              {(current.scene === 'marine_courtyard' || current.scene === 'zoro_bound') && (
                <div className="flex items-center gap-8">
                  <div className="flex flex-col items-center">
                    <div className="text-4xl sm:text-5xl">🏛️ ⚓</div>
                    <span className="font-arcade text-xs text-blue-300 mt-1">SHELLS TOWN</span>
                  </div>
                  <div className="flex flex-col items-center p-2 bg-emerald-950/80 border-2 border-emerald-400 rounded-none">
                    <span className="text-4xl">🗡️ ⛓️</span>
                    <span className="font-arcade text-xs text-emerald-300 font-bold">ZORO PRESO NA CRUZ</span>
                  </div>
                </div>
              )}

              {current.scene === 'morgan_tower' && (
                <div className="flex items-center gap-6">
                  <div className="text-5xl animate-bounce">🗡️ 🗡️ 🗡️</div>
                  <span className="font-arcade text-lg sm:text-2xl text-yellow-300 bg-black/80 px-4 py-1.5 border-2 border-yellow-400">
                    RESGATE DAS TRÊS KATANAS!!
                  </span>
                </div>
              )}

              {current.scene === 'zoro_freed' && (
                <div className="flex items-center gap-6">
                  <div className="text-5xl animate-pulse">⚡ 🗡️ ⚡</div>
                  <div className="flex flex-col">
                    <span className="font-arcade text-xl sm:text-3xl text-emerald-400 font-black">
                      SANTORYU DESPERTO!
                    </span>
                    <span className="text-xs text-white">Zoro empunha suas 3 espadas e corta as cordas!</span>
                  </div>
                </div>
              )}

              {current.scene === 'morgan_boss' && (
                <div className="flex items-center gap-8">
                  <div className="flex flex-col items-center">
                    <span className="text-5xl">🪓 🎖️</span>
                    <span className="font-arcade text-xs text-red-400 mt-1">CAPITÃO MORGAN</span>
                  </div>
                  <span className="font-arcade text-2xl sm:text-4xl text-rose-500 font-black animate-pulse">
                    DUELO FINAL
                  </span>
                  <div className="flex flex-col items-center">
                    <span className="text-5xl">🗡️ 🟢</span>
                    <span className="font-arcade text-xs text-emerald-400 mt-1">RORONOA ZORO</span>
                  </div>
                </div>
              )}

              {current.scene === 'victory' && (
                <div className="flex flex-col items-center">
                  <div className="text-5xl animate-bounce">🏆 ⭐ 👒</div>
                  <span className="font-arcade text-xl sm:text-3xl text-yellow-300 bg-red-600 px-6 py-1.5 border-3 border-black shadow-[4px_4px_0px_#000000] mt-1">
                    VITÓRIA COMPLETA!!
                  </span>
                </div>
              )}

              {!current.scene && (
                <div className="text-4xl text-white font-arcade">
                  ONE PIECE · BATTLE
                </div>
              )}
            </div>
          </div>

          {/* Bottom Panel: Expressive Manga Character Bust & Speech Bubble */}
          <div className="w-full flex flex-col sm:flex-row items-center sm:items-start gap-4 pt-1">
            
            {/* Character Portrait Framed Box */}
            <div className="shrink-0 flex flex-col items-center gap-1.5">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white border-4 border-black shadow-[4px_4px_0px_#000000] overflow-hidden flex items-center justify-center relative">
                {current.portrait === 'luffy' && <MangaLuffyPortrait />}
                {current.portrait === 'zoro' && <MangaZoroPortrait />}
                {current.portrait === 'coby' && <MangaCobyPortrait />}
                {current.portrait === 'alvida' && <MangaAlvidaPortrait />}
                {current.portrait === 'morgan' && <MangaMorganPortrait />}
                {['pirate', 'marine', 'helmeppo', 'narrator'].includes(current.portrait) && (
                  <MangaGenericPortrait type={current.portrait} />
                )}
              </div>

              {/* Character Name Tag */}
              <div className="bg-black text-white font-arcade text-[10px] sm:text-xs font-bold px-2.5 py-0.5 border border-black uppercase tracking-wider">
                {current.speaker}
              </div>
            </div>

            {/* Manga Speech Balloon with Tail */}
            <div className="flex-1 w-full relative">
              {/* Balloon Body */}
              <div
                className={`relative bg-white text-black border-4 border-black p-4 sm:p-5 shadow-[5px_5px_0px_#000000] ${
                  isShout
                    ? 'border-dashed border-red-600 bg-amber-50/90'
                    : ''
                }`}
              >
                {/* Speech Tail pointing towards the speaker */}
                <div className="hidden sm:block absolute top-6 -left-3 w-0 h-0 border-t-[10px] border-t-transparent border-r-[12px] border-r-black border-b-[10px] border-b-transparent" />
                <div className="hidden sm:block absolute top-6 -left-1.5 w-0 h-0 border-t-[8px] border-t-transparent border-r-[10px] border-r-white border-b-[8px] border-b-transparent z-10" />

                {/* Exclamation indicator */}
                {isShout && (
                  <span className="absolute -top-3.5 right-4 bg-red-600 text-white font-black font-arcade text-[10px] px-2 py-0.5 border border-black shadow">
                    GRITO!!
                  </span>
                )}

                {/* Dialogue Text in Bold Shonen Typography */}
                <p className="text-sm sm:text-base md:text-lg text-black font-bold font-sans leading-relaxed tracking-wide">
                  "{current.text}"
                </p>

                {/* Next Frame / Page Indicator Button */}
                <div className="flex items-center justify-between mt-3 pt-2.5 border-t-2 border-black/10">
                  <span className="text-[11px] font-mono font-semibold text-neutral-500">
                    Toque na tela ou clique em avançar
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNext();
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 hover:brightness-110 text-white font-arcade text-xs font-black rounded-none border-2 border-black shadow-[3px_3px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
                  >
                    <span>{index === dialogues.length - 1 ? 'COMBATE!! 🥊' : 'PRÓXIMO QUADRO'}</span>
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
};
