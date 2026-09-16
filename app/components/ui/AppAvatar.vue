<script setup lang="ts">
import { BadgeCheck } from 'lucide-vue-next'
import { avatarArt } from '~/utils/artwork'

const props = withDefaults(
  defineProps<{
    name: string
    seed?: string
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
    verified?: boolean
    ring?: boolean
    /** Red gradient ring used for creators currently streaming */
    liveRing?: boolean
  }>(),
  { size: 'md' },
)

const src = computed(() => avatarArt(props.seed ?? props.name, props.name))

const dims = {
  xs: 'size-6',
  sm: 'size-8',
  md: 'size-10',
  lg: 'size-14',
  xl: 'size-20',
} as const
</script>

<template>
  <span class="relative inline-flex shrink-0">
    <span
      v-if="liveRing || ring"
      class="absolute -inset-[3px] rounded-full"
      :class="
        liveRing
          ? 'bg-gradient-to-tr from-live to-accent-glow'
          : 'bg-gradient-to-tr from-white/25 to-white/5'
      "
      aria-hidden="true"
    />
    <img
      :src="src"
      :alt="name"
      loading="lazy"
      decoding="async"
      class="relative rounded-full object-cover ring-1 ring-white/10"
      :class="[dims[size], (liveRing || ring) && 'ring-2 ring-ink']"
    />
    <BadgeCheck
      v-if="verified"
      class="absolute -right-0.5 -bottom-0.5 size-4 rounded-full bg-ink text-accent-400"
      :class="size === 'lg' || size === 'xl' ? 'size-5' : 'size-4'"
    />
  </span>
</template>
