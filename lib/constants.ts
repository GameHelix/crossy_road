// ──────────────────────────────────────────────────────────────────────────────
// Game constants — tweak here to tune difficulty / look & feel
// ──────────────────────────────────────────────────────────────────────────────

import { Difficulty } from './types';

// Grid
export const COLS = 9;
export const TILE_SIZE = 64;
export const VISIBLE_ROWS = 13;
export const CANVAS_WIDTH = COLS * TILE_SIZE;       // 576
export const CANVAS_HEIGHT = VISIBLE_ROWS * TILE_SIZE; // 832

// Player start position
export const PLAYER_START_COL = Math.floor(COLS / 2); // col 4 (centre)

// How many rows from the bottom the player appears on the canvas (0-indexed)
export const PLAYER_VIEW_ROW = 2;
// Pixel Y of the player's tile centre when at rest
export const PLAYER_CANVAS_Y =
  (VISIBLE_ROWS - 1 - PLAYER_VIEW_ROW) * TILE_SIZE + TILE_SIZE / 2; // 672

// Animation
export const MOVE_DURATION = 130; // ms for one hop
export const HOP_HEIGHT = 22;     // max arc height in pixels
export const CAMERA_LERP = 0.18;  // camera smoothing (0 = instant)

// Lives
export const INITIAL_LIVES = 3;

// Lane generation
export const LOOKAHEAD = 28;  // rows to pre-generate ahead of player
export const LOOKBEHIND = 8;  // rows to keep behind player

// How many safe rows before another cluster of road/river
export const SAFE_INTERVAL: Record<Difficulty, number> = {
  easy: 4,
  medium: 5,
  hard: 7,
};

// Block size = number of consecutive road/river lanes before next safe zone
export const BLOCK_SIZE: Record<Difficulty, number> = {
  easy: 2,
  medium: 3,
  hard: 4,
};

// Vehicle speed range (px / s)
export const CAR_SPEED: Record<Difficulty, { min: number; max: number }> = {
  easy:   { min: 80,  max: 140 },
  medium: { min: 120, max: 210 },
  hard:   { min: 180, max: 290 },
};

// Log speed range (px / s)
export const LOG_SPEED: Record<Difficulty, { min: number; max: number }> = {
  easy:   { min: 50,  max: 90  },
  medium: { min: 70,  max: 120 },
  hard:   { min: 100, max: 160 },
};

// Vehicles per road lane
export const VEHICLES_PER_LANE: Record<Difficulty, { min: number; max: number }> = {
  easy:   { min: 2, max: 3 },
  medium: { min: 2, max: 4 },
  hard:   { min: 3, max: 5 },
};

// Logs per river lane
export const LOGS_PER_LANE: Record<Difficulty, { min: number; max: number }> = {
  easy:   { min: 3, max: 4 },
  medium: { min: 2, max: 3 },
  hard:   { min: 2, max: 3 },
};

// Log width range (in tiles)
export const LOG_WIDTH_TILES: Record<Difficulty, { min: number; max: number }> = {
  easy:   { min: 3, max: 4 },
  medium: { min: 2, max: 3 },
  hard:   { min: 1, max: 2 },
};

// Collision hitboxes (half-widths in pixels)
export const PLAYER_HALF_HIT = 22;   // player hitbox half-width
export const VEHICLE_HIT_SHRINK = 6; // shrink vehicle hitbox each side

// Vehicle dimensions
export const VEHICLE_HEIGHT = TILE_SIZE * 0.7; // 44.8
export const VEHICLE_WIDTHS: Record<string, number> = {
  car:   TILE_SIZE * 1.2,
  truck: TILE_SIZE * 2.0,
  bus:   TILE_SIZE * 2.6,
};

// Log height
export const LOG_HEIGHT = TILE_SIZE * 0.55; // 35.2
