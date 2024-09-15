<script setup lang="ts">
import type { TabsProps } from '@/interfaces/tab-props.interface';

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
  <section
    class="tabs"
    :class="{ '!grid-cols-3': tabList.length % 3 === 0, 'tabs__content-type': props.contentType }"
  >
    <button
      v-for="(item, index) in props.tabList"
      :key="item.id"
      class="tab-label"
      :class="{
        'tab-label--active': index === activeTab && !props.contentType,
        'tab-label__content-type': props.contentType,
        'tab-label__content-type--active': index === activeTab && props.contentType
      }"
      @click="activeTab = index"
    >
      {{ item.title }}
    </button>
    <div
      class="slider"
      :class="{ 'slider__content-type': props.contentType }"
      :style="{ transform: `translate(calc(100%*${activeTab}))` }"
    />
  </section>
</template>

<style lang="postcss">
.tabs {
  @apply grid grid-cols-2;
  @apply px-4 pt-2;
  @apply border-b border-b-grey-300;

  &__content-type {
    @apply px-0;
  }
}

.tab-label {
  @apply text-grey-700 bg-white font-bold mb-2;

  &__content-type {
    @apply rounded-t-[10px] border-x border-t border-grey-200;
    @apply px-3 py-2 mb-0;
    @apply transition-colors;

    &--active {
      @apply bg-primary-50 border-transparent;
    }
  }

  &--active {
    @apply text-primary-500;
  }
}

.slider {
  @apply relative bottom-0;
  @apply transition-all duration-500;
  @apply bg-primary-500;
  @apply w-full h-0.5;

  &__content-type {
    @apply bg-[#5AB4C5];
  }
}
</style>
