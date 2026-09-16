<script setup lang="ts">
import { ChevronDown, User, Crown, Bookmark, Settings, LogOut, Repeat } from 'lucide-vue-next'
import { PLAN_LABELS } from '~/composables/useSubscription'

const open = ref(false)
const root = ref<HTMLElement | null>(null)

const { user, logout } = useAuth()
const { currentPlan, isActive, expired, subscription } = useSubscription()
const { count } = useMyList()

const displayName = computed(() => user.value?.name ?? 'สมาชิก DUDI')
const displayEmail = computed(() => user.value?.email ?? '')
const avatarSeed = computed(() => user.value?.id ?? 'guest')
const planLabel = computed(() => PLAN_LABELS[currentPlan.value])

const links = [
  { label: 'บัญชีของฉัน', to: '/account', icon: User },
  { label: 'แพ็กเกจของฉัน', to: '/account?tab=subscription', icon: Crown },
  { label: 'รายการของฉัน', to: '/account?tab=mylist', icon: Bookmark },
  { label: 'การตั้งค่า', to: '/account?tab=settings', icon: Settings },
]

function signOut() {
  open.value = false
  logout()
  navigateTo('/')
}

function onDocClick(e: MouseEvent) {
  if (open.value && root.value && !root.value.contains(e.target as Node)) open.value = false
}
onMounted(() => document.addEventListener('click', onDocClick))
onBeforeUnmount(() => document.removeEventListener('click', onDocClick))
</script>

<template>
  <div ref="root" class="relative">
    <button
      type="button"
      class="group/user flex items-center gap-1.5 rounded-full p-0.5 transition-colors hover:bg-white/8"
      :aria-expanded="open"
      aria-label="เมนูผู้ใช้"
      @click="open = !open"
    >
      <AppAvatar :name="displayName" :seed="avatarSeed" size="sm" :ring="isActive" />
      <span
        v-if="isActive"
        class="hidden rounded-md bg-gradient-to-r from-accent-500 to-accent-glow px-1.5 py-0.5 text-[9px] font-bold tracking-wide text-white uppercase lg:inline-flex"
      >
        {{ planLabel }}
      </span>
      <ChevronDown
        class="hidden size-4 text-lo transition-transform duration-300 lg:block"
        :class="open && 'rotate-180'"
      />
    </button>

    <Transition name="pop">
      <div
        v-if="open"
        class="absolute right-0 z-50 mt-2 w-64 origin-top-right overflow-hidden rounded-2xl glass-strong ring-1 ring-line-strong shadow-[0_30px_70px_-20px_#000]"
      >
        <div class="flex items-center gap-3 border-b border-line p-4">
          <AppAvatar :name="displayName" :seed="avatarSeed" size="md" ring />
          <div class="min-w-0">
            <p class="truncate text-sm font-semibold text-hi">{{ displayName }}</p>
            <p class="truncate text-[11px] text-lo">{{ displayEmail }}</p>
          </div>
        </div>

        <div class="flex items-center justify-between px-4 py-2.5">
          <span
            v-if="isActive"
            class="inline-flex items-center gap-1.5 rounded-md bg-gradient-to-r from-accent-500 to-accent-glow px-2 py-0.5 text-[10px] font-bold text-white uppercase"
          >
            <Crown class="size-3" /> {{ planLabel }}
          </span>
          <span
            v-else-if="subscription && expired"
            class="inline-flex items-center gap-1.5 rounded-md bg-live/18 px-2 py-0.5 text-[10px] font-bold text-live uppercase"
          >
            หมดอายุแล้ว
          </span>
          <span
            v-else
            class="inline-flex items-center gap-1.5 rounded-md bg-white/10 px-2 py-0.5 text-[10px] font-bold text-mid uppercase"
          >
            FREE
          </span>
          <span class="text-[11px] text-lo">บันทึกไว้ {{ count }} เรื่อง</span>
        </div>

        <ul class="border-t border-line py-1">
          <li v-for="l in links" :key="l.label">
            <NuxtLink
              :to="l.to"
              class="flex items-center gap-3 px-4 py-2.5 text-[13px] font-medium text-mid transition-colors hover:bg-white/6 hover:text-hi"
              @click="open = false"
            >
              <component :is="l.icon" class="size-4" />
              {{ l.label }}
            </NuxtLink>
          </li>
          <li>
            <button
              type="button"
              class="flex w-full items-center gap-3 px-4 py-2.5 text-[13px] font-medium text-mid transition-colors hover:bg-white/6 hover:text-hi"
            >
              <Repeat class="size-4" /> สลับโปรไฟล์
            </button>
          </li>
        </ul>

        <div class="border-t border-line py-1">
          <button
            type="button"
            class="flex w-full items-center gap-3 px-4 py-2.5 text-[13px] font-medium text-mid transition-colors hover:bg-white/6 hover:text-hi"
            @click="signOut"
          >
            <LogOut class="size-4" /> ออกจากระบบ
          </button>
        </div>
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
