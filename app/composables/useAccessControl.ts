import type { AccessState, ContentItem, LiveStream, Title } from '~/types'
import { streamToContent, titleToContent, watchPath } from '~/utils/content'

/* ============================================================
   Access control — the single place that decides whether a
   play action proceeds, asks for login, or opens the lock modal.

   Rules (mirrors the product test matrix):
     free content      → anyone, including guests
     premium content   → must be logged in
                       → must hold an active paid plan
                       → expired plan shows the renew prompt
     premium live      → requires the PREMIUM plan specifically
   ============================================================ */

type Playable = ContentItem | Title | LiveStream

/** Accepts any mock-data shape and normalises it. */
export function toContentItem(input: Playable): ContentItem {
  if ('kind' in input) return titleToContent(input)
  if ('creatorId' in input) return streamToContent(input)
  return input
}

export interface LockModalState {
  open: boolean
  state: Exclude<AccessState, 'allow' | 'login'>
  content: ContentItem | null
}

export function useAccessControl() {
  const { isLoggedIn } = useAuth()
  const { subscription, currentPlan, isActive, isSubscriptionExpired } = useSubscription()

  const lock = useState<LockModalState>('dudi:lock-modal', () => ({
    open: false,
    state: 'premium',
    content: null,
  }))

  function checkAccess(input: Playable): AccessState {
    const content = toContentItem(input)

    // Free content never asks for anything.
    if (!content.isPremium) return 'allow'

    if (!isLoggedIn.value) return 'login'

    const sub = subscription.value
    if (!sub || sub.plan === 'free') return 'premium'
    if (isSubscriptionExpired(sub)) return 'expired'
    if (!isActive.value) return 'premium'

    // Premium live is a PREMIUM-plan perk; STANDARD gets an upgrade prompt.
    if (content.isLive && currentPlan.value !== 'premium') return 'upgrade'

    return 'allow'
  }

  const canAccess = (input: Playable) => checkAccess(input) === 'allow'

  function openLock(content: ContentItem, state: LockModalState['state']) {
    lock.value = { open: true, state, content }
  }

  function closeLock() {
    lock.value = { ...lock.value, open: false }
  }

  /**
   * Entry point for every play button.
   * Returns true when playback was allowed and navigation happened.
   */
  function requestPlay(input: Playable): boolean {
    const content = toContentItem(input)
    const state = checkAccess(content)
    const target = watchPath(content)

    if (state === 'allow') {
      navigateTo(target)
      return true
    }

    if (state === 'login') {
      navigateTo(`/login?redirect=${encodeURIComponent(target)}`)
      return false
    }

    openLock(content, state)
    return false
  }

  return { lock, checkAccess, canAccess, requestPlay, openLock, closeLock, watchPath }
}
