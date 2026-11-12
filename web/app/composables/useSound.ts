/** Tiny Web Audio feedback sounds; silently does nothing where audio is unavailable. */
let ctx: AudioContext | null = null

function tones(freqs: number[], duration = 0.12, type: OscillatorType = 'sine', gap = 0.09) {
  try {
    ctx ??= new AudioContext()
    freqs.forEach((f, i) => {
      const o = ctx!.createOscillator()
      const g = ctx!.createGain()
      const t = ctx!.currentTime + i * gap
      o.type = type
      o.frequency.value = f
      g.gain.setValueAtTime(0.0001, t)
      g.gain.exponentialRampToValueAtTime(0.16, t + 0.01)
      g.gain.exponentialRampToValueAtTime(0.0001, t + duration)
      o.connect(g).connect(ctx!.destination)
      o.start(t)
      o.stop(t + duration + 0.02)
    })
  }
  catch { /* no audio */ }
}

/** Compressed timings so a signal plays in a few seconds (real ones: short ≈ 1 s, prolonged 4 to 6 s). */
export const HORN_MS = { short: 600, long: 2200, bell: 2500, gap: 450 } as const

/** Plays a horn or bell pattern; returns its duration in ms. */
export function playHorn(pattern: readonly ('short' | 'long' | 'bell')[]): number {
  let t = 0
  try {
    ctx ??= new AudioContext()
    const start = ctx.currentTime + 0.05
    for (const note of pattern) {
      const len = HORN_MS[note] / 1000
      if (note === 'bell') {
        for (let k = 0; k < len / 0.22; k++) ring(start + t + k * 0.22, 0.2)
      }
      else horn(start + t, len)
      t += len + HORN_MS.gap / 1000
    }
  }
  catch { /* no audio */ }
  return t * 1000
}

function horn(at: number, len: number) {
  for (const f of [155, 233]) {
    const o = ctx!.createOscillator()
    const g = ctx!.createGain()
    o.type = 'sawtooth'
    o.frequency.value = f
    g.gain.setValueAtTime(0.0001, at)
    g.gain.exponentialRampToValueAtTime(0.07, at + 0.04)
    g.gain.setValueAtTime(0.07, at + len - 0.05)
    g.gain.exponentialRampToValueAtTime(0.0001, at + len)
    o.connect(g).connect(ctx!.destination)
    o.start(at)
    o.stop(at + len + 0.02)
  }
}

function ring(at: number, len: number) {
  const o = ctx!.createOscillator()
  const g = ctx!.createGain()
  o.type = 'triangle'
  o.frequency.value = 1320
  g.gain.setValueAtTime(0.12, at)
  g.gain.exponentialRampToValueAtTime(0.0001, at + len)
  o.connect(g).connect(ctx!.destination)
  o.start(at)
  o.stop(at + len + 0.02)
}

export function useSound() {
  return {
    tap: () => tones([520], 0.05),
    right: () => tones([660, 880]),
    wrong: () => {
      tones([200, 150], 0.18, 'square', 0.12)
      try { navigator.vibrate?.(120) }
      catch { /* no vibration */ }
    },
    win: () => tones([523, 659, 784, 1046], 0.18, 'triangle', 0.11),
  }
}
