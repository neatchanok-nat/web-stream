<script setup lang="ts">
import { Clock, TrendingUp, X, SearchX } from 'lucide-vue-next'
import { ALL_TITLES, pickBy, MOVIES } from '~/data/catalog'
import { CREATORS, LIVE_STREAMS, CREATOR_BY_ID } from '~/data/live'
import { RECENT_SEARCHES, SEARCH_TABS, TRENDING_SEARCHES } from '~/data/site'

useHead({ title: 'ค้นหา — DUDI' })

const route = useRoute()
const query = ref((route.query.q as string) ?? '')
const tab = ref<string>('all')
const recents = ref<string[]>([...RECENT_SEARCHES])

const normalized = computed(() => query.value.trim().toLowerCase())
const active = computed(() => normalized.value.length > 0)

const titleMatches = computed(() => {
  if (!active.value) return []
  const q = normalized.value
  return ALL_TITLES.filter(
    (t) =>
      t.title.toLowerCase().includes(q) ||
      t.titleEn?.toLowerCase().includes(q) ||
      t.genres.some((g) => g.toLowerCase().includes(q)) ||
      t.synopsis.toLowerCase().includes(q),
  )
})

const liveMatches = computed(() => {
  if (!active.value) return []
  const q = normalized.value
  return LIVE_STREAMS.filter(
    (s) =>
      s.title.toLowerCase().includes(q) ||
      s.tags.some((t) => t.toLowerCase().includes(q)) ||
      CREATOR_BY_ID.get(s.creatorId)?.name.toLowerCase().includes(q),
  )
})

const creatorMatches = computed(() => {
  if (!active.value) return []
  const q = normalized.value
  return CREATORS.filter(
    (c) => c.name.toLowerCase().includes(q) || c.handle.toLowerCase().includes(q),
  )
})

const totalCount = computed(
  () => titleMatches.value.length + liveMatches.value.length + creatorMatches.value.length,
)

const tabsWithCount = computed(() =>
  SEARCH_TABS.map((t) => ({
    ...t,
    count:
      t.id === 'all'
        ? totalCount.value
        : t.id === 'live'
          ? liveMatches.value.length
          : t.id === 'creator'
            ? creatorMatches.value.length
            : titleMatches.value.filter((x) => x.kind === t.id).length,
  })),
)

const gridTitles = computed(() =>
  tab.value === 'all' ? titleMatches.value : titleMatches.value.filter((t) => t.kind === tab.value),
)

const showLive = computed(() => tab.value === 'all' || tab.value === 'live')
const showCreators = computed(() => tab.value === 'all' || tab.value === 'creator')
const showTitles = computed(() => tab.value !== 'live' && tab.value !== 'creator')

const popular = computed(() => pickBy(MOVIES, 3, 12, 1))

function submit(term: string) {
  const v = term.trim()
  if (!v) return
  recents.value = [v, ...recents.value.filter((r) => r !== v)].slice(0, 8)
}
function apply(term: string) {
  query.value = term
  submit(term)
}
</script>

