<script setup lang="ts">
import { computed, ref } from 'vue';
import BaseDialog from '@/components/atoms/BaseDialog.vue';
import { useLibraryStore } from '@/stores/library';
import { storeToRefs } from 'pinia';

const libraryStore = useLibraryStore();
const { bookList } = storeToRefs(libraryStore);

const libraryRankingList = computed(() => {
  return bookList.value
    .filter((item) => item.click_count >= 0)
    .sort((a, b) => b.click_count - a.click_count)
    .slice(0, 100);
});

const isDialogOpen = ref(false);

const onPositiveClick = () => {
  const a = document.createElement('a');
  a.href = 'https://tpml.gov.taipei/Default.aspx';
  a.target = '_blank';
  a.click();
};

const onNegativeClick = () => {
  isDialogOpen.value = false;
};
</script>

<template>
  <div class="p-4">
    <div v-if="libraryRankingList.length">
      <div v-for="(item, index) in libraryRankingList" :key="index">
        <router-link :to="{ name: 'library-book-detail', params: { id: item.id } }" class="item">
          <div class="py-4 grid grid-cols-10 gap-2">
            <span class="flex items-center justify-center">{{ index + 1 }}</span>
            <div class="thumbnail col-span-2">
              <img :src="item.thumbnail" v-if="item.thumbnail" alt="thumbnail" />
              <div v-else class="bg-grey-100 w-full h-full"></div>
            </div>
            <div class="col-span-7 flex items-center">
              <div>
                <h5 class="ine-clamp-2 mb-1">{{ item.book_name }}</h5>
                <p class="text-grey-400">點閱次數：{{ item.click_count }}</p>
              </div>
            </div>
          </div>
        </router-link>
      </div>
    </div>
    <div v-else class="flex items-center justify-center mt-16">
      <div class="text-grey-400">
        <img
          src="@/assets/images/illustrations_no_data.svg"
          alt="illustrations_no_data"
          class="mx-auto"
        />
        <p class="text-center mb-2">目前無點閱排行</p>
      </div>
    </div>
  </div>

  <BaseDialog
    v-model="isDialogOpen"
    title="提醒"
    :content="'即將離開城市通\n前往台北市立圖書館官方網站'"
    :isAlert="true"
    positiveText="確認"
    negativeText="取消"
    @onPositiveClick="onPositiveClick"
    @onNegativeClick="onNegativeClick"
  />
</template>

<style lang="postcss" scoped></style>
