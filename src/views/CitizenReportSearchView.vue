<script setup lang="ts">
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useCitizenReportStore } from '@/stores/citizenReport';
import FixedTitleSection from '@/components/molecules/FixedTitleSection.vue';
import BaseInput from '@/components/atoms/BaseInput.vue';

const store = useCitizenReportStore();

const { concatData } = storeToRefs(store);

const isFirstSearch = ref(false);

const searchText = ref('');

const searchTarget = ref<{ id: string; name: string }[]>();

const onSearchClick = () => {
  if (!isFirstSearch.value) {
    isFirstSearch.value = true;
  }

  if (!searchText.value) {
    return;
  }

  searchTarget.value = concatData.value.filter((item) => item.name.includes(searchText.value));
};
</script>

<template>
  <div class="pt-12 px-4">
    <FixedTitleSection title="有話要說" />
    <div class="flex mt-2">
      <BaseInput v-model="searchText" placeholder="您遇到哪些問題?" class="flex-grow" />
      <button class="search-button" @click="onSearchClick">
        <img src="@/assets/images/search-icon.svg" alt="搜尋" />
      </button>
    </div>
    <div
      v-if="isFirstSearch && !searchTarget?.length"
      class="flex flex-col justify-center items-center pt-40"
    >
      <img src="@/assets/images/img-info.svg" class="w-36" />
      <p class="text-primary-500 font-semibold text-2xl">無符合搜尋結果</p>
      <p class="text-gray-400 text-sm mt-2 font-semibold">請試試其他關鍵字或篩選分類</p>
    </div>
    <ul v-else class="mt-5 flex flex-col gap-y-3">
      <li v-for="item in searchTarget" :key="item.id">
        <RouterLink :to="{ name: 'citizen-report-form', params: { id: item.id } }">
          {{ item.name }}
        </RouterLink>
      </li>
    </ul>
  </div>
</template>
