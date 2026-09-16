import type { User } from '~/types'
import { readStore, removeStore, STORAGE_KEYS, writeStore } from '~/utils/storage'

/* ============================================================
   Mock auth — no passwords are verified, nothing leaves the
   browser. The session is a single `oneplay_user` record.
   ============================================================ */

export const DEMO_USER: User = {
  id: 'usr-demo-001',
  name: 'ผู้ใช้ทดลอง DUDI',
  email: 'demo@dudi.co.th',
  isLoggedIn: true,
}

/** Derives a display name from an email when the user types their own. */
function nameFromEmail(email: string): string {
  const handle = email.split('@')[0] ?? 'สมาชิก'
  return handle
    .replace(/[._-]+/g, ' ')
    .replace(/\b\p{L}/gu, (c) => c.toUpperCase())
    .trim()
}

export function useAuth() {
  const user = useState<User | null>('dudi:user', () => null)
  /** True once localStorage has been read on the client. */
  const ready = useState<boolean>('dudi:session-ready', () => false)

  const isLoggedIn = computed(() => !!user.value?.isLoggedIn)

  /** Rehydrate from storage — called once after the app mounts. */
  function restoreSession() {
    user.value = readStore<User | null>(STORAGE_KEYS.user, null)
    ready.value = true
  }

  /**
   * Regular sign-in. The account starts on the FREE plan — premium
   * content stays locked until the subscription flow is completed.
   * A subscription bought by a different account is not inherited.
   */
  function login(email: string, options: { name?: string } = {}): User {
    const next: User = {
      id: `usr-${email.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 12) || 'guest'}`,
      name: options.name ?? nameFromEmail(email),
      email: email.trim(),
      isLoggedIn: true,
    }
    user.value = next
    writeStore(STORAGE_KEYS.user, next)
    useSubscription().reconcileOwner(next.email)
    return next
  }

  /**
   * Demo shortcut: signs in and grants an active PREMIUM plan so every
   * gated flow can be explored without going through checkout.
   */
  function loginAsDemo(): User {
    user.value = DEMO_USER
    writeStore(STORAGE_KEYS.user, DEMO_USER)

    const { subscription, hasActiveSubscription, activateSubscription } = useSubscription()
    const ownedByDemo = subscription.value?.owner === DEMO_USER.email
    if (!ownedByDemo || !hasActiveSubscription()) {
      activateSubscription('premium', 'qr', 1, DEMO_USER.email)
    }
    return DEMO_USER
  }

  /** Clears the session only — the subscription record is kept on purpose. */
  function logout() {
    user.value = null
    removeStore(STORAGE_KEYS.user)
  }

  function getCurrentUser(): User | null {
    return user.value
  }

  return {
    user,
    ready,
    isLoggedIn,
    restoreSession,
    login,
    loginAsDemo,
    logout,
    getCurrentUser,
  }
}
