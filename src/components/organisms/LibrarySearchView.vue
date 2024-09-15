<script setup lang="ts">
import { useLibraryStore } from '@/stores/library';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';

const libraryStore = useLibraryStore();
const { bookList, libraryNoticeList } = storeToRefs(libraryStore);

/** 新書介紹 */
const libraryNewBookList = computed(() => {
  return bookList.value
    .filter((item) => item.click_count >= 0)
    .sort((a, b) => new Date(b.publish_date).valueOf() - new Date(a.publish_date).valueOf())
    .slice(0, 20);
});

/** 點閱排行 */
const libraryRankingList = computed(() => {
  return bookList.value
    .filter((item) => item.click_count >= 0)
    .sort((a, b) => b.click_count - a.click_count)
    .slice(0, 5);
});
</script>

<template>
  <!-- 關鍵字搜尋 -->
  <div class="p-4">
    <router-link :to="{ name: 'library-keyword-search' }" class="search-bar">
      <img
        src="@/assets/images/search-icon-dark.svg"
        width="24"
        class="mr-2"
        alt="search-icon-dark"
      />
      <span>關鍵字搜尋</span>
    </router-link>
  </div>
  <!-- 新書介紹 -->
  <div class="p-4">
    <h5 class="section-title">新書介紹</h5>
    <div class="flex overflow-x-auto py-4">
      <div class="flex-shrink-0 w-1/3" v-for="(item, index) in libraryNewBookList" :key="index">
        <router-link :to="{ name: 'library-book-detail', params: { id: item.id } }">
          <div class="thumbnail">
            <img :src="item.thumbnail" v-if="item.thumbnail" alt="thumbnail" />
            <div v-else class="bg-grey-100 w-full h-full"></div>
          </div>
          <p class="line-clamp-2">{{ item.book_name }}</p>
          <p class="line-clamp-2 text-grey-400">著者：{{ item.author }}</p>
        </router-link>
      </div>
    </div>
  </div>
  <!-- 點閱排行 -->
  <div class="p-4">
    <div class="flex items-center">
      <h5 class="section-title">點閱排行</h5>
      <router-link :to="{ name: 'library-ranking-list' }" class="ml-auto text-primary-500">
        更多
      </router-link>
    </div>
    <div v-if="libraryRankingList.length">
      <div v-for="(item, index) in libraryRankingList" :key="index">
        <router-link :to="{ name: 'library-book-detail', params: { id: item.id } }" class="item">
          <div class="py-4 grid grid-cols-10 gap-2">
            <span class="flex items-center justify-center">{{ index + 1 }}</span>
            <div class="thumbnail col-span-2">
              <img :src="item.thumbnail" v-if="item.thumbnail" alt="thumbnail" />
              <div v-else class="bg-grey-100 w-full h-full"></div>
            </div>
            <div class="col-span-7 flex items-center">
              <div>
                <h5 class="ine-clamp-2 mb-1">{{ item.book_name }}</h5>
                <p class="text-grey-400">點閱次數：{{ item.click_count }}</p>
              </div>
            </div>
          </div>
        </router-link>
      </div>
    </div>
    <div v-else class="flex items-center justify-center mt-16">
      <div class="text-grey-400">
        <img
          src="@/assets/images/illustrations_no_data.svg"
          alt="illustrations_no_data"
          class="mx-auto"
        />
        <p class="text-center mb-2">目前無點閱排行</p>
      </div>
    </div>
  </div>
  <!-- 重要訊息 -->
  <div class="p-4">
    <div class="flex items-center">
      <h5 class="section-title">重要訊息</h5>
      <router-link :to="{ name: 'library-notice-list' }" class="ml-auto text-primary-500">
        更多
      </router-link>
    </div>
    <div v-if="libraryNoticeList.length">
      <div v-for="(item, index) in libraryNoticeList.slice(0, 3)" :key="index">
        <template v-if="item.is_open_outer_link">
          <a :href="item.outer_link" target="_blank" rel="noopener noreferrer">
            <div class="py-4 border-b border-grey-200">
              <h5 class="ine-clamp-2 mb-1">{{ item.title }}</h5>
              <p class="text-grey-400 text-sm">
                {{ item.date }}
              </p>
            </div>
          </a>
        </template>
        <template v-else>
          <router-link
            :to="{ name: 'library-notice-detail', params: { id: item.id } }"
            class="item"
          >
            <div class="py-4 border-b border-grey-200">
              <h5 class="ine-clamp-2 mb-1">{{ item.title }}</h5>
              <p class="text-grey-400 text-sm">
                {{ item.date }}
              </p>
            </div>
          </router-link>
        </template>
      </div>
    </div>
    <div v-else class="flex items-center justify-center my-4">
      <div class="text-grey-400">
        <img src="@/assets/images/info-icon-grey.svg" class="mx-auto" alt="info-icon" />
        <p class="text-center mt-2">系統忙碌中，無法顯示資訊，請稍後再試</p>
      </div>
    </div>
  </div>
</template>

<style lang="postcss">
.search-bar {
  @apply flex items-center;
  @apply rounded-lg bg-gray-100 text-grey-400;
  @apply p-2.5;
}

.section-title {
  @apply font-bold text-grey-900;
}

.thumbnail {
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
}
</style>
