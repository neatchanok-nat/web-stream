<script setup lang="ts">
import { Bell, Settings2 } from 'lucide-vue-next'
import { NOTIFICATIONS } from '~/data/site'
import { landscapeArt } from '~/utils/artwork'

const open = ref(false)
const root = ref<HTMLElement | null>(null)
const unread = computed(() => NOTIFICATIONS.filter((n) => n.unread).length)

function onDocClick(e: MouseEvent) {
  if (open.value && root.value && !root.value.contains(e.target as Node)) open.value = false
}
onMounted(() => document.addEventListener('click', onDocClick))
onBeforeUnmount(() => document.removeEventListener('click', onDocClick))
</script>

<template>
  <div ref="root" class="relative">
    <IconButton
      label="การแจ้งเตือน"
      :aria-expanded="open"
      @click="open = !open"
    >
      <Bell class="size-5" />
      <span
        v-if="unread"
        class="absolute top-1.5 right-1.5 grid size-4 place-items-center rounded-full bg-live text-[9px] font-bold text-white ring-2 ring-ink"
      >
        {{ unread }}
      </span>
    </IconButton>

    <Transition name="pop">
      <div
        v-if="open"
        class="absolute right-0 z-50 mt-2 w-[min(92vw,22rem)] origin-top-right overflow-hidden rounded-2xl glass-strong ring-1 ring-line-strong shadow-[0_30px_70px_-20px_#000]"
      >
        <header class="flex items-center justify-between border-b border-line px-4 py-3">
          <h3 class="text-sm font-bold text-hi">การแจ้งเตือน</h3>
          <IconButton label="ตั้งค่าการแจ้งเตือน" size="sm">
            <Settings2 class="size-4" />
          </IconButton>
        </header>

        <ul class="max-h-96 overflow-y-auto py-1">
          <li v-for="n in NOTIFICATIONS" :key="n.id">
            <button
              type="button"
              class="flex w-full gap-3 px-3 py-3 text-left transition-colors hover:bg-white/6"
            >
              <img
                :src="landscapeArt(n.seed)"
                alt=""
                class="aspect-video w-20 shrink-0 rounded-lg object-cover"
                loading="lazy"
              />
              <span class="min-w-0 flex-1">
                <span class="flex items-start gap-2">
                  <span class="line-clamp-2 flex-1 text-[13px] font-semibold text-hi">
                    {{ n.title }}
                  </span>
                  <span v-if="n.unread" class="mt-1 size-2 shrink-0 rounded-full bg-accent" />
                </span>
                <span class="mt-0.5 line-clamp-1 block text-[11px] text-mid">{{ n.body }}</span>
                <span class="mt-1 block text-[11px] text-lo">{{ n.time }}</span>
              </span>
            </button>
          </li>
        </ul>

        <footer class="border-t border-line p-2">
          <NuxtLink
            to="/account"
            class="block rounded-xl px-3 py-2 text-center text-[13px] font-semibold text-accent-200 transition-colors hover:bg-white/6"
            @click="open = false"
          >
            ดูการแจ้งเตือนทั้งหมด
          </NuxtLink>
        </footer>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.pop-enter-active,
.pop-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.22s var(--ease-out-expo);
}
.pop-enter-from,
.pop-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.97);
}
</style>
