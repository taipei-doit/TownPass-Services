<script setup lang="ts">
import { Dialog, DialogPanel, DialogTitle, TransitionRoot, TransitionChild } from '@headlessui/vue';
import { computed, onMounted, ref } from 'vue';
import LibrarySelectTabsView from '@/components/organisms/LibrarySelectTabsView.vue';
import type { Library } from '@/interfaces/library-book.interface';
import { useGoogleMapsStore } from '@/stores/googleMaps';

const props = defineProps<{
  libraries: Library[];
}>();

const emits = defineEmits(['confirm']);

const isOpen = defineModel({ default: false });

const inputValue = ref('');
const areaInputValue = ref('');

const activeTab = ref(0);

const googleMapsStore = useGoogleMapsStore();
const isMapReady = ref(false);

/**
 * 目前位置
 */
const currentLocation = ref<{ lat: number; lng: number; results: any[] }>({
  // 預設經緯度在信義區附近
  lat: 25.0325917,
  lng: 121.5624999,
  results: []
});

/**
 * 依距離排序圖書館列表
 */
const formatLibraries = computed(() => {
  return props.libraries.map((library) => {
    return {
      ...library,
      distance: parseFloat(
        (
          google.maps.geometry.spherical.computeDistanceBetween(
            new google.maps.LatLng(currentLocation.value.lat, currentLocation.value.lng),
            new google.maps.LatLng(library.lat, library.lng)
          ) / 1000
        ).toFixed(1)
      )
    };
  });
});

/**
 * 行政區列表
 */
const areaList = computed(() => {
  return Array.from(new Set(props.libraries.map((library) => library.area)));
});

onMounted(() => {
  initMap();
});

/**
 * 初始化地圖
 */
const initMap = () => {
  googleMapsStore.loader.load().then(async () => {
    // get current location
    getPositionClick();
  });
};

const getPositionClick = () => {
  googleMapsStore
    .gettingPosition()!!
    .then((position: any) => successCallback(position))
    .catch((error) => errorCallback(error));
};

const successCallback = (position: GeolocationPosition) => {
  currentLocation.value.lat = position.coords.latitude;
  currentLocation.value.lng = position.coords.longitude;

  isMapReady.value = true;
};

const errorCallback = (error: any) => {
  console.log(error);
  if (error.code === 1) {
    console.log('使用者未開啟定位');
  }
  isMapReady.value = true;
};

const onSelectClick = () => {
  console.log('inputValue:', inputValue.value);

  emits('confirm', inputValue.value);
};
</script>

