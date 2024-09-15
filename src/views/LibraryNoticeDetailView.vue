<script setup lang="ts">
import { computed, ref } from 'vue';
import BaseDialog from '@/components/atoms/BaseDialog.vue';
import { useLibraryStore } from '@/stores/library';
import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router';

const route = useRoute();

const libraryStore = useLibraryStore();
const { libraryNoticeList } = storeToRefs(libraryStore);

const noticeItem = computed(
  () => libraryNoticeList.value.find((item) => item.id === route.params.id)!
);
</script>

<template>
  <div class="h-screen px-5 py-8 bg-grey-50 overflow-y-auto">
    <p class="mb-4 text-grey-400 text-right">{{ noticeItem.date }}</p>
    <p class="mb-2 font-bold text-lg">{{ noticeItem.title }}</p>
    <p
      :innerHTML="noticeItem.description"
      class="break-words whitespace-pre-line item-description"
    ></p>
  </div>
</template>

<style lang="postcss">
.item-description a {
  @apply text-primary-500;
}
</style>
