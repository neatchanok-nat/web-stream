<script setup lang="ts">
import { Home, Clapperboard, Radio, Bookmark, User } from 'lucide-vue-next'

/** Bottom tab bar — phones and small tablets only. */
const route = useRoute()
const { count } = useMyList()

const TABS = [
  { label: 'หน้าแรก', to: '/', icon: Home, exact: true },
  { label: 'หนัง', to: '/movies', icon: Clapperboard },
  { label: 'LIVE', to: '/live', icon: Radio, live: true },
  { label: 'รายการของฉัน', to: '/account?tab=mylist', icon: Bookmark, badge: true },
  { label: 'โปรไฟล์', to: '/account', icon: User, exact: true },
]

const isActive = (t: (typeof TABS)[number]) => {
  const path = t.to.split('?')[0] as string
  if (t.exact) return route.path === path && route.query.tab !== 'mylist'
  if (t.badge) return route.path === path && route.query.tab === 'mylist'
  return route.path.startsWith(path)
}
</script>

<template>
  <nav
    class="fixed inset-x-0 bottom-0 z-50 border-t border-line glass-strong pb-[env(safe-area-inset-bottom)] lg:hidden"
    aria-label="เมนูหลัก"
  >
    <ul class="grid grid-cols-5">
      <li v-for="t in TABS" :key="t.label">
        <NuxtLink
          :to="t.to"
          class="group/tab relative flex flex-col items-center gap-1 px-1 pt-2.5 pb-2 transition-colors duration-200"
          :class="isActive(t) ? 'text-hi' : 'text-lo'"
        >
          <span class="relative">
            <component
              :is="t.icon"
              class="size-5.5 transition-transform duration-300"
              :class="isActive(t) && 'scale-110'"
              :stroke-width="isActive(t) ? 2.4 : 1.9"
            />
            <span
              v-if="t.live"
              class="absolute -top-0.5 -right-1 size-1.5 rounded-full bg-live animate-live-pulse"
            />
            <span
              v-else-if="t.badge && count"
              class="absolute -top-1.5 -right-2.5 grid h-4 min-w-4 place-items-center rounded-full bg-accent px-1 text-[9px] font-bold text-white"
            >
              {{ count }}
            </span>
          </span>
          <span class="text-[10px] leading-none font-semibold">{{ t.label }}</span>
          <span
            class="absolute inset-x-5 top-0 h-0.5 rounded-full bg-gradient-to-r from-accent-400 to-accent-glow transition-all duration-300"
            :class="isActive(t) ? 'opacity-100' : 'opacity-0'"
          />
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>
