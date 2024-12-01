<script setup lang="ts">
import BaseSelect from '@/components/atoms/BaseSelect.vue';
import BaseDialog from '@/components/atoms/BaseDialog.vue';
import type { LibraryBook } from '@/interfaces/library-book.interface';
import { useLibraryStore } from '@/stores/library';
import { storeToRefs } from 'pinia';
import { computed, onMounted, ref } from 'vue';
import { useConnectionMessage } from '@/composables/useConnectionMessage';
import type { LibraryRecords } from '@/interfaces/library-records.interface';
import { useRouter } from 'vue-router';

const router = useRouter();
const libraryStore = useLibraryStore();
const {
  reservationRecords,
  libraryRecordsOrdering,
  borrowingRecords,
  noPickupRecords,
  historyRecords
} = storeToRefs(libraryStore);

/** 清單選項 */
const listOptions = ref([
  {
    label: '預約清單',
    value: 'reservation-list'
  },
  {
    label: '預約未取紀錄',
    value: 'reservation-not-take-records'
  },
  {
    label: `借閱中${borrowingRecords.value.length > 0 ? `(${borrowingRecords.value.length})` : ''}`,
    value: 'borrowing-list'
  },
  {
    label: `借閱歷史紀錄${historyRecords.value.length > 0 ? `(${historyRecords.value.length})` : ''}`,
    value: 'borrow-history-list'
  }
]);

const selectedListId = ref('reservation-list');

const expandList = ref<string[]>([]);
const expandListSet = computed(() => new Set(expandList.value.map((name) => name)));

const isMapDialogOpen = ref(false);
const isExtensionDialogOpen = ref(false);
const isExtensionSuccessDialogOpen = ref(false);
const isCancelDialogOpen = ref(false);

const onExpandClick = (name: string) => {
  if (expandListSet.value.has(name)) {
    const index = expandList.value.findIndex((el) => el === name);
    expandList.value.splice(index, 1);
  } else {
    expandList.value.push(name);
  }
};

const onMapOpenClick = (subItem?: LibraryRecords) => {
  useConnectionMessage('launch_map', subItem?.selected_library.address.map);
};

const selectedSubItem = ref<LibraryRecords>();

/** 延長兩日 */
const extendReservation = (subItem?: LibraryRecords) => {
  console.log('extendReservation:', subItem);

  if (subItem!.extend_count < 1) {
    subItem!.extend_count = subItem!.extend_count + 1;
    const extendDate = new Date(subItem!.pickup_end_date!).setDate(
      new Date(subItem!.pickup_end_date!).getDate() + 2
    );
    subItem!.pickup_end_date = `${new Date(extendDate).getFullYear()}/${new Date(extendDate).getMonth() + 1}/${new Date(extendDate).getDate()}`;
    isExtensionSuccessDialogOpen.value = true;
  }
};

/** 取消預約 */
const cancelReservation = (subItem?: LibraryRecords) => {
  libraryRecordsOrdering.value = libraryRecordsOrdering.value.filter(
    (item) => item.record_id !== subItem!.record_id
  );

  localStorage.setItem('libraryRecordsOrdering', JSON.stringify(libraryRecordsOrdering.value));
};

/** 預設降冪排序 */
const historyRecordsOrder = ref('desc');
/** 排序借閱歷史紀錄 */
const sortHistoryRecords = () => {
  historyRecords.value.sort((a, b) => {
    if (historyRecordsOrder.value === 'desc') {
      return new Date(b.pickup_date!).valueOf() - new Date(a.pickup_date!).valueOf();
    } else {
      return new Date(a.pickup_date!).valueOf() - new Date(b.pickup_date!).valueOf();
    }
  });
  historyRecordsOrder.value = historyRecordsOrder.value === 'desc' ? 'asc' : 'desc';
};

onMounted(() => {
  // 歷史紀錄預設降冪排序
  sortHistoryRecords();
  /**
   * 以下為展示用假資料，真正實作後可刪除
   */
  // 從 localStorage 中獲取現有的 libraryRecordsOrdering
  const existingRecords = localStorage.getItem('libraryRecordsOrdering');
  // 檢查是否已有值
  if (existingRecords) {
    // 將現有資料解析為陣列
    const recordsArray = JSON.parse(existingRecords);
    libraryRecordsOrdering.value = recordsArray;
  }
});
</script>

