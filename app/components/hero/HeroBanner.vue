<script setup lang="ts">
import { Play, Info, Plus, Check, Star, Volume2, VolumeX } from 'lucide-vue-next'
import type { Title } from '~/types'
import { backdropArt } from '~/utils/artwork'
import { formatRuntime, KIND_LABEL } from '~/utils/format'

/** Auto-rotating cinematic hero. Occupies ~70vh on desktop. */
const props = withDefaults(defineProps<{ items: Title[]; interval?: number }>(), {
  interval: 9000,
})

const index = ref(0)
const paused = ref(false)
const muted = ref(true)
const { has, toggle } = useMyList()
const { requestPlay } = useAccessControl()

const current = computed(() => props.items[index.value] as Title)
const saved = computed(() => has(current.value.id))
const backdrops = computed(() => props.items.map((t) => t.imageUrl ?? backdropArt(t.backdropSeed)))

const meta = computed(() => {
  const t = current.value
  return [
    String(t.year),
    t.genres[0],
    t.rating,
    t.runtime ? formatRuntime(t.runtime) : `${t.episodes ?? 0} ตอน`,
  ].filter(Boolean) as string[]
})

let timer: ReturnType<typeof setInterval> | undefined
const go = (i: number) => (index.value = (i + props.items.length) % props.items.length)

onMounted(() => {
  timer = setInterval(() => {
    if (!paused.value) go(index.value + 1)
  }, props.interval)
})
onBeforeUnmount(() => clearInterval(timer))
</script>

