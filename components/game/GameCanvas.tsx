// ──────────────────────────────────────────────────────────────────────────────
// GameCanvas — hosts the <canvas> element and drives the render + game loop
// ──────────────────────────────────────────────────────────────────────────────

'use client';

import { useRef, useEffect, useCallback } from 'react';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '@/lib/constants';
import { renderFrame } from '@/lib/renderer';
import { useGameLoop } from '@/hooks/useGameLoop';
import { useKeyboard } from '@/hooks/useKeyboard';
import { GameState, Direction } from '@/lib/types';

interface Props {
  /** Ref to the current game state (read every RAF frame, not reactive). */
  stateRef: React.MutableRefObject<GameState | null>;
  /** Whether the game loop is active. */
  active: boolean;
  /** Callback for player moves. */
  onMove: (dir: Direction) => void;
  /** Callback for pause toggle. */
  onPause: () => void;
  /** Per-frame update callback (physics, AI, etc.). */
  onUpdate: (deltaMs: number) => void;
}

export default function GameCanvas({
  stateRef, active, onMove, onPause, onUpdate,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tickRef = useRef(0);

  // ── Game loop ─────────────────────────────────────────────────────────────

  const loop = useCallback((deltaMs: number, tick: number) => {
    tickRef.current = tick;
    onUpdate(deltaMs);

    const canvas = canvasRef.current;
    const state = stateRef.current;
    if (!canvas || !state) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    renderFrame(ctx, state, tick);
  }, [onUpdate, stateRef]);

  useGameLoop(loop, active);

  // ── Keyboard input ────────────────────────────────────────────────────────

  useKeyboard({ onMove, onPause }, active);

  // ── Touch / swipe input ───────────────────────────────────────────────────

  const touchStart = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const MIN_SWIPE = 28;

    function onTouchStart(e: TouchEvent) {
      e.preventDefault();
      const t = e.touches[0];
      touchStart.current = { x: t.clientX, y: t.clientY };
    }

    function onTouchEnd(e: TouchEvent) {
      if (!touchStart.current) return;
      e.preventDefault();
      const t = e.changedTouches[0];
      const dx = t.clientX - touchStart.current.x;
      const dy = t.clientY - touchStart.current.y;
      touchStart.current = null;

      if (Math.abs(dx) < MIN_SWIPE && Math.abs(dy) < MIN_SWIPE) {
        // Tap = move up
        onMove('up');
        return;
      }

      if (Math.abs(dx) > Math.abs(dy)) {
        onMove(dx > 0 ? 'right' : 'left');
      } else {
        onMove(dy > 0 ? 'down' : 'up');
      }
    }

    canvas.addEventListener('touchstart', onTouchStart, { passive: false });
    canvas.addEventListener('touchend', onTouchEnd, { passive: false });
    return () => {
      canvas.removeEventListener('touchstart', onTouchStart);
      canvas.removeEventListener('touchend', onTouchEnd);
    };
  }, [onMove]);

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
      className="block max-h-full max-w-full touch-none"
      style={{ imageRendering: 'pixelated' }}
      aria-label="Crossy Road game canvas"
    />
  );
}
