// ──────────────────────────────────────────────────────────────────────────────
// useGameLoop — drives requestAnimationFrame, provides delta time & a tick counter
// ──────────────────────────────────────────────────────────────────────────────

import { useEffect, useRef, useCallback } from 'react';

type LoopCallback = (deltaMs: number, tick: number) => void;

export function useGameLoop(callback: LoopCallback, active: boolean) {
  const callbackRef = useRef<LoopCallback>(callback);
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const tickRef = useRef<number>(0);

  // Keep the callback ref up to date without restarting the loop
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const loop = useCallback((time: number) => {
    const delta = lastTimeRef.current ? Math.min(time - lastTimeRef.current, 100) : 16;
    lastTimeRef.current = time;
    tickRef.current += 1;

    callbackRef.current(delta, tickRef.current);

    rafRef.current = requestAnimationFrame(loop);
  }, []);

  useEffect(() => {
    if (!active) {
      cancelAnimationFrame(rafRef.current);
      lastTimeRef.current = 0;
      return;
    }

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [active, loop]);
}
