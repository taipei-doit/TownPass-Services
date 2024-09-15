<script setup lang="ts">
import { reactive, ref, computed, watch, watchEffect } from 'vue';
import { useUserStore } from '@/stores/user';
import { storeToRefs } from 'pinia';
import { useConnectionMessage } from '@/composables/useConnectionMessage';
import { useHandleConnectionData } from '@/composables/useHandleConnectionData';
import BaseInput from '@/components/atoms/BaseInput.vue';
import BaseSelect from '@/components/atoms/BaseSelect.vue';
import BaseCheckbox from '@/components/atoms/BaseCheckbox.vue';
import BaseButton from '../atoms/BaseButton.vue';
import type { User } from '@/stores/user';
import { city } from '@/zipcode/city';
import { county } from '@/zipcode/county';

const userStore = useUserStore();

const { user } = storeToRefs(userStore);

const handleUserInfo = (event: { data: string }) => {
  const result: { name: string; data: User } = JSON.parse(event.data);

  user.value = result.data;
};

useConnectionMessage('userinfo', null);

useHandleConnectionData(handleUserInfo);

const emits = defineEmits(['onGeneralFormPass']);

const reportForm = reactive({
  mobile_number: '',
  contact_number: '',
  mail: ''
});

const address = reactive({
  county: '',
  city: '',
  detail: '',
  permanent_county: '',
  permanent_city: '',
  permanent_detail: ''
});

watch(
  () => address.county,
  () => {
    address.city = '';
  },
  { deep: true }
);

const countyOptions = computed(() => county.map((item) => ({ label: item.name, value: item.id })));

const cityOptions = computed(() =>
  address.county
    ? city
        .filter((item) => item.county === address.county)
        .map((item) => ({ label: item.city, value: item.city }))
    : []
);

const permanentCityOptions = computed(() =>
  address.permanent_county
    ? city
        .filter((item) => item.county === address.permanent_county)
        .map((item) => ({ label: item.city, value: item.city }))
    : []
);

const isAddressSame = ref([]);

watch(isAddressSame, () => {
  if (isAddressSame.value.length) {
    address.permanent_county = address.county;
    address.permanent_city = address.city;
    address.permanent_detail = address.detail;
    if (window) {
      triggerValidate.value = false;
      setTimeout(() => {
        triggerValidate.value = true;
      }, 0);
    }
  }
});

watchEffect(() => {
  if (
    address.permanent_city !== address.city ||
    address.permanent_county !== address.county ||
    address.permanent_detail !== address.detail
  ) {
    isAddressSame.value = [];
  }
});

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
  return (
    Object.values(address).every((value) => !!value) &&
    !!reportForm.mail &&
    !!reportForm.mobile_number
  );
});

const onNextStepClick = () => {
  triggerValidate.value = true;

  if (isValidatePass.value) {
    emits('onGeneralFormPass', { ...reportForm, ...address });
  }
};
</script>

<template>
  <form class="flex flex-col gap-y-6">
    <div>
      <p class="text-grey-900 font-semibold">申請人姓名 Name</p>
      <p class="text-grey-900">{{ user?.realName }}</p>
    </div>
    <div>
      <p class="text-grey-900 font-semibold">身分證字號 Personal ID</p>
      <p class="text-grey-900">{{ user?.idNo }}</p>
    </div>
    <div class="flex flex-col gap-y-3">
      <div>
        <label for="mobile_number" class="text-grey-900 font-semibold">
          <span>手機號碼</span>
          <span class="text-primary-500">* </span>
          <span>Mobile Number</span>
        </label>
        <BaseInput
          id="mobile_number"
          v-model="reportForm.mobile_number"
          :trigger-validate="triggerValidate"
          required
          class="w-full mt-2"
        />
      </div>
      <div>
        <label for="contact_number" class="text-grey-900 font-semibold">
          住家電話 Contact Number (Home)
        </label>
        <BaseInput id="contact_number" v-model="reportForm.contact_number" class="w-full mt-2" />
      </div>
      <div>
        <label for="mail" class="text-grey-900 font-semibold">
          <span>電子信箱</span>
          <span class="text-primary-500">* </span>
          <span>E-Mail</span>
        </label>
        <BaseInput
          id="mail"
          :trigger-validate="triggerValidate"
          v-model="reportForm.mail"
          required
          class="w-full mt-2"
        />
      </div>
      <div>
        <p class="text-grey-900 font-semibold">
          <span>通訊地址</span>
          <span class="text-primary-500">* </span>
          <span>Current Address</span>
        </p>
        <div class="grid grid-cols-2 gap-x-2 mt-2">
          <BaseSelect
            selectId="county"
            :options="countyOptions"
            :trigger-validate="triggerValidate"
            required
            default-selected="請選擇縣市"
            v-model="address.county"
          />
          <BaseSelect
            selectId="city"
            :options="cityOptions"
            :trigger-validate="triggerValidate"
            required
            default-selected="請選擇區域"
            v-model="address.city"
          />
        </div>
        <BaseInput
          placeholder="請輸入詳細地址"
          :trigger-validate="triggerValidate"
          v-model="address.detail"
          required
          class="mt-3 w-full"
        />
      </div>
      <div>
        <p class="text-grey-900 font-semibold">
          <span>戶籍地址</span>
          <span class="text-primary-500">* </span>
          <span>Regisered Permanent Address</span>
        </p>
        <BaseCheckbox
          :option="{ label: '同通訊地址', value: 'Y' }"
          v-model="isAddressSame"
          :trigger-validate="triggerValidate"
          class="[&>span]:text-grey-400 my-2"
        />
        <div class="grid grid-cols-2 gap-x-2">
          <BaseSelect
            selectId="county"
            :options="countyOptions"
            :trigger-validate="triggerValidate"
            required
            default-selected="請選擇縣市"
            v-model="address.permanent_county"
          />
          <BaseSelect
            selectId="city"
            :options="permanentCityOptions"
            :trigger-validate="triggerValidate"
            required
            default-selected="請選擇區域"
            v-model="address.permanent_city"
          />
        </div>
        <BaseInput
          placeholder="請輸入詳細地址"
          :trigger-validate="triggerValidate"
          v-model="address.permanent_detail"
          required
          class="mt-3 w-full"
        />
      </div>
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
    <BaseButton :disabled="!isAgree.length" @click="onNextStepClick">下一步</BaseButton>
  </form>
</template>
