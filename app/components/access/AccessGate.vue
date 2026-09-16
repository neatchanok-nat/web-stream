<script setup lang="ts">
import type { ContentItem, LiveStream, Title } from '~/types'

/**
 * Renderless gate around any play affordance.
 *
 *   <AccessGate :content="movie" v-slot="{ play, locked }">
 *     <AppButton @click="play">รับชม</AppButton>
 *   </AccessGate>
 *
 * The slot receives the resolved access state so callers can show a
 * lock icon without duplicating the rules.
 */
const props = defineProps<{ content: ContentItem | Title | LiveStream }>()

const { checkAccess, requestPlay } = useAccessControl()

const state = computed(() => checkAccess(props.content))
const locked = computed(() => state.value !== 'allow')
const play = () => requestPlay(props.content)
</script>

<template>
  <slot :play="play" :state="state" :locked="locked" />
</template>
