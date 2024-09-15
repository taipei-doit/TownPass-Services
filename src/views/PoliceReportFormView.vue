<!-- doc:將 general form 和 detail form 合併後送出 -->
<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useWindowScroll } from '@vueuse/core';
import BaseDialog from '@/components/atoms/BaseDialog.vue';
import ServiceStep from '@/components/molecules/ServiceStep.vue';
import PoliceReportGeneralForm from '@/components/molecules/PoliceReportGeneralForm.vue';
import PoliceReportDetailForm from '@/components/molecules/PoliceReportDetailForm.vue';

const router = useRouter();

const activeStep = ref(1);

const isSubmitDialogOpen = ref(false);

const onGeneralFormPass = (form: {
  mobile_number: string;
  contact_number: string;
  mail: string;
  county: string;
  city: string;
  detail: string;
  permanent_county: string;
  permanent_city: string;
  permanent_detail: string;
}) => {
  console.log('general form:', form);
  activeStep.value = 2;
  const { y } = useWindowScroll();
  y.value = 0;
};

const onDetailFormPass = (form: {
  your_role: string;
  location: string;
  date_of_incident: Date;
  time: string;
  case_summary: string;
}) => {
  console.log('detail form:', form);
  isSubmitDialogOpen.value = true;
};

const onSubmitDialogPositiveClick = () => {
  router.push({ name: 'police-report' });
};
</script>

<template>
  <div class="p-4">
    <ServiceStep :activeStep="activeStep" />
    <PoliceReportGeneralForm
      v-if="activeStep === 1"
      class="mt-6"
      @on-general-form-pass="onGeneralFormPass"
    />
    <PoliceReportDetailForm v-else class="mt-6" @on-detail-form-pass="onDetailFormPass" />

    <BaseDialog
      v-model="isSubmitDialogOpen"
      is-check
      title="通報成功"
      content="感謝您提供寶貴資訊"
      positiveText="確認"
      @on-positive-click="onSubmitDialogPositiveClick"
    />
  </div>
</template>
