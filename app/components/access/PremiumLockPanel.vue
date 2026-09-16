<script setup lang="ts">
import { Lock, Crown, CalendarX, LogIn } from 'lucide-vue-next'
import type { AccessState, ContentItem } from '~/types'

/**
 * Lock overlay shown in place of playback on the watch and live pages,
 * so a direct URL to gated content never starts playing.
 */
const props = defineProps<{ content: ContentItem; state: AccessState }>()

const { currentPlan } = useSubscription()
const route = useRoute()

const copy = computed(() => {
  switch (props.state) {
    case 'login':
      return {
        icon: LogIn,
        title: 'เข้าสู่ระบบเพื่อรับชม',
        body: 'เนื้อหานี้สำหรับสมาชิกเท่านั้น เข้าสู่ระบบแล้วกลับมาที่หน้านี้ได้ทันที',
        cta: 'เข้าสู่ระบบ',
        to: `/login?redirect=${encodeURIComponent(route.fullPath)}`,
      }
    case 'expired':
      return {
        icon: CalendarX,
        title: 'แพ็กเกจของคุณหมดอายุแล้ว',
        body: 'ต่ออายุแพ็กเกจเพื่อกลับมารับชมเนื้อหาพรีเมียมได้ทันที',
        cta: 'ต่ออายุแพ็กเกจ',
        to: `/payment?plan=${currentPlan.value === 'free' ? 'premium' : currentPlan.value}`,
      }
    case 'upgrade':
      return {
        icon: Crown,
        title: 'ไลฟ์นี้สำหรับสมาชิก PREMIUM',
        body: 'อัปเกรดแพ็กเกจเพื่อรับชมไลฟ์พิเศษและคอนเทนต์ระดับ 4K ได้ทั้งหมด',
        cta: 'อัปเกรดเป็น PREMIUM',
        to: '/payment?plan=premium',
      }
    default:
      return {
        icon: Lock,
        title: 'เนื้อหานี้สำหรับสมาชิก Premium',
        body: 'สมัครแพ็กเกจเพื่อรับชมหนัง ละคร ซีรีส์ และไลฟ์พิเศษได้ไม่จำกัด',
        cta: 'ดูแพ็กเกจ',
        to: '/pricing',
      }
  }
})
</script>

<template>
  <div class="relative aspect-video w-full overflow-hidden bg-black sm:rounded-2xl">
    <img
      :src="content.backdrop"
      :alt="content.title"
      class="size-full object-cover opacity-30 blur-[2px]"
    />
    <div class="absolute inset-0 bg-gradient-to-t from-ink via-ink/85 to-ink/60" />

    <div class="absolute inset-0 grid place-items-center p-5 text-center">
      <div class="max-w-md">
        <span
          class="mx-auto grid size-14 place-items-center rounded-2xl bg-gradient-to-br from-accent-500/30 to-accent-glow/15 text-accent-200 ring-1 ring-inset ring-accent-500/30 sm:size-16"
        >
          <component :is="copy.icon" class="size-6 sm:size-7" />
        </span>

        <h2 class="mt-4 text-lg font-bold text-hi sm:mt-5 sm:text-2xl">{{ copy.title }}</h2>
        <p class="mx-auto mt-2 max-w-sm text-[13px] leading-relaxed text-mid">{{ copy.body }}</p>
        <p class="mt-3 truncate text-[12px] text-lo">{{ content.title }}</p>

        <div class="mt-6 flex flex-wrap justify-center gap-2.5">
          <AppButton :to="copy.to" variant="live" size="lg">{{ copy.cta }}</AppButton>
          <AppButton to="/" variant="outline" size="lg">กลับหน้าแรก</AppButton>
        </div>
      </div>
    </div>
  </div>
</template>
