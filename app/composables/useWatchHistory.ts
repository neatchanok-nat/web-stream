import type { ContinueItem, WatchHistoryItem } from '~/types'
import { readStore, removeStore, STORAGE_KEYS, writeStore } from '~/utils/storage'
import { TITLE_BY_ID } from '~/data/catalog'
import { formatRuntime, KIND_LABEL } from '~/utils/format'

/* ============================================================
   Watch history — `oneplay_watch_history`
   Progress is mocked: the first play lands at 10%, each return
   visit advances the bar until the title is effectively done.
   ============================================================ */

const FIRST_PLAY_PROGRESS = 10
const RESUME_STEP = 35
const MAX_PROGRESS = 95

export function useWatchHistory() {
  const history = useState<WatchHistoryItem[]>('dudi:watch-history', () => [])

  function persist() {
    writeStore(STORAGE_KEYS.watchHistory, history.value)
  }

  function restoreHistory() {
    history.value = readStore<WatchHistoryItem[]>(STORAGE_KEYS.watchHistory, [])
  }

  /** Most recently watched first. */
  const recent = computed(() =>
    [...history.value].sort(
      (a, b) => new Date(b.lastWatched).getTime() - new Date(a.lastWatched).getTime(),
    ),
  )

  function getEntry(contentId: string): WatchHistoryItem | undefined {
    return history.value.find((h) => h.contentId === contentId)
  }

  function getProgress(contentId: string): number {
    return getEntry(contentId)?.progress ?? 0
  }

  /** Called when a player opens: creates the entry or advances it. */
  function recordWatch(contentId: string, progress?: number): WatchHistoryItem {
    const existing = getEntry(contentId)
    const next: WatchHistoryItem = {
      contentId,
      progress:
        progress ??
        (existing ? Math.min(MAX_PROGRESS, existing.progress + RESUME_STEP) : FIRST_PLAY_PROGRESS),
      lastWatched: new Date().toISOString(),
    }
    history.value = [next, ...history.value.filter((h) => h.contentId !== contentId)].slice(0, 40)
    persist()
    return next
  }

  function removeFromHistory(contentId: string) {
    history.value = history.value.filter((h) => h.contentId !== contentId)
    persist()
  }

  function clearHistory() {
    history.value = []
    removeStore(STORAGE_KEYS.watchHistory)
  }

  /**
   * Shapes history into the ContinueWatchingCard contract so the
   * existing "ดูต่อ" rail renders real activity without changes.
   */
  const continueWatching = computed<ContinueItem[]>(() =>
    recent.value
      .filter((h) => h.progress < MAX_PROGRESS)
      .map((h) => {
        const title = TITLE_BY_ID.get(h.contentId)
        if (!title) return null
        const total = title.runtime ?? 46
        const remaining = Math.max(1, Math.round((total * (100 - h.progress)) / 100))
        return {
          id: `cw-${h.contentId}`,
          titleId: title.id,
          title: title.title,
          episodeLabel: title.episodes
            ? `EP1 · ${KIND_LABEL[title.kind] ?? ''}`
            : (KIND_LABEL[title.kind] ?? ''),
          progress: h.progress,
          remainingLabel: `เหลืออีก ${formatRuntime(remaining)}`,
          artSeed: title.artSeed,
        } satisfies ContinueItem
      })
      .filter(Boolean) as ContinueItem[],
  )

  return {
    history,
    recent,
    continueWatching,
    restoreHistory,
    getEntry,
    getProgress,
    recordWatch,
    removeFromHistory,
    clearHistory,
  }
}
