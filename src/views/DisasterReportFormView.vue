<script setup lang="ts">
import { computed, reactive, ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useDisasterReportStore } from '@/stores/disasterReport';
import { useFormStore } from '@/stores/form';
import BaseInput from '@/components/atoms/BaseInput.vue';
import BaseTextarea from '@/components/atoms/BaseTextarea.vue';
import BaseCheckbox from '@/components/atoms/BaseCheckbox.vue';
import BaseButton from '@/components/atoms/BaseButton.vue';
import BaseDialog from '@/components/atoms/BaseDialog.vue';
import UploadSection from '@/components/molecules/UploadSection.vue';
import LocationModal from '@/components/organisms/LocationModal.vue';

const route = useRoute();
const router = useRouter();

const formStore = useFormStore();
formStore.reset();

const store = useDisasterReportStore();
const { disasterReportMap } = storeToRefs(store);

const activeFormItem = computed(() => disasterReportMap.value.get(route.params.id as string));

const isShowLocaionModal = ref(false);

const disasterForm = reactive<{ location: string; location_desc: string; [key: string]: any }>({
  location: '',
  location_desc: ''
});

const disasterCustomForm = reactive<Record<string, any>>({ additional_disc: '' });

const isCustomFormInvalid = ref(false);

const isDisasterCustomFormInit = ref(false);

const triggerCustomFormValidate = () => {
  const keys = Object.keys(disasterCustomForm);

  const emptyValues = keys.reduce<string[]>((acc, current) => {
    if (!disasterCustomForm[current] || !disasterCustomForm[current].length) {
      return [...acc, current];
    } else {
      return acc;
    }
  }, []);

  if (emptyValues.length === keys.length) {
    isCustomFormInvalid.value = true;
  } else {
    isCustomFormInvalid.value = false;
  }
};

watch(disasterCustomForm, () => {
  if (!isDisasterCustomFormInit.value) {
    isDisasterCustomFormInit.value = true;
    return;
  }

  triggerCustomFormValidate();
});

const handleForm = () => {
  activeFormItem.value?.form_format?.forEach((item: any) => {
    switch (item.type) {
      case 'input':
        disasterCustomForm[item.field] = '';
        break;
      case 'checkbox_group':
        disasterCustomForm[item.field] = [];
        break;
      default:
        disasterCustomForm[item.field] = '';
    }
  });
};

onMounted(() => {
  handleForm();
});

const isAgree = ref([]);

const isSubmitSuccess = ref(false);
const isSubmitDialogOpen = ref(false);

const onSubmitClick = () => {
  triggerCustomFormValidate();

  if (isCustomFormInvalid.value) {
    console.log('submit fail');
  } else {
    const submitForm = {
      disaster: activeFormItem.value?.name,
      ...disasterForm,
      ...disasterCustomForm
    };

    console.log('submit:', submitForm);

    isSubmitSuccess.value = true;
    isSubmitDialogOpen.value = true;
  }
};

const isSubmitDisabled = computed(() => {
  if (!isAgree.value.length || !disasterForm.location) {
    return true;
  } else {
    return false;
  }
});

const onSubmitDialogPositiveClick = () => {
  if (isSubmitSuccess.value) {
    router.push({ name: 'disaster-report' });
  }
};
</script>

<template>
  <div class="p-4 overflow-x-hidden">
    <form class="flex flex-col gap-y-6">
      <div>
        <p class="text-grey-900 font-semibold mb-2.5">災情分類</p>
        <span>{{ activeFormItem?.name }}</span>
      </div>

      <div>
        <label for="location" class="font-semibold text-grey-900">
          <span class="text-[#E00000]">*</span>
          標注災情發生地點
        </label>
        <div class="relative mt-2.5">
          <BaseInput
            v-model="disasterForm.location"
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

      <div>
        <label for="desc" class="font-semibold text-grey-900"> 地點描述 </label>
        <div class="mt-2.5">
          <BaseTextarea
            v-model="disasterForm.location_desc"
            id="desc"
            placeholder="地點位置補充說明"
            class="w-full min-h-56"
          />
        </div>
      </div>

      <div>
        <p for="location" class="font-semibold text-grey-900">
          <span class="text-[#E00000]">*</span>
          災情描述(至少勾選一項)
        </p>
        <div
          class="mt-2.5 rounded-md border border-grey-500 p-3"
          :class="{ '!border-[#E00000]': isCustomFormInvalid }"
        >
          <ul class="flex flex-col gap-y-5">
            <li v-for="(item, index) in activeFormItem?.form_format" :key="index">
              <!-- type = checkbox_group -->
              <div v-if="item.type === 'checkbox_group'" class="flex flex-col">
                <p v-if="item.label" class="text-[#0B0D0E] font-semibold mb-2">
                  {{ item.label }}：
                </p>
                <div class="flex flex-wrap gap-1.5">
                  <BaseCheckbox
                    v-for="option in item.options"
                    :key="option.value"
                    :option="option"
                    v-model="disasterCustomForm[item.field]"
                  />
                </div>
              </div>

              <!-- type = input -->
              <div v-else-if="item.type === 'input'" class="flex flex-col">
                <label
                  v-if="item.label"
                  :for="item.field"
                  class="text-[#0B0D0E] font-semibold mb-2"
                >
                  {{ item.label }}：
                </label>
                <BaseInput
                  :id="item.field"
                  v-model="disasterCustomForm[item.field]"
                  class="w-full"
                />
              </div>
            </li>
            <li>
              <div class="flex flex-col">
                <label for="additional_disc" class="text-[#0B0D0E] font-semibold mb-2">
                  補充描述：
                </label>
                <BaseTextarea
                  v-model="disasterCustomForm.additional_disc"
                  id="additional_disc"
                  placeholder="災情細節說明"
                  class="w-full"
                />
              </div>
            </li>
          </ul>
        </div>
        <p v-show="isCustomFormInvalid" class="text-right text-[#E00000] text-sm mt-1">
          至少勾選一項
        </p>
      </div>

      <div>
        <UploadSection :file-max="3" is-disaster title="新增附件" />
      </div>

      <div>
        <p class="text-sm font-semibold text-[#0B0D0E]">注意事項</p>
        <p class="text-sm text-grey-400 font-semibold my-2">
          承辦員如有執行法定職務之需求，仍可透過申請程序，並經機關業務分層負責階級人員同意後，取得個人資料
        </p>
        <div>
          <BaseCheckbox
            :option="{ label: '提供個人資料給承辦人員', value: 'Y' }"
            v-model="isAgree"
            class="[&>span]:text-[#5AB4C5] [&>span]:font-semibold [&>span]:text-sm"
          />
        </div>
      </div>

      <BaseButton :disabled="isSubmitDisabled" @click="onSubmitClick">送出</BaseButton>
    </form>

    <LocationModal
      v-model="isShowLocaionModal"
      :form-address="disasterForm.location"
      @positionConfirm="(val) => (disasterForm.location = val)"
    />

    <BaseDialog
      v-model="isSubmitDialogOpen"
      :is-check="isSubmitSuccess"
      :is-alert="!isSubmitSuccess"
      :title="isSubmitSuccess ? '通報成功' : '無法通報'"
      :content="isSubmitSuccess ? '感謝您提供寶貴資訊' : '僅能通報台北市內資訊'"
      positiveText="確認"
      @on-positive-click="onSubmitDialogPositiveClick"
    />
  </div>
</template>
