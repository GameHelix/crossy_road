// ──────────────────────────────────────────────────────────────────────────────
// useGameEngine — core game logic (state, physics, collisions, generation)
// ──────────────────────────────────────────────────────────────────────────────

'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import {
  GamePhase, Difficulty, Direction, GameState, Lane, RoadLane,
  RiverLane, PlayerState,
} from '@/lib/types';
import {
  COLS, TILE_SIZE, CANVAS_WIDTH,
  PLAYER_START_COL, MOVE_DURATION, HOP_HEIGHT,
  INITIAL_LIVES, LOOKAHEAD, LOOKBEHIND,
  PLAYER_HALF_HIT, VEHICLE_HIT_SHRINK,
} from '@/lib/constants';
import { generateLaneRange } from '@/lib/laneGenerator';
import { SoundManager } from '@/lib/soundManager';

// ── Easing ────────────────────────────────────────────────────────────────────

function easeInOutQuad(t: number) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

// ── Initial state factory ─────────────────────────────────────────────────────

function makePlayer(col = PLAYER_START_COL): PlayerState {
  const pixelX = col * TILE_SIZE + TILE_SIZE / 2;
  return {
    row: 0, col,
    startRow: 0,
    pixelX,
    startX: pixelX,
    targetX: pixelX,
    animProgress: 0,
    isMoving: false,
    direction: 'up',
    hopArc: 0,
    onLog: null,
    isDead: false,
    deathAnimProgress: 0,
  };
}

function makeState(difficulty: Difficulty, gameSeed: number): GameState {
  return {
    phase: 'playing',
    score: 0,
    highScore: 0,
    lives: INITIAL_LIVES,
    difficulty,
    player: makePlayer(),
    lanes: [],
    maxRow: 0,
    moveQueue: [],
    gameSeed,
    soundEnabled: true,
    frameCount: 0,
  };
}

// ── Collision helpers ─────────────────────────────────────────────────────────

function findCurrentLane(state: GameState): Lane | undefined {
  return state.lanes.find(l => l.row === state.player.row);
}

/** Check if the player's pixel-X overlaps a given AABB (x is centre). */
function overlaps1D(px: number, halfPx: number, cx: number, halfCx: number) {
  return Math.abs(px - cx) < halfPx + halfCx;
}

function checkLandingCollision(state: GameState, sound: SoundManager) {
  const { player } = state;
  if (player.isDead) return;

  const lane = findCurrentLane(state);
  if (!lane) return;

  if (lane.type === 'safe') {
    player.onLog = null;
    return;
  }

  if (lane.type === 'road') {
    player.onLog = null;
    // Check each vehicle
    for (const v of (lane as RoadLane).vehicles) {
      if (overlaps1D(player.pixelX, PLAYER_HALF_HIT, v.x, v.width / 2 - VEHICLE_HIT_SHRINK)) {
        killPlayer(state, 'hit', sound);
        return;
      }
    }
    return;
  }

  if (lane.type === 'river') {
    // Must land on a log
    let landed = false;
    for (const log of (lane as RiverLane).logs) {
      if (overlaps1D(player.pixelX, PLAYER_HALF_HIT, log.x, log.width / 2 - 4)) {
        player.onLog = log.id;
        landed = true;
        sound.playLand();
        break;
      }
    }
    if (!landed) {
      killPlayer(state, 'drowned', sound);
    }
  }
}

function checkContinuousCollisions(state: GameState, sound: SoundManager) {
  const { player } = state;
  if (player.isDead || player.isMoving) return;

  const lane = findCurrentLane(state);
  if (!lane || lane.type !== 'road') return;

  for (const v of (lane as RoadLane).vehicles) {
    if (overlaps1D(player.pixelX, PLAYER_HALF_HIT - 4, v.x, v.width / 2 - VEHICLE_HIT_SHRINK)) {
      killPlayer(state, 'hit', sound);
      return;
    }
  }
}

function killPlayer(state: GameState, reason: 'hit' | 'drowned', sound: SoundManager) {
  const { player } = state;
  if (player.isDead) return;

  player.isDead = true;
  player.deathAnimProgress = 0;
  player.isMoving = false;
  state.moveQueue = [];

  if (reason === 'hit') sound.playHit();
  else sound.playSplash();
}

function respawnPlayer(state: GameState) {
  state.player = makePlayer();
  state.score = 0;
}

// ── Lane management ───────────────────────────────────────────────────────────

