<script setup lang="ts">
import { LayoutGrid, Rows3 } from 'lucide-vue-next'
import { ALL_TITLES, DRAMAS, MOVIES, SERIES, SHOWS, SORTS, YEARS } from '~/data/catalog'
import { LIVE_STREAMS } from '~/data/live'

useHead({ title: 'หมวดหมู่ — DUDI' })

const route = useRoute()
const router = useRouter()

const TABS = [
  { id: 'all', label: 'ทั้งหมด' },
  { id: 'movie', label: 'หนัง' },
  { id: 'drama', label: 'ละคร' },
  { id: 'series', label: 'ซีรีส์' },
  { id: 'show', label: 'รายการ' },
  { id: 'live', label: 'LIVE' },
] as const

const tab = ref<string>((route.query.tab as string) || 'all')
const genre = ref('ทั้งหมด')
const year = ref('ทุกปี')
const sort = ref('แนะนำ')
const dense = ref(false)

watch(tab, (t) => {
  genre.value = 'ทั้งหมด'
  router.replace({ query: t === 'all' ? {} : { tab: t } })
})

const pool = computed(() => {
  switch (tab.value) {
    case 'movie':
      return MOVIES
    case 'drama':
      return DRAMAS
    case 'series':
      return SERIES
    case 'show':
      return SHOWS
    default:
      return ALL_TITLES
  }
})

/** Genre chips adapt to whichever tab is active. */
const genreOptions = computed(() => {
  const set = new Set<string>()
  pool.value.forEach((t) => t.genres.forEach((g) => set.add(g)))
  return ['ทั้งหมด', ...[...set].sort((a, b) => a.localeCompare(b, 'th'))]
})

const tabsWithCount = computed(() =>
  TABS.map((t) => ({
    ...t,
    count:
      t.id === 'live'
        ? LIVE_STREAMS.length
        : t.id === 'all'
          ? ALL_TITLES.length
          : ALL_TITLES.filter((x) => x.kind === t.id).length,
  })),
)

const results = computed(() => {
  let list = pool.value.filter((t) => {
    if (genre.value !== 'ทั้งหมด' && !t.genres.includes(genre.value)) return false
    if (year.value !== 'ทุกปี' && String(t.year) !== year.value) return false
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
    <header>
      <p class="text-[11px] font-bold tracking-[0.22em] text-accent-300 uppercase">Browse</p>
      <h1 class="mt-2 text-3xl font-extrabold tracking-tight text-hi sm:text-4xl lg:text-5xl">
        หมวดหมู่ทั้งหมด
      </h1>
      <p class="mt-2.5 max-w-xl text-sm text-lo">
        เลือกดูตามประเภทเนื้อหา ทั้งภาพยนตร์ ละคร ซีรีส์ออริจินัล รายการบันเทิง และไลฟ์สด
      </p>
    </header>

    <div class="mt-8">
      <CategoryTabs v-model="tab" :tabs="tabsWithCount" />
    </div>

    <!-- filter bar -->
    <div
      v-if="tab !== 'live'"
      class="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"
    >
      <FilterChips v-model="genre" :options="genreOptions" size="sm" />
      <div class="flex items-center gap-2">
        <FilterChips v-model="year" :options="YEARS" tone="neutral" size="sm" class="hidden sm:flex" />
        <SortSelect v-model="sort" :options="SORTS" />
        <div class="hidden items-center rounded-full bg-white/6 p-1 ring-1 ring-inset ring-white/10 sm:flex">
          <button
            type="button"
            class="grid size-7.5 place-items-center rounded-full transition-colors"
            :class="!dense ? 'bg-white/14 text-hi' : 'text-lo hover:text-hi'"
            aria-label="มุมมองปกติ"
            @click="dense = false"
          >
            <LayoutGrid class="size-4" />
          </button>
          <button
            type="button"
            class="grid size-7.5 place-items-center rounded-full transition-colors"
            :class="dense ? 'bg-white/14 text-hi' : 'text-lo hover:text-hi'"
            aria-label="มุมมองแน่น"
            @click="dense = true"
          >
            <Rows3 class="size-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- results -->
    <div class="mt-8">
      <Transition name="fade" mode="out-in">
        <div v-if="tab === 'live'" key="live">
          <SectionHeader
            title="ไลฟ์สดทั้งหมด"
            :subtitle="`${LIVE_STREAMS.length} ช่องกำลังถ่ายทอดสดอยู่ตอนนี้`"
            live
          />
          <div class="grid gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            <LiveCard v-for="s in LIVE_STREAMS" :key="s.id" :stream="s" />
          </div>
        </div>

        <div v-else :key="tab">
          <p class="mb-5 text-[13px] text-lo">พบ {{ results.length }} รายการ</p>
          <CategoryGrid :titles="results" :density="dense ? 'dense' : 'comfortable'" />
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.25s ease,
    transform 0.25s ease;
}
.fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.fade-leave-to {
  opacity: 0;
}
</style>
