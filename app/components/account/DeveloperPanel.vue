<script setup lang="ts">
import {
  Wrench,
  ChevronDown,
  UserCog,
  Crown,
  CalendarX,
  History,
  BookmarkX,
  Trash2,
  AlertTriangle,
  X,
} from 'lucide-vue-next'
import { STORAGE_KEYS, clearAllStore } from '~/utils/storage'

/**
 * Testing shortcuts for the prototype — flips the persisted state
 * so every access-control branch can be reached without waiting
 * for real dates or payments.
 */
const open = ref(false)
const confirming = ref(false)
const toast = ref('')

const { user, logout, loginAsDemo, isLoggedIn } = useAuth()
const { subscription, activateSubscription, expireSubscription, clearSubscription, currentPlan } =
  useSubscription()
const { history, clearHistory } = useWatchHistory()
const { ids: myListIds, clearMyList } = useMyList()

let toastTimer: ReturnType<typeof setTimeout> | undefined
function notify(message: string) {
  toast.value = message
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => (toast.value = ''), 2600)
}
onBeforeUnmount(() => clearTimeout(toastTimer))

function resetLogin() {
  if (isLoggedIn.value) {
    logout()
    notify('ออกจากระบบแล้ว — เซสชันถูกล้าง')
  } else {
    loginAsDemo()
    notify('เข้าสู่ระบบด้วยบัญชีเดโมแล้ว')
  }
}

function activate(plan: 'standard' | 'premium') {
  activateSubscription(plan, 'qr')
  notify(`เปิดใช้งานแพ็กเกจ ${plan.toUpperCase()} แล้ว`)
}

function expire() {
  if (!subscription.value) {
    notify('ยังไม่มีแพ็กเกจให้หมดอายุ')
    return
  }
  expireSubscription()
  notify('ตั้งให้แพ็กเกจหมดอายุแล้ว')
}

function clearAll() {
  clearAllStore()
  logout()
  clearSubscription()
  clearHistory()
  clearMyList()
  confirming.value = false
  notify('ล้างข้อมูลทั้งหมดแล้ว')
}

const ACTIONS = computed(() => [
  {
    label: isLoggedIn.value ? 'Reset Login (ออกจากระบบ)' : 'Reset Login (เข้าสู่ระบบเดโม)',
    icon: UserCog,
    run: resetLogin,
  },
  { label: 'Activate Standard', icon: Crown, run: () => activate('standard') },
  { label: 'Activate Premium', icon: Crown, run: () => activate('premium') },
  { label: 'Expire Subscription', icon: CalendarX, run: expire },
  {
    label: 'Clear Watch History',
    icon: History,
    run: () => {
      clearHistory()
      notify('ล้างประวัติการรับชมแล้ว')
    },
  },
  {
    label: 'Clear My List',
    icon: BookmarkX,
    run: () => {
      clearMyList()
      notify('ล้างรายการของฉันแล้ว')
    },
  },
])

const storageRows = computed(() => [
  { key: STORAGE_KEYS.user, value: user.value ? user.value.email : '—' },
  {
    key: STORAGE_KEYS.subscription,
    value: subscription.value
      ? `${subscription.value.plan} · ${subscription.value.status}`
      : '—',
  },
  { key: STORAGE_KEYS.watchHistory, value: `${history.value.length} รายการ` },
  { key: STORAGE_KEYS.myList, value: `${myListIds.value.length} รายการ` },
])
</script>

