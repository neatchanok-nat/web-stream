/* ============================================================
   DUDI — Domain types
   Frontend prototype: content comes from local mock data,
   session state lives in localStorage. No backend.
   ============================================================ */

export type ContentKind = 'movie' | 'drama' | 'series' | 'show' | 'concert'

export type AccessTier = 'free' | 'premium'

/* ------------------------------------------------------------
   Session · subscription · activity
   ------------------------------------------------------------ */

export interface User {
  id: string
  name: string
  email: string
  isLoggedIn: true
}

export type PlanId = 'free' | 'standard' | 'premium'
export type PaymentMethod = 'qr' | 'credit' | 'truemoney'
export type SubscriptionStatus = 'active' | 'expired'

export interface Subscription {
  plan: PlanId
  status: SubscriptionStatus
  /** ISO date string */
  startedAt: string
  /** ISO date string */
  expiresAt: string
  paymentMethod: PaymentMethod
  /** Email of the account that bought it — a different login starts on FREE */
  owner?: string
}

export interface WatchHistoryItem {
  contentId: string
  /** 0–100 */
  progress: number
  /** ISO date string */
  lastWatched: string
}

/** What every access check and play action is evaluated against. */
export interface ContentItem {
  id: string
  title: string
  type: ContentKind | 'live'
  thumbnail: string
  backdrop: string
  description: string
  genre: string[]
  year: number
  /** Minutes for on-demand, undefined for live */
  duration?: number
  isPremium: boolean
  isLive: boolean
}

/** Outcome of an access check — drives routing and the lock modal. */
export type AccessState = 'allow' | 'login' | 'premium' | 'expired' | 'upgrade'

export interface Person {
  id: string
  name: string
  role: string
}

export interface Title {
  id: string
  kind: ContentKind
  title: string
  titleEn?: string
  /** Short marketing line shown above the hero title */
  tagline?: string
  synopsis: string
  year: number
  /** Thai content rating, e.g. "ท", "น 13+", "น 18+" */
  rating: string
  /** Runtime in minutes (movies) — undefined for episodic content */
  runtime?: number
  episodes?: number
  seasons?: number
  genres: string[]
  tier: AccessTier
  /** Mirrors `tier` — the flag access control reads */
  isPremium: boolean
  /** Always false for catalogue titles; true only for live streams */
  isLive: false
  /** 0–10 */
  score: number
  cast: Person[]
  /** Seeds drive the generated cinematic artwork */
  artSeed: string
  backdropSeed: string
  badges?: string[]
  trailerLength?: string
  /** HLS (.m3u8) source — when set the player streams it for real */
  videoUrl?: string
  /** Real key art — replaces the generated artwork everywhere when set */
  imageUrl?: string
}

export interface ContinueItem {
  id: string
  titleId: string
  title: string
  episodeLabel: string
  /** 0–100 */
  progress: number
  remainingLabel: string
  artSeed: string
}

export interface Creator {
  id: string
  name: string
  handle: string
  category: string
  followers: number
  verified: boolean
  avatarSeed: string
  bio: string
}

export interface LiveStream {
  id: string
  title: string
  creatorId: string
  category: string
  viewers: number
  startedAgo: string
  artSeed: string
  description: string
  tags: string[]
  featured?: boolean
  /** Premium live requires an active PREMIUM plan */
  isPremium: boolean
  isLive: true
}

export interface ChatMessage {
  id: string
  user: string
  message: string
  colorIndex: number
  isModerator?: boolean
  isCreator?: boolean
}

export interface PricingPlan {
  id: string
  name: string
  price: number
  priceLabel: string
  period: string
  blurb: string
  features: { label: string; included: boolean }[]
  cta: string
  highlight?: boolean
  badge?: string
}

export interface Rail {
  id: string
  title: string
  subtitle?: string
  seeAllTo: string
}
