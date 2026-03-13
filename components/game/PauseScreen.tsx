// ──────────────────────────────────────────────────────────────────────────────
// PauseScreen — overlay shown while the game is paused
// ──────────────────────────────────────────────────────────────────────────────

'use client';

import { motion } from 'framer-motion';
import { Difficulty } from '@/lib/types';

interface Props {
  score: number;
  soundEnabled: boolean;
  onResume: () => void;
  onRestart: (difficulty: Difficulty) => void;
  onMenu: () => void;
  onToggleSound: () => void;
  difficulty: Difficulty;
}

export default function PauseScreen({
  score, soundEnabled, difficulty,
  onResume, onRestart, onMenu, onToggleSound,
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 flex flex-col items-center justify-center bg-[#0d0d1a]/90 backdrop-blur-md z-20 px-6"
    >
      {/* Title */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 250 }}
        className="mb-8 text-center"
      >
        <div className="text-5xl mb-3">⏸️</div>
        <h2
          className="text-4xl font-black text-white tracking-tight"
          style={{ textShadow: '0 0 20px #7700ff' }}
        >
          Paused
        </h2>
        <p className="text-white/40 text-sm mt-1">Score: <span className="text-white font-bold">{score}</span></p>
      </motion.div>

      {/* Buttons */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col gap-3 w-full max-w-xs"
      >
        {/* Resume */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onResume}
          className="py-4 rounded-2xl font-black text-base tracking-widest uppercase text-black"
          style={{
            background: 'linear-gradient(135deg, #00ffaa, #00ccff)',
            boxShadow: '0 0 28px #00ffaa55',
          }}
        >
          Resume
        </motion.button>

        {/* Sound toggle */}
        <button
          onClick={onToggleSound}
          className="py-3 rounded-2xl font-bold text-sm tracking-widest uppercase text-white/70 border border-white/10 hover:border-white/20 transition-all flex items-center justify-center gap-2"
        >
          {soundEnabled ? '🔊' : '🔇'}
          <span>{soundEnabled ? 'Sound On' : 'Sound Off'}</span>
        </button>

        {/* Restart */}
        <button
          onClick={() => onRestart(difficulty)}
          className="py-3 rounded-2xl font-bold text-sm tracking-widest uppercase text-[#ffdd00]/70 border border-[#ffdd0022] hover:border-[#ffdd0044] transition-all"
        >
          Restart
        </button>

        {/* Main menu */}
        <button
          onClick={onMenu}
          className="py-3 rounded-2xl font-bold text-sm tracking-widest uppercase text-white/40 border border-white/8 hover:border-white/15 transition-all"
        >
          Main Menu
        </button>
      </motion.div>

      {/* Keyboard hint */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-8 text-white/20 text-xs"
      >
        Press P or Esc to resume
      </motion.p>
    </motion.div>
  );
}
