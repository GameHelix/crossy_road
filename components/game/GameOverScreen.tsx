// ──────────────────────────────────────────────────────────────────────────────
// GameOverScreen — animated end screen with score + restart options
// ──────────────────────────────────────────────────────────────────────────────

'use client';

import { motion } from 'framer-motion';
import { Difficulty } from '@/lib/types';

interface Props {
  score: number;
  highScore: number;
  difficulty: Difficulty;
  onRestart: (difficulty: Difficulty) => void;
  onMenu: () => void;
}

export default function GameOverScreen({ score, highScore, difficulty, onRestart, onMenu }: Props) {
  const isNewRecord = score > 0 && score >= highScore;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 flex flex-col items-center justify-center bg-[#0d0d1a]/95 backdrop-blur-sm z-20 px-6"
    >
      {/* Icon */}
      <motion.div
        initial={{ scale: 0, rotate: -30 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 18 }}
        className="text-7xl mb-4"
      >
        {isNewRecord ? '🏆' : '💀'}
      </motion.div>

      {/* Title */}
      <motion.h2
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="text-4xl font-black text-white mb-1"
        style={{ textShadow: '0 0 20px #ff003c' }}
      >
        {isNewRecord ? 'New Record!' : 'Game Over'}
      </motion.h2>

      {/* Score */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.25, type: 'spring' }}
        className="mt-4 text-center"
      >
        <p className="text-white/40 text-xs tracking-widest uppercase mb-1">Your Score</p>
        <p
          className="text-6xl font-black text-white tabular-nums"
          style={{ textShadow: '0 0 30px #00ffaa' }}
        >
          {score}
        </p>
      </motion.div>

      {/* Best */}
      {highScore > 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-2 text-[#aa66ff] text-sm font-bold"
          style={{ textShadow: '0 0 8px #7700ff' }}
        >
          Best: {highScore}
        </motion.p>
      )}

      {/* Buttons */}
      <motion.div
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.45 }}
        className="mt-8 flex flex-col gap-3 w-full max-w-xs"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onRestart(difficulty)}
          className="py-4 rounded-2xl font-black text-base tracking-widest uppercase text-black transition-all"
          style={{
            background: 'linear-gradient(135deg, #00ffaa, #00ccff)',
            boxShadow: '0 0 30px #00ffaa55',
          }}
        >
          Play Again
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onMenu}
          className="py-3 rounded-2xl font-bold text-sm tracking-widest uppercase text-white/60 border border-white/10 hover:border-white/20 transition-all"
        >
          Main Menu
        </motion.button>
      </motion.div>

      {/* Flavour text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.65 }}
        className="mt-6 text-white/20 text-xs text-center"
      >
        {score === 0
          ? "Didn't even cross one lane? 🐔"
          : score < 10
          ? 'The road is hungry. Try again!'
          : score < 25
          ? 'Getting warmer. Watch the river!'
          : 'Impressive. Can you do better?'}
      </motion.p>
    </motion.div>
  );
}