<template>
  <div class="p-4">
    <BaseSelect
      v-model="selectedListId"
      :selectId="'reservation-list'"
      :options="listOptions"
      :customClass="'bg-white pr-9'"
      class="w-full mb-2"
    />
    <template v-if="selectedListId === 'reservation-list'">
      <ul>
        <li class="px-4 py-2" v-for="item in reservationRecords" :key="item.name">
          <button
            class="w-full flex justify-between items-center mb-5"
            @click="onExpandClick(item.name)"
          >
            <div
              class="flex items-end"
              :class="{
                'font-bold': expandListSet.has(item.name)
              }"
            >
              {{ item.name }}({{ item.data.length }})
            </div>
            <img
              src="@/assets/images/down-icon.svg"
              class="transition-transform"
              :class="{
                'rotate-180': expandListSet.has(item.name)
              }"
            />
          </button>
          <div
            class="grid grid-rows-[0fr] transition-all"
            :class="{
              'grid-rows-[1fr]': expandListSet.has(item.name)
            }"
          >
            <ul class="overflow-hidden">
              <li v-for="(subItem, index) in item.data" :key="index">
                <div class="flex pl-[3px]">
                  <div class="w-0.5 bg-primary-500 mr-4 self-stretch"></div>
                  <ul>
                    <li class="mb-3">
                      <router-link
                        :to="{ name: 'library-book-detail', params: { id: subItem.id } }"
                      >
                        <p class="option-title font-bold">
                          <span class="line-clamp-1">{{ subItem.book_name }}</span>
                        </p>
                        <p class="line-clamp-1">索書號：{{ subItem.call_number }}</p>
                        <p class="line-clamp-1">
                          取書館：<a
                            href="javascript:void(0)"
                            class="col-span-8 underline"
                            @click.prevent="
                              isMapDialogOpen = true;
                              selectedSubItem = subItem;
                            "
                          >
                            {{ subItem.selected_library.name }}
                          </a>
                        </p>
                        <template v-if="item.name === '可取書'">
                          <p>取書編號：{{ subItem.pickup_number }}</p>
                          <p>取書期限：{{ subItem.pickup_end_date }}</p>
                          <a
                            href=""
                            class="underline text-primary-500"
                            @click.prevent="
                              isExtensionDialogOpen = true;
                              selectedSubItem = subItem;
                            "
                            v-if="subItem.extend_count < 1"
                            >延長兩日</a
                          >
                          <p class="text-grey-400" v-else>已延長兩日</p>
                        </template>
                        <template v-if="item.name === '處理中'">
                          <p>調出日期：{{ subItem.processing_date }}</p>
                        </template>
                        <template v-if="item.name === '排序中'">
                          <p>預約排序：{{ subItem.reservation_order }}</p>
                          <a
                            href=""
                            class="underline text-primary-500"
                            @click.prevent="
                              isCancelDialogOpen = true;
                              selectedSubItem = subItem;
                            "
                            >取消預約</a
                          >
                        </template>
                      </router-link>
                    </li>
                  </ul>
                </div>
              </li>
            </ul>
          </div>
        </li>
      </ul>
      <BaseDialog
        v-model="isMapDialogOpen"
        title="是否要開啟 Google Map"
        :content="`地點：${selectedSubItem?.selected_library.name}`"
        :isAlert="true"
        positiveText="開啟"
        negativeText="取消"
        @onNegativeClick="selectedSubItem = undefined"
        @onPositiveClick="onMapOpenClick(selectedSubItem)"
      />
      <BaseDialog
        v-model="isExtensionDialogOpen"
        title="延長兩日"
        :content="`題名：${selectedSubItem?.book_name}\n索書號：${selectedSubItem?.call_number}\n\n預約圖書資料到館後於保留期限內，每件限延長1次，延長期限2日。`"
        :isAlert="true"
        negativeText="取消"
        positiveText="確認"
        @onNegativeClick="
          selectedSubItem = undefined;
          isExtensionDialogOpen = false;
        "
        @onPositiveClick="extendReservation(selectedSubItem)"
      />
      <BaseDialog
        v-model="isExtensionSuccessDialogOpen"
        title="延長兩日成功"
        :content="`題名：${selectedSubItem?.book_name}\n索書號：${selectedSubItem?.call_number}`"
        :is-check="true"
        positiveText="關閉"
        @onPositiveClick="
          selectedSubItem = undefined;
          isExtensionSuccessDialogOpen = false;
        "
      />
      <BaseDialog
        v-model="isCancelDialogOpen"
        title="取消預約"
        :content="`題名：${selectedSubItem?.book_name}\n索書號：${selectedSubItem?.call_number}`"
        :isAlert="true"
        negativeText="我再想想"
        positiveText="取消預約"
        @onNegativeClick="
          selectedSubItem = undefined;
          isCancelDialogOpen = false;
        "
        @onPositiveClick="cancelReservation(selectedSubItem)"
      />
    </template>
    <template v-else-if="selectedListId === 'reservation-not-take-records'">
      <div v-for="(item, index) in noPickupRecords" :key="index">
        <p>{{ item.book_name }}</p>
        <p class="text-grey-400">索書號：{{ item.call_number }}</p>
        <p class="text-grey-400">紀錄日期：{{ item.processing_date }}</p>
        <hr class="my-4" />
      </div>
      <div v-if="!noPickupRecords.length">
        <div class="text-grey-400">
          <img src="@/assets/images/illustrations_no_data.svg" class="mx-auto" alt="nodata-icon" />
          <p class="text-center mt-2">目前沒有預約未取紀錄</p>
        </div>
      </div>
    </template>
    <template v-else-if="selectedListId === 'borrowing-list'">
      <div v-for="(item, index) in borrowingRecords" :key="index">
        <p>{{ item.book_name }}</p>
        <p>索書號：{{ item.call_number }}</p>
        <p>借閱日期：{{ item.pickup_date }}</p>
        <p>應還日期：{{ item.return_end_date }}</p>
        <a
          href=""
          class="underline text-primary-500"
          @click.prevent="
            isExtensionDialogOpen = true;
            router.push({ name: 'library-book-detail', params: { id: item.id } });
          "
          >續借</a
        >
        <hr class="my-4" />
      </div>
      <div v-if="!borrowingRecords.length">
        <div class="text-grey-400">
          <img src="@/assets/images/illustrations_no_data.svg" class="mx-auto" alt="nodata-icon" />
          <p class="text-center mt-2">目前沒有借閱紀錄</p>
        </div>
      </div>
    </template>
    <template v-else-if="selectedListId === 'borrow-history-list'">
      <template v-if="historyRecords.length">
        <div class="flex justify-between">
          <span>僅保留近1年內資料</span>
          <a href="" class="flex items-center" @click.prevent="sortHistoryRecords">
            <img src="@/assets/images/icon-order-arrows.png" width="30" alt="icon-order-arrows" />
            <span>{{ historyRecordsOrder === 'asc' ? '由新到舊' : '由舊到新' }}</span>
          </a>
        </div>
        <hr class="my-4" />
        <div v-for="(item, index) in historyRecords" :key="index">
          <p>{{ item.book_name }}</p>
          <p class="text-grey-400">索書號：{{ item.call_number }}</p>
          <p class="text-grey-400">借閱日期：{{ item.pickup_date }}~{{ item.return_date }}</p>
          <hr class="my-4" />
        </div>
      </template>
      <div v-else>
        <div class="text-grey-400">
          <img src="@/assets/images/illustrations_no_data.svg" class="mx-auto" alt="nodata-icon" />
          <p class="text-center mt-2">目前沒有借閱紀錄</p>
        </div>
      </div>
    </template>
  </div>
</template>

<style lang="postcss" scoped>
.option-title {
  @apply relative;
  @apply before:content-[''];
  @apply before:w-1.5 before:h-0.5;
  @apply before:bg-primary-500;
  @apply before:inline-block;
  @apply before:absolute before:-left-3.5 before:top-1/2 before:-translate-y-1/2;
}
</style>
