<script lang="ts">
export enum TicketType {
  ADMISSION = 'admission',
  COUPON = 'coupon'
}

export enum TicketStatusType {
  NOTREDEEMED = 'not_redeemed',
  REDEEMED = 'redeemed',
  EXPIRED = 'expired',
  MYORDER = 'my_order',
  FINISHED = 'finished'
}
</script>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { RouterLink, useRoute } from 'vue-router';
import BaseButton from '@/components/atoms/BaseButton.vue';
import BaseTicket from '@/components/atoms/BaseTicket.vue';
import ServiceTabsView from '@/components/organisms/ServiceTabsView.vue';
import { useCouponStore } from '@/stores/coupon';
import couponDataJson from '../../public/mock/coupon_data.json';
import ticketWalletJson from '../../public/mock/ticket_wallet.json';

export interface Wallet {
  admission: {
    my_order: {
      id: string;
      name: string;
      img_url: string;
      date: string;
      total: string;
      qrcode: string;
    }[];
    finished: {
      id: string;
      name: string;
      img_url: string;
      date: string;
      total: string;
      qrcode: string;
    }[];
  };
  coupon: {
    not_redeemed: {
      id: string;
      name: string;
      img_url: string;
      date: string;
      total: string;
    }[];
    redeemed: {
      id: string;
      name: string;
      img_url: string;
      date: string;
      total: string;
    }[];
    expired: {
      id: string;
      name: string;
      img_url: string;
      date: string;
      total: string;
    }[];
  };
}

const route = useRoute();

const store = useCouponStore();

const { ticketList, couponList, walletData } = storeToRefs(store);

ticketList.value = couponDataJson.data.ticket_list;
couponList.value = couponDataJson.data.coupon_list;
walletData.value = ticketWalletJson.data;

const activeTab = ref(0);

if (route.query.walletTab && route.query.walletTab === '2') {
  activeTab.value = 1;
}

const tabList = [
  {
    id: 1,
    title: '入場券'
  },
  {
    id: 2,
    title: '優惠券'
  }
];

const activeTicketStatus = ref(0);

const couponStatusList = [
  {
    id: 1,
    title: '未兌換'
  },
  {
    id: 2,
    title: '已兌換'
  },
  {
    id: 3,
    title: '已過期'
  }
];

const admissionStatusList = [
  {
    id: 1,
    title: '我的訂單'
  },
  {
    id: 2,
    title: '已結束'
  }
];

watch(activeTab, () => {
  activeTicketStatus.value = 0;
});

const activeTicketStatusType = computed(() => {
  if (activeTab.value === 0 && activeTicketStatus.value === 0) {
    return TicketStatusType.MYORDER;
  } else if (activeTab.value === 0 && activeTicketStatus.value === 1) {
    return TicketStatusType.FINISHED;
  } else if (activeTab.value === 1 && activeTicketStatus.value === 0) {
    return TicketStatusType.NOTREDEEMED;
  } else if (activeTab.value === 1 && activeTicketStatus.value === 1) {
    return TicketStatusType.REDEEMED;
  } else if (activeTab.value === 1 && activeTicketStatus.value === 2) {
    return TicketStatusType.EXPIRED;
  } else {
    return '';
  }
});

const activeData = computed(() => {
  if (!walletData.value) {
    return null;
  }

  if (activeTab.value === 0 && activeTicketStatus.value === 0) {
    return walletData.value[TicketType.ADMISSION][TicketStatusType.MYORDER];
  } else if (activeTab.value === 0 && activeTicketStatus.value === 1) {
    return walletData.value[TicketType.ADMISSION][TicketStatusType.FINISHED];
  } else if (activeTab.value === 1 && activeTicketStatus.value === 0) {
    return walletData.value[TicketType.COUPON][TicketStatusType.NOTREDEEMED];
  } else if (activeTab.value === 1 && activeTicketStatus.value === 1) {
    return walletData.value[TicketType.COUPON][TicketStatusType.REDEEMED];
  } else if (activeTab.value === 1 && activeTicketStatus.value === 2) {
    return walletData.value[TicketType.COUPON][TicketStatusType.EXPIRED];
  } else {
    return [];
  }
});
</script>

