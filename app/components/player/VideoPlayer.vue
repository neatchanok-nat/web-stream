<script setup lang="ts">
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Subtitles,
  Settings,
  Maximize,
  PictureInPicture2,
  ChevronLeft,
  Loader2,
} from 'lucide-vue-next'
import { backdropArt } from '~/utils/artwork'
import { formatTime, formatCompact } from '~/utils/format'

/**
 * OTT player. With `src` it streams the real HLS source; without one it
 * falls back to the mock timeline that advances while "playing", so the
 * chrome can still be evaluated on artwork-only catalogue titles.
 */
const props = withDefaults(
  defineProps<{
    seed: string
    heading?: string
    subheading?: string
    /** Total runtime in seconds (ignored when `live`) */
    duration?: number
    /** HLS manifest (.m3u8). Omit for the mock timeline. */
    src?: string
    /** Real key art — falls back to artwork generated from `seed` */
    poster?: string
    live?: boolean
    viewers?: number
    backTo?: string
  }>(),
  { duration: 6300 },
)

const playing = ref(false)
const buffering = ref(false)
const currentTime = ref(props.live || props.src ? 0 : 1284)
const volume = ref(72)
const muted = ref(false)
const controlsVisible = ref(true)
const menu = ref<'quality' | 'subtitle' | 'speed' | null>(null)

/* ---------------------------------------------------------- real video */
const rootEl = ref<HTMLElement | null>(null)
const videoEl = ref<HTMLVideoElement | null>(null)
const realDuration = ref(0)
const failed = ref(false)
let hls: { destroy: () => void } | null = null

/** Runtime metadata beats the catalogue figure once the manifest loads. */
const total = computed(() => (realDuration.value > 0 ? realDuration.value : props.duration))

async function attach(src?: string) {
  hls?.destroy()
  hls = null
  failed.value = false
  realDuration.value = 0
  const el = videoEl.value
  if (!el || !src) return

  // Safari plays HLS natively; everyone else needs hls.js.
  if (el.canPlayType('application/vnd.apple.mpegurl')) {
    el.src = src
    return
  }
  const { default: Hls } = await import('hls.js')
  if (!Hls.isSupported()) {
    el.src = src
    return
  }
  const instance = new Hls({ enableWorker: true })
  instance.on(Hls.Events.ERROR, (_e, data) => {
    if (data.fatal) failed.value = true
  })
  instance.loadSource(src)
  instance.attachMedia(el)
  hls = instance
}


const QUALITIES = ['อัตโนมัติ (1080p)', '4K Ultra HD', '1080p', '720p', '480p']
const SUBTITLES = ['ปิด', 'ไทย', 'อังกฤษ', 'ไทย (สำหรับผู้บกพร่องทางการได้ยิน)']
const SPEEDS = ['0.5x', '0.75x', 'ปกติ', '1.25x', '1.5x', '2x']

const quality = ref(QUALITIES[0] as string)
const subtitle = ref('ไทย')
const speed = ref('ปกติ')

const art = computed(() => props.poster ?? backdropArt(props.seed))
const progress = computed(() =>
  props.live ? 100 : Math.min(100, (currentTime.value / (total.value || 1)) * 100),
)
/** Buffered slightly ahead of playhead — a detail real players always show. */
const buffered = computed(() => Math.min(100, progress.value + 12))

let ticker: ReturnType<typeof setInterval> | undefined
let hideTimer: ReturnType<typeof setTimeout> | undefined

function showControls() {
  controlsVisible.value = true
  clearTimeout(hideTimer)
  if (playing.value && !menu.value) {
    hideTimer = setTimeout(() => (controlsVisible.value = false), 2600)
  }
}

function togglePlay() {
  const el = videoEl.value
  if (props.src && el) {
    if (el.paused) void el.play().catch(() => (failed.value = true))
    else el.pause()
    showControls()
    return
  }
  playing.value = !playing.value
  if (playing.value) {
    buffering.value = true
    setTimeout(() => (buffering.value = false), 650)
  }
  showControls()
}

function seekTo(sec: number) {
  const next = Math.max(0, Math.min(total.value, sec))
  currentTime.value = next
  if (videoEl.value) videoEl.value.currentTime = next
}

