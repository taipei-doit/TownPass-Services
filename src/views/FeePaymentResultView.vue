<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useFeePaymentStore } from '@/stores/fee-payment';
import FixedTitleSection from '@/components/molecules/FixedTitleSection.vue';
import BaseCheckbox from '@/components/atoms/BaseCheckbox.vue';
import { computed, ref } from 'vue';
import BaseButton from '@/components/atoms/BaseButton.vue';

const route = useRoute();
const router = useRouter();
const paymentStore = useFeePaymentStore();
const { paymentList, billList } = storeToRefs(paymentStore);

const paymentItem = computed(() => {
  const concatenatedData = paymentList.value.flatMap((item) => item.data);
  return concatenatedData.find((item) => item.id === route.params.id)!;
});

const enableBillList = computed(() => {
  const list = billList.value.filter((item) => item.payment_id === paymentItem.value.id);
  return list;
});

const totalAmount = computed(() => {
  const payList = enableBillList.value.filter((item) => paymentModel.value.includes(item.id));
  return payList.reduce((total, item) => total + item.amount, 0);
});

const paymentModel = ref<string[]>([]);

const selectAllBills = () => {
  const allPaymentIds = enableBillList.value.map((item) => item.id);
  if (paymentModel.value.length === allPaymentIds.length) {
    // 如果所有帳單已經被選中，則取消全部選中
    paymentModel.value = [];
  } else {
    // 否則選中所有帳單
    paymentModel.value = allPaymentIds;
  }

  console.log(paymentModel.value);
};

/** 前往繳費 */
const onSubmitClick = () => {
  console.log(paymentModel.value);

  router.push({
    name: 'payment',
    params: { id: paymentItem.value.id, bill_id: paymentModel.value.join(',') }
  });
};
</script>

<template>
  <template v-if="enableBillList.length">
    <FixedTitleSection title="選擇帳單" />
    <section class="p-4 mt-16 mb-[120px]">
      <div class="flex items-center justify-between mb-4">
        <span>繳費選擇({{ paymentModel.length }}/{{ enableBillList.length }})</span>
        <a href="" @click.prevent="selectAllBills" class="text-primary-500 underline">全部繳清</a>
      </div>
      <div
        class="rounded border border-grey-300 p-4 mb-4"
        v-for="(item, index) in enableBillList"
        :key="index"
      >
        <div class="flex justify-between mb-4">
          <span>{{ item.id }}</span>
          <BaseCheckbox
            :option="{
              label: '',
              value: item.id
            }"
            v-model="paymentModel"
            :checked="paymentModel.includes(item.id)"
          />
        </div>
        <div class="flex justify-between mb-4" v-for="(subItem, index) in item.data" :key="index">
          <span>{{ subItem.label }}</span>
          <span>{{ subItem.value }}</span>
        </div>
      </div>
    </section>
    <!-- footer -->
    <div
      class="bg-white fixed bottom-0 left-0 right-0 p-4 shadow-[0_-5px_10px_-8px_rgba(0,0,0,0.3)]"
    >
      <div class="flex items-center justify-end mb-2">
        <span class="text-sm text-spanrimary-500 mr-2">總金額</span>
        <span class="font-bold text-xl">NT$ {{ totalAmount }}</span>
      </div>
      <BaseButton class="w-full" :disabled="paymentModel.length === 0" @click="onSubmitClick()">
        前往繳費
      </BaseButton>
    </div>
  </template>
  <template v-else>
    <div class="p-8 mt-20 text-center">
      <img src="@/assets/images/alert-icon.svg" class="mx-auto" alt="nodata-icon" />
      <p class="text-center mt-2">
        目前查無「{{
          paymentItem.name
        }}」待繳帳單，或可能已於其他通路繳費，欲了解繳費狀態，請於上班時間撥打(02)2726-9600洽詢，謝謝
      </p>
      <BaseButton
        :shape="'rounded'"
        class="mt-10 w-1/2"
        @click="router.push({ name: 'fee-payment-others' })"
      >
        回到城市通
      </BaseButton>
    </div>
  </template>
</template>

<style lang="postcss"></style>
