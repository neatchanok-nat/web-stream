<script setup lang="ts">
import { Check, Minus, ChevronDown, ShieldCheck, Smartphone, Tv, Laptop } from 'lucide-vue-next'
import { PRICING_FAQ, PRICING_PLANS } from '~/data/site'

useHead({ title: 'แพ็กเกจและราคา — DUDI' })

const openFaq = ref<number | null>(0)

/* --------------------------------------------------------------
   Plan selection. The subscription is NOT activated here — the
   choice is carried to the payment page and confirmed there.
   -------------------------------------------------------------- */
const { isLoggedIn } = useAuth()
const { currentPlan, isActive } = useSubscription()
const selectedPlan = useState<string | null>('dudi:selected-plan', () => null)

function selectPlan(plan: { id: string }) {
  selectedPlan.value = plan.id

  // FREE needs no checkout — it is the default tier for any account.
  if (plan.id === 'free') {
    return navigateTo(isLoggedIn.value ? '/account?tab=subscription' : '/login?redirect=/pricing')
  }

  const checkout = `/payment?plan=${plan.id}`
  navigateTo(isLoggedIn.value ? checkout : `/login?redirect=${encodeURIComponent(checkout)}`)
}

const COMPARE_ROWS = [
  { label: 'คอนเทนต์ฟรี', free: true, standard: true, premium: true },
  { label: 'ละคร ซีรีส์ และหนังทั้งหมด', free: false, standard: true, premium: true },
  { label: 'DUDI Originals', free: false, standard: false, premium: true },
  { label: 'ความคมชัดสูงสุด', free: '720p', standard: '1080p', premium: '4K HDR' },
  { label: 'ระบบเสียง', free: 'สเตอริโอ', standard: '5.1', premium: 'Dolby Atmos' },
  { label: 'จำนวนอุปกรณ์พร้อมกัน', free: '1', standard: '2', premium: '4' },
  { label: 'ดาวน์โหลดออฟไลน์', free: false, standard: '10 เรื่อง', premium: 'ไม่จำกัด' },
  { label: 'ไม่มีโฆษณาคั่น', free: false, standard: true, premium: true },
  { label: 'ดูไลฟ์ย้อนหลัง', free: false, standard: '7 วัน', premium: '30 วัน' },
]

const DEVICES = [
  { icon: Tv, label: 'สมาร์ททีวี' },
  { icon: Laptop, label: 'คอมพิวเตอร์' },
  { icon: Smartphone, label: 'มือถือและแท็บเล็ต' },
  { icon: ShieldCheck, label: 'กล่องสตรีมมิง' },
]
</script>

