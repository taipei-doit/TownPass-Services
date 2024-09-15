<script setup lang="ts">
import { ref, watch } from 'vue';
import { RouterLink } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useDisasterReportStore } from '@/stores/disasterReport';
import BaseInput from '@/components/atoms/BaseInput.vue';
import CollapseItem from '@/components/molecules/CollapseItem.vue';
import disasterReportingJson from '../../public/mock/disaster_reporting.json';
import type { disasterReportData } from '@/stores/disasterReport';

const store = useDisasterReportStore();
const { disasterReport } = storeToRefs(store);

disasterReport.value = disasterReportingJson.data;

const activeList = ref<disasterReportData[]>();

activeList.value = disasterReport.value;

const unwatch = watch(disasterReport, () => {
  activeList.value = disasterReport.value;

  unwatch();
});

const activeCategory = ref('');

const searchText = ref('');

const onSearchClick = () => {
  if (!disasterReport.value) {
    return;
  }

  if (searchText.value) {
    activeList.value = disasterReport.value.filter((item) => item.name.includes(searchText.value));
  } else {
    activeList.value = disasterReport.value;
  }
};
</script>

<template>
  <div class="flex flex-col min-h-screen pt-3">
    <div class="flex mb-2 px-4">
      <BaseInput v-model="searchText" placeholder="您遇到哪些問題?" class="flex-grow" />
      <button class="search-button" @click="onSearchClick">
        <img src="@/assets/images/search-icon.svg" alt="搜尋" />
      </button>
    </div>
    <div
      v-if="activeList?.length"
      class="flex-grow px-4 py-3"
      :class="{ 'bg-grey-100': activeCategory }"
    >
      <ul class="flex flex-col gap-y-5">
        <CollapseItem
          v-model="activeCategory"
          v-for="item in activeList"
          :key="item.id"
          :item="item"
        >
          <template #default="{ item }">
            <RouterLink
              v-for="option in item.options"
              :key="option.id"
              :to="{ name: 'disaster-report-form', params: { id: option.id } }"
              class="pl-6 text-sm"
            >
              {{ option.name }}
            </RouterLink>
          </template>
        </CollapseItem>
      </ul>
    </div>
    <div v-else class="flex-grow flex flex-col justify-center items-center">
      <img src="@/assets/images/img-info.svg" class="w-36" />
      <p class="text-primary-500 font-semibold text-2xl">無搜尋結果</p>
      <p class="text-gray-400 text-sm mt-2 font-semibold">請重新搜尋關鍵字</p>
    </div>
  </div>
</template>
