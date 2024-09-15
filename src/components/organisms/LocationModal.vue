<script setup lang="ts">
import { ref, defineModel, watchEffect, watch, reactive } from 'vue';
import { useDebounceFn } from '@vueuse/core';
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';
import { GoogleMap } from 'vue3-google-map';
import axios from 'axios';
import { useConnectionMessage } from '@/composables/useConnectionMessage';
import { useHandleConnectionData } from '@/composables/useHandleConnectionData';
import MessageModal from '@/components/molecules/MessageModal.vue';
import BaseDialog from '../atoms/BaseDialog.vue';

const emits = defineEmits(['positionConfirm']);

const props = defineProps<{
  formAddress: string;
}>();

const isShowLocaionModal = defineModel<boolean>({ default: false });

const locationModal = ref();

watchEffect(() => {
  if (isShowLocaionModal.value) {
    disableBodyScroll(locationModal.value);
  } else {
    enableBodyScroll(locationModal.value);
  }
});

const center = reactive({ lat: 25.0376146, lng: 121.563844 });

const locationMap = ref<any>(null);

const addressText = ref('110台北市信義區市府路1號');

const handleLocation = async (event: { data: string }) => {
  const result: { name: string; data: { longitude: number; latitude: number } } = JSON.parse(
    event.data
  );

  if (result.data.longitude && result.data.latitude) {
    const { data } = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${result.data.latitude},${result.data.longitude}&key=`
    );

    if (data.results.length) {
      addressText.value = data.results[0]?.formatted_address;
    }

    center.lat = result.data.latitude;
    center.lng = result.data.longitude;
  }
};

useConnectionMessage('location', null);
useHandleConnectionData(handleLocation);

const isTyping = ref(false);

const isPanning = ref(false);

const isNoResultModalShow = ref(false);

const mapCenterChanged = useDebounceFn(async () => {
  if (locationMap.value) {
    if (isPanning.value) {
      isPanning.value = false;
      return;
    }

    const gmap = locationMap.value.map;
    const newCenter = gmap.getCenter();
    const lat = parseFloat(newCenter.lat().toFixed(7));
    const lng = parseFloat(newCenter.lng().toFixed(7));

    const { data } = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=`
    );

    if (data.results.length) {
      center.lat = lat;
      center.lng = lng;
      addressText.value = data.results[0]?.formatted_address;
    } else {
      isNoResultModalShow.value = true;
    }
  }
}, 1000);

const searchPositionByText = async () => {
  const { data } = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${addressText.value}&key=`
  );
  if (data.results.length) {
    isPanning.value = true;
    addressText.value = data.results[0]?.formatted_address;
    center.lat = data.results[0].geometry.location.lat;
    center.lng = data.results[0].geometry.location.lng;
    locationMap.value.map.panTo({
      lat: data.results[0].geometry.location.lat,
      lng: data.results[0].geometry.location.lng
    });
  } else {
    isNoResultModalShow.value = true;
  }
};

watch(addressText, async () => {
  if (isTyping.value && addressText.value) {
    searchPositionByText();
  }
});

const onConfirmClick = () => {
  emits('positionConfirm', addressText.value);
  isShowLocaionModal.value = false;
};

watch(isShowLocaionModal, () => {
  if (isShowLocaionModal.value) {
    if (props.formAddress && props.formAddress !== addressText.value) {
      addressText.value = props.formAddress;
      searchPositionByText();
    }
  }
});
</script>

<template>
  <div>
    <MessageModal ref="locationModal" :is-show="isShowLocaionModal" class="location-modal">
      <template #header>
        <div>
          <div class="flex justify-between">
            <div />
            <span>輸入地址</span>
            <button @click="isShowLocaionModal = false">
              <img
                src="@/assets/images/icon-cancel-default.svg"
                width="24"
                height="24"
                class="size-6"
              />
            </button>
          </div>
          <div class="relative w-11/12 mt-3 mx-auto">
            <input
              v-model.lazy="addressText"
              type="text"
              class="location-modal__input"
              @focus="isTyping = true"
              @blur="isTyping = false"
            />
            <button class="absolute top-1/2 -translate-y-1/2 right-2" @click="addressText = ''">
              <img src="@/assets/images/cancel-text-icon.svg" />
            </button>
          </div>
        </div>
      </template>
      <template #body>
        <GoogleMap
          ref="locationMap"
          api-key=""
          style="width: 100%; height: 100%"
          :center="center"
          :zoom="15"
          gesture-handling="greedy"
          :disable-default-ui="true"
          @center_changed="mapCenterChanged"
        >
          <div class="location-modal__center-marker" />
        </GoogleMap>
      </template>
      <template #footer>
        <button
          class="bg-primary-500 text-white rounded-full py-2 w-11/12 mx-auto my-1"
          @click="onConfirmClick"
        >
          確認
        </button>
      </template>
    </MessageModal>
    <BaseDialog
      v-model="isNoResultModalShow"
      :is-alert="true"
      title="提醒"
      content="搜尋不到此地址，請重新輸入"
    />
  </div>
</template>

<style lang="postcss">
.location-modal {
  @apply [&_.modal-container]:size-full;
  @apply [&_.modal-container]:flex [&_.modal-container]:flex-col;
  @apply [&_.modal-container]:rounded-none;
  @apply [&_.modal-container]:shadow-none;
  @apply [&_.modal-container]:m-auto;
  @apply [&_.modal-header]:text-black [&_.modal-header]:text-lg;
  @apply [&_.modal-header]:py-2 [&_.modal-header]:px-4;
  @apply [&_.modal-body]:m-0 [&_.modal-body]:flex-grow;

  &__input {
    @apply rounded-lg outline-none bg-gray-100;
    @apply py-1 pl-2 pr-8;
    @apply w-full text-sm;
    @apply font-normal;
  }

  &__center-marker {
    @apply absolute top-1/2 left-1/2 z-[1];
    @apply -ml-[14px] -mt-[43px];
    @apply h-11 w-7;
    @apply cursor-pointer;
    @apply bg-[url('@/assets/images/marker.png')] bg-contain;
  }
}
</style>
