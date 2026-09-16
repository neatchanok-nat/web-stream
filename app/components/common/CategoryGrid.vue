<script setup lang="ts">
import { SearchX } from 'lucide-vue-next'
import type { Title } from '~/types'

/**
 * Responsive poster grid — 2 cols on phones, 3–4 on tablets, 5–6 on desktop.
 * Shared by Movies, Category and Search results.
 */
withDefaults(
  defineProps<{
    titles: Title[]
    density?: 'comfortable' | 'dense'
    emptyTitle?: string
    emptyHint?: string
  }>(),
  {
    density: 'comfortable',
    emptyTitle: 'ไม่พบเนื้อหาที่ตรงกับตัวกรอง',
    emptyHint: 'ลองปรับตัวกรองหรือเลือกหมวดหมู่อื่นดูนะ',
  },
)
</script>

<template>
  <div>
    <TransitionGroup
      v-if="titles.length"
      tag="div"
      name="grid"
      class="grid gap-x-3 gap-y-6 sm:gap-x-4 sm:gap-y-8"
      :class="
        density === 'dense'
          ? 'grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7'
          : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6'
      "
    >
      <MovieCard v-for="t in titles" :key="t.id" :title="t" />
    </TransitionGroup>

    <div
      v-else
      class="flex flex-col items-center justify-center rounded-2xl border border-dashed border-line px-6 py-20 text-center"
    >
      <span class="grid size-14 place-items-center rounded-2xl bg-surface text-lo">
        <SearchX class="size-7" />
      </span>
      <h3 class="mt-4 text-base font-semibold text-hi">{{ emptyTitle }}</h3>
      <p class="mt-1.5 max-w-sm text-sm text-lo">{{ emptyHint }}</p>
    </div>
  </div>
</template>

<style scoped>
.grid-enter-active,
.grid-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}
.grid-enter-from {
  opacity: 0;
  transform: translateY(12px) scale(0.97);
}
.grid-leave-to {
  opacity: 0;
  transform: scale(0.97);
}
.grid-leave-active {
  position: absolute;
}
</style>
