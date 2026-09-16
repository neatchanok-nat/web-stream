<script setup lang="ts">
import { Play, X, RotateCcw } from 'lucide-vue-next'
import type { ContinueItem } from '~/types'
import { landscapeArt } from '~/utils/artwork'
import { TITLE_BY_ID } from '~/data/catalog'

const props = defineProps<{ item: ContinueItem; width?: string }>()
const art = computed(() => landscapeArt(props.item.artSeed))

const { requestPlay } = useAccessControl()
const { removeFromHistory } = useWatchHistory()
const title = computed(() => TITLE_BY_ID.get(props.item.titleId))

function resume() {
  if (title.value) requestPlay(title.value)
  else navigateTo(`/watch/${props.item.titleId}`)
}
</script>

<template>
  <article class="group/cw relative" :style="width ? { width } : undefined">
    <NuxtLink
      :to="`/watch/${item.titleId}`"
      :aria-label="`ดูต่อ ${item.title}`"
      class="block"
      @click.prevent="resume"
    >
      <div
        class="relative aspect-video overflow-hidden rounded-xl bg-surface card-edge transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/cw:-translate-y-1.5 group-hover/cw:shadow-[0_30px_60px_-24px_#000]"
      >
        <img
          :src="art"
          :alt="item.title"
          loading="lazy"
          decoding="async"
          class="size-full object-cover opacity-90 transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/cw:scale-107"
        />
        <div class="absolute inset-0 scrim-b" />

        <!-- resume affordance -->
        <div
          class="absolute inset-0 grid place-items-center bg-black/30 opacity-0 transition-opacity duration-300 group-hover/cw:opacity-100"
        >
          <span
            class="grid size-12 scale-75 place-items-center rounded-full bg-white/95 text-ink transition-transform duration-300 group-hover/cw:scale-100"
          >
            <Play class="size-5 translate-x-px fill-current" />
          </span>
        </div>

        <span
          class="absolute right-3 bottom-4.5 rounded-md bg-black/70 px-1.5 py-0.5 text-[10px] font-medium text-white/85 backdrop-blur-sm"
        >
          {{ item.remainingLabel }}
        </span>

        <div class="absolute inset-x-0 bottom-0 px-3 pb-2.5">
          <ProgressBar :value="item.progress" size="xs" />
        </div>
      </div>
    </NuxtLink>

    <div class="mt-2.5 flex items-start justify-between gap-2 px-0.5">
      <div class="min-w-0">
        <h3 class="truncate text-[13px] font-semibold text-hi sm:text-sm">{{ item.title }}</h3>
        <p class="mt-0.5 truncate text-[11px] text-lo">{{ item.episodeLabel }}</p>
      </div>
      <div class="flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover/cw:opacity-100">
        <IconButton label="เริ่มดูใหม่ตั้งแต่ต้น" size="sm" @click="resume">
          <RotateCcw class="size-3.5" />
        </IconButton>
        <IconButton
          label="นำออกจากรายการดูต่อ"
          size="sm"
          @click="removeFromHistory(item.titleId)"
        >
          <X class="size-3.5" />
        </IconButton>
      </div>
    </div>
  </article>
</template>
