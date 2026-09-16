<script setup lang="ts">
import { Pencil, Mail, CalendarDays, MonitorSmartphone } from 'lucide-vue-next'
import { PROFILE } from '~/data/site'

/** Identity comes from the session; the rest stays mock profile data. */
const { user } = useAuth()
const displayName = computed(() => user.value?.name ?? PROFILE.name)
const displayEmail = computed(() => user.value?.email ?? PROFILE.email)
const avatarSeed = computed(() => user.value?.id ?? PROFILE.avatarSeed)
</script>

<template>
  <section class="relative overflow-hidden rounded-3xl bg-surface p-6 ring-1 ring-line sm:p-8">
    <div
      class="pointer-events-none absolute -top-28 -right-16 size-72 rounded-full bg-accent-500/15 blur-[80px]"
      aria-hidden="true"
    />

    <div class="relative flex flex-col gap-6 sm:flex-row sm:items-center">
      <AppAvatar :name="displayName" :seed="avatarSeed" size="xl" ring />

      <div class="min-w-0 flex-1">
        <h1 class="text-2xl font-bold tracking-tight text-hi sm:text-3xl">{{ displayName }}</h1>
        <div class="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[13px] text-lo">
          <span class="inline-flex items-center gap-1.5">
            <Mail class="size-3.5" />{{ displayEmail }}
          </span>
          <span class="inline-flex items-center gap-1.5">
            <CalendarDays class="size-3.5" />{{ PROFILE.memberSince }}
          </span>
          <span class="inline-flex items-center gap-1.5">
            <MonitorSmartphone class="size-3.5" />
            {{ PROFILE.devices }}/{{ PROFILE.maxDevices }} อุปกรณ์
          </span>
        </div>
      </div>

      <AppButton variant="secondary" size="md" class="shrink-0">
        <Pencil class="size-4" /> แก้ไขโปรไฟล์
      </AppButton>
    </div>

    <!-- profile switcher -->
    <div class="relative mt-8 border-t border-line pt-6">
      <h2 class="text-[13px] font-semibold text-mid">โปรไฟล์ในบัญชีนี้</h2>
      <div class="mt-4 flex flex-wrap gap-4">
        <button
          v-for="p in PROFILE.profiles"
          :key="p.id"
          type="button"
          class="group/p flex w-20 flex-col items-center gap-2 rounded-xl p-2 transition-colors hover:bg-white/5"
        >
          <AppAvatar :name="p.name" :seed="p.seed" size="lg" />
          <span class="truncate text-[11px] font-medium text-mid group-hover/p:text-hi">
            {{ p.name }}
          </span>
          <span class="-mt-1 text-[10px] text-lo">{{ p.kind }}</span>
        </button>

        <button
          type="button"
          class="flex w-20 flex-col items-center gap-2 rounded-xl p-2 text-lo transition-colors hover:bg-white/5 hover:text-hi"
        >
          <span
            class="grid size-14 place-items-center rounded-full border border-dashed border-line-strong text-2xl leading-none"
          >
            +
          </span>
          <span class="text-[11px] font-medium">เพิ่มโปรไฟล์</span>
        </button>
      </div>
    </div>
  </section>
</template>
