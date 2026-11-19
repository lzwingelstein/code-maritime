/** Progress kept in this browser only (no account in the prototype). */
import { CARD_RENAMES } from '~/courses'
import { emptyProgress, migrateCards, parseProgress, type Progress } from '~/engine/progress'

const KEY = 'code-maritime:progress:v1'

function load(): Progress {
  try { return migrateCards(parseProgress(localStorage.getItem(KEY)), CARD_RENAMES) }
  catch { return emptyProgress() }
}

export function useProgress() {
  const progress = useState<Progress>('progress', load)
  function save(next: Progress) {
    progress.value = next
    try { localStorage.setItem(KEY, JSON.stringify(next)) }
    catch { /* private mode or full storage: progress lasts for this visit only */ }
  }
  return { progress, save, reset: () => save(emptyProgress()) }
}
