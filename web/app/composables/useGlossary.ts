import { TERMS, type Term } from '~/glossary/terms'

/** The lexicon entry shown in the bottom sheet, shared app-wide. */
const openId = ref<string | null>(null)

export function useGlossary() {
  const current = computed<Term | null>(() => TERMS.find(t => t.id === openId.value) ?? null)
  return {
    current,
    open: (id: string) => { openId.value = id },
    close: () => { openId.value = null },
  }
}
