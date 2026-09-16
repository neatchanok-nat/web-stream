/* ============================================================
   DUDI — Content normaliser
   ------------------------------------------------------------
   Catalogue titles and live streams are two different shapes in
   the mock data. Access control, the lock modal and watch
   history all speak one shape: ContentItem.
   ============================================================ */

import type { ContentItem, LiveStream, Title } from '~/types'
import { LIVE_BY_ID, LIVE_CATEGORIES } from '~/data/live'
import { TITLE_BY_ID } from '~/data/catalog'
import { landscapeArt, backdropArt, posterArt } from './artwork'

export function titleToContent(t: Title): ContentItem {
  return {
    id: t.id,
    title: t.title,
    type: t.kind,
    thumbnail: posterArt(t.artSeed),
    backdrop: backdropArt(t.backdropSeed),
    description: t.synopsis,
    genre: t.genres,
    year: t.year,
    duration: t.runtime,
    isPremium: t.isPremium,
    isLive: false,
  }
}

export function streamToContent(s: LiveStream): ContentItem {
  return {
    id: s.id,
    title: s.title,
    type: 'live',
    thumbnail: landscapeArt(s.artSeed),
    backdrop: backdropArt(s.artSeed),
    description: s.description,
    genre: [LIVE_CATEGORIES.find((c) => c.id === s.category)?.label ?? s.category],
    year: new Date().getFullYear(),
    isPremium: s.isPremium,
    isLive: true,
  }
}

/** Resolve any catalogue or live id to a ContentItem. */
export function getContent(id: string): ContentItem | undefined {
  const title = TITLE_BY_ID.get(id)
  if (title) return titleToContent(title)
  const stream = LIVE_BY_ID.get(id)
  if (stream) return streamToContent(stream)
  return undefined
}

/** Where the play button for a piece of content should land. */
export function watchPath(content: Pick<ContentItem, 'id' | 'isLive'>): string {
  return content.isLive ? `/live/${content.id}` : `/watch/${content.id}`
}
