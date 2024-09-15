<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import MessageModal from '@/components/molecules/MessageModal.vue';
import BaseButton from '@/components/atoms/BaseButton.vue';
import ServiceStep from '@/components/molecules/ServiceStep.vue';
import { usePaymentStore } from '@/stores/payment';

const router = useRouter();

const store = usePaymentStore();

const { paymentInfo } = storeToRefs(store);

store.reset();

const ticketCounts = reactive({
  adult: 0,
  concession: 0,
  citizen: 0,
  group: 0
});

const totalPrice = computed(
  () =>
    ticketCounts.adult * 100 +
    ticketCounts.concession * 50 +
    ticketCounts.citizen * 50 +
    ticketCounts.group * 70
);

const isUsagePeriodInformationModalOpen = ref(false);

const onPaymentButtonClick = () => {
  paymentInfo.value.adult = ticketCounts.adult;
  paymentInfo.value.concession = ticketCounts.concession;
  paymentInfo.value.citizen = ticketCounts.citizen;
  paymentInfo.value.group = ticketCounts.group;
  paymentInfo.value.total = totalPrice.value;
  paymentInfo.value.ticketName = '掘光而行：洪瑞麟';

  router.push({
    name: 'ticket-payment'
  });
};
</script>

<template>
  <div class="pt-10 pb-32">
    <section class="fixed top-0 left-0 z-30 w-screen bg-white p-4 flex justify-between">
      <button @click="router.back()">
        <img src="@/assets/images/down-icon.svg" class="rotate-90" />
      </button>
      <span class="font-bold text-gray-700">購票</span>
      <div />
    </section>
    <div class="bg-grey-50 pt-10 px-4 pb-3">
      <ServiceStep :activeStep="1" :stepCount="3" />
      <div class="mt-6 mb-4 flex">
        <img
          src="@/assets/images/buy-ticket-demo.jpg"
          class="object-cover size-20"
          width="80"
          height="80"
        />
        <p class="ml-4 text-grey-950 font-medium text-2xl">掘光而行：洪瑞麟</p>
      </div>
      <div class="flex items-end">
        <img src="@/assets/images/calendar-icon.svg" />
        <p class="text-sm ml-2 text-grey-700">活動時間：2024/01/01 ~ 2024/12/31</p>
      </div>
      <p class="text-grey-800 font-medium mt-8">請選擇票種與數量</p>
    </div>
    <div class="px-4 pt-4">
      <ul class="flex flex-col pb-3 gap-y-6 border-b border-b-grey-100">
        <li class="flex justify-between">
          <div class="flex flex-col font-medium text-grey-900">
            <span>全票</span>
            <span>NT$100</span>
          </div>
          <div class="flex items-center">
            <button
              class="size-6 rounded-full text-2xl text-white bg-primary-500 flex justify-center items-center pb-1"
              :disabled="ticketCounts.adult === 0"
              :class="{ '!bg-grey-200': ticketCounts.adult === 0 }"
              @click="ticketCounts.adult--"
            >
              -
            </button>
            <div
              class="w-16 h-12 bg-grey-100 border border-grey-300 rounded-lg mx-5 flex justify-center items-center"
            >
              {{ ticketCounts.adult }}
            </div>
            <button
              class="size-6 rounded-full text-2xl text-white bg-primary-500 flex justify-center items-center pb-1"
              @click="ticketCounts.adult++"
            >
              +
            </button>
          </div>
        </li>
        <li class="flex justify-between">
          <div class="flex flex-col font-medium text-grey-900">
            <span>優待票</span>
            <span>NT$50</span>
          </div>
          <div class="flex items-center">
            <button
              class="size-6 rounded-full text-2xl text-white bg-primary-500 flex justify-center items-center pb-1"
              :disabled="ticketCounts.concession === 0"
              :class="{ '!bg-grey-200': ticketCounts.concession === 0 }"
              @click="ticketCounts.concession--"
            >
              -
            </button>
            <div
              class="w-16 h-12 bg-grey-100 border border-grey-300 rounded-lg mx-5 flex justify-center items-center"
            >
              {{ ticketCounts.concession }}
            </div>
            <button
              class="size-6 rounded-full text-2xl text-white bg-primary-500 flex justify-center items-center pb-1"
              @click="ticketCounts.concession++"
            >
              +
            </button>
          </div>
        </li>
        <li class="flex justify-between">
          <div class="flex flex-col font-medium text-grey-900">
            <span>台北市民票</span>
            <span>NT$50</span>
          </div>
          <div class="flex items-center">
            <button
              class="size-6 rounded-full text-2xl text-white bg-primary-500 flex justify-center items-center pb-1"
              :disabled="ticketCounts.citizen === 0"
              :class="{ '!bg-grey-200': ticketCounts.citizen === 0 }"
              @click="ticketCounts.citizen--"
            >
              -
            </button>
            <div
              class="w-16 h-12 bg-grey-100 border border-grey-300 rounded-lg mx-5 flex justify-center items-center"
            >
              {{ ticketCounts.citizen }}
            </div>
            <button
              class="size-6 rounded-full text-2xl text-white bg-primary-500 flex justify-center items-center pb-1"
              @click="ticketCounts.citizen++"
            >
              +
            </button>
          </div>
        </li>
        <li class="flex justify-between">
          <div class="flex flex-col font-medium text-grey-900">
            <span>團體票</span>
            <span>NT$70</span>
          </div>
          <div class="flex items-center">
            <button
              class="size-6 rounded-full text-2xl text-white bg-primary-500 flex justify-center items-center pb-1"
              :disabled="ticketCounts.group === 0"
              :class="{ '!bg-grey-200': ticketCounts.group === 0 }"
              @click="ticketCounts.group--"
            >
              -
            </button>
            <div
              class="w-16 h-12 bg-grey-100 border border-grey-300 rounded-lg mx-5 flex justify-center items-center"
            >
              {{ ticketCounts.group }}
            </div>
            <button
              class="size-6 rounded-full text-2xl text-white bg-primary-500 flex justify-center items-center pb-1"
              @click="ticketCounts.group++"
            >
              +
            </button>
          </div>
        </li>
      </ul>
      <button
        class="flex items-center mx-auto mt-4 text-primary-500"
        @click="isUsagePeriodInformationModalOpen = true"
      >
        <img src="@/assets/images/info-icon-primary.svg" class="mr-1" width="20" height="20" />
        使用時段說明
      </button>
    </div>
    <div class="fixed w-full bg-white bottom-0 left-0 p-4 shadow-card">
      <div class="flex items-center justify-between">
        <p class="text-grey-950">
          共
          {{
            ticketCounts.adult + ticketCounts.citizen + ticketCounts.concession + ticketCounts.group
          }}
          張，總金額
        </p>
        <span class="text-primary-500 font-semibold text-2xl">${{ totalPrice }}</span>
      </div>
      <BaseButton :disabled="totalPrice === 0" class="w-full mt-1" @click="onPaymentButtonClick">
        前往付款
      </BaseButton>
    </div>
    <MessageModal :is-show="isUsagePeriodInformationModalOpen">
      <template #header>
        <p class="text-2xl text-grey-900 font-medium">使用時段說明</p>
      </template>
      <template #body>
        <ul class="text-left flex flex-col gap-y-4">
          <li>
            <p class="mb-1">全票</p>
            <p>2024/01/01 ~ 2024/12/31</p>
          </li>
          <li>
            <p class="mb-1">優待票</p>
            <p>2024/01/01 ~ 2024/12/31</p>
          </li>
          <li>
            <p class="mb-1">台北市民票</p>
            <p>2024/01/01 ~ 2024/12/31</p>
          </li>
          <li>
            <p class="mb-1">團體票</p>
            <p>2024/01/01 ~ 2024/12/31</p>
          </li>
        </ul>
      </template>
      <template #footer>
        <button
          class="text-primary-500 px-7 py-3 w-full"
          @click="isUsagePeriodInformationModalOpen = false"
        >
          確認
        </button>
      </template>
    </MessageModal>
  </div>
</template>
