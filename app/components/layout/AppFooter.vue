<script setup lang="ts">
import { Facebook, Instagram, Youtube, Twitter } from 'lucide-vue-next'
import { FOOTER_LINKS } from '~/data/site'

const socials = [
  { icon: Facebook, label: 'Facebook' },
  { icon: Instagram, label: 'Instagram' },
  { icon: Youtube, label: 'YouTube' },
  { icon: Twitter, label: 'X' },
]
const year = new Date().getFullYear() + 543
</script>

<template>
  <!-- footer band mirrors iHaveTicket's FooterBar: 4px pink rule over a
       magenta→indigo wash with a plum glow behind the middle -->
  <footer
    class="relative mt-20 border-t-4 border-accent bg-[linear-gradient(105deg,#130022_0%,#230030_42%,#3b064e_68%,#31247b_100%)]"
  >
    <div
      class="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_120%_at_50%_35%,rgba(105,0,89,0.55),transparent_65%)]"
      aria-hidden="true"
    />
    <div class="relative shell py-12 lg:py-16">
      <div class="grid gap-10 lg:grid-cols-[1.4fr_2fr]">
        <div>
          <AppLogo size="md" />
          <p class="mt-4 max-w-sm text-sm leading-relaxed text-lo">
            ดูดิ — บริการสตรีมมิงบันเทิงไทย รวมหนัง ละคร ซีรีส์ รายการวาไรตี้ และไลฟ์สด
            ไว้ในที่เดียว อยากดูอะไรก็ดูดิ รับชมได้ทุกอุปกรณ์
          </p>
          <div class="mt-5 flex gap-2">
            <IconButton v-for="s in socials" :key="s.label" :label="s.label" variant="solid" size="sm">
              <component :is="s.icon" class="size-4" />
            </IconButton>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-8 sm:grid-cols-3">
          <div v-for="group in FOOTER_LINKS" :key="group.title">
            <h3 class="text-lg/6 font-semibold text-hi">{{ group.title }}</h3>
            <ul class="mt-3.5 space-y-2.5">
              <li v-for="l in group.links" :key="l.label">
                <NuxtLink
                  :to="l.to"
                  class="text-base/5 text-mid transition-colors hover:text-hi"
                >
                  {{ l.label }}
                </NuxtLink>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div
        class="mt-12 flex flex-col gap-4 border-t border-line pt-6 text-[12px] text-lo sm:flex-row sm:items-center sm:justify-between"
      >
        <p>© {{ year }} - DUDI</p>
        <ul class="flex flex-wrap gap-x-5 gap-y-2">
          <li><a href="#" class="transition-colors hover:text-hi">เงื่อนไขการใช้งาน</a></li>
          <li><a href="#" class="transition-colors hover:text-hi">นโยบายความเป็นส่วนตัว</a></li>
          <li><a href="#" class="transition-colors hover:text-hi">คุกกี้</a></li>
        </ul>
      </div>
    </div>
  </footer>
</template>
