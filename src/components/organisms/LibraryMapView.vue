<script setup lang="ts">
import type { Library } from '@/interfaces/library-book.interface';
import LibraryList from '@/components/organisms/LibraryListView.vue';
import LibraryDetail from '@/components/organisms/LibraryDetailView.vue';
import MessageModal from '@/components/molecules/MessageModal.vue';
import { useGoogleMapsStore } from '@/stores/googleMaps';
import { onMounted, ref, watch } from 'vue';
import greenDotIconUrl from '/public/images/map/youbike/mappin-green.svg';
import defaultFocusIconUrl from '/public/images/map/icon_mappin-garbagetruck-green-pressed.svg';
import { MarkerClusterer, SuperClusterAlgorithm } from '@googlemaps/markerclusterer';
import { useLibraryStore } from '@/stores/library';
import { storeToRefs } from 'pinia';

const googleMapsStore = useGoogleMapsStore();
const libraryStore = useLibraryStore();
const { libraryList } = storeToRefs(libraryStore);

/**
 * 目前位置
 */
const currentLocation = ref<{ lat: number; lng: number; results: any[] }>({
  // 預設經緯度在信義區附近
  lat: 25.0325917,
  lng: 121.5624999,
  results: []
});

/** 搜尋結果 */
const searchLibraryList = ref<Library[]>([]);
/** 視窗下搜尋結果 */
const filteredLibraryList = ref<Library[]>([]);
const selectedLibrary = ref<Library | null>(null);

let isMapReady = ref(false);

let map: any = null;
/** 使用者定位 */
let marker: any = null;
let markers: google.maps.Marker[] = [];
let markerCluster: any = null;

/** 是否點選展開列表 */
const isExpandList = ref(false);
/** 是否點選展開明細 */
const isExpandDetail = ref(false);
const isFrom = ref<'spot' | 'list' | ''>('');

/**
 * 是否顯示未開啟取用位置權限通知
 */
let isShowGeoError = ref(false);

const setMapHeight = () => {
  const mapElement = document.getElementById('map');
  if (mapElement) {
    mapElement.style.height = `${window.innerHeight - 88}px`;
  }
};

/**
 * 初始化地圖
 * @param lat 緯度
 * @param lng 經度
 */
