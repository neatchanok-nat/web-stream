<script setup lang="ts">
import type { Title } from '~/types'

/**
 * Grid-facing poster card: always shows genre + year + tier badge.
 * Thin wrapper over PosterCard so both surfaces share one hover language.
 */
defineProps<{ title: Title; rank?: number }>()
</script>

<template>
  <PosterCard :title="title" :rank="rank" />
</template>
