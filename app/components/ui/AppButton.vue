<script setup lang="ts">
/** Core button. Renders as NuxtLink when `to` is provided. */
const props = withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'glass' | 'live'
    size?: 'sm' | 'md' | 'lg'
    to?: string
    block?: boolean
    disabled?: boolean
    type?: 'button' | 'submit'
  }>(),
  { variant: 'primary', size: 'md', type: 'button' },
)

const sizes = {
  sm: 'h-9 px-3.5 text-[13px] gap-1.5 rounded-lg',
  md: 'h-11 px-5 text-sm gap-2 rounded-xl',
  lg: 'h-13 px-7 text-[15px] gap-2.5 rounded-xl',
} as const

const variants = {
  primary:
    'bg-white text-ink hover:bg-white/90 active:scale-[0.98] shadow-[0_10px_30px_-12px_rgba(255,255,255,0.45)]',
  secondary: 'bg-white/10 text-hi hover:bg-white/18 backdrop-blur-sm ring-1 ring-inset ring-white/12',
  ghost: 'text-mid hover:text-hi hover:bg-white/8',
  outline: 'text-hi ring-1 ring-inset ring-white/25 hover:ring-white/50 hover:bg-white/6',
  glass: 'glass text-hi ring-1 ring-inset ring-white/12 hover:bg-white/12',
  live: 'bg-accent text-white hover:bg-accent-400 accent-glow active:scale-[0.98]',
} as const

const cls = computed(() => [
  'inline-flex select-none items-center justify-center font-semibold whitespace-nowrap',
  'transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]',
  'disabled:pointer-events-none disabled:opacity-45',
  sizes[props.size],
  variants[props.variant],
  props.block && 'w-full',
])
</script>

<template>
  <NuxtLink v-if="to" :to="to" :class="cls">
    <slot />
  </NuxtLink>
  <button v-else :type="type" :disabled="disabled" :class="cls">
    <slot />
  </button>
</template>
