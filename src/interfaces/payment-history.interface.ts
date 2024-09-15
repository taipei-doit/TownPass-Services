/**
 * 繳費紀錄
 */
export interface PaymentHistory {
  /** 帳單 id */
  id: string;
  /** 繳費類別 id */
  payment_id: string;
  /** 繳費類別名稱 */
  payment_name: string;
  /** 帳單金額 */
  amount: number;
  /** 繳費時間 */
  paid_at: string;
  /** 繳費狀態 */
  status: string;
}
