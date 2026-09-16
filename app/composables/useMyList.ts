import { readStore, removeStore, STORAGE_KEYS, writeStore } from '~/utils/storage'

/**
 * My List — `oneplay_my_list`
 * Stores content ids only; titles are resolved from the catalogue.
 */
const SEED_LIST = [
  'sr-khadi-lap-7',
  'mv-plerng-phayak',
  'dr-buang-rak',
  'mv-ruedu-tee-chan-kid',
  'sr-rahat-lap-phaya-nak',
  'sh-dudi-live-fest',
  'dr-wiman-fai',
  'mv-yutthakan-plon',
]

export function useMyList() {
  const ids = useState<string[]>('dudi:my-list', () => [])

  function persist() {
    writeStore(STORAGE_KEYS.myList, ids.value)
  }

  /**
   * Hydrate from storage. First-ever visit seeds a demo list so the
   * shelves are not empty, and writes it so the state is stable.
   */
  function restoreMyList() {
    const stored = readStore<string[] | null>(STORAGE_KEYS.myList, null)
    if (stored) {
      ids.value = stored
      return
    }
    ids.value = [...SEED_LIST]
    persist()
  }

  const has = (id: string) => ids.value.includes(id)
  const isInMyList = has

  function addToMyList(id: string) {
    if (has(id)) return
    ids.value = [id, ...ids.value]
    persist()
  }

  function removeFromMyList(id: string) {
    ids.value = ids.value.filter((x) => x !== id)
    persist()
  }

  /** Returns the new membership state. */
  function toggle(id: string): boolean {
    if (has(id)) removeFromMyList(id)
    else addToMyList(id)
    return has(id)
  }

  function clearMyList() {
    ids.value = []
    removeStore(STORAGE_KEYS.myList)
  }

  return {
    ids,
    has,
    isInMyList,
    toggle,
    addToMyList,
    removeFromMyList,
    clearMyList,
    restoreMyList,
    count: computed(() => ids.value.length),
  }
}

/** Creator follows stay session-only — not part of the persisted spec. */
export function useFollows() {
  const ids = useState<string[]>('dudi:follows', () => ['cr-jaew', 'cr-niran'])

  const has = (id: string) => ids.value.includes(id)
  const toggle = (id: string) => {
    ids.value = has(id) ? ids.value.filter((x) => x !== id) : [id, ...ids.value]
    return has(id)
  }

  return { ids, has, toggle }
}
