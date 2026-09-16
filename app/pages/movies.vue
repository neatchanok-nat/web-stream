<script setup lang="ts">
import { SlidersHorizontal, RotateCcw } from 'lucide-vue-next'
import { MOVIES, MOVIE_GENRES, RATINGS, SORTS, YEARS } from '~/data/catalog'

useHead({ title: 'หนังทั้งหมด — DUDI' })

const genre = ref<string>('ทั้งหมด')
const year = ref<string>('ทุกปี')
const rating = ref<string>('ทุกเรตติ้ง')
const access = ref<string>('ทั้งหมด')
const sort = ref<string>('แนะนำ')
const showMore = ref(false)

const ACCESS = ['ทั้งหมด', 'ฟรี', 'Premium'] as const

const dirty = computed(
  () =>
    genre.value !== 'ทั้งหมด' ||
    year.value !== 'ทุกปี' ||
    rating.value !== 'ทุกเรตติ้ง' ||
    access.value !== 'ทั้งหมด' ||
    sort.value !== 'แนะนำ',
)

function reset() {
  genre.value = 'ทั้งหมด'
  year.value = 'ทุกปี'
  rating.value = 'ทุกเรตติ้ง'
  access.value = 'ทั้งหมด'
  sort.value = 'แนะนำ'
}

const minScore = computed(() => {
  const m = rating.value.match(/[\d.]+/)
  return m ? Number(m[0]) : 0
})

const results = computed(() => {
  let list = MOVIES.filter((m) => {
    if (genre.value !== 'ทั้งหมด' && !m.genres.includes(genre.value)) return false
    if (year.value !== 'ทุกปี' && String(m.year) !== year.value) return false
    if (m.score < minScore.value) return false
    if (access.value === 'ฟรี' && m.tier !== 'free') return false
    if (access.value === 'Premium' && m.tier !== 'premium') return false
    return true
  })

  list = [...list]
  if (sort.value === 'มาใหม่') list.sort((a, b) => b.year - a.year || b.score - a.score)
  else if (sort.value === 'คะแนนสูงสุด') list.sort((a, b) => b.score - a.score)
  else if (sort.value === 'ชื่อ ก–ฮ') list.sort((a, b) => a.title.localeCompare(b.title, 'th'))
  return list
})
</script>

<template>
  <div class="shell pt-24 pb-16 lg:pt-32">
    <!-- heading -->
    <header class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p class="text-[11px] font-bold tracking-[0.22em] text-accent-300 uppercase">Movies</p>
        <h1 class="mt-2 text-3xl font-extrabold tracking-tight text-hi sm:text-4xl lg:text-5xl">
          หนังทั้งหมด
        </h1>
        <p class="mt-2.5 text-sm text-lo">
          {{ results.length }} เรื่องพร้อมรับชม · อัปเดตใหม่ทุกสัปดาห์
        </p>
      </div>

      <div class="flex items-center gap-2">
        <button
          v-if="dirty"
          type="button"
          class="inline-flex h-9.5 items-center gap-1.5 rounded-full bg-white/6 px-4 text-[13px] font-semibold text-mid ring-1 ring-inset ring-white/10 transition-colors hover:bg-white/12 hover:text-hi"
          @click="reset"
        >
          <RotateCcw class="size-3.5" /> ล้างตัวกรอง
        </button>
        <SortSelect v-model="sort" :options="SORTS" label="เรียงโดย" />
      </div>
    </header>

    <!-- primary genre chips -->
    <div class="mt-7">
      <FilterChips v-model="genre" :options="MOVIE_GENRES" />
    </div>

    <!-- secondary filters -->
    <div class="mt-3">
      <button
        type="button"
        class="inline-flex items-center gap-2 rounded-lg px-1 py-1 text-[13px] font-semibold text-mid transition-colors hover:text-hi sm:hidden"
        @click="showMore = !showMore"
      >
        <SlidersHorizontal class="size-4" />
        ตัวกรองเพิ่มเติม
      </button>

      <div
        class="grid gap-3 overflow-hidden transition-all duration-400 sm:!mt-3 sm:!max-h-none sm:!opacity-100"
        :class="showMore ? 'mt-3 max-h-96 opacity-100' : 'max-h-0 opacity-0 sm:opacity-100'"
      >
        <FilterChips v-model="year" :options="YEARS" label="ปี" tone="neutral" size="sm" />
        <FilterChips v-model="rating" :options="RATINGS" label="เรตติ้ง" tone="neutral" size="sm" />
        <FilterChips v-model="access" :options="ACCESS" label="การเข้าถึง" tone="neutral" size="sm" />
      </div>
    </div>

    <div class="mt-9 border-t border-line pt-9">
      <CategoryGrid :titles="results" />
    </div>
  </div>
</template>
