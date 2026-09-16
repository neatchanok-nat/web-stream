<script setup lang="ts">
import { Play, Bell, Share2, Users } from 'lucide-vue-next'
import { CREATOR_BY_ID, CREATORS, FEATURED_LIVE, LIVE_CATEGORIES, LIVE_STREAMS } from '~/data/live'
import { backdropArt } from '~/utils/artwork'
import { formatCountTh } from '~/utils/format'

useHead({ title: 'ไลฟ์สด — DUDI' })

const category = ref<string>('all')
const { has, toggle } = useFollows()
const { requestPlay } = useAccessControl()

const featured = FEATURED_LIVE
const featuredCreator = computed(() => CREATOR_BY_ID.get(featured.creatorId))
const featuredArt = computed(() => backdropArt(featured.artSeed))

const streams = computed(() =>
  category.value === 'all'
    ? LIVE_STREAMS
    : LIVE_STREAMS.filter((s) => s.category === category.value),
)

const totalViewers = computed(() => LIVE_STREAMS.reduce((sum, s) => sum + s.viewers, 0))
</script>

<template>
  <div>
    <!-- Featured live -->
    <section class="relative isolate flex min-h-[70svh] items-end overflow-hidden lg:min-h-[64vh]">
      <div class="absolute inset-0 -z-10">
        <img
          :src="featuredArt"
          :alt="featured.title"
          class="size-full object-cover"
          fetchpriority="high"
        />
        <div class="absolute inset-0 scrim-b" />
        <div class="absolute inset-0 hidden scrim-l md:block" />
        <div class="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-ink/90 to-transparent" />
      </div>

      <div class="shell w-full pt-28 pb-14 lg:pb-20">
        <div class="max-w-2xl">
          <div class="flex flex-wrap items-center gap-3">
            <LiveBadge :viewers="featured.viewers" size="md" />
            <span class="text-[11px] font-semibold tracking-[0.16em] text-white/55 uppercase">
              ไลฟ์แนะนำประจำวัน
            </span>
          </div>

          <h1
            class="mt-5 text-[clamp(1.75rem,5.2vw,3.4rem)] leading-[1.08] font-extrabold tracking-tight text-hi"
          >
            {{ featured.title }}
          </h1>

          <div v-if="featuredCreator" class="mt-5 flex items-center gap-3">
            <AppAvatar
              :name="featuredCreator.name"
              :seed="featuredCreator.avatarSeed"
              size="md"
              live-ring
              :verified="featuredCreator.verified"
            />
            <div class="min-w-0">
              <p class="truncate text-sm font-semibold text-hi">{{ featuredCreator.name }}</p>
              <p class="truncate text-[11px] text-white/55">
                ผู้ติดตาม {{ formatCountTh(featuredCreator.followers) }} · {{ featured.startedAgo }}
              </p>
            </div>
          </div>

          <p class="mt-5 max-w-prose text-sm leading-relaxed text-white/70 sm:text-[15px]">
            {{ featured.description }}
          </p>

          <div class="mt-4 flex flex-wrap gap-2">
            <span
              v-for="t in featured.tags"
              :key="t"
              class="rounded-full bg-white/8 px-3 py-1 text-[11px] font-medium text-white/70 ring-1 ring-inset ring-white/10"
            >
              #{{ t }}
            </span>
          </div>

          <div class="mt-7 flex flex-wrap items-center gap-2.5 sm:gap-3">
            <AppButton size="lg" variant="primary" @click="requestPlay(featured)">
              <Play class="size-5 fill-current" /> เข้าชมไลฟ์
            </AppButton>
            <AppButton
              size="lg"
              :variant="has(featured.creatorId) ? 'secondary' : 'live'"
              @click="toggle(featured.creatorId)"
            >
              <Bell class="size-4.5" />
              {{ has(featured.creatorId) ? 'กำลังติดตาม' : 'ติดตามช่อง' }}
            </AppButton>
            <AppButton size="lg" variant="outline" class="hidden sm:inline-flex">
              <Share2 class="size-4.5" /> แชร์
            </AppButton>
          </div>
        </div>
      </div>

      <div class="pointer-events-none absolute inset-x-0 -bottom-px h-24 bg-gradient-to-t from-ink to-transparent" />
    </section>

    <!-- categories + grid -->
    <section class="shell py-10 lg:py-12">
      <div class="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 class="flex items-center gap-2.5 text-xl font-bold text-hi sm:text-2xl">
            <span class="size-2.5 rounded-full bg-live animate-live-pulse" />
            หมวดหมู่ไลฟ์
          </h2>
          <p class="mt-1.5 inline-flex items-center gap-1.5 text-[13px] text-lo">
            <Users class="size-3.5" />
            มีผู้ชมรวม {{ formatCountTh(totalViewers) }} คนกำลังรับชมอยู่
          </p>
        </div>
      </div>

      <div class="mt-5">
        <div class="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 py-1">
          <button
            v-for="c in LIVE_CATEGORIES"
            :key="c.id"
            type="button"
            class="shrink-0 rounded-full px-4.5 py-2.5 text-[13px] font-semibold whitespace-nowrap ring-1 ring-inset transition-all duration-250 active:scale-95"
            :class="
              category === c.id
                ? 'bg-live text-white ring-transparent shadow-[0_8px_26px_-10px_var(--color-live)]'
                : 'bg-white/6 text-mid ring-white/10 hover:bg-white/12 hover:text-hi'
            "
            @click="category = c.id"
          >
            {{ c.label }}
          </button>
        </div>
      </div>

      <div class="mt-8">
        <TransitionGroup
          name="live"
          tag="div"
          class="grid gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4"
        >
          <LiveCard v-for="s in streams" :key="s.id" :stream="s" />
        </TransitionGroup>
      </div>
    </section>

    <RecommendationRail
      heading="ครีเอเตอร์แนะนำ"
      subtitle="ช่องที่คนดูติดตามมากที่สุดสัปดาห์นี้"
      variant="creator"
      :creators="CREATORS"
      class="pb-14"
    />
  </div>
</template>

<style scoped>
.live-enter-active,
.live-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s var(--ease-out-expo);
}
.live-enter-from {
  opacity: 0;
  transform: translateY(14px) scale(0.98);
}
.live-leave-to {
  opacity: 0;
  transform: scale(0.97);
}
.live-leave-active {
  position: absolute;
}
</style>
