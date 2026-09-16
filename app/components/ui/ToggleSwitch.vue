<script setup lang="ts">
defineProps<{ modelValue: boolean; label: string; hint?: string }>()
const emit = defineEmits<{ 'update:modelValue': [boolean] }>()
</script>

<template>
  <label class="flex cursor-pointer items-center justify-between gap-6 py-4">
    <span class="min-w-0">
      <span class="block text-[13px] font-semibold text-hi sm:text-sm">{{ label }}</span>
      <span v-if="hint" class="mt-1 block text-[12px] leading-relaxed text-lo">{{ hint }}</span>
    </span>
    <input
      type="checkbox"
      class="peer sr-only"
      :checked="modelValue"
      @change="emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
    />
    <span
      class="relative h-6.5 w-11.5 shrink-0 rounded-full bg-white/12 transition-colors duration-300 peer-checked:bg-accent peer-focus-visible:ring-2 peer-focus-visible:ring-accent-300 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-ink"
    >
      <span
        class="absolute top-1 left-1 size-4.5 rounded-full bg-white shadow-sm transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] peer-checked:translate-x-5"
        :class="modelValue && 'translate-x-5'"
      />
    </span>
  </label>
</template>
