<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { usePaymentStore } from '@/stores/payment';
import BaseDialog from '@/components/atoms/BaseDialog.vue';
import ServiceStep from '@/components/molecules/ServiceStep.vue';
import { useFeePaymentStore } from '@/stores/fee-payment';

const route = useRoute();
const router = useRouter();

const paymentStore = useFeePaymentStore();
const { paymentList, billList, paymentInfo } = storeToRefs(paymentStore);

const paymentItem = computed(() => {
  const concatenatedData = paymentList.value.flatMap((item) => item.data);
  return concatenatedData.find((item) => item.id === route.params.id)!;
});

const billIds = computed(() => {
  const list = (route.params.bill_id as string).split(',');
  return list;
});

const paymentResults = computed(() => {
  const list = billList.value.filter((item) => billIds.value.includes(item.id));
  return list;
});

const isPaymentConfirmDialogOpen = ref(false);

const onConfirmClick = () => {
  router.push({ name: 'fee-payment-finished', params: { id: paymentItem.value.id } });
};

const onWayClick = (way: string) => {
  isPaymentConfirmDialogOpen.value = true;
  paymentInfo.value.way = way;
  paymentInfo.value.total = paymentResults.value.reduce((total, item) => total + item.amount, 0);
};
</script>

<template>
  <div class="pt-14 pb-5">
    <section class="fixed top-0 left-0 z-30 w-screen bg-white p-4 flex justify-between">
      <button @click="router.back()">
        <img src="@/assets/images/down-icon.svg" class="rotate-90" />
      </button>
      <span class="font-bold text-gray-700">繳費方式</span>
      <div />
    </section>
    <div class="bg-grey-50 pt-4">
      <ServiceStep :activeStep="2" :stepCount="3" class="mx-4 mb-4" />
      <p class="font-medium text-grey-950 px-4">繳費項目</p>
      <ul class="bg-white p-4 mt-4 flex flex-col gap-y-6 text-grey-800">
        <li class="flex justify-between">
          <span> 繳費項目 </span>
          <span>
            {{ paymentItem.name }}
          </span>
        </li>
        <li class="flex justify-between">
          <span> 帳單總金額 </span>
          <span> ${{ paymentResults.reduce((total, item) => total + item.amount, 0) }} </span>
        </li>
        <li class="flex justify-between">
          <span> 行動支付優惠後 </span>
          <span> ${{ paymentResults.reduce((total, item) => total + item.amount, 0) }} </span>
        </li>
      </ul>
    </div>
    <div class="bg-grey-100 pt-4">
      <p class="font-medium text-grey-950 px-4 mb-4">請選擇繳費方式</p>
      <div class="bg-white p-4">
        <p class="text-grey-400 text-sm mb-4">常用</p>
        <div class="grid grid-cols-2 text-gray-800 gap-x-3 gap-y-2">
          <button
            class="rounded-md p-6 border border-gray-300 min-h-24"
            @click="onWayClick('台北富邦信用卡')"
          >
            <span>台北富邦信用卡</span>
          </button>
        </div>
        <p class="text-grey-400 text-sm my-4">所有繳費方式</p>
        <div class="grid grid-cols-2 text-gray-800 gap-x-3 gap-y-2">
          <button
            class="rounded-md p-6 border border-gray-300 min-h-24"
            @click="onWayClick('悠遊付')"
          >
            <span>悠遊付</span>
          </button>
          <button
            class="rounded-md p-6 border border-gray-300 min-h-24"
            @click="onWayClick('台北富邦信用卡')"
          >
            <span>台北富邦信用卡</span>
          </button>
          <button
            class="rounded-md p-6 border border-gray-300 min-h-24"
            @click="onWayClick('智慧支付平台')"
          >
            <span>智慧支付平台</span>
          </button>
        </div>
      </div>
    </div>
    <BaseDialog
      v-model="isPaymentConfirmDialogOpen"
      isAlert
      title="提醒"
      content="您即將進入支付業者付款頁面，請務必於 10 分鐘內完成繳費作業。繳費逾時，請重新查詢並繳費！！"
      positiveText="是"
      negativeText="否"
      @onPositiveClick="onConfirmClick"
    />
  </div>
</template>
