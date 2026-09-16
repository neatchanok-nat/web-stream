<script setup lang="ts">
import { Home, Search } from 'lucide-vue-next'
import type { NuxtError } from '#app'
import { backdropArt } from '~/utils/artwork'

const props = defineProps<{ error: NuxtError }>()
const art = backdropArt('dudi-error-screen')

const heading = computed(() =>
  props.error?.statusCode === 404 ? 'ไม่พบหน้าที่คุณต้องการ' : 'เกิดข้อผิดพลาดบางอย่าง',
)
</script>

<template>
  <div class="relative grid min-h-svh place-items-center overflow-hidden bg-ink px-5">
    <img :src="art" alt="" class="absolute inset-0 size-full object-cover opacity-35" />
    <div class="absolute inset-0 bg-gradient-to-t from-ink via-ink/85 to-ink/70" />

    <div class="relative w-full max-w-lg text-center">
      <AppLogo size="lg" class="justify-center" />
      <p class="mt-10 text-7xl font-extrabold tracking-tight text-gradient sm:text-8xl">
        {{ error?.statusCode ?? 500 }}
      </p>
      <h1 class="mt-4 text-2xl font-bold text-hi sm:text-3xl">{{ heading }}</h1>
      <p class="mt-3 text-sm leading-relaxed text-lo">
        {{ error?.statusMessage || 'ลองกลับไปหน้าแรก หรือค้นหาเรื่องที่คุณอยากดูอีกครั้ง' }}
      </p>
      <div class="mt-8 flex flex-wrap justify-center gap-3">
        <AppButton size="lg" variant="primary" @click="clearError({ redirect: '/' })">
          <Home class="size-4.5" /> กลับหน้าแรก
        </AppButton>
        <AppButton size="lg" variant="outline" @click="clearError({ redirect: '/search' })">
          <Search class="size-4.5" /> ค้นหาเนื้อหา
        </AppButton>
      </div>
    </div>
  </div>
</template>
