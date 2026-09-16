<script setup lang="ts">
import { Play, Plus, Check, Share2, Star, ChevronLeft, Download, ThumbsUp, Lock } from 'lucide-vue-next'
import { ALL_TITLES, getTitle } from '~/data/catalog'
import { backdropArt, landscapeArt, posterArt } from '~/utils/artwork'
import { formatRuntime, KIND_LABEL } from '~/utils/format'

const route = useRoute()
const title = computed(() => getTitle(route.params.id as string))

if (!title.value) {
  throw createError({ statusCode: 404, statusMessage: 'ไม่พบเนื้อหาที่คุณต้องการ', fatal: true })
}

const t = computed(() => title.value!)
const { has, toggle } = useMyList()
const saved = computed(() => has(t.value.id))
const { requestPlay, checkAccess } = useAccessControl()
const locked = computed(() => checkAccess(t.value) !== 'allow')

const backdrop = computed(() => t.value.imageUrl ?? backdropArt(t.value.backdropSeed))
const poster = computed(() => t.value.imageUrl ?? posterArt(t.value.artSeed))

const meta = computed(() =>
  [
    String(t.value.year),
    t.value.rating,
    t.value.runtime ? formatRuntime(t.value.runtime) : null,
    t.value.episodes ? `${t.value.episodes} ตอน` : null,
    t.value.seasons && t.value.seasons > 1 ? `${t.value.seasons} ซีซัน` : null,
  ].filter(Boolean) as string[],
)

const director = computed(() => t.value.cast.find((c) => c.role === 'ผู้กำกับ'))
const actors = computed(() => t.value.cast.filter((c) => c.role !== 'ผู้กำกับ'))

const TRAILER_KINDS = [
  { label: 'ตัวอย่างอย่างเป็นทางการ', length: '2:14' },
  { label: 'เบื้องหลังการถ่ายทำ', length: '4:38' },
  { label: 'บทสัมภาษณ์นักแสดงนำ', length: '6:02' },
]
const trailers = computed(() =>
  TRAILER_KINDS.map((k, i) => ({
    ...k,
    art: landscapeArt(`${t.value.artSeed}-trailer-${i}`),
  })),
)

/** Deterministic episode list for episodic content. */
const episodes = computed(() => {
  if (!t.value.episodes) return []
  return Array.from({ length: Math.min(8, t.value.episodes) }, (_, i) => ({
    no: i + 1,
    title: `ตอนที่ ${i + 1}`,
    synopsis: t.value.synopsis.slice(0, 92) + '…',
    length: `${38 + ((i * 7) % 18)} นาที`,
    art: landscapeArt(`${t.value.artSeed}-ep-${i}`),
    progress: i === 0 ? 100 : i === 1 ? 46 : 0,
  }))
})

const related = computed(() =>
  ALL_TITLES.filter(
    (x) => x.id !== t.value.id && x.genres.some((g) => t.value.genres.includes(g)),
  ).slice(0, 12),
)

const alsoLike = computed(() =>
  ALL_TITLES.filter((x) => x.id !== t.value.id && x.kind === t.value.kind)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6),
)

useHead(() => ({ title: `${t.value.title} (${t.value.year}) — DUDI` }))
</script>

