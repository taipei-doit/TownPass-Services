<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import BaseCheckbox from '@/components/atoms/BaseCheckbox.vue';
import BaseSelect from '@/components/atoms/BaseSelect.vue';
import BaseDialog from '@/components/atoms/BaseDialog.vue';
import BaseButton from '@/components/atoms/BaseButton.vue';
import LibrarySelectDialog from '@/components/molecules/LibrarySelectDialog.vue';
import { useLibraryStore } from '@/stores/library';
import { storeToRefs } from 'pinia';
import { useRoute, useRouter } from 'vue-router';
import type { LibraryRecords } from '@/interfaces/library-records.interface';
import type { BookSeries, Library } from '@/interfaces/library-book.interface';
import { BookStatusEnum } from '@/enums/book-status.enum';

const router = useRouter();
const route = useRoute();

const libraryStore = useLibraryStore();
const { bookList, libraryRecordsOrdering } = storeToRefs(libraryStore);

const bookItem = computed(() => bookList.value.find((item) => item.id === route.params.id)!);

const seriesModel = ref<string[]>([]);

/** 預約冊數上限 */
const reservationLimit = ref(7);

/** 已選擇的取書館 id */
const selectedLibraryId = ref('');

/** 該藏書取書館選項 */
const libraryOptions = computed(() => {
  return bookItem.value.libraries.map((item) => ({
    label: item.name,
    value: item.id
  }));
});

const isAlertDialogOpen = ref(false);
const isCheckDialogOpen = ref(false);
const isErrorDialogOpen = ref(false);
const isGoLibraryAlertDialogOpen = ref(false);
const isLibrarySelectDialogOpen = ref(false);

/** 預約成功數 */
const successCount = ref(0);
/** 預約失敗原因 */
const errorMessage = ref('');

onMounted(() => {
  if (bookItem.value.series.length === 1) {
    seriesModel.value.push(bookItem.value.series[0].id);
  }
});

const checkLimit = (id: string) => {
  // 檢查當前選中的數量是否超出限制
  if (seriesModel.value.length >= reservationLimit.value && !seriesModel.value.includes(id)) {
    isAlertDialogOpen.value = true; // 如果超出限制，打開對話框
  } else {
    // 如果未超出限制，繼續勾選
    const index = seriesModel.value.indexOf(id);
    if (index === -1) {
      seriesModel.value.push(id); // 添加勾選
    } else {
      seriesModel.value.splice(index, 1); // 取消勾選
    }
  }
};

/**
 * 點擊預約
 */
