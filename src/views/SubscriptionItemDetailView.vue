<script setup lang="ts">
import { computed, ref } from 'vue';
import subscriptionItemListJson from '../../public/mock/subscription_item_list.json';
import BaseButton from '@/components/atoms/BaseButton.vue';
import type { SubscriptionItem } from './SubscriptionItemListView.vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const subscriptionItemList = ref<SubscriptionItem[]>(subscriptionItemListJson.data);
const counterItem = computed(
  () => subscriptionItemList.value.find((item) => item.id === route.params.id)!
);
</script>

<template>
  <div class="h-screen px-5 py-8 bg-grey-50 overflow-y-auto">
    <p class="mb-2 font-bold text-lg">{{ counterItem.type_name }}</p>
    <p :innerHTML="counterItem.description" class="break-words sub-item-description"></p>
    <p class="mt-4 text-grey-400">{{ counterItem.date }}</p>
  </div>
</template>

<style lang="postcss">
.sub-item-description a {
  @apply text-primary-500;
}
</style>
