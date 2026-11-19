/** International phonetic alphabet (ITU), one card per letter, and short words to spell on the radio. */

export const PHONETIC: readonly [string, string][] = [
  ['A', 'Alpha'], ['B', 'Bravo'], ['C', 'Charlie'], ['D', 'Delta'], ['E', 'Echo'], ['F', 'Foxtrot'], ['G', 'Golf'],
  ['H', 'Hotel'], ['I', 'India'], ['J', 'Juliett'], ['K', 'Kilo'], ['L', 'Lima'], ['M', 'Mike'], ['N', 'November'],
  ['O', 'Oscar'], ['P', 'Papa'], ['Q', 'Quebec'], ['R', 'Romeo'], ['S', 'Sierra'], ['T', 'Tango'], ['U', 'Uniform'],
  ['V', 'Victor'], ['W', 'Whiskey'], ['X', 'X-ray'], ['Y', 'Yankee'], ['Z', 'Zulu'],
]

export const cardOf = (letter: string) => `letter-${letter.toLowerCase()}`
export const letterOf = (cardId: string) => cardId.slice(-1).toUpperCase()
export const wordOf = (letter: string) => PHONETIC.find(([l]) => l === letter)![1]

export const ALPHABET_CARDS = PHONETIC.map(([l]) => cardOf(l))

/** Words and boat names to spell; together they hold every letter (tested). */
export const SPELL_WORDS = [
  'CAP', 'MER', 'PORT', 'QUAI', 'VENT', 'SUD', 'NORD', 'FEU', 'LUNE', 'HAVRE', 'GOLFE', 'BRISE',
  'JUSANT', 'KAYAK', 'ZEPHYR', 'AJAX', 'KIWI',
] as const

/** Spelt on the radio: « KAYAK » → Kilo Alpha Yankee Alpha Kilo. */
export const spell = (word: string) => [...word].map(wordOf)
