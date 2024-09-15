<script setup lang="ts">
import { ref } from 'vue';
import subscriptionItemListJson from '../../public/mock/subscription_item_list.json';

export interface SubscriptionItem {
  id: string;
  type_id: string;
  type_name: string;
  is_read: boolean;
  date: string;
  description: string;
}

const subscriptionItemList = ref<SubscriptionItem[]>(subscriptionItemListJson.data);
</script>

<template>
  <div class="flex justify-between items-center bg-primary-50 px-5 py-4">
    <span>訂閱服務將不定期發布</span>
    <router-link :to="{ name: 'subscription' }" class="flex items-center">
      <img src="@/assets/images/settings.png" width="20" alt="setting_icon" />
      <span class="ml-1">設定</span>
    </router-link>
  </div>
  <router-link
    :to="{ name: 'item-detail', params: { id: item.id } }"
    v-for="(item, index) in subscriptionItemList"
    :key="index"
    class="item"
    @click="item.is_read = true"
  >
    <div class="mx-6 py-4 pl-4 border-b border-grey-200">
      <div class="flex justify-between items-center">
        <h5 :class="{ 'unread-dot': !item.is_read, 'text-grey-400': item.is_read }">
          {{ item.type_name }}
        </h5>
        <span :class="item.is_read ? 'text-grey-200' : 'text-grey-400'">{{ item.date }}</span>
      </div>
      <p class="ine-clamp-2" :class="{ 'text-grey-400': item.is_read }">{{ item.description }}</p>
    </div>
  </router-link>
</template>

<style lang="postcss">
.item {
  @apply cursor-pointer;
  &:active {
    background-color: theme('colors.grey.200');
  }
}

.unread-dot {
  position: relative;
  &::before {
    content: '';
    position: absolute;
    left: -18px;
    top: 50%;
    transform: translateY(-50%);
    width: 8px;
    height: 8px;
    background-color: theme('colors.primary.500');
    border-radius: 50%; /* 圓形 */
  }
}
</style>
