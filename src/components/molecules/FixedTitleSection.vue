<script setup lang="ts">
import { useRouter } from 'vue-router';

const props = defineProps<{
  title: string;
}>();

const router = useRouter();
</script>

<template>
  <section class="fixed top-0 left-0 z-10 w-screen bg-white pt-4 px-4">
    <div class="text-center">
      <button @click="router.back()" class="absolute left-[10px]">
        <img src="@/assets/images/down-icon.svg" class="rotate-90" />
      </button>
      <span class="font-bold text-gray-700">{{ props.title }}</span>
      <div />
    </div>
    <slot />
  </section>
</template>
