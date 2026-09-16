<script setup lang="ts">
import { Eye } from 'lucide-vue-next'
import { formatCompact } from '~/utils/format'

withDefaults(
  defineProps<{
    viewers?: number
    size?: 'sm' | 'md'
    /** Hide the pulsing dot on dense surfaces */
    plain?: boolean
  }>(),
  { size: 'sm' },
)
</script>

<template>
  <div class="flex items-center gap-1.5">
    <span
      class="inline-flex items-center gap-1.5 rounded-md bg-live font-bold tracking-[0.12em] text-white uppercase shadow-[0_4px_14px_-4px_var(--color-live)]"
      :class="size === 'sm' ? 'h-5 px-1.5 text-[10px]' : 'h-6 px-2 text-[11px]'"
    >
      <span
        v-if="!plain"
        class="size-1.5 rounded-full bg-white animate-live-pulse"
        aria-hidden="true"
      />
      LIVE
    </span>
    <span
      v-if="viewers !== undefined"
      class="inline-flex items-center gap-1 rounded-md bg-black/65 px-1.5 text-[11px] font-medium text-white/90 backdrop-blur-sm"
      :class="size === 'sm' ? 'h-5' : 'h-6'"
    >
      <Eye class="size-3" />
      {{ formatCompact(viewers) }}
    </span>
  </div>
</template>
