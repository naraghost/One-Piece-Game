import React, { useRef, useState, useEffect, useCallback } from 'react';
import { GameEngine } from '../game/engine';
import { InputState } from '../game/types';

interface VirtualControlsProps {
  onInputUpdate: (updater: (prev: InputState) => InputState) => void;
  energy: number;
  engine?: GameEngine;
}

// ==========================================
// BESPOKE ARCADE SVG PUNCH & ACTION ICONS
// ==========================================

// Standard Clenched Fist Punch Icon
const FistPunchIcon: React.FC<{ className?: string }> = ({ className = 'w-7 h-7' }) => (
  <svg viewBox="0 0 48 48" className={className} fill="none">
    {/* Impact star rays behind fist */}
    <path d="M 6 16 L 2 13 M 8 6 L 5 2 M 18 4 L 18 0 M 28 6 L 31 2" stroke="#ffeb3b" strokeWidth="2.5" strokeLinecap="round" opacity="0.9" />
    {/* Clenched Fist Body */}
    <path
      d="M 16 42 L 14 30 C 14 26 12 24 16 18 C 18 15 22 14 26 14 C 30 14 34 16 35 20 C 37 19 40 21 41 24 C 42 27 41 30 39 32 L 38 42 Z"
      fill="#ffcca0"
      stroke="#111111"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    {/* 4 Folded Knuckle Fingers */}
    <path d="M 18 16 C 18 12 23 12 23 16 L 23 26" fill="#ffe0bd" stroke="#111111" strokeWidth="2" strokeLinecap="round" />
    <path d="M 23 15 C 23 11 28 11 28 15 L 28 26" fill="#ffe0bd" stroke="#111111" strokeWidth="2" strokeLinecap="round" />
    <path d="M 28 16 C 28 12 33 12 33 16 L 33 26" fill="#ffe0bd" stroke="#111111" strokeWidth="2" strokeLinecap="round" />
    <path d="M 33 18 C 33 14 38 14 38 18 L 38 27" fill="#ffe0bd" stroke="#111111" strokeWidth="2" strokeLinecap="round" />
    {/* Wrapped Thumb across fingers */}
    <path
      d="M 14 25 C 14 21 17 20 22 23 C 27 25 32 25 34 26 C 36 28 35 31 31 32 C 26 33 18 33 15 28 Z"
      fill="#ffcca0"
      stroke="#111111"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    {/* Knuckle shadow & highlight */}
    <circle cx="20.5" cy="15.5" r="1.5" fill="#ffffff" />
    <circle cx="25.5" cy="14.5" r="1.5" fill="#ffffff" />
    <circle cx="30.5" cy="15.5" r="1.5" fill="#ffffff" />
  </svg>
);

