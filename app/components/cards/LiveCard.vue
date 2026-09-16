<script setup lang="ts">
import { Play } from 'lucide-vue-next'
import type { LiveStream } from '~/types'
import { landscapeArt } from '~/utils/artwork'
import { CREATOR_BY_ID, LIVE_CATEGORIES } from '~/data/live'

const props = defineProps<{ stream: LiveStream; width?: string }>()

const creator = computed(() => CREATOR_BY_ID.get(props.stream.creatorId))
const art = computed(() => landscapeArt(props.stream.artSeed))
const categoryLabel = computed(
  () => LIVE_CATEGORIES.find((c) => c.id === props.stream.category)?.label ?? props.stream.category,
)
</script>

<template>
  <article class="group/live" :style="width ? { width } : undefined">
    <NuxtLink :to="`/live/${stream.id}`" :aria-label="stream.title" class="block">
      <div
        class="relative aspect-video overflow-hidden rounded-xl bg-surface card-edge transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/live:-translate-y-1.5 group-hover/live:shadow-[0_30px_60px_-24px_#000]"
      >
        <img
          :src="art"
          :alt="stream.title"
          loading="lazy"
          decoding="async"
          class="size-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/live:scale-107"
        />
        <div
          class="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/25"
        />
        <div class="absolute inset-x-2.5 top-2.5 flex items-start justify-between gap-2">
          <LiveBadge :viewers="stream.viewers" />
          <TierBadge v-if="stream.isPremium" tier="premium" compact />
        </div>
        <span
          class="absolute right-2.5 bottom-2.5 rounded-md bg-black/70 px-1.5 py-0.5 text-[10px] font-medium text-white/80 backdrop-blur-sm"
        >
          {{ stream.startedAgo }}
        </span>

        <div
          class="absolute inset-0 grid place-items-center bg-black/25 opacity-0 transition-opacity duration-300 group-hover/live:opacity-100"
        >
          <span
            class="grid size-12 scale-75 place-items-center rounded-full bg-live text-white shadow-[0_10px_30px_-6px_var(--color-live)] transition-transform duration-300 group-hover/live:scale-100"
          >
            <Play class="size-5 translate-x-px fill-current" />
          </span>
        </div>

        <!-- live ring -->
        <div
          class="pointer-events-none absolute inset-0 rounded-xl ring-0 ring-live/0 transition-all duration-300 group-hover/live:ring-2 group-hover/live:ring-live/70"
        />
      </div>
    </NuxtLink>

    <div class="mt-3 flex gap-2.5">
      <NuxtLink :to="`/live/${stream.id}`" class="shrink-0">
        <AppAvatar
          v-if="creator"
          :name="creator.name"
          :seed="creator.avatarSeed"
          size="sm"
          live-ring
        />
      </NuxtLink>
      <div class="min-w-0 flex-1">
        <NuxtLink :to="`/live/${stream.id}`">
          <h3
            class="line-clamp-2 text-[13px] leading-snug font-semibold text-hi transition-colors group-hover/live:text-accent-200 sm:text-sm"
          >
            {{ stream.title }}
          </h3>
        </NuxtLink>
        <p class="mt-1 truncate text-[11px] text-mid sm:text-xs">{{ creator?.name }}</p>
        <p class="mt-0.5 truncate text-[11px] text-lo">{{ categoryLabel }}</p>
      </div>
    </div>
  </article>
</template>
