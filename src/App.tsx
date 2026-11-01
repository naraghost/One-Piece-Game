/**
 * One Piece: Romance Dawn & Shells Town Beat 'Em Up
 * 2D Beat 'Em Up Arcade Game for Mobile & Desktop
 * Sagas: Capitã Alvida & Roronoa Zoro (Marine Base)
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { GameEngine } from './game/engine';
import { GameState, InputState, PlayerCharacter, StageId, FinisherCinematicData } from './game/types';
import { sound } from './game/audio';
import { SaveManager } from './game/storage';
import {
  PROLOGUE_DIALOGUE,
  STAGE_2_DIALOGUE,
  BOSS_DIALOGUE,
  VICTORY_DIALOGUE,
  ZORO_COURTYARD_DIALOGUE,
  SWORD_TOWER_DIALOGUE,
  ZORO_FREED_DIALOGUE,
  MORGAN_VICTORY_DIALOGUE,
  ORANGE_TOWN_DIALOGUE,
} from './game/dialogues';

import { GameCanvas } from './components/GameCanvas';
import { VirtualControls } from './components/VirtualControls';
import { GameHUD } from './components/GameHUD';
import { TitleScreen } from './components/TitleScreen';
import { CutsceneOverlay } from './components/CutsceneOverlay';
import { PauseModal } from './components/PauseModal';
import { VictoryModal } from './components/VictoryModal';
import { GameOverModal } from './components/GameOverModal';
import { AchievementToast } from './components/AchievementToast';
import { AchievementsModal } from './components/AchievementsModal';
import { FinisherCinematicOverlay } from './components/FinisherCinematicOverlay';

export default function App() {
  const engine = useMemo(() => new GameEngine(), []);
  const [gameState, setGameState] = useState<GameState>('TITLE_MENU');
  const [showAchievements, setShowAchievements] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(sound.getMuted());
  const [finisherData, setFinisherData] = useState<FinisherCinematicData | null>(null);
  const [highScore, setHighScore] = useState<number>(() => {
    try {
      return Number(localStorage.getItem('one_piece_alvida_highscore')) || 0;
    } catch {
      return 0;
    }
  });

  const [hudData, setHudData] = useState<{
    character: PlayerCharacter;
    hp: number;
    maxHp: number;
    energy: number;
    maxEnergy: number;
    score: number;
    combo: number;
    wave: number;
    finisherReady?: boolean;
    currentStage?: StageId;
    bossHp?: number;
    bossMaxHp?: number;
    bossType?: 'ALVIDA' | 'MORGAN';
  }>({
    character: 'LUFFY',
    hp: 100,
    maxHp: 100,
    energy: 100,
    maxEnergy: 100,
    score: 0,
    combo: 0,
    wave: 1,
    finisherReady: false,
    currentStage: 'STAGE_1_GALLEY',
    bossHp: undefined,
    bossMaxHp: undefined,
    bossType: 'ALVIDA',
  });

  // Fast input polling ref
  const inputStateRef = useRef<InputState>({
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
  });

  useEffect(() => {
    engine.onStateChange = (newState) => {
      setGameState(newState);
      if (newState !== 'PLAYING') {
        setFinisherData(null);
      }
      if (newState === 'TITLE_MENU') {
        sound.playTitleBGM();
      } else if (newState === 'VICTORY' || newState === 'GAME_OVER') {
        sound.stopBGM();
        if (engine.player.score > highScore) {
          setHighScore(engine.player.score);
          try {
            localStorage.setItem('one_piece_alvida_highscore', String(engine.player.score));
          } catch {
            // ignore
          }
        }
      }
    };

    engine.onHUDUpdate = (hud) => {
      setHudData({
        ...hud,
        currentStage: engine.currentStage,
      });
    };

    engine.onCinematicFinisher = (cinematic) => {
      setFinisherData(cinematic);
    };

    // Mobile Vibration on Hits & Damage
    engine.onHitLanded = (isSpecial) => {
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        try {
          navigator.vibrate(isSpecial ? [30, 20, 30] : 15);
        } catch {
          // ignore
        }
      }
    };

    engine.onPlayerDamaged = () => {
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        try {
          navigator.vibrate([40, 30, 50]);
        } catch {
          // ignore
        }
      }
    };
  }, [engine, highScore]);

  const handleStartGame = (character?: PlayerCharacter) => {
    engine.resetGame();
    engine.startStage('STAGE_1_GALLEY', character || 'LUFFY');
  };

  const handleSelectStage = (stageId: StageId, character?: PlayerCharacter) => {
    engine.startStage(stageId, character);
  };

  const handlePrologueComplete = () => {
    engine.beginPlaying();
  };

  const handleStageTransitionComplete = () => {
    engine.proceedToNextStage();
  };

  const handleBossIntroComplete = () => {
    engine.beginPlaying();
  };

  const handleRestart = () => {
    engine.resetGame();
    engine.beginPlaying();
  };

  const handleReplayCampaign = () => {
    SaveManager.restartStoryCampaign();
    engine.resetGame();
    engine.startStage('STAGE_1_GALLEY', 'LUFFY');
  };

  const handleReturnToMenu = () => {
    sound.playTitleBGM();
    setGameState('TITLE_MENU');
  };

  const handleToggleMute = () => {
    const nextMuted = sound.toggleMute();
    setIsMuted(nextMuted);
  };

  // Determine current cutscene dialogue based on stage
  const getPrologueDialogues = () => {
    if (engine.currentStage === 'STAGE_4_BASE_COURTYARD') {
      return ZORO_COURTYARD_DIALOGUE;
    }
    if (engine.currentStage === 'STAGE_7_ORANGE_TOWN') {
      return ORANGE_TOWN_DIALOGUE;
    }
    return PROLOGUE_DIALOGUE;
  };

  const getTransitionDialogues = () => {
    if (engine.currentStage === 'STAGE_1_GALLEY') {
      return STAGE_2_DIALOGUE;
    }
    if (engine.currentStage === 'STAGE_2_DECK') {
      return BOSS_DIALOGUE;
    }
    if (engine.currentStage === 'STAGE_3_BOSS') {
      return ZORO_COURTYARD_DIALOGUE;
    }
    if (engine.currentStage === 'STAGE_4_BASE_COURTYARD') {
      return SWORD_TOWER_DIALOGUE;
    }
    if (engine.currentStage === 'STAGE_5_FORTRESS_INTERIOR') {
      return ZORO_FREED_DIALOGUE;
    }
    if (engine.currentStage === 'STAGE_6_MORGAN_SHOWDOWN') {
      return MORGAN_VICTORY_DIALOGUE;
    }
    return STAGE_2_DIALOGUE;
  };

  const getBossIntroDialogues = () => {
    if (engine.currentStage === 'STAGE_6_MORGAN_SHOWDOWN') {
      return ZORO_FREED_DIALOGUE;
    }
    return BOSS_DIALOGUE;
  };

  return (
    <main className="fixed inset-0 w-screen h-screen overflow-hidden bg-slate-950 select-none">
      {/* 60fps Game Simulation Canvas */}
      <GameCanvas engine={engine} inputStateRef={inputStateRef} />

      {/* Extreme Manga/Anime Combo Finisher Cinematic Overlay */}
      <FinisherCinematicOverlay
        cinematicData={finisherData}
        onDismiss={() => setFinisherData(null)}
      />

      {/* Persistent Achievement Toast Overlay */}
      <AchievementToast />

      {/* World-Matched Low-Occlusion HUD */}
      {(gameState === 'PLAYING' || gameState === 'PAUSED' || gameState === 'BOSS_INTRO') && (
        <GameHUD
          character={hudData.character}
          hp={hudData.hp}
          maxHp={hudData.maxHp}
          energy={hudData.energy}
          maxEnergy={hudData.maxEnergy}
          score={hudData.score}
          combo={hudData.combo}
          wave={hudData.wave}
          currentStage={engine.currentStage}
          bossHp={hudData.bossHp}
          bossMaxHp={hudData.bossMaxHp}
          bossType={hudData.bossType}
          finisherReady={hudData.finisherReady}
          onPause={() => engine.pauseGame()}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          onOpenAchievements={() => setShowAchievements(true)}
        />
      )}

      {/* Mobile Touch Virtual Controls with Haptic Feedback */}
      {gameState === 'PLAYING' && (
        <VirtualControls
          engine={engine}
          onInputUpdate={(updater) => {
            inputStateRef.current = updater(inputStateRef.current);
          }}
          energy={hudData.energy}
        />
      )}

      {/* Title Screen Overlay with GBA Logo & Saga/Stage Select */}
      {gameState === 'TITLE_MENU' && (
        <TitleScreen
          onStart={handleStartGame}
          onSelectStage={handleSelectStage}
          onOpenAchievements={() => setShowAchievements(true)}
          highScore={highScore}
        />
      )}

      {/* Story Cutscenes */}
      {gameState === 'PROLOGUE' && (
        <CutsceneOverlay
          dialogues={getPrologueDialogues()}
          onComplete={handlePrologueComplete}
        />
      )}

      {gameState === 'STAGE_TRANSITION' && (
        <CutsceneOverlay
          dialogues={getTransitionDialogues()}
          onComplete={handleStageTransitionComplete}
        />
      )}

      {gameState === 'BOSS_INTRO' && (
        <CutsceneOverlay
          dialogues={getBossIntroDialogues()}
          onComplete={handleBossIntroComplete}
        />
      )}

      {/* Pause Modal */}
      {gameState === 'PAUSED' && (
        <PauseModal
          onResume={() => engine.resumeGame()}
          onRestart={handleRestart}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
        />
      )}

      {/* Victory Modal with Stage Advance Support */}
      {gameState === 'VICTORY' && (
        <VictoryModal
          score={hudData.score}
          totalDefeated={engine.totalEnemiesDefeated}
          maxCombo={engine.player.combo}
          currentStage={engine.currentStage}
          onRestart={handleRestart}
          onProceedNextStage={() => engine.proceedToNextStage()}
          onReturnToMenu={handleReturnToMenu}
          onReplayCampaign={handleReplayCampaign}
        />
      )}

      {/* Game Over Modal */}
      {gameState === 'GAME_OVER' && (
        <GameOverModal
          score={hudData.score}
          totalDefeated={engine.totalEnemiesDefeated}
          onRestart={handleRestart}
        />
      )}

      {/* Achievements Trophy Cabinet Modal */}
      {showAchievements && (
        <AchievementsModal onClose={() => setShowAchievements(false)} />
      )}
    </main>
  );
}
