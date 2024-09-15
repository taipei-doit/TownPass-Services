<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { usePaymentStore } from '@/stores/payment';
import BaseDialog from '@/components/atoms/BaseDialog.vue';
import ServiceStep from '@/components/molecules/ServiceStep.vue';

const router = useRouter();

const store = usePaymentStore();

const { paymentInfo } = storeToRefs(store);

const isPaymentConfirmDialogOpen = ref(false);

const onConfirmClick = () => {
  router.push({
    name: 'payment-finished'
  });
};

const onWayClick = (way: string) => {
  isPaymentConfirmDialogOpen.value = true;
  paymentInfo.value.way = way;
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
      <p class="font-medium text-grey-950 px-4">訂購項目</p>
      <ul class="bg-white p-4 mt-4 flex flex-col gap-y-6 text-grey-800">
        <li class="flex justify-between">
          <span> 票券名稱 </span>
          <span>
            {{ paymentInfo.ticketName }}
          </span>
        </li>
        <li class="flex justify-between">
          <span> 繳費截止 </span>
          <span> 2024-11-11 14:17:34 </span>
        </li>
        <li class="flex justify-between">
          <span> 總金額 </span>
          <span> ${{ paymentInfo.total }} </span>
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
