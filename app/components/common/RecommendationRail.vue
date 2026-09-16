<script setup lang="ts">
import type { ContinueItem, Creator, LiveStream, Title } from '~/types'

/**
 * One section = header + horizontal rail. The variant picks the card
 * component and its rail width, so every page composes rails the same way.
 */
withDefaults(
  defineProps<{
    heading: string
    subtitle?: string
    seeAllTo?: string
    variant?: 'poster' | 'landscape' | 'wide' | 'live' | 'continue' | 'creator'
    titles?: Title[]
    streams?: LiveStream[]
    creators?: Creator[]
    items?: ContinueItem[]
    ranked?: boolean
    live?: boolean
  }>(),
  { variant: 'poster' },
)

const WIDTHS = {
  poster: 'w-33 sm:w-38 lg:w-44',
  landscape: 'w-64 sm:w-76 lg:w-85',
  wide: 'w-70 sm:w-85 lg:w-100',
  live: 'w-68 sm:w-76 lg:w-84',
  continue: 'w-64 sm:w-76 lg:w-85',
  creator: 'w-44 sm:w-48',
} as const
</script>

<template>
  <section class="shell">
    <SectionHeader :title="heading" :subtitle="subtitle" :see-all-to="seeAllTo" :live="live" />

    <MediaRail :gap="variant === 'poster' ? 'sm' : 'md'">
      <template v-if="variant === 'poster'">
        <div
          v-for="(t, i) in titles"
          :key="t.id"
          class="shrink-0 snap-start"
          :class="[WIDTHS.poster, ranked && 'pl-1']"
        >
          <PosterCard :title="t" :rank="ranked ? i + 1 : undefined" />
        </div>
      </template>

      <template v-else-if="variant === 'landscape'">
        <div v-for="t in titles" :key="t.id" class="shrink-0 snap-start" :class="WIDTHS.landscape">
          <LandscapeCard :title="t" show-synopsis />
        </div>
      </template>

      <template v-else-if="variant === 'wide'">
        <div v-for="t in titles" :key="t.id" class="shrink-0 snap-start" :class="WIDTHS.wide">
          <WideCard :title="t" />
        </div>
      </template>

      <template v-else-if="variant === 'live'">
        <div v-for="s in streams" :key="s.id" class="shrink-0 snap-start" :class="WIDTHS.live">
          <LiveCard :stream="s" />
        </div>
      </template>

      <template v-else-if="variant === 'continue'">
        <div v-for="c in items" :key="c.id" class="shrink-0 snap-start" :class="WIDTHS.continue">
          <ContinueWatchingCard :item="c" />
        </div>
      </template>

      <template v-else-if="variant === 'creator'">
        <div v-for="c in creators" :key="c.id" class="shrink-0 snap-start" :class="WIDTHS.creator">
          <CreatorCard :creator="c" />
        </div>
      </template>
    </MediaRail>
  </section>
</template>
