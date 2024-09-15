<script setup lang="ts">
import { ref, reactive, onMounted, watch, computed } from 'vue';
import { storeToRefs } from 'pinia';
import BaseInput from '@/components/atoms/BaseInput.vue';
import BaseSelect from '@/components/atoms/BaseSelect.vue';
import BaseRadio from '@/components/atoms/BaseRadio.vue';
import BaseRadioInput from '@/components/atoms/BaseRadioInput.vue';
import BaseCheckbox from '@/components/atoms/BaseCheckbox.vue';
import DatePicker from '@/components/molecules/DatePicker.vue';
import BaseButton from '@/components/atoms/BaseButton.vue';
import BaseDialog from '@/components/atoms/BaseDialog.vue';
import type { FeePayment } from '@/interfaces/fee-payment.interface';
import { useRouter } from 'vue-router';

const router = useRouter();

const props = withDefaults(
  defineProps<{
    paymentItem: FeePayment;
    tabIndex: number;
    triggerValidate?: boolean;
  }>(),
  {
    triggerValidate: false
  }
);

const emit = defineEmits(['onFormChange']);

const form = reactive<any>({});
const handleForm = () => {
  props.paymentItem.search_type_list[props.tabIndex].form_format.forEach((item: any) => {
    switch (item.type) {
      case 'input':
        form[item.field] = '';
        break;
      case 'select':
        form[item.field] = '';
        break;
      case 'multiple_select':
        form[item.field] = [];
        break;
      case 'radio_group':
        form[item.field] = '';
        break;
      case 'radio_group_input':
        form[item.field] = '';
        item.options.forEach((option: any) => {
          option.form_format.forEach((subItem: any) => {
            form[subItem.field] = '';
          });
        });
        break;
      case 'textarea':
        form[item.field] = '';
        break;
      case 'checkbox_group':
        form[item.field] = [];
        break;
      case 'date_picker':
        form[item.field] = undefined;
        break;
      // case 'upload':
      //   form[item.field] = [];
      //   break;
      default:
        form[item.field] = '';
    }
  });
};

onMounted(() => {
  handleForm();
});

const isErrorDialogOpen = ref(false);

const onSubmitClick = () => {
  console.log('form:', form);
  // 檢核 form 裡的欄位是否含空白或符號

  const isValidate = Object.keys(form).every((key) => {
    const value = form[key as keyof typeof form];
    return !!value;
  });

  if (!isValidate) {
    isErrorDialogOpen.value = true;
    return;
  }
  isErrorDialogOpen.value = false;

  // /**
  //  * 註解區塊是串接查詢繳費 API 的範例
  //  * 透過 JS 原生 fetch 做串接
  //  * 開發者可以用自己習慣的方式去做 API 串接
  //  * 例如：axios 等
  //  */
  // try {
  //   const response = await fetch('url_custom_url', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json'
  //     },
  //     body: JSON.stringify(body)
  //   });

  //   if (!response.ok) {
  //     throw new Error(`request error: ${response.status}!!`);
  //   }

  //   const responseData = await response.json();
  //   console.log('success:', responseData);
  //   // isFinishDialogOpen.value = true;
  // } catch (error) {
  //   console.log('error:', error);
  // }

  // 查詢結果
  router.push({ name: 'fee-payment-result', params: { id: props.paymentItem.id } });
};
</script>

