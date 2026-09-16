<script setup lang="ts">
import { Play, Star } from 'lucide-vue-next'
import type { Title } from '~/types'
import { landscapeArt } from '~/utils/artwork'
import { formatCompact, formatRuntime, KIND_LABEL } from '~/utils/format'

const props = withDefaults(
  defineProps<{
    title: Title
    /** Link to the player instead of the detail page */
    toWatch?: boolean
    showSynopsis?: boolean
  }>(),
  { toWatch: false, showSynopsis: false },
)

const art = computed(() => props.title.imageUrl ?? landscapeArt(props.title.artSeed))
const to = computed(() => (props.toWatch ? `/watch/${props.title.id}` : `/movie/${props.title.id}`))
/** Deterministic mock view count so the row feels populated. */
const views = computed(() => 40_000 + ((props.title.id.length * 98_317) % 2_400_000))
</script>

<template>
  <NuxtLink
    :to="to"
    class="group/rec flex gap-3 rounded-xl p-2 transition-colors duration-300 hover:bg-white/6"
  >
    <div class="relative aspect-video w-36 shrink-0 overflow-hidden rounded-lg bg-surface sm:w-40">
      <img
        :src="art"
        :alt="title.title"
        loading="lazy"
        decoding="async"
        class="size-full object-cover transition-transform duration-700 group-hover/rec:scale-107"
        :class="title.imageUrl && 'object-top'"
      />
      <div
        class="absolute inset-0 grid place-items-center bg-black/35 opacity-0 transition-opacity duration-300 group-hover/rec:opacity-100"
      >
        <Play class="size-6 fill-white text-white" />
      </div>
      <span
        v-if="title.runtime"
        class="absolute right-1.5 bottom-1.5 rounded bg-black/75 px-1 text-[10px] font-medium text-white/90"
      >
        {{ formatRuntime(title.runtime) }}
      </span>
      <span
        v-else-if="title.episodes"
        class="absolute right-1.5 bottom-1.5 rounded bg-black/75 px-1 text-[10px] font-medium text-white/90"
      >
        {{ title.episodes }} ตอน
      </span>
    </div>

    <div class="min-w-0 flex-1 py-0.5">
      <h3
        class="line-clamp-2 text-[13px] leading-snug font-semibold text-hi transition-colors group-hover/rec:text-accent-200 sm:text-sm"
      >
        {{ title.title }}
      </h3>
      <p class="mt-1.5 flex flex-wrap items-center gap-x-1.5 text-[11px] text-lo">
        <span>{{ KIND_LABEL[title.kind] }}</span>
        <span class="text-white/20">•</span>
        <span>{{ title.year }}</span>
        <span class="text-white/20">•</span>
        <span class="inline-flex items-center gap-0.5">
          <Star class="size-2.5 fill-accent-300 text-accent-300" />{{ title.score.toFixed(1) }}
        </span>
      </p>
      <p class="mt-1 text-[11px] text-lo">ผู้ชม {{ formatCompact(views) }} ครั้ง</p>
      <p
        v-if="showSynopsis"
        class="mt-1.5 line-clamp-2 text-[11px] leading-relaxed text-mid"
      >
        {{ title.synopsis }}
      </p>
    </div>
  </NuxtLink>
</template>