const initMap = (lat: number, lng: number) => {
  googleMapsStore.loader.load().then(async () => {
    const { Map } = (await google.maps.importLibrary('maps')) as google.maps.MapsLibrary;

    map = new Map(document.getElementById('map') as HTMLElement, {
      // 設定地圖的中心點經緯度位置
      center: { lat, lng },
      // 設定地圖縮放比例 0-20
      zoom: 13,
      // 限制使用者能縮放地圖的最大比例
      maxZoom: 20,
      // 限制使用者能縮放地圖的最小比例
      minZoom: 3,
      // 設定是否呈現右下角街景小人
      streetViewControl: false,
      // 設定是否讓使用者可以切換地圖樣式：一般、衛星圖等
      mapTypeControl: false,
      fullscreenControl: false,
      zoomControl: false,
      // 替換成您的 MAP ID
      mapId: ''
    });

    // init marker
    marker = new google.maps.Marker({
      position: {
        lat,
        lng
      },
      map,
      title: 'your location',
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: '#4285F4',
        fillOpacity: 1,
        scale: 8, // 控制大小
        strokeColor: 'white',
        strokeWeight: 2
      }
    });

    // get current location
    getPositionClick();

    // 在地圖的dragend事件上使用該函數
    map.addListener('dragend', function () {
      updateMarkers();
    });

    // // 在地圖的zoom_changed事件上使用該函數
    map.addListener('zoom_changed', function () {
      updateMarkers();
    });

    isMapReady.value = true;
    setMapHeight();
    window.addEventListener('resize', setMapHeight);
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

  // 使用者目前位置
  marker.setPosition(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
  map.setCenter(marker.getPosition()!);
};
const errorCallback = (error: any) => {
  console.log(error);
  if (error.code === 1) {
    // 使用者未開啟定位
    isShowGeoError.value = true;
  }
};

const updateMarkers = async () => {
  console.log('map', map);

  // if (!selectedSearchData.value?.id) {
  //   clearMarkers();
  //   return;
  // }

  const bounds = map?.getBounds();
  if (!bounds) return;

  filteredLibraryList.value = searchLibraryList.value
    .map((spot) => ({
      ...spot,
      position: new google.maps.LatLng(spot.lat, spot.lng)
    }))
    .filter((spot) => bounds.contains(spot.position))
    .map((spot) => ({
      ...spot,
      distance: parseFloat(
        (
          google.maps.geometry.spherical.computeDistanceBetween(
            new google.maps.LatLng(currentLocation.value.lat, currentLocation.value.lng),
            new google.maps.LatLng(spot.lat, spot.lng)
          ) / 1000
        ).toFixed(1)
      )
    }));

  console.log('filteredLibraryList:', filteredLibraryList.value);

  // Clear existing markers
  clearMarkers();

  let currentFocusedMarker: any = null;

  filteredLibraryList.value.forEach((spot) => {
    const greenDotIcon = {
      url: greenDotIconUrl, // 預設綠色小圓點圖標的路徑
      scaledSize: new google.maps.Size(20, 20), // 設置圖標的大小
      anchor: new google.maps.Point(10, 20) // 設置圖標的錨點，使其中心對齊底部
    };

    const marker = new google.maps.Marker({
      position: { lat: Number(spot.lat), lng: Number(spot.lng) },
      map,
      icon: greenDotIcon
    });

    marker.addListener('click', () => {
      if (currentFocusedMarker && currentFocusedMarker !== marker) {
        // 恢復之前聚焦的標記為預設圖標
        currentFocusedMarker.setIcon(greenDotIcon);
        selectedLibrary.value = null;
      }

      const focusedIcon = {
        url: defaultFocusIconUrl, // 點擊後聚焦圖標的路徑
        scaledSize: new google.maps.Size(48, 69), // 設置圖標的大小
        anchor: new google.maps.Point(24, 69) // 設置圖標的錨點，使其中心對齊底部
      };

      // 設置當前標記為聚焦圖標
      marker.setIcon(focusedIcon);
      currentFocusedMarker = marker;

      // 獲取所選擇的 spot 的所有屬性
      selectedLibrary.value = spot;
      console.log('Selected spot:', selectedLibrary);
    });

    markers.push(marker);
  });

  // Add a marker clusterer to manage the markers.
  markerCluster = new MarkerClusterer({
    markers,
    map,
    algorithm: new SuperClusterAlgorithm({ radius: 300 }), // 设置gridSize
    renderer: {
      render({ count, position }, stats) {
        // change color if this cluster has more markers than the mean cluster
        const circleRadius =
          count > Math.max(10, stats.clusters.markers.mean)
            ? count > Math.max(100, stats.clusters.markers.mean)
              ? '100'
              : '90'
            : '80';
        // create svg literal with fill color
        const svg =
          window.btoa(`<svg fill="#2eb6c7" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" width="50" height="50">
          <circle fill="#2eb6c7" cx="120" cy="120" opacity=".6" r="${circleRadius}" />
          <circle fill="#fff" cx="120" cy="120" r="70" />
          <text x="50%" y="50%" style="fill:#2eb6c7" text-anchor="middle" font-size="50" dominant-baseline="middle" font-family="roboto,arial,sans-serif">${count}</text>
          </svg>`);

        // create marker using svg icon
        return new google.maps.Marker({
          position,
          icon: {
            url: `data:image/svg+xml;base64,${svg}`,
            scaledSize: new google.maps.Size(75, 75)
          },
          // adjust zIndex to be above other markers
          zIndex: Number(google.maps.Marker.MAX_ZINDEX) + count
        });
      }
    }
  });
};

const clearMarkers = () => {
  markers.forEach((marker) => marker.setMap(null));
  markers = [];
  if (markerCluster) {
    markerCluster.clearMarkers();
  }
  selectedLibrary.value = null;
};

onMounted(() => {
  searchLibraryList.value = libraryList.value;
  initMap(currentLocation.value.lat, currentLocation.value.lng);
});

// Watch for changes in searchLibraryList
watch(searchLibraryList, updateMarkers);
</script>

<template>
  <div class="">
    <div
      :class="{ hidden: isExpandList || isExpandDetail, visible: !isExpandList && !isExpandDetail }"
    >
      <!-- 地圖 -->
      <div class="relative flex-1">
        <div class="google-map" id="map"></div>
        <div v-if="isMapReady" class="gps" @click="getPositionClick">
          <img src="@/assets/images/gps.png" width="20" alt="" />
        </div>
      </div>
      <!-- 選取的點 -->
      <div
        v-if="selectedLibrary"
        class="floating-box bottom-24 left-[50%] translate-x-[-50%] w-[90%]"
        @click="
          isExpandDetail = true;
          isFrom = 'spot';
        "
      >
        <div>
          <p class="font-bold mb-2">{{ selectedLibrary.name }}</p>
          <div class="flex mb-2">
            <img src="@/assets/images/icon-geo.svg" alt="" />
            <span class="underline">{{ selectedLibrary.address }}</span>
          </div>
          <!-- custom template -->
          <div class="flex text-grey-500">
            <span>{{ selectedLibrary.distance }}公里</span>
          </div>
        </div>
        <img src="@/assets/images/down-icon.svg" class="-rotate-90" alt="" />
      </div>
      <!-- 底部搜尋結果 -->
      <div class="floating-box bottom-0 w-full">
        <div class="flex items-center">
          <span class="font-bold mr-2">分館與站點</span>
          <div class="text-primary-500 border border-primary-500 rounded-full px-2">
            {{ filteredLibraryList.length }}筆結果
          </div>
        </div>
        <a class="text-primary-500" @click="isExpandList = true">展開列表</a>
      </div>
    </div>
    <!-- 搜尋結果列表 -->
    <LibraryList
      v-if="isExpandList"
      :filteredLibraryList="filteredLibraryList"
      @update:isExpandList="(value: boolean) => (isExpandList = value)"
      @update:selectedLibrary="
        (value: Library) => {
          selectedLibrary = value;
          isExpandDetail = true;
          isFrom = 'list';
        }
      "
    />
    <!-- 搜尋結果明細 -->
    <LibraryDetail
      v-if="selectedLibrary && isExpandDetail && isFrom"
      :selectedLibrary="selectedLibrary"
      @update:isExpandDetail="
        (value) => {
          isExpandDetail = value;
          selectedLibrary = null;
          if (isFrom === 'list') {
            isExpandList = true;
          }
          isFrom = '';
        }
      "
    />
  </div>

  <!-- geo modal -->
  <MessageModal :is-show="isShowGeoError">
    <template #header>
      <p>請啟用定位服務</p>
    </template>
    <template #body>
      <p class="text-grey-700">打開定位服務來允許“城市通”確認您的位置</p>
    </template>
    <template #footer>
      <button class="text-primary-500 px-7 py-2 w-full" @click="isShowGeoError = false">
        確認
      </button>
    </template>
  </MessageModal>
</template>

<style lang="postcss" scoped>
.google-map {
  width: 100%;
  height: 400px;
}

.marker {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60px;
}

.gps {
  position: absolute;
  right: 10px;
  top: 10px;
  background-color: rgb(255, 255, 255);
  width: 40px;
  height: 40px;
  user-select: none;
  box-shadow: rgba(0, 0, 0, 0.3) 0px 1px 4px -1px;
  border-radius: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.floating-box {
  @apply absolute flex items-center justify-between bg-white px-4 py-6 rounded-xl;
  box-shadow: rgba(0, 0, 0, 0.04) 0px -4px 10px;
}
</style>
