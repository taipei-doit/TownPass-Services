/**
 * 帳單
 */
export interface Bill {
  /** 帳單 id */
  id: string;
  /** 繳費類別 id */
  payment_id: string;
  /** 帳單金額 */
  amount: number;
  /** 繳費內容 */
  data: { label: string; value: string }[];
}
