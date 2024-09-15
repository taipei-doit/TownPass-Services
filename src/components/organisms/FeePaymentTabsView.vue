<script setup lang="ts">
import FeePaymentTabs from '@/components/molecules/FeePaymentTabs.vue';
import type { TabsProps } from '@/interfaces/tab-props.interface';

const props = withDefaults(defineProps<TabsProps>(), {
  tabList: () => [],
  contentType: false
});

const activeTab = defineModel({ default: 0 });
</script>

<template>
  <FeePaymentTabs v-model="activeTab" :tab-list="props.tabList" :contentType="props.contentType" />
  <section class="tab-view-container">
    <div
      v-for="(item, index) in props.tabList"
      :key="item.id"
      class="tab-view"
      :style="{ transform: `translate(calc(-100%*${activeTab}))` }"
    >
      <slot :name="`tab${index}`"> tab {{ item.title }} </slot>
    </div>
  </section>
</template>

<style lang="postcss" scoped>
.tab-view-container {
  @apply flex flex-nowrap overflow-x-hidden;
  height: calc(100vh - 83px);
}

.tab-view {
  @apply flex-[0_0_100%];
  @apply transition-transform duration-300;
}
</style>
