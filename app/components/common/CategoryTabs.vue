<script setup lang="ts">
/** Underlined tab bar used for Category / Search / Account switching. */
const props = defineProps<{
  tabs: readonly { id: string; label: string; count?: number }[]
  modelValue: string
}>()
const emit = defineEmits<{ 'update:modelValue': [string] }>()

const isActive = (id: string) => props.modelValue === id
</script>

<template>
  <div class="relative border-b border-line">
    <div class="no-scrollbar flex gap-1 overflow-x-auto sm:gap-2">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        type="button"
        class="group/tab relative shrink-0 px-3 pb-3.5 text-sm font-semibold whitespace-nowrap transition-colors duration-200 sm:px-4 sm:text-[15px]"
        :class="isActive(tab.id) ? 'text-hi' : 'text-lo hover:text-mid'"
        :aria-current="isActive(tab.id) ? 'page' : undefined"
        @click="emit('update:modelValue', tab.id)"
      >
        {{ tab.label }}
        <span
          v-if="tab.count !== undefined"
          class="ml-1.5 rounded-md px-1.5 py-0.5 text-[10px] font-bold transition-colors"
          :class="isActive(tab.id) ? 'bg-accent/20 text-accent-200' : 'bg-white/6 text-lo'"
        >
          {{ tab.count }}
        </span>
        <span
          class="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-gradient-to-r from-accent-500 to-accent-glow transition-all duration-300"
          :class="isActive(tab.id) ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'"
        />
      </button>
    </div>
  </div>
</template>
