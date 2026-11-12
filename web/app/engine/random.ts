/** A random source in [0, 1), injected so lessons are deterministic in tests. */
export type Random = () => number

/** Mulberry32: small, fast, good enough for shuffling questions. */
export function seeded(seed: number): Random {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6D2B79F5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function shuffle<T>(items: readonly T[], rng: Random): T[] {
  const a = [...items]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[a[i], a[j]] = [a[j]!, a[i]!]
  }
  return a
}

export function pick<T>(items: readonly T[], rng: Random): T {
  if (!items.length) throw new Error('pick: empty list')
  return items[Math.floor(rng() * items.length)]!
}

/** Picks an item with a probability proportional to its weight. */
export function pickWeighted<T>(items: readonly T[], weight: (item: T) => number, rng: Random): T {
  const weights = items.map(i => Math.max(0, weight(i)))
  const total = weights.reduce((a, b) => a + b, 0)
  if (total <= 0) return pick(items, rng)
  let r = rng() * total
  for (let i = 0; i < items.length; i++) {
    r -= weights[i]!
    if (r < 0) return items[i]!
  }
  return items[items.length - 1]!
}
