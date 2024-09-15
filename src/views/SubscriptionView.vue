<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import subscriptionListJson from '../../public/mock/subscription_list.json';
import BaseButton from '@/components/atoms/BaseButton.vue';
import { useConnectionMessage } from '@/composables/useConnectionMessage';

export interface Subscription {
  id: string;
  name: string;
  is_subscribed: boolean;
  is_expand: boolean;
  icon: string;
  description?: string;
}

const subscriptionList = ref<Subscription[]>(subscriptionListJson.data.data);

const subscriptionCount = computed(() => {
  return subscriptionList.value.filter((item) => item.is_subscribed).length;
});

onMounted(() => {
  subscriptionList.value = localStorage.getItem('subscriptionList')
    ? JSON.parse(localStorage.getItem('subscriptionList')!)
    : subscriptionListJson.data.data;

  subscriptionList.value.forEach((item) => {
    item.is_expand = false;
  });
});

/**
 * 點擊訂閱/取消訂閱
 */
const onSubmitClick = async (subscription: Subscription) => {
  subscription.is_subscribed = !subscription.is_subscribed;
  useConnectionMessage('notify', {
    title: '訂閱通知',
    content: `已${subscription.is_subscribed ? '訂閱' : '取消訂閱'}${subscription.name}`
  });

  localStorage.setItem('subscriptionList', JSON.stringify(subscriptionList.value));

  /**
   * 註解區塊是串接訂閱通知 API 的範例
   * 透過 JS 原生 fetch 做串接
   * 開發者可以用自己習慣的方式去做 API 串接
   * 例如：axios 等
   */
  // try {
  //   const response = await fetch(subscriptionListJson.data.submit_target.url, {
  //     method: subscriptionListJson.data.submit_target.method,
  //     headers: {
  //       'Content-Type': subscriptionListJson.data.submit_target.content_type
  //     },
  //     body: JSON.stringify(subscription)
  //   });
  //   if (!response.ok) {
  //     throw new Error(`request error: ${response.status}!!`);
  //   }
  //   const responseData = await response.json();
  //   console.log('responseData: ', responseData);
  // } catch (error) {
  //   console.log('error:', error);
  // }
};
</script>

<template>
  <div class="h-screen px-5 py-8 bg-grey-50 overflow-y-auto">
    <h5 class="text-primary-500 mb-8 text-[26px] title">訂閱臺北市政府最新消息</h5>
    <p class="text-grey-700 mb-4">您已訂閱 {{ subscriptionCount }} 項</p>
    <div
      class="subscription-wrapper"
      :class="{
        active: subscription.is_subscribed
      }"
      v-for="(subscription, index) in subscriptionList"
      :key="index"
      @click="subscription.is_expand = !subscription.is_expand"
    >
      <div class="card-header">
        <img :src="subscription.icon" class="icon" :alt="subscription.name" />
        <span>{{ subscription.name }}</span>
      </div>

      <div
        class="grid grid-rows-[0fr] transition-all"
        :class="{
          'grid-rows-[1fr]': subscription.is_expand
        }"
      >
        <div class="overflow-hidden">
          <div class="p-2">
            <p class="mb-4">{{ subscription.description }}</p>
            <BaseButton
              :shape="'rounded'"
              class="w-full card-button"
              @click="onSubmitClick(subscription)"
              v-if="!subscription.is_subscribed"
            >
              訂閱
            </BaseButton>
            <BaseButton
              outline
              :shape="'rounded'"
              class="w-full card-button"
              @click="onSubmitClick(subscription)"
              v-if="subscription.is_subscribed"
            >
              取消訂閱
            </BaseButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="postcss">
.title {
  position: relative;
  display: inline-block;
}

.title::after {
  content: '';
  display: block;
  width: 20%;
  height: 3px; /* 底線的粗細 */
  background-color: currentColor;
  position: absolute;
  left: 0;
  bottom: -12px; /* 根據需要調整底線與標題之間的距離 */
}

.subscription-wrapper {
  @apply relative p-5 mb-3 bg-white rounded-md shadow-md;

  .icon {
    @apply w-12 h-12 mr-3 p-2;
  }

  &.active {
    @apply border-2 border-primary-500;
    @apply after:content-[''] after:w-8 after:h-8;
    @apply after:bg-[url('@/assets/images/checkbox-checked.svg')] after:bg-cover after:bg-no-repeat;
    @apply after:block after:absolute after:-top-4 after:-right-4;
  }
}

.card-header {
  @apply flex items-center;
}

.card-button {
  padding: 4px;
}
</style>
