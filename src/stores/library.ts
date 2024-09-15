import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import libraryBookListJson from '../../public/mock/library/library_book_list.json';
import librarySearchHotKeywordsJson from '../../public/mock/library/library_search_hot_keywords.json';
import libraryNoticeListJson from '../../public/mock/library/library_notice_list.json';
import libraryRecordsListJson from '../../public/mock/library/library_records_list.json';
import libraryRecordsNopickupListJson from '../../public/mock/library/library_records_nopickup_list.json';
import libraryRecordsBorrowingListJson from '../../public/mock/library/library_records_borrowing_list.json';
import libraryRecordsHistoryListJson from '../../public/mock/library/library_records_history_list.json';
import libraryListJson from '../../public/mock/library/library_list.json';
import type { LibraryNoticeItem } from '@/views/LibraryNoticeListView.vue';
import type { Library, LibraryBook } from '@/interfaces/library-book.interface';
import type { LibraryRecords } from '@/interfaces/library-records.interface';

export const useLibraryStore = defineStore('library', () => {
  /** 書籍列表 */
  const bookList = ref<LibraryBook[]>(libraryBookListJson.data);

  /** 熱門關鍵字 */
  const hotKeywordList = ref<string[]>(librarySearchHotKeywordsJson.data);

  /** 重要訊息列表 */
  const libraryNoticeList = ref<LibraryNoticeItem[]>(libraryNoticeListJson.data);

  /** 我的紀錄-預約清單 */
  const reservationRecords = computed(() => {
    const storedData = libraryRecordsOrdering.value;
    const data = { ...libraryRecordsListJson.data }; // 創建一個淺拷貝，確保變更可追蹤
    if (storedData) {
      // 將儲存的數據放入第三筆的 data 中
      (data[2].data as LibraryRecords[]) = storedData;
    }
    return data;
  });
  /** 我的紀錄-預約清單-排序中 */
  const libraryRecordsOrdering = ref<LibraryRecords[]>([]);

  /** 我的紀錄-預約未取紀錄 */
  const noPickupRecords = ref<LibraryRecords[]>(libraryRecordsNopickupListJson.data);

  /** 我的紀錄-借閱中 */
  const borrowingRecords = ref<LibraryRecords[]>(libraryRecordsBorrowingListJson.data);

  /** 我的紀錄-借閱歷史紀錄 */
  const historyRecords = ref<LibraryRecords[]>(libraryRecordsHistoryListJson.data);

  /** 分館地圖 */
  const libraryList = ref<Library[]>(libraryListJson.data);

  return {
    bookList,
    hotKeywordList,
    libraryNoticeList,
    reservationRecords,
    libraryRecordsOrdering,
    noPickupRecords,
    borrowingRecords,
    historyRecords,
    libraryList
  };
});
