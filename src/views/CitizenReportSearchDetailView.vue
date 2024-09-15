<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import FixedTitleSection from '@/components/molecules/FixedTitleSection.vue';
import ServiceTabsView from '@/components/organisms/ServiceTabsView.vue';
import citizenSearchDetailDataJson from '../../public/mock/citizen_search_detail.json';

// 用 id 去撈詳細資料，先用 mock data 示範
const route = useRoute();
console.log('id:', route.params.id);

const detailData = citizenSearchDetailDataJson.data;

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
        <div class="bg-grey-100 p-4 flex items-center gap-x-2">
          <img
            v-if="detailData.status === '處理完成'"
            src="@/assets/images/icon-status-checked-default.svg"
            class="size-5"
            width="20"
            height="20"
          />
          <img v-else src="@/assets/images/rule-icon.svg" class="size-5" width="20" height="20" />
          <span class="text-lg">
            {{ detailData.status }}
          </span>
        </div>
        <div v-if="detailData.reply.from && detailData.reply.from.agency" class="p-4">
          <p class="font-bold">回覆來自</p>
          <p class="my-1 font-medium">{{ detailData.reply.from.agency }}</p>
          <p class="text-sm text-grey-500">{{ detailData.reply.from.date }}</p>
          <div class="mt-8">
            <p class="font-bold mb-4">辦理狀態</p>
            <span>回覆內容：</span>
            <p class="mt-0.5">
              {{ detailData.reply.content }}
            </p>
          </div>
        </div>
      </template>
      <template #tab1>
        <div class="bg-grey-100 p-4 flex items-center gap-x-2">
          <img
            v-if="detailData.status === '處理完成'"
            src="@/assets/images/icon-status-checked-default.svg"
            class="size-5"
            width="20"
            height="20"
          />
          <img v-else src="@/assets/images/rule-icon.svg" class="size-5" width="20" height="20" />
          <span class="text-lg">
            {{ detailData.status }}
          </span>
        </div>
        <div v-if="detailData.detail && detailData.detail.case_id">
          <div class="p-4">
            <p class="font-bold">案件主旨</p>
            <p class="mt-2">{{ detailData.detail.case_title }}</p>
          </div>
          <div class="p-4 bg-grey-100">
            <p class="font-bold text-primary-500">案件資訊</p>
          </div>
          <div class="p-4">
            <p class="font-bold">案件編號</p>
            <p class="mt-2">{{ detailData.detail.case_id }}</p>
          </div>
          <div class="p-4">
            <p class="font-bold">受理時間</p>
            <p class="mt-2">{{ detailData.detail.acceptance_time }}</p>
          </div>
          <div class="p-4">
            <p class="font-bold">案件分類</p>
            <p class="mt-2">{{ detailData.detail.category }}</p>
          </div>
          <div class="p-4 bg-grey-100">
            <p class="font-bold text-primary-500">案件狀態</p>
          </div>
          <div class="p-4">
            <p class="font-bold">辦理機關</p>
            <p class="mt-2">{{ detailData.detail.agency }}</p>
          </div>
          <div class="p-4">
            <p class="font-bold">預計完成</p>
            <p class="mt-2">{{ detailData.detail.expected_time }}</p>
          </div>
          <div class="p-4">
            <p class="font-bold">實際完成</p>
            <p class="mt-2">{{ detailData.detail.actual_time }}</p>
          </div>
          <div class="p-4 bg-grey-100">
            <p class="font-bold text-primary-500">具體內容</p>
          </div>
          <div class="p-4">
            <p class="font-bold">具體內容</p>
            <p class="mt-2">{{ detailData.detail.content }}</p>
          </div>
        </div>
      </template>
    </ServiceTabsView>
  </div>
</template>