const onSubmitClick = async () => {
  const selectedLibrary: Library = bookItem.value.libraries.find(
    (item) => item.id === selectedLibraryId.value
  )!;
  const selectedSeries: BookSeries[] = bookItem.value.series.filter((item) =>
    seriesModel.value.includes(item.id)
  );
  const now = new Date();

  // 檢查每一個 seriesItem 是否已預約，並將未重複的項目存入新陣列
  const newReservations = selectedSeries.filter((seriesItem) => {
    return !libraryRecordsOrdering.value.some((existingitem: LibraryRecords) => {
      return existingitem.record_id === seriesItem.book_id + seriesItem.id;
    });
  });
  successCount.value = newReservations.length;

  // 如果沒有新項目可預約，表示全部重複
  if (newReservations.length === 0) {
    isErrorDialogOpen.value = true;
    errorMessage.value = '已預約相同卷期';
    return;
  } else if (newReservations.length <= seriesModel.value.length) {
    // 如果部分預約成功，部分失敗 or 全部預約成功
    isCheckDialogOpen.value = true;
  }

  // 準備存入的 body，僅包含不重複的預約項目
  const body: LibraryRecords[] = newReservations.map((item) => ({
    ...bookItem.value,
    record_id: item.book_id + item.id,
    call_number: bookItem.value.call_number + item.series＿name,
    selected_library: selectedLibrary,
    status: BookStatusEnum.Reserved,
    extend_count: 0,
    reservation_order: item.waiting_people + 1,
    reservation_date: `${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()}` // 預約當下日期
  }));

  console.log('request body:', body);

  /**
   * 以下為展示用假資料，真正實作後可刪除
   */
  libraryRecordsOrdering.value = [...body, ...libraryRecordsOrdering.value];
  // 從 localStorage 中獲取現有的 libraryRecordsOrdering
  const existingRecords = localStorage.getItem('libraryRecordsOrdering');
  // 檢查是否已有值
  if (existingRecords) {
    // 將現有資料解析為陣列
    const recordsArray = JSON.parse(existingRecords);
    // 將新的預約插入到陣列的前方
    const updatedRecordsArray = [...body, ...recordsArray];

    // 將更新後的陣列儲存回 localStorage
    localStorage.setItem('libraryRecordsOrdering', JSON.stringify(updatedRecordsArray));
  } else {
    // 若沒有現有資料，直接將 body 存為陣列並存入 localStorage
    localStorage.setItem('libraryRecordsOrdering', JSON.stringify(body));
  }

  isCheckDialogOpen.value = true;

  // /**
  //  * 註解區塊是串接提交表單 API 的範例
  //  * 透過 JS 原生 fetch 做串接
  //  * 開發者可以用自己習慣的方式去做 API 串接
  //  * 例如：axios 等
  //  */
  // try {
  //   const response = await fetch('url_custom_url', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json'
  //     },
  //     body: JSON.stringify(body)
  //   });

  //   if (!response.ok) {
  //     throw new Error(`request error: ${response.status}!!`);
  //   }

  //   const responseData = await response.json();
  //   console.log('success:', responseData);
  //   // isFinishDialogOpen.value = true;
  // } catch (error) {
  //   console.log('error:', error);
  // }
};

/** 外連圖書館網站 */
const goOuterLibrary = () => {
  console.log('goOuterLibrary');

  const a = document.createElement('a');
  a.href = 'https://book.tpml.edu.tw/index';
  a.target = '_blank';
  a.click();
};
</script>

