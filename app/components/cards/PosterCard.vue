<script setup lang="ts">
import { Play, Plus, Check, Star } from 'lucide-vue-next'
import type { Title } from '~/types'
import { posterArt } from '~/utils/artwork'
import { KIND_LABEL } from '~/utils/format'

const props = withDefaults(
  defineProps<{
    title: Title
    /** Rail usage: title only. Grid usage: title + genre + year. */
    dense?: boolean
    /** Renders a large ranking numeral over the artwork */
    rank?: number
    /** Fixed width for horizontal rails */
    width?: string
  }>(),
  { dense: false },
)

const { has, toggle } = useMyList()
const art = computed(() => props.title.imageUrl ?? posterArt(props.title.artSeed))
const saved = computed(() => has(props.title.id))
</script>

<template>
  <article class="group/card relative" :style="width ? { width } : undefined">
    <NuxtLink
      :to="`/movie/${title.id}`"
      class="block focus-visible:outline-none"
      :aria-label="title.title"
    >
      <div
        class="relative aspect-[196/283] overflow-hidden rounded-xs bg-surface transition-all duration-300 group-hover/card:-translate-y-1 group-hover/card:shadow-[0_24px_50px_-26px_#000] group-focus-within/card:-translate-y-1"
      >
        <img
          :src="art"
          :alt="`ภาพปกของ ${title.title}`"
          loading="lazy"
          decoding="async"
          class="size-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/card:scale-108"
        />

        <!-- hover scrim + play affordance -->
        <div
          class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover/card:opacity-100"
        />
        <div
          class="absolute inset-0 grid place-items-center opacity-0 transition-all duration-300 group-hover/card:opacity-100"
        >
          <span
            class="grid size-12 scale-75 place-items-center rounded-full bg-accent text-white shadow-[0_12px_30px_-8px_rgba(0,0,0,0.8)] transition-transform duration-300 group-hover/card:scale-100"
          >
            <Play class="size-5 translate-x-px fill-current" />
          </span>
        </div>

        <!-- ring highlight -->
        <div
          class="pointer-events-none absolute inset-0 rounded-xs ring-0 ring-accent/0 transition-all duration-300 group-hover/card:ring-2 group-hover/card:ring-accent/70"
        />

        <!-- top badges -->
        <div class="absolute inset-x-2 top-2 flex items-start justify-between gap-2">
          <TierBadge :tier="title.tier" compact />
          <span
            class="inline-flex h-5 items-center gap-0.5 rounded-md bg-black/60 px-1.5 text-[10px] font-bold text-white backdrop-blur-sm"
          >
            <Star class="size-2.5 fill-accent-300 text-accent-300" />
            {{ title.score.toFixed(1) }}
          </span>
        </div>

        <!-- ranking numeral -->
        <span
          v-if="rank"
          class="pointer-events-none absolute -bottom-3 left-1 font-sans text-[86px] leading-none font-extrabold text-white/95 drop-shadow-[0_6px_14px_rgba(0,0,0,0.7)]"
          style="-webkit-text-stroke: 3px rgba(11, 11, 15, 0.9)"
          aria-hidden="true"
        >
          {{ rank }}
        </span>
      </div>
    </NuxtLink>

    <!-- quick add -->
    <button
      type="button"
      class="absolute top-2.5 right-2.5 z-10 grid size-8 translate-y-1 place-items-center rounded-full bg-black/70 text-white opacity-0 ring-1 ring-white/15 backdrop-blur-sm transition-all duration-300 hover:bg-accent hover:ring-accent group-hover/card:translate-y-9 group-hover/card:opacity-100 focus-visible:translate-y-9 focus-visible:opacity-100"
      :aria-label="saved ? `นำ ${title.title} ออกจากรายการของฉัน` : `เพิ่ม ${title.title} ในรายการของฉัน`"
      @click.stop.prevent="toggle(title.id)"
    >
      <Check v-if="saved" class="size-4" />
      <Plus v-else class="size-4" />
    </button>

    <!-- content block mirrors iHaveTicket's .product-card .content -->
    <div class="pt-3 pr-2">
      <h3
        class="line-clamp-2 text-sm leading-[1.1] font-semibold text-hi sm:text-lg"
        :class="dense ? 'sm:text-base' : ''"
      >
        {{ title.title }}
      </h3>
      <p v-if="!dense" class="mt-2 truncate text-xs text-mid sm:mt-4 sm:text-sm">
        {{ title.genres[0] }} · {{ title.year }} · {{ KIND_LABEL[title.kind] }}
      </p>
    </div>
  </article>
</template>
