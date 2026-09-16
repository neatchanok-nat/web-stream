<script setup lang="ts">
import { Play, ListVideo } from 'lucide-vue-next'
import type { Title } from '~/types'
import { wideArt } from '~/utils/artwork'

const props = defineProps<{ title: Title; width?: string }>()
const art = computed(() => wideArt(props.title.artSeed))
</script>

<template>
  <NuxtLink
    :to="`/movie/${title.id}`"
    class="group/wide block"
    :style="width ? { width } : undefined"
    :aria-label="title.title"
  >
    <div
      class="relative aspect-16/10 overflow-hidden rounded-2xl bg-surface card-edge transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/wide:-translate-y-1.5 group-hover/wide:shadow-[0_30px_60px_-24px_#000]"
    >
      <img
        :src="art"
        :alt="title.title"
        loading="lazy"
        decoding="async"
        class="size-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/wide:scale-106"
      />
      <div class="absolute inset-0 scrim-b" />

      <div class="absolute inset-x-4 top-4 flex items-center justify-between">
        <span
          class="rounded-md bg-white/12 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-white/85 uppercase backdrop-blur-sm"
        >
          {{ title.genres[0] }}
        </span>
        <TierBadge :tier="title.tier" compact />
      </div>

      <div class="absolute inset-x-0 bottom-0 p-4">
        <h3 class="line-clamp-1 text-base font-bold text-hi sm:text-lg">{{ title.title }}</h3>
        <p class="mt-1 line-clamp-2 text-xs leading-relaxed text-white/60">
          {{ title.synopsis }}
        </p>
        <div class="mt-3 flex items-center gap-3">
          <span
            class="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-[11px] font-bold text-ink transition-transform duration-300 group-hover/wide:scale-105"
          >
            <Play class="size-3 fill-current" /> รับชม
          </span>
          <span v-if="title.episodes" class="inline-flex items-center gap-1 text-[11px] text-white/55">
            <ListVideo class="size-3.5" /> {{ title.episodes }} ตอน
          </span>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>