<template>
  <div class="h-screen px-5 py-8 overflow-y-auto">
    <!-- 書籍介紹 -->
    <div class="grid grid-cols-3 gap-4">
      <div class="thumbnail mb-2">
        <img :src="bookItem.thumbnail" v-if="bookItem.thumbnail" alt="thumbnail" />
        <div v-else class="bg-grey-100 w-full h-full"></div>
      </div>
      <p class="col-span-2">{{ bookItem.book_name }}</p>
    </div>
    <p>著者：{{ bookItem.author }}</p>
    <p>出版項：{{ bookItem.publisher }}</p>
    <p>主題：{{ bookItem.subject }}</p>
    <p>ISBN：{{ bookItem.isbn }}</p>
    <hr class="my-4" />
    <!-- 集數預約 -->
    <div class="mb-40">
      <template v-if="bookItem.series.length">
        <div
          v-for="(seriesItem, index) in bookItem.series.slice().reverse()"
          :key="index"
          class="flex items-center justify-between mb-4"
        >
          <label
            :for="seriesItem.id"
            :class="
              seriesModel.includes(seriesItem.id) && bookItem.series.length > 1
                ? 'text-primary-500'
                : ''
            "
            class="flex-grow"
            @click.prevent="checkLimit(seriesItem.id)"
          >
            {{ seriesItem.series＿name }}
            <span v-if="bookItem.series.length > 1">;</span>
            預約等待人數：{{ seriesItem.waiting_people }}
          </label>
          <div class="ml-auto flex items-center flex-shrink-0">
            <span class="tag mr-2 whitespace-nowrap" v-if="seriesItem.is_hot">熱門館藏</span>
            <BaseCheckbox
              :option="{
                label: '',
                value: seriesItem.id
              }"
              v-if="bookItem.series.length > 1"
              v-model="seriesModel"
              @click.prevent="checkLimit(seriesItem.id)"
            />
          </div>
        </div>
      </template>
      <template v-else>
        <p>本館藏不提供預約</p>
      </template>
    </div>
    <!-- 預約按鈕 -->
    <div
      class="bg-white fixed bottom-0 left-0 right-0 p-4 shadow-[0_-5px_10px_-8px_rgba(0,0,0,0.3)]"
    >
      <div v-if="bookItem.series.length">
        <p class="font-bold mb-2">取書館</p>
        <BaseSelect
          v-model="selectedLibraryId"
          :selectId="bookItem.id"
          :options="libraryOptions"
          :customClass="'bg-white pr-9 pointer-events-none'"
          default-selected="請選擇取書館"
          class="w-full mb-2"
          @click.stop="isLibrarySelectDialogOpen = true"
        />
      </div>
      <BaseButton
        class="w-full"
        :disabled="!selectedLibraryId || seriesModel.length === 0"
        @click="onSubmitClick()"
      >
        預約
      </BaseButton>
    </div>

    <LibrarySelectDialog
      v-model="isLibrarySelectDialogOpen"
      :libraries="bookItem.libraries"
      @confirm="(inputValue: string) => (selectedLibraryId = inputValue)"
    />

    <BaseDialog
      v-model="isAlertDialogOpen"
      title="提醒"
      :content="`您的已預約及預約冊數，已達上限${reservationLimit}冊`"
      :isAlert="true"
      positiveText="關閉"
      @onPositiveClick="() => (isAlertDialogOpen = false)"
    />
    <BaseDialog
      v-model="isCheckDialogOpen"
      title="預約成功"
      :isSlot="true"
      content=""
      :isCheck="true"
      negativeText="返回首頁"
      positiveText="查看預約清單"
      @onNegativeClick="() => router.push({ name: 'library-service' })"
      @onPositiveClick="() => router.push({ name: 'library-service', query: { type: 1 } })"
    >
      <template #content>
        <div class="text-center">
          <p>本次預約成功 {{ successCount }} 筆</p>
          <p>
            取書館：{{ bookItem.libraries.find((item) => item.id === selectedLibraryId)?.name }}
          </p>
          <p>
            到館通知：目前無通知。可前往<a
              href="javascript:void(0);"
              @click.prevent="
                isGoLibraryAlertDialogOpen = true;
                isCheckDialogOpen = false;
              "
              target="_blank"
              class="underline text-primary-500"
              tabindex="0"
              >圖書館</a
            >
            登入個人書房，設定通知方式。
          </p>
        </div>
      </template>
    </BaseDialog>
    <BaseDialog
      v-model="isErrorDialogOpen"
      title="預約失敗"
      :is-slot="true"
      content=""
      :is-error="true"
      negativeText="返回首頁"
      positiveText="查看預約清單"
      @onNegativeClick="() => router.push({ name: 'library-service' })"
      @onPositiveClick="() => router.push({ name: 'library-service', query: { type: 1 } })"
    >
      <template #content>
        <div class="text-center">
          <p>本次預約失敗 {{ seriesModel.length }} 筆</p>
          <p>題名：{{ bookItem.book_name }}</p>
          <p>原因：{{ errorMessage }}</p>
        </div>
      </template>
    </BaseDialog>
    <BaseDialog
      v-model="isGoLibraryAlertDialogOpen"
      title="提醒"
      :content="'即將離開城市通\n前往圖書館藏查詢系統'"
      :isAlert="true"
      negativeText="取消"
      positiveText="確認"
      @onNegativeClick="
        () => {
          isGoLibraryAlertDialogOpen = false;
          isCheckDialogOpen = true;
        }
      "
      @onPositiveClick="() => goOuterLibrary()"
    />
  </div>
</template>

<style lang="postcss" scoped>
.tag {
  @apply bg-[#65A91E] text-white text-sm px-2 py-1 rounded-lg;
}
</style>
