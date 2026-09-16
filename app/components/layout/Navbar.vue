<script setup lang="ts">
import { Search, Menu, X } from 'lucide-vue-next'

/** Sticky global header — transparent over the hero, frosted once scrolled. */
const NAV_LINKS = [
  { label: 'หน้าแรก', to: '/' },
  { label: 'หนัง', to: '/movies' },
  { label: 'หมวดหมู่', to: '/category' },
  { label: 'LIVE', to: '/live', live: true },
]

const route = useRoute()
const scrolled = ref(false)
const mobileOpen = ref(false)
const { isLoggedIn, logout: signOut } = useAuth()

function logout() {
  signOut()
  mobileOpen.value = false
  navigateTo('/')
}

const isActive = (to: string) =>
  to === '/' ? route.path === '/' : route.path.startsWith(to)

function onScroll() {
  scrolled.value = window.scrollY > 24
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))
watch(() => route.fullPath, () => (mobileOpen.value = false))
</script>

<template>
  <header
    class="fixed inset-x-0 top-0 z-50 border-b border-[#3d3d3d] bg-[#101010] transition-all duration-300"
  >
    <nav class="shell flex items-center gap-3 sm:gap-5" :class="scrolled ? 'h-15' : 'h-17 lg:h-20'">
      <AppLogo :size="scrolled ? 'sm' : 'md'" class="lg:shrink-0" />

      <!-- desktop links -->
      <ul class="ml-4 hidden items-center gap-1 lg:flex">
        <li v-for="l in NAV_LINKS" :key="l.to">
          <NuxtLink
            :to="l.to"
            class="group/nav relative inline-flex h-9 items-center gap-1.5 rounded-lg px-3.5 text-[14px] font-semibold transition-colors duration-200"
            :class="isActive(l.to) ? 'text-hi' : 'text-mid hover:text-hi'"
          >
            <span
              v-if="l.live"
              class="size-1.5 rounded-full bg-live shadow-[0_0_10px_var(--color-live)] animate-live-pulse"
            />
            {{ l.label }}
            <span
              class="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-gradient-to-r from-accent-400 to-accent-glow transition-all duration-300"
              :class="isActive(l.to) ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'"
            />
          </NuxtLink>
        </li>
      </ul>

      <div class="ml-auto flex items-center gap-1 sm:gap-1.5">
        <IconButton label="ค้นหา" to="/search">
          <Search class="size-5" />
        </IconButton>

        <NotificationMenu v-if="isLoggedIn" class="hidden sm:block" />

        <AppButton
          v-if="!isLoggedIn"
          to="/login"
          size="sm"
          variant="primary"
          class="hidden md:inline-flex"
        >
          เข้าสู่ระบบ
        </AppButton>

        <UserMenu v-if="isLoggedIn" />

        <IconButton
          label="เปิดเมนู"
          class="lg:hidden"
          :aria-expanded="mobileOpen"
          @click="mobileOpen = !mobileOpen"
        >
          <X v-if="mobileOpen" class="size-5" />
          <Menu v-else class="size-5" />
        </IconButton>
      </div>
    </nav>

    <!-- compact drop-down menu for tablets / phones -->
    <Transition name="sheet">
      <div v-if="mobileOpen" class="border-t border-line lg:hidden">
        <ul class="shell grid gap-1 py-3">
          <li v-for="l in [...NAV_LINKS, { label: 'ค้นหา', to: '/search', live: false }, { label: 'แพ็กเกจ', to: '/pricing', live: false }, { label: 'บัญชีของฉัน', to: '/account', live: false }]" :key="l.to">
            <NuxtLink
              :to="l.to"
              class="flex items-center gap-2 rounded-xl px-3 py-3 text-[15px] font-semibold transition-colors"
              :class="isActive(l.to) ? 'bg-white/8 text-hi' : 'text-mid hover:bg-white/5 hover:text-hi'"
            >
              <span v-if="l.live" class="size-1.5 rounded-full bg-live animate-live-pulse" />
              {{ l.label }}
            </NuxtLink>
          </li>
          <li class="pt-1">
            <AppButton v-if="!isLoggedIn" to="/login" block variant="primary">เข้าสู่ระบบ</AppButton>
            <AppButton v-else block variant="secondary" @click="logout()">ออกจากระบบ</AppButton>
          </li>
        </ul>
      </div>
    </Transition>
  </header>
</template>

<style scoped>
.sheet-enter-active,
.sheet-leave-active {
  transition:
    opacity 0.25s ease,
    transform 0.25s var(--ease-out-expo);
  transform-origin: top;
}
.sheet-enter-from,
.sheet-leave-to {
  opacity: 0;
  transform: scaleY(0.94);
}
</style>
