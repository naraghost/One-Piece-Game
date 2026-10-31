import React, { useEffect, useRef } from 'react';
import { GameEngine } from '../game/engine';
import { InputState } from '../game/types';

interface GameCanvasProps {
  engine: GameEngine;
  inputStateRef: React.MutableRefObject<InputState>;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({ engine, inputStateRef }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let lastTime = performance.now();

    // Resize handling with high-DPI crisp pixel scaling
    const handleResize = () => {
      if (!containerRef.current || !canvas) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;

      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.resetTransform?.();
      ctx.scale(dpr, dpr);
      engine.setDimensions(width, height);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Keyboard controls handler
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default page scroll on arrow keys & space
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
        e.preventDefault();
      }

      const input = inputStateRef.current;
      const key = e.key.toLowerCase();

      if (e.code === 'KeyA' || e.code === 'ArrowLeft') input.left = true;
      if (e.code === 'KeyD' || e.code === 'ArrowRight') input.right = true;
      if (e.code === 'KeyW' || e.code === 'ArrowUp') input.up = true;
      if (e.code === 'KeyS' || e.code === 'ArrowDown') input.down = true;

      // J or Z: Punch
      if ((key === 'j' || key === 'z') && !input.punch) {
        input.punch = true;
        input.justPunch = true;
      }
      // L or C: Gomu Gomu no Pistol (stretching punch!)
      if ((key === 'l' || key === 'c') && !input.pistol) {
        input.pistol = true;
        input.justPistol = true;
      }
      // K or X: Jump
      if ((key === 'k' || key === 'x') && !input.jump) {
        input.jump = true;
        input.justJump = true;
      }
      // Space or U: Special move
      if ((e.code === 'Space' || key === 'u') && !input.special) {
        input.special = true;
        input.justSpecial = true;
      }
      // Shift: Dash Sprint
      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
        input.dash = true;
      }
      // Esc or P: Pause
      if (e.code === 'Escape' || key === 'p') {
        if (engine.state === 'PLAYING') {
          engine.pauseGame();
        } else if (engine.state === 'PAUSED') {
          engine.resumeGame();
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const input = inputStateRef.current;
      const key = e.key.toLowerCase();

      if (e.code === 'KeyA' || e.code === 'ArrowLeft') input.left = false;
      if (e.code === 'KeyD' || e.code === 'ArrowRight') input.right = false;
      if (e.code === 'KeyW' || e.code === 'ArrowUp') input.up = false;
      if (e.code === 'KeyS' || e.code === 'ArrowDown') input.down = false;

      if (key === 'j' || key === 'z') input.punch = false;
      if (key === 'l' || key === 'c') input.pistol = false;
      if (key === 'k' || key === 'x') input.jump = false;
      if (e.code === 'Space' || key === 'u') input.special = false;
      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') input.dash = false;
    };

    const handleBlur = () => {
      // Clear held keys on blur (constitution requirement)
      inputStateRef.current = {
        left: false,
        right: false,
        up: false,
        down: false,
        punch: false,
        pistol: false,
        jump: false,
        special: false,
        dash: false,
        justPunch: false,
        justPistol: false,
        justJump: false,
        justSpecial: false,
        justDash: false,
      };
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);

    // 60fps Loop
    const loop = (currentTime: number) => {
      const rawDt = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      // Update simulation with clamped dt
      engine.update(rawDt, inputStateRef.current);

      // Reset edge-triggered inputs for next frame
      inputStateRef.current.justPunch = false;
      inputStateRef.current.justPistol = false;
      inputStateRef.current.justJump = false;
      inputStateRef.current.justSpecial = false;

      // Render world
      const width = containerRef.current?.clientWidth || 800;
      const height = containerRef.current?.clientHeight || 450;
      ctx.clearRect(0, 0, width, height);
      engine.render(ctx);

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
    };
  }, [engine, inputStateRef]);

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-hidden bg-slate-950">
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
};
