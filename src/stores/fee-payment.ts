import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import feePaymentJson from '../../public/mock/fee-payment/fee_payment_list.json';
import billListJson from '../../public/mock/fee-payment/bill_list.json';
import payHistoryListJson from '../../public/mock/fee-payment/pay_history_list.json';
import type { FeePayment } from '@/interfaces/fee-payment.interface';
import type { Bill } from '@/interfaces/bill.interface';
import type { PaymentHistory } from '@/interfaces/payment-history.interface';

export const useFeePaymentStore = defineStore('fee-payment', () => {
  /** 規費列表 */
  const paymentList = ref<{ name: string; icon: string; data: FeePayment[] }[]>(
    feePaymentJson.data
  );

  /** 帳單列表 */
  const billList = ref<Bill[]>(billListJson.data);

  /** 繳費紀錄原始列表 */
  const rawHistoryList = ref<PaymentHistory[]>(payHistoryListJson.data);

  const paymentInfo = ref({
    total: 0,
    way: ''
  });

  return {
    paymentList,
    billList,
    rawHistoryList,
    paymentInfo
  };
});
