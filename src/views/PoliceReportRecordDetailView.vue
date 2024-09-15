<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import { usePoliceReportStore } from '@/stores/policeReport';
import FixedTitleSection from '@/components/molecules/FixedTitleSection.vue';
import ServiceTabsView from '@/components/organisms/ServiceTabsView.vue';

const route = useRoute();

const store = usePoliceReportStore();
const { policeRecordMap } = storeToRefs(store);

const record = computed(() => policeRecordMap.value.get(route.params.id as string));

const tabList = [
  {
    id: 1,
    title: '回覆'
  },
  {
    id: 2,
    title: '詳細內容'
  }
];

const activeTab = ref(0);
</script>

<template>
  <div class="pt-12">
    <FixedTitleSection title="案件查詢" />
    <ServiceTabsView v-model="activeTab" :tab-list="tabList">
      <template #tab0>
        <div class="bg-gray-100 min-h-[calc(100vh-83px)]">
          <div class="p-4">
            <span
              class="font-semibold"
              :class="{ 'text-primary-500': record?.status === '已結案' }"
            >
              {{ record?.status }}
            </span>
          </div>
          <div v-if="record?.reply" class="p-4 bg-white text-gray-900">
            <p class="font-semibold">回覆來自</p>
            <p class="mt-1">{{ record?.reply.from }}</p>
            <p>{{ record?.reply?.time }}</p>
            <p class="font-semibold mt-4">處理狀態</p>
            <p class="mt-1">{{ record?.reply.status }}</p>
          </div>
        </div>
      </template>
      <template #tab1>
        <div class="bg-gray-100 min-h-[calc(100vh-83px)]">
          <div class="p-4">
            <span
              class="font-semibold"
              :class="{ 'text-primary-500': record?.status === '已結案' }"
            >
              {{ record?.status }}
            </span>
          </div>
          <div class="p-4 bg-white text-gray-900">
            <p class="font-semibold">報案人類別</p>
            <p class="mt-1">{{ record?.type }}</p>
          </div>
          <p class="p-4 font-semibold text-primary-500">案件資訊</p>
          <ul class="flex flex-col gap-y-6 p-4 bg-white text-gray-900">
            <li>
              <p class="font-semibold">編號</p>
              <p class="mt-1">{{ record?.id }}</p>
            </li>
            <li>
              <p class="font-semibold">受理時間</p>
              <p class="mt-1">{{ record?.time_of_acceptance }}</p>
            </li>
            <li>
              <p class="font-semibold">發生日期</p>
              <p class="mt-1">{{ record?.date_of_occurrence }}</p>
            </li>
            <li>
              <p class="font-semibold">發生時間</p>
              <p class="mt-1">{{ record?.time_of_occurrence }}</p>
            </li>
            <li>
              <p class="font-semibold">發生地點</p>
              <p class="mt-1">{{ record?.location_of_occurrence }}</p>
            </li>
          </ul>
          <p class="p-4 font-semibold text-primary-500">具體內容</p>
          <div class="p-4 bg-white text-gray-900">
            <p>{{ record?.content }}</p>
          </div>
        </div>
      </template>
    </ServiceTabsView>
  </div>
</template>
