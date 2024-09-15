import type { BookStatusEnum } from '@/enums/book-status.enum';
import type { Library, LibraryBook } from './library-book.interface';

/**
 * 我的紀錄
 */
export interface LibraryRecords extends LibraryBook {
  record_id: string;
  /** 狀態 */
  status: BookStatusEnum;
  /** 取書館 */
  selected_library: Library;
  /** 延長次數 */
  extend_count: number;
  /** 預約排序 */
  reservation_order?: number;
  /** 預約日期 */
  reservation_date?: string;
  /** 調出日期 */
  processing_date?: string;
  /** 可取書日期 */
  pickup_start_date?: string;
  /** 取書日期 */
  pickup_date?: string;
  /** 取書期限 */
  pickup_end_date?: string;
  /** 應還日期 */
  return_end_date?: string;
  /** 還書日期 */
  return_date?: string;
  /** 取書編號 */
  pickup_number?: string;
}