<template>
  <div class="shell pt-24 pb-16 lg:pt-32">
    <header class="mx-auto max-w-3xl text-center">
      <h1 class="text-2xl font-extrabold tracking-tight text-hi sm:text-4xl">
        ค้นหาสิ่งที่อยากดู
      </h1>
      <p class="mt-2.5 text-sm text-lo">
        ค้นจากชื่อเรื่อง แนว นักแสดง ครีเอเตอร์ หรือไลฟ์ที่กำลังถ่ายทอด
      </p>
      <div class="mt-6">
        <SearchBar v-model="query" size="lg" autofocus @submit="submit" />
      </div>
    </header>

    <!-- ------------------------------------------------ idle state -->
    <div v-if="!active" class="mt-12 grid gap-10 lg:grid-cols-[1fr_1fr]">
      <section>
        <h2 class="flex items-center gap-2 text-sm font-bold text-hi">
          <Clock class="size-4 text-lo" /> การค้นหาล่าสุด
        </h2>
        <div class="mt-4 flex flex-wrap gap-2">
          <span
            v-for="r in recents"
            :key="r"
            class="group/rec inline-flex items-center gap-1.5 rounded-full bg-white/6 py-2 pr-2 pl-4 text-[13px] font-medium text-mid ring-1 ring-inset ring-white/10 transition-colors hover:bg-white/12 hover:text-hi"
          >
            <button type="button" @click="apply(r)">{{ r }}</button>
            <button
              type="button"
              class="grid size-5 place-items-center rounded-full text-lo transition-colors hover:bg-white/15 hover:text-hi"
              :aria-label="`ลบ ${r} ออกจากประวัติ`"
              @click="recents = recents.filter((x) => x !== r)"
            >
              <X class="size-3" />
            </button>
          </span>
          <p v-if="!recents.length" class="text-[13px] text-lo">ยังไม่มีประวัติการค้นหา</p>
        </div>
      </section>

      <section>
        <h2 class="flex items-center gap-2 text-sm font-bold text-hi">
          <TrendingUp class="size-4 text-accent-300" /> คำค้นหายอดนิยม
        </h2>
        <ol class="mt-4 grid gap-1 sm:grid-cols-2">
          <li v-for="(k, i) in TRENDING_SEARCHES" :key="k">
            <button
              type="button"
              class="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-white/6"
              @click="apply(k)"
            >
              <span
                class="w-5 shrink-0 text-center text-sm font-bold"
                :class="i < 3 ? 'text-accent-300' : 'text-lo'"
              >
                {{ i + 1 }}
              </span>
              <span class="truncate text-[13px] font-medium text-mid">{{ k }}</span>
            </button>
          </li>
        </ol>
      </section>
    </div>

    <section v-if="!active" class="mt-14">
      <SectionHeader title="กำลังเป็นที่นิยมบน DUDI" see-all-to="/category" />
      <CategoryGrid :titles="popular" />
    </section>

    <!-- ---------------------------------------------- results -->
    <div v-else class="mt-10">
      <CategoryTabs v-model="tab" :tabs="tabsWithCount" />

      <p class="mt-5 text-[13px] text-lo">
        พบ {{ totalCount }} ผลลัพธ์สำหรับ
        <span class="font-semibold text-hi">“{{ query }}”</span>
      </p>

      <div class="mt-7 space-y-12">
        <section v-if="showTitles && gridTitles.length">
          <SectionHeader title="เนื้อหา" :subtitle="`${gridTitles.length} เรื่อง`" />
          <CategoryGrid :titles="gridTitles" />
        </section>

        <section v-if="showLive && liveMatches.length">
          <SectionHeader title="ไลฟ์สด" :subtitle="`${liveMatches.length} ช่อง`" live />
          <div class="grid gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            <LiveCard v-for="s in liveMatches" :key="s.id" :stream="s" />
          </div>
        </section>

        <section v-if="showCreators && creatorMatches.length">
          <SectionHeader title="ครีเอเตอร์" :subtitle="`${creatorMatches.length} ช่อง`" />
          <div class="grid gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            <CreatorCard v-for="c in creatorMatches" :key="c.id" :creator="c" />
          </div>
        </section>

        <div
          v-if="!totalCount"
          class="flex flex-col items-center justify-center rounded-2xl border border-dashed border-line px-6 py-20 text-center"
        >
          <span class="grid size-14 place-items-center rounded-2xl bg-surface text-lo">
            <SearchX class="size-7" />
          </span>
          <h3 class="mt-4 text-base font-semibold text-hi">ไม่พบผลลัพธ์สำหรับ “{{ query }}”</h3>
          <p class="mt-1.5 max-w-sm text-sm text-lo">
            ลองค้นด้วยคำอื่น หรือเลือกจากคำค้นหายอดนิยมด้านล่าง
          </p>
          <div class="mt-5 flex flex-wrap justify-center gap-2">
            <button
              v-for="k in TRENDING_SEARCHES.slice(0, 5)"
              :key="k"
              type="button"
              class="rounded-full bg-white/6 px-4 py-2 text-[13px] font-medium text-mid ring-1 ring-inset ring-white/10 transition-colors hover:bg-white/12 hover:text-hi"
              @click="apply(k)"
            >
              {{ k }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
