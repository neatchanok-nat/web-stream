<script setup lang="ts">
import { Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles, ChevronLeft } from 'lucide-vue-next'
import { MOVIES, SERIES, DRAMAS } from '~/data/catalog'
import { posterArt, backdropArt } from '~/utils/artwork'

definePageMeta({ layout: 'auth' })
useHead({ title: 'เข้าสู่ระบบ — DUDI' })

const email = ref('')
const password = ref('')
const remember = ref(true)
const showPassword = ref(false)
const submitting = ref(false)
const errors = reactive({ email: '', password: '' })

const route = useRoute()
const { login, loginAsDemo, isLoggedIn } = useAuth()

/** Where to land after signing in — set by the route guard / access gate. */
const redirectTo = computed(() => {
  const target = route.query.redirect
  return typeof target === 'string' && target.startsWith('/') ? target : '/'
})

// Already signed in? Skip the form.
onMounted(() => {
  if (isLoggedIn.value) navigateTo(redirectTo.value, { replace: true })
})

function validate(): boolean {
  errors.email = !email.value.trim()
    ? 'กรุณากรอกอีเมล'
    : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())
      ? 'รูปแบบอีเมลไม่ถูกต้อง'
      : ''
  errors.password = !password.value
    ? 'กรุณากรอกรหัสผ่าน'
    : password.value.length < 6
      ? 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร'
      : ''
  return !errors.email && !errors.password
}

/** No credentials are verified — the session is created locally. */
function onSubmit() {
  if (!validate()) return
  submitting.value = true
  setTimeout(() => {
    login(email.value)
    submitting.value = false
    navigateTo(redirectTo.value)
  }, 600)
}

function demoLogin() {
  errors.email = ''
  errors.password = ''
  submitting.value = true
  const user = loginAsDemo()
  email.value = user.email
  password.value = '••••••••'
  setTimeout(() => {
    submitting.value = false
    navigateTo(redirectTo.value)
  }, 400)
}

/** Poster mosaic for the left panel. */
const mosaic = computed(() =>
  [...MOVIES.slice(0, 5), ...SERIES.slice(0, 4), ...DRAMAS.slice(0, 5)].map((t) =>
    posterArt(t.artSeed),
  ),
)
const ambience = computed(() => backdropArt('login-ambience'))

const SOCIALS = [
  { id: 'google', label: 'Google', mark: 'G' },
  { id: 'apple', label: 'Apple', mark: 'A' },
  { id: 'line', label: 'LINE', mark: 'L' },
  { id: 'facebook', label: 'Facebook', mark: 'F' },
]
</script>

