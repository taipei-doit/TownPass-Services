export interface LibraryBook {
  id: string;
  /** 書名 */
  book_name: string;
  /** 著者 */
  author: string;
  /** 出版商 */
  publisher: string;
  /** 出版日期 **/
  publish_date: string;
  /** 主題 */
  subject: string;
  /** ISBN */
  isbn: string;
  /** 縮圖 */
  thumbnail: string;
  /** 點閱次數 */
  click_count: number;
  /** 索書號 */
  call_number: string;
  /** 書本集數 */
  series: BookSeries[];
  /** 取書館 */
  libraries: Library[];
}

/**
 * 書本集數
 */
export interface BookSeries {
  /** 書本編號 */
  book_id: string;
  /** 集數編號 */
  id: string;
  /** 集數 */
  series＿name: string;
  /** 等待人數 */
  waiting_people: number;
  /** 是否開放預約 */
  is_reservation: boolean;
  /** 是否為熱門館藏 */
  is_hot: boolean;
}

/**
 * 取書館
 */
export interface Library {
  id: string;
  /** 站點名稱 */
  name: string;
  /** 行政區 */
  area: string;
  /** 地址 */
  address: string;
  /** 電話 */
  phone: string;
  /** 經度 */
  lat: number;
  /** 緯度 */
  lng: number;
  /** 距離 */
  distance?: number;
  service_infos?: ServiceInfo[];
}

export interface ServiceInfo {
  title: string;
  value?: string;
}
