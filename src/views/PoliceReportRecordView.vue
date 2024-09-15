<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { storeToRefs } from 'pinia';
import { usePoliceReportStore } from '@/stores/policeReport';
import PoliceRecordDataJson from '../../public/mock/police_report_record.json';

const store = usePoliceReportStore();
const { policeRecord } = storeToRefs(store);

policeRecord.value = PoliceRecordDataJson.data;
</script>

<template>
  <div
    class="min-h-screen"
    :class="{
      'flex flex-col justify-center items-center': !policeRecord || !policeRecord.length
    }"
  >
    <ul v-if="policeRecord && policeRecord.length" class="p-4 flex flex-col gap-y-6">
      <li v-for="item in policeRecord" :key="item.id">
        <RouterLink
          :to="{ name: 'police-report-record-detail', params: { id: item.id } }"
          class="flex justify-between"
        >
          <div>
            <p class="text-grey-900 font-semibold">
              {{ item.title }}
            </p>
            <p class="text-gray-400 text-sm my-1">
              {{ item.id }}
            </p>
            <p class="text-gray-400 text-sm">報案類別：{{ item.type }}</p>
          </div>
          <div class="flex flex-col justify-center items-center">
            <span class="text-sm text-gray-900">{{ item.status }}</span>
          </div>
        </RouterLink>
      </li>
    </ul>
    <template v-else>
      <img src="@/assets/images/police-record-icon.svg" class="size-28" width="112" height="112" />
      <p class="text-primary-500 font-semibold text-2xl mt-1">無案件紀錄</p>
    </template>
  </div>
</template>
