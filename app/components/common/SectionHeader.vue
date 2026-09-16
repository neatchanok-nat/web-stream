<script setup lang="ts">
import { ChevronRight } from 'lucide-vue-next'

withDefaults(
  defineProps<{
    title: string
    subtitle?: string
    seeAllTo?: string
    seeAllLabel?: string
    /** Red dot accent for live sections */
    live?: boolean
    size?: 'md' | 'lg'
  }>(),
  { seeAllLabel: 'ดูทั้งหมด', size: 'md' },
)
</script>

<template>
  <div class="mb-5 flex items-end justify-between gap-4 sm:mb-6">
    <div class="min-w-0">
      <h2
        class="flex items-center gap-2.5 font-semibold text-hi"
        :class="
          size === 'lg'
            ? 'text-[28px] leading-[34px] lg:text-[36px] lg:leading-[44px]'
            : 'text-[24px] leading-[30px] sm:text-[28px] sm:leading-[34px] lg:text-[32px] lg:leading-10'
        "
      >
        <span
          v-if="live"
          class="size-2.5 shrink-0 rounded-full bg-live shadow-[0_0_12px_var(--color-live)] animate-live-pulse"
          aria-hidden="true"
        />
        <span class="truncate">{{ title }}</span>
      </h2>
      <p v-if="subtitle" class="mt-1 line-clamp-1 text-xs text-lo sm:text-sm">{{ subtitle }}</p>
    </div>

    <NuxtLink
      v-if="seeAllTo"
      :to="seeAllTo"
      class="group/all inline-flex shrink-0 items-center gap-0.5 rounded-sm px-2 py-1 text-sm font-normal text-hi transition-colors hover:bg-white/8 sm:text-base"
    >
      {{ seeAllLabel }}
      <ChevronRight
        class="size-4 transition-transform duration-300 group-hover/all:translate-x-0.5"
      />
    </NuxtLink>
  </div>
</template>
