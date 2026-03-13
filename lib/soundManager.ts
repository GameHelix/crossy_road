// ──────────────────────────────────────────────────────────────────────────────
// Sound manager — synthesises all sounds via the Web Audio API (no file loads)
// ──────────────────────────────────────────────────────────────────────────────

export class SoundManager {
  private ctx: AudioContext | null = null;
  enabled = true;

  /** Lazily create (or resume) the AudioContext on first use. */
  private getCtx(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      try {
        this.ctx = new AudioContext();
      } catch {
        return null;
      }
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // ── Helper: create a simple envelope ─────────────────────────────────────

  private playTone(opts: {
    frequency: number;
    endFrequency?: number;
    duration: number;
    volume?: number;
    type?: OscillatorType;
    startTime?: number;
  }) {
    if (!this.enabled) return;
    const ctx = this.getCtx();
    if (!ctx) return;

    const { frequency, endFrequency, duration, volume = 0.25, type = 'square' } = opts;
    const t = ctx.currentTime + (opts.startTime ?? 0);

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = type;
    osc.frequency.setValueAtTime(frequency, t);
    if (endFrequency !== undefined) {
      osc.frequency.exponentialRampToValueAtTime(endFrequency, t + duration);
    }

    gain.gain.setValueAtTime(volume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

    osc.start(t);
    osc.stop(t + duration + 0.01);
  }

  // ── Public sound effects ──────────────────────────────────────────────────

  /** Short upward blip when the player hops. */
  playHop() {
    this.playTone({ frequency: 300, endFrequency: 600, duration: 0.08, type: 'sine', volume: 0.18 });
  }

  /** Low thunk when the player lands on a log. */
  playLand() {
    this.playTone({ frequency: 180, endFrequency: 120, duration: 0.1, type: 'sine', volume: 0.15 });
  }

  /** Descending wail on death. */
  playDeath() {
    this.playTone({ frequency: 440, endFrequency: 80, duration: 0.55, type: 'sawtooth', volume: 0.3 });
  }

  /** Rising jingle when a new high-score row is passed. */
  playScore() {
    // Three ascending blips
    [0, 0.08, 0.16].forEach((offset, i) => {
      this.playTone({
        frequency: 600 + i * 200,
        endFrequency: 900 + i * 200,
        duration: 0.07,
        type: 'sine',
        volume: 0.15,
        startTime: offset,
      });
    });
  }

  /** Splash when the player falls in water. */
  playSplash() {
    this.playTone({ frequency: 120, endFrequency: 60, duration: 0.3, type: 'sine', volume: 0.2 });
    this.playTone({ frequency: 200, endFrequency: 100, duration: 0.25, type: 'sine', volume: 0.12, startTime: 0.05 });
  }

  /** Short squeal when hit by a vehicle. */
  playHit() {
    this.playTone({ frequency: 800, endFrequency: 200, duration: 0.2, type: 'sawtooth', volume: 0.35 });
  }

  /** Cheerful chord on game start. */
  playStart() {
    [261.6, 329.6, 392.0].forEach((freq, i) => {
      this.playTone({ frequency: freq, duration: 0.4, type: 'sine', volume: 0.12, startTime: i * 0.07 });
    });
  }
}
