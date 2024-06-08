<script setup lang="ts">
import { ref, reactive, onMounted, watch, computed } from 'vue';
import { storeToRefs } from 'pinia';
import placeListJson from '../../../public/mock/place_list.json';

export interface Place {
  id: string;
  name: string;
  icon: string;
  agency: string;
  type: string;
  data_type?: 'api' | 'json' | 'csv';
  request_url: string;
  format_fields?: {
    id: string;
    name: string;
    area: string;
    address: string;
    lat: string;
    lng: string;
  };
  service_infos?: {
    title: string;
    value: { title: string; value: string }[] | string;
  }[];
}

const emit = defineEmits(['onSearchChange', 'update:isExpand']);

const searchValue = ref('');

/** 搜尋紀錄列表 */
const searchHistoryList = ref<{ name: string; places: Place[] }[]>([
  {
    name: '搜尋紀錄',
    places: [
      {
        id: 'sa-1',
        name: '微笑單車 2.0',
        icon: '',
        agency: '',
        type: '搜尋紀錄',
        request_url: ''
      }
    ]
  }
]);
/** 服務列表 */
const placeList = ref(placeListJson);
const places = computed(() => placeList.value.list.map((category) => category.places).flat());
/** 服務列表下拉選單 */
const options = computed(() => {
  return placeList.value.list
    .map((category) => category.places) // 提取所有的places陣列
    .flat() // 將所有的places合併為一個陣列
    .map((place) => ({
      label: place.name,
      value: place.id
    }));
});

const expandList = ref<string[]>([]);
const expandListSet = computed(() => new Set(expandList.value.map((name) => name)));

const onPanelExpandClick = (name: string) => {
  if (expandListSet.value.has(name)) {
    const index = expandList.value.findIndex((el) => el === name);
    expandList.value.splice(index, 1);
  } else {
    expandList.value.push(name);
  }
};

const isExpand = ref(false);
const toggleExpand = () => {
  isExpand.value = !isExpand.value;
};

watch([isExpand, searchValue], ([newExpandValue, newSearchValue]) => {
  console.log('isExpand:', newExpandValue, 'searchValue:', newSearchValue);

  const selectedSearchData = places.value.find((place) => place.id === newSearchValue);
  // const searchName = options.value.find((option) => option.value === newSearchValue)?.label;
  emit('update:isExpand', newExpandValue);
  emit('onSearchChange', selectedSearchData);
});

const onSelect = (place: Place) => {
  searchValue.value = place.id;
  toggleExpand();
};
</script>

<template>
  <section class="relative flex flex-col flex-1">
    <div class="py-5 pl-4 pr-2">
      <div class="base-select-wrapper" :class="{ expanded: isExpand }">
        <select
          v-bind="$attrs"
          id="findPlace"
          v-model="searchValue"
          class="base-select"
          @mousedown.prevent="toggleExpand"
        >
          <option value="" selected>請選擇要找的服務地圖</option>
          <option v-for="option in options" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </div>
    </div>
    <template v-if="isExpand">
      <div class="w-full flex flex-col overflow-y-auto">
        <ul>
          <li
            class="text-primary-500 bg-primary-50"
            v-for="item in searchHistoryList"
            :key="item.name"
            :class="{
              'bg-grey-50 pt-4': expandListSet.has(item.name),
              'py-4': !expandListSet.has(item.name)
            }"
          >
            <button
              class="px-4 w-full flex justify-between items-center text-grey-700 font-bold"
              :class="{
                'pb-4': expandListSet.has(item.name)
              }"
              @click="onPanelExpandClick(item.name)"
            >
              <span>{{ item.name }}</span>
              <div class="flex items-center">
                <a
                  href=""
                  v-if="expandListSet.has(item.name)"
                  class="mr-2 underline text-primary-500"
                >
                  清空
                </a>
                <img
                  src="@/assets/images/down-icon.svg"
                  class="transition-transform"
                  :class="{
                    'rotate-180': expandListSet.has(item.name)
                  }"
                />
              </div>
            </button>
            <div
              class="grid grid-rows-[0fr] transition-all"
              :class="{
                'grid-rows-[1fr]': expandListSet.has(item.name)
              }"
            >
              <ul class="overflow-hidden">
                <li v-for="place in item.places" :key="place.name" class="px-4 bg-grey-50">
                  <div
                    class="flex items-center py-5 px-4 border-b border-grey-200"
                    @click="onSelect(place)"
                  >
                    <img src="@/assets/images/icon-history.svg" class="w-6 h-6 mr-2" />
                    <span class="text-grey-700">
                      {{ place.name }}
                    </span>
                  </div>
                </li>
              </ul>
            </div>
          </li>
          <li class="py-5 px-4 text-primary-500 bg-primary-50" v-if="!searchHistoryList.length">
            無搜尋紀錄
          </li>
          <li class="py-5 px-4 bg-orange-100">防空避難設備</li>
          <li
            v-for="item in placeList.list"
            :key="item.name"
            :class="{
              'bg-grey-50 pt-4': expandListSet.has(item.name),
              'bg-white py-4': !expandListSet.has(item.name)
            }"
          >
            <button
              class="px-4 w-full flex justify-between items-center text-grey-700 font-bold"
              @click="onPanelExpandClick(item.name)"
            >
              <span>{{ item.name }}</span>
              <img
                src="@/assets/images/down-icon.svg"
                class="transition-transform"
                :class="{
                  'rotate-180': expandListSet.has(item.name)
                }"
              />
            </button>
            <div
              class="grid grid-rows-[0fr] transition-all"
              :class="{
                'grid-rows-[1fr]': expandListSet.has(item.name)
              }"
            >
              <ul class="overflow-hidden">
                <li v-for="place in item.places" :key="place.name" class="px-4">
                  <div
                    class="flex items-center py-5 px-4 border-b border-grey-200"
                    @click="onSelect(place)"
                  >
                    <!-- <img src="@/assets/images/icon-drinking.svg" class="w-6 h-6 mr-2" /> -->
                    <span class="text-grey-700">
                      {{ place.name }}
                    </span>
                  </div>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </div>
    </template>
  </section>
</template>
<style lang="postcss" scoped>
.base-select-wrapper {
  @apply relative;
  @apply after:content-[''] after:w-6 after:h-6;
  @apply after:bg-[url('@/assets/images/down-icon.svg')] after:bg-cover after:bg-no-repeat;
  @apply after:block after:absolute after:top-1/2 after:-translate-y-1/2 after:right-2;

  &.expanded {
    @apply after:rotate-180;
  }
}
</style>
