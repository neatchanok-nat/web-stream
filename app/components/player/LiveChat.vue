<script setup lang="ts">
import { Send, Smile, Users, Pin, MoreVertical, Gift } from 'lucide-vue-next'
import type { ChatMessage } from '~/types'
import { CHAT_COLORS, CHAT_INCOMING, CHAT_REACTIONS, CHAT_SEED } from '~/data/live'
import { formatCompact } from '~/utils/format'

/** Mock live chat: seeded server-side, then fed by a client-only ticker. */
const props = defineProps<{ viewers: number; channel: string }>()

const messages = ref<ChatMessage[]>([...CHAT_SEED])
const draft = ref('')
const listEl = ref<HTMLElement | null>(null)
const reactions = ref<{ id: number; emoji: string; left: number; drift: number }[]>([])

const USERS = [
  'ToonTee',
  'พิมพ์พิมพ์',
  'Nakrob_TH',
  'ฟ้าใส',
  'JJ_Studio',
  'ลุงหนวด',
  'MildyMild',
  'ชานมไข่มุก',
  'KrittP',
  'น้องข้าวปั้น',
]

let seq = 100
let reactionSeq = 0

function scrollToBottom() {
  nextTick(() => {
    const el = listEl.value
    if (el) el.scrollTop = el.scrollHeight
  })
}

function push(user: string, message: string, extra: Partial<ChatMessage> = {}) {
  messages.value.push({
    id: `m${seq++}`,
    user,
    message,
    colorIndex: seq % CHAT_COLORS.length,
    ...extra,
  })
  if (messages.value.length > 60) messages.value.splice(0, messages.value.length - 60)
  scrollToBottom()
}

function send() {
  const text = draft.value.trim()
  if (!text) return
  push('คุณ', text, { colorIndex: 3 })
  draft.value = ''
}

function react(emoji: string) {
  reactions.value.push({
    id: reactionSeq++,
    emoji,
    left: 12 + Math.random() * 70,
    drift: Math.random() * 40 - 20,
  })
  setTimeout(() => reactions.value.shift(), 1800)
}

let ticker: ReturnType<typeof setInterval> | undefined
onMounted(() => {
  scrollToBottom()
  ticker = setInterval(
    () => {
      const user = USERS[Math.floor(Math.random() * USERS.length)] as string
      const msg = CHAT_INCOMING[Math.floor(Math.random() * CHAT_INCOMING.length)] as string
      push(user, msg)
    },
    2600 + Math.random() * 1600,
  )
})
onBeforeUnmount(() => clearInterval(ticker))
</script>

<template>
  <section
    class="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl bg-surface/70 ring-1 ring-inset ring-line"
    aria-label="แชทสด"
  >
    <!-- header -->
    <header class="flex shrink-0 items-center gap-2 border-b border-line px-4 py-3">
      <h2 class="text-sm font-bold text-hi">แชทสด</h2>
      <span class="inline-flex items-center gap-1 text-[11px] text-lo">
        <Users class="size-3.5" />{{ formatCompact(props.viewers) }}
      </span>
      <div class="ml-auto flex items-center gap-0.5">
        <IconButton label="ของขวัญ" size="sm"><Gift class="size-4" /></IconButton>
        <IconButton label="ตัวเลือกแชท" size="sm"><MoreVertical class="size-4" /></IconButton>
      </div>
    </header>

    <!-- pinned -->
    <div class="shrink-0 border-b border-line bg-accent-500/8 px-4 py-2.5">
      <p class="flex items-start gap-2 text-[11px] leading-relaxed text-accent-100">
        <Pin class="mt-0.5 size-3.5 shrink-0" />
        <span>ยินดีต้อนรับสู่ห้องของ {{ channel }} — งดคำหยาบและการโฆษณา ขอบคุณครับ</span>
      </p>
    </div>

    <!-- messages -->
    <div
      ref="listEl"
      class="no-scrollbar relative min-h-0 flex-1 space-y-0.5 overflow-y-auto px-2 py-3"
    >
      <TransitionGroup name="chat">
        <div
          v-for="m in messages"
          :key="m.id"
          class="flex gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-white/4"
        >
          <AppAvatar :name="m.user" size="xs" class="mt-0.5" />
          <p class="min-w-0 flex-1 text-[13px] leading-relaxed break-words">
            <span
              class="mr-1.5 font-semibold"
              :class="CHAT_COLORS[m.colorIndex % CHAT_COLORS.length]"
            >
              <span
                v-if="m.isCreator"
                class="mr-1 rounded bg-live px-1 py-px text-[9px] font-bold text-white uppercase"
              >
                ครีเอเตอร์
              </span>
              <span
                v-else-if="m.isModerator"
                class="mr-1 rounded bg-accent px-1 py-px text-[9px] font-bold text-white uppercase"
              >
                แอดมิน
              </span>
              {{ m.user }}
            </span>
            <span class="text-mid">{{ m.message }}</span>
          </p>
        </div>
      </TransitionGroup>

      <!-- floating reactions -->
      <div class="pointer-events-none absolute inset-0 overflow-hidden">
        <span
          v-for="r in reactions"
          :key="r.id"
          class="float-emoji absolute bottom-2 text-2xl"
          :style="{ left: `${r.left}%`, '--drift': `${r.drift}px` }"
        >
          {{ r.emoji }}
        </span>
      </div>
    </div>

    <!-- reactions + composer -->
    <footer class="shrink-0 border-t border-line p-3">
      <div class="mb-2.5 flex items-center gap-1.5">
        <button
          v-for="e in CHAT_REACTIONS"
          :key="e"
          type="button"
          class="grid size-8 place-items-center rounded-full bg-white/6 text-base transition-all duration-200 hover:scale-115 hover:bg-white/14 active:scale-90"
          :aria-label="`ส่งรีแอคชัน ${e}`"
          @click="react(e)"
        >
          {{ e }}
        </button>
      </div>

      <form class="flex items-center gap-2" @submit.prevent="send">
        <div
          class="flex h-11 flex-1 items-center rounded-xl bg-ink/70 ring-1 ring-inset ring-line transition-all focus-within:ring-accent-500/60"
        >
          <input
            v-model="draft"
            type="text"
            maxlength="200"
            placeholder="พิมพ์ข้อความ…"
            class="h-full min-w-0 flex-1 bg-transparent px-3.5 text-[13px] text-hi placeholder:text-lo focus:outline-none"
            aria-label="ส่งข้อความในแชท"
          />
          <button
            type="button"
            class="grid size-9 shrink-0 place-items-center rounded-lg text-lo transition-colors hover:text-hi"
            aria-label="เลือกอีโมจิ"
          >
            <Smile class="size-4.5" />
          </button>
        </div>
        <button
          type="submit"
          class="grid size-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-accent-500 to-accent-600 text-white transition-all hover:brightness-110 active:scale-92 disabled:opacity-40"
          :disabled="!draft.trim()"
          aria-label="ส่งข้อความ"
        >
          <Send class="size-4.5" />
        </button>
      </form>
    </footer>
  </section>
</template>

<style scoped>
.chat-enter-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s var(--ease-out-expo);
}
.chat-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.float-emoji {
  animation: rise 1.8s ease-out forwards;
}
@keyframes rise {
  0% {
    opacity: 0;
    transform: translate(0, 0) scale(0.6);
  }
  15% {
    opacity: 1;
    transform: translate(0, -12px) scale(1.1);
  }
  100% {
    opacity: 0;
    transform: translate(var(--drift, 0), -190px) scale(0.9);
  }
}
</style>
