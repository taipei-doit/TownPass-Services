<script setup lang="ts">
import { format } from 'date-fns';
import { storeToRefs } from 'pinia';
import { usePaymentStore } from '@/stores/payment';
import { useCouponStore } from '@/stores/coupon';
import BaseButton from '@/components/atoms/BaseButton.vue';
import ServiceStep from '@/components/molecules/ServiceStep.vue';
import ticketWalletJson from '../../public/mock/ticket_wallet.json';

const store = usePaymentStore();

const { paymentInfo } = storeToRefs(store);

const couponStore = useCouponStore();

const { walletData } = storeToRefs(couponStore);

walletData.value = ticketWalletJson.data;
</script>

<template>
  <div class="pt-14">
    <section class="fixed top-0 left-0 z-30 w-screen bg-white p-4 flex justify-center">
      <span class="font-bold text-gray-700">入場券</span>
    </section>
    <ServiceStep :activeStep="3" :stepCount="3" class="mx-4 mb-4" />
    <div class="flex flex-col gap-y-2 justify-center items-center">
      <img src="@/assets/images/check-icon.svg" />
      <p class="text-2xl text-primary-500 font-medium">訂購完成</p>
      <p class="text-grey-800">票券已加入票夾</p>
    </div>
    <ul class="px-4 pb-2 mt-6 flex flex-col gap-y-5 text-grey-800">
      <li class="flex justify-between">
        <span class="font-medium">交易序號</span>
        <span>220610S0000100003</span>
      </li>
      <li class="flex justify-between">
        <span class="font-medium">訂購項目</span>
        <div class="flex flex-col gap-y-0.5 text-right">
          <span>掘光而行：洪瑞麟</span>
          <span v-if="paymentInfo.adult">全票x{{ paymentInfo.adult }}</span>
          <span v-if="paymentInfo.concession">優待票x{{ paymentInfo.concession }}</span>
          <span v-if="paymentInfo.citizen">台北市民票x{{ paymentInfo.citizen }}</span>
          <span v-if="paymentInfo.group">團體票x{{ paymentInfo.group }}</span>
        </div>
      </li>
      <li class="flex justify-between">
        <span class="font-medium">訂購日期</span>
        <span>{{ format(new Date(), 'yyyy/MM/dd') }}</span>
      </li>
      <li class="flex justify-between">
        <span class="font-medium">付款方式</span>
        <span>{{ paymentInfo.way }}</span>
      </li>
    </ul>
    <div class="h-2 bg-grey-100"></div>
    <ul class="p-4">
      <li class="flex justify-between">
        <span class="font-medium">票券總金額</span>
        <span class="text-primary-500 text-2xl font-medium">NT${{ paymentInfo.total }}</span>
      </li>
    </ul>
    <div class="flex items-center gap-x-2 bg-grey-100 p-4">
      <div class="grow bg-grey-400 h-px"></div>
      <span class="text-grey-400">票券已加入票夾</span>
      <div class="grow bg-grey-400 h-px"></div>
    </div>
    <div class="grid grid-cols-2 gap-x-2 p-4">
      <BaseButton outline link :route-info="{ name: 'ticket-wallet' }">查看票夾</BaseButton>
      <BaseButton link :route-info="{ name: 'ticket-exchange', params: { id: 't-1' } }">
        立即使用
      </BaseButton>
    </div>
  </div>
</template>
