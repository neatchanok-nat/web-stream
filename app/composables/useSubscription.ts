import type { PaymentMethod, PlanId, Subscription } from '~/types'
import { readStore, removeStore, STORAGE_KEYS, writeStore } from '~/utils/storage'

/* ============================================================
   Subscription state — one `oneplay_subscription` record.
   Expiry is a real date comparison, so a stored subscription
   flips to "expired" on its own once the date passes.
   ============================================================ */

export const PLAN_PRICES: Record<PlanId, number> = {
  free: 0,
  standard: 99,
  premium: 149,
}

export const PLAN_LABELS: Record<PlanId, string> = {
  free: 'FREE',
  standard: 'STANDARD',
  premium: 'PREMIUM',
}

/** Capability flags each plan unlocks — checked by access control. */
export const PLAN_FEATURES: Record<PlanId, string[]> = {
  free: ['free_content', 'free_live', 'sd_quality'],
  standard: [
    'free_content',
    'free_live',
    'premium_movies',
    'premium_drama',
    'catchup',
    'no_ads',
    'offline_limited',
    'hd_quality',
  ],
  premium: [
    'free_content',
    'free_live',
    'premium_movies',
    'premium_drama',
    'premium_live',
    'catchup',
    'no_ads',
    'offline_unlimited',
    'full_hd_quality',
    'originals',
  ],
}

export const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  qr: 'QR พร้อมเพย์',
  credit: 'บัตรเครดิต/เดบิต',
  truemoney: 'ทรูมันนี่ วอลเล็ท',
}

/** Thai-formatted date, e.g. 14 ตุลาคม 2569 */
export function formatThaiDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '-'
  return new Intl.DateTimeFormat('th-TH', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(d)
}

export function useSubscription() {
  const subscription = useState<Subscription | null>('dudi:subscription', () => null)

  function restoreSubscription() {
    subscription.value = readStore<Subscription | null>(STORAGE_KEYS.subscription, null)
  }

  function getSubscription(): Subscription | null {
    return subscription.value
  }

  function isSubscriptionExpired(sub = subscription.value): boolean {
    if (!sub) return false
    if (sub.status === 'expired') return true
    return new Date(sub.expiresAt).getTime() <= Date.now()
  }

  const expired = computed(() => isSubscriptionExpired())

  function hasActiveSubscription(): boolean {
    const sub = subscription.value
    return !!sub && sub.plan !== 'free' && !isSubscriptionExpired(sub)
  }

  const isActive = computed(() => hasActiveSubscription())

  /** Effective plan: falls back to free when nothing is active. */
  const currentPlan = computed<PlanId>(() => (isActive.value ? subscription.value!.plan : 'free'))

  const features = computed(() => PLAN_FEATURES[currentPlan.value])

  function hasFeature(flag: string): boolean {
    return features.value.includes(flag)
  }

  /** Days left before renewal — negative once expired. */
  const daysRemaining = computed(() => {
    const sub = subscription.value
    if (!sub) return 0
    return Math.ceil((new Date(sub.expiresAt).getTime() - Date.now()) / 86_400_000)
  })

  function activateSubscription(
    plan: PlanId,
    paymentMethod: PaymentMethod,
    months = 1,
    owner?: string,
  ): Subscription {
    const now = new Date()
    const expires = new Date(now)
    expires.setMonth(expires.getMonth() + months)

    const next: Subscription = {
      plan,
      status: 'active',
      startedAt: now.toISOString(),
      expiresAt: expires.toISOString(),
      paymentMethod,
      owner: owner ?? useAuth().user.value?.email,
    }
    subscription.value = next
    writeStore(STORAGE_KEYS.subscription, next)
    return next
  }

  /**
   * A subscription belongs to the account that bought it.
   * Signing in with an email always starts on FREE unless the stored
   * record was bought by that exact account — an unowned record (left
   * over from another session) is never inherited.
   */
  function reconcileOwner(email: string) {
    const sub = subscription.value
    if (sub && sub.owner !== email) clearSubscription()
  }

  /** Demo helper: back-dates the record so the expired flows can be tested. */
  function expireSubscription(): Subscription | null {
    const sub = subscription.value
    if (!sub) return null
    const yesterday = new Date(Date.now() - 86_400_000)
    const next: Subscription = { ...sub, status: 'expired', expiresAt: yesterday.toISOString() }
    subscription.value = next
    writeStore(STORAGE_KEYS.subscription, next)
    return next
  }

  function clearSubscription() {
    subscription.value = null
    removeStore(STORAGE_KEYS.subscription)
  }

  return {
    subscription,
    currentPlan,
    isActive,
    expired,
    features,
    daysRemaining,
    restoreSubscription,
    getSubscription,
    hasActiveSubscription,
    isSubscriptionExpired,
    hasFeature,
    activateSubscription,
    expireSubscription,
    clearSubscription,
    reconcileOwner,
  }
}