<template>
  <!--
    Banner band, shaped like iHaveTicket's .section-banner: a blurred wash
    of the artwork spans the viewport while the banner itself is boxed to
    1280px. Heights follow theirs (488 desktop / 380 tablet) with extra
    room on phones so the play + detail buttons stay reachable.
  -->
  <section
    class="relative isolate overflow-hidden bg-[#271322]"
    aria-roledescription="carousel"
    aria-label="เนื้อหาแนะนำ"
    @mouseenter="paused = true"
    @mouseleave="paused = false"
  >
    <!-- blurred wash behind the box -->
    <div class="absolute inset-0 -z-10" aria-hidden="true">
      <img
        v-for="(src, i) in backdrops"
        :key="`wash-${src}`"
        :src="src"
        alt=""
        class="absolute inset-0 size-full scale-110 object-cover blur-2xl transition-opacity duration-[1400ms]"
        :class="i === index ? 'opacity-100' : 'opacity-0'"
        loading="lazy"
        decoding="async"
      />
      <div class="absolute inset-0 bg-white/10" />
    </div>

    <div
      class="relative mx-auto flex h-[560px] w-full max-w-[1280px] items-end overflow-hidden sm:h-[470px] lg:h-[488px]"
    >
      <!-- artwork stack -->
      <div class="absolute inset-0 -z-10">
        <img
          v-for="(src, i) in backdrops"
          :key="src"
          :src="src"
          :alt="i === index ? `ภาพประกอบของ ${items[i]?.title}` : ''"
          :aria-hidden="i !== index"
          class="absolute inset-0 size-full object-cover transition-all duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
          :class="[
            i === index ? 'scale-100 opacity-100' : 'scale-105 opacity-0',
            /* portrait key art: anchor to the top of the poster */
            items[i]?.imageUrl && 'object-top',
          ]"
          :loading="i === 0 ? 'eager' : 'lazy'"
          decoding="async"
        />
        <!-- cinematic grading -->
        <!-- just enough shading for the copy to read; the art stays bright -->
        <div
          class="absolute inset-0 bg-gradient-to-t from-[#07030d]/95 via-[#07030d]/45 to-transparent"
        />
        <div
          class="absolute inset-0 hidden bg-gradient-to-r from-[#07030d]/90 via-[#07030d]/40 to-transparent md:block"
        />
      </div>

      <!-- top padding clears the fixed navbar when the copy runs tall -->
      <div class="w-full px-3 pt-26 pb-16 sm:px-5 sm:pt-28 sm:pb-14 lg:px-10 lg:pb-16">
      <Transition name="hero" mode="out-in">
        <div :key="current.id" class="max-w-xl lg:max-w-2xl">
          <!-- eyebrow -->
          <div class="flex flex-wrap items-center gap-2.5">
            <span
              class="inline-flex items-center gap-1.5 rounded-md bg-accent/15 px-2.5 py-1 text-[11px] font-bold tracking-[0.18em] text-accent-200 uppercase ring-1 ring-inset ring-accent-500/30"
            >
              {{ current.badges?.[0] ?? KIND_LABEL[current.kind] }}
            </span>
            <span class="text-[11px] font-semibold tracking-[0.18em] text-white/55 uppercase">
              {{ current.tagline ?? `${KIND_LABEL[current.kind]}ยอดนิยมบน DUDI` }}
            </span>
          </div>

          <h1
            class="mt-4 line-clamp-2 text-[clamp(1.9rem,4.4vw,3.25rem)] leading-[1.05] font-bold text-hi drop-shadow-[0_8px_30px_rgba(0,0,0,0.6)]"
          >
            {{ current.title }}
          </h1>
          <p
            v-if="current.titleEn"
            class="mt-2 text-xs font-medium tracking-[0.2em] text-white/45 uppercase sm:text-sm"
          >
            {{ current.titleEn }}
          </p>

          <!-- metadata -->
          <div class="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-[13px] text-white/75">
            <span class="inline-flex items-center gap-1 font-semibold text-accent-200">
              <Star class="size-3.5 fill-current" />{{ current.score.toFixed(1) }}
            </span>
            <template v-for="(m, i) in meta" :key="m + i">
              <span class="text-white/25">•</span>
              <span
                v-if="m === current.rating"
                class="rounded border border-white/25 px-1.5 py-px text-[11px] font-semibold"
              >
                {{ m }}
              </span>
              <span v-else>{{ m }}</span>
            </template>
            <TierBadge :tier="current.tier" />
          </div>

          <p
            class="mt-4 line-clamp-2 max-w-prose text-sm leading-relaxed text-white/80 sm:text-[15px] sm:leading-7"
          >
            {{ current.synopsis }}
          </p>

          <!-- actions -->
          <div class="mt-7 flex flex-wrap items-center gap-2.5 sm:gap-3">
            <AppButton size="lg" variant="primary" @click="requestPlay(current)">
              <Play class="size-5 fill-current" /> รับชม
            </AppButton>
            <AppButton :to="`/movie/${current.id}`" size="lg" variant="secondary">
              <Info class="size-5" /> รายละเอียด
            </AppButton>
            <AppButton size="lg" variant="outline" @click="toggle(current.id)">
              <Check v-if="saved" class="size-5" />
              <Plus v-else class="size-5" />
              <span class="hidden sm:inline">รายการของฉัน</span>
              <span class="sm:hidden">บันทึก</span>
            </AppButton>
          </div>
        </div>
      </Transition>
    </div>

      <!-- mute toggle -->
      <IconButton
        :label="muted ? 'เปิดเสียงตัวอย่าง' : 'ปิดเสียงตัวอย่าง'"
        variant="glass"
        size="sm"
        class="absolute right-4 bottom-8 hidden sm:inline-flex lg:right-10"
        @click="muted = !muted"
      >
        <VolumeX v-if="muted" class="size-4" />
        <Volume2 v-else class="size-4" />
      </IconButton>

      <!-- bar indicators, active bar in brand pink -->
      <div class="absolute inset-x-0 bottom-0 flex items-center justify-center gap-2 pb-3 sm:gap-3 sm:pb-4">
        <button
          v-for="(t, i) in items"
          :key="t.id"
          type="button"
          class="h-1 w-6 rounded-[3px] transition-colors duration-300 sm:h-1.5 sm:w-15"
          :class="i === index ? 'bg-accent' : 'bg-white hover:bg-white/70'"
          :aria-label="`ไปที่สไลด์ ${i + 1}: ${t.title}`"
          :aria-current="i === index"
          @click="go(i)"
        />
      </div>
    </div>

    <!-- bottom blend into the page -->
    <div
      class="pointer-events-none absolute inset-x-0 -bottom-px h-24 bg-gradient-to-t from-ink to-transparent"
    />
  </section>
</template>

<style scoped>
.hero-enter-active {
  transition:
    opacity 0.6s var(--ease-out-expo),
    transform 0.6s var(--ease-out-expo);
}
.hero-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}
.hero-enter-from {
  opacity: 0;
  transform: translateY(22px);
}
.hero-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
