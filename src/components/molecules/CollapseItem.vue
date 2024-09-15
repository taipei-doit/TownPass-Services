<script setup lang="ts">
const props = defineProps<{
  item: {
    id: string;
    icon: string | null | undefined;
    name: string;
    [key: string]: any;
  };
}>();

const activeCategory = defineModel({ default: '' });

const onCategoryClick = (id: string) => {
  if (activeCategory.value === id) {
    activeCategory.value = '';
  } else {
    activeCategory.value = id;
  }
};
</script>

<template>
  <li>
    <button class="w-full flex justify-between" @click="onCategoryClick(item.id)">
      <div class="flex">
        <img
          v-if="props.item.icon"
          :src="props.item.icon"
          :alt="item.name"
          width="20"
          height="20"
          class="size-5"
        />
        <span class="text-sm font-semibold ml-1.5">{{ item.name }}</span>
      </div>
      <img
        src="@/assets/images/down-icon.svg"
        class="transition-transform"
        :class="{
          'rotate-180': activeCategory === item.id
        }"
      />
    </button>
    <div
      class="grid grid-rows-[0fr] transition-all"
      :class="{
        'grid-rows-[1fr]': activeCategory === item.id
      }"
    >
      <div class="overflow-hidden flex flex-col gap-y-5 pt-3">
        <slot :item="item"></slot>
      </div>
    </div>
    <slot name="extra" :item="item"></slot>
  </li>
</template>
