// ──────────────────────────────────────────────────────────────────────────────
// useKeyboard — maps keyboard events to game actions
// ──────────────────────────────────────────────────────────────────────────────

import { useEffect } from 'react';
import { Direction } from '@/lib/types';

interface KeyboardHandlers {
  onMove: (dir: Direction) => void;
  onPause: () => void;
}

const KEY_MAP: Record<string, Direction> = {
  ArrowUp:    'up',
  ArrowDown:  'down',
  ArrowLeft:  'left',
  ArrowRight: 'right',
  KeyW:       'up',
  KeyS:       'down',
  KeyA:       'left',
  KeyD:       'right',
  KeyW_shift: 'up',
};

export function useKeyboard({ onMove, onPause }: KeyboardHandlers, active: boolean) {
  useEffect(() => {
    if (!active) return;

    function handleKeyDown(e: KeyboardEvent) {
      const dir = KEY_MAP[e.code];
      if (dir) {
        e.preventDefault();
        onMove(dir);
        return;
      }
      if (e.code === 'Escape' || e.code === 'KeyP') {
        e.preventDefault();
        onPause();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [active, onMove, onPause]);
}
