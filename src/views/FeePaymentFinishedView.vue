<script setup lang="ts">
import { format } from 'date-fns';
import { storeToRefs } from 'pinia';
import BaseButton from '@/components/atoms/BaseButton.vue';
import ServiceStep from '@/components/molecules/ServiceStep.vue';
import { useFeePaymentStore } from '@/stores/fee-payment';
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const store = useFeePaymentStore();

const { paymentList, paymentInfo } = storeToRefs(store);

const paymentItem = computed(() => {
  const concatenatedData = paymentList.value.flatMap((item) => item.data);
  return concatenatedData.find((item) => item.id === route.params.id)!;
});
</script>

<template>
  <div class="pt-14">
    <section class="fixed top-0 left-0 z-30 w-screen bg-white p-4 flex justify-center">
      <span class="font-bold text-gray-700">規費繳納</span>
    </section>
    <ServiceStep :activeStep="3" :stepCount="3" class="mx-4 mb-4" />
    <div class="flex flex-col gap-y-2 justify-center items-center">
      <img src="@/assets/images/check-icon.svg" />
      <p class="text-2xl text-primary-500 font-medium">繳費完成</p>
    </div>
    <ul class="px-4 pb-2 mt-6 flex flex-col gap-y-5 text-grey-800">
      <li class="flex justify-between">
        <span class="font-medium">繳費項目</span>
        <div class="flex flex-col gap-y-0.5 text-right">
          <span>{{ paymentItem.name }}</span>
        </div>
      </li>
      <li class="flex justify-between">
        <span class="font-medium">繳費日期</span>
        <span>{{ format(new Date(), 'yyyy/MM/dd') }}</span>
      </li>
      <li class="flex justify-between">
        <span class="font-medium">付款方式</span>
        <span>{{ paymentInfo.way }}</span>
      </li>
      <li class="flex justify-between">
        <span class="font-medium">帳單總金額</span>
        <span class="text-primary-500 text-2xl font-medium">NT${{ paymentInfo.total }}</span>
      </li>
    </ul>
    <div class="flex justify-center">
      <BaseButton
        :shape="'rounded'"
        class="mt-10 w-1/2"
        @click="router.push({ name: 'fee-payment-others' })"
      >
        回到城市通
      </BaseButton>
    </div>
  </div>
</template>
