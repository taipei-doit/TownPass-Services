<script setup lang="ts">
import { reactive, ref, computed } from 'vue';
import { DatePicker as TimePicker } from 'v-calendar';
import { getHours, getMinutes } from 'date-fns';
import { useWindowScroll } from '@vueuse/core';
import BaseSelect from '../atoms/BaseSelect.vue';
import BaseInput from '../atoms/BaseInput.vue';
import BaseCheckbox from '../atoms/BaseCheckbox.vue';
import BaseButton from '../atoms/BaseButton.vue';
import BaseTextarea from '../atoms/BaseTextarea.vue';
import DatePicker from './DatePicker.vue';
import UploadSection from './UploadSection.vue';
import LocationModal from '../organisms/LocationModal.vue';

const emits = defineEmits(['onDetailFormPass']);

const reportForm = reactive({
  your_role: '',
  location: '',
  date_of_incident: undefined,
  time: new Date(),
  case_summary: ''
});

const reporterCategoryOptions = [
  {
    label: '當事人Person involved',
    value: '當事人Person involved'
  },
  {
    label: '被害人Victim',
    value: '被害人Victim'
  },
  {
    label: '檢舉人Informant',
    value: '檢舉人Informant'
  },
  {
    label: '關係人Interested Party',
    value: '關係人Interested Party'
  }
];

const isAgree = ref<string[]>([]);

const onAgreeENClick = () => {
  if (isAgree.value.length) {
    isAgree.value.splice(0, 1);
  } else {
    isAgree.value.push('agree');
  }
};

const triggerValidate = ref(false);

const isValidatePass = computed(() => {
  return Object.values(reportForm).every((value) => !!value);
});

const onSubmitClick = () => {
  triggerValidate.value = true;

  if (isValidatePass.value) {
    const hour = getHours(reportForm.time);
    const minute = getMinutes(reportForm.time);

    emits('onDetailFormPass', {
      ...reportForm,
      time: `${hour}:${minute}`
    });
  } else {
    const { y } = useWindowScroll();
    y.value = 0;
  }
};

const isShowLocaionModal = ref(false);
</script>

<template>
  <div>
    <form class="flex flex-col gap-y-6">
      <div class="flex flex-col gap-y-3">
        <div>
          <label for="your_role" class="text-grey-900 font-semibold">
            <span>報案人類別</span>
            <span class="text-primary-500">* </span>
            <span>Your Role</span>
          </label>
          <BaseSelect
            selectId="your_role"
            :options="reporterCategoryOptions"
            required
            :trigger-validate="triggerValidate"
            default-selected="請選擇報案人類別"
            class="w-full mt-2"
            v-model="reportForm.your_role"
          />
        </div>
        <div>
          <label for="location" class="text-grey-900 font-semibold">
            <span>標注發生地點</span>
            <span class="text-primary-500">* </span>
            <span>Location</span>
          </label>
          <div class="relative mt-2.5">
            <BaseInput
              v-model="reportForm.location"
              id="location"
              required
              placeholder="可直接定位或輸入完整地址"
              class="w-full !pr-10"
            />
            <button
              class="absolute top-[23px] -translate-y-[11px] right-2"
              @click.prevent="isShowLocaionModal = true"
            >
              <img src="@/assets/images/icon-geo.svg" alt="開啟地圖" />
            </button>
          </div>
        </div>
        <div class="flex flex-col">
          <p class="text-grey-900 font-semibold mb-2">
            <span>發生日期</span>
            <span class="text-primary-500">* </span>
            <span>Date of Incident</span>
          </p>
          <DatePicker
            v-model="reportForm.date_of_incident"
            required
            :trigger-validate="triggerValidate"
          />
        </div>
        <div class="flex flex-col">
          <p class="text-grey-900 font-semibold mb-2">
            <span>發生時間</span>
            <span class="text-primary-500">* </span>
            <span>Time of Incident</span>
          </p>
          <div>
            <TimePicker
              v-model="reportForm.time"
              mode="time"
              hide-time-header
              class="!w-full [&>.vc-time-picker]:w-full [&>.vc-time-picker>.vc-time-select-group]:w-full"
            />
          </div>
        </div>
        <div>
          <label for="case_summary" class="text-grey-900 font-semibold">
            <span>案情摘要</span>
            <span class="text-primary-500">* </span>
            <span>Case Summary</span>
          </label>
          <BaseTextarea
            placeholder="人、事、時、地、物500字以內"
            id="case_summary"
            v-model="reportForm.case_summary"
            required
            :trigger-validate="triggerValidate"
            class="w-full mt-2"
          />
        </div>
        <div>
          <UploadSection file-un-limit :file-max="999" is-police-report title="新增附件" />
        </div>
      </div>
      <div>
        <p class="text-grey-900 font-semibold">個人資料收集聲明及服務條款</p>
        <p class="text-grey-900 font-semibold">
          Personal Information Collection Statement and Terms of Service
        </p>
        <ol
          class="flex flex-col gap-y-1 h-56 overflow-y-auto bg-grey-50 rounded-lg list-decimal py-4 pr-4 pl-8 mt-2 [&>li]:pl-1 [&>li]:text-grey-900"
        >
          <li>
            本局(臺北市政府警察局)取得您的個人資料，在個人資料保護法及相關法令之規定下，依本局隱私權保護政策，蒐集、處理及利用您的個人資料。
          </li>
          <li>
            您可依您的需要提供以下個人資料：姓名、出生年月日、國民身分證統一編號、連絡方式(包括但不限於電話號碼、E-MAIL或居住地址)或其他得以直接或間接識別您個人之資料。
          </li>
          <li>
            您同意本局以您所提供之個人資料確認您的身分、與您進行連絡、提供您本局相關服務及資訊，以及其他隱私權保護政策規範之使用方式。
          </li>
          <li>
            您可依個人資料保護法，就您的個人資料向本局(1)請求查詢或閱覽、(2)製給複製本、(3)請求補充或更正、(4)請求停止蒐集、處理及利用或(5)請求刪除。但因本局執行職務或業務所必需者，本局得拒絕之。
          </li>
          <li>
            您可自由選擇是否提供本局您的個人資料，但若您所提供之個人資料，經檢舉或本局發現不足已確認您的身分真實性或其他個人資料冒用、盜用、資料不實等情形，本局將不予處理。
          </li>
          <li>
            您瞭解此一同意符合個人資料保護法及相關法規之要求，具有書面同意本局蒐集、處理及利用您的個人資料之效果。
          </li>
        </ol>
      </div>
      <div>
        <BaseCheckbox
          :option="{
            label: '本人已詳閱並同意以上內容',
            value: 'agree'
          }"
          v-model="isAgree"
          class="[&>span]:text-grey-400"
        />
        <button class="text-grey-400 text-left pl-6" @click.prevent="onAgreeENClick">
          I have read and agree to the Department's Personal Information Collection Statement and
          Terms of Service.
        </button>
      </div>
      <BaseButton :disabled="!isAgree.length" @click="onSubmitClick">送出</BaseButton>
    </form>
    <LocationModal
      v-model="isShowLocaionModal"
      :form-address="reportForm.location"
      @positionConfirm="(val) => (reportForm.location = val)"
    />
  </div>
</template>
