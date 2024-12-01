<script setup lang="ts">
import { ref, onMounted, computed, reactive } from 'vue';
import FeePaymentForm from '@/components/molecules/FeePaymentForm.vue';
import BaseButton from '@/components/atoms/BaseButton.vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useFeePaymentStore } from '@/stores/fee-payment';
import FeePaymentTabsView from '@/components/organisms/FeePaymentTabsView.vue';
import FixedTitleSection from '@/components/molecules/FixedTitleSection.vue';

const route = useRoute();
const router = useRouter();
const paymentStore = useFeePaymentStore();
const { paymentList } = storeToRefs(paymentStore);

const paymentItem = computed(() => {
  const concatenatedData = paymentList.value.flatMap((item) => item.data);
  return concatenatedData.find((item) => item.id === route.params.id)!;
});

const tabList = computed(() => {
  const list = paymentItem.value.search_type_list.map((item, index) => {
    return {
      id: index,
      title: item.name
    };
  });
  return list;
});

const activeTab = ref(0);

const redirectToScan = (tab: number) => {
  if (tab === activeTab.value) {
    router.push({ name: 'fee-payment-scan' });
  }
};

onMounted(() => {});
</script>

<template>
  <FixedTitleSection :title="paymentItem.name" />
  <FeePaymentTabsView v-model="activeTab" :tab-list="tabList">
    <template #tab0>
      <!-- form -->
      <template v-if="paymentItem.search_type_list[0].type === 'form'">
        <FeePaymentForm :payment-item="paymentItem" :tab-index="0"></FeePaymentForm>
      </template>
      <!-- scan -->
      <template v-else>
        <div class="text-grey-400 text-center mt-20">
          {{ redirectToScan(0) }}
        </div>
      </template>
    </template>
    <template #tab1>
      <!-- form -->
      <template v-if="paymentItem.search_type_list[1].type === 'form'">
        <FeePaymentForm :payment-item="paymentItem" :tab-index="1"></FeePaymentForm>
      </template>
      <!-- scan -->
      <template v-else>
        <div class="text-grey-400 text-center mt-20">
          {{ redirectToScan(1) }}
        </div>
      </template>
    </template>
    <template #tab2>
      <!-- form -->
      <template v-if="paymentItem.search_type_list[2].type === 'form'">
        <FeePaymentForm :payment-item="paymentItem" :tab-index="2"></FeePaymentForm>
      </template>
      <!-- scan -->
      <template v-else>
        <div class="text-grey-400 text-center mt-20">
          {{ redirectToScan(2) }}
        </div>
      </template>
    </template>
  </FeePaymentTabsView>
</template>

<style lang="postcss"></style>
