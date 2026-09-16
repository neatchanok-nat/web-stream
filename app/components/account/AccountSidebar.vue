<script setup lang="ts">
import { User, Crown, History, Bookmark, Settings, LogOut, ChevronRight } from 'lucide-vue-next'
import { ACCOUNT_SECTIONS } from '~/data/site'
import { PLAN_LABELS, PLAN_PRICES, formatThaiDate } from '~/composables/useSubscription'

defineProps<{ modelValue: string }>()
const emit = defineEmits<{ 'update:modelValue': [string] }>()

const { logout } = useAuth()
const { subscription, currentPlan, isActive, expired } = useSubscription()

const planLabel = computed(() => PLAN_LABELS[currentPlan.value])
const planPrice = computed(() =>
  currentPlan.value === 'free' ? 'ไม่มีค่าใช้จ่าย' : `${PLAN_PRICES[currentPlan.value]} บาท / เดือน`,
)
const renewLine = computed(() => {
  if (!subscription.value) return 'ยังไม่ได้สมัครแพ็กเกจ'
  return expired.value
    ? `หมดอายุเมื่อ ${formatThaiDate(subscription.value.expiresAt)}`
    : `ต่ออายุอัตโนมัติ ${formatThaiDate(subscription.value.expiresAt)}`
})

function signOut() {
  logout()
  navigateTo('/')
}

const ICONS: Record<string, unknown> = {
  user: User,
  crown: Crown,
  history: History,
  bookmark: Bookmark,
  settings: Settings,
}
</script>

<template>
  <aside class="lg:sticky lg:top-24">
    <!-- mobile: horizontal scroller / desktop: vertical list -->
    <nav
      class="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1 lg:mx-0 lg:flex-col lg:gap-1 lg:px-0"
      aria-label="เมนูบัญชี"
    >
      <button
        v-for="s in ACCOUNT_SECTIONS"
        :key="s.id"
        type="button"
        class="group/item flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-[13px] font-semibold whitespace-nowrap transition-all duration-250 lg:w-full lg:text-sm"
        :class="
          modelValue === s.id
            ? 'bg-gradient-to-r from-accent-600/25 to-transparent text-hi ring-1 ring-inset ring-accent-500/30'
            : 'text-mid hover:bg-white/6 hover:text-hi'
        "
        @click="emit('update:modelValue', s.id)"
      >
        <component :is="ICONS[s.icon]" class="size-4.5 shrink-0" />
        {{ s.label }}
        <ChevronRight
          class="ml-auto hidden size-4 text-lo transition-transform duration-300 lg:block"
          :class="modelValue === s.id && 'translate-x-0.5 text-accent-300'"
        />
      </button>
    </nav>

    <!-- plan summary -->
    <div
      class="mt-6 hidden overflow-hidden rounded-2xl bg-gradient-to-br from-accent-600/25 via-surface to-surface p-5 ring-1 ring-accent-500/25 lg:block"
    >
      <span
        v-if="isActive"
        class="inline-flex items-center gap-1.5 rounded-md bg-gradient-to-r from-accent-500 to-accent-glow px-2 py-0.5 text-[10px] font-bold text-white uppercase"
      >
        <Crown class="size-3" /> {{ planLabel }}
      </span>
      <span
        v-else
        class="inline-flex items-center gap-1.5 rounded-md bg-white/12 px-2 py-0.5 text-[10px] font-bold text-mid uppercase"
      >
        {{ expired ? 'หมดอายุแล้ว' : planLabel }}
      </span>
      <p class="mt-3 text-sm font-semibold text-hi">{{ planPrice }}</p>
      <p class="mt-1 text-[11px] text-lo">{{ renewLine }}</p>
      <AppButton to="/pricing" variant="secondary" size="sm" block class="mt-4">
        จัดการแพ็กเกจ
      </AppButton>
    </div>

    <button
      type="button"
      class="mt-4 hidden w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-mid transition-colors hover:bg-live/12 hover:text-live lg:flex"
      @click="signOut"
    >
      <LogOut class="size-4.5" /> ออกจากระบบ
    </button>
  </aside>
</template>
