<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import BaseInput from '@/components/atoms/BaseInput.vue';

import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useFeePaymentStore } from '@/stores/fee-payment';

const route = useRoute();
const paymentStore = useFeePaymentStore();
const { paymentList } = storeToRefs(paymentStore);

const expandList = ref<string[]>([]);
const expandListSet = computed(() => new Set(expandList.value.map((name) => name)));

const onExpandClick = (name: string) => {
  if (expandListSet.value.has(name)) {
    const index = expandList.value.findIndex((el) => el === name);
    expandList.value.splice(index, 1);
  } else {
    expandList.value.push(name);
  }
};

onMounted(() => {});
</script>

<template>
  <!-- search bar -->
  <div class="p-4">
    <router-link :to="{ name: 'fee-payment-search' }" class="flex">
      <BaseInput disa placeholder="搜尋項目名稱" class="flex-grow" />
      <button class="search-button">
        <img src="@/assets/images/search-icon.svg" alt="搜尋" />
      </button>
    </router-link>
  </div>
  <!-- 規費列表 -->
  <ul>
    <li
      class="px-4 py-2"
      :class="{
        'bg-grey-50': expandListSet.has(item.name)
      }"
      v-for="item in paymentList"
      :key="item.name"
    >
      <button
        class="w-full flex justify-between items-center mb-5"
        @click="onExpandClick(item.name)"
      >
        <div
          class="flex items-end"
          :class="{
            'font-bold': expandListSet.has(item.name)
          }"
        >
          <img :src="item.icon" class="mr-2" v-if="item.icon" alt="payment-icon" />
          {{ item.name }}
        </div>
        <img
          src="@/assets/images/down-icon.svg"
          class="transition-transform"
          :class="{
            'rotate-180': expandListSet.has(item.name)
          }"
        />
      </button>
      <div
        class="grid grid-rows-[0fr] transition-all"
        :class="{
          'grid-rows-[1fr]': expandListSet.has(item.name)
        }"
      >
        <ul class="overflow-hidden">
          <li v-for="(subItem, index) in item.data" :key="index">
            <div class="flex-grow pl-[3px] mb-4">
              <ul>
                <li class="mb-3">
                  <router-link :to="{ name: 'fee-payment-detail', params: { id: subItem.id } }">
                    <p>{{ subItem.name }}</p>
                  </router-link>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </div>
    </li>
  </ul>
</template>

<style lang="postcss"></style>
