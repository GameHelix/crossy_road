// ──────────────────────────────────────────────────────────────────────────────
// Procedural lane generator — deterministic given (row, difficulty, gameSeed)
// ──────────────────────────────────────────────────────────────────────────────

import {
  Lane, SafeLane, RoadLane, RiverLane, Vehicle, Log,
  Difficulty, VehicleType,
} from './types';
import {
  COLS, TILE_SIZE, CANVAS_WIDTH,
  SAFE_INTERVAL, BLOCK_SIZE,
  CAR_SPEED, LOG_SPEED,
  VEHICLES_PER_LANE, LOGS_PER_LANE, LOG_WIDTH_TILES,
  VEHICLE_HEIGHT, VEHICLE_WIDTHS, LOG_HEIGHT,
} from './constants';

// ── Seeded PRNG (mulberry32) ──────────────────────────────────────────────────

function mulberry32(seed: number): () => number {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Returns a fresh RNG seeded by both the row index and the per-game seed. */
function rowRNG(row: number, gameSeed: number) {
  return mulberry32((row * 2654435761) ^ gameSeed ^ 0xdeadbeef);
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

// ── Lane-type decision ────────────────────────────────────────────────────────

/**
 * Returns true if the given world row should be a safe (grass) lane.
 * Row 0 is always safe (the starting row).
 * After that, safe rows appear every SAFE_INTERVAL rows to give the player
 * a place to rest.
 */
function isSafeRow(row: number, difficulty: Difficulty): boolean {
  if (row === 0) return true;
  const interval = SAFE_INTERVAL[difficulty];
  // Insert a safe row at multiples of interval
  return row % interval === 0;
}

/**
 * For non-safe rows, decide road vs river by block parity.
 * Each "block" is BLOCK_SIZE consecutive non-safe rows between two safe rows.
 * Odd blocks = road, even blocks = river (alternating).
 */
function laneTypeForRow(row: number, difficulty: Difficulty): 'road' | 'river' {
  const interval = SAFE_INTERVAL[difficulty];
  // Which non-safe segment does this row belong to?
  const segment = Math.floor(row / interval);
  return segment % 2 === 0 ? 'road' : 'river';
}

// ── Safe lane ─────────────────────────────────────────────────────────────────

function buildSafeLane(row: number, rng: () => number): SafeLane {
  const trees: number[] = [];
  // Place trees on left and right edges with some randomness;
  // never in the 5 central columns so the player always has room.
  for (let col = 0; col < COLS; col++) {
    const isEdge = col === 0 || col === COLS - 1;
    const isNearEdge = col === 1 || col === COLS - 2;
    if (isEdge && rng() > 0.3) trees.push(col);
    else if (isNearEdge && rng() > 0.6) trees.push(col);
  }
  return { type: 'safe', row, trees };
}

// ── Road lane ─────────────────────────────────────────────────────────────────

function buildRoadLane(
  row: number, difficulty: Difficulty, rng: () => number
): RoadLane {
  const directionX = rng() > 0.5 ? 1 : -1;
  const speedRange = CAR_SPEED[difficulty];
  const speed = lerp(speedRange.min, speedRange.max, rng());

  const countRange = VEHICLES_PER_LANE[difficulty];
  const count =
    Math.floor(lerp(countRange.min, countRange.max + 1, rng()));

  const vehicleTypes: VehicleType[] = ['car', 'car', 'car', 'truck', 'bus'];

  const vehicles: Vehicle[] = [];
  const spacing = CANVAS_WIDTH / count;

  for (let i = 0; i < count; i++) {
    const type = vehicleTypes[Math.floor(rng() * vehicleTypes.length)];
    const width = VEHICLE_WIDTHS[type];
    const colorIndex = Math.floor(rng() * 6);

    // Spread vehicles evenly, add some jitter
    const baseX = i * spacing + spacing / 2;
    const jitter = (rng() - 0.5) * spacing * 0.4;
    let x = baseX + jitter;
    // Clamp so vehicle doesn't start mostly off-screen
    x = Math.max(width / 2, Math.min(CANVAS_WIDTH - width / 2, x));

    vehicles.push({
      id: `v_${row}_${i}`,
      x,
      width,
      height: VEHICLE_HEIGHT,
      speed,
      directionX,
      colorIndex,
      type,
    });
  }

  return { type: 'road', row, vehicles, directionX };
}

// ── River lane ────────────────────────────────────────────────────────────────

function buildRiverLane(
  row: number, difficulty: Difficulty, rng: () => number
): RiverLane {
  const directionX = rng() > 0.5 ? 1 : -1;
  const speedRange = LOG_SPEED[difficulty];
  const speed = lerp(speedRange.min, speedRange.max, rng());

  const countRange = LOGS_PER_LANE[difficulty];
  const count = Math.floor(lerp(countRange.min, countRange.max + 1, rng()));

  const widthRange = LOG_WIDTH_TILES[difficulty];
  const spacing = CANVAS_WIDTH / count;

  const logs: Log[] = [];
  for (let i = 0; i < count; i++) {
    const widthTiles = lerp(widthRange.min, widthRange.max, rng());
    const width = widthTiles * TILE_SIZE;

    const baseX = i * spacing + spacing / 2;
    const jitter = (rng() - 0.5) * spacing * 0.3;
    let x = baseX + jitter;
    x = Math.max(width / 2, Math.min(CANVAS_WIDTH - width / 2, x));

    logs.push({
      id: `log_${row}_${i}`,
      x,
      width,
      speed,
      directionX,
    });
  }

  return { type: 'river', row, logs, directionX };
}

// ── Public API ────────────────────────────────────────────────────────────────

/** Generate a single lane for the given world row. */
export function generateLane(
  row: number, difficulty: Difficulty, gameSeed: number
): Lane {
  const rng = rowRNG(row, gameSeed);

  if (isSafeRow(row, difficulty)) {
    return buildSafeLane(row, rng);
  }

  const type = laneTypeForRow(row, difficulty);
  if (type === 'road') {
    return buildRoadLane(row, difficulty, rng);
  }
  return buildRiverLane(row, difficulty, rng);
}

/** Generate a range of lanes [fromRow, toRow] (inclusive). */
export function generateLaneRange(
  fromRow: number,
  toRow: number,
  difficulty: Difficulty,
  gameSeed: number,
  existing: Set<number>
): Lane[] {
  const result: Lane[] = [];
  for (let r = fromRow; r <= toRow; r++) {
    if (!existing.has(r)) {
      result.push(generateLane(r, difficulty, gameSeed));
    }
  }
  return result;
}
