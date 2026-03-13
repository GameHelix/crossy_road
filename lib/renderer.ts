// ──────────────────────────────────────────────────────────────────────────────
// Canvas renderer — all drawing logic in one file
// ──────────────────────────────────────────────────────────────────────────────

import { GameState, Lane, SafeLane, RoadLane, RiverLane, PlayerState } from './types';
import { COLORS } from './colors';
import {
  TILE_SIZE, CANVAS_WIDTH, CANVAS_HEIGHT, VISIBLE_ROWS,
  PLAYER_CANVAS_Y, LOG_HEIGHT, VEHICLE_HEIGHT,
} from './constants';

// ── Polyfill roundRect for older browsers ─────────────────────────────────────

if (typeof CanvasRenderingContext2D !== 'undefined' &&
    !CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function (
    x: number, y: number, w: number, h: number, r: number | number[]
  ) {
    const radius = typeof r === 'number' ? r : r[0];
    const rr = Math.min(radius, Math.abs(w) / 2, Math.abs(h) / 2);
    // Note: does NOT call beginPath — caller is responsible
    this.moveTo(x + rr, y);
    this.lineTo(x + w - rr, y);
    this.quadraticCurveTo(x + w, y, x + w, y + rr);
    this.lineTo(x + w, y + h - rr);
    this.quadraticCurveTo(x + w, y + h, x + w - rr, y + h);
    this.lineTo(x + rr, y + h);
    this.quadraticCurveTo(x, y + h, x, y + h - rr);
    this.lineTo(x, y + rr);
    this.quadraticCurveTo(x, y, x + rr, y);
    this.closePath();
  };
}

// ── Math helpers ──────────────────────────────────────────────────────────────

function easeInOutQuad(t: number): number {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

/** Camera world-Y: the world pixel-Y the camera tracks (rows go upward → higher row = higher worldY). */
function getCameraWorldY(player: PlayerState): number {
  if (!player.isMoving) return player.row * TILE_SIZE;
  const t = easeInOutQuad(player.animProgress);
  return player.startRow * TILE_SIZE + (player.row - player.startRow) * TILE_SIZE * t;
}

/** Canvas Y of the centre of a world row. */
function rowToCanvasY(worldRow: number, cameraWorldY: number): number {
  return PLAYER_CANVAS_Y - (worldRow * TILE_SIZE - cameraWorldY);
}

// ── Utility drawing helpers ───────────────────────────────────────────────────

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number
) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}

function glowFill(
  ctx: CanvasRenderingContext2D,
  color: string, glow: string, blur: number
) {
  ctx.shadowColor = glow;
  ctx.shadowBlur = blur;
  ctx.fillStyle = color;
  ctx.fill();
  ctx.shadowBlur = 0;
}

// ── Lane drawing ──────────────────────────────────────────────────────────────

function drawSafeLane(ctx: CanvasRenderingContext2D, lane: SafeLane, canvasY: number, tick: number) {
  const C = COLORS.safe;
  // Base grass
  ctx.fillStyle = C.base;
  ctx.fillRect(0, canvasY - TILE_SIZE / 2, CANVAS_WIDTH, TILE_SIZE);

  // Subtle stripe pattern
  ctx.fillStyle = C.stripe;
  for (let x = 0; x < CANVAS_WIDTH; x += 24) {
    ctx.fillRect(x, canvasY - TILE_SIZE / 2, 12, TILE_SIZE);
  }

  // Trees
  for (const col of lane.trees) {
    drawTree(ctx, col * TILE_SIZE + TILE_SIZE / 2, canvasY, tick);
  }
}

function drawTree(ctx: CanvasRenderingContext2D, cx: number, cy: number, tick: number) {
  const C = COLORS.safe;
  const wobble = Math.sin(tick * 0.002 + cx * 0.1) * 1.5;

  // Trunk
  ctx.fillStyle = C.treeTrunk;
  roundRect(ctx, cx - 5, cy + 4, 10, 18, 2);
  ctx.fill();

  // Foliage (3-layer triangle)
  ctx.shadowColor = C.accent;
  ctx.shadowBlur = 8;
  for (let i = 0; i < 3; i++) {
    const size = 16 - i * 3;
    ctx.fillStyle = i === 0 ? '#1a5a1a' : i === 1 ? '#1e6e1e' : '#22822';
    ctx.fillStyle = `hsl(${120 + i * 5}, 70%, ${18 + i * 4}%)`;
    ctx.beginPath();
    ctx.moveTo(cx + wobble, cy - 28 - i * 6);
    ctx.lineTo(cx - size + wobble, cy - 4 - i * 6);
    ctx.lineTo(cx + size + wobble, cy - 4 - i * 6);
    ctx.closePath();
    ctx.fill();
  }
  ctx.shadowBlur = 0;
}

