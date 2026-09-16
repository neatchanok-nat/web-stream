<script setup lang="ts">
withDefaults(
  defineProps<{
    /** 0–100 */
    value: number
    size?: 'xs' | 'sm' | 'md'
    tone?: 'accent' | 'white'
  }>(),
  { size: 'sm', tone: 'accent' },
)
</script>

<template>
  <div
    class="w-full overflow-hidden rounded-full bg-white/15"
    :class="{ 'h-[3px]': size === 'xs', 'h-1': size === 'sm', 'h-1.5': size === 'md' }"
    role="progressbar"
    :aria-valuenow="Math.round(value)"
    aria-valuemin="0"
    aria-valuemax="100"
  >
    <div
      class="h-full rounded-full transition-[width] duration-500 ease-out"
      :class="
        tone === 'accent'
          ? 'bg-gradient-to-r from-accent-500 to-accent-glow'
          : 'bg-white'
      "
      :style="{ width: `${Math.min(100, Math.max(0, value))}%` }"
    />
  </div>
</template>
