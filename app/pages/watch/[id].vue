<script setup lang="ts">
import {
  ThumbsUp,
  ThumbsDown,
  Share2,
  Plus,
  Check,
  Download,
  Flag,
  ChevronDown,
  Star,
} from 'lucide-vue-next'
import { ALL_TITLES, getTitle } from '~/data/catalog'
import { formatCompact, formatRuntime, KIND_LABEL } from '~/utils/format'
import { titleToContent } from '~/utils/content'
import type { AccessState, Title } from '~/types'

definePageMeta({ layout: 'player' })

const route = useRoute()
const title = computed(() => getTitle(route.params.id as string))

if (!title.value) {
  throw createError({ statusCode: 404, statusMessage: 'ไม่พบวิดีโอที่คุณต้องการ', fatal: true })
}

const t = computed(() => title.value!)
const { has, toggle } = useMyList()
const saved = computed(() => has(t.value.id))
const liked = ref(false)
const disliked = ref(false)
const expanded = ref(false)

/* --------------------------------------------------------------
   Access is evaluated on the client (localStorage). Until the
   session is restored we keep the player hidden behind the gate
   so premium content never flashes into view.
   -------------------------------------------------------------- */
const { checkAccess } = useAccessControl()
const { ready } = useAuth()
const { recordWatch, getProgress } = useWatchHistory()

const content = computed(() => titleToContent(t.value))
const access = computed<AccessState>(() => {
  // Before the session is known, free content plays and premium stays
  // locked — never the other way round.
  if (!ready.value) return t.value.isPremium ? 'premium' : 'allow'
  return checkAccess(t.value)
})
const canWatch = computed(() => access.value === 'allow')

/** Log the view once access is confirmed — also on every re-entry. */
watch(
  [ready, canWatch, () => t.value.id],
  ([isReady, allowed, id]) => {
    if (isReady && allowed) recordWatch(id as string)
  },
  { immediate: true },
)

/** Resume point, shown next to the episode label. */
const resumeAt = computed(() => getProgress(t.value.id))

const durationSec = computed(() => (t.value.runtime ?? 46) * 60)
const episodeLabel = computed(() =>
  t.value.episodes ? `ตอนที่ 1 · ${KIND_LABEL[t.value.kind]}` : KIND_LABEL[t.value.kind],
)
/** Deterministic mock engagement figures. */
const views = computed(() => 180_000 + ((t.value.id.length * 733_211) % 4_200_000))
const likes = computed(() => Math.round(views.value * 0.041))
const published = computed(() => `เผยแพร่เมื่อ 12 ก.ย. ${t.value.year + 543}`)

/* Same kind first, then anything sharing a genre — a concert with a
   one-off genre would otherwise have nothing to line up next. */
const upNext = computed(() => {
  const affinity = (x: Title) =>
    (x.kind === t.value.kind ? 2 : 0) +
    (x.genres.some((g) => t.value.genres.includes(g)) ? 1 : 0)
  return ALL_TITLES.filter((x) => x.id !== t.value.id && affinity(x) > 0)
    .sort((a, b) => affinity(b) - affinity(a))
    .slice(0, 10)
})
const alsoWatch = computed(() =>
  ALL_TITLES.filter((x) => x.id !== t.value.id && x.kind === t.value.kind).slice(0, 6),
)

useHead(() => ({ title: `กำลังรับชม ${t.value.title} — DUDI` }))
</script>

