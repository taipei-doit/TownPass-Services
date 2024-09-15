import { ref } from 'vue';
import { defineStore } from 'pinia';

export const usePaymentStore = defineStore('form', () => {
  const paymentInfo = ref({
    adult: 0,
    concession: 0,
    citizen: 0,
    group: 0,
    total: 0,
    ticketName: '',
    way: ''
  });

  const reset = () => {
    paymentInfo.value.adult = 0;
    paymentInfo.value.concession = 0;
    paymentInfo.value.citizen = 0;
    paymentInfo.value.group = 0;
    paymentInfo.value.total = 0;
    paymentInfo.value.ticketName = '';
    paymentInfo.value.way = '';
  };

  return { paymentInfo, reset };
});