<template>
  <div class="pt-12">
    <div
      class="fixed top-0 left-0 z-10 w-screen bg-white py-2 px-4 flex justify-between border-b border-b-gray-300"
    >
      <RouterLink :to="{ name: 'coupon' }">
        <img src="@/assets/images/down-icon.svg" class="rotate-90" />
      </RouterLink>
      <h1 class="font-bold text-gray-700">票夾</h1>
      <div />
    </div>
    <ServiceTabsView v-model="activeTab" :tab-list="tabList">
      <template #tab0>
        <div
          class="min-h-[calc(100vh-84px)]"
          :class="{
            'bg-grey-100': activeData && activeData.length
          }"
        >
          <ServiceTabsView
            v-model="activeTicketStatus"
            :tab-list="admissionStatusList"
            :contentType="true"
          >
            <template #tab0>
              <ul v-if="activeData && activeData.length" class="p-4 flex flex-col gap-y-3">
                <li v-for="item in activeData" :key="item.id">
                  <RouterLink :to="{ name: 'ticket-exchange', params: { id: item.id } }">
                    <BaseTicket
                      :name="item.name"
                      :img="item.img_url"
                      :date="item.date"
                      :total="item.total"
                      :type="activeTicketStatusType"
                    />
                  </RouterLink>
                </li>
              </ul>
              <div v-else class="flex flex-col justify-center items-center pt-28">
                <img src="@/assets/images/admission-icon.svg" />
                <span class="text-[#5AB4C5] font-semibold text-lg my-5">目前無入場券</span>
              </div>
            </template>
            <template #tab1>
              <ul v-if="activeData && activeData.length" class="p-4 flex flex-col gap-y-3">
                <li v-for="item in activeData" :key="item.id">
                  <BaseTicket
                    :name="item.name"
                    :img="item.img_url"
                    :date="item.date"
                    :total="item.total"
                    :type="activeTicketStatusType"
                  />
                </li>
              </ul>
              <div v-else class="flex flex-col justify-center items-center pt-28">
                <img src="@/assets/images/admission-icon.svg" />
                <span class="text-[#5AB4C5] font-semibold text-lg my-5">目前無入場券</span>
              </div>
            </template>
          </ServiceTabsView>
        </div>
      </template>
      <template #tab1>
        <div
          class="pt-[18px] min-h-[calc(100vh-84px)]"
          :class="{
            'bg-grey-100': activeData && activeData.length
          }"
        >
          <ServiceTabsView
            v-model="activeTicketStatus"
            :tab-list="couponStatusList"
            :contentType="true"
          >
            <template #tab0>
              <ul v-if="activeData && activeData.length" class="p-4 flex flex-col gap-y-3">
                <li v-for="item in activeData" :key="item.id">
                  <RouterLink
                    :to="{
                      name: 'coupon-detail',
                      params: { id: item.id },
                      query: { needUse: 'Y', walletTab: '2' }
                    }"
                  >
                    <BaseTicket
                      :name="item.name"
                      :img="item.img_url"
                      :date="item.date"
                      :type="activeTicketStatusType"
                    />
                  </RouterLink>
                </li>
              </ul>
              <div v-else class="flex flex-col justify-center items-center pt-28">
                <img src="@/assets/images/sales-icon.svg" />
                <span class="text-[#5AB4C5] font-semibold text-lg my-5">馬上領取優惠券</span>
                <BaseButton
                  :link="true"
                  :routeInfo="{ name: 'coupon', query: { tab: '2' } }"
                  class="w-44"
                >
                  查看優惠
                </BaseButton>
              </div>
            </template>
            <template #tab1>
              <ul v-if="activeData && activeData.length" class="p-4 flex flex-col gap-y-3">
                <li v-for="item in activeData" :key="item.id">
                  <BaseTicket
                    :name="item.name"
                    :img="item.img_url"
                    :date="item.date"
                    :total="item.total"
                    :type="activeTicketStatusType"
                  />
                </li>
              </ul>
              <div v-else class="flex flex-col justify-center items-center pt-28">
                <img src="@/assets/images/sales-icon.svg" />
                <span class="text-[#5AB4C5] font-semibold text-lg my-5">馬上領取優惠券</span>
                <BaseButton
                  :link="true"
                  :routeInfo="{ name: 'coupon', query: { tab: '2' } }"
                  class="w-44"
                >
                  查看優惠
                </BaseButton>
              </div>
            </template>
            <template #tab2>
              <ul v-if="activeData && activeData.length" class="p-4 flex flex-col gap-y-3">
                <li v-for="item in activeData" :key="item.id">
                  <BaseTicket
                    :name="item.name"
                    :img="item.img_url"
                    :date="item.date"
                    :total="item.total"
                    :type="activeTicketStatusType"
                  />
                </li>
              </ul>
              <div v-else class="flex flex-col justify-center items-center pt-28">
                <img src="@/assets/images/sales-icon.svg" />
                <span class="text-[#5AB4C5] font-semibold text-lg my-5">無優惠券過期失效</span>
              </div>
            </template>
          </ServiceTabsView>
        </div>
      </template>
    </ServiceTabsView>
  </div>
</template>
