<script setup lang="ts">
import { ref, watch } from 'vue';
import BaseInput from '@/components/atoms/BaseInput.vue';

const props = defineProps<{
  radioName: string;
  radioId: string;
  radioText: string;
  required?: boolean;
  triggerValidate?: boolean;
  formFormat?: Record<string, any>[];
  form?: any;
}>();

const emits = defineEmits(['update:form-field']);

const inputValue = defineModel();

const isValidate = ref(true);

const validate = () => {
  isValidate.value = !!inputValue.value;
};

watch(
  () => props.triggerValidate,
  () => {
    validate();
  }
);

watch(
  () => inputValue.value,
  () => {
    isValidate.value = true;
  }
);
</script>

<template>
  <label :for="`${props.radioName}${props.radioId}`" class="block mb-4">
    <input
      type="radio"
      :name="props.radioName"
      :id="`${props.radioName}${props.radioId}`"
      :value="props.radioId"
      class="base-radio"
      v-model="inputValue"
    />
    <span class="base-radio-text" :class="{ 'base-radio-text--warn': required && !isValidate }">
      {{ radioText }}
    </span>
  </label>
  <template v-if="inputValue === props.radioId">
    <template v-for="(item, index) in formFormat" :key="index">
      <p class="text-grey-400 text-sm mb-2" v-if="item.description">
        {{ item.description }}
      </p>
      <BaseInput
        v-bind:model-value="form[item.field]"
        @update:model-value="
          (value) => {
            console.log('value:', value);
            emits('update:form-field', { field: item.field, value });
          }
        "
        class="w-full mb-4"
        :class="{ 'base-input--warn': required && !isValidate }"
      ></BaseInput>
    </template>
  </template>
</template>

<style lang="postcss">
.base-radio {
  @apply absolute;
  @apply w-0 h-0 opacity-0;

  & + .base-radio-text {
    @apply after:opacity-0 after:scale-0;
  }

  &:checked {
    & + .base-radio-text {
      @apply after:opacity-100 after:scale-100;
      @apply before:border-primary-500;
    }
  }
}

.base-radio-text {
  @apply relative;
  @apply pl-7;
  @apply before:content-[''];
  @apply before:absolute before:left-0 before:top-0;
  @apply before:w-5 before:h-5;
  @apply before:border-2 before:border-gray-500 before:rounded-full;
  @apply before:transition-colors;

  @apply after:content-[''];
  @apply after:w-2.5 after:h-2.5;
  @apply after:bg-primary-500;
  @apply after:absolute after:top-[5px] after:left-[5px];
  @apply after:rounded-full;
  @apply after:transition-all;

  &--warn {
    @apply before:border-warn-200;
  }
}
</style>
