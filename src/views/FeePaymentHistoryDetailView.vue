<script setup lang="ts">
import { computed } from 'vue';
import BaseSelect from '@/components/atoms/BaseSelect.vue';
import FixedTitleSection from '@/components/molecules/FixedTitleSection.vue';
import { useRoute } from 'vue-router';
import { useFeePaymentStore } from '@/stores/fee-payment';
import { storeToRefs } from 'pinia';
import type { PaymentHistory } from '@/interfaces/payment-history.interface';

const route = useRoute();
const paymentStore = useFeePaymentStore();
const { rawHistoryList } = storeToRefs(paymentStore);

const historyItem = computed(() => {
  return rawHistoryList.value.find((item) => item.id === route.params.id)!;
});

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份從0開始
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
};
</script>

<template>
  <FixedTitleSection title="帳單明細" class="py-4" />
  <div class="mt-20">
    <template v-if="historyItem.status === 'paid'">
      <div class="m-auto text-center">
        <img
          src="@/assets/images/icon_CaseAcceptDefault.svg"
          alt="icon-CaseAcceptDefault"
          class="mx-auto mb-3"
          width="40"
        />
        <p class="text-primary-500 text-2xl">繳費成功</p>
      </div>
    </template>
    <template v-if="historyItem.status === 'processing'">
      <div class="m-auto text-center">
        <img
          src="@/assets/images/icon_case-running-default.svg"
          alt="icon-case-running-default"
          class="mx-auto mb-3"
          width="40"
        />
        <p class="text-2xl">處理中</p>
      </div>
    </template>
    <template v-if="historyItem.status === 'failed'">
      <div class="m-auto text-center">
        <img
          src="@/assets/images/icon_bill-void-24.svg"
          alt="icon_bill-void-24"
          class="mx-auto mb-3"
          width="40"
        />
        <p class="text-warn-200 text-2xl">繳費失敗</p>
      </div>
    </template>
  </div>
  <hr class="my-8 w-[90%] mx-auto" />
  <ul class="bg-white p-4 mt-4 flex flex-col gap-y-6 text-grey-800">
    <li class="flex justify-between">
      <span> 繳費項目 </span>
      <span>
        {{ historyItem.payment_name }}
      </span>
    </li>
    <li class="flex justify-between">
      <span> 繳費編號 </span>
      <span>
        {{ historyItem.id }}
      </span>
    </li>
    <li class="flex justify-between">
      <span> 交易時間 </span>
      <span>
        {{ formatDate(historyItem.paid_at) }}
      </span>
    </li>
    <li class="flex justify-between items-center">
      <span> 交易金額 </span>
      <span class="text-primary-500 text-2xl font-bold"> NT${{ historyItem.amount }} </span>
    </li>
  </ul>
</template>

<style lang="postcss" scoped></style>
