<script setup lang="ts">
import {
  Crown,
  CreditCard,
  Download,
  LogOut,
  Monitor,
  Smartphone,
  Tablet,
  Trash2,
  BookmarkX,
} from 'lucide-vue-next'
import { ALL_TITLES, pickBy, TITLE_BY_ID } from '~/data/catalog'
import { CONTINUE_WATCHING, PROFILE } from '~/data/site'
import type { Title } from '~/types'
import { PLAN_LABELS, PLAN_PRICES, formatThaiDate, PAYMENT_LABELS } from '~/composables/useSubscription'

definePageMeta({ middleware: 'auth' })
useHead({ title: 'บัญชีของฉัน — DUDI' })

const route = useRoute()
const router = useRouter()
const section = ref<string>((route.query.tab as string) || 'profile')
watch(section, (s) => router.replace({ query: s === 'profile' ? {} : { tab: s } }))
watch(
  () => route.query.tab,
  (t) => {
    if (typeof t === 'string' && t !== section.value) section.value = t
    if (!t && section.value !== 'profile') section.value = 'profile'
  },
)

const { ids, toggle } = useMyList()
const myList = computed(() => ids.value.map((id) => TITLE_BY_ID.get(id)).filter(Boolean) as Title[])

/* ---------------------------------------------- session + plan state */
const { user, logout } = useAuth()
const { subscription, currentPlan, isActive, expired, daysRemaining } = useSubscription()
const { recent, continueWatching, clearHistory } = useWatchHistory()

const planLabel = computed(() => PLAN_LABELS[currentPlan.value])
const planPrice = computed(() =>
  currentPlan.value === 'free' ? 'ไม่มีค่าใช้จ่าย' : `${PLAN_PRICES[currentPlan.value]} บาท / เดือน`,
)
const renewTarget = computed(
  () => `/payment?plan=${currentPlan.value === 'free' ? 'premium' : currentPlan.value}`,
)

function signOut() {
  logout()
  navigateTo('/')
}

/* Watch history: real entries first, sample rows only when empty. */
const continueRail = computed(() =>
  continueWatching.value.length ? continueWatching.value : CONTINUE_WATCHING,
)
const historyTitles = computed(() => {
  const watched = recent.value
    .map((h) => TITLE_BY_ID.get(h.contentId))
    .filter(Boolean) as Title[]
  return watched.length ? watched : pickBy(ALL_TITLES, 4, 12, 3)
})

const settings = reactive({
  autoplayNext: true,
  autoplayPreview: true,
  dataSaver: false,
  pushNotifications: true,
  emailNews: false,
  subtitleDefault: true,
})

const BILLING = [
  { id: 'INV-2569-09', date: '14 ก.ย. 2569', amount: '149.00', status: 'ชำระแล้ว' },
  { id: 'INV-2569-08', date: '14 ส.ค. 2569', amount: '149.00', status: 'ชำระแล้ว' },
  { id: 'INV-2569-07', date: '14 ก.ค. 2569', amount: '149.00', status: 'ชำระแล้ว' },
  { id: 'INV-2569-06', date: '14 มิ.ย. 2569', amount: '99.00', status: 'ชำระแล้ว' },
]

const DEVICES = [
  { icon: Monitor, name: 'MacBook Pro · Chrome', last: 'ใช้งานล่าสุด 2 นาทีที่แล้ว', current: true },
  { icon: Smartphone, name: 'iPhone 16 · แอป DUDI', last: 'ใช้งานล่าสุดเมื่อวาน', current: false },
  { icon: Tablet, name: 'iPad Air · แอป DUDI', last: 'ใช้งานล่าสุด 3 วันก่อน', current: false },
]
</script>