function seek(e: Event) {
  const pct = Number((e.target as HTMLInputElement).value)
  seekTo((pct / 100) * total.value)
}

function skip(sec: number) {
  seekTo(currentTime.value + sec)
  showControls()
}

function onLoadedMetadata() {
  const el = videoEl.value
  if (!el) return
  if (Number.isFinite(el.duration)) realDuration.value = el.duration
  el.volume = muted.value ? 0 : volume.value / 100
  el.muted = muted.value
}

watch([volume, muted], ([v, m]) => {
  const el = videoEl.value
  if (!el) return
  el.volume = v / 100
  el.muted = m
})

watch(
  () => props.src,
  (src) => attach(src),
)

function toggleFullscreen() {
  if (document.fullscreenElement) void document.exitFullscreen()
  else void rootEl.value?.requestFullscreen?.().catch(() => {})
}

function togglePip() {
  const el = videoEl.value
  if (!el?.requestPictureInPicture) return
  if (document.pictureInPictureElement) void document.exitPictureInPicture()
  else void el.requestPictureInPicture().catch(() => {})
}

function toggleMenu(m: typeof menu.value) {
  menu.value = menu.value === m ? null : m
  showControls()
}

onMounted(() => {
  if (props.src) {
    void attach(props.src)
    return
  }
  ticker = setInterval(() => {
    if (!playing.value || buffering.value) return
    currentTime.value = props.live
      ? currentTime.value + 1
      : Math.min(props.duration, currentTime.value + 1)
  }, 1000)
})
onBeforeUnmount(() => {
  clearInterval(ticker)
  clearTimeout(hideTimer)
  hls?.destroy()
})
</script>

