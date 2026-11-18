import type { Term } from './terms'

export interface Segment {
  text: string
  termId?: string
}

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/**
 * Cuts a text into plain parts and known terms (whole words, case-insensitive, longest form first,
 * each term marked once). `skip`: terms not to mark, e.g. already marked earlier on the screen.
 */
export function splitTerms(text: string, terms: Term[], skip: Set<string> = new Set()): Segment[] {
  const forms = terms
    .filter(t => !skip.has(t.id))
    .flatMap(t => t.match.map(m => ({ id: t.id, m })))
    .sort((a, b) => b.m.length - a.m.length)
  if (!forms.length) return text ? [{ text }] : []
  const re = new RegExp(`(?<![\\p{L}\\p{N}])(${forms.map(f => escape(f.m)).join('|')})(?![\\p{L}\\p{N}])`, 'giu')
  const byForm = new Map(forms.map(f => [f.m.toLocaleLowerCase('fr'), f.id]))

  const out: Segment[] = []
  const used = new Set<string>()
  let last = 0
  for (const hit of text.matchAll(re)) {
    const id = byForm.get(hit[0].toLocaleLowerCase('fr'))
    if (!id || used.has(id)) continue
    used.add(id)
    if (hit.index > last) out.push({ text: text.slice(last, hit.index) })
    out.push({ text: hit[0], termId: id })
    last = hit.index + hit[0].length
  }
  if (last < text.length) out.push({ text: text.slice(last) })
  return out
}
