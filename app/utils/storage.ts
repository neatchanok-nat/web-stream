/* ============================================================
   DUDI — localStorage access
   ------------------------------------------------------------
   The prototype has no backend: session, subscription and
   activity all live in the browser. Every read is guarded so
   SSR and private-mode browsers never throw.
   ============================================================ */

/** Storage keys — shared by every composable that persists state. */
export const STORAGE_KEYS = {
  user: 'oneplay_user',
  subscription: 'oneplay_subscription',
  watchHistory: 'oneplay_watch_history',
  myList: 'oneplay_my_list',
} as const

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS]

function available(): boolean {
  if (import.meta.server) return false
  try {
    return typeof window !== 'undefined' && !!window.localStorage
  } catch {
    return false
  }
}

/** Read and parse a key. Returns `fallback` when missing or corrupt. */
export function readStore<T>(key: StorageKey, fallback: T): T {
  if (!available()) return fallback
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    // Corrupt value — drop it so the app recovers on the next write.
    try {
      window.localStorage.removeItem(key)
    } catch {
      /* ignore */
    }
    return fallback
  }
}

/** Serialise a value under a key. No-ops when storage is unavailable. */
export function writeStore(key: StorageKey, value: unknown): void {
  if (!available()) return
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* quota or private mode — the in-memory state still works this session */
  }
}

export function removeStore(key: StorageKey): void {
  if (!available()) return
  try {
    window.localStorage.removeItem(key)
  } catch {
    /* ignore */
  }
}

/** Wipes every DUDI key — used by the developer demo panel. */
export function clearAllStore(): void {
  Object.values(STORAGE_KEYS).forEach((k) => removeStore(k))
}
