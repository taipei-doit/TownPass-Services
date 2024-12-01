<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useConnectionMessage } from '@/composables/useConnectionMessage';
import { useHandleConnectionData } from '@/composables/useHandleConnectionData';
import router from '@/router';
import BaseDialog from '@/components/atoms/BaseDialog.vue';
import { useFeePaymentStore } from '@/stores/fee-payment';
import { storeToRefs } from 'pinia';

const paymentStore = useFeePaymentStore();
const { paymentList } = storeToRefs(paymentStore);

const handleScan = (event: { data: string }) => {
  const result: { name: string; data: string | null } = JSON.parse(event.data);

  if (result.data) {
    try {
      const str = atob(result.data);
      const obj = JSON.parse(str);

      const concatenatedData = paymentList.value.flatMap((item) => item.data);
      const list = concatenatedData.filter((item) => item.id === obj.id);
      if (list.length) {
        router.push({ name: 'fee-payment-result', params: { id: obj.id } });
      } else {
        isErrorDialogOpen.value = true; // 未找到匹配項，顯示錯誤對話框
      }
    } catch (error) {
      console.error('Failed to decode or parse Base64 data:', error);

      // 捕獲錯誤，顯示錯誤對話框
      isErrorDialogOpen.value = true;
    }
  } else {
    // 如果 result.data 為空，關閉 webview
    window.close();
  }
};

useConnectionMessage('qr_code_scan', null);

useHandleConnectionData(handleScan);

const isErrorDialogOpen = ref(false);

onMounted(() => {
  // setTimeout(() => {
  //   const json = {
  //     name: 'qr_code_scan',
  //     data: btoa(JSON.stringify({ id: 'fee-1' }))
  //   };
  //   const scanString: string = JSON.stringify(json);
  //   console.log('scanString:', scanString);
  //   handleScan({ data: scanString });
  // }, 2000);
});
</script>

<template>
  <BaseDialog
    v-model="isErrorDialogOpen"
    :isAlert="true"
    title="讀取失敗"
    content="此類型的行動條碼不適用"
    positiveText="重新掃描"
    @onPositiveClick="
      isErrorDialogOpen = false;
      useConnectionMessage('qr_code_scan', null);
    "
  />
</template>
