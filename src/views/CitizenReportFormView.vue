<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useCitizenReportStore } from '@/stores/citizenReport';
import { useFormStore } from '@/stores/form';
import FixedTitleSection from '@/components/molecules/FixedTitleSection.vue';
import BaseInput from '@/components/atoms/BaseInput.vue';
import BaseTextarea from '@/components/atoms/BaseTextarea.vue';
import BaseRadio from '@/components/atoms/BaseRadio.vue';
import BaseButton from '@/components/atoms/BaseButton.vue';
import BaseDialog from '@/components/atoms/BaseDialog.vue';
import UploadSection from '@/components/molecules/UploadSection.vue';
import LocationModal from '@/components/organisms/LocationModal.vue';

const route = useRoute();
const router = useRouter();

const formStore = useFormStore();
formStore.reset();

const store = useCitizenReportStore();

const { reportItemMap } = storeToRefs(store);

const reportItem = computed(() =>
  route.params.id === 'R-99'
    ? { id: 'R-99', name: '非屬前述各類之其他事項 - 其他事項(自動選擇案件類別)' }
    : (reportItemMap.value.get(route.params.id) as { id: string; name: string })
);

const reportForm = reactive({
  location: '',
  title: '',
  description: ''
});

const triggerValidate = ref(false);

const agreeOptions = ref([
  { label: '同意', value: 'Y' },
  { label: '不同意', value: 'N' }
]);

const isAgree = ref('Y');
const isFinishDialogOpen = ref(false);

const onSubmitClick = () => {
  triggerValidate.value = true;
  if (reportForm.title && reportForm.description) {
    isFinishDialogOpen.value = true;
  }
};

const onPositiveClick = () => {
  router.push({ name: 'citizen-report' });
};

const isShowLocaionModal = ref(false);
</script>

<template>
  <div class="citizen-report-form">
    <FixedTitleSection title="案件內容" />
    <form class="w-full px-4 py-3">
      <p class="font-semibold text-grey-700">案件分類</p>
      <p v-if="reportItem?.name" class="pl-2 mb-3">
        {{ reportItem.name }}
      </p>
      <!-- TODO:測試用可刪除 -->
      <p v-else class="pl-2 mb-3">案件名稱.....</p>

      <div class="citizen-report-form__form-group">
        <label for="location" class="font-semibold text-grey-700">發生地點</label>
        <div class="relative">
          <BaseInput
            v-model="reportForm.location"
            id="location"
            placeholder="請輸入完整地址"
            class="w-full !pr-10"
          />
          <button
            class="absolute top-1/2 -translate-y-1/2 right-2"
            @click.prevent="isShowLocaionModal = true"
          >
            <img src="@/assets/images/icon-map-dark.svg" alt="開啟地圖" />
          </button>
        </div>
      </div>

      <div class="citizen-report-form__form-group">
        <label for="location" class="font-semibold text-grey-700">案件主旨*</label>
        <BaseInput
          v-model="reportForm.title"
          id="title"
          label="案件主旨"
          :trigger-validate="triggerValidate"
          placeholder="請輸入主旨"
          :required="true"
        />
      </div>

      <div class="citizen-report-form__form-group">
        <label for="description" class="font-semibold text-grey-700">描述*</label>
        <BaseTextarea
          v-model="reportForm.description"
          id="description"
          label="描述"
          :trigger-validate="triggerValidate"
          :required="true"
          class="w-full"
          placeholder="人、事、時、地、物 4000字以內"
        />
      </div>

      <div>
        <UploadSection :file-max="10" :is-report="true" title="新增附件" />
      </div>
    </form>

    <section class="px-4">
      <p class="text-primary-500 font-bold">個人資料是否提供給承辦</p>
      <p class="text-sm">
        承辦員如有執行法定職務之需求，仍可透過申請程序，並經機關業務分層負責層級人員同意後，取得個人資料
      </p>
      <div class="flex flex-wrap gap-4 mt-2">
        <BaseRadio
          v-model="isAgree"
          v-for="option in agreeOptions"
          :key="option.value"
          :radioId="option.value"
          radioName="isAgree"
          :radioText="option.label"
        />
      </div>
    </section>
    <div class="px-4 mt-4">
      <BaseButton :disabled="isAgree === 'N'" @click="onSubmitClick" class="w-full">
        送出
      </BaseButton>
    </div>
    <BaseDialog
      v-model="isFinishDialogOpen"
      title="案件已完成受理"
      content=""
      positiveText="確認"
      @onPositiveClick="onPositiveClick"
    />
    <LocationModal
      v-model="isShowLocaionModal"
      :form-address="reportForm.location"
      @positionConfirm="(val) => (reportForm.location = val)"
    />
  </div>
</template>

<style lang="postcss">
.citizen-report-form {
  @apply pt-12 pb-4;

  &__form-group {
    @apply flex flex-col gap-y-1 mb-3 last:mb-0;
  }
}
</style>
