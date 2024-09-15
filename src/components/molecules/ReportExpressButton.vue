<script setup lang="ts">
import { RouterLink } from 'vue-router';
const props = defineProps<{
  title: string;
  id: string;
  icon?: string;
}>();
</script>

<template>
  <RouterLink
    :to="{ name: 'citizen-report-form', params: { id: props.id } }"
    class="report-express-button"
  >
    <img :src="props.icon" width="24" height="24" class="size-6" :alt="props.title" />
    <span class="mt-1">{{ props.title }}</span>
  </RouterLink>
</template>

<style lang="postcss">
.report-express-button {
  @apply flex flex-col justify-center items-center;
  @apply bg-white text-center;
  @apply rounded-lg border border-grey-200;
  @apply p-3 size-full text-sm;
}
</style>
