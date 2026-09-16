<script setup lang="ts">
import { ArrowRight, Crown } from 'lucide-vue-next'
import { CONCERTS, DRAMAS, MOVIES, SERIES, SHOWS, pickBy } from '~/data/catalog'
import { CREATORS, LIVE_STREAMS } from '~/data/live'
import { CONTINUE_WATCHING } from '~/data/site'

useHead({ title: 'DUDI ดูดิ — ดูหนัง ละคร ซีรีส์ และไลฟ์สด' })

/* The hero runs the three concerts — the titles with real key art and video. */
const heroItems = computed(() => CONCERTS)

/* The three concerts lead the rail — they are the titles that actually play. */
const trending = computed(() => [
  ...CONCERTS,
  ...pickBy(MOVIES, 3, 3),
  ...pickBy(SERIES, 2, 2),
  ...pickBy(DRAMAS, 5, 2),
])
const popularDramas = computed(() => pickBy(DRAMAS, 1, 10))
const recommendedMovies = computed(() => pickBy(MOVIES, 7, 14, 2))
const varietyShows = computed(() => pickBy(SHOWS, 1, 8))
const newReleases = computed(() =>
  [...MOVIES, ...SERIES, ...DRAMAS]
    .filter((t) => t.year >= 2026)
    .concat(pickBy(SERIES, 3, 4))
    .slice(0, 14),
)
const liveNow = computed(() => LIVE_STREAMS.slice(0, 8))
const topCreators = computed(() => CREATORS)

/* Real watch history drives "ดูต่อ"; the seeded rail stands in
   until the visitor has actually played something. */
const { continueWatching } = useWatchHistory()
const continueRail = computed(() =>
  continueWatching.value.length ? continueWatching.value : CONTINUE_WATCHING,
)

const QUICK_LINKS = [
  { label: 'หนังใหม่', to: '/movies' },
  { label: 'ละครยอดนิยม', to: '/category?tab=drama' },
  { label: 'ซีรีส์ออริจินัล', to: '/category?tab=series' },
  { label: 'รายการวาไรตี้', to: '/category?tab=show' },
  { label: 'ไลฟ์สดตอนนี้', to: '/live' },
  { label: 'ดูฟรี', to: '/movies' },
]
</script>

<template>
  <div>
    <HeroBanner :items="heroItems" />

    <!-- quick category chips -->
    <nav class="shell -mt-2 pb-2">
      <div class="no-scrollbar flex gap-2 overflow-x-auto py-2">
        <NuxtLink
          v-for="q in QUICK_LINKS"
          :key="q.label"
          :to="q.to"
          class="shrink-0 rounded-full bg-white/6 px-4 py-2 text-[13px] font-semibold text-mid ring-1 ring-inset ring-white/10 transition-all hover:bg-white/12 hover:text-hi"
        >
          {{ q.label }}
        </NuxtLink>
      </div>
    </nav>

    <div class="space-y-12 py-8 lg:space-y-16 lg:py-10">
      <RecommendationRail
        heading="กำลังมาแรง"
        subtitle="เรื่องที่คนไทยดูมากที่สุดในสัปดาห์นี้"
        see-all-to="/category"
        variant="landscape"
        :titles="trending"
      />

      <RecommendationRail
        heading="ดูต่อ"
        subtitle="กลับไปดูต่อจากที่ค้างไว้"
        see-all-to="/account?tab=history"
        variant="continue"
        :items="continueRail"
      />

      <RecommendationRail
        heading="ละครยอดนิยม"
        subtitle="10 อันดับละครที่มาแรงที่สุดตอนนี้"
        see-all-to="/category?tab=drama"
        variant="poster"
        :titles="popularDramas"
        ranked
      />

      <RecommendationRail
        heading="หนังแนะนำสำหรับคุณ"
        subtitle="คัดจากเรื่องที่คุณดูบ่อย"
        see-all-to="/movies"
        variant="poster"
        :titles="recommendedMovies"
      />

      <RecommendationRail
        heading="รายการบันเทิง"
        subtitle="วาไรตี้ เกมโชว์ และคอนเสิร์ตเต็มรูปแบบ"
        see-all-to="/category?tab=show"
        variant="wide"
        :titles="varietyShows"
      />

      <RecommendationRail
        heading="LIVE ตอนนี้"
        subtitle="กำลังถ่ายทอดสดจากครีเอเตอร์ทั่วประเทศ"
        see-all-to="/live"
        variant="live"
        :streams="liveNow"
        live
      />

      <!-- premium upsell band -->
      <section class="shell">
        <div
          class="relative isolate overflow-hidden rounded-3xl bg-gradient-to-br from-accent-700/40 via-surface to-surface px-6 py-10 ring-1 ring-accent-500/25 sm:px-10 sm:py-12 lg:px-14"
        >
          <div
            class="pointer-events-none absolute -top-24 -right-10 size-80 rounded-full bg-accent-500/25 blur-[90px] animate-float-slow"
            aria-hidden="true"
          />
          <div class="relative max-w-2xl">
            <span
              class="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold tracking-[0.18em] text-accent-100 uppercase ring-1 ring-inset ring-white/15"
            >
              <Crown class="size-3.5" /> DUDI Premium
            </span>
            <h2 class="mt-5 text-2xl leading-tight font-extrabold text-hi sm:text-4xl">
              ดูครบทุกเรื่อง คมชัดระดับ 4K<br class="hidden sm:block" />
              เริ่มต้นเพียง 99 บาทต่อเดือน
            </h2>
            <p class="mt-3 max-w-lg text-sm leading-relaxed text-white/70 sm:text-base">
              ไม่มีโฆษณาคั่น ดาวน์โหลดดูออฟไลน์ได้ และรับชม DUDI Originals ก่อนใคร
              ยกเลิกได้ทุกเมื่อ
            </p>
            <div class="mt-7 flex flex-wrap gap-3">
              <AppButton to="/pricing" size="lg" variant="primary">
                ดูแพ็กเกจทั้งหมด <ArrowRight class="size-4" />
              </AppButton>
              <AppButton to="/login" size="lg" variant="outline">ทดลองใช้ฟรี 7 วัน</AppButton>
            </div>
          </div>
        </div>
      </section>

      <RecommendationRail
        heading="ครีเอเตอร์ยอดนิยม"
        subtitle="ช่องไลฟ์ที่มีผู้ติดตามมากที่สุดบน DUDI"
        see-all-to="/live"
        variant="creator"
        :creators="topCreators"
      />

      <RecommendationRail
        heading="มาใหม่"
        subtitle="เพิ่งเข้าระบบในเดือนนี้"
        see-all-to="/category"
        variant="poster"
        :titles="newReleases"
      />
    </div>
  </div>
</template>