function drawRoadLane(ctx: CanvasRenderingContext2D, lane: RoadLane, canvasY: number, tick: number) {
  const C = COLORS.road;
  const top = canvasY - TILE_SIZE / 2;

  // Asphalt base
  ctx.fillStyle = C.base;
  ctx.fillRect(0, top, CANVAS_WIDTH, TILE_SIZE);

  // Edge shoulder lines
  ctx.fillStyle = C.edge;
  ctx.fillRect(0, top, CANVAS_WIDTH, 3);
  ctx.fillRect(0, top + TILE_SIZE - 3, CANVAS_WIDTH, 3);

  // Dashed centre line (animated)
  const dashLen = 28;
  const gapLen = 16;
  const stride = dashLen + gapLen;
  const offset = ((tick * (lane.directionX > 0 ? 1 : -1) * 0.05) % stride + stride) % stride;

  ctx.shadowColor = C.lineGlow;
  ctx.shadowBlur = 6;
  ctx.fillStyle = C.line;
  for (let x = -stride + offset; x < CANVAS_WIDTH + stride; x += stride) {
    ctx.fillRect(x, canvasY - 2, dashLen, 4);
  }
  ctx.shadowBlur = 0;

  // Vehicles
  for (const v of lane.vehicles) {
    drawVehicle(ctx, v.x, canvasY, v.width, v.height, v.colorIndex, v.type);
  }
}

function drawVehicle(
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number, width: number, height: number,
  colorIndex: number, type: string
) {
  const C = COLORS.vehicles[colorIndex % COLORS.vehicles.length];
  const left = cx - width / 2;
  const top = cy - height / 2;
  const r = 6;

  // Body
  ctx.shadowColor = C.glow;
  ctx.shadowBlur = 14;
  ctx.fillStyle = C.body;
  roundRect(ctx, left, top, width, height, r);
  ctx.fill();

  // Roof (slightly lighter)
  const roofH = height * 0.45;
  const roofW = width * (type === 'car' ? 0.6 : 0.75);
  const roofX = left + (width - roofW) / 2;
  ctx.fillStyle = adjustColor(C.body, 30);
  roundRect(ctx, roofX, top - roofH * 0.6, roofW, roofH, r * 0.5);
  ctx.fill();

  // Headlights / taillights
  const lightsY = cy;
  const hSize = 4;
  // Front lights
  ctx.shadowColor = '#ffffff';
  ctx.shadowBlur = 10;
  ctx.fillStyle = '#ffffcc';
  ctx.beginPath();
  ctx.arc(cx + width * 0.38, lightsY, hSize, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx - width * 0.38, lightsY, hSize, 0, Math.PI * 2);
  ctx.fill();

  // Rear lights
  ctx.fillStyle = '#ff2222';
  ctx.beginPath();
  ctx.arc(cx + width * 0.38, lightsY, hSize * 0.8, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx - width * 0.38, lightsY, hSize * 0.8, 0, Math.PI * 2);
  ctx.fill();

  ctx.shadowBlur = 0;

  // Windows
  ctx.fillStyle = '#001133aa';
  const winW = width * 0.18;
  const winH = height * 0.3;
  const winY = top + height * 0.12;
  const cols = type === 'car' ? 2 : type === 'truck' ? 3 : 4;
  const colW = (width - 20) / cols;
  for (let i = 0; i < cols; i++) {
    roundRect(ctx, left + 10 + i * colW, winY, winW, winH, 2);
    ctx.fill();
  }
}

/** Slightly brightens a hex colour (naive, good enough for our palette). */
function adjustColor(hex: string, amount: number): string {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.min(255, ((n >> 16) & 0xff) + amount);
  const g = Math.min(255, ((n >> 8) & 0xff) + amount);
  const b = Math.min(255, (n & 0xff) + amount);
  return `rgb(${r},${g},${b})`;
}