// Stretching Rubber Arm Fist Icon (Gomu Gomu Pistol)
const StretchPistolIcon: React.FC<{ className?: string }> = ({ className = 'w-7 h-7' }) => (
  <svg viewBox="0 0 52 48" className={className} fill="none">
    {/* Stretched rubber arm shaft with speed streaks */}
    <path d="M 2 24 L 28 24" stroke="#ffcca0" strokeWidth="9" strokeLinecap="round" />
    <path d="M 2 20 L 28 20" stroke="#111111" strokeWidth="1.5" />
    <path d="M 2 28 L 28 28" stroke="#111111" strokeWidth="1.5" />
    {/* Speed trailing lines */}
    <line x1="0" y1="14" x2="22" y2="14" stroke="#00e5ff" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
    <line x1="6" y1="34" x2="26" y2="34" stroke="#00e5ff" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
    {/* Extended punching fist */}
    <path
      d="M 28 17 C 32 14 38 14 42 16 C 46 18 48 22 47 26 C 47 30 44 33 40 34 L 28 31 Z"
      fill="#ffe0bd"
      stroke="#111111"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    {/* Clenched Knuckles */}
    <rect x="36" y="16" width="9" height="5" rx="2" fill="#ffcca0" stroke="#111111" strokeWidth="1.5" />
    <rect x="37" y="21" width="10" height="5" rx="2" fill="#ffcca0" stroke="#111111" strokeWidth="1.5" />
    <rect x="36" y="26" width="9" height="5" rx="2" fill="#ffcca0" stroke="#111111" strokeWidth="1.5" />
    {/* Sonic blast ring */}
    <path d="M 44 10 C 49 16 49 32 44 38" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

// Multi-Fist Barrage Icon (Gomu Gomu Gatling Special)
const GatlingBarrageIcon: React.FC<{ className?: string }> = ({ className = 'w-7 h-7' }) => (
  <svg viewBox="0 0 52 48" className={className} fill="none">
    {/* Background fist top */}
    <path d="M 12 16 C 18 10 26 12 32 15 L 32 24 L 20 24 Z" fill="#e0a96d" stroke="#111111" strokeWidth="1.5" />
    <circle cx="32" cy="18" r="4" fill="#ffcca0" stroke="#111111" strokeWidth="1.5" />
    {/* Background fist bottom */}
    <path d="M 8 32 C 16 28 24 30 30 32 L 30 40 L 16 40 Z" fill="#e0a96d" stroke="#111111" strokeWidth="1.5" />
    <circle cx="30" cy="36" r="4" fill="#ffcca0" stroke="#111111" strokeWidth="1.5" />
    {/* Main central punch fist */}
    <path
      d="M 18 20 C 24 16 34 16 40 20 C 44 23 44 29 40 32 L 20 30 Z"
      fill="#ffe0bd"
      stroke="#111111"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <circle cx="41" cy="25" r="6" fill="#ffcca0" stroke="#111111" strokeWidth="1.8" />
    {/* Knuckles */}
    <circle cx="43" cy="22" r="2" fill="#ffffff" />
    <circle cx="44" cy="26" r="2" fill="#ffffff" />
    {/* Impact Manga Sparks */}
    <path d="M 46 16 L 51 13 M 48 24 L 52 24 M 46 32 L 51 35" stroke="#f72585" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

// Jump Kick Icon
const JumpKickIcon: React.FC<{ className?: string }> = ({ className = 'w-7 h-7' }) => (
  <svg viewBox="0 0 48 48" className={className} fill="none">
    {/* Motion arc underneath */}
    <path d="M 6 38 C 14 42 28 42 38 32" stroke="#a7f3d0" strokeWidth="2.5" strokeLinecap="round" />
    {/* Flying Sandal Foot */}
    <path
      d="M 12 18 L 22 18 L 30 26 L 36 24 C 40 23 44 26 43 30 C 42 33 38 35 32 35 L 22 35 L 14 26 Z"
      fill="#ffcca0"
      stroke="#111111"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    {/* Woven straw sandal sole */}
    <path d="M 22 37 L 42 32" stroke="#6d4c41" strokeWidth="4.5" strokeLinecap="round" />
    {/* Sandal toe strap */}
    <path d="M 36 29 L 37 34" stroke="#111111" strokeWidth="2.5" strokeLinecap="round" />
    {/* Denim cuff */}
    <path d="M 10 16 L 20 16 L 19 22 L 9 22 Z" fill="#ffffff" stroke="#111111" strokeWidth="1.5" />
    <path d="M 6 10 L 18 10 L 17 16 L 5 16 Z" fill="#1976d2" stroke="#111111" strokeWidth="1.5" />
  </svg>
);

export const VirtualControls: React.FC<VirtualControlsProps> = ({
  onInputUpdate,
  energy,
  engine,
}) => {
  const joystickBaseRef = useRef<HTMLDivElement>(null);
  const [stickPos, setStickPos] = useState({ x: 0, y: 0 });
  const [activeTouchId, setActiveTouchId] = useState<number | null>(null);

  // Vibration API safe trigger with pattern support
  const triggerHaptic = useCallback((pattern: number | number[]) => {
    try {
      if (typeof window !== 'undefined' && typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate(pattern);
      }
    } catch {
      // Gracefully ignored on unsupported browsers/devices
    }
  }, []);

  // Listen to Game Engine events for punch landings and player damage
  useEffect(() => {
    if (!engine) return;

    const originalOnHitLanded = engine.onHitLanded;
    const originalOnPlayerDamaged = engine.onPlayerDamaged;

    engine.onHitLanded = (isSpecial: boolean, damage: number) => {
      originalOnHitLanded?.(isSpecial, damage);
      if (isSpecial) {
        triggerHaptic([25, 20, 35]);
      } else {
        triggerHaptic(20);
      }
    };

    engine.onPlayerDamaged = (damage: number) => {
      originalOnPlayerDamaged?.(damage);
      triggerHaptic([40, 30, 45]);
    };

    return () => {
      engine.onHitLanded = originalOnHitLanded;
      engine.onPlayerDamaged = originalOnPlayerDamaged;
    };
  }, [engine, triggerHaptic]);

  // Handle Joystick Touch
  const handleJoystickStart = (e: React.TouchEvent) => {
    e.preventDefault();
    if (activeTouchId !== null) return;
    const touch = e.changedTouches[0];
    setActiveTouchId(touch.identifier);
    updateJoystickPos(touch.clientX, touch.clientY);
  };

  const handleJoystickMove = (e: React.TouchEvent) => {
    e.preventDefault();
    if (activeTouchId === null) return;
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      if (touch.identifier === activeTouchId) {
        updateJoystickPos(touch.clientX, touch.clientY);
        break;
      }
    }
  };

  const handleJoystickEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === activeTouchId) {
        setActiveTouchId(null);
        setStickPos({ x: 0, y: 0 });
        onInputUpdate((prev) => ({
          ...prev,
          left: false,
          right: false,
          up: false,
          down: false,
        }));
        break;
      }
    }
  };

  const updateJoystickPos = (clientX: number, clientY: number) => {
    if (!joystickBaseRef.current) return;
    const rect = joystickBaseRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = clientX - centerX;
    const dy = clientY - centerY;
    const dist = Math.hypot(dx, dy);
    const maxRadius = rect.width * 0.42;

    let nx = dx;
    let ny = dy;
    if (dist > maxRadius) {
      nx = (dx / dist) * maxRadius;
      ny = (dy / dist) * maxRadius;
    }

    setStickPos({ x: nx, y: ny });

    // Directional thresholds
    const deadzone = 12;
    const isLeft = nx < -deadzone;
    const isRight = nx > deadzone;
    const isUp = ny < -deadzone;
    const isDown = ny > deadzone;
    const isDash = dist > maxRadius * 0.68;

    onInputUpdate((prev) => ({
      ...prev,
      left: isLeft,
      right: isRight,
      up: isUp,
      down: isDown,
      dash: isDash,
    }));
  };

  // Trigger Action Buttons with tactile haptic feedback
  const triggerAction = (
    key: 'punch' | 'pistol' | 'jump' | 'special' | 'dash',
    justKey?: 'justPunch' | 'justPistol' | 'justJump' | 'justSpecial' | 'justDash'
  ) => {
    triggerHaptic(14);
    onInputUpdate((prev) => ({
      ...prev,
      [key]: true,
      ...(justKey ? { [justKey]: true } : {}),
    }));
    if (justKey) {
      window.requestAnimationFrame(() => {
        onInputUpdate((prev) => ({
          ...prev,
          [justKey]: false,
        }));
      });
    }
  };

  const releaseAction = (key: 'punch' | 'pistol' | 'jump' | 'special' | 'dash') => {
    onInputUpdate((prev) => ({
      ...prev,
      [key]: false,
    }));
  };

  return (
    <div className="absolute inset-0 pointer-events-none select-none z-20 flex flex-col justify-end p-2.5 sm:p-5">
      <div className="w-full flex items-end justify-between pointer-events-none">
        
        {/* ========================================================= */}
        {/* LEFT: AUTHENTIC ARCADE BALL-TOP JOYSTICK WITH 8-WAY RING */}
        {/* ========================================================= */}
        <div className="pointer-events-auto flex flex-col items-center">
          <div
            ref={joystickBaseRef}
            onTouchStart={handleJoystickStart}
            onTouchMove={handleJoystickMove}
            onTouchEnd={handleJoystickEnd}
            onTouchCancel={handleJoystickEnd}
            className="relative w-34 h-34 sm:w-42 sm:h-42 rounded-full bg-gradient-to-b from-slate-900 via-slate-950 to-black p-2 border-3 border-amber-500/60 shadow-[0_10px_25px_rgba(0,0,0,0.8),inset_0_2px_8px_rgba(255,255,255,0.15)] flex items-center justify-center cursor-pointer transition-colors active:border-amber-400"
            style={{ touchAction: 'none' }}
          >
            {/* 8-Way Arcade Guide Ring */}
            <div className="absolute inset-3 rounded-full border border-dashed border-amber-400/30 pointer-events-none" />

            {/* Directional Embossed Arrows */}
            <div className="absolute top-2.5 text-[10px] font-black text-amber-400/70 select-none">▲</div>
            <div className="absolute bottom-2.5 text-[10px] font-black text-amber-400/70 select-none">▼</div>
            <div className="absolute left-2.5 text-[10px] font-black text-amber-400/70 select-none">◀</div>
            <div className="absolute right-2.5 text-[10px] font-black text-amber-400/70 select-none">▶</div>

            {/* Inner Black Dust Washer Collar */}
            <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-slate-900 border-2 border-slate-700/80 shadow-inner flex items-center justify-center pointer-events-none" />

            {/* Chrome Shaft & Metallic Red Ball-Top (Japanese Arcade Style) */}
            <div
              className="absolute w-15 h-15 sm:w-17 sm:h-17 rounded-full bg-gradient-to-br from-red-500 via-red-600 to-rose-950 shadow-[0_6px_16px_rgba(0,0,0,0.9),inset_0_4px_6px_rgba(255,255,255,0.6)] border-2 border-red-300 flex items-center justify-center pointer-events-none transition-transform duration-75"
              style={{
                transform: `translate(${stickPos.x}px, ${stickPos.y}px)`,
              }}
            >
              {/* Glossy Spherical Highlight Dot */}
              <div className="absolute top-2 left-2.5 w-4 h-2.5 rounded-full bg-white/70 blur-[0.6px]" />
              <div className="w-4 h-4 rounded-full bg-red-400/30" />
            </div>
          </div>
          <span className="font-arcade text-[9px] sm:text-[10px] text-amber-300/80 mt-1 drop-shadow">
            MOVER
          </span>
        </div>

        {/* ========================================================= */}
        {/* RIGHT: CURVED JAPANESE ARCADE CABINET ACTION BUTTON LAYOUT */}
        {/* (Sanwa / Astro City slanted ergonomic arc with punch icons) */}
        {/* ========================================================= */}
        <div className="pointer-events-auto flex flex-col items-end">
          
          {/* Arcade Panel Background Frame */}
          <div className="bg-gradient-to-b from-slate-900/90 via-slate-950/95 to-black/95 p-3 sm:p-4 rounded-3xl border-2 border-amber-500/50 shadow-[0_12px_30px_rgba(0,0,0,0.85),inset_0_1px_4px_rgba(255,255,255,0.1)] flex flex-col gap-2.5 sm:gap-3 backdrop-blur-xs">
            
            {/* Top Row: Dash Sprint + Special Gomu Gatling (Button D / SP) */}
            <div className="flex items-center justify-end gap-2.5 pr-1">
              {/* DASH SPRINT BUTTON */}
              <button
                onTouchStart={(e) => {
                  e.preventDefault();
                  triggerAction('dash');
                }}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  releaseAction('dash');
                }}
                onMouseDown={() => triggerAction('dash')}
                onMouseUp={() => releaseAction('dash')}
                className="relative w-13 h-13 sm:w-15 sm:h-15 rounded-full bg-gradient-to-b from-amber-400 via-orange-500 to-amber-900 border-2 border-yellow-200 text-white shadow-[0_4px_12px_rgba(245,158,11,0.4)] flex flex-col items-center justify-center transition-all active:scale-90 cursor-pointer"
              >
                <div className="absolute top-1 inset-x-2 h-2.5 rounded-full bg-white/40 pointer-events-none" />
                <span className="text-sm sm:text-base leading-none">⚡</span>
                <span className="font-arcade text-[7px] sm:text-[8px] text-yellow-100 tracking-wider">
                  CORRER
                </span>
              </button>

              {/* SPECIAL BUTTON (GATLING / ONI GIRI / COMBO FINISHER) */}
              <button
                onTouchStart={(e) => {
                  e.preventDefault();
                  triggerAction('special', 'justSpecial');
                }}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  releaseAction('special');
                }}
                onMouseDown={() => triggerAction('special', 'justSpecial')}
                onMouseUp={() => releaseAction('special')}
                className={`relative w-15 h-15 sm:w-17 sm:h-17 rounded-full border-3 shadow-2xl flex flex-col items-center justify-center transition-all active:scale-95 cursor-pointer ${
                  engine?.finisherReady
                    ? 'bg-gradient-to-b from-amber-400 via-red-600 to-rose-950 border-yellow-300 text-white scale-110 animate-bounce shadow-[0_0_30px_rgba(239,68,68,0.95),0_0_15px_rgba(251,191,36,0.9)] z-10'
                    : energy >= 40
                    ? engine?.player.character === 'ZORO'
                      ? 'bg-gradient-to-b from-emerald-500 via-green-600 to-teal-950 border-emerald-300 text-white animate-pulse shadow-[0_0_20px_rgba(34,197,94,0.6)]'
                      : 'bg-gradient-to-b from-purple-500 via-pink-600 to-purple-900 border-pink-300 text-white animate-pulse shadow-[0_0_20px_rgba(236,72,153,0.6)]'
                    : 'bg-gradient-to-b from-slate-800 to-slate-950 border-slate-700 text-slate-500 opacity-60'
                }`}
              >
                {/* Convex Arcade Button Gloss Highlight */}
                <div className="absolute top-1.5 inset-x-2.5 h-3.5 rounded-full bg-white/35 pointer-events-none" />
                <GatlingBarrageIcon className="w-7 h-7 sm:w-8 sm:h-8 drop-shadow" />
                <span className={`font-arcade text-[7.5px] sm:text-[9px] tracking-wider ${
                  engine?.finisherReady ? 'text-yellow-200 font-black' : 'text-pink-200'
                }`}>
                  {engine?.finisherReady
                    ? engine?.player.character === 'ZORO'
                      ? 'SANZEN'
                      : 'BAZOOKA'
                    : engine?.player.character === 'ZORO'
                    ? 'ONI GIRI'
                    : 'GATLING'}
                </span>
                <span className={`absolute -top-1 -right-1 border text-[7.5px] font-black px-1 rounded-sm shadow ${
                  engine?.finisherReady
                    ? 'bg-red-600 border-yellow-200 text-yellow-200 animate-pulse'
                    : 'bg-purple-950 border-purple-300 text-yellow-300'
                }`}>
                  {engine?.finisherReady ? '★ FINISH' : 'SP'}
                </span>
              </button>
            </div>

            {/* Main Arcade Curved Arc: [PULO/JUMP], [PISTOL ESTICA], [SOCO/COMBO] */}
            <div className="flex items-end gap-2.5 sm:gap-3.5">
              
              {/* BUTTON C: JUMP / PULO (Green Arcade Convex Cap) */}
              <button
                onTouchStart={(e) => {
                  e.preventDefault();
                  triggerAction('jump', 'justJump');
                }}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  releaseAction('jump');
                }}
                onMouseDown={() => triggerAction('jump', 'justJump')}
                onMouseUp={() => releaseAction('jump')}
                className="relative w-16 h-16 sm:w-19 sm:h-19 rounded-full bg-gradient-to-b from-emerald-400 via-teal-600 to-emerald-950 border-3 border-emerald-200 text-white shadow-[0_8px_18px_rgba(5,150,105,0.4),inset_0_4px_6px_rgba(255,255,255,0.4)] flex flex-col items-center justify-center active:scale-90 active:brightness-125 transition-all cursor-pointer"
              >
                <div className="absolute top-1.5 inset-x-2.5 h-3.5 rounded-full bg-white/40 pointer-events-none" />
                <JumpKickIcon className="w-7 h-7 sm:w-8 sm:h-8 drop-shadow" />
                <span className="font-arcade text-[9px] sm:text-[10px] text-emerald-100 tracking-wider">
                  PULO
                </span>
                <span className="absolute -top-1 -right-1 bg-emerald-950 border border-emerald-300 text-[8px] font-black px-1 rounded-sm text-white">
                  C
                </span>
              </button>

              {/* BUTTON B: GOMU PISTOL (Blue Arcade Convex Cap with Stretched Fist) */}
              <button
                onTouchStart={(e) => {
                  e.preventDefault();
                  triggerAction('pistol', 'justPistol');
                }}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  releaseAction('pistol');
                }}
                onMouseDown={() => triggerAction('pistol', 'justPistol')}
                onMouseUp={() => releaseAction('pistol')}
                className="relative w-17 h-17 sm:w-20 sm:h-20 -mb-1 rounded-full bg-gradient-to-b from-cyan-400 via-blue-600 to-blue-950 border-3 border-cyan-200 text-white shadow-[0_8px_18px_rgba(14,165,233,0.4),inset_0_4px_6px_rgba(255,255,255,0.4)] flex flex-col items-center justify-center active:scale-90 active:brightness-125 transition-all cursor-pointer"
              >
                <div className="absolute top-1.5 inset-x-2.5 h-3.5 rounded-full bg-white/40 pointer-events-none" />
                <StretchPistolIcon className="w-8 h-8 sm:w-9 sm:h-9 drop-shadow" />
                <span className="font-arcade text-[9px] sm:text-[10px] text-cyan-100 tracking-wider">
                  {engine?.player && engine.player.z > 15
                    ? 'AIR SLASH'
                    : engine?.player.character === 'ZORO'
                    ? 'IAI'
                    : 'PISTOL'}
                </span>
                <span className="absolute -top-1 -right-1 bg-blue-950 border border-cyan-300 text-[8px] font-black px-1 rounded-sm text-white">
                  B
                </span>
              </button>

              {/* BUTTON A: PRIMARY PUNCH / COMBO / AIR SLASH (Red Arcade Giant Button) */}
              <button
                onTouchStart={(e) => {
                  e.preventDefault();
                  triggerAction('punch', 'justPunch');
                }}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  releaseAction('punch');
                }}
                onMouseDown={() => triggerAction('punch', 'justPunch')}
                onMouseUp={() => releaseAction('punch')}
                className="relative w-19 h-19 sm:w-22 sm:h-22 rounded-full bg-gradient-to-b from-red-500 via-rose-600 to-red-950 border-3 border-yellow-300 text-white shadow-[0_10px_22px_rgba(225,29,72,0.5),inset_0_5px_8px_rgba(255,255,255,0.5)] flex flex-col items-center justify-center active:scale-90 active:brightness-125 transition-all cursor-pointer"
              >
                <div className="absolute top-2 inset-x-3 h-4 rounded-full bg-white/45 pointer-events-none" />
                <FistPunchIcon className="w-9 h-9 sm:w-10 sm:h-10 drop-shadow-md" />
                <span className="font-arcade text-[10px] sm:text-[11px] text-yellow-200 tracking-wider">
                  {engine?.player && engine.player.z > 15
                    ? 'AIR SLASH'
                    : engine?.player.character === 'ZORO'
                    ? 'CORTE'
                    : 'SOCO'}
                </span>
                <span className="absolute -top-1 -right-1 bg-amber-400 border border-black text-[9px] font-black px-1.5 py-0.2 rounded-sm text-black shadow">
                  A
                </span>
              </button>

            </div>
          </div>
          
          {/* Arcade Cabinet Control Deck Brand Label */}
          <div className="flex items-center gap-1.5 mt-1 mr-2 opacity-80">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
            <span className="font-arcade text-[9px] text-amber-300 tracking-widest">
              ONE PIECE ARCADE
            </span>
          </div>

        </div>

      </div>
    </div>
  );
};
