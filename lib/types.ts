// ──────────────────────────────────────────────────────────────────────────────
// Core game types
// ──────────────────────────────────────────────────────────────────────────────

export type GamePhase = 'menu' | 'playing' | 'paused' | 'gameover';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type Direction = 'up' | 'down' | 'left' | 'right';
export type LaneType = 'safe' | 'road' | 'river';
export type VehicleType = 'car' | 'truck' | 'bus';

// ── Entities ─────────────────────────────────────────────────────────────────

export interface Vehicle {
  id: string;
  x: number;          // center X in canvas pixels
  width: number;      // pixel width
  height: number;     // pixel height
  speed: number;      // pixels per second
  directionX: number; // 1 = right, -1 = left
  colorIndex: number; // index into VEHICLE_COLORS array
  type: VehicleType;
}

export interface Log {
  id: string;
  x: number;          // center X in canvas pixels
  width: number;      // pixel width
  speed: number;      // pixels per second
  directionX: number; // 1 = right, -1 = left
}

// ── Lanes ─────────────────────────────────────────────────────────────────────

export interface SafeLane {
  type: 'safe';
  row: number;
  trees: number[]; // column indices where trees are placed
}

export interface RoadLane {
  type: 'road';
  row: number;
  vehicles: Vehicle[];
  directionX: number;
}

export interface RiverLane {
  type: 'river';
  row: number;
  logs: Log[];
  directionX: number;
}

export type Lane = SafeLane | RoadLane | RiverLane;

// ── Player ────────────────────────────────────────────────────────────────────

export interface PlayerState {
  row: number;          // logical row (integer, updates immediately on input)
  col: number;          // logical column (integer)
  startRow: number;     // row at start of current hop (for camera interpolation)
  pixelX: number;       // current rendered X (animated)
  startX: number;       // X at start of current hop
  targetX: number;      // X target of current hop
  animProgress: number; // 0–1, hop animation progress
  isMoving: boolean;
  direction: Direction;
  hopArc: number;       // current vertical hop offset (pixels, for bounce effect)
  onLog: string | null; // ID of log being ridden, or null
  isDead: boolean;
  deathAnimProgress: number; // 0–1
}

// ── Full game state ───────────────────────────────────────────────────────────

export interface GameState {
  phase: GamePhase;
  score: number;
  highScore: number;
  lives: number;
  difficulty: Difficulty;
  player: PlayerState;
  lanes: Lane[];
  maxRow: number;           // furthest row ever reached this session
  moveQueue: Direction[];
  gameSeed: number;
  soundEnabled: boolean;
  frameCount: number;
}
