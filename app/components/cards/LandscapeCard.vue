<script setup lang="ts">
import { Play, Plus, Check } from 'lucide-vue-next'
import type { Title } from '~/types'
import { landscapeArt } from '~/utils/artwork'
import { formatRuntime, KIND_LABEL } from '~/utils/format'

const props = withDefaults(
  defineProps<{ title: Title; width?: string; showSynopsis?: boolean }>(),
  { showSynopsis: false },
)

const { has, toggle } = useMyList()
const art = computed(() => landscapeArt(props.title.artSeed))
const saved = computed(() => has(props.title.id))
const meta = computed(() =>
  [
    props.title.year.toString(),
    props.title.genres[0],
    props.title.runtime ? formatRuntime(props.title.runtime) : `${props.title.episodes ?? 0} ตอน`,
  ].filter(Boolean),
)
</script>

<template>
  <article class="group/land relative" :style="width ? { width } : undefined">
    <NuxtLink :to="`/movie/${title.id}`" :aria-label="title.title" class="block">
      <div
        class="relative aspect-video overflow-hidden rounded-xl bg-surface card-edge transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/land:-translate-y-1.5 group-hover/land:shadow-[0_30px_60px_-24px_#000]"
      >
        <img
          :src="art"
          :alt="`ภาพประกอบของ ${title.title}`"
          loading="lazy"
          decoding="async"
          class="size-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/land:scale-107"
        />
        <div class="absolute inset-0 scrim-b" />

        <div class="absolute inset-x-3 top-3 flex items-center justify-between gap-2">
          <TierBadge :tier="title.tier" compact />
          <span
            v-if="title.badges?.length"
            class="rounded-md bg-accent/90 px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-white uppercase"
          >
            {{ title.badges[0] }}
          </span>
        </div>

        <!-- centred play on hover -->
        <div
          class="absolute inset-0 grid place-items-center bg-black/25 opacity-0 transition-opacity duration-300 group-hover/land:opacity-100"
        >
          <span
            class="grid size-13 scale-75 place-items-center rounded-full bg-white/95 text-ink transition-transform duration-300 group-hover/land:scale-100"
          >
            <Play class="size-5.5 translate-x-px fill-current" />
          </span>
        </div>

        <div class="absolute inset-x-0 bottom-0 p-3.5 sm:p-4">
          <h3 class="line-clamp-1 text-sm font-semibold text-hi sm:text-[15px]">
            {{ title.title }}
          </h3>
          <p class="mt-1 flex flex-wrap items-center gap-x-1.5 text-[11px] text-white/60">
            <span>{{ KIND_LABEL[title.kind] }}</span>
            <template v-for="m in meta" :key="m">
              <span class="text-white/25">•</span><span>{{ m }}</span>
            </template>
          </p>
          <p v-if="showSynopsis" class="mt-1.5 line-clamp-2 text-xs leading-relaxed text-white/55">
            {{ title.synopsis }}
          </p>
        </div>
      </div>
    </NuxtLink>

    <button
      type="button"
      class="absolute top-3 right-3 z-10 grid size-8 place-items-center rounded-full bg-black/70 text-white opacity-0 ring-1 ring-white/15 backdrop-blur-sm transition-all duration-300 hover:bg-accent hover:ring-accent group-hover/land:opacity-100"
      :aria-label="saved ? 'นำออกจากรายการของฉัน' : 'เพิ่มในรายการของฉัน'"
      @click.stop.prevent="toggle(title.id)"
    >
      <Check v-if="saved" class="size-4" />
      <Plus v-else class="size-4" />
    </button>
  </article>
</template>
