// ──────────────────────────────────────────────────────────────────────────────
// Main game page — orchestrates all screens and the game canvas
// ──────────────────────────────────────────────────────────────────────────────

'use client';

import { useCallback, useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';

import { useGameEngine } from '@/hooks/useGameEngine';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '@/lib/constants';
import { Difficulty } from '@/lib/types';

import GameCanvas from '@/components/game/GameCanvas';
import GameUI from '@/components/game/GameUI';
import GameControls from '@/components/game/GameControls';
import GameMenu from '@/components/game/GameMenu';
import GameOverScreen from '@/components/game/GameOverScreen';
import PauseScreen from '@/components/game/PauseScreen';

/** Compute the largest uniform scale that fits the canvas inside the viewport. */
function useCanvasScale(reserveBottom: number = 0): number {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    function update() {
      const vw = window.innerWidth;
      const vh = window.innerHeight - reserveBottom;
      setScale(Math.min(vw / CANVAS_WIDTH, vh / CANVAS_HEIGHT, 1));
    }
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [reserveBottom]);

  return scale;
}

export default function GamePage() {
  const {
    phase, score, lives, highScore, difficulty, soundEnabled,
    stateRef,
    startGame, move, pause, resume, update, toggleSound, goToMenu,
  } = useGameEngine();

  const [lastDifficulty, setLastDifficulty] = useState<Difficulty>('medium');

  // Reserve extra height when mobile controls are visible
  const isPlaying = phase === 'playing';
  const scale = useCanvasScale(isPlaying ? 180 : 0);

  const handleStart = useCallback((diff: Difficulty) => {
    setLastDifficulty(diff);
    startGame(diff);
  }, [startGame]);

  const handleRestart = useCallback((diff: Difficulty) => {
    setLastDifficulty(diff);
    startGame(diff);
  }, [startGame]);

  const handleMenu = useCallback(() => {
    goToMenu();
  }, [goToMenu]);

  return (
    <main className="h-full w-full flex flex-col items-center justify-center bg-[#0d0d1a] overflow-hidden">

      {/* ── Canvas wrapper — scales to fit viewport ──────────────────────── */}
      <div
        style={{
          width: CANVAS_WIDTH,
          height: CANVAS_HEIGHT,
          transform: `scale(${scale})`,
          transformOrigin: 'top center',
          flexShrink: 0,
        }}
      >
        {/* Neon border glow */}
        <div
          className="relative w-full h-full rounded-2xl overflow-hidden"
          style={{ boxShadow: '0 0 60px #00ffaa22, 0 0 120px #00ffaa11, inset 0 0 0 1px #00ffaa22' }}
        >
          {/* Canvas */}
          <GameCanvas
            stateRef={stateRef}
            active={isPlaying}
            onMove={move}
            onPause={pause}
            onUpdate={update}
          />

          {/* HUD overlay — shown while playing */}
          {isPlaying && (
            <GameUI
              score={score}
              highScore={highScore}
              lives={lives}
              soundEnabled={soundEnabled}
              onPause={pause}
              onToggleSound={toggleSound}
            />
          )}

          {/* Screen overlays */}
          <AnimatePresence mode="wait">
            {phase === 'menu' && (
              <GameMenu
                key="menu"
                highScore={highScore}
                onStart={handleStart}
              />
            )}
            {phase === 'paused' && (
              <PauseScreen
                key="pause"
                score={score}
                soundEnabled={soundEnabled}
                difficulty={lastDifficulty}
                onResume={resume}
                onRestart={handleRestart}
                onMenu={handleMenu}
                onToggleSound={toggleSound}
              />
            )}
            {phase === 'gameover' && (
              <GameOverScreen
                key="gameover"
                score={score}
                highScore={highScore}
                difficulty={lastDifficulty}
                onRestart={handleRestart}
                onMenu={handleMenu}
              />
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Mobile D-pad — below the scaled canvas ───────────────────────── */}
      {isPlaying && (
        <div style={{ marginTop: CANVAS_HEIGHT * scale * 0.02 }}>
          <GameControls onMove={move} />
        </div>
      )}
    </main>
  );
}
