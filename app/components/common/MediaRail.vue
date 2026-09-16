<script setup lang="ts">
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

/**
 * Horizontal scrolling rail with desktop arrow affordances,
 * snap points on touch, and edge fading.
 */
withDefaults(defineProps<{ gap?: 'sm' | 'md' }>(), { gap: 'md' })

const scroller = ref<HTMLElement | null>(null)
const atStart = ref(true)
const atEnd = ref(false)

function measure() {
  const el = scroller.value
  if (!el) return
  atStart.value = el.scrollLeft < 8
  atEnd.value = el.scrollLeft + el.clientWidth >= el.scrollWidth - 8
}

function scrollByPage(dir: 1 | -1) {
  const el = scroller.value
  if (!el) return
  el.scrollBy({ left: dir * el.clientWidth * 0.86, behavior: 'smooth' })
}

onMounted(() => {
  measure()
  window.addEventListener('resize', measure, { passive: true })
})
onBeforeUnmount(() => window.removeEventListener('resize', measure))
</script>

<template>
  <div class="group/rail relative">
    <!-- arrows (pointer devices only) -->
    <button
      type="button"
      aria-label="เลื่อนไปทางซ้าย"
      class="absolute top-0 -left-3 bottom-10 z-20 hidden w-11 items-center justify-center rounded-l-xl bg-gradient-to-r from-ink via-ink/85 to-transparent text-hi opacity-0 transition-opacity duration-300 group-hover/rail:opacity-100 hover:from-ink hover:via-ink/95 lg:flex"
      :class="atStart && 'pointer-events-none !opacity-0'"
      @click="scrollByPage(-1)"
    >
      <ChevronLeft class="size-7" />
    </button>
    <button
      type="button"
      aria-label="เลื่อนไปทางขวา"
      class="absolute top-0 -right-3 bottom-10 z-20 hidden w-11 items-center justify-center rounded-r-xl bg-gradient-to-l from-ink via-ink/85 to-transparent text-hi opacity-0 transition-opacity duration-300 group-hover/rail:opacity-100 hover:from-ink hover:via-ink/95 lg:flex"
      :class="atEnd && 'pointer-events-none !opacity-0'"
      @click="scrollByPage(1)"
    >
      <ChevronRight class="size-7" />
    </button>

    <div
      ref="scroller"
      class="no-scrollbar flex snap-x snap-mandatory overflow-x-auto scroll-smooth pb-2"
      :class="gap === 'sm' ? 'gap-2.5 sm:gap-3' : 'gap-3 sm:gap-4'"
      @scroll.passive="measure"
    >
      <slot />
    </div>
  </div>
</template>
