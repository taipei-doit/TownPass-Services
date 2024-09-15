<script setup lang="ts">
import { computed, ref, watchEffect, watch } from 'vue';
import { RouterLink } from 'vue-router';
import { storeToRefs } from 'pinia';
import { getUnixTime, isAfter, isBefore, isEqual } from 'date-fns';
import { DatePicker } from 'v-calendar';
import 'v-calendar/style.css';
import { useCitizenReportStore } from '@/stores/citizenReport';
import { useConnectionMessage } from '@/composables/useConnectionMessage';
import BaseInput from '@/components/atoms/BaseInput.vue';
import ServiceTabs from '@/components/molecules/ServiceTabs.vue';
import ServiceTabsView from '@/components/organisms/ServiceTabsView.vue';
import ReportExpressButton from '@/components/molecules/ReportExpressButton.vue';
import citizenReportDataJson from '../../public/mock/citizen_report.json';
import citizenResultDataJson from '../../public/mock/citizen_result.json';

const store = useCitizenReportStore();

const { citizenReport, citizenResult } = storeToRefs(store);

citizenReport.value = citizenReportDataJson.data;
citizenResult.value = citizenResultDataJson.data;

const tabList = [
  {
    id: 1,
    title: '通報'
  },
  {
    id: 2,
    title: '查詢'
  }
];

const activeTab = ref(0);

const onServicePhoneClick = () => {
  useConnectionMessage('1999agree', null);
};

const resultTabList = [
  {
    id: 1,
    title: '有話要說'
  },
  {
    id: 2,
    title: '災情通報'
  }
];

const activeResultTab = ref(0);

const resultSearchText = ref('');

const resultSearchDate = ref<{ start: Date; end: Date }>();

const activeResultList = computed(() => {
  if (citizenResult.value) {
    return activeResultTab.value === 0
      ? citizenResult.value['citizen']
      : citizenResult.value.disaster;
  } else {
    return [];
  }
});

const resultSearchList = ref<
  {
    id: string;
    title: string;
    date: string;
    status: string;
  }[]
>([]);

watchEffect(() => {
  resultSearchList.value = activeResultList.value;
});

watch(activeResultTab, () => {
  resultSearchText.value = '';
  resultSearchDate.value = undefined;
});

const onSearchButtonClick = () => {
  if (!resultSearchText.value) {
    resultSearchList.value = activeResultList.value;
    resultSearchDate.value = undefined;
    return;
  }

  resultSearchList.value = resultSearchList.value.filter(
    (item) =>
      item.title.includes(resultSearchText.value) || item.id.includes(resultSearchText.value)
  );
};

watch(
  () => resultSearchDate,
  () => {
    if (resultSearchDate.value && resultSearchDate.value.start && resultSearchDate.value.end) {
      const targetList = resultSearchText.value ? resultSearchList.value : activeResultList.value;
      resultSearchList.value = targetList.filter((item) => {
        const timestamp = getUnixTime(new Date(item.date));

        return (
          (resultSearchDate.value &&
            isAfter(timestamp, getUnixTime(resultSearchDate.value.start)) &&
            isBefore(timestamp, getUnixTime(resultSearchDate.value.end))) ||
          (resultSearchDate.value &&
            isEqual(timestamp, getUnixTime(resultSearchDate.value.start))) ||
          (resultSearchDate.value && isEqual(timestamp, getUnixTime(resultSearchDate.value.end)))
        );
      });
    }
  },
  { deep: true }
);
</script>

