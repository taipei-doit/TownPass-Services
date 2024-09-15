<script setup lang="ts">
import { ref } from 'vue';
import BaseDialog from '@/components/atoms/BaseDialog.vue';
import { useLibraryStore } from '@/stores/library';
import { storeToRefs } from 'pinia';

export interface LibraryNoticeItem {
  id: string;
  date: string;
  title: string;
  description?: string;
  is_open_outer_link: boolean;
  outer_link?: string;
}

const libraryStore = useLibraryStore();
const { libraryNoticeList } = storeToRefs(libraryStore);

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
    <div v-if="libraryNoticeList.length">
      <div v-for="(item, index) in libraryNoticeList" :key="index">
        <template v-if="item.is_open_outer_link">
          <a :href="item.outer_link" target="_blank" rel="noopener noreferrer">
            <div class="py-4 border-b border-grey-200">
              <h5 class="ine-clamp-2 mb-1">{{ item.title }}</h5>
              <p class="text-grey-400 text-sm">
                {{ item.date }}
              </p>
            </div>
          </a>
        </template>
        <template v-else>
          <router-link
            :to="{ name: 'library-notice-detail', params: { id: item.id } }"
            class="item"
          >
            <div class="py-4 border-b border-grey-200">
              <h5 class="ine-clamp-2 mb-1">{{ item.title }}</h5>
              <p class="text-grey-400 text-sm">
                {{ item.date }}
              </p>
            </div>
          </router-link>
        </template>
      </div>
      <div class="text-center mb-4 mt-8">
        <div class="flex items-center justify-center mb-2">
          <img src="@/assets/images/info-icon.svg" alt="info-icon" />
          <p>已看完所有重要訊息</p>
        </div>
        <p class="text-sm">
          如需了解更多消息，請前往<a
            href="javascript:void(0)"
            class="underline"
            @click="isDialogOpen = true"
            >圖書館網站</a
          >
        </p>
      </div>
    </div>
    <div v-else class="flex items-center justify-center mt-16">
      <div class="text-grey-400">
        <img
          src="@/assets/images/illustrations_no_data.svg"
          alt="illustrations_no_data"
          class="mx-auto"
        />
        <p class="text-center mb-2">目前無重要訊息</p>
        <p class="text-sm">
          如需了解更多消息，請前往<a
            href="javascript:void(0)"
            class="underline"
            @click="isDialogOpen = true"
            >圖書館網站</a
          >
        </p>
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

<style lang="postcss"></style>
