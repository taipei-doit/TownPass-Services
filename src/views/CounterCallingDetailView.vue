<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import BaseSelect from '@/components/atoms/BaseSelect.vue';
import BaseDialog from '@/components/atoms/BaseDialog.vue';
import { useConnectionMessage } from '@/composables/useConnectionMessage';
import { type SubCounter } from '@/views/CounterCallingView.vue';
import { useCounterStore } from '@/stores/counter';
import { storeToRefs } from 'pinia';

const route = useRoute();

const counterStore = useCounterStore();
const { counterList } = storeToRefs(counterStore);

const counterItem = computed(() => counterList.value.find((item) => item.id === route.params.id)!);

const subCounterList = ref<SubCounter[]>([]);

const counterOptions = computed(() => {
  return (
    subCounterList.value.map((item) => ({
      label: item.name,
      value: item.id
    })) || []
  );
});
const selectedSubCounterId = ref('');

const subCounterItem = computed(
  () => subCounterList.value.find((item) => item.id === selectedSubCounterId.value)!
);

const isMapDialogOpen = ref(false);

onMounted(() => {
  getSubCounterList();
});

const getSubCounterList = () => {
  if (counterItem.value?.list) {
    subCounterList.value = counterItem.value.list;

    if (route.query.subId as string) {
      selectedSubCounterId.value = route.query.subId as string;
    } else {
      selectedSubCounterId.value = subCounterList.value[0]?.id;
    }
  }
};

const onPhoneCallClick = (phone: string) => {
  useConnectionMessage('phone_call', phone);
};

const onMapOpenClick = () => {
  useConnectionMessage('launch_map', subCounterItem.value?.info.address.map);
};

const toggleRegularlyUsedItem = (counterItem: SubCounter) => {
  counterItem.is_regularly_used = !counterItem.is_regularly_used;
};
</script>

<template>
  <div class="px-5 py-8 bg-grey-50">
    <h5 class="font-bold mb-3">選擇地點</h5>
    <BaseSelect
      v-model="selectedSubCounterId"
      :selectId="counterItem.id"
      :options="counterOptions"
      :customClass="'bg-white border border-grey-600'"
      default-selected="請選擇地點"
      class="w-full"
    />
  </div>
  <div class="px-5 py-8" v-if="subCounterItem">
    <div class="mb-8">
      <div class="flex justify-between mb-4">
        <h5 class="font-bold">{{ counterItem.name }}</h5>
        <!-- 加入常用 -->
        <a
          href="javascript:void(0)"
          class="flex items-center"
          v-if="!subCounterItem.is_regularly_used"
          @click="toggleRegularlyUsedItem(subCounterItem)"
        >
          <div class="bg-primary-500 rounded-full w-5 h-5 flex items-center justify-center mr-1">
            <img src="@/assets/images/add-icon-white.svg" class="inline w-3" alt="" />
          </div>
          <span>加入常用</span>
        </a>
        <!-- 移除常用 -->
        <a
          href="javascript:void(0)"
          class="flex items-center"
          v-if="subCounterItem.is_regularly_used"
          @click="toggleRegularlyUsedItem(subCounterItem)"
        >
          <div class="bg-grey-50 rounded-full w-5 h-5 flex items-center justify-center mr-1">
            <img src="@/assets/images/minus-icon.svg" class="inline w-3" alt="" />
          </div>
          <span>移除常用</span>
        </a>
      </div>
      <p class="text-sm">櫃檯等候狀況</p>
      <p class="text-sm mb-4">請至現場確認申辦櫃檯並抽號碼牌</p>
      <div
        class="bg-grey-50 mb-4 px-5 py-3 flex justify-between"
        v-for="(item, index) in subCounterItem.counters"
        :key="index"
      >
        <div>
          <span>{{ item.name }}</span>
          <span class="mx-2">|</span>
          <span>{{ item.current_number }}號</span>
        </div>
        <div class="text-primary-500">
          <span class="mr-2">等候</span>
          <span>{{ item.waiting_people }}</span>
        </div>
      </div>
    </div>
    <div>
      <h5 class="font-bold">聯絡資訊</h5>
      <div class="w-full flex flex-col">
        <a
          href="javascript:void(0)"
          class="link-wrapper right-arrow"
          @click.prevent="isMapDialogOpen = true"
        >
          <img src="@/assets/images/location-icon.svg" class="icon" alt="icon_map" />
          <span class="mx-1">{{ subCounterItem.info.address.text }}</span>
        </a>
        <a
          href="javascript:void(0)"
          class="link-wrapper right-arrow"
          @click="onPhoneCallClick(subCounterItem.info.tel)"
        >
          <img src="@/assets/images/icon_tel.svg" class="icon" alt="icon_tel" />
          <span class="mx-1">{{ subCounterItem.info.tel }}</span>
        </a>
        <RouterLink
          :to="{
            name: 'counter-calling-detail'
          }"
          class="link-wrapper"
        >
          <img src="@/assets/images/icon_fax.svg" class="icon" alt="icon_map" />
          <span class="mx-1">{{ subCounterItem.info.fax }}</span>
        </RouterLink>
      </div>
    </div>
  </div>
  <div class="px-5 py-16" v-if="!subCounterItem">
    <div class="flex items-center justify-center">
      <div class="text-center">
        <img src="@/assets/images/illustrations_no_data.svg" alt="illustrations_no_data" />
        <p>目前無選擇地區</p>
      </div>
    </div>
  </div>
  <BaseDialog
    v-model="isMapDialogOpen"
    title="是否要開啟 Google Map"
    content="開啟 Google Maps APP 導航?"
    :isAlert="true"
    positiveText="開啟"
    negativeText="取消"
    @onPositiveClick="onMapOpenClick"
  />
</template>

<style lang="postcss" scoped>
.link-wrapper {
  @apply relative py-3 pr-5 bg-white border-b border-grey-50;
  @apply flex items-center;

  &.right-arrow {
    @apply after:content-[''] after:w-6 after:h-6;
    @apply after:bg-[url('@/assets/images/down-icon.svg')] after:bg-cover after:bg-no-repeat after:-rotate-90;
    @apply after:block after:absolute after:top-1/2 after:-translate-y-1/2 after:right-0;
  }
}
</style>
