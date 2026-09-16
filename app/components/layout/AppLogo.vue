<script setup lang="ts">
/** Original DUDI wordmark: a gradient tile with a play glyph + type lockup. */
withDefaults(defineProps<{ size?: 'sm' | 'md' | 'lg'; markOnly?: boolean }>(), { size: 'md' })
</script>

<template>
  <NuxtLink
    to="/"
    class="group/logo inline-flex items-center gap-2.5 focus-visible:outline-none"
    aria-label="DUDI หน้าแรก"
  >
    <span
      class="relative grid shrink-0 place-items-center overflow-hidden rounded-[10px] bg-gradient-to-br from-accent-400 via-accent-600 to-accent-glow shadow-[0_8px_24px_-8px_var(--color-accent)] transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/logo:scale-105"
      :class="{ 'size-7': size === 'sm', 'size-8.5': size === 'md', 'size-11': size === 'lg' }"
    >
      <span class="absolute -top-3 -left-2 size-6 rounded-full bg-white/30 blur-md" />
      <svg viewBox="0 0 24 24" class="relative w-1/2 fill-white" aria-hidden="true">
        <path d="M8.5 5.6a1 1 0 0 1 1.52-.85l8.2 5.2a1.3 1.3 0 0 1 0 2.2l-8.2 5.2a1 1 0 0 1-1.52-.85V5.6Z" />
      </svg>
    </span>

    <span v-if="!markOnly" class="flex flex-col justify-center leading-none">
      <span
        class="font-extrabold tracking-[-0.04em] whitespace-nowrap select-none"
        :class="{ 'text-lg': size === 'sm', 'text-xl': size === 'md', 'text-2xl': size === 'lg' }"
      >
        <span class="text-hi">DU</span><span class="text-gradient">DI</span>
      </span>
      <span
        v-if="size !== 'sm'"
        lang="th"
        class="mt-0.5 font-semibold tracking-[0.34em] text-lo select-none"
        :class="size === 'lg' ? 'text-[11px]' : 'text-[9px]'"
      >
        ดูดิ
      </span>
    </span>
  </NuxtLink>
</template>