<template>
  <div>
    <ServiceTabsView v-model="activeTab" :tab-list="tabList">
      <template #tab0>
        <div class="bg-grey-100 pt-[18px] px-4 min-h-[calc(100vh-43px)] pb-4">
          <p class="text-grey-700 font-semibold">選擇要通報項目</p>
          <div class="my-3">
            <RouterLink :to="{ name: 'citizen-report-search' }" class="flex">
              <BaseInput readonly placeholder="您遇到哪些問題?" class="flex-grow" />
              <button class="search-button">
                <img src="@/assets/images/search-icon.svg" alt="搜尋" />
              </button>
            </RouterLink>
          </div>
          <ul v-if="citizenReport" class="grid grid-cols-2 gap-x-3 gap-y-2">
            <li v-for="item in citizenReport.hot_report" :key="item.id">
              <ReportExpressButton :title="item.name" :id="item.id" :icon="item.icon" />
            </li>
          </ul>
          <RouterLink
            :to="{ name: 'citizen-report-list' }"
            class="flex justify-center items-center bg-white rounded-lg border border-grey-200 mt-4 py-4 text-sm"
          >
            <img src="@/assets/images/other-icon.svg" width="20" height="20" class="size-5 mr-2" />
            <span>更多項目</span>
          </RouterLink>
          <p class="text-grey-700 font-semibold mt-1 mb-2">語音通報</p>
          <button
            class="flex justify-center items-center bg-white rounded-lg border border-grey-200 py-4 text-sm w-full"
            @click="onServicePhoneClick"
          >
            <img src="@/assets/images/icon_tel.svg" width="20" height="20" class="size-5 mr-2" />
            <span>撥打1999專線</span>
          </button>
        </div>
      </template>
      <template #tab1>
        <div class="p-4">
          <ServiceTabs v-model="activeResultTab" :tab-list="resultTabList" :contentType="true" />
          <div class="mt-3 flex gap-x-2">
            <div v-show="activeResultTab === 0" class="flex flex-grow">
              <BaseInput
                v-model="resultSearchText"
                placeholder="搜尋案號關鍵字"
                class="flex-grow"
              />
              <button class="search-button" @click="onSearchButtonClick">
                <img src="@/assets/images/search-icon.svg" alt="搜尋" />
              </button>
            </div>
            <DatePicker v-if="activeResultTab === 0" v-model.range="resultSearchDate">
              <template #default="{ togglePopover }">
                <button class="search-button" @click="togglePopover">
                  <img src="@/assets/images/calendar-white-icon.svg" width="24" height="24" />
                </button>
              </template>
            </DatePicker>
            <DatePicker v-else v-model.range="resultSearchDate">
              <template #default="{ inputValue, togglePopover }">
                <BaseInput
                  :model-value="inputValue.start ? `${inputValue.start} - ${inputValue.end}` : ''"
                  placeholder="日期篩選"
                  readonly
                  class="flex-grow"
                />
                <button class="search-button" @click="togglePopover">
                  <img src="@/assets/images/calendar-white-icon.svg" width="24" height="24" />
                </button>
              </template>
            </DatePicker>
          </div>
          <div class="flex justify-end pr-1 mt-1">
            <span class="text-sm text-grey-700 font-semibold">
              共{{ resultSearchList.length }}筆
            </span>
          </div>
          <ul v-if="resultSearchList.length" class="mt-10 flex flex-col gap-y-3">
            <li v-for="item in resultSearchList" :key="item.id">
              <RouterLink
                :to="{ name: 'citizen-report-search-detail', params: { id: item.id } }"
                class="flex items-center justify-between"
              >
                <div class="flex flex-col gap-y-1">
                  <span class="text-grey-700 font-semibold">{{ item.title }}</span>
                  <span class="text-sm text-grey-500">{{ item.id }}</span>
                  <p class="text-sm text-grey-500">
                    <span>通報日期：</span>
                    <span>{{ item.date }}</span>
                  </p>
                </div>
                <div class="flex flex-col items-center justify-center">
                  <img
                    v-if="item.status === '處理完成'"
                    src="@/assets/images/icon-status-checked.svg"
                    class="size-6"
                    width="24"
                    height="24"
                  />
                  <img
                    v-else
                    src="@/assets/images/rule-icon.svg"
                    class="size-6"
                    width="24"
                    height="24"
                  />
                  <span
                    class="text-sm font-semibold"
                    :class="{ 'text-primary-500': item.status === '處理完成' }"
                  >
                    {{ item.status }}
                  </span>
                </div>
              </RouterLink>
            </li>
          </ul>
          <div v-else class="mt-14 flex flex-col items-center justify-center">
            <img src="@/assets/images/img-info.svg" />
            <p class="text-primary-500 font-bold text-xl">無紀錄</p>
          </div>
        </div>
      </template>
    </ServiceTabsView>
  </div>
</template>
