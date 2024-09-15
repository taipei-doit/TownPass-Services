<script setup lang="ts">
import LibraryTabs from '@/components/molecules/LibraryTabs.vue';
import type { TabsProps } from '@/interfaces/tab-props.interface';
import { onMounted, watch } from 'vue';

const props = withDefaults(defineProps<TabsProps>(), {
  tabList: () => [
    {
      id: 1,
      title: '館藏查詢'
    },
    {
      id: 2,
      title: '我的紀錄'
    },
    {
      id: 3,
      title: '分館地圖'
    }
  ],
  contentType: false
});

const activeTab = defineModel({ default: 0 });
</script>

<template>
  <LibraryTabs v-model="activeTab" :tab-list="props.tabList" :contentType="props.contentType" />
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
  height: calc(100vh - 43px);
}

.tab-view {
  @apply flex-[0_0_100%];
  @apply transition-transform duration-300;
}
</style>
