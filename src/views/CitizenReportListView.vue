<script setup lang="ts">
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useCitizenReportStore } from '@/stores/citizenReport';
import BaseInput from '@/components/atoms/BaseInput.vue';
import FixedTitleSection from '@/components/molecules/FixedTitleSection.vue';
import CollapseItem from '@/components/molecules/CollapseItem.vue';

const store = useCitizenReportStore();

const { citizenReport } = storeToRefs(store);

const activeCategory = ref('');

const onCategoryClick = (id: string) => {
  if (activeCategory.value === id) {
    activeCategory.value = '';
  } else {
    activeCategory.value = id;
  }
};
</script>

<template>
  <div class="citizen-report-list">
    <FixedTitleSection title="有話要說">
      <div class="my-3">
        <RouterLink :to="{ name: 'citizen-report-search' }" class="flex">
          <BaseInput readonly placeholder="您遇到哪些問題?" class="flex-grow" />
          <button class="search-button">
            <img src="@/assets/images/search-icon.svg" alt="搜尋" />
          </button>
        </RouterLink>
      </div>
    </FixedTitleSection>
    <div class="px-4 py-3 min-h-[calc(100vh-108px)]" :class="{ 'bg-grey-100': activeCategory }">
      <ul v-if="citizenReport" class="flex flex-col gap-y-5">
        <CollapseItem
          v-model="activeCategory"
          v-for="item in citizenReport.all_report"
          :key="item.id"
          :item="item"
        >
          <template #default="{ item }">
            <div v-if="item.service_requesting.length">
              <div class="flex items-center translate-y-0.5">
                <img
                  src="@/assets/images/service-reuqesting.svg"
                  alt="立即支援"
                  width="20"
                  height="20"
                  class="size-5"
                />
                <p class="pl-4 text-[#76A732] font-bold">立即支援 Service Requesting</p>
              </div>
              <div class="flex pl-[9px]">
                <div class="w-0.5 bg-[#76A732]" />
                <ul class="pt-4 flex flex-col gap-y-4 pl-6">
                  <li
                    v-for="service in item.service_requesting"
                    :key="service.id"
                    class="citizen-report-list__service before:bg-[#76A732]"
                  >
                    <RouterLink :to="{ name: 'citizen-report-form', params: { id: service.id } }">
                      {{ service.name }}
                    </RouterLink>
                  </li>
                </ul>
              </div>
            </div>

            <div v-if="item.problem_reporting.length">
              <div class="flex items-center translate-y-0.5">
                <img
                  src="@/assets/images/problem-reporting.svg"
                  alt="民眾陳情"
                  width="20"
                  height="20"
                  class="size-5"
                />
                <p class="pl-4 text-[#52C2D0] font-bold">民眾陳情 Problem Reporting</p>
              </div>
              <div class="flex pl-[9px]">
                <div class="w-0.5 bg-[#52C2D0]" />
                <ul class="pt-4 flex flex-col gap-y-4 pl-6">
                  <li
                    v-for="service in item.problem_reporting"
                    :key="service.id"
                    class="citizen-report-list__service before:bg-[#52C2D0]"
                  >
                    <RouterLink :to="{ name: 'citizen-report-form', params: { id: service.id } }">
                      {{ service.name }}
                    </RouterLink>
                  </li>
                </ul>
              </div>
            </div>
          </template>
        </CollapseItem>
        <li>
          <button class="w-full flex justify-between" @click="onCategoryClick('CR-99')">
            <div class="flex">
              <img
                src="@/assets/images/other-service.svg"
                alt="自動選擇案件類別"
                width="20"
                height="20"
                class="size-5"
              />
              <span class="text-sm font-semibold ml-1.5">自動選擇案件類別</span>
            </div>
            <img
              src="@/assets/images/down-icon.svg"
              class="transition-transform"
              :class="{
                'rotate-180': activeCategory === 'CR-99'
              }"
            />
          </button>
          <div
            class="grid grid-rows-[0fr] transition-all"
            :class="{
              'grid-rows-[1fr]': activeCategory === 'CR-99'
            }"
          >
            <div class="overflow-hidden pt-3">
              <div>
                <div class="flex items-center translate-y-0.5">
                  <img
                    src="@/assets/images/problem-reporting.svg"
                    alt="民眾陳情"
                    width="20"
                    height="20"
                    class="size-5"
                  />
                  <p class="pl-4 text-[#52C2D0] font-bold">民眾陳情 Problem Reporting</p>
                </div>
                <div class="flex pl-[9px]">
                  <div class="w-0.5 bg-[#52C2D0]" />
                  <ul class="pt-4 flex flex-col gap-y-4 pl-6">
                    <li class="citizen-report-list__service before:bg-[#52C2D0]">
                      <RouterLink :to="{ name: 'citizen-report-form', params: { id: 'R-99' } }">
                        非屬前述各類之其他事項 - 其他事項(自動選擇案件類別)
                      </RouterLink>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="postcss">
.citizen-report-list {
  @apply pt-28;

  &__service {
    @apply relative;
    @apply before:content-[''];
    @apply before:w-1.5 before:h-0.5;
    @apply before:inline-block;
    @apply before:absolute before:-left-6 before:top-1/2 before:-translate-y-1/2;
  }
}
</style>
