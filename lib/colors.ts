// ──────────────────────────────────────────────────────────────────────────────
// Neon / synthwave colour palette — one place to change the whole look
// ──────────────────────────────────────────────────────────────────────────────

export const COLORS = {
  // Scene background
  background: '#0d0d1a',

  // Safe (grass) lanes
  safe: {
    base:   '#0e1f0e',
    stripe: '#122413',
    tree:   '#1a4a1a',
    treeTrunk: '#5c3a1e',
    treeGlow: '#00ff4422',
    accent: '#00ff44',
  },

  // Road lanes
  road: {
    base:     '#181824',
    shoulder: '#22222e',
    line:     '#ffdd00',
    lineGlow: '#ffdd0066',
    edge:     '#ffffff18',
  },

  // River lanes
  river: {
    base:  '#060d1f',
    water: '#0033aa',
    wave:  '#0055cc',
    foam:  '#4499ff33',
    glow:  '#0088ff',
  },

  // Player (chicken)
  player: {
    body:   '#f0f0f0',
    head:   '#f5f5f5',
    beak:   '#ff9900',
    eye:    '#111122',
    wing:   '#e0e0e0',
    foot:   '#ff6600',
    comb:   '#ff3344',
    glow:   '#00ffaa',
    danger: '#ff2222',
    dead:   '#ff4400',
  },

  // Vehicles — neon colours (accessed by colorIndex)
  vehicles: [
    { body: '#cc0033', glow: '#ff003388', light: '#ff6680' }, // red
    { body: '#6600cc', glow: '#7700ff88', light: '#aa66ff' }, // purple
    { body: '#cc6600', glow: '#ff770088', light: '#ffaa44' }, // orange
    { body: '#006699', glow: '#0099cc88', light: '#44ccff' }, // cyan
    { body: '#aacc00', glow: '#ccff0088', light: '#eeff66' }, // yellow-green
    { body: '#cc0099', glow: '#ff00cc88', light: '#ff88ee' }, // pink
  ],

  // Logs
  log: {
    base:   '#4a2800',
    stripe: '#5c3300',
    ring:   '#6e4a1a',
    glow:   '#ff880033',
  },

  // HUD / UI
  ui: {
    primary:   '#00ffaa',
    secondary: '#7700ff',
    danger:    '#ff003c',
    warning:   '#ffdd00',
    text:      '#ffffff',
    textDim:   '#aaaacc',
    panel:     '#0d0d1a',
    panelGlow: '#00ffaa22',
  },
} as const;
