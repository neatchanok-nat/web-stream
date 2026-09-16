<script setup lang="ts">
import { Check, Minus, Sparkles } from 'lucide-vue-next'
import type { PricingPlan } from '~/types'

defineProps<{ plan: PricingPlan; current?: boolean; loading?: boolean }>()
const emit = defineEmits<{ select: [PricingPlan] }>()
</script>

<template>
  <article
    class="group/plan relative flex flex-col overflow-hidden rounded-3xl p-6 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] sm:p-7"
    :class="
      plan.highlight
        ? 'bg-gradient-to-b from-accent-600/22 via-surface to-surface ring-1 ring-accent-500/45 lg:-translate-y-4 lg:scale-102 hover:lg:-translate-y-6'
        : 'bg-surface ring-1 ring-line hover:-translate-y-1.5 hover:ring-line-strong'
    "
  >
    <!-- premium glow -->
    <div
      v-if="plan.highlight"
      class="pointer-events-none absolute -top-24 left-1/2 size-64 -translate-x-1/2 rounded-full bg-accent-500/25 blur-[70px]"
      aria-hidden="true"
    />

    <div class="relative">
      <div class="flex items-center justify-between gap-3">
        <h3 class="text-sm font-extrabold tracking-[0.22em] text-hi uppercase">{{ plan.name }}</h3>
        <span
          v-if="plan.badge"
          class="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-accent-500 to-accent-glow px-2.5 py-1 text-[10px] font-bold tracking-wide text-white uppercase shadow-[0_6px_20px_-6px_var(--color-accent)]"
        >
          <Sparkles class="size-3" />{{ plan.badge }}
        </span>
        <span
          v-else-if="current"
          class="rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-bold tracking-wide text-mid uppercase"
        >
          แพ็กเกจปัจจุบัน
        </span>
      </div>

      <p class="mt-2 text-[13px] text-lo">{{ plan.blurb }}</p>

      <div class="mt-6 flex items-end gap-2">
        <span
          class="text-5xl leading-none font-extrabold tracking-tight"
          :class="plan.highlight ? 'text-gradient' : 'text-hi'"
        >
          {{ plan.priceLabel }}
        </span>
        <span class="pb-1 text-sm font-medium text-mid">บาท</span>
        <span class="pb-1 text-xs text-lo">/ {{ plan.period }}</span>
      </div>

      <AppButton
        :variant="plan.highlight ? 'live' : 'secondary'"
        size="lg"
        block
        class="mt-6"
        :disabled="loading"
        @click="emit('select', plan)"
      >
        {{ current ? 'แพ็กเกจปัจจุบัน' : plan.cta }}
      </AppButton>
    </div>

    <ul class="relative mt-7 space-y-3.5 border-t border-line pt-6">
      <li
        v-for="f in plan.features"
        :key="f.label"
        class="flex items-start gap-3 text-[13px] leading-relaxed"
        :class="f.included ? 'text-mid' : 'text-lo/70'"
      >
        <span
          class="mt-px grid size-5 shrink-0 place-items-center rounded-full"
          :class="f.included ? 'bg-accent-500/18 text-accent-200' : 'bg-white/5 text-lo/60'"
        >
          <Check v-if="f.included" class="size-3.5" />
          <Minus v-else class="size-3" />
        </span>
        <span :class="!f.included && 'line-through decoration-white/15'">{{ f.label }}</span>
      </li>
    </ul>
  </article>
</template>
