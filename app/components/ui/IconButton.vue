<script setup lang="ts">
/** Square icon-only control used in chrome, players and rails. */
const props = withDefaults(
  defineProps<{
    label: string
    size?: 'sm' | 'md' | 'lg'
    variant?: 'ghost' | 'solid' | 'glass'
    active?: boolean
    to?: string
  }>(),
  { size: 'md', variant: 'ghost' },
)

const sizes = { sm: 'size-8', md: 'size-10', lg: 'size-12' } as const
const variants = {
  ghost: 'text-mid hover:text-hi hover:bg-white/10',
  solid: 'bg-white/10 text-hi hover:bg-white/20 ring-1 ring-inset ring-white/10',
  glass: 'glass text-hi ring-1 ring-inset ring-white/12 hover:bg-white/14',
} as const

const cls = computed(() => [
  'relative inline-flex items-center justify-center rounded-full transition-all duration-200',
  'active:scale-90',
  sizes[props.size],
  variants[props.variant],
  props.active && 'text-accent-300 bg-accent-500/15',
])
</script>

<template>
  <NuxtLink v-if="to" :to="to" :aria-label="label" :title="label" :class="cls">
    <slot />
  </NuxtLink>
  <button v-else type="button" :aria-label="label" :title="label" :class="cls">
    <slot />
  </button>
</template>