function ensureLanes(state: GameState) {
  const { player, difficulty, gameSeed, lanes } = state;
  const existing = new Set(lanes.map(l => l.row));
  const fromRow = Math.max(0, player.row - LOOKBEHIND);
  const toRow = player.row + LOOKAHEAD;

  const newLanes = generateLaneRange(fromRow, toRow, difficulty, gameSeed, existing);
  state.lanes = [...lanes, ...newLanes].filter(l => l.row >= fromRow);
  state.lanes.sort((a, b) => a.row - b.row);
}

// ── Main hook ─────────────────────────────────────────────────────────────────

export function useGameEngine() {
  // ── Refs for hot-path game logic (no re-render) ───────────────────────────
  const stateRef = useRef<GameState | null>(null);
  const soundRef = useRef<SoundManager | null>(null);

  // ── React state for UI ────────────────────────────────────────────────────
  const [phase, setPhase] = useState<GamePhase>('menu');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(INITIAL_LIVES);
  const [highScore, setHighScore] = useState(0);
  const [difficulty, setDifficultyState] = useState<Difficulty>('medium');
  const [soundEnabled, setSoundEnabled] = useState(true);

  // ── Initialise sound & high-score ─────────────────────────────────────────
  useEffect(() => {
    soundRef.current = new SoundManager();
    if (typeof window !== 'undefined') {
      const hs = parseInt(localStorage.getItem('crossy-highscore') ?? '0', 10);
      if (!isNaN(hs) && hs > 0) {
        setHighScore(hs);
      }
    }
  }, []);

  // ── Actions ───────────────────────────────────────────────────────────────

  const startGame = useCallback((diff: Difficulty = 'medium') => {
    const seed = Math.floor(Math.random() * 1_000_000);
    const s = makeState(diff, seed);
    const stored = parseInt(localStorage.getItem('crossy-highscore') ?? '0', 10);
    s.highScore = isNaN(stored) ? 0 : stored;

    ensureLanes(s);
    stateRef.current = s;

    setPhase('playing');
    setScore(0);
    setLives(INITIAL_LIVES);
    setDifficultyState(diff);
    soundRef.current?.playStart();
  }, []);

  const processMove = useCallback((dir: Direction) => {
    const s = stateRef.current;
    if (!s || s.phase !== 'playing' || s.player.isDead) return;
    const { player } = s;

    let newRow = player.row;
    let newCol = player.col;
    switch (dir) {
      case 'up':    newRow++; break;
      case 'down':  newRow = Math.max(0, newRow - 1); break;
      case 'left':  newCol = Math.max(0, newCol - 1); break;
      case 'right': newCol = Math.min(COLS - 1, newCol + 1); break;
    }

    // Prevent backing out below row 0
    if (newRow === player.row && newCol === player.col) return;

    // Start animation
    player.startRow = player.row;
    player.startX = player.pixelX;
    player.row = newRow;
    player.col = newCol;
    player.targetX = newCol * TILE_SIZE + TILE_SIZE / 2;
    player.animProgress = 0;
    player.isMoving = true;
    player.direction = dir;
    player.onLog = null;

    // Score: only advance when moving to a new max row
    if (newRow > s.maxRow) {
      s.maxRow = newRow;
      s.score = newRow;
      if (s.score > s.highScore) {
        s.highScore = s.score;
        localStorage.setItem('crossy-highscore', String(s.score));
        soundRef.current?.playScore();
      }
    }

    ensureLanes(s);
    soundRef.current?.playHop();
  }, []);

  const move = useCallback((dir: Direction) => {
    const s = stateRef.current;
    if (!s || s.phase !== 'playing') return;

    if (s.player.isMoving) {
      if (s.moveQueue.length < 1) s.moveQueue.push(dir);
    } else {
      processMove(dir);
    }
  }, [processMove]);

  const pause = useCallback(() => {
    const s = stateRef.current;
    if (!s || s.phase !== 'playing') return;
    s.phase = 'paused';
    setPhase('paused');
  }, []);

  const resume = useCallback(() => {
    const s = stateRef.current;
    if (!s || s.phase !== 'paused') return;
    s.phase = 'playing';
    setPhase('playing');
  }, []);

  const goToMenu = useCallback(() => {
    const s = stateRef.current;
    if (s) s.phase = 'menu';
    stateRef.current = null;
    setPhase('menu');
    setScore(0);
    setLives(INITIAL_LIVES);
  }, []);

  const toggleSound = useCallback(() => {
    setSoundEnabled(prev => {
      const next = !prev;
      if (soundRef.current) soundRef.current.enabled = next;
      if (stateRef.current) stateRef.current.soundEnabled = next;
      return next;
    });
  }, []);

  // ── Per-frame update (called by the game loop) ─────────────────────────────
  const update = useCallback((deltaMs: number) => {
    const s = stateRef.current;
    if (!s || s.phase !== 'playing') return;

    const dt = Math.min(deltaMs, 80); // cap to avoid spiral of death
    const { player } = s;

    // ── Update vehicle / log positions ──────────────────────────────────────
    for (const lane of s.lanes) {
      if (lane.type === 'road') {
        for (const v of (lane as RoadLane).vehicles) {
          v.x += v.speed * v.directionX * dt / 1000;
          const total = CANVAS_WIDTH + v.width;
          if (v.directionX > 0 && v.x - v.width / 2 > CANVAS_WIDTH) v.x -= total;
          if (v.directionX < 0 && v.x + v.width / 2 < 0) v.x += total;
        }
      }
      if (lane.type === 'river') {
        for (const log of (lane as RiverLane).logs) {
          log.x += log.speed * log.directionX * dt / 1000;
          const total = CANVAS_WIDTH + log.width;
          if (log.directionX > 0 && log.x - log.width / 2 > CANVAS_WIDTH) log.x -= total;
          if (log.directionX < 0 && log.x + log.width / 2 < 0) log.x += total;
        }
      }
    }

    // ── Player animation ────────────────────────────────────────────────────
    if (player.isMoving) {
      player.animProgress = Math.min(1, player.animProgress + dt / MOVE_DURATION);
      const t = easeInOutQuad(player.animProgress);
      player.pixelX = lerp(player.startX, player.targetX, t);
      player.hopArc = Math.sin(player.animProgress * Math.PI) * HOP_HEIGHT;

      if (player.animProgress >= 1) {
        player.isMoving = false;
        player.hopArc = 0;
        player.pixelX = player.targetX;
        checkLandingCollision(s, soundRef.current!);

        // Dequeue next move
        if (!player.isDead && s.moveQueue.length > 0) {
          processMove(s.moveQueue.shift()!);
        }
      }
    } else {
      player.hopArc = 0;
    }

    // ── Log riding ──────────────────────────────────────────────────────────
    if (player.onLog && !player.isDead && !player.isMoving) {
      const lane = findCurrentLane(s) as RiverLane | undefined;
      if (lane?.type === 'river') {
        const log = lane.logs.find(l => l.id === player.onLog);
        if (log) {
          player.pixelX += log.speed * log.directionX * dt / 1000;
          player.col = Math.floor(player.pixelX / TILE_SIZE);
          if (player.pixelX < 0 || player.pixelX > CANVAS_WIDTH) {
            killPlayer(s, 'drowned', soundRef.current!);
          }
        } else {
          // Log disappeared
          killPlayer(s, 'drowned', soundRef.current!);
        }
      }
    }

    // ── Continuous car collision (while stationary) ─────────────────────────
    if (!player.isMoving && !player.isDead) {
      checkContinuousCollisions(s, soundRef.current!);
    }

    // ── Death animation ─────────────────────────────────────────────────────
    if (player.isDead) {
      player.deathAnimProgress = Math.min(1, player.deathAnimProgress + dt / 650);
      if (player.deathAnimProgress >= 1) {
        s.lives -= 1;
        if (s.lives <= 0) {
          s.phase = 'gameover';
          setPhase('gameover');
          setLives(0);
          setScore(s.score);
          setHighScore(s.highScore);
        } else {
          respawnPlayer(s);
          ensureLanes(s);
          setScore(0);
          setLives(s.lives);
        }
      }
    }

    // ── Sync UI state every ~10 frames ─────────────────────────────────────
    s.frameCount++;
    if (s.frameCount % 8 === 0) {
      setScore(s.score);
    }
  }, [processMove]);

  return {
    // ── React state (for UI) ────────────────────────────────────────────────
    phase,
    score,
    lives,
    highScore,
    difficulty,
    soundEnabled,

    // ── Ref (for canvas renderer — no re-render on access) ─────────────────
    stateRef,

    // ── Actions ─────────────────────────────────────────────────────────────
    startGame,
    move,
    pause,
    resume,
    update,
    toggleSound,
    goToMenu,
  };
}
