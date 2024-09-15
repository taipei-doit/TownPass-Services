<script setup lang="ts">
import { computed, ref } from 'vue';
import { useCounterStore } from '@/stores/counter';
import { storeToRefs } from 'pinia';
import BaseCheckbox from '@/components/atoms/BaseCheckbox.vue';
import BaseButton from '@/components/atoms/BaseButton.vue';
import { Dialog, DialogPanel, TransitionRoot, TransitionChild } from '@headlessui/vue';

export interface Counter {
  id: string;
  name: string;
  icon: string;
  list?: SubCounter[];
}

export interface SubCounter {
  id: string;
  name: string;
  is_regularly_used: boolean;
  info: {
    address: string;
    tel: string;
    fax: string;
  };
  counters?: {
    id: string;
    name: string;
    current_number: string;
    waiting_people: number;
  }[];
}

const counterStore = useCounterStore();
const { counterList, regularlyUsedList } = storeToRefs(counterStore);

const counterId = (subId: string) => {
  return counterList.value.find((item) => item.list?.find((subItem) => subItem.id === subId))!.id;
};

const model = ref([]);

const options = computed(() => {
  return regularlyUsedList.value.map((item) => {
    return {
      label: item.name,
      value: item.name
    };
  });
});

const isEditOpen = ref(false);

const onSubmitClick = () => {
  const namesToDelete = new Set<string>(model.value);

  counterList.value = counterList.value.map((counter) => {
    // Check if counter has a list and map through the list
    const updatedList = counter.list?.map((item) => {
      if (namesToDelete.has(item.name)) {
        // If the name is in namesToDelete, set is_regularly_used to false
        return {
          ...item,
          is_regularly_used: false
        };
      }
      return item;
    });

    // Return the updated counter with the modified list
    return {
      ...counter,
      list: updatedList || counter.list // Keep the original list if undefined
    };
  });

  isEditOpen.value = false;
};
</script>

<template>
  <div class="px-5 py-8 bg-white border-b-2 border-grey-200" v-if="regularlyUsedList.length">
    <div class="flex justify-between">
      <h5 class="font-bold mb-3">常用地點</h5>
      <a href="javascript:void(0)" @click="isEditOpen = true"> 變更 </a>
    </div>
    <div class="w-full flex flex-col">
      <RouterLink
        :to="{
          name: 'counter-calling-detail',
          params: { id: counterId(counterItem.id) },
          query: {
            subId: counterItem.id
          }
        }"
        class="regularly-used-wrapper"
        v-for="(counterItem, index) in regularlyUsedList"
        :key="index"
      >
        <span>{{ counterItem.name }}</span>
      </RouterLink>
    </div>
  </div>
  <div class="h-screen px-5 py-8 bg-grey-50">
    <h5 class="font-bold mb-3">櫃檯等待人數查詢</h5>
    <div class="w-full flex flex-col">
      <RouterLink
        :to="{
          name: 'counter-calling-detail',
          params: { id: counter.id }
        }"
        class="link-wrapper"
        v-for="(counter, index) in counterList"
        :key="index"
      >
        <img :src="counter.icon" class="icon" :alt="counter.name" />
        <span>{{ counter.name }}</span>
      </RouterLink>
    </div>
  </div>

  <TransitionRoot appear :show="isEditOpen" as="template">
    <Dialog as="div" @close="isEditOpen = false" class="relative z-30">
      <div class="fixed inset-0">
        <div class="min-h-full">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel
              class="w-full h-screen max-w-screen-md flex flex-col transform overflow-y-auto bg-white transition-all"
            >
              <div class="px-5 py-8 bg-white">
                <h5 class="font-bold mb-3">請選擇要移除的地點</h5>
                <div class="w-full flex flex-col">
                  <BaseCheckbox
                    v-for="option in options"
                    :key="option.value"
                    :option="option"
                    v-model="model"
                    class="edit-regularly-used-wrapper"
                  />
                </div>
                <BaseButton :shape="'rounded'" @click="onSubmitClick" class="mt-4 w-full">
                  移除地點
                </BaseButton>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<style lang="postcss" scoped>
.link-wrapper {
  @apply relative p-5 mb-3 bg-white rounded-md shadow-md;
  @apply flex items-center;
  @apply after:content-[''] after:w-6 after:h-6;
  @apply after:bg-[url('@/assets/images/down-icon.svg')] after:bg-cover after:bg-no-repeat after:-rotate-90;
  @apply after:block after:absolute after:top-1/2 after:-translate-y-1/2 after:right-2;

  .icon {
    @apply w-10 h-10 bg-primary-100 rounded-full mr-3 p-2;
  }
}

.regularly-used-wrapper {
  @apply relative py-5 mb-3 border-b border-grey-50;
  @apply flex items-center;
  @apply after:content-[''] after:w-6 after:h-6;
  @apply after:bg-[url('@/assets/images/down-icon.svg')] after:bg-cover after:bg-no-repeat after:-rotate-90;
  @apply after:block after:absolute after:top-1/2 after:-translate-y-1/2 after:right-2;

  .icon {
    @apply w-10 h-10 bg-primary-100 rounded-full mr-3 p-2;
  }
}

.edit-regularly-used-wrapper {
  @apply relative py-5 mb-3 border-b border-grey-50 w-full;
  @apply flex items-center;
}
</style>
