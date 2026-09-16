<script setup lang="ts">
import { ArrowUpDown, ChevronDown } from 'lucide-vue-next'

defineProps<{ options: readonly string[]; modelValue: string; label?: string }>()
const emit = defineEmits<{ 'update:modelValue': [string] }>()
</script>

<template>
  <label
    class="relative inline-flex h-9.5 shrink-0 items-center gap-2 rounded-full bg-white/6 pr-8 pl-4 text-[13px] font-semibold text-mid ring-1 ring-inset ring-white/10 transition-colors hover:bg-white/12 hover:text-hi"
  >
    <ArrowUpDown class="size-3.5 shrink-0" />
    <span v-if="label" class="hidden text-lo sm:inline">{{ label }}</span>
    <select
      :value="modelValue"
      class="cursor-pointer appearance-none bg-transparent pr-1 font-semibold text-hi focus:outline-none"
      @change="emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
    >
      <option v-for="o in options" :key="o" :value="o" class="bg-surface text-hi">{{ o }}</option>
    </select>
    <ChevronDown class="pointer-events-none absolute right-3 size-4 text-lo" />
  </label>
</template>
