<script setup lang="ts">
import { Search, X, Mic } from 'lucide-vue-next'

const props = withDefaults(
  defineProps<{
    modelValue: string
    placeholder?: string
    size?: 'md' | 'lg'
    autofocus?: boolean
    showMic?: boolean
  }>(),
  {
    placeholder: 'ค้นหาหนัง ละคร ซีรีส์ รายการ หรือครีเอเตอร์',
    size: 'md',
    showMic: true,
  },
)
const emit = defineEmits<{ 'update:modelValue': [string]; submit: [string] }>()

const input = ref<HTMLInputElement | null>(null)
onMounted(() => {
  if (props.autofocus) input.value?.focus()
})
</script>

<template>
  <form
    class="group/search relative flex items-center overflow-hidden rounded-2xl bg-surface/90 ring-1 ring-inset ring-line transition-all duration-300 focus-within:bg-surface-2 focus-within:ring-accent-500/60 focus-within:shadow-[0_0_0_4px_color-mix(in_oklab,var(--color-accent)_14%,transparent)]"
    :class="size === 'lg' ? 'h-14 sm:h-16' : 'h-12'"
    role="search"
    @submit.prevent="emit('submit', modelValue)"
  >
    <Search
      class="ml-4 shrink-0 text-lo transition-colors group-focus-within/search:text-accent-300"
      :class="size === 'lg' ? 'size-5.5' : 'size-5'"
    />
    <input
      ref="input"
      :value="modelValue"
      type="search"
      :placeholder="placeholder"
      class="peer h-full min-w-0 flex-1 bg-transparent px-3.5 font-medium text-hi placeholder:text-lo focus:outline-none [&::-webkit-search-cancel-button]:hidden"
      :class="size === 'lg' ? 'text-base sm:text-lg' : 'text-sm'"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />

    <button
      v-if="modelValue"
      type="button"
      aria-label="ล้างคำค้นหา"
      class="mr-1 grid size-8 shrink-0 place-items-center rounded-full text-lo transition-colors hover:bg-white/10 hover:text-hi"
      @click="emit('update:modelValue', '')"
    >
      <X class="size-4" />
    </button>
    <button
      v-if="showMic && !modelValue"
      type="button"
      aria-label="ค้นหาด้วยเสียง"
      class="mr-1 grid size-8 shrink-0 place-items-center rounded-full text-lo transition-colors hover:bg-white/10 hover:text-hi"
    >
      <Mic class="size-4" />
    </button>

    <button
      v-if="size === 'lg'"
      type="submit"
      class="mr-2 hidden h-10 shrink-0 items-center rounded-xl bg-gradient-to-r from-accent-500 to-accent-600 px-5 text-sm font-bold text-white transition-all hover:brightness-110 active:scale-95 sm:inline-flex"
    >
      ค้นหา
    </button>
  </form>
</template>
