import { readStore, STORAGE_KEYS } from '~/utils/storage'
import type { User } from '~/types'

/**
 * Guards pages that need a session (account, payment).
 * localStorage only exists on the client, so the check is client-side;
 * the visitor is sent to /login with a redirect back to where they were.
 */
export default defineNuxtRouteMiddleware((to) => {
  if (import.meta.server) return

  const { user, ready } = useAuth()

  // Before the session plugin has run, read storage directly so a
  // hard refresh on a protected page never bounces a logged-in user.
  const current = ready.value ? user.value : readStore<User | null>(STORAGE_KEYS.user, null)

  if (!current?.isLoggedIn) {
    return navigateTo(`/login?redirect=${encodeURIComponent(to.fullPath)}`)
  }
})
