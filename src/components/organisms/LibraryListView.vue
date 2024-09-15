<script setup lang="ts">
import BaseButton from '@/components/atoms/BaseButton.vue';
import type { Library } from '@/interfaces/library-book.interface';

const props = defineProps<{
  filteredLibraryList: Library[];
}>();
const emit = defineEmits(['update:isExpandList', 'update:selectedLibrary']);

const scrollToTop = () => {
  const containerTop = document.getElementById('container-top');
  if (containerTop) {
    containerTop.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
};
</script>

<template>
  <div id="container-top" class="flex flex-col container">
    <!-- title -->
    <div class="p-5">
      <div class="flex items-center mb-2">
        <span class="font-bold text-xl mr-2">分館與站點</span>
        <div class="text-primary-500 border border-primary-500 rounded-full px-2">
          {{ filteredLibraryList.length }}筆結果
        </div>
      </div>
    </div>
    <!-- list -->
    <div
      v-for="spot in filteredLibraryList"
      :key="spot.id"
      id="library-list"
      class="mx-5 py-4 border-b border-grey-200"
      @click="
        emit('update:isExpandList', false);
        emit('update:selectedLibrary', spot);
      "
    >
      <div class="flex items-center">
        <div class="flex-1">
          <p class="underline font-bold mb-2">{{ spot.name }}</p>
          <div class="flex mb-2">
            <img src="@/assets/images/icon-geo.svg" alt="" />
            <span>{{ spot.address }}</span>
          </div>
          <div class="flex text-grey-500">
            <span>{{ spot.distance }}公里</span>
          </div>
        </div>
        <img src="@/assets/images/down-icon.svg" class="-rotate-90" alt="icon-arrow" />
      </div>
    </div>
    <div v-if="!filteredLibraryList.length" class="flex-1 flex justify-center items-center">
      <div class="text-center">
        <img src="@/assets/images/img-maplost.svg" class="mx-auto mb-2" alt="" />
        <p class="text-primary-500 font-bold text-xl mb-2">無符合搜尋結果</p>
      </div>
    </div>

    <!-- 浮動按鈕 -->
    <BaseButton
      shape="rounded"
      class="fixed bottom-10 left-[50%] translate-x-[-50%] h-[56px]"
      @click="emit('update:isExpandList', false)"
    >
      <div class="flex px-2">
        <img src="@/assets/images/icon-map.svg" class="mr-2" width="24" alt="" />
        <span>地圖</span>
      </div>
    </BaseButton>
    <BaseButton
      shape="rounded"
      v-if="filteredLibraryList.length"
      class="fixed bottom-10 right-6 w-[56px] h-[56px]"
      @click="scrollToTop"
    >
      TOP
    </BaseButton>
  </div>
</template>

<style lang="postcss" scoped>
.container {
  height: calc(100vh - 43px);
  overflow-y: auto;
}
</style>
