<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter, useRoute } from 'vue-router';
import QrcodeVue from 'qrcode.vue';
import { useCouponStore } from '@/stores/coupon';

const router = useRouter();
const route = useRoute();

const store = useCouponStore();

const { walletData } = storeToRefs(store);

const onBackButtonClick = () => {
  router.push({
    name: 'ticket-wallet'
  });
};

const orderMap = computed(
  () => new Map(walletData.value?.admission.my_order.map((item) => [item.id, item]))
);

const activeData = computed(() => orderMap.value.get(route.params.id as string));
</script>

<template>
  <div v-if="activeData" class="min-h-screen flex flex-col">
    <div class="h-14 px-4 py-3 flex justify-center items-center relative">
      <button @click="onBackButtonClick" class="absolute top-1/2 -translate-y-1/2 left-4">
        <img src="@/assets/images/down-icon.svg" class="rotate-90" />
      </button>
      <h1 class="font-semibold text-grey-700">兌換</h1>
    </div>
    <div class="bg-grey-50 py-3 px-4">
      <p class="font-semibold text-grey-800">{{ activeData.name }}</p>
      <p class="text-sm text-grey-400">{{ activeData.date }}</p>
    </div>
    <div class="bg-[#5AB4C5] grow flex flex-col justify-center items-center">
      <p class="font-semibold text-white mb-8">請出示此QRCode兌換</p>
      <div class="bg-white rounded-3xl p-6">
        <QrcodeVue
          v-if="activeData.qrcode"
          :value="activeData.qrcode"
          level="M"
          render-as="svg"
          :size="186"
        />
      </div>
    </div>
  </div>
</template>
