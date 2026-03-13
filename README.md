# 🐔 Crossy Road — Neon Edition

> Hop across roads and rivers endlessly. Frogger evolved — modern, addictive, and glowing neon.

A full-stack browser arcade game built with **Next.js 15**, **TypeScript**, **Tailwind CSS**, and **HTML5 Canvas**.

---

## Features

- **Infinite procedural world** — every game is unique, seeded per session
- **Smooth hop animations** — parabolic arc, hop shadow, direction-aware chicken
- **Three lane types** — safe grass, road with traffic, river with floating logs
- **Three difficulty levels** — Easy / Medium / Hard (speed, density, log width)
- **3 lives** — respawn at row 0 after each death
- **Persistent high score** — stored in `localStorage`
- **Synthesised sound effects** — Web Audio API, no audio files needed
- **Sound on/off toggle** — remembers your preference during the session
- **Pause / resume** — press `P` or `Esc`, or tap the pause button
- **Animated screens** — menu, pause overlay, game-over with new-record detection
- **Mobile-first** — swipe on canvas **or** use the on-screen D-pad
- **Keyboard support** — Arrow keys or WASD
- **Neon / synthwave aesthetic** — dark background, glow effects, neon colours
- **Zero config Vercel deploy** — works out of the box

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion |
| Rendering | HTML5 Canvas 2D |
| Sound | Web Audio API (synthesised) |
| State | React hooks + refs |
| Storage | `localStorage` (high score) |
| Deploy | Vercel (zero config) |

---

## Controls

### Keyboard
| Key | Action |
|---|---|
| `↑` / `W` | Move forward (up) |
| `↓` / `S` | Move backward (down) |
| `←` / `A` | Move left |
| `→` / `D` | Move right |
| `P` / `Esc` | Pause / resume |

### Mobile / Touch
| Gesture | Action |
|---|---|
| Swipe up | Move forward |
| Swipe down | Move backward |
| Swipe left | Move left |
| Swipe right | Move right |
| Tap | Move forward |
| On-screen D-pad | All directions |

---

## How to Run Locally

```bash
# 1. Clone the repo
git clone <your-repo-url>
cd crossy_road

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for production

```bash
npm run build
npm start
```

---

## Deploy to Vercel

The project is pre-configured for Vercel — no extra files needed.

1. Push to GitHub / GitLab / Bitbucket
2. Import the repo at [vercel.com/new](https://vercel.com/new)
3. Click **Deploy** — done

Or via the CLI:

```bash
npx vercel
```

---

## Project Structure

```
crossy_road/
├── app/
│   ├── globals.css          # Global styles & Tailwind import
│   ├── layout.tsx           # Root layout with metadata
│   └── page.tsx             # Main game page (orchestrates screens)
├── components/game/
│   ├── GameCanvas.tsx       # <canvas> host — render loop + input
│   ├── GameControls.tsx     # Mobile D-pad buttons
│   ├── GameMenu.tsx         # Main menu / difficulty picker
│   ├── GameOverScreen.tsx   # Animated game-over overlay
│   ├── GameUI.tsx           # HUD: score, lives, pause, sound
│   └── PauseScreen.tsx      # Pause overlay
├── hooks/
│   ├── useGameEngine.ts     # Core game logic, physics, collisions
│   ├── useGameLoop.ts       # requestAnimationFrame driver
│   └── useKeyboard.ts       # Keyboard event mapping
├── lib/
│   ├── colors.ts            # Neon colour palette
│   ├── constants.ts         # Tile size, speeds, difficulty tuning
│   ├── laneGenerator.ts     # Deterministic procedural lane gen
│   ├── renderer.ts          # All canvas draw functions
│   ├── soundManager.ts      # Web Audio API sound synthesis
│   └── types.ts             # TypeScript interfaces
└── public/
    └── favicon.svg          # Custom neon chicken favicon
```

---

## Gameplay Tips

- **Stay on the grass** to plan your next move — cars and logs won't kill you there.
- **River lanes**: you _must_ be on a log — standing in water kills you instantly.
- **Logs drift** — if you ride one too long without moving, you'll fall off the screen.
- **Hard mode** warning: logs can be as narrow as **one tile**.