<template>
  <div>
    <!-- ---------------------------------------------------- backdrop -->
    <section class="relative isolate">
      <div class="relative h-[52svh] min-h-[360px] overflow-hidden lg:h-[62vh]">
        <img
          :src="backdrop"
          :alt="`ภาพฉากจาก ${t.title}`"
          class="size-full object-cover"
          fetchpriority="high"
        />
        <div class="absolute inset-0 scrim-b" />
        <div class="absolute inset-0 hidden scrim-l lg:block" />
        <div class="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-ink/90 to-transparent" />
      </div>

      <button
        type="button"
        class="absolute top-20 left-4 z-10 inline-flex items-center gap-1.5 rounded-full glass px-3.5 py-2 text-[13px] font-semibold text-hi ring-1 ring-inset ring-white/12 transition-colors hover:bg-white/14 sm:left-7 lg:top-24 lg:left-12"
        @click="$router.back()"
      >
        <ChevronLeft class="size-4" /> ย้อนกลับ
      </button>

      <!-- ------------------------------------------------ main block -->
      <div class="shell relative -mt-40 pb-12 lg:-mt-56">
        <div class="flex flex-col gap-7 lg:flex-row lg:items-end lg:gap-10">
          <!-- poster -->
          <div class="w-36 shrink-0 sm:w-44 lg:w-60">
            <div class="overflow-hidden rounded-2xl bg-surface card-edge ring-1 ring-white/10">
              <img
                :src="poster"
                :alt="`ภาพปกของ ${t.title}`"
                class="aspect-2/3 w-full object-cover"
              />
            </div>
          </div>

          <!-- details -->
          <div class="min-w-0 flex-1">
            <div class="flex flex-wrap items-center gap-2.5">
              <span
                class="rounded-md bg-accent/15 px-2.5 py-1 text-[11px] font-bold tracking-[0.16em] text-accent-200 uppercase ring-1 ring-inset ring-accent-500/30"
              >
                {{ KIND_LABEL[t.kind] }}
              </span>
              <span
                v-for="b in t.badges"
                :key="b"
                class="rounded-md bg-white/10 px-2.5 py-1 text-[11px] font-bold tracking-wide text-white/80 uppercase"
              >
                {{ b }}
              </span>
              <TierBadge :tier="t.tier" />
            </div>

            <h1
              class="mt-4 text-[clamp(1.9rem,5.4vw,3.6rem)] leading-[1.05] font-extrabold tracking-[-0.03em] text-hi"
            >
              {{ t.title }}
            </h1>
            <p
              v-if="t.titleEn"
              class="mt-1.5 text-xs font-medium tracking-[0.18em] text-white/45 uppercase sm:text-sm"
            >
              {{ t.titleEn }}
            </p>

            <div class="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-[13px] text-white/75">
              <span class="inline-flex items-center gap-1 font-semibold text-accent-200">
                <Star class="size-4 fill-current" />{{ t.score.toFixed(1) }}
                <span class="font-normal text-white/40">/10</span>
              </span>
              <template v-for="(m, i) in meta" :key="m + i">
                <span class="text-white/25">•</span>
                <span
                  v-if="m === t.rating"
                  class="rounded border border-white/25 px-1.5 py-px text-[11px] font-semibold"
                >
                  {{ m }}
                </span>
                <span v-else>{{ m }}</span>
              </template>
            </div>

            <div class="mt-4 flex flex-wrap gap-2">
              <NuxtLink
                v-for="g in t.genres"
                :key="g"
                :to="`/category?tab=${t.kind}`"
                class="rounded-full bg-white/8 px-3 py-1 text-[12px] font-medium text-white/75 ring-1 ring-inset ring-white/10 transition-colors hover:bg-white/14 hover:text-hi"
              >
                {{ g }}
              </NuxtLink>
            </div>

            <p class="mt-5 max-w-3xl text-sm leading-relaxed text-white/72 sm:text-[15px] sm:leading-7">
              {{ t.synopsis }}
            </p>

            <p v-if="director" class="mt-4 text-[13px] text-lo">
              กำกับโดย <span class="font-medium text-mid">{{ director.name }}</span>
            </p>

            <!-- actions -->
            <div class="mt-7 flex flex-wrap items-center gap-2.5 sm:gap-3">
              <AppButton size="lg" variant="primary" @click="requestPlay(t)">
                <Lock v-if="locked" class="size-4.5" />
                <Play v-else class="size-5 fill-current" />
                รับชม
              </AppButton>
              <AppButton size="lg" variant="secondary" @click="toggle(t.id)">
                <Check v-if="saved" class="size-5" />
                <Plus v-else class="size-5" />
                {{ saved ? 'อยู่ในรายการแล้ว' : 'เพิ่มรายการ' }}
              </AppButton>
              <AppButton size="lg" variant="outline">
                <Share2 class="size-4.5" /> แชร์
              </AppButton>
              <IconButton label="ถูกใจ" variant="solid" size="lg" class="hidden sm:inline-flex">
                <ThumbsUp class="size-5" />
              </IconButton>
              <IconButton label="ดาวน์โหลด" variant="solid" size="lg" class="hidden sm:inline-flex">
                <Download class="size-5" />
              </IconButton>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div class="space-y-14 pb-16 lg:space-y-18">
      <!-- ------------------------------------------------- episodes -->
      <section v-if="episodes.length" class="shell">
        <SectionHeader
          title="ตอนทั้งหมด"
          :subtitle="`ซีซัน 1 · ${t.episodes} ตอน`"
          see-all-to="/category"
          see-all-label="เลือกซีซัน"
        />
        <ul class="grid gap-3 lg:grid-cols-2">
          <li v-for="ep in episodes" :key="ep.no">
            <NuxtLink
              :to="`/watch/${t.id}`"
              @click.prevent="requestPlay(t)"
              class="group/ep flex gap-4 rounded-2xl bg-surface/60 p-3 ring-1 ring-inset ring-line transition-all duration-300 hover:bg-surface-2 hover:ring-line-strong"
            >
              <div class="relative aspect-video w-32 shrink-0 overflow-hidden rounded-xl sm:w-40">
                <img :src="ep.art" :alt="ep.title" class="size-full object-cover" loading="lazy" />
                <div
                  class="absolute inset-0 grid place-items-center bg-black/40 opacity-0 transition-opacity group-hover/ep:opacity-100"
                >
                  <Play class="size-7 fill-white text-white" />
                </div>
                <div v-if="ep.progress" class="absolute inset-x-2 bottom-2">
                  <ProgressBar :value="ep.progress" size="xs" />
                </div>
              </div>
              <div class="min-w-0 flex-1 py-0.5">
                <div class="flex items-center justify-between gap-3">
                  <h3 class="truncate text-sm font-semibold text-hi">
                    {{ ep.no }}. {{ ep.title }}
                  </h3>
                  <span class="shrink-0 text-[11px] text-lo">{{ ep.length }}</span>
                </div>
                <p class="mt-1.5 line-clamp-2 text-xs leading-relaxed text-lo">
                  {{ ep.synopsis }}
                </p>
              </div>
            </NuxtLink>
          </li>
        </ul>
      </section>

      <!-- --------------------------------------------------- cast -->
      <section class="shell">
        <SectionHeader title="นักแสดง" subtitle="ทีมนักแสดงและผู้กำกับ" />
        <MediaRail gap="sm">
          <article
            v-for="p in actors"
            :key="p.id"
            class="w-28 shrink-0 snap-start text-center sm:w-32"
          >
            <AppAvatar :name="p.name" :seed="p.id" size="xl" ring class="mx-auto" />
            <h3 class="mt-3 line-clamp-2 text-[13px] font-semibold text-hi">{{ p.name }}</h3>
            <p class="mt-0.5 line-clamp-1 text-[11px] text-lo">{{ p.role }}</p>
          </article>
        </MediaRail>
      </section>

      <!-- ------------------------------------------------ trailers -->
      <section class="shell">
        <SectionHeader title="ตัวอย่างและคลิปพิเศษ" />
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <NuxtLink
            v-for="tr in trailers"
            :key="tr.label"
            :to="`/watch/${t.id}`"
              @click.prevent="requestPlay(t)"
            class="group/tr block"
          >
            <div class="relative aspect-video overflow-hidden rounded-xl bg-surface card-edge">
              <img
                :src="tr.art"
                :alt="tr.label"
                class="size-full object-cover transition-transform duration-700 group-hover/tr:scale-106"
                loading="lazy"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div
                class="absolute inset-0 grid place-items-center opacity-0 transition-opacity duration-300 group-hover/tr:opacity-100"
              >
                <span class="grid size-12 place-items-center rounded-full bg-white/95 text-ink">
                  <Play class="size-5 translate-x-px fill-current" />
                </span>
              </div>
              <span
                class="absolute right-2.5 bottom-2.5 rounded bg-black/75 px-1.5 py-0.5 text-[11px] font-medium text-white/90"
              >
                {{ tr.length }}
              </span>
            </div>
            <h3 class="mt-2.5 text-[13px] font-semibold text-hi">{{ tr.label }}</h3>
          </NuxtLink>
        </div>
      </section>

      <!-- ------------------------------------------------- related -->
      <RecommendationRail
        heading="หนังที่เกี่ยวข้อง"
        subtitle="จากแนวเดียวกับที่คุณกำลังดู"
        see-all-to="/category"
        variant="poster"
        :titles="related"
      />

      <!-- ---------------------------------------------- also like -->
      <section class="shell">
        <SectionHeader title="เพิ่มเติมที่คุณอาจชอบ" see-all-to="/movies" />
        <div class="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
          <RecommendationCard v-for="r in alsoLike" :key="r.id" :title="r" show-synopsis />
        </div>
      </section>
    </div>
  </div>
</template>
