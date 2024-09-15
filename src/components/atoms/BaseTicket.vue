<script setup lang="ts">
import { defineProps, computed } from 'vue';
import { TicketStatusType } from '@/views/TicketWallet.vue';

const props = defineProps<{
  name: string;
  img: string;
  date: string;
  total?: string;
  type: TicketStatusType | '';
}>();

const dateText = computed(() => {
  switch (props.type) {
    case TicketStatusType.NOTREDEEMED:
      return '截止';
    case TicketStatusType.REDEEMED:
      return '兌換';
    case TicketStatusType.EXPIRED:
      return '過期';
    default:
      return '';
  }
});
</script>

<template>
  <div class="base-ticket">
    <div class="base-ticket__main-content">
      <div class="flex justify-center items-center col-span-2">
        <img :src="props.img" :alt="props.name" class="rounded-md" />
      </div>
      <div class="flex flex-col justify-between col-span-3 px-3">
        <span class="font-semibold text-grey-800">{{ props.name }}</span>
        <span v-if="props.total" class="text-primary-500">{{ props.total }}張</span>
        <span class="text-sm text-grey-400">{{ props.date }} {{ dateText }}</span>
      </div>
    </div>
    <div class="rounded-[10px] flex items-center bg-white">
      <img src="@/assets/images/dash.svg" />
    </div>
    <img
      v-if="props.type === TicketStatusType.FINISHED || props.type === TicketStatusType.REDEEMED"
      src="@/assets/images/icon-approved.svg"
      width="100"
      height="70"
      class="absolute top-1/2 -translate-y-1/2 right-0 -rotate-12"
    />
  </div>
</template>

<style lang="postcss">
.base-ticket {
  @apply relative;
  @apply grid grid-cols-5;
  @apply bg-grey-100 rounded-[10px];
  @apply min-h-28;

  &__main-content {
    @apply col-span-4;
    @apply grid grid-cols-5;
    @apply bg-white rounded-[10px] py-4 px-2;
  }
}
</style>
