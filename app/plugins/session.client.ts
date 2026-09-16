/**
 * Restores every persisted slice of state from localStorage.
 *
 * Timing matters: pages are wrapped in <Suspense>, so `app:mounted`
 * fires while the page subtree is still hydrating. Restoring there
 * changes state mid-hydration and Vue reports a mismatch (and leaves
 * stale nodes in production). `app:suspense:resolve` + nextTick runs
 * once the page has fully hydrated, so the server HTML matches and
 * the UI simply updates afterwards.
 */
export default defineNuxtPlugin((nuxtApp) => {
  const { restoreSession } = useAuth()
  const { restoreSubscription } = useSubscription()
  const { restoreHistory } = useWatchHistory()
  const { restoreMyList } = useMyList()

  const restoreAll = () => {
    restoreSession()
    restoreSubscription()
    restoreHistory()
    restoreMyList()
  }

  nuxtApp.hook('app:suspense:resolve', () => nextTick(restoreAll))

  // Keep multiple tabs in sync — a logout in one tab lands in the others.
  if (import.meta.client) {
    window.addEventListener('storage', (e) => {
      if (e.key?.startsWith('oneplay_')) restoreAll()
    })
  }
})