<template>
  <div class="p-4">
    <!-- 這邊開始透過 API 的 form format 來組成 -->
    <div
      v-for="(item, index) in paymentItem.search_type_list[props.tabIndex].form_format"
      :key="index"
    >
      <!-- type = input -->
      <div v-if="item.type === 'input'" class="flex flex-col mb-4">
        <label :for="item.field" class="field-label">
          {{ item.label }}
          <!-- <span v-if="item.required">*</span> -->
        </label>
        <p class="text-grey-400 text-sm mb-2" v-if="item.description">{{ item.description }}</p>
        <BaseInput
          v-model="form[item.field]"
          :id="item.field"
          class="w-full"
          :label="item.label"
          :required="item.required"
          :placeholder="`請輸入${item.label}`"
        />
      </div>
      <!-- type = select -->
      <div v-else-if="item.type === 'select'" class="flex flex-col mb-4">
        <label :for="item.field" class="field-label">
          {{ item.label }}
          <!-- <span v-if="item.required">*</span> -->
        </label>
        <p class="text-grey-400 text-sm mb-2" v-if="item.description">{{ item.description }}</p>
        <BaseSelect
          v-model="form[item.field]"
          :selectId="item.field"
          :required="item.required"
          :options="item.options"
          :triggerValidate="props.triggerValidate"
          :default-selected="item.default_option"
          class="w-full"
        />
      </div>
      <!-- type = radio_group -->
      <div v-else-if="item.type === 'radio_group'" class="flex flex-col mb-4">
        <p class="field-label">
          {{ item.label }}
          <!-- <span v-if="item.required">*</span> -->
        </p>
        <p class="text-grey-400 text-sm mb-2" v-if="item.description">{{ item.description }}</p>
        <div class="flex flex-wrap gap-4">
          <BaseRadio
            v-model="form[item.field]"
            v-for="option in item.options"
            :key="option.value"
            :radioId="option.value"
            :radioName="item.field"
            :radioText="option.label"
            :required="item.required"
            :triggerValidate="props.triggerValidate"
          />
        </div>
      </div>
      <!-- type = radio_group_input -->
      <!-- 特例：汽機車 -->
      <div v-else-if="item.type === 'radio_group_input'" class="flex flex-col mb-4">
        <p class="field-label">
          {{ item.label }}
          <!-- <span v-if="item.required">*</span> -->
        </p>
        <p class="text-grey-400 text-sm mb-2" v-if="item.description">{{ item.description }}</p>
        <BaseRadioInput
          v-model="form[item.field]"
          v-for="option in item.options"
          :key="option.value"
          :radioId="option.value"
          :radioName="item.field"
          :radioText="option.label"
          :required="item.required"
          :triggerValidate="props.triggerValidate"
          :formFormat="option.form_format"
          :form="form"
          @update:form-field="
            (val) => {
              form[val.field] = val.value;
            }
          "
        />
      </div>
      <!-- type = date_picker -->
      <div v-else-if="item.type === 'date_picker'" class="flex flex-col mb-4">
        <p class="field-label">
          {{ item.label }}
          <!-- <span v-if="item.required">*</span> -->
        </p>
        <p class="text-grey-400 text-sm mb-2" v-if="item.description">{{ item.description }}</p>
        <DatePicker
          v-model="form[item.field]"
          :required="item.required"
          :triggerValidate="props.triggerValidate"
        />
      </div>
    </div>
    <!-- 注意事項 -->
    <div class="mt-4" v-if="paymentItem.search_type_list[props.tabIndex].notice?.length">
      <p class="text-sm mb-2">注意事項</p>
      <ul class="list-disc pl-4">
        <li
          v-for="item in paymentItem.search_type_list[props.tabIndex].notice"
          :key="item"
          class="text-sm"
          :innerHTML="item"
        ></li>
      </ul>
    </div>
  </div>
  <!-- 底部 button -->
  <div class="floating-box bottom-0 w-full">
    <p class="text-center text-primary-500 mb-2">逾繳費期限，不提供查詢繳費功能</p>
    <BaseButton class="w-full" @click="onSubmitClick()"> 查詢 </BaseButton>
  </div>

  <BaseDialog
    v-model="isErrorDialogOpen"
    :isAlert="true"
    title="提醒"
    content="請確認資料是否含空白或符號"
    positiveText="確認"
    @onPositiveClick="isErrorDialogOpen = false"
  />
</template>

<style lang="postcss" scoped>
.floating-box {
  @apply absolute justify-between bg-white px-4 py-6 rounded-xl;
  box-shadow: rgba(0, 0, 0, 0.04) 0px -4px 10px;
}
</style>
