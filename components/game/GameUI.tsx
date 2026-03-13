// ──────────────────────────────────────────────────────────────────────────────
// GameUI — HUD overlay: score, high-score, lives, pause button
// ──────────────────────────────────────────────────────────────────────────────

'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  score: number;
  highScore: number;
  lives: number;
  soundEnabled: boolean;
  onPause: () => void;
  onToggleSound: () => void;
}

/** Tiny heart icon. */
function Heart({ filled }: { filled: boolean }) {
  return (
    <span
      className={`text-xl select-none transition-all duration-300 ${filled ? 'drop-shadow-[0_0_6px_#ff003c]' : 'opacity-30'}`}
      aria-hidden
    >
      {filled ? '❤️' : '🖤'}
    </span>
  );
}

export default function GameUI({ score, highScore, lives, soundEnabled, onPause, onToggleSound }: Props) {
  return (
    <div className="absolute inset-0 pointer-events-none select-none z-10">
      {/* Top bar */}
      <div className="flex items-start justify-between px-3 pt-3 gap-2">
        {/* Score */}
        <div className="bg-black/60 backdrop-blur-sm border border-[#00ffaa33] rounded-xl px-3 py-1.5">
          <p className="text-[10px] font-bold tracking-widest text-[#00ffaa99] uppercase">Score</p>
          <AnimatePresence mode="wait">
            <motion.p
              key={score}
              initial={{ y: -6, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-2xl font-black text-white leading-none tabular-nums"
              style={{ textShadow: '0 0 12px #00ffaa' }}
            >
              {score}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Right controls */}
        <div className="flex flex-col gap-2 items-end pointer-events-auto">
          {/* Best */}
          {highScore > 0 && (
            <div className="bg-black/60 backdrop-blur-sm border border-[#7700ff33] rounded-xl px-3 py-1">
              <p className="text-[10px] font-bold tracking-widest text-[#aa66ff99] uppercase">Best</p>
              <p
                className="text-xl font-black text-white leading-none tabular-nums"
                style={{ textShadow: '0 0 10px #7700ff' }}
              >
                {highScore}
              </p>
            </div>
          )}

          {/* Pause */}
          <button
            onClick={onPause}
            className="bg-black/60 backdrop-blur-sm border border-white/10 rounded-xl w-10 h-10 flex items-center justify-center text-white/70 hover:text-white hover:border-white/30 transition-all active:scale-95"
            aria-label="Pause"
          >
            <PauseIcon />
          </button>

          {/* Sound toggle */}
          <button
            onClick={onToggleSound}
            className="bg-black/60 backdrop-blur-sm border border-white/10 rounded-xl w-10 h-10 flex items-center justify-center text-white/70 hover:text-white hover:border-white/30 transition-all active:scale-95"
            aria-label={soundEnabled ? 'Mute' : 'Unmute'}
          >
            <span className="text-lg">{soundEnabled ? '🔊' : '🔇'}</span>
          </button>
        </div>
      </div>

      {/* Lives — bottom left */}
      <div className="absolute bottom-3 left-3 flex gap-1 bg-black/60 backdrop-blur-sm border border-white/10 rounded-xl px-3 py-1.5">
        {Array.from({ length: 3 }).map((_, i) => (
          <Heart key={i} filled={i < lives} />
        ))}
      </div>

      {/* Keyboard hint — bottom right */}
      <div className="absolute bottom-3 right-3 text-[10px] text-white/20 font-mono leading-tight text-right hidden sm:block">
        <p>↑↓←→ / WASD move</p>
        <p>P / Esc pause</p>
      </div>
    </div>
  );
}

function PauseIcon() {
  return (
    <svg width="14" height="16" viewBox="0 0 14 16" fill="currentColor">
      <rect x="1" y="0" width="4" height="16" rx="1.5" />
      <rect x="9" y="0" width="4" height="16" rx="1.5" />
    </svg>
  );
}
