<script setup lang="ts">
import {
  QrCode,
  CreditCard,
  Wallet,
  ShieldCheck,
  Check,
  CheckCircle2,
  ChevronLeft,
  Loader2,
  Crown,
  Lock,
} from 'lucide-vue-next'
import type { PaymentMethod, PlanId } from '~/types'
import { PRICING_PLANS } from '~/data/site'
import { PAYMENT_LABELS, PLAN_PRICES, formatThaiDate } from '~/composables/useSubscription'
import { qrArt } from '~/utils/artwork'

definePageMeta({ middleware: 'auth' })
useHead({ title: 'ชำระเงิน — DUDI' })

const route = useRoute()
const { user } = useAuth()
const { activateSubscription, subscription } = useSubscription()

/* ---------------------------------------------------- selected plan */
const planId = computed<PlanId>(() => {
  const q = route.query.plan
  return q === 'standard' || q === 'premium' ? q : 'premium'
})
const plan = computed(() => PRICING_PLANS.find((p) => p.id === planId.value) ?? PRICING_PLANS[2]!)
const price = computed(() => PLAN_PRICES[planId.value])
const renewing = computed(() => !!subscription.value && subscription.value.plan === planId.value)

/* ---------------------------------------------------- payment state */
const TABS = [
  { id: 'qr' as const, label: 'QR พร้อมเพย์', icon: QrCode },
  { id: 'credit' as const, label: 'บัตรเครดิต', icon: CreditCard },
  { id: 'truemoney' as const, label: 'ทรูมันนี่', icon: Wallet },
]

const method = ref<PaymentMethod>('qr')
const processing = ref(false)
const done = ref(false)

/** Card fields are validated then discarded — nothing is ever stored. */
const card = reactive({ holder: '', number: '', expiry: '', cvv: '' })
const phone = ref('')
const errors = reactive<Record<string, string>>({})

const qr = computed(() => qrArt(`${planId.value}-${user.value?.id ?? 'guest'}`))
const includedFeatures = computed(() => plan.value.features.filter((f) => f.included))

function formatCardNumber(e: Event) {
  const raw = (e.target as HTMLInputElement).value.replace(/\D/g, '').slice(0, 16)
  card.number = raw.replace(/(.{4})/g, '$1 ').trim()
  errors.number = ''
}

function formatExpiry(e: Event) {
  const raw = (e.target as HTMLInputElement).value.replace(/\D/g, '').slice(0, 4)
  card.expiry = raw.length > 2 ? `${raw.slice(0, 2)}/${raw.slice(2)}` : raw
  errors.expiry = ''
}

function validateCard(): boolean {
  const digits = card.number.replace(/\s/g, '')
  const [mm, yy] = card.expiry.split('/')
  errors.holder = card.holder.trim().length < 3 ? 'กรุณากรอกชื่อบนบัตร' : ''
  errors.number = digits.length !== 16 ? 'หมายเลขบัตรต้องมี 16 หลัก' : ''
  errors.expiry =
    !mm || !yy || Number(mm) < 1 || Number(mm) > 12 ? 'วันหมดอายุไม่ถูกต้อง (MM/YY)' : ''
  errors.cvv = !/^\d{3,4}$/.test(card.cvv) ? 'CVV ไม่ถูกต้อง' : ''
  return !errors.holder && !errors.number && !errors.expiry && !errors.cvv
}

function validatePhone(): boolean {
  errors.phone = !/^0\d{8,9}$/.test(phone.value.replace(/[\s-]/g, ''))
    ? 'กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง'
    : ''
  return !errors.phone
}

/**
 * Mock settlement. Only the payment *method* is persisted —
 * card numbers and phone numbers are dropped immediately.
 */
