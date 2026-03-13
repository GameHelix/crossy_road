// ──────────────────────────────────────────────────────────────────────────────
// GameMenu — main menu / start screen
// ──────────────────────────────────────────────────────────────────────────────

'use client';

import { motion } from 'framer-motion';
import { Difficulty } from '@/lib/types';
import { useState } from 'react';

interface Props {
  highScore: number;
  onStart: (difficulty: Difficulty) => void;
}

const DIFFICULTIES: { key: Difficulty; label: string; desc: string; color: string; glow: string }[] = [
  { key: 'easy',   label: 'Easy',   desc: 'Slower traffic, wider logs', color: '#00ff44', glow: '#00ff4466' },
  { key: 'medium', label: 'Medium', desc: 'Classic experience',          color: '#ffdd00', glow: '#ffdd0066' },
  { key: 'hard',   label: 'Hard',   desc: 'Fast cars, narrow logs',      color: '#ff003c', glow: '#ff003c66' },
];

export default function GameMenu({ highScore, onStart }: Props) {
  const [selected, setSelected] = useState<Difficulty>('medium');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 flex flex-col items-center justify-center bg-[#0d0d1a]/95 backdrop-blur-sm z-20 px-4"
    >
      {/* Title */}
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
        className="mb-8 text-center"
      >
        {/* Chicken emoji bouncing */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
          className="text-6xl mb-3"
        >
          🐔
        </motion.div>

        <h1
          className="text-5xl font-black tracking-tighter leading-none text-white"
          style={{ textShadow: '0 0 30px #00ffaa, 0 0 60px #00ffaa44' }}
        >
          CROSSY
        </h1>
        <h1
          className="text-5xl font-black tracking-tighter leading-none"
          style={{ color: '#00ffaa', textShadow: '0 0 30px #00ffaa' }}
        >
          ROAD
        </h1>
        <p className="text-white/40 text-sm mt-2 tracking-widest uppercase font-medium">
          Hop • Dodge • Survive
        </p>
      </motion.div>

      {/* High score */}
      {highScore > 0 && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6 px-6 py-2 rounded-full border border-[#7700ff44] bg-[#7700ff11] text-center"
        >
          <span className="text-[#aa66ff] text-sm font-bold tracking-widest uppercase">
            Best&nbsp;&nbsp;
          </span>
          <span className="text-white font-black text-xl" style={{ textShadow: '0 0 10px #7700ff' }}>
            {highScore}
          </span>
        </motion.div>
      )}

      {/* Difficulty selector */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.25 }}
        className="w-full max-w-xs mb-6 flex flex-col gap-2"
      >
        {DIFFICULTIES.map((d) => (
          <button
            key={d.key}
            onClick={() => setSelected(d.key)}
            className={`
              flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all duration-200 text-left
              ${selected === d.key
                ? 'border-current bg-current/10'
                : 'border-white/10 bg-white/5 hover:border-white/20'}
            `}
            style={selected === d.key ? { color: d.color, boxShadow: `0 0 20px ${d.glow}` } : { color: '#ffffff66' }}
          >
            <span className="text-xl">{d.key === 'easy' ? '🟢' : d.key === 'medium' ? '🟡' : '🔴'}</span>
            <div>
              <p className="font-bold text-sm leading-none">{d.label}</p>
              <p className="text-xs opacity-60 mt-0.5">{d.desc}</p>
            </div>
            {selected === d.key && (
              <span className="ml-auto text-xs opacity-80">✓</span>
            )}
          </button>
        ))}
      </motion.div>

      {/* Start button */}
      <motion.button
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.35 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onStart(selected)}
        className="w-full max-w-xs py-4 rounded-2xl font-black text-lg tracking-widest uppercase text-black transition-all"
        style={{
          background: 'linear-gradient(135deg, #00ffaa, #00ccff)',
          boxShadow: '0 0 30px #00ffaa66, 0 4px 20px #00000066',
        }}
      >
        Play
      </motion.button>

      {/* Controls hint */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 text-white/20 text-xs text-center"
      >
        Arrow keys / WASD to move&nbsp;·&nbsp;Swipe on mobile
      </motion.p>
    </motion.div>
  );
}
