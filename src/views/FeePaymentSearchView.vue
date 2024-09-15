<script setup lang="ts">
import { ref, onMounted } from 'vue';
import BaseInput from '@/components/atoms/BaseInput.vue';

import { useRoute } from 'vue-router';
import { useFeePaymentStore } from '@/stores/fee-payment';
import { storeToRefs } from 'pinia';
import type { FeePayment } from '@/interfaces/fee-payment.interface';

const route = useRoute();
const paymentStore = useFeePaymentStore();
const { paymentList } = storeToRefs(paymentStore);

const searchText = ref('');

/** 搜尋紀錄列表 */
const searchHistoryList = ref<string[]>(
  localStorage.getItem('paymentTypeSearchHistory')
    ? JSON.parse(localStorage.getItem('paymentTypeSearchHistory')!)
    : []
);

/** 搜尋結果列表 */
const searchResultList = ref<FeePayment[]>([]);
const isSearchClicked = ref(false);

const clearSearchHistory = () => {
  localStorage.removeItem('paymentTypeSearchHistory');
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
    localStorage.setItem('paymentTypeSearchHistory', JSON.stringify(searchHistoryList.value));
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
  // const queryParams = { search: searchText.value, type: searchType.value };
  // router.push({ name: 'library-keyword-search', query: queryParams });

  // 將所有內層的 data 陣列合併成一個新陣列
  const concatenatedData = paymentList.value.flatMap((item) => item.data);

  searchResultList.value = concatenatedData.filter((item: any) => {
    return item.name.includes(searchText.value);
  });

  console.log(searchResultList.value);
};

onMounted(() => {});
</script>

<template>
  <div class="p-4">
    <!-- search bar -->
    <div class="flex mb-4">
      <BaseInput
        v-model="searchText"
        placeholder="搜尋繳費關鍵字"
        class="flex-grow"
        @focus="isSearchClicked = false"
      />
      <button class="search-button" @click="onSearchClick">
        <img src="@/assets/images/search-icon.svg" alt="搜尋" />
      </button>
    </div>
    <!-- search history -->
    <template v-if="!isSearchClicked">
      <div class="flex mb-4">
        <span>歷史紀錄</span>
        <a href="" class="ml-auto underline" @click.prevent="clearSearchHistory">清除</a>
      </div>
      <ul>
        <li v-for="(keyword, index) in searchHistoryList" :key="index">
          <a
            href="javascript:void(0)"
            class="w-full inline-block my-2"
            @click="saveKeywordClick(keyword)"
          >
            {{ keyword }}
          </a>
        </li>
      </ul>
    </template>
    <!-- 搜尋結果 -->
    <template v-else>
      <p class="font-semibold mb-4">查詢結果</p>
      <router-link
        :to="{ name: 'fee-payment-detail', params: { id: item.id } }"
        v-for="(item, index) in searchResultList"
        :key="index"
      >
        <div class="my-2">
          {{ item.name }}
        </div>
      </router-link>
      <div v-if="!searchResultList.length" class="flex flex-col justify-center items-center pt-40">
        <img src="@/assets/images/img-info.svg" class="w-36" />
        <p class="text-primary-500 font-semibold text-2xl">無符合的搜尋結果</p>
        <p class="text-gray-400 text-sm mt-2 font-semibold">請試試其他關鍵字</p>
      </div>
    </template>
  </div>
</template>

<style lang="postcss">
.search-bar {
  @apply flex items-center;
  @apply rounded-lg bg-gray-100 text-grey-400;
  @apply p-2.5;
}
</style>