function pay(via: PaymentMethod) {
  if (via === 'credit' && !validateCard()) return
  if (via === 'truemoney' && !validatePhone()) return

  processing.value = true
  setTimeout(() => {
    activateSubscription(planId.value, via)
    // Discard the sensitive inputs from memory as soon as we are done.
    card.holder = ''
    card.number = ''
    card.expiry = ''
    card.cvv = ''
    phone.value = ''
    processing.value = false
    done.value = true
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, 1100)
}
</script>

<template>
  <div class="shell pt-24 pb-16 lg:pt-32">
    <!-- ============================================= success screen -->
    <section v-if="done && subscription" class="mx-auto max-w-2xl">
      <div class="relative overflow-hidden rounded-3xl bg-surface p-8 text-center ring-1 ring-line sm:p-12">
        <div
          class="pointer-events-none absolute -top-28 left-1/2 size-72 -translate-x-1/2 rounded-full bg-accent-500/25 blur-[80px]"
          aria-hidden="true"
        />
        <div class="relative">
          <span
            class="mx-auto grid size-20 place-items-center rounded-full bg-gradient-to-br from-accent-500/30 to-accent-glow/15 text-accent-200 ring-1 ring-inset ring-accent-500/30"
          >
            <CheckCircle2 class="size-10" />
          </span>

          <h1 class="mt-6 text-2xl font-extrabold text-hi sm:text-3xl">ชำระเงินสำเร็จ</h1>
          <p class="mt-2.5 text-sm text-lo">
            ขอบคุณที่สมัครสมาชิก DUDI — บัญชีของคุณพร้อมรับชมแล้ว
          </p>

          <dl class="mt-8 divide-y divide-line rounded-2xl bg-ink/50 px-5 text-left ring-1 ring-inset ring-line">
            <div class="flex items-center justify-between gap-4 py-3.5">
              <dt class="text-[13px] text-lo">แพ็กเกจ</dt>
              <dd class="inline-flex items-center gap-1.5 text-sm font-bold text-hi">
                <Crown class="size-3.5 text-accent-300" />{{ plan.name }}
              </dd>
            </div>
            <div class="flex items-center justify-between gap-4 py-3.5">
              <dt class="text-[13px] text-lo">ราคา</dt>
              <dd class="text-sm font-bold text-hi">{{ price }}.00 บาท / เดือน</dd>
            </div>
            <div class="flex items-center justify-between gap-4 py-3.5">
              <dt class="text-[13px] text-lo">ช่องทางชำระเงิน</dt>
              <dd class="text-sm font-medium text-mid">
                {{ PAYMENT_LABELS[subscription.paymentMethod] }}
              </dd>
            </div>
            <div class="flex items-center justify-between gap-4 py-3.5">
              <dt class="text-[13px] text-lo">สถานะ</dt>
              <dd>
                <span
                  class="rounded-full bg-emerald-500/12 px-2.5 py-1 text-[11px] font-bold text-emerald-300"
                >
                  ใช้งานอยู่
                </span>
              </dd>
            </div>
            <div class="flex items-center justify-between gap-4 py-3.5">
              <dt class="text-[13px] text-lo">วันเริ่มต้น</dt>
              <dd class="text-sm font-medium text-mid">{{ formatThaiDate(subscription.startedAt) }}</dd>
            </div>
            <div class="flex items-center justify-between gap-4 py-3.5">
              <dt class="text-[13px] text-lo">วันหมดอายุ</dt>
              <dd class="text-sm font-medium text-mid">{{ formatThaiDate(subscription.expiresAt) }}</dd>
            </div>
          </dl>

          <div class="mt-8 flex flex-wrap justify-center gap-3">
            <AppButton to="/" size="lg" variant="live">เริ่มรับชม</AppButton>
            <AppButton to="/account?tab=subscription" size="lg" variant="outline">
              ดูแพ็กเกจของฉัน
            </AppButton>
          </div>
        </div>
      </div>
    </section>

    <!-- ============================================= checkout -->
    <template v-else>
      <NuxtLink
        to="/pricing"
        class="inline-flex items-center gap-1.5 text-[13px] font-semibold text-lo transition-colors hover:text-hi"
      >
        <ChevronLeft class="size-4" /> กลับไปเลือกแพ็กเกจ
      </NuxtLink>

      <header class="mt-5">
        <p class="text-[11px] font-bold tracking-[0.22em] text-accent-300 uppercase">Checkout</p>
        <h1 class="mt-2 text-3xl font-extrabold tracking-tight text-hi sm:text-4xl">
          {{ renewing ? 'ต่ออายุแพ็กเกจ' : 'ชำระเงิน' }}
        </h1>
      </header>

      <div class="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-8">
        <!-- ------------------------------------------ payment methods -->
        <section class="rounded-3xl bg-surface p-5 ring-1 ring-line sm:p-7">
          <h2 class="text-lg font-bold text-hi">เลือกวิธีชำระเงิน</h2>

          <div class="mt-5 grid grid-cols-3 gap-2">
            <button
              v-for="t in TABS"
              :key="t.id"
              type="button"
              class="flex flex-col items-center gap-2 rounded-2xl px-2 py-4 text-[12px] font-semibold ring-1 ring-inset transition-all duration-250"
              :class="
                method === t.id
                  ? 'bg-accent-500/12 text-hi ring-accent-500/50'
                  : 'bg-ink/50 text-mid ring-line hover:bg-white/5 hover:text-hi'
              "
              @click="method = t.id"
            >
              <component :is="t.icon" class="size-5" :class="method === t.id && 'text-accent-300'" />
              {{ t.label }}
            </button>
          </div>

          <!-- ------------------------------------------------ QR -->
          <div v-if="method === 'qr'" class="mt-7 text-center">
            <div class="mx-auto w-full max-w-64 rounded-2xl bg-white p-4 shadow-[0_20px_50px_-20px_#000]">
              <img :src="qr" alt="QR สำหรับชำระเงิน (จำลอง)" class="w-full" />
            </div>
            <p class="mt-4 text-sm font-semibold text-hi">สแกนเพื่อชำระเงิน</p>
            <p class="mt-1.5 text-[12px] text-lo">
              เปิดแอปธนาคารแล้วสแกน QR · ยอด {{ price }}.00 บาท
            </p>
            <p class="mt-1 text-[11px] text-lo/70">QR นี้เป็นภาพจำลองสำหรับการสาธิตเท่านั้น</p>

            <AppButton
              variant="live"
              size="lg"
              block
              class="mt-6"
              :disabled="processing"
              @click="pay('qr')"
            >
              <Loader2 v-if="processing" class="size-4.5 animate-spin" />
              {{ processing ? 'กำลังตรวจสอบการชำระเงิน…' : 'จำลองชำระเงินสำเร็จ' }}
            </AppButton>
          </div>

          <!-- -------------------------------------------- credit card -->
          <form v-else-if="method === 'credit'" class="mt-7 space-y-4" @submit.prevent="pay('credit')">
            <label class="block">
              <span class="mb-2 block text-[13px] font-semibold text-mid">ชื่อผู้ถือบัตร</span>
              <input
                v-model="card.holder"
                type="text"
                autocomplete="off"
                placeholder="NATCHANOK T."
                class="h-12 w-full rounded-xl bg-ink/60 px-4 text-sm text-hi uppercase ring-1 ring-inset transition-all focus:outline-none"
                :class="errors.holder ? 'ring-live/70' : 'ring-line focus:ring-accent-500/60'"
                @input="errors.holder = ''"
              />
              <span v-if="errors.holder" class="mt-1.5 block text-[12px] text-live">
                {{ errors.holder }}
              </span>
            </label>

            <label class="block">
              <span class="mb-2 block text-[13px] font-semibold text-mid">หมายเลขบัตร</span>
              <input
                :value="card.number"
                type="text"
                inputmode="numeric"
                autocomplete="off"
                placeholder="4242 4242 4242 4242"
                class="h-12 w-full rounded-xl bg-ink/60 px-4 text-sm tracking-widest text-hi tabular-nums ring-1 ring-inset transition-all focus:outline-none"
                :class="errors.number ? 'ring-live/70' : 'ring-line focus:ring-accent-500/60'"
                @input="formatCardNumber"
              />
              <span v-if="errors.number" class="mt-1.5 block text-[12px] text-live">
                {{ errors.number }}
              </span>
            </label>

            <div class="grid grid-cols-2 gap-4">
              <label class="block">
                <span class="mb-2 block text-[13px] font-semibold text-mid">วันหมดอายุ</span>
                <input
                  :value="card.expiry"
                  type="text"
                  inputmode="numeric"
                  autocomplete="off"
                  placeholder="MM/YY"
                  class="h-12 w-full rounded-xl bg-ink/60 px-4 text-sm text-hi tabular-nums ring-1 ring-inset transition-all focus:outline-none"
                  :class="errors.expiry ? 'ring-live/70' : 'ring-line focus:ring-accent-500/60'"
                  @input="formatExpiry"
                />
                <span v-if="errors.expiry" class="mt-1.5 block text-[12px] text-live">
                  {{ errors.expiry }}
                </span>
              </label>
              <label class="block">
                <span class="mb-2 block text-[13px] font-semibold text-mid">CVV</span>
                <input
                  v-model="card.cvv"
                  type="password"
                  inputmode="numeric"
                  maxlength="4"
                  autocomplete="off"
                  placeholder="•••"
                  class="h-12 w-full rounded-xl bg-ink/60 px-4 text-sm text-hi tabular-nums ring-1 ring-inset transition-all focus:outline-none"
                  :class="errors.cvv ? 'ring-live/70' : 'ring-line focus:ring-accent-500/60'"
                  @input="errors.cvv = ''"
                />
                <span v-if="errors.cvv" class="mt-1.5 block text-[12px] text-live">
                  {{ errors.cvv }}
                </span>
              </label>
            </div>

            <p class="flex items-start gap-2 text-[11px] leading-relaxed text-lo">
              <Lock class="mt-0.5 size-3.5 shrink-0" />
              ข้อมูลบัตรใช้ตรวจสอบรูปแบบเท่านั้น ไม่มีการบันทึกหรือส่งออกนอกเบราว์เซอร์
            </p>

            <AppButton type="submit" variant="live" size="lg" block :disabled="processing">
              <Loader2 v-if="processing" class="size-4.5 animate-spin" />
              {{ processing ? 'กำลังดำเนินการ…' : `ชำระเงิน ${price}.00 บาท` }}
            </AppButton>
          </form>

          <!-- --------------------------------------------- truemoney -->
          <form v-else class="mt-7 space-y-4" @submit.prevent="pay('truemoney')">
            <label class="block">
              <span class="mb-2 block text-[13px] font-semibold text-mid">เบอร์โทรศัพท์</span>
              <input
                v-model="phone"
                type="tel"
                inputmode="numeric"
                autocomplete="off"
                placeholder="08X-XXX-XXXX"
                class="h-12 w-full rounded-xl bg-ink/60 px-4 text-sm text-hi tabular-nums ring-1 ring-inset transition-all focus:outline-none"
                :class="errors.phone ? 'ring-live/70' : 'ring-line focus:ring-accent-500/60'"
                @input="errors.phone = ''"
              />
              <span v-if="errors.phone" class="mt-1.5 block text-[12px] text-live">
                {{ errors.phone }}
              </span>
            </label>

            <p class="flex items-start gap-2 text-[11px] leading-relaxed text-lo">
              <Lock class="mt-0.5 size-3.5 shrink-0" />
              ระบบจะบันทึกเพียงช่องทางชำระเงิน ไม่เก็บเบอร์โทรศัพท์ไว้ในเครื่อง
            </p>

            <AppButton type="submit" variant="live" size="lg" block :disabled="processing">
              <Loader2 v-if="processing" class="size-4.5 animate-spin" />
              {{ processing ? 'กำลังดำเนินการ…' : 'ชำระเงิน' }}
            </AppButton>
          </form>
        </section>

        <!-- ------------------------------------------- order summary -->
        <aside class="lg:sticky lg:top-24 lg:self-start">
          <div
            class="relative overflow-hidden rounded-3xl bg-gradient-to-b from-accent-600/22 via-surface to-surface p-6 ring-1 ring-accent-500/30"
          >
            <div
              class="pointer-events-none absolute -top-24 left-1/2 size-56 -translate-x-1/2 rounded-full bg-accent-500/25 blur-[70px]"
              aria-hidden="true"
            />
            <div class="relative">
              <h2 class="text-sm font-bold text-hi">สรุปรายการ</h2>

              <div class="mt-4 flex items-center justify-between gap-3">
                <span
                  class="inline-flex items-center gap-1.5 rounded-md bg-gradient-to-r from-accent-500 to-accent-glow px-2 py-0.5 text-[10px] font-bold text-white uppercase"
                >
                  <Crown class="size-3" /> {{ plan.name }}
                </span>
                <span class="text-2xl font-extrabold text-hi">
                  {{ plan.priceLabel }}
                  <span class="text-xs font-medium text-lo">บาท</span>
                </span>
              </div>
              <p class="mt-1.5 text-[12px] text-lo">เรียกเก็บ {{ plan.period }} · ยกเลิกได้ทุกเมื่อ</p>

              <ul class="mt-5 space-y-2.5 border-t border-line pt-5">
                <li
                  v-for="f in includedFeatures"
                  :key="f.label"
                  class="flex items-start gap-2.5 text-[12px] leading-relaxed text-mid"
                >
                  <Check class="mt-px size-3.5 shrink-0 text-accent-300" />
                  {{ f.label }}
                </li>
              </ul>

              <div class="mt-5 flex items-center justify-between border-t border-line pt-4">
                <span class="text-[13px] font-semibold text-mid">ยอดชำระวันนี้</span>
                <span class="text-lg font-extrabold text-hi">{{ price }}.00 บาท</span>
              </div>

              <p class="mt-4 flex items-start gap-2 text-[11px] leading-relaxed text-lo">
                <ShieldCheck class="mt-0.5 size-3.5 shrink-0 text-accent-300" />
                การชำระเงินทั้งหมดในหน้านี้เป็นการจำลอง ไม่มีการเชื่อมต่อผู้ให้บริการชำระเงินจริง
              </p>
            </div>
          </div>
        </aside>
      </div>
    </template>
  </div>
</template>
