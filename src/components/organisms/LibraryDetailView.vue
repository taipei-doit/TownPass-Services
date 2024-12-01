<script setup lang="ts">
import type { Library } from '@/interfaces/library-book.interface';
import { ref } from 'vue';
import BaseDialog from '@/components/atoms/BaseDialog.vue';
import { useConnectionMessage } from '@/composables/useConnectionMessage';

const props = defineProps<{
  selectedLibrary: Library;
}>();
const emit = defineEmits(['update:isExpandDetail']);

const isMapDialogOpen = ref(false);

const onPhoneCallClick = (phone: string) => {
  useConnectionMessage('phone_call', phone);
};

const onMapOpenClick = (library: Library) => {
  useConnectionMessage('launch_map', library.address.map);
};
</script>

<template>
  <div class="pb-8 h-screen flex flex-col bg-grey-50">
    <div class="p-5 bg-white mb-4">
      <!-- title -->
      <div class="flex items-center mb-2">
        <img
          src="@/assets/images/down-icon.svg"
          class="rotate-90 mr-2"
          @click="emit('update:isExpandDetail', false)"
          alt=""
        />
        <span class="font-bold text-xl">{{ selectedLibrary.name }}</span>
      </div>
      <div class="flex text-grey-500 mb-2">
        <span>{{ selectedLibrary.distance }}公里</span>
      </div>
      <!-- address -->
      <div class="flex mb-2">
        <img src="@/assets/images/icon-geo.svg" alt="" />
        <a href="" @click.prevent="isMapDialogOpen = true">
          <span class="underline">{{ selectedLibrary.address.text }}</span>
        </a>
      </div>
      <!-- phone -->
      <a
        href="javascript:void(0)"
        class="flex mb-2"
        @click="onPhoneCallClick(selectedLibrary.phone)"
      >
        <img src="@/assets/images/icon_tel.svg" class="icon" alt="icon_tel" />
        <span class="mx-1">{{ selectedLibrary.phone }}</span>
      </a>
    </div>
    <div class="p-5 bg-white">
      <p class="text-grey-500 mb-2">開/閉館時間</p>
      <!-- custom template -->
      <div>
        <ul
          class="list-disc pl-4"
          v-for="(info, index) in selectedLibrary.service_infos"
          :key="index"
        >
          <li>{{ info.title }}{{ info.value ? '：' : '' }}{{ info.value }}</li>
        </ul>
      </div>
    </div>
  </div>
  <BaseDialog
    v-model="isMapDialogOpen"
    title="是否要開啟 Google Map"
    :content="`地點：${selectedLibrary.name}`"
    :isAlert="true"
    positiveText="開啟"
    negativeText="取消"
    @onPositiveClick="onMapOpenClick(selectedLibrary)"
  />
</template>

<style lang="postcss" scoped></style>