<template>
  <section class="overflow-hidden rounded-3xl bg-surface ring-1 ring-line">
    <button
      type="button"
      class="flex w-full items-center gap-3 px-6 py-5 text-left transition-colors hover:bg-white/4 sm:px-8"
      :aria-expanded="open"
      @click="open = !open"
    >
      <span class="grid size-9 shrink-0 place-items-center rounded-xl bg-white/8 text-lo">
        <Wrench class="size-4.5" />
      </span>
      <span class="min-w-0 flex-1">
        <span class="block text-sm font-bold text-hi">Developer Demo</span>
        <span class="mt-0.5 block text-[12px] text-lo">
          ปุ่มทดสอบสถานะระบบ — ใช้สำหรับการสาธิตเท่านั้น
        </span>
      </span>
      <ChevronDown
        class="size-4.5 shrink-0 text-lo transition-transform duration-300"
        :class="open && 'rotate-180'"
      />
    </button>

    <div
      class="grid transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]"
      :class="open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'"
    >
      <div class="overflow-hidden">
        <div class="border-t border-line px-6 py-6 sm:px-8">
          <!-- current state -->
          <dl class="grid gap-2 sm:grid-cols-2">
            <div
              v-for="row in storageRows"
              :key="row.key"
              class="flex items-center justify-between gap-3 rounded-xl bg-ink/50 px-3.5 py-2.5 ring-1 ring-inset ring-line"
            >
              <dt class="truncate font-mono text-[11px] text-lo">{{ row.key }}</dt>
              <dd class="shrink-0 text-[12px] font-semibold text-mid">{{ row.value }}</dd>
            </div>
          </dl>

          <!-- actions -->
          <div class="mt-5 grid gap-2 sm:grid-cols-2">
            <button
              v-for="a in ACTIONS"
              :key="a.label"
              type="button"
              class="flex items-center gap-2.5 rounded-xl bg-ink/50 px-4 py-3 text-left text-[13px] font-semibold text-mid ring-1 ring-inset ring-line transition-all hover:bg-white/6 hover:text-hi active:scale-[0.99]"
              @click="a.run()"
            >
              <component :is="a.icon" class="size-4 shrink-0 text-lo" />
              {{ a.label }}
            </button>

            <button
              type="button"
              class="flex items-center gap-2.5 rounded-xl bg-live/10 px-4 py-3 text-left text-[13px] font-semibold text-live ring-1 ring-inset ring-live/25 transition-all hover:bg-live/16 active:scale-[0.99] sm:col-span-2"
              @click="confirming = true"
            >
              <Trash2 class="size-4 shrink-0" />
              Clear All LocalStorage
            </button>
          </div>

          <p class="mt-4 text-[11px] leading-relaxed text-lo">
            แพ็กเกจปัจจุบัน: <span class="font-semibold text-mid">{{ currentPlan }}</span> ·
            ข้อมูลทั้งหมดเก็บในเบราว์เซอร์นี้เท่านั้น
          </p>
        </div>
      </div>
    </div>

    <!-- inline toast -->
    <Transition name="toast">
      <p
        v-if="toast"
        class="border-t border-line bg-accent-500/10 px-6 py-3 text-[12px] font-medium text-accent-100 sm:px-8"
      >
        {{ toast }}
      </p>
    </Transition>

    <!-- confirm dialog -->
    <ClientOnly>
      <Teleport to="body">
        <Transition name="lock">
          <div v-if="confirming" class="fixed inset-0 z-100 grid place-items-center p-4">
            <div class="absolute inset-0 bg-ink/80 backdrop-blur-md" @click="confirming = false" />
            <div
              class="lock-panel relative w-full max-w-sm overflow-hidden rounded-3xl glass-strong p-7 text-center ring-1 ring-line-strong shadow-[0_40px_90px_-30px_#000]"
            >
              <button
                type="button"
                class="absolute top-4 right-4 grid size-9 place-items-center rounded-full text-lo transition-colors hover:bg-white/10 hover:text-hi"
                aria-label="ปิด"
                @click="confirming = false"
              >
                <X class="size-4.5" />
              </button>

              <span
                class="mx-auto grid size-14 place-items-center rounded-2xl bg-live/15 text-live ring-1 ring-inset ring-live/25"
              >
                <AlertTriangle class="size-6" />
              </span>
              <h3 class="mt-4 text-lg font-bold text-hi">ล้างข้อมูลทั้งหมด?</h3>
              <p class="mt-2 text-[13px] leading-relaxed text-mid">
                ระบบจะลบเซสชัน แพ็กเกจ ประวัติการรับชม และรายการของฉันออกจากเบราว์เซอร์นี้
                การกระทำนี้ย้อนกลับไม่ได้
              </p>
              <div class="mt-6 flex flex-col gap-2.5 sm:flex-row">
                <AppButton variant="live" size="lg" block @click="clearAll">ล้างทั้งหมด</AppButton>
                <AppButton variant="secondary" size="lg" block @click="confirming = false">
                  ยกเลิก
                </AppButton>
              </div>
            </div>
          </div>
        </Transition>
      </Teleport>
    </ClientOnly>
  </section>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition:
    opacity 0.25s ease,
    transform 0.25s var(--ease-out-expo);
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

.lock-enter-active,
.lock-leave-active {
  transition: opacity 0.25s ease;
}
.lock-enter-active .lock-panel,
.lock-leave-active .lock-panel {
  transition: transform 0.3s var(--ease-out-expo);
}
.lock-enter-from,
.lock-leave-to {
  opacity: 0;
}
.lock-enter-from .lock-panel,
.lock-leave-to .lock-panel {
  transform: translateY(18px) scale(0.96);
}
</style>
