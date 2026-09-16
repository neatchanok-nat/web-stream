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

/* iHaveTicket's v-btn scale, 1:1 with assets/style/button.scss:
   x-small 35/14px · small 40/14px · default 55/20px, all weight 400. */
const sizes = {
  sm: 'h-[35px] min-w-16 px-2.5 text-sm/[18px] gap-2 rounded-sm',
  md: 'h-10 min-w-16 px-2.5 text-sm/5 gap-2 rounded-sm',
  lg: 'h-[55px] min-w-16 px-4 text-xl/[26px] gap-2.5 rounded-sm',
} as const

/* Outlined weights match theirs too: 2px at default size, 1px when small. */
const variants = {
  primary: 'bg-accent text-white hover:bg-accent-800',
  secondary: 'bg-white text-iris hover:bg-mid',
  ghost: 'text-mid hover:text-hi hover:bg-white/8',
  outline: 'text-hi ring-inset ring-white/25 hover:ring-white/50 hover:bg-white/6',
  glass: 'glass text-hi ring-1 ring-inset ring-white/12 hover:bg-white/12',
  live: 'bg-live text-white hover:bg-live-deep',
} as const

const cls = computed(() => [
  'inline-flex select-none items-center justify-center font-normal tracking-normal whitespace-nowrap normal-case',
  'transition-colors duration-200',
  'disabled:pointer-events-none disabled:bg-accent-200 disabled:text-white',
  sizes[props.size],
  variants[props.variant],
  props.variant === 'outline' && (props.size === 'lg' ? 'ring-2' : 'ring-1'),
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
