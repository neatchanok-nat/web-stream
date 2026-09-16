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

/* Dark pills: charcoal at rest, solid purple when selected. */
const activeCls = computed(() =>
  props.tone === 'accent' ? 'bg-iris text-white' : 'bg-white text-ink',
)
</script>

<template>
  <div class="flex min-w-0 items-center gap-3">
    <span v-if="label" class="hidden shrink-0 text-xs font-medium text-lo sm:block">
      {{ label }}
    </span>
    <div class="no-scrollbar -mx-1 flex min-w-0 gap-2 overflow-x-auto px-1 py-1">
      <button
        v-for="opt in options"
        :key="opt"
        type="button"
        class="shrink-0 rounded-full font-medium whitespace-nowrap transition-colors duration-200"
        :class="[
          size === 'sm' ? 'h-[35px] px-4 text-sm' : 'h-10 px-5 text-sm',
          modelValue === opt ? activeCls : 'bg-surface-2 text-mid hover:bg-surface-3 hover:text-hi',
        ]"
        @click="emit('update:modelValue', opt)"
      >
        {{ opt }}
      </button>
    </div>
  </div>
</template>
