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
const backdrops = computed(() => props.items.map((t) => backdropArt(t.backdropSeed)))

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
  <section
    class="relative isolate flex h-[78svh] max-h-[880px] min-h-[540px] items-end overflow-hidden lg:h-[72vh]"
    aria-roledescription="carousel"
    aria-label="เนื้อหาแนะนำ"
    @mouseenter="paused = true"
    @mouseleave="paused = false"
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
        :class="i === index ? 'scale-100 opacity-100' : 'scale-105 opacity-0'"
        :loading="i === 0 ? 'eager' : 'lazy'"
        decoding="async"
      />
      <!-- cinematic grading -->
      <div class="absolute inset-0 scrim-b" />
      <div class="absolute inset-0 hidden scrim-l md:block" />
      <div class="absolute inset-0 bg-ink/35 md:bg-ink/15" />
      <div
        class="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-ink/90 to-transparent"
      />
    </div>

    <div class="shell w-full pb-16 sm:pb-20 lg:pb-24">
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
            class="mt-4 text-[clamp(2.1rem,7vw,4.6rem)] leading-[1.02] font-extrabold tracking-[-0.03em] text-hi drop-shadow-[0_8px_30px_rgba(0,0,0,0.6)]"
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
            class="mt-4 line-clamp-3 max-w-prose text-sm leading-relaxed text-white/70 sm:text-[15px] sm:leading-7"
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

    <!-- controls -->
    <div class="absolute right-4 bottom-6 flex items-center gap-3 sm:right-7 lg:right-12">
      <IconButton
        :label="muted ? 'เปิดเสียงตัวอย่าง' : 'ปิดเสียงตัวอย่าง'"
        variant="glass"
        size="sm"
        class="hidden sm:inline-flex"
        @click="muted = !muted"
      >
        <VolumeX v-if="muted" class="size-4" />
        <Volume2 v-else class="size-4" />
      </IconButton>

      <div class="flex items-center gap-1.5">
        <button
          v-for="(t, i) in items"
          :key="t.id"
          type="button"
          class="h-1 rounded-full transition-all duration-400"
          :class="i === index ? 'w-7 bg-white' : 'w-3 bg-white/30 hover:bg-white/60'"
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
