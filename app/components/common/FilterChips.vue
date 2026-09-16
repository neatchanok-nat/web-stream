<script setup lang="ts">
/** Pill filter row. Scrolls horizontally on small screens. */
const props = withDefaults(
  defineProps<{
    options: readonly string[]
    modelValue: string
    label?: string
    tone?: 'accent' | 'neutral'
    size?: 'sm' | 'md'
  }>(),
  { tone: 'accent', size: 'md' },
)
const emit = defineEmits<{ 'update:modelValue': [string] }>()

const activeCls = computed(() =>
  props.tone === 'accent'
    ? 'bg-gradient-to-r from-accent-500 to-accent-600 text-white accent-glow'
    : 'bg-white text-ink',
)
</script>

<template>
  <div class="flex items-center gap-3">
    <span v-if="label" class="hidden shrink-0 text-xs font-medium text-lo sm:block">
      {{ label }}
    </span>
    <div class="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 py-1">
      <button
        v-for="opt in options"
        :key="opt"
        type="button"
        class="shrink-0 rounded-full font-semibold whitespace-nowrap ring-1 ring-inset transition-all duration-250 active:scale-95"
        :class="[
          size === 'sm' ? 'h-8 px-3.5 text-xs' : 'h-9.5 px-4.5 text-[13px]',
          modelValue === opt
            ? `${activeCls} ring-transparent`
            : 'bg-white/6 text-mid ring-white/10 hover:bg-white/12 hover:text-hi',
        ]"
        @click="emit('update:modelValue', opt)"
      >
        {{ opt }}
      </button>
    </div>
  </div>
</template>