<template>
  <div
    ref="rootEl"
    class="group/player relative aspect-video w-full overflow-hidden bg-black select-none sm:rounded-2xl"
    :class="controlsVisible ? 'cursor-default' : 'cursor-none'"
    @mousemove="showControls"
    @mouseleave="playing && !menu && (controlsVisible = false)"
    @click.self="togglePlay"
  >
    <video
      v-if="src"
      ref="videoEl"
      :poster="art"
      playsinline
      preload="metadata"
      class="size-full bg-black object-contain"
      @click="togglePlay"
      @loadedmetadata="onLoadedMetadata"
      @timeupdate="currentTime = ($event.target as HTMLVideoElement).currentTime"
      @durationchange="onLoadedMetadata"
      @play="playing = true"
      @pause="playing = false"
      @waiting="buffering = true"
      @playing="((buffering = false), (playing = true))"
      @ended="playing = false"
      @error="failed = true"
    />
    <img
      v-else
      :src="art"
      :alt="heading ? `ภาพนิ่งจาก ${heading}` : 'ตัวอย่างวิดีโอ'"
      class="pointer-events-none size-full object-cover transition-all duration-700"
      :class="playing ? 'scale-100 opacity-95' : 'scale-105 opacity-70'"
    />

    <p
      v-if="failed"
      class="absolute inset-x-0 top-1/2 px-6 text-center text-sm font-medium text-white/80"
    >
      เล่นวิดีโอไม่สำเร็จ · ลองโหลดหน้านี้ใหม่อีกครั้ง
    </p>

    <!-- idle / paused veil -->
    <div
      class="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-black/45 transition-opacity duration-500"
      :class="playing && !controlsVisible ? 'opacity-0' : 'opacity-100'"
    />

    <!-- big centre play -->
    <button
      v-if="!playing"
      type="button"
      class="absolute inset-0 grid place-items-center"
      aria-label="เล่นวิดีโอ"
      @click="togglePlay"
    >
      <span
        class="grid size-18 place-items-center rounded-full bg-white/95 text-ink shadow-[0_20px_60px_-15px_rgba(0,0,0,0.9)] transition-transform duration-300 hover:scale-108 sm:size-22"
      >
        <Play class="size-8 translate-x-0.5 fill-current sm:size-9" />
      </span>
    </button>

    <div
      v-if="buffering"
      class="pointer-events-none absolute inset-0 grid place-items-center"
      role="status"
    >
      <Loader2 class="size-10 animate-spin text-white/80" />
    </div>

    <!-- top bar -->
    <div
      class="absolute inset-x-0 top-0 flex items-start gap-3 bg-gradient-to-b from-black/70 to-transparent p-3 transition-all duration-300 sm:p-4"
      :class="controlsVisible ? 'translate-y-0 opacity-100' : '-translate-y-3 opacity-0'"
    >
      <IconButton v-if="backTo" label="ย้อนกลับ" :to="backTo" variant="glass" size="sm">
        <ChevronLeft class="size-5" />
      </IconButton>
      <div class="min-w-0 flex-1">
        <h2 v-if="heading" class="truncate text-sm font-semibold text-white sm:text-base">
          {{ heading }}
        </h2>
        <p v-if="subheading" class="truncate text-[11px] text-white/60 sm:text-xs">
          {{ subheading }}
        </p>
      </div>
      <div v-if="live" class="flex shrink-0 items-center gap-2">
        <LiveBadge :viewers="viewers" size="md" />
      </div>
    </div>

    <!-- bottom control bar -->
    <div
      class="absolute inset-x-0 bottom-0 px-3 pb-2.5 transition-all duration-300 sm:px-4 sm:pb-3.5"
      :class="controlsVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'"
    >
      <!-- timeline -->
      <div v-if="!live" class="group/track relative h-5 w-full">
        <div class="absolute inset-x-0 top-2 h-1 overflow-hidden rounded-full bg-white/25">
          <div class="h-full bg-white/30" :style="{ width: `${buffered}%` }" />
        </div>
        <div
          class="pointer-events-none absolute top-2 left-0 h-1 rounded-full bg-gradient-to-r from-accent-400 to-accent-glow"
          :style="{ width: `${progress}%` }"
        />
        <span
          class="pointer-events-none absolute top-1.5 size-2 -translate-x-1/2 rounded-full bg-white opacity-0 shadow-[0_0_0_4px_rgba(255,255,255,0.2)] transition-all duration-200 group-hover/track:size-3.5 group-hover/track:top-0.5 group-hover/track:opacity-100"
          :style="{ left: `${progress}%` }"
        />
        <input
          type="range"
          min="0"
          max="100"
          step="0.1"
          :value="progress"
          aria-label="ตำแหน่งการเล่น"
          class="absolute inset-0 w-full cursor-pointer appearance-none bg-transparent focus:outline-none [&::-webkit-slider-thumb]:size-5 [&::-webkit-slider-thumb]:appearance-none"
          @input="seek"
        />
      </div>
      <div v-else class="relative h-5">
        <div class="absolute inset-x-0 top-2 h-1 overflow-hidden rounded-full bg-white/20">
          <div class="h-full w-full bg-live" />
        </div>
      </div>

      <div class="mt-1 flex items-center gap-1 sm:gap-1.5">
        <IconButton :label="playing ? 'หยุดชั่วคราว' : 'เล่น'" size="sm" @click="togglePlay">
          <Pause v-if="playing" class="size-5 fill-current" />
          <Play v-else class="size-5 fill-current" />
        </IconButton>
        <IconButton v-if="!live" label="ย้อนกลับ 10 วินาที" size="sm" @click="skip(-10)">
          <SkipBack class="size-4.5" />
        </IconButton>
        <IconButton v-if="!live" label="ข้ามไป 10 วินาที" size="sm" @click="skip(10)">
          <SkipForward class="size-4.5" />
        </IconButton>

        <!-- volume -->
        <div class="group/vol flex items-center">
          <IconButton :label="muted ? 'เปิดเสียง' : 'ปิดเสียง'" size="sm" @click="muted = !muted">
            <VolumeX v-if="muted || volume === 0" class="size-4.5" />
            <Volume2 v-else class="size-4.5" />
          </IconButton>
          <input
            v-model.number="volume"
            type="range"
            min="0"
            max="100"
            aria-label="ระดับเสียง"
            class="h-1 w-0 cursor-pointer appearance-none rounded-full bg-white/25 opacity-0 transition-all duration-300 group-hover/vol:w-20 group-hover/vol:opacity-100 focus:w-20 focus:opacity-100 [&::-webkit-slider-thumb]:size-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
            :style="{
              backgroundImage: `linear-gradient(to right, #fff ${muted ? 0 : volume}%, rgba(255,255,255,.25) ${muted ? 0 : volume}%)`,
            }"
            @input="muted = false"
          />
        </div>

        <span v-if="!live" class="ml-1.5 shrink-0 text-[11px] font-medium text-white/80 tabular-nums sm:text-xs">
          {{ formatTime(currentTime) }}
          <span class="text-white/35"> / {{ formatTime(total) }}</span>
        </span>
        <span v-else class="ml-1.5 flex shrink-0 items-center gap-1.5 text-[11px] font-semibold text-white/85">
          <span class="size-1.5 rounded-full bg-live animate-live-pulse" /> ถ่ายทอดสด
          <span v-if="viewers" class="text-white/45">· {{ formatCompact(viewers) }} คนกำลังดู</span>
        </span>

        <div class="relative ml-auto flex items-center gap-0.5 sm:gap-1">
          <!-- subtitle -->
          <div class="relative">
            <IconButton
              label="คำบรรยาย"
              size="sm"
              :active="menu === 'subtitle'"
              @click="toggleMenu('subtitle')"
            >
              <Subtitles class="size-4.5" />
            </IconButton>
            <Transition name="pop">
              <div
                v-if="menu === 'subtitle'"
                class="absolute right-0 bottom-11 w-56 overflow-hidden rounded-xl glass-strong p-1 ring-1 ring-line-strong"
              >
                <p class="px-3 py-2 text-[11px] font-bold tracking-wide text-lo uppercase">
                  คำบรรยาย
                </p>
                <button
                  v-for="s in SUBTITLES"
                  :key="s"
                  type="button"
                  class="block w-full rounded-lg px-3 py-2 text-left text-[13px] transition-colors hover:bg-white/8"
                  :class="subtitle === s ? 'font-semibold text-accent-200' : 'text-mid'"
                  @click="((subtitle = s), (menu = null))"
                >
                  {{ s }}
                </button>
              </div>
            </Transition>
          </div>

          <!-- settings / quality -->
          <div class="relative">
            <IconButton
              label="ตั้งค่าการเล่น"
              size="sm"
              :active="menu === 'quality'"
              @click="toggleMenu('quality')"
            >
              <Settings class="size-4.5" />
            </IconButton>
            <Transition name="pop">
              <div
                v-if="menu === 'quality'"
                class="absolute right-0 bottom-11 w-56 overflow-hidden rounded-xl glass-strong p-1 ring-1 ring-line-strong"
              >
                <p class="px-3 py-2 text-[11px] font-bold tracking-wide text-lo uppercase">
                  คุณภาพวิดีโอ
                </p>
                <button
                  v-for="q in QUALITIES"
                  :key="q"
                  type="button"
                  class="block w-full rounded-lg px-3 py-2 text-left text-[13px] transition-colors hover:bg-white/8"
                  :class="quality === q ? 'font-semibold text-accent-200' : 'text-mid'"
                  @click="((quality = q), (menu = null))"
                >
                  {{ q }}
                </button>
                <div class="my-1 border-t border-line" />
                <p class="px-3 py-2 text-[11px] font-bold tracking-wide text-lo uppercase">
                  ความเร็ว
                </p>
                <div class="flex flex-wrap gap-1 px-2 pb-2">
                  <button
                    v-for="s in SPEEDS"
                    :key="s"
                    type="button"
                    class="rounded-md px-2 py-1 text-[11px] font-semibold transition-colors"
                    :class="speed === s ? 'bg-accent text-white' : 'bg-white/8 text-mid hover:bg-white/14'"
                    @click="speed = s"
                  >
                    {{ s }}
                  </button>
                </div>
              </div>
            </Transition>
          </div>

          <IconButton
            label="เล่นในหน้าต่างเล็ก"
            size="sm"
            class="hidden sm:inline-flex"
            @click="togglePip"
          >
            <PictureInPicture2 class="size-4.5" />
          </IconButton>
          <IconButton label="เต็มหน้าจอ" size="sm" @click="toggleFullscreen">
            <Maximize class="size-4.5" />
          </IconButton>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pop-enter-active,
.pop-leave-active {
  transition:
    opacity 0.18s ease,
    transform 0.2s var(--ease-out-expo);
}
.pop-enter-from,
.pop-leave-to {
  opacity: 0;
  transform: translateY(8px) scale(0.96);
}
input[type='range']::-webkit-slider-thumb {
  cursor: pointer;
}
</style>