<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" @close="isOpen = false" class="relative z-30">
      <div class="fixed inset-0 bg-black/25">
        <div class="min-h-full flex justify-center items-center">
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
              class="w-4/5 max-w-screen-md flex flex-col transform overflow-y-auto bg-white transition-all rounded pt-4"
            >
              <DialogTitle class="flex items-center justify-between px-3">
                請選擇取書館
                <button @click="isOpen = false" class="outline-none">
                  <img
                    src="@/assets/images/icon-cancel-default.svg"
                    width="24"
                    height="24"
                    class="size-6"
                  />
                </button>
              </DialogTitle>

              <div class="px-4 text-sm mt-4 mb-2">
                <LibrarySelectTabsView v-model="activeTab">
                  <template #tab0>
                    <template v-if="isMapReady">
                      <div
                        v-for="(library, index) in formatLibraries.sort(
                          (a, b) => a.distance - b.distance
                        )"
                        :key="index"
                        class="flex justify-between mb-2 py-2"
                      >
                        <input
                          type="radio"
                          name="library"
                          :id="library.id"
                          :value="library.id"
                          class="hidden"
                          v-model="inputValue"
                          @change="onSelectClick"
                        />
                        <label
                          class="clamp-1-lines flex-grow"
                          :for="library.id"
                          :class="inputValue === library.id ? 'text-primary-500' : ''"
                        >
                          {{ library.name }}
                        </label>
                        <img
                          src="@/assets/images/check-icon-outline.svg"
                          width="20"
                          alt="checked"
                          v-if="inputValue === library.id"
                        />
                        <label
                          :for="library.id"
                          class="flex-shrink-0 whitespace-nowrap ml-2"
                          v-else
                        >
                          {{ library.distance }} 公里
                        </label>
                      </div>
                      <p class="text-grey-400 text-center mt-2" v-if="!libraries.length">
                        目前無取書館與站點
                      </p>
                    </template>
                    <template v-else>
                      <div class="p-4 flex items-center justify-center">
                        <svg
                          aria-hidden="true"
                          class="w-8 h-8 text-gray-200 animate-spin dark:text-grey-200 fill-primary-500"
                          viewBox="0 0 100 101"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="currentColor"
                          />
                          <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="currentFill"
                          />
                        </svg>
                      </div>
                    </template>
                  </template>
                  <template #tab1>
                    <template v-if="libraries.length">
                      <div class="grid grid-cols-3 gap-2 py-2">
                        <label
                          v-for="(area, index) in areaList"
                          :key="index"
                          :for="area"
                          class="area"
                          :class="areaInputValue === area ? 'active' : ''"
                        >
                          <input
                            type="radio"
                            name="library"
                            :id="area"
                            :value="area"
                            class="hidden"
                            v-model="areaInputValue"
                            @change="onSelectClick"
                          />
                          {{ area }}
                        </label>
                      </div>
                      <p class="text-grey-400" v-if="!areaInputValue">
                        台北市 共 {{ libraries.length }} 個取書館與站點
                      </p>
                      <p class="text-grey-400" v-else>
                        {{ areaInputValue }} 共
                        {{ libraries.filter((library) => library.area === areaInputValue).length }}
                        個取書館與站點
                      </p>
                      <hr class="my-2" />
                      <template v-if="!areaInputValue">
                        <div
                          v-for="(library, index) in libraries"
                          :key="index"
                          class="flex justify-between mb-2 py-2"
                        >
                          <input
                            type="radio"
                            name="library"
                            :id="library.id"
                            :value="library.id"
                            class="hidden"
                            v-model="inputValue"
                            @change="onSelectClick"
                          />
                          <label
                            class="clamp-1-lines flex-grow"
                            :for="library.id"
                            :class="inputValue === library.id ? 'text-primary-500' : ''"
                          >
                            {{ library.name }}
                          </label>
                          <img
                            src="@/assets/images/check-icon-outline.svg"
                            width="20"
                            alt="checked"
                            v-if="inputValue === library.id"
                          />
                        </div>
                      </template>
                      <template v-else>
                        <div
                          v-for="(library, index) in libraries.filter(
                            (library) => library.area === areaInputValue
                          )"
                          :key="index"
                          class="flex justify-between mb-2 py-2"
                        >
                          <input
                            type="radio"
                            name="library"
                            :id="library.id"
                            :value="library.id"
                            class="hidden"
                            v-model="inputValue"
                            @change="onSelectClick"
                          />
                          <label
                            class="clamp-1-lines flex-grow"
                            :for="library.id"
                            :class="inputValue === library.id ? 'text-primary-500' : ''"
                          >
                            {{ library.name }}
                          </label>
                          <img
                            src="@/assets/images/check-icon-outline.svg"
                            width="20"
                            alt="checked"
                            v-if="inputValue === library.id"
                          />
                        </div>
                      </template>
                    </template>
                    <template v-else>
                      <p class="text-grey-400 text-center mt-2" v-if="!libraries.length">
                        目前無取書館與站點
                      </p>
                    </template>
                  </template>
                </LibrarySelectTabsView>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<style lang="postcss" scoped>
.clamp-1-lines {
  display: -webkit-box;
  -webkit-line-clamp: 1; /* 限制顯示兩行 */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.area {
  @apply p-2 text-center;
  @apply border border-grey-500 rounded-xl;
  @apply relative;

  &.active {
    @apply border-primary-500 text-primary-500 overflow-hidden;

    &::after {
      content: '';
      @apply absolute bottom-0 right-0;
      width: 0;
      height: 0;
      border-right: 20px solid theme('colors.primary.500'); /* 設置三角形高度與顏色 */
      border-top: 20px solid transparent; /* 控制三角形寬度，設為透明 */
    }

    &::before {
      content: '';
      @apply absolute bottom-[5px] right-[1px] z-10;
      width: 8px; /* 調整勾勾的寬度 */
      height: 6px; /* 調整勾勾的高度 */
      background-image: url('@/assets/images/check-icon-outline-white.svg'); /* 替換成勾勾圖片的路徑 */
      background-size: contain;
      background-repeat: no-repeat;
    }
  }
}
</style>
