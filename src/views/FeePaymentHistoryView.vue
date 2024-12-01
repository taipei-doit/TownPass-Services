<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import BaseSelect from '@/components/atoms/BaseSelect.vue';
import FixedTitleSection from '@/components/molecules/FixedTitleSection.vue';
import { useRoute } from 'vue-router';
import { useFeePaymentStore } from '@/stores/fee-payment';
import { storeToRefs } from 'pinia';
import type { PaymentHistory } from '@/interfaces/payment-history.interface';

const route = useRoute();
const paymentStore = useFeePaymentStore();
const { rawHistoryList } = storeToRefs(paymentStore);

const payHistoryList = ref<
  {
    month: string;
    data: PaymentHistory[];
  }[]
>([]);

const searchYear = ref('1');
const searchType = ref('all');
const searchStatus = ref('all');

const yearOptions = ref([
  {
    label: '近1年',
    value: '1'
  },
  {
    label: '近2年',
    value: '2'
  },
  {
    label: '近3年',
    value: '3'
  }
]);

const typeOptions = ref([
  {
    label: '所有項目',
    value: 'all'
  },
  {
    label: '停車費',
    value: 'fee-5'
  },
  {
    label: '公訓處自費課程',
    value: 'fee-11'
  }
]);

const statusOptions = ref([
  {
    label: '所有狀態',
    value: 'all'
  },
  {
    label: '成功',
    value: 'paid'
  },
  {
    label: '處理中',
    value: 'processing'
  },
  {
    label: '失敗',
    value: 'failed'
  }
]);

onMounted(() => {
  getPaymentHistoryList();
});

const getPaymentHistoryList = () => {
  // clear
  payHistoryList.value = [];

  // 介接取得歷史紀錄 API
  const currentYear = new Date().getFullYear();
  const yearLimit = currentYear - Number(searchYear.value) + 1;

  console.log('currentYear:', currentYear);
  console.log('yearLimit:', yearLimit);

  // 根據條件篩選數據
  const filteredData = rawHistoryList.value.filter((item: PaymentHistory) => {
    const paidYear = new Date(item.paid_at).getFullYear();

    // 近一年、兩年、三年或全部
    if (yearLimit && paidYear < yearLimit) return false;

    // 搜尋項目 (可自定義搜索項目，如 payment_id)
    if (
      searchType.value !== 'all' &&
      searchType.value &&
      !item.payment_id.includes(searchType.value)
    ) {
      return false;
    }

    // 搜尋狀態
    if (searchStatus.value !== 'all' && searchStatus.value && item.status !== searchStatus.value) {
      return false;
    }

    return true;
  });

  console.log('filteredData:', filteredData);

  const rawData = filteredData;
  const groupedData: any = {};

  rawData.forEach((item: PaymentHistory) => {
    const year = new Date(item.paid_at).getFullYear();
    const month = new Date(item.paid_at).getMonth() + 1;
    const key = `${year}年${month}月`;

    const existingMonthRecord = payHistoryList.value.find((item) => item.month === key);

    if (existingMonthRecord) {
      existingMonthRecord.data.push(item);
    } else {
      payHistoryList.value.push({
        month: key,
        data: [item]
      });
    }
  });

  const groupedArray = Object.entries(groupedData)
    .map(([key, value]) => ({
      month: key,
      data: value
    }))
    .reverse() as {
    month: string;
    data: PaymentHistory[];
  }[];

  // 将新数据追加到现有数据数组中
  payHistoryList.value.push(...groupedArray);
};

watch([searchYear, searchType, searchStatus], () => {
  getPaymentHistoryList();
});
</script>

<template>
  <FixedTitleSection title="繳費紀錄" class="py-4" />
  <div class="mt-14">
    <div class="flex">
      <BaseSelect
        v-model="searchYear"
        :selectId="'1'"
        :options="yearOptions"
        class="w-full !bg-white !pr-4"
      />
      <BaseSelect
        v-model="searchType"
        :selectId="'all'"
        :options="typeOptions"
        class="w-full !bg-white !pr-4"
      />
      <BaseSelect
        v-model="searchStatus"
        :selectId="'all'"
        :options="statusOptions"
        class="w-full !bg-white !pr-4"
      />
    </div>
    <template v-if="payHistoryList.length">
      <div class="bg-white my-4 pb-5" v-for="(item, index) in payHistoryList" :key="index">
        <p class="p-5 border-b border-gray-300">
          {{ item.month }}
        </p>
        <div v-for="(childrenItem, cheildrenIndex) in item.data" :key="cheildrenIndex">
          <router-link
            :to="{ name: 'fee-payment-history-detail', params: { id: childrenItem.id } }"
          >
            <div class="flex">
              <div
                class="text-center text-gray-500 p-5 border-r border-b border-gray-300 flex items-center w-[82px]"
              >
                <p class="mx-auto">{{ new Date(childrenItem.paid_at).getDate() }}日</p>
              </div>
              <div
                class="p-3 border-r border-b border-gray-300 flex-1 flex justify-between items-center"
              >
                <div class="relative">
                  <p>{{ childrenItem.payment_name }}</p>
                  <p class="text-grey-400">{{ childrenItem.id }}</p>
                  <p>$ {{ childrenItem.amount }}</p>
                </div>
                <template v-if="childrenItem.status === 'paid'">
                  <div class="text-center w-[50px]">
                    <img
                      src="@/assets/images/icon_CaseAcceptDefault.svg"
                      alt="icon-CaseAcceptDefault"
                      class="mx-auto"
                    />
                    <p class="text-primary-500">成功</p>
                  </div>
                </template>
                <template v-if="childrenItem.status === 'processing'">
                  <div class="text-center w-[50px]">
                    <img
                      src="@/assets/images/icon_case-running-default.svg"
                      alt="icon-case-running-default"
                      class="mx-auto"
                    />
                    <p>處理中</p>
                  </div>
                </template>
                <template v-if="childrenItem.status === 'failed'">
                  <div class="text-center w-[50px]">
                    <img
                      src="@/assets/images/icon_bill-void-24.svg"
                      alt="icon_bill-void-24"
                      class="mx-auto"
                    />
                    <p class="text-warn-200">失敗</p>
                  </div>
                </template>
              </div>
            </div>
          </router-link>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="mt-40">
        <img src="@/assets/images/illustrations_no_data.svg" class="mx-auto" alt="nodata-icon" />
        <p class="text-center text-lg font-bold text-primary-500 mt-2">無紀錄</p>
        <p class="text-center text-sm text-grey-400">目前無繳費紀錄</p>
      </div>
    </template>
  </div>
</template>

<style lang="postcss">
.search-bar {
  @apply flex items-center;
  @apply rounded-lg bg-gray-100 text-grey-400;
  @apply p-2.5;
}
</style>