<template>
  <div class="grid min-h-svh lg:grid-cols-[1.05fr_1fr]">
    <!-- ------------------------------------------------ art panel -->
    <aside class="relative hidden overflow-hidden lg:block">
      <img :src="ambience" alt="" class="absolute inset-0 size-full object-cover opacity-70" />
      <div class="absolute inset-0 bg-gradient-to-br from-ink via-ink/80 to-accent-900/40" />

      <!-- drifting poster mosaic -->
      <div class="absolute inset-0 grid grid-cols-3 gap-4 p-10 opacity-45">
        <div
          v-for="col in 3"
          :key="col"
          class="flex flex-col gap-4"
          :style="{
            transform: `translateY(${col % 2 === 0 ? '-6%' : '4%'})`,
          }"
        >
          <img
            v-for="(src, i) in mosaic.slice((col - 1) * 4, (col - 1) * 4 + 4)"
            :key="i"
            :src="src"
            alt=""
            class="aspect-2/3 w-full rounded-xl object-cover shadow-[0_20px_50px_-20px_#000]"
          />
        </div>
      </div>
      <div class="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/70" />

      <div class="relative flex h-full flex-col justify-between p-12">
        <AppLogo size="lg" />
        <div class="max-w-md">
          <span
            class="inline-flex items-center gap-1.5 rounded-full bg-white/8 px-3 py-1 text-[11px] font-bold tracking-[0.18em] text-accent-100 uppercase ring-1 ring-inset ring-white/15"
          >
            <Sparkles class="size-3.5" /> DUDI Originals
          </span>
          <h2 class="mt-5 text-4xl leading-tight font-extrabold tracking-tight text-hi">
            ความบันเทิงไทย<br />ครบทุกเรื่องในที่เดียว
          </h2>
          <p class="mt-4 text-[15px] leading-relaxed text-white/65">
            หนัง ละคร ซีรีส์ออริจินัล รายการวาไรตี้ และไลฟ์สดจากครีเอเตอร์ทั่วประเทศ
            รับชมได้ทุกอุปกรณ์ ทุกที่ ทุกเวลา
          </p>
          <dl class="mt-8 grid grid-cols-3 gap-6 border-t border-line pt-6">
            <div>
              <dt class="text-2xl font-extrabold text-hi">12,000+</dt>
              <dd class="mt-1 text-xs text-lo">ชั่วโมงคอนเทนต์</dd>
            </div>
            <div>
              <dt class="text-2xl font-extrabold text-hi">4K HDR</dt>
              <dd class="mt-1 text-xs text-lo">ความคมชัดสูงสุด</dd>
            </div>
            <div>
              <dt class="text-2xl font-extrabold text-hi">24 ชม.</dt>
              <dd class="mt-1 text-xs text-lo">ไลฟ์สดไม่มีหยุด</dd>
            </div>
          </dl>
        </div>
      </div>
    </aside>

    <!-- ------------------------------------------------ form panel -->
    <main class="relative flex items-center justify-center px-5 py-10 sm:px-8">
      <div
        class="pointer-events-none absolute -top-20 right-0 size-72 rounded-full bg-accent-600/18 blur-[90px] lg:hidden"
      />

      <div class="relative w-full max-w-md">
        <div class="flex items-center justify-between lg:hidden">
          <AppLogo size="md" />
          <NuxtLink
            to="/"
            class="inline-flex items-center gap-1 text-[13px] font-semibold text-lo transition-colors hover:text-hi"
          >
            <ChevronLeft class="size-4" /> หน้าแรก
          </NuxtLink>
        </div>

        <h1 class="mt-10 text-3xl font-extrabold tracking-tight text-hi lg:mt-0 sm:text-4xl">
          เข้าสู่ระบบ
        </h1>
        <p class="mt-2.5 text-sm text-lo">
          ยังไม่มีบัญชี?
          <NuxtLink to="/pricing" class="font-semibold text-accent-200 hover:text-accent-100">
            สมัครสมาชิกฟรี
          </NuxtLink>
        </p>

        <form class="mt-8 space-y-4" @submit.prevent="onSubmit">
          <!-- email -->
          <label class="block">
            <span class="mb-2 block text-[13px] font-semibold text-mid">อีเมล</span>
            <span
              class="flex h-13 items-center rounded-xl bg-surface ring-1 ring-inset transition-all focus-within:bg-surface-2"
              :class="errors.email ? 'ring-live/70' : 'ring-line focus-within:ring-accent-500/60'"
            >
              <Mail class="ml-4 size-4.5 shrink-0 text-lo" />
              <input
                v-model="email"
                type="email"
                autocomplete="email"
                placeholder="you@example.com"
                class="h-full min-w-0 flex-1 bg-transparent px-3.5 text-sm text-hi placeholder:text-lo focus:outline-none"
                @input="errors.email = ''"
              />
            </span>
            <span v-if="errors.email" class="mt-1.5 block text-[12px] text-live">
              {{ errors.email }}
            </span>
          </label>

          <!-- password -->
          <label class="block">
            <span class="mb-2 flex items-center justify-between text-[13px] font-semibold text-mid">
              รหัสผ่าน
              <a href="#" class="font-medium text-lo transition-colors hover:text-accent-200">
                ลืมรหัสผ่าน?
              </a>
            </span>
            <span
              class="flex h-13 items-center rounded-xl bg-surface ring-1 ring-inset transition-all focus-within:bg-surface-2"
              :class="errors.password ? 'ring-live/70' : 'ring-line focus-within:ring-accent-500/60'"
            >
              <Lock class="ml-4 size-4.5 shrink-0 text-lo" />
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="current-password"
                placeholder="••••••••"
                class="h-full min-w-0 flex-1 bg-transparent px-3.5 text-sm text-hi placeholder:text-lo focus:outline-none"
                @input="errors.password = ''"
              />
              <button
                type="button"
                class="mr-2 grid size-9 shrink-0 place-items-center rounded-lg text-lo transition-colors hover:bg-white/8 hover:text-hi"
                :aria-label="showPassword ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'"
                @click="showPassword = !showPassword"
              >
                <EyeOff v-if="showPassword" class="size-4.5" />
                <Eye v-else class="size-4.5" />
              </button>
            </span>
            <span v-if="errors.password" class="mt-1.5 block text-[12px] text-live">
              {{ errors.password }}
            </span>
          </label>

          <!-- remember -->
          <label class="flex cursor-pointer items-center gap-2.5 pt-1 select-none">
            <input v-model="remember" type="checkbox" class="peer sr-only" />
            <span
              class="grid size-5 shrink-0 place-items-center rounded-md bg-surface ring-1 ring-inset ring-line transition-all peer-checked:bg-accent peer-checked:ring-accent peer-focus-visible:ring-2 peer-focus-visible:ring-accent-300"
            >
              <svg viewBox="0 0 16 16" class="size-3 fill-none stroke-white stroke-[2.5]">
                <path d="M3 8.5l3.2 3.2L13 5" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </span>
            <span class="text-[13px] text-mid">จดจำการเข้าสู่ระบบบนอุปกรณ์นี้</span>
          </label>

          <AppButton type="submit" variant="live" size="lg" block class="!mt-6" :disabled="submitting">
            <span v-if="submitting">กำลังเข้าสู่ระบบ…</span>
            <span v-else class="inline-flex items-center gap-2">
              เข้าสู่ระบบ <ArrowRight class="size-4" />
            </span>
          </AppButton>

          <AppButton type="button" variant="outline" size="lg" block @click="demoLogin">
            ทดลองด้วยบัญชีเดโม
          </AppButton>
          <p class="!mt-3 text-center text-[11px] leading-relaxed text-lo">
            บัญชีเดโมมาพร้อมแพ็กเกจ PREMIUM สำหรับทดลองระบบ ·
            การเข้าสู่ระบบด้วยอีเมลอื่นจะเริ่มต้นที่แพ็กเกจฟรี
          </p>
        </form>

        <!-- social -->
        <div class="mt-8">
          <div class="flex items-center gap-4">
            <span class="h-px flex-1 bg-line" />
            <span class="text-[11px] font-medium tracking-wide text-lo uppercase">
              หรือเข้าสู่ระบบด้วย
            </span>
            <span class="h-px flex-1 bg-line" />
          </div>

          <div class="mt-5 grid grid-cols-4 gap-3">
            <button
              v-for="s in SOCIALS"
              :key="s.id"
              type="button"
              class="grid h-12 place-items-center rounded-xl bg-surface text-lg font-bold text-mid ring-1 ring-inset ring-line transition-all hover:-translate-y-0.5 hover:bg-surface-2 hover:text-hi"
              :aria-label="`เข้าสู่ระบบด้วย ${s.label}`"
            >
              {{ s.mark }}
            </button>
          </div>
        </div>

        <p class="mt-8 text-center text-[11px] leading-relaxed text-lo">
          การเข้าสู่ระบบถือว่าคุณยอมรับ
          <a href="#" class="text-mid underline-offset-2 hover:underline">เงื่อนไขการใช้งาน</a>
          และ
          <a href="#" class="text-mid underline-offset-2 hover:underline">นโยบายความเป็นส่วนตัว</a>
          ของ DUDI
        </p>
      </div>
    </main>
  </div>
</template>
