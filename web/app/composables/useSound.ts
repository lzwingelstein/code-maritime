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
