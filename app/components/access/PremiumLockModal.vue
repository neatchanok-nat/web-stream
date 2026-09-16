<script setup lang="ts">
import { Lock, Crown, Check, X, CalendarX } from 'lucide-vue-next'
import { PRICING_PLANS } from '~/data/site'
import { formatThaiDate } from '~/composables/useSubscription'

/**
 * Global lock dialog. Mounted once per layout and driven by
 * useAccessControl() — never opened directly by a page.
 */
const { lock, closeLock } = useAccessControl()
const { subscription, currentPlan } = useSubscription()

const state = computed(() => lock.value.state)
const content = computed(() => lock.value.content)

/** The plan we suggest depends on why the gate fired. */
const suggestedPlan = computed(() => {
  const id = state.value === 'upgrade' || content.value?.isLive ? 'premium' : 'standard'
  return PRICING_PLANS.find((p) => p.id === id) ?? PRICING_PLANS[2]!
})

const copy = computed(() => {
  switch (state.value) {
    case 'expired':
      return {
        title: 'แพ็กเกจของคุณหมดอายุแล้ว',
        body: subscription.value
          ? `แพ็กเกจ ${subscription.value.plan.toUpperCase()} หมดอายุเมื่อ ${formatThaiDate(subscription.value.expiresAt)} ต่ออายุเพื่อรับชมต่อได้ทันที`
          : 'ต่ออายุแพ็กเกจเพื่อกลับมารับชมเนื้อหาพรีเมียมได้ทันที',
        cta: 'ต่ออายุแพ็กเกจ',
        icon: CalendarX,
      }
    case 'upgrade':
      return {
        title: 'ไลฟ์นี้สำหรับสมาชิก PREMIUM',
        body: `แพ็กเกจ ${currentPlan.value.toUpperCase()} รับชมไลฟ์ทั่วไปได้ แต่ไลฟ์พิเศษนี้ต้องอัปเกรดเป็น PREMIUM`,
        cta: 'อัปเกรดเป็น PREMIUM',
        icon: Crown,
      }
    default:
      return {
        title: 'เนื้อหานี้สำหรับสมาชิก Premium',
        body: 'สมัครแพ็กเกจเพื่อรับชมหนัง ละคร ซีรีส์ และไลฟ์พิเศษได้ไม่จำกัด ยกเลิกได้ทุกเมื่อ',
        cta: 'สมัครแพ็กเกจ',
        icon: Lock,
      }
  }
})

function goPricing() {
  const target = state.value === 'expired' ? `/payment?plan=${currentPlan.value === 'free' ? 'premium' : currentPlan.value}` : '/pricing'
  closeLock()
  navigateTo(target)
}

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape' && lock.value.open) closeLock()
}
onMounted(() => document.addEventListener('keydown', onKey))
onBeforeUnmount(() => document.removeEventListener('keydown', onKey))

// Lock body scroll while the dialog is up.
watch(
  () => lock.value.open,
  (open) => {
    if (import.meta.client) document.body.style.overflow = open ? 'hidden' : ''
  },
)
onBeforeUnmount(() => {
  if (import.meta.client) document.body.style.overflow = ''
})
</script>

<template>
  <ClientOnly>
    <Teleport to="body">
      <Transition name="lock">
        <div
          v-if="lock.open"
          class="fixed inset-0 z-100 grid place-items-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="lock-title"
        >
          <div class="absolute inset-0 bg-ink/80 backdrop-blur-md" @click="closeLock()" />

          <div
            class="lock-panel relative w-full max-w-md overflow-hidden rounded-3xl glass-strong ring-1 ring-line-strong shadow-[0_40px_90px_-30px_#000]"
          >
            <div
              class="pointer-events-none absolute -top-24 left-1/2 size-64 -translate-x-1/2 rounded-full bg-accent-500/25 blur-[70px]"
              aria-hidden="true"
            />

            <button
              type="button"
              class="absolute top-4 right-4 z-10 grid size-9 place-items-center rounded-full text-lo transition-colors hover:bg-white/10 hover:text-hi"
              aria-label="ปิด"
              @click="closeLock()"
            >
              <X class="size-4.5" />
            </button>

            <div class="relative p-7 text-center sm:p-8">
              <span
                class="mx-auto grid size-16 place-items-center rounded-2xl bg-gradient-to-br from-accent-500/30 to-accent-glow/15 text-accent-200 ring-1 ring-inset ring-accent-500/30"
              >
                <component :is="copy.icon" class="size-7" />
              </span>

              <h2 id="lock-title" class="mt-5 text-xl font-bold text-hi sm:text-2xl">
                {{ copy.title }}
              </h2>
              <p class="mt-2.5 text-[13px] leading-relaxed text-mid">{{ copy.body }}</p>

              <p v-if="content" class="mt-4 truncate text-[12px] text-lo">
                เนื้อหา: <span class="font-medium text-mid">{{ content.title }}</span>
              </p>

              <!-- selected package preview -->
              <div
                class="mt-6 rounded-2xl bg-ink/50 p-4 text-left ring-1 ring-inset ring-line"
              >
                <div class="flex items-center justify-between gap-3">
                  <span
                    class="inline-flex items-center gap-1.5 rounded-md bg-gradient-to-r from-accent-500 to-accent-glow px-2 py-0.5 text-[10px] font-bold tracking-wide text-white uppercase"
                  >
                    <Crown class="size-3" /> {{ suggestedPlan.name }}
                  </span>
                  <span class="text-sm font-bold text-hi">
                    {{ suggestedPlan.priceLabel }}
                    <span class="text-[11px] font-medium text-lo">บาท / {{ suggestedPlan.period }}</span>
                  </span>
                </div>
                <ul class="mt-3 space-y-1.5">
                  <li
                    v-for="f in suggestedPlan.features.filter((x) => x.included).slice(0, 3)"
                    :key="f.label"
                    class="flex items-start gap-2 text-[12px] text-mid"
                  >
                    <Check class="mt-px size-3.5 shrink-0 text-accent-300" />
                    {{ f.label }}
                  </li>
                </ul>
              </div>

              <div class="mt-6 flex flex-col gap-2.5 sm:flex-row">
                <AppButton variant="live" size="lg" block @click="goPricing">
                  {{ copy.cta }}
                </AppButton>
                <AppButton variant="secondary" size="lg" block @click="closeLock()">
                  ยกเลิก
                </AppButton>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </ClientOnly>
</template>

<style scoped>
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
