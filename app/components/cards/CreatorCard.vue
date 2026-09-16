<script setup lang="ts">
import type { Creator } from '~/types'
import { formatCountTh } from '~/utils/format'
import { LIVE_CATEGORIES, LIVE_STREAMS } from '~/data/live'

const props = defineProps<{ creator: Creator; width?: string }>()

const { has, toggle } = useFollows()
const following = computed(() => has(props.creator.id))
const isLive = computed(() => LIVE_STREAMS.some((s) => s.creatorId === props.creator.id))
const liveId = computed(() => LIVE_STREAMS.find((s) => s.creatorId === props.creator.id)?.id)
const categoryLabel = computed(
  () => LIVE_CATEGORIES.find((c) => c.id === props.creator.category)?.label ?? props.creator.category,
)
</script>

<template>
  <article
    class="group/creator relative overflow-hidden rounded-2xl bg-surface p-4 card-edge transition-all duration-400 hover:-translate-y-1 hover:bg-surface-2"
    :style="width ? { width } : undefined"
  >
    <div
      class="pointer-events-none absolute -top-16 -right-10 size-36 rounded-full bg-accent-500/12 blur-3xl transition-opacity duration-500 group-hover/creator:bg-accent-500/22"
    />
    <div class="relative flex flex-col items-center text-center">
      <NuxtLink :to="isLive && liveId ? `/live/${liveId}` : '/live'">
        <AppAvatar
          :name="creator.name"
          :seed="creator.avatarSeed"
          size="lg"
          :verified="creator.verified"
          :live-ring="isLive"
          :ring="!isLive"
        />
      </NuxtLink>
      <span
        v-if="isLive"
        class="-mt-2 rounded-md bg-live px-1.5 py-px text-[9px] font-bold tracking-[0.12em] text-white uppercase"
      >
        Live
      </span>

      <h3 class="mt-3 line-clamp-1 text-sm font-semibold text-hi">{{ creator.name }}</h3>
      <p class="mt-0.5 text-[11px] text-lo">{{ creator.handle }}</p>
      <p class="mt-2 text-[11px] text-mid">
        {{ categoryLabel }} · ผู้ติดตาม {{ formatCountTh(creator.followers) }}
      </p>

      <AppButton
        :variant="following ? 'secondary' : 'live'"
        size="sm"
        class="mt-3.5 w-full"
        @click="toggle(creator.id)"
      >
        {{ following ? 'กำลังติดตาม' : 'ติดตาม' }}
      </AppButton>
    </div>
  </article>
</template>
