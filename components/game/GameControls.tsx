// ──────────────────────────────────────────────────────────────────────────────
// GameControls — on-screen D-pad for mobile / touch devices
// ──────────────────────────────────────────────────────────────────────────────

'use client';

import { Direction } from '@/lib/types';

interface Props {
  onMove: (dir: Direction) => void;
}

interface DirButtonProps {
  dir: Direction;
  label: string;
  icon: string;
  className?: string;
  onMove: (dir: Direction) => void;
}

function DirButton({ dir, label, icon, className = '', onMove }: DirButtonProps) {
  function handle(e: React.TouchEvent | React.MouseEvent) {
    e.preventDefault();
    onMove(dir);
  }

  return (
    <button
      onTouchStart={handle}
      onMouseDown={handle}
      aria-label={label}
      className={`
        w-14 h-14 rounded-2xl flex items-center justify-center text-2xl
        bg-black/50 backdrop-blur-sm border border-white/15
        active:bg-[#00ffaa22] active:border-[#00ffaa66] active:scale-90
        transition-all duration-75 select-none touch-none
        shadow-lg shadow-black/40
        ${className}
      `}
    >
      {icon}
    </button>
  );
}

export default function GameControls({ onMove }: Props) {
  return (
    <div className="flex flex-col items-center gap-1 py-3 sm:hidden">
      {/* Up */}
      <DirButton dir="up" label="Move up" icon="⬆️" onMove={onMove} />

      {/* Middle row: left + right */}
      <div className="flex gap-12">
        <DirButton dir="left" label="Move left" icon="⬅️" onMove={onMove} />
        <DirButton dir="right" label="Move right" icon="➡️" onMove={onMove} />
      </div>

      {/* Down */}
      <DirButton dir="down" label="Move down" icon="⬇️" onMove={onMove} />
    </div>
  );
}
