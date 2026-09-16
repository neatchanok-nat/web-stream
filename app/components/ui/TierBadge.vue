<script setup lang="ts">
import { Crown } from 'lucide-vue-next'
import type { AccessTier } from '~/types'

withDefaults(defineProps<{ tier: AccessTier; compact?: boolean }>(), { compact: false })
</script>

<template>
  <span
    v-if="tier === 'premium'"
    class="inline-flex h-5 items-center gap-1 rounded-full bg-gradient-to-r from-accent-500 to-accent-glow px-1.5 text-[10px] font-bold tracking-wide text-white uppercase shadow-[0_4px_14px_-6px_var(--color-accent)]"
  >
    <Crown class="size-3" />
    <span v-if="!compact">Premium</span>
  </span>
  <span
    v-else
    class="inline-flex h-5 items-center rounded-full bg-white/12 px-1.5 text-[10px] font-bold tracking-wide text-white/75 uppercase"
  >
    ฟรี
  </span>
</template>