<template>
  <div class="shell pt-24 pb-16 lg:pt-32">
    <!-- header -->
    <header class="mx-auto max-w-2xl text-center">
      <p class="text-[11px] font-bold tracking-[0.22em] text-accent-300 uppercase">Pricing</p>
      <h1 class="mt-3 text-3xl font-extrabold tracking-tight text-hi sm:text-5xl">
        เลือกแพ็กเกจที่ใช่สำหรับคุณ
      </h1>
      <p class="mt-4 text-sm leading-relaxed text-lo sm:text-base">
        เริ่มดูฟรีได้ทันที หรืออัปเกรดเพื่อรับชมคอนเทนต์ทั้งหมดแบบไม่มีโฆษณา
        เปลี่ยนหรือยกเลิกแพ็กเกจได้ทุกเมื่อ
      </p>
    </header>

    <!-- plans -->
    <div class="mt-14 grid gap-5 lg:mt-20 lg:grid-cols-3 lg:gap-6">
      <PricingCard
        v-for="p in PRICING_PLANS"
        :key="p.id"
        :plan="p"
        :current="isActive ? p.id === currentPlan : p.id === 'free'"
        @select="selectPlan"
      />
    </div>

    <p class="mt-7 text-center text-xs text-lo">
      ราคารวมภาษีมูลค่าเพิ่มแล้ว · หน้านี้เป็นการสาธิต UI เท่านั้น ยังไม่มีการเชื่อมต่อระบบชำระเงิน
    </p>

    <!-- comparison table -->
    <section class="mt-20">
      <h2 class="text-center text-xl font-bold text-hi sm:text-2xl">เปรียบเทียบแพ็กเกจ</h2>

      <div class="mt-8 overflow-x-auto">
        <table class="w-full min-w-[640px] border-separate border-spacing-0 text-sm">
          <thead>
            <tr>
              <th class="w-2/5 px-4 pb-4 text-left text-[13px] font-semibold text-lo">คุณสมบัติ</th>
              <th
                v-for="p in PRICING_PLANS"
                :key="p.id"
                class="px-4 pb-4 text-center text-[13px] font-extrabold tracking-wider uppercase"
                :class="p.highlight ? 'text-accent-200' : 'text-hi'"
              >
                {{ p.name }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, i) in COMPARE_ROWS" :key="row.label">
              <td
                class="border-t border-line px-4 py-3.5 text-left text-[13px] text-mid"
                :class="i === COMPARE_ROWS.length - 1 && 'rounded-bl-xl'"
              >
                {{ row.label }}
              </td>
              <td
                v-for="key in ['free', 'standard', 'premium'] as const"
                :key="key"
                class="border-t border-line px-4 py-3.5 text-center"
                :class="key === 'premium' && 'bg-accent-500/6'"
              >
                <span v-if="row[key] === true" class="inline-grid size-6 place-items-center rounded-full bg-accent-500/18 text-accent-200">
                  <Check class="size-3.5" />
                </span>
                <span v-else-if="row[key] === false" class="inline-grid size-6 place-items-center rounded-full bg-white/5 text-lo/60">
                  <Minus class="size-3" />
                </span>
                <span v-else class="text-[13px] font-medium text-hi">{{ row[key] }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- devices -->
    <section class="mt-20 rounded-3xl bg-surface/60 p-8 ring-1 ring-line sm:p-10">
      <div class="grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:items-center">
        <div>
          <h2 class="text-xl font-bold text-hi sm:text-2xl">ดูได้ทุกอุปกรณ์</h2>
          <p class="mt-3 text-sm leading-relaxed text-lo">
            เริ่มดูบนมือถือระหว่างเดินทาง แล้วดูต่อบนทีวีที่บ้านได้ทันที
            ระบบจำตำแหน่งที่คุณหยุดไว้ให้อัตโนมัติ
          </p>
        </div>
        <ul class="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <li
            v-for="d in DEVICES"
            :key="d.label"
            class="flex flex-col items-center gap-3 rounded-2xl bg-ink/60 p-5 text-center ring-1 ring-inset ring-line transition-transform hover:-translate-y-1"
          >
            <component :is="d.icon" class="size-7 text-accent-300" />
            <span class="text-[12px] font-medium text-mid">{{ d.label }}</span>
          </li>
        </ul>
      </div>
    </section>

    <!-- faq -->
    <section class="mx-auto mt-20 max-w-3xl">
      <h2 class="text-center text-xl font-bold text-hi sm:text-2xl">คำถามที่พบบ่อย</h2>
      <ul class="mt-8 space-y-3">
        <li
          v-for="(f, i) in PRICING_FAQ"
          :key="f.q"
          class="overflow-hidden rounded-2xl bg-surface/60 ring-1 ring-inset ring-line transition-colors"
          :class="openFaq === i && 'bg-surface ring-line-strong'"
        >
          <button
            type="button"
            class="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
            :aria-expanded="openFaq === i"
            @click="openFaq = openFaq === i ? null : i"
          >
            <span class="text-sm font-semibold text-hi">{{ f.q }}</span>
            <ChevronDown
              class="size-4.5 shrink-0 text-lo transition-transform duration-300"
              :class="openFaq === i && 'rotate-180 text-accent-300'"
            />
          </button>
          <div
            class="grid transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]"
            :class="openFaq === i ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'"
          >
            <div class="overflow-hidden">
              <p class="px-5 pb-5 text-[13px] leading-relaxed text-mid">{{ f.a }}</p>
            </div>
          </div>
        </li>
      </ul>
    </section>

    <!-- cta -->
    <section class="mt-20 text-center">
      <h2 class="text-2xl font-extrabold text-hi sm:text-3xl">พร้อมเริ่มดูแล้วหรือยัง</h2>
      <p class="mt-3 text-sm text-lo">สมัครวันนี้ รับชมได้ทันทีโดยไม่มีข้อผูกมัด</p>
      <div class="mt-7 flex flex-wrap justify-center gap-3">
        <AppButton to="/login" size="lg" variant="live">เริ่มต้นใช้งาน</AppButton>
        <AppButton to="/" size="lg" variant="outline">กลับไปหน้าแรก</AppButton>
      </div>
    </section>
  </div>
</template>
