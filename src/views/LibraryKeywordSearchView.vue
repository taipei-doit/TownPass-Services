<script setup lang="ts">
import { useLibraryStore } from '@/stores/library';
import { storeToRefs } from 'pinia';
import { computed, onMounted, ref, watch } from 'vue';
import BaseInput from '@/components/atoms/BaseInput.vue';
import BaseSelect from '@/components/atoms/BaseSelect.vue';
import type { LibraryBook } from '@/interfaces/library-book.interface';
import { useRoute, useRouter } from 'vue-router';

const libraryStore = useLibraryStore();
const { bookList, hotKeywordList } = storeToRefs(libraryStore);

const router = useRouter();
const route = useRoute();

const searchType = ref('all');
const searchText = ref('');

/** 搜尋類別選項 */
const typeOptions = ref([
  {
    label: '全部',
    value: 'all'
  },
  {
    label: '書名',
    value: 'book_name'
  },
  {
    label: '著者',
    value: 'author'
  },
  {
    label: '出版項',
    value: 'publisher'
  },
  {
    label: '主題',
    value: 'subject'
  },
  {
    label: 'ISBN',
    value: 'isbn'
  }
]);

/** 搜尋紀錄列表 */
const searchHistoryList = ref<any[]>(
  localStorage.getItem('librarySearchHistory')
    ? JSON.parse(localStorage.getItem('librarySearchHistory')!)
    : []
);

/** 搜尋結果列表 */
const searchResultList = ref<LibraryBook[]>([]);
const isSearchClicked = ref(false);

const clearSearchHistory = () => {
  localStorage.removeItem('librarySearchHistory');
  searchHistoryList.value = [];
};

/** 儲存關鍵字 */
const saveKeywordClick = (keyword: string) => {
  // 移除空白並檢查是否為空
  const trimmedKeyword = keyword.trim();
  if (trimmedKeyword === '') return;

  searchText.value = trimmedKeyword;

  // 檢查是否已經存在具有相同關鍵字
  const isKeywordExist = searchHistoryList.value.some((item: string) => item === trimmedKeyword);
  // 如果不存在，才推入
  if (!isKeywordExist) {
    // 若列表超過10筆，刪除最後一筆
    if (searchHistoryList.value.length >= 10) {
      searchHistoryList.value.pop();
    }
    // 新關鍵字插入到最前面
    searchHistoryList.value.unshift(trimmedKeyword);
    localStorage.setItem('librarySearchHistory', JSON.stringify(searchHistoryList.value));
  }

  search();
};

const onSearchClick = () => {
  saveKeywordClick(searchText.value);
  search();
};

const search = () => {
  isSearchClicked.value = true;
  searchResultList.value = [];

  // 更新網址上的搜尋參數
  const queryParams = { search: searchText.value, type: searchType.value };
  router.push({ name: 'library-keyword-search', query: queryParams });

  // 針對類別與關鍵字做查詢
  if (searchType.value === 'all') {
    searchResultList.value = bookList.value.filter((item: LibraryBook) => {
      return (
        item.book_name.includes(searchText.value) ||
        item.author.includes(searchText.value) ||
        item.publisher.includes(searchText.value) ||
        item.subject.includes(searchText.value) ||
        item.isbn.includes(searchText.value)
      );
    });
    return;
  } else {
    switch (searchType.value) {
      case 'book_name':
        searchResultList.value = bookList.value.filter((item: LibraryBook) =>
          item.book_name.includes(searchText.value)
        );
        break;
      case 'author':
        searchResultList.value = bookList.value.filter((item: LibraryBook) =>
          item.author.includes(searchText.value)
        );
        break;
      case 'publisher':
        searchResultList.value = bookList.value.filter((item: LibraryBook) =>
          item.publisher.includes(searchText.value)
        );
        break;
      case 'subject':
        searchResultList.value = bookList.value.filter((item: LibraryBook) =>
          item.subject.includes(searchText.value)
        );
        break;
      case 'isbn':
        searchResultList.value = bookList.value.filter((item: LibraryBook) =>
          item.isbn.includes(searchText.value)
        );
        break;
      default:
        break;
    }
  }

  console.log(searchResultList.value);
};

const resetState = () => {
  searchText.value = '';
  searchType.value = 'all';
  searchResultList.value = [];
  isSearchClicked.value = false;
};

onMounted(() => {
  console.log(router.currentRoute.value.query);

  if (router.currentRoute.value.query.search) {
    searchText.value = router.currentRoute.value.query.search as string;
    searchType.value = router.currentRoute.value.query.type as string;
    search();
  } else {
    resetState();
  }
});

// 監聽查詢參數變更
watch(
  () => route.query,
  (newQuery) => {
    if (!newQuery.search) {
      resetState();
    }
  }
);
</script>

<template>
  <div class="p-4">
    <!-- search bar -->
    <div class="flex mt-2">
      <BaseSelect
        v-model="searchType"
        :selectId="searchType"
        :options="typeOptions"
        class="w-[100px]"
      />
      <BaseInput v-model="searchText" placeholder="輸入關鍵字" class="flex-grow" />
      <button class="search-button" @click="onSearchClick">
        <img src="@/assets/images/search-icon.svg" alt="搜尋" />
      </button>
    </div>
    <!-- 搜尋結果 -->
    <template v-if="isSearchClicked">
      <div v-for="(item, index) in searchResultList" :key="index">
        <router-link :to="{ name: 'library-book-detail', params: { id: item.id } }" class="item">
          <div class="py-4 grid grid-cols-10 gap-2">
            <div class="thumbnail col-span-2">
              <img :src="item.thumbnail" v-if="item.thumbnail" alt="thumbnail" />
              <div v-else class="bg-grey-100 w-full h-full"></div>
            </div>
            <div class="col-span-8 flex items-center">
              <div>
                <h5 class="ine-clamp-2 mb-1">{{ item.book_name }}</h5>
                <p class="text-grey-400">著者：{{ item.author }}</p>
                <p class="text-grey-400">出版項：{{ item.publisher }}</p>
              </div>
            </div>
          </div>
        </router-link>
      </div>
      <div v-if="!searchResultList.length" class="flex items-center justify-center my-4">
        <div class="text-grey-400">
          <img src="@/assets/images/illustrations_no_data.svg" class="mx-auto" alt="nodata-icon" />
          <p class="text-center mt-2">查無資料</p>
        </div>
      </div>
    </template>
    <template v-else>
      <!-- 最近搜尋 -->
      <template v-if="searchHistoryList.length">
        <div class="flex items-center">
          <h5 class="section-title py-4">最近搜尋</h5>
          <a href="javascript:void(0)" class="ml-auto text-primary-500" @click="clearSearchHistory">
            清除紀錄
          </a>
        </div>
        <ul>
          <li v-for="(keyword, index) in searchHistoryList" :key="index" class="mb-2">
            <a
              href="javascript:void(0)"
              class="w-full inline-block"
              @click="saveKeywordClick(keyword)"
            >
              {{ keyword }}
            </a>
          </li>
        </ul>
        <hr class="my-4" />
      </template>
      <!-- 熱門關鍵字 -->
      <h5 class="section-title py-4">熱門關鍵字</h5>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="(keyword, index) in hotKeywordList"
          :key="index"
          class="hot-keyword"
          @click="saveKeywordClick(keyword)"
        >
          {{ keyword }}
        </button>
      </div>
    </template>
  </div>
</template>

<style lang="postcss" scoped>
.hot-keyword {
  @apply px-4 py-2;
  @apply bg-grey-50 rounded-xl;
  @apply flex-shrink-0;
  @apply whitespace-nowrap;
}
</style>