<template>
  <div class="pt-16 lg:pt-20">
    <div class="mx-auto w-full max-w-[1800px] lg:px-6 lg:py-5 xl:px-8">
      <div class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_23rem] xl:grid-cols-[minmax(0,1fr)_25rem]">
        <!-- ------------------------------------------- player column -->
        <div class="min-w-0">
          <VideoPlayer
            v-if="canWatch"
            :seed="t.backdropSeed"
            :heading="t.title"
            :subheading="episodeLabel"
            :duration="durationSec"
            :src="t.videoUrl"
            :poster="t.imageUrl"
            :back-to="`/movie/${t.id}`"
          />
          <PremiumLockPanel v-else :content="content" :state="access" />

          <div class="px-4 pt-5 lg:px-0">
            <h1 class="text-xl leading-snug font-bold text-hi sm:text-2xl lg:text-[28px]">
              {{ t.title }}
            </h1>

            <div class="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[13px] text-lo">
              <span class="font-medium text-mid">{{ episodeLabel }}</span>
              <span class="text-white/20">•</span>
              <span>ผู้ชม {{ formatCompact(views) }} ครั้ง</span>
              <span class="text-white/20">•</span>
              <span>{{ published }}</span>
              <span class="text-white/20">•</span>
              <span class="inline-flex items-center gap-1 text-accent-200">
                <Star class="size-3.5 fill-current" />{{ t.score.toFixed(1) }}
              </span>
              <template v-if="resumeAt > 0">
                <span class="text-white/20">•</span>
                <span class="text-mid">ดูแล้ว {{ resumeAt }}%</span>
              </template>
            </div>

            <!-- actions -->
            <div class="no-scrollbar mt-5 flex items-center gap-2 overflow-x-auto pb-1">
              <div
                class="flex shrink-0 items-center rounded-full bg-white/8 ring-1 ring-inset ring-white/10"
              >
                <button
                  type="button"
                  class="inline-flex h-10 items-center gap-2 rounded-l-full pr-3 pl-4 text-[13px] font-semibold transition-colors hover:bg-white/8"
                  :class="liked ? 'text-accent-200' : 'text-mid'"
                  @click="((liked = !liked), (disliked = false))"
                >
                  <ThumbsUp class="size-4" :class="liked && 'fill-current'" />
                  {{ formatCompact(likes + (liked ? 1 : 0)) }}
                </button>
                <span class="h-5 w-px bg-white/12" />
                <button
                  type="button"
                  class="inline-flex h-10 items-center rounded-r-full px-4 transition-colors hover:bg-white/8"
                  :class="disliked ? 'text-live' : 'text-mid'"
                  aria-label="ไม่ชอบ"
                  @click="((disliked = !disliked), (liked = false))"
                >
                  <ThumbsDown class="size-4" :class="disliked && 'fill-current'" />
                </button>
              </div>

              <AppButton variant="secondary" size="md" class="shrink-0" @click="toggle(t.id)">
                <Check v-if="saved" class="size-4" />
                <Plus v-else class="size-4" />
                {{ saved ? 'บันทึกแล้ว' : 'รายการของฉัน' }}
              </AppButton>
              <AppButton variant="secondary" size="md" class="shrink-0">
                <Share2 class="size-4" /> แชร์
              </AppButton>
              <AppButton variant="secondary" size="md" class="shrink-0">
                <Download class="size-4" /> ดาวน์โหลด
              </AppButton>
              <IconButton label="รายงานปัญหา" variant="solid" class="shrink-0">
                <Flag class="size-4" />
              </IconButton>
            </div>

            <!-- description -->
            <div
              class="mt-5 rounded-2xl bg-surface/70 p-4 ring-1 ring-inset ring-line transition-colors hover:bg-surface sm:p-5"
            >
              <div class="flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] font-semibold text-mid">
                <span>{{ t.year }}</span>
                <span class="text-white/20">•</span>
                <span>{{ t.genres.join(' · ') }}</span>
                <span class="text-white/20">•</span>
                <span class="rounded border border-white/20 px-1.5 py-px text-[11px]">
                  {{ t.rating }}
                </span>
                <span class="text-white/20">•</span>
                <span>{{ t.runtime ? formatRuntime(t.runtime) : `${t.episodes} ตอน` }}</span>
              </div>

              <p
                class="mt-3 text-sm leading-relaxed text-mid transition-all"
                :class="expanded ? '' : 'line-clamp-2'"
              >
                {{ t.synopsis }}
              </p>

              <div v-if="expanded" class="mt-4 space-y-2 border-t border-line pt-4 text-[13px]">
                <p class="text-lo">
                  นักแสดง:
                  <span class="text-mid">
                    {{ t.cast.filter((c) => c.role !== 'ผู้กำกับ').slice(0, 4).map((c) => c.name).join(', ') }}
                  </span>
                </p>
                <p class="text-lo">
                  ผู้กำกับ:
                  <span class="text-mid">
                    {{ t.cast.find((c) => c.role === 'ผู้กำกับ')?.name }}
                  </span>
                </p>
                <p class="text-lo">
                  เสียง: <span class="text-mid">ไทย, อังกฤษ</span> · คำบรรยาย:
                  <span class="text-mid">ไทย, อังกฤษ</span>
                </p>
              </div>

              <button
                type="button"
                class="mt-3 inline-flex items-center gap-1 text-[13px] font-semibold text-accent-200 transition-colors hover:text-accent-100"
                @click="expanded = !expanded"
              >
                {{ expanded ? 'ย่อรายละเอียด' : 'ดูรายละเอียดเพิ่มเติม' }}
                <ChevronDown class="size-4 transition-transform" :class="expanded && 'rotate-180'" />
              </button>
            </div>
          </div>

          <!-- related on mobile -->
          <section class="mt-8 px-4 lg:hidden">
            <SectionHeader title="วิดีโอที่เกี่ยวข้อง" />
            <div class="grid gap-1">
              <RecommendationCard v-for="r in upNext" :key="r.id" :title="r" to-watch />
            </div>
          </section>

          <section class="mt-10 hidden px-4 lg:block lg:px-0">
            <SectionHeader title="ดูต่อจากเรื่องนี้" see-all-to="/movies" />
            <div class="grid gap-2 xl:grid-cols-2">
              <RecommendationCard v-for="r in alsoWatch" :key="r.id" :title="r" to-watch show-synopsis />
            </div>
          </section>
        </div>

        <!-- ------------------------------------------- sidebar -->
        <aside class="hidden lg:block">
          <div class="rounded-2xl bg-surface/50 p-3 ring-1 ring-inset ring-line">
            <h2 class="px-2 pt-1 pb-3 text-sm font-bold text-hi">ถัดไปสำหรับคุณ</h2>
            <div class="grid gap-1">
              <RecommendationCard v-for="r in upNext" :key="r.id" :title="r" to-watch />
            </div>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>
