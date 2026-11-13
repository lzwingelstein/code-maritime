/** Splits a paragraph into sentences (one idea per line), keeping **bold** markers. */
export function sentences(text: string): string[] {
  return text
    .split(/(?<=[.!?…])\s+(?=\*\*|[A-ZÀÂÉÈÊÎÔÙÛÇ«])/u)
    .map(s => s.trim())
    .filter(Boolean)
}
