/**
 * 規費繳納
 */
export interface FeePayment {
  id: string;
  /** 繳費類別 */
  name: string;
  /** 是否為熱門項目 */
  is_hot: boolean;
  /** 查詢類別頁籤 */
  search_type_list: SearchType[];
}

export interface SearchType {
  name: string;
  type: string;
  form_format: Record<string, any>[];
  /** 注意事項 */
  notice?: string[];
}