<template>
  <div class="shell pt-24 pb-16 lg:pt-32">
    <div class="grid gap-8 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-12">
      <AccountSidebar v-model="section" />

      <div class="min-w-0">
        <Transition name="fade" mode="out-in">
          <!-- ------------------------------------------------ profile -->
          <div v-if="section === 'profile'" key="profile" class="space-y-6">
            <ProfileCard />

            <section class="rounded-3xl bg-surface p-6 ring-1 ring-line sm:p-8">
              <h2 class="text-lg font-bold text-hi">ข้อมูลบัญชี</h2>
              <div class="mt-6 grid gap-5 sm:grid-cols-2">
                <label class="block">
                  <span class="mb-2 block text-[13px] font-semibold text-mid">ชื่อที่แสดง</span>
                  <input
                    :value="user?.name ?? PROFILE.name"
                    type="text"
                    class="h-12 w-full rounded-xl bg-ink/60 px-4 text-sm text-hi ring-1 ring-inset ring-line transition-all focus:ring-accent-500/60 focus:outline-none"
                  />
                </label>
                <label class="block">
                  <span class="mb-2 block text-[13px] font-semibold text-mid">อีเมล</span>
                  <input
                    :value="user?.email ?? PROFILE.email"
                    type="email"
                    class="h-12 w-full rounded-xl bg-ink/60 px-4 text-sm text-hi ring-1 ring-inset ring-line transition-all focus:ring-accent-500/60 focus:outline-none"
                  />
                </label>
                <label class="block">
                  <span class="mb-2 block text-[13px] font-semibold text-mid">เบอร์โทรศัพท์</span>
                  <input
                    value="08X-XXX-XXXX"
                    type="tel"
                    class="h-12 w-full rounded-xl bg-ink/60 px-4 text-sm text-hi ring-1 ring-inset ring-line transition-all focus:ring-accent-500/60 focus:outline-none"
                  />
                </label>
                <label class="block">
                  <span class="mb-2 block text-[13px] font-semibold text-mid">ภาษา</span>
                  <select
                    class="h-12 w-full appearance-none rounded-xl bg-ink/60 px-4 text-sm text-hi ring-1 ring-inset ring-line focus:ring-accent-500/60 focus:outline-none"
                  >
                    <option>ไทย</option>
                    <option>English</option>
                  </select>
                </label>
              </div>
              <div class="mt-7 flex flex-wrap gap-3">
                <AppButton variant="live">บันทึกการเปลี่ยนแปลง</AppButton>
                <AppButton variant="ghost">ยกเลิก</AppButton>
                <AppButton variant="ghost" class="ml-auto" @click="signOut">
                  <LogOut class="size-4" /> ออกจากระบบ
                </AppButton>
              </div>
            </section>
          </div>

          <!-- ------------------------------------------- subscription -->
          <div v-else-if="section === 'subscription'" key="subscription" class="space-y-6">
            <section
              class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-accent-600/30 via-surface to-surface p-6 ring-1 ring-accent-500/30 sm:p-8"
            >
              <div
                class="pointer-events-none absolute -top-24 -right-12 size-72 rounded-full bg-accent-500/25 blur-[80px]"
              />
              <div class="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <span
                    v-if="isActive"
                    class="inline-flex items-center gap-1.5 rounded-md bg-gradient-to-r from-accent-500 to-accent-glow px-2.5 py-1 text-[10px] font-bold tracking-wide text-white uppercase"
                  >
                    <Crown class="size-3" /> {{ planLabel }}
                  </span>
                  <span
                    v-else-if="expired"
                    class="inline-flex items-center gap-1.5 rounded-md bg-live/18 px-2.5 py-1 text-[10px] font-bold tracking-wide text-live uppercase"
                  >
                    หมดอายุแล้ว
                  </span>
                  <span
                    v-else
                    class="inline-flex items-center gap-1.5 rounded-md bg-white/12 px-2.5 py-1 text-[10px] font-bold tracking-wide text-mid uppercase"
                  >
                    {{ planLabel }}
                  </span>

                  <h2 class="mt-4 text-2xl font-extrabold text-hi sm:text-3xl">
                    {{ planPrice }}
                  </h2>

                  <p v-if="subscription" class="mt-2 text-[13px] text-mid">
                    <template v-if="isActive">
                      ต่ออายุอัตโนมัติวันที่ {{ formatThaiDate(subscription.expiresAt) }} ·
                      เหลืออีก {{ daysRemaining }} วัน
                    </template>
                    <template v-else>
                      หมดอายุเมื่อ {{ formatThaiDate(subscription.expiresAt) }} —
                      ต่ออายุเพื่อรับชมเนื้อหาพรีเมียมต่อ
                    </template>
                  </p>
                  <p v-else class="mt-2 text-[13px] text-mid">
                    คุณกำลังใช้งานแบบฟรี — สมัครแพ็กเกจเพื่อรับชมเนื้อหาพรีเมียมทั้งหมด
                  </p>
                </div>
                <div class="flex flex-wrap gap-3">
                  <AppButton to="/pricing" variant="secondary">เปลี่ยนแพ็กเกจ</AppButton>
                  <AppButton :to="renewTarget" variant="live">
                    {{ subscription ? 'ต่ออายุ' : 'สมัครแพ็กเกจ' }}
                  </AppButton>
                </div>
              </div>
            </section>

            <section class="rounded-3xl bg-surface p-6 ring-1 ring-line sm:p-8">
              <h2 class="text-lg font-bold text-hi">วิธีการชำระเงิน</h2>
              <div
                class="mt-5 flex items-center gap-4 rounded-2xl bg-ink/50 p-4 ring-1 ring-inset ring-line"
              >
                <span class="grid size-12 shrink-0 place-items-center rounded-xl bg-white/8 text-mid">
                  <CreditCard class="size-5" />
                </span>
                <div class="min-w-0 flex-1">
                  <p class="text-sm font-semibold text-hi">
                    {{ subscription ? PAYMENT_LABELS[subscription.paymentMethod] : 'ยังไม่มีวิธีชำระเงิน' }}
                  </p>
                  <p class="mt-0.5 text-[12px] text-lo">
                    {{
                      subscription
                        ? `ใช้ชำระครั้งล่าสุดเมื่อ ${formatThaiDate(subscription.startedAt)}`
                        : 'เลือกแพ็กเกจเพื่อเพิ่มวิธีชำระเงิน'
                    }}
                  </p>
                </div>
                <AppButton :to="renewTarget" variant="secondary" size="sm">
                  {{ subscription ? 'เปลี่ยน' : 'เพิ่ม' }}
                </AppButton>
              </div>
              <p class="mt-4 text-[12px] text-lo">
                ระบบบันทึกเฉพาะช่องทางชำระเงินเท่านั้น ไม่มีการเก็บหมายเลขบัตรหรือเบอร์โทรศัพท์
              </p>
            </section>

            <section class="rounded-3xl bg-surface p-6 ring-1 ring-line sm:p-8">
              <h2 class="text-lg font-bold text-hi">ประวัติการเรียกเก็บเงิน</h2>
              <div class="mt-5 overflow-x-auto">
                <table class="w-full min-w-[520px] text-sm">
                  <thead>
                    <tr class="text-left text-[12px] text-lo">
                      <th class="pb-3 font-medium">เลขที่</th>
                      <th class="pb-3 font-medium">วันที่</th>
                      <th class="pb-3 font-medium">จำนวน</th>
                      <th class="pb-3 font-medium">สถานะ</th>
                      <th class="pb-3" />
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="b in BILLING" :key="b.id" class="border-t border-line">
                      <td class="py-3.5 font-medium text-mid">{{ b.id }}</td>
                      <td class="py-3.5 text-mid">{{ b.date }}</td>
                      <td class="py-3.5 font-semibold text-hi">{{ b.amount }} บาท</td>
                      <td class="py-3.5">
                        <span
                          class="rounded-full bg-emerald-500/12 px-2.5 py-1 text-[11px] font-semibold text-emerald-300"
                        >
                          {{ b.status }}
                        </span>
                      </td>
                      <td class="py-3.5 text-right">
                        <IconButton label="ดาวน์โหลดใบเสร็จ" size="sm">
                          <Download class="size-4" />
                        </IconButton>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          <!-- ---------------------------------------------- history -->
          <div v-else-if="section === 'history'" key="history" class="space-y-10">
            <section>
              <SectionHeader title="ดูต่อจากที่ค้างไว้" subtitle="กำลังรับชมอยู่ตอนนี้" />
              <div class="grid gap-x-4 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
                <ContinueWatchingCard v-for="c in continueRail" :key="c.id" :item="c" />
              </div>
            </section>

            <section>
              <div class="mb-4 flex items-end justify-between gap-4 sm:mb-5">
                <div>
                  <h2 class="text-lg font-bold tracking-tight text-hi sm:text-xl lg:text-2xl">
                    ประวัติการรับชมทั้งหมด
                  </h2>
                  <p class="mt-1 text-xs text-lo sm:text-sm">
                    {{ recent.length ? `${recent.length} รายการที่บันทึกไว้` : 'ยังไม่มีประวัติ — แสดงตัวอย่างเนื้อหา' }}
                  </p>
                </div>
                <button
                  v-if="recent.length"
                  type="button"
                  class="shrink-0 rounded-lg px-2 py-1 text-xs font-semibold text-mid transition-colors hover:bg-white/6 hover:text-hi sm:text-[13px]"
                  @click="clearHistory()"
                >
                  ล้างประวัติ
                </button>
              </div>
              <CategoryGrid :titles="historyTitles" />
            </section>
          </div>

          <!-- ----------------------------------------------- my list -->
          <div v-else-if="section === 'mylist'" key="mylist">
            <SectionHeader
              title="รายการของฉัน"
              :subtitle="`บันทึกไว้ ${myList.length} เรื่อง`"
              see-all-to="/category"
              see-all-label="เพิ่มเรื่องใหม่"
            />

            <div v-if="myList.length" class="grid gap-x-3 gap-y-6 sm:gap-x-4 sm:gap-y-8 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              <div v-for="t in myList" :key="t.id" class="group/ml relative">
                <MovieCard :title="t" />
                <button
                  type="button"
                  class="absolute -top-2 -right-2 z-20 grid size-8 place-items-center rounded-full bg-live text-white opacity-0 shadow-lg transition-opacity duration-300 group-hover/ml:opacity-100"
                  :aria-label="`นำ ${t.title} ออกจากรายการ`"
                  @click="toggle(t.id)"
                >
                  <Trash2 class="size-4" />
                </button>
              </div>
            </div>

            <div
              v-else
              class="flex flex-col items-center justify-center rounded-2xl border border-dashed border-line px-6 py-20 text-center"
            >
              <span class="grid size-14 place-items-center rounded-2xl bg-surface text-lo">
                <BookmarkX class="size-7" />
              </span>
              <h3 class="mt-4 text-base font-semibold text-hi">ยังไม่มีรายการที่บันทึกไว้</h3>
              <p class="mt-1.5 max-w-sm text-sm text-lo">
                กดปุ่ม + บนโปสเตอร์เรื่องที่สนใจ แล้วกลับมาดูที่นี่ได้ทุกเมื่อ
              </p>
              <AppButton to="/movies" variant="live" class="mt-6">เลือกดูหนัง</AppButton>
            </div>
          </div>

          <!-- ---------------------------------------------- settings -->
          <div v-else key="settings" class="space-y-6">
            <section class="rounded-3xl bg-surface p-6 ring-1 ring-line sm:p-8">
              <h2 class="text-lg font-bold text-hi">การเล่นวิดีโอ</h2>
              <div class="mt-2 divide-y divide-line">
                <ToggleSwitch
                  v-model="settings.autoplayNext"
                  label="เล่นตอนถัดไปอัตโนมัติ"
                  hint="เมื่อดูจบตอน ระบบจะเล่นตอนถัดไปให้โดยอัตโนมัติ"
                />
                <ToggleSwitch
                  v-model="settings.autoplayPreview"
                  label="เล่นตัวอย่างขณะเลื่อนดู"
                  hint="แสดงตัวอย่างสั้นเมื่อวางเมาส์ค้างบนโปสเตอร์"
                />
                <ToggleSwitch
                  v-model="settings.subtitleDefault"
                  label="เปิดคำบรรยายไทยเป็นค่าเริ่มต้น"
                />
                <ToggleSwitch
                  v-model="settings.dataSaver"
                  label="โหมดประหยัดอินเทอร์เน็ต"
                  hint="จำกัดความคมชัดสูงสุดที่ 720p เมื่อใช้เครือข่ายมือถือ"
                />
              </div>
            </section>

            <section class="rounded-3xl bg-surface p-6 ring-1 ring-line sm:p-8">
              <h2 class="text-lg font-bold text-hi">การแจ้งเตือน</h2>
              <div class="mt-2 divide-y divide-line">
                <ToggleSwitch
                  v-model="settings.pushNotifications"
                  label="แจ้งเตือนตอนใหม่และไลฟ์"
                  hint="รับการแจ้งเตือนเมื่อช่องที่ติดตามเริ่มถ่ายทอดสด"
                />
                <ToggleSwitch
                  v-model="settings.emailNews"
                  label="อีเมลข่าวสารและโปรโมชัน"
                />
              </div>
            </section>

            <section class="rounded-3xl bg-surface p-6 ring-1 ring-line sm:p-8">
              <h2 class="text-lg font-bold text-hi">อุปกรณ์ที่เข้าสู่ระบบ</h2>
              <ul class="mt-5 space-y-3">
                <li
                  v-for="d in DEVICES"
                  :key="d.name"
                  class="flex items-center gap-4 rounded-2xl bg-ink/50 p-4 ring-1 ring-inset ring-line"
                >
                  <span class="grid size-11 shrink-0 place-items-center rounded-xl bg-white/8 text-mid">
                    <component :is="d.icon" class="size-5" />
                  </span>
                  <div class="min-w-0 flex-1">
                    <p class="flex items-center gap-2 text-[13px] font-semibold text-hi">
                      {{ d.name }}
                      <span
                        v-if="d.current"
                        class="rounded-md bg-accent-500/18 px-1.5 py-0.5 text-[10px] font-bold text-accent-200"
                      >
                        เครื่องนี้
                      </span>
                    </p>
                    <p class="mt-0.5 text-[12px] text-lo">{{ d.last }}</p>
                  </div>
                  <AppButton v-if="!d.current" variant="ghost" size="sm">ออกจากระบบ</AppButton>
                </li>
              </ul>
              <AppButton variant="secondary" class="mt-6" @click="signOut">
                <LogOut class="size-4" /> ออกจากระบบทุกอุปกรณ์
              </AppButton>
            </section>

            <DeveloperPanel />
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.25s ease,
    transform 0.25s var(--ease-out-expo);
}
.fade-enter-from {
  opacity: 0;
  transform: translateY(12px);
}
.fade-leave-to {
  opacity: 0;
}
</style>