function drawRiverLane(ctx: CanvasRenderingContext2D, lane: RiverLane, canvasY: number, tick: number) {
  const C = COLORS.river;
  const top = canvasY - TILE_SIZE / 2;

  // Water base
  ctx.fillStyle = C.base;
  ctx.fillRect(0, top, CANVAS_WIDTH, TILE_SIZE);

  // Animated wave stripes
  const waveOffset = (tick * lane.directionX * 0.06) % CANVAS_WIDTH;
  ctx.globalAlpha = 0.18;
  ctx.fillStyle = C.wave;
  for (let x = -80 + waveOffset; x < CANVAS_WIDTH + 80; x += 80) {
    ctx.beginPath();
    ctx.moveTo(x, top);
    for (let wx = 0; wx <= 80; wx += 4) {
      const wy = Math.sin(((wx / 80) + tick * 0.003 + x * 0.02) * Math.PI * 2) * 4;
      ctx.lineTo(x + wx, top + TILE_SIZE / 2 + wy);
    }
    ctx.lineTo(x + 80, top);
    ctx.closePath();
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // Subtle glow on water surface
  const grad = ctx.createLinearGradient(0, top, 0, top + TILE_SIZE);
  grad.addColorStop(0, C.foam);
  grad.addColorStop(1, 'transparent');
  ctx.fillStyle = grad;
  ctx.fillRect(0, top, CANVAS_WIDTH, TILE_SIZE);

  // Logs
  for (const log of lane.logs) {
    drawLog(ctx, log.x, canvasY, log.width, tick);
  }
}

function drawLog(ctx: CanvasRenderingContext2D, cx: number, cy: number, width: number, tick: number) {
  const C = COLORS.log;
  const left = cx - width / 2;
  const top = cy - LOG_HEIGHT / 2;
  const r = 8;

  // Glow
  ctx.shadowColor = C.glow;
  ctx.shadowBlur = 12;

  // Body
  ctx.fillStyle = C.base;
  roundRect(ctx, left, top, width, LOG_HEIGHT, r);
  ctx.fill();

  // Wood grain stripes (horizontal)
  ctx.shadowBlur = 0;
  ctx.strokeStyle = C.stripe;
  ctx.lineWidth = 2;
  const stripeCount = Math.floor(width / 20);
  for (let i = 1; i < stripeCount; i++) {
    const sx = left + (i / stripeCount) * width;
    ctx.beginPath();
    ctx.moveTo(sx, top + 4);
    ctx.lineTo(sx, top + LOG_HEIGHT - 4);
    ctx.stroke();
  }

  // End rings
  const ringW = 10;
  ctx.fillStyle = C.ring;
  roundRect(ctx, left, top, ringW, LOG_HEIGHT, r);
  ctx.fill();
  roundRect(ctx, left + width - ringW, top, ringW, LOG_HEIGHT, r);
  ctx.fill();
}

// ── Player drawing ────────────────────────────────────────────────────────────

function drawPlayer(ctx: CanvasRenderingContext2D, state: GameState, tick: number) {
  const p = state.player;
  const C = COLORS.player;

  const canvasY = PLAYER_CANVAS_Y - p.hopArc;
  const cx = p.pixelX;

  ctx.save();
  ctx.translate(cx, canvasY);

  // Rotate to face direction of travel
  const angle = { up: 0, right: Math.PI / 2, down: Math.PI, left: -Math.PI / 2 };
  ctx.rotate(angle[p.direction]);

  // Death animation: spin + shrink
  if (p.isDead) {
    const t = p.deathAnimProgress;
    const scale = Math.max(0, 1 - t * 0.9);
    const spin = t * Math.PI * 4;
    ctx.rotate(spin);
    ctx.scale(scale, scale);
    ctx.globalAlpha = Math.max(0, 1 - t * 1.2);
  }

  // Glow
  const glowColor = p.isDead ? C.dead : C.glow;
  ctx.shadowColor = glowColor;
  ctx.shadowBlur = p.isDead ? 20 : 12;

  // Body
  ctx.fillStyle = C.body;
  roundRect(ctx, -15, -18, 30, 34, 8);
  ctx.fill();

  // Head
  ctx.fillStyle = C.head;
  ctx.beginPath();
  ctx.arc(0, -28, 14, 0, Math.PI * 2);
  ctx.fill();

  // Comb
  ctx.fillStyle = C.comb;
  ctx.shadowColor = '#ff3344';
  ctx.shadowBlur = 6;
  for (let i = -1; i <= 1; i++) {
    ctx.beginPath();
    ctx.ellipse(i * 4, -43 + Math.abs(i) * 3, 3, 5, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.shadowColor = glowColor;
  ctx.shadowBlur = 8;

  // Eyes
  ctx.fillStyle = C.eye;
  ctx.beginPath(); ctx.arc(-5, -30, 3.5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(5, -30, 3.5, 0, Math.PI * 2); ctx.fill();
  // Eye shine
  ctx.fillStyle = '#ffffff';
  ctx.beginPath(); ctx.arc(-4, -31, 1.2, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(6, -31, 1.2, 0, Math.PI * 2); ctx.fill();

  // Beak
  ctx.fillStyle = C.beak;
  ctx.shadowColor = '#ff9900';
  ctx.shadowBlur = 4;
  ctx.beginPath();
  ctx.moveTo(-5, -24); ctx.lineTo(5, -24); ctx.lineTo(0, -17);
  ctx.closePath(); ctx.fill();

  ctx.shadowColor = glowColor; ctx.shadowBlur = 8;

  // Wings
  ctx.fillStyle = C.wing;
  ctx.beginPath(); ctx.ellipse(-19, -6, 7, 12, -0.3, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(19, -6, 7, 12, 0.3, 0, Math.PI * 2); ctx.fill();

  // Feet (bob with hop animation)
  const feetBob = Math.sin(p.animProgress * Math.PI) * 4;
  ctx.fillStyle = C.foot;
  ctx.shadowColor = '#ff6600'; ctx.shadowBlur = 4;
  roundRect(ctx, -13, 14 + feetBob, 10, 6, 2); ctx.fill();
  roundRect(ctx, 3, 14 + feetBob, 10, 6, 2); ctx.fill();

  ctx.shadowBlur = 0;
  ctx.globalAlpha = 1;
  ctx.restore();

  // Shadow on ground (ellipse below player)
  if (!p.isDead) {
    ctx.save();
    ctx.globalAlpha = 0.25 - p.hopArc * 0.006;
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    const shadowScale = Math.max(0.4, 1 - p.hopArc / (TILE_SIZE * 1.5));
    ctx.ellipse(cx, PLAYER_CANVAS_Y + 18, 14 * shadowScale, 5 * shadowScale, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.restore();
  }
}

// ── Grid overlay ──────────────────────────────────────────────────────────────

function drawGridOverlay(ctx: CanvasRenderingContext2D) {
  ctx.strokeStyle = '#ffffff06';
  ctx.lineWidth = 1;
  for (let col = 1; col < 9; col++) {
    ctx.beginPath();
    ctx.moveTo(col * TILE_SIZE, 0);
    ctx.lineTo(col * TILE_SIZE, CANVAS_HEIGHT);
    ctx.stroke();
  }
}

// ── Background ────────────────────────────────────────────────────────────────

function drawBackground(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = COLORS.background;
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

// ── Stars (decorative, parallax) ─────────────────────────────────────────────

function drawStars(ctx: CanvasRenderingContext2D, tick: number, cameraWorldY: number) {
  // Simple dot stars that stay fixed in the upper portion of the sky
  ctx.fillStyle = '#ffffff';
  const seed = 12345;
  for (let i = 0; i < 40; i++) {
    const sx = ((seed * (i + 1) * 7919) % CANVAS_WIDTH);
    const sy = ((seed * (i + 1) * 6271) % (CANVAS_HEIGHT * 0.35));
    const twinkle = 0.3 + 0.7 * Math.abs(Math.sin(tick * 0.001 + i));
    const r = (0.5 + (i % 3) * 0.5) * twinkle;
    ctx.globalAlpha = twinkle * 0.6;
    ctx.beginPath();
    ctx.arc(sx, sy, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

// ── Main render function ──────────────────────────────────────────────────────

export function renderFrame(
  ctx: CanvasRenderingContext2D,
  state: GameState,
  tick: number
) {
  drawBackground(ctx);
  drawStars(ctx, tick, 0);

  const cameraWorldY = getCameraWorldY(state.player);

  // Draw all visible lanes
  for (const lane of state.lanes) {
    const canvasY = rowToCanvasY(lane.row, cameraWorldY);

    // Only draw lanes that are on screen (with a margin)
    if (canvasY < -TILE_SIZE || canvasY > CANVAS_HEIGHT + TILE_SIZE) continue;

    switch (lane.type) {
      case 'safe':
        drawSafeLane(ctx, lane as SafeLane, canvasY, tick);
        break;
      case 'road':
        drawRoadLane(ctx, lane as RoadLane, canvasY, tick);
        break;
      case 'river':
        drawRiverLane(ctx, lane as RiverLane, canvasY, tick);
        break;
    }
  }

  drawGridOverlay(ctx);
  drawPlayer(ctx, state, tick);
}
