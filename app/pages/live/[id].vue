<script setup lang="ts">
import { Bell, Share2, Heart, Flag, Users, CalendarClock } from 'lucide-vue-next'
import { CREATOR_BY_ID, LIVE_BY_ID, LIVE_CATEGORIES, LIVE_STREAMS } from '~/data/live'
import { formatCountTh } from '~/utils/format'
import { streamToContent } from '~/utils/content'
import type { AccessState } from '~/types'

definePageMeta({ layout: 'player' })

const route = useRoute()
const stream = computed(() => LIVE_BY_ID.get(route.params.id as string))

if (!stream.value) {
  throw createError({ statusCode: 404, statusMessage: 'ไม่พบไลฟ์ที่คุณต้องการ', fatal: true })
}

const live = computed(() => stream.value!)
const creator = computed(() => CREATOR_BY_ID.get(live.value.creatorId)!)
const { has, toggle } = useFollows()
const liked = ref(false)

/* Premium live is gated the same way as premium on-demand content. */
const { checkAccess } = useAccessControl()
const { ready } = useAuth()
const content = computed(() => streamToContent(live.value))
const access = computed<AccessState>(() => {
  if (!ready.value) return live.value.isPremium ? 'premium' : 'allow'
  return checkAccess(live.value)
})
const canWatch = computed(() => access.value === 'allow')

const categoryLabel = computed(
  () => LIVE_CATEGORIES.find((c) => c.id === live.value.category)?.label ?? live.value.category,
)
const related = computed(() => LIVE_STREAMS.filter((s) => s.id !== live.value.id).slice(0, 6))

useHead(() => ({ title: `${live.value.title} — LIVE บน DUDI` }))
</script>

<template>
  <div class="pt-16 lg:pt-20">
    <div class="mx-auto w-full max-w-[1800px] lg:px-6 lg:py-5 xl:px-8">
      <div class="grid gap-5 lg:grid-cols-[minmax(0,1fr)_23rem] xl:grid-cols-[minmax(0,1fr)_25rem]">
        <!-- ---------------------------------------------- video column -->
        <div class="min-w-0">
          <VideoPlayer
            v-if="canWatch"
            :seed="live.artSeed"
            :heading="live.title"
            :subheading="creator.name"
            :viewers="live.viewers"
            live
            back-to="/live"
          />
          <PremiumLockPanel v-else :content="content" :state="access" />

          <!-- title + channel -->
          <div class="px-4 pt-5 lg:px-0">
            <div class="flex flex-wrap items-center gap-2.5">
              <LiveBadge :viewers="live.viewers" size="md" />
              <span class="rounded-full bg-white/8 px-2.5 py-1 text-[11px] font-semibold text-mid">
                {{ categoryLabel }}
              </span>
              <span class="inline-flex items-center gap-1.5 text-[11px] text-lo">
                <CalendarClock class="size-3.5" />{{ live.startedAgo }}
              </span>
            </div>

            <h1 class="mt-3 text-xl leading-snug font-bold text-hi sm:text-2xl lg:text-[28px]">
              {{ live.title }}
            </h1>

            <div class="mt-5 flex flex-wrap items-center gap-4 border-y border-line py-4">
              <div class="flex min-w-0 flex-1 items-center gap-3">
                <AppAvatar
                  :name="creator.name"
                  :seed="creator.avatarSeed"
                  size="lg"
                  live-ring
                  :verified="creator.verified"
                />
                <div class="min-w-0">
                  <p class="truncate text-[15px] font-bold text-hi">{{ creator.name }}</p>
                  <p class="truncate text-xs text-lo">
                    {{ creator.handle }} · ผู้ติดตาม {{ formatCountTh(creator.followers) }}
                  </p>
                </div>
              </div>

              <div class="flex flex-wrap items-center gap-2">
                <AppButton
                  :variant="has(creator.id) ? 'secondary' : 'live'"
                  size="md"
                  @click="toggle(creator.id)"
                >
                  <Bell class="size-4" />
                  {{ has(creator.id) ? 'กำลังติดตาม' : 'ติดตาม' }}
                </AppButton>
                <AppButton
                  variant="secondary"
                  size="md"
                  :class="liked && 'text-live'"
                  @click="liked = !liked"
                >
                  <Heart class="size-4" :class="liked && 'fill-current'" />
                  <span class="hidden sm:inline">ถูกใจ</span>
                </AppButton>
                <AppButton variant="secondary" size="md">
                  <Share2 class="size-4" /><span class="hidden sm:inline">แชร์</span>
                </AppButton>
                <IconButton label="รายงานปัญหา" variant="solid">
                  <Flag class="size-4" />
                </IconButton>
              </div>
            </div>
          </div>

          <!-- chat on mobile sits directly under the player -->
          <div class="mt-5 h-[26rem] px-4 lg:hidden">
            <LiveChat :viewers="live.viewers" :channel="creator.name" />
          </div>

          <!-- description -->
          <div class="mt-5 px-4 lg:px-0">
            <div class="rounded-2xl bg-surface/70 p-5 ring-1 ring-inset ring-line">
              <h2 class="text-sm font-bold text-hi">รายละเอียดไลฟ์</h2>
              <p class="mt-2.5 text-sm leading-relaxed text-mid">{{ live.description }}</p>
              <div class="mt-4 flex flex-wrap gap-2">
                <span
                  v-for="t in live.tags"
                  :key="t"
                  class="rounded-full bg-white/6 px-3 py-1 text-[11px] font-medium text-mid"
                >
                  #{{ t }}
                </span>
              </div>
            </div>

            <!-- about channel -->
            <div class="mt-4 rounded-2xl bg-surface/70 p-5 ring-1 ring-inset ring-line">
              <h2 class="text-sm font-bold text-hi">เกี่ยวกับช่อง</h2>
              <div class="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center">
                <AppAvatar :name="creator.name" :seed="creator.avatarSeed" size="lg" ring />
                <div class="min-w-0 flex-1">
                  <p class="text-sm font-semibold text-hi">{{ creator.name }}</p>
                  <p class="mt-1 text-xs leading-relaxed text-mid">{{ creator.bio }}</p>
                </div>
                <div class="flex shrink-0 gap-6 sm:flex-col sm:gap-1 sm:text-right">
                  <div>
                    <p class="text-lg font-bold text-hi">
                      {{ formatCountTh(creator.followers) }}
                    </p>
                    <p class="text-[11px] text-lo">ผู้ติดตาม</p>
                  </div>
                  <div class="sm:hidden">
                    <p class="inline-flex items-center gap-1 text-lg font-bold text-hi">
                      <Users class="size-4" />{{ formatCountTh(live.viewers) }}
                    </p>
                    <p class="text-[11px] text-lo">กำลังดู</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- related live -->
          <section class="mt-10 px-4 lg:px-0">
            <SectionHeader title="ไลฟ์อื่นที่กำลังถ่ายทอด" see-all-to="/live" live />
            <div class="grid gap-x-4 gap-y-7 sm:grid-cols-2 xl:grid-cols-3">
              <LiveCard v-for="s in related" :key="s.id" :stream="s" />
            </div>
          </section>
        </div>

        <!-- ---------------------------------------------- chat column -->
        <div class="hidden lg:block">
          <div class="sticky top-24 h-[calc(100svh-7.5rem)]">
            <LiveChat :viewers="live.viewers" :channel="creator.name" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
