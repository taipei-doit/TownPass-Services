<template>
  <div ref="mapContainer" class="map-container"></div>
</template>

<script>
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = 'pk.eyJ1IjoiZjc0MTE0NzYwIiwiYSI6ImNtMHJyenV3eTBjOGQyaXNicDFsbXU2YzIifQ.fhoguJDc6TfWAGwn471Hog';
export default {
  mounted() {
    const map = new mapboxgl.Map({
      container: this.$refs.mapContainer,
      style: 'mapbox://styles/mapbox/navigation-day-v1', // Replace with your preferred map style
      center: [121.5624999, 25.0325917],
      zoom: 12
    });

    this.map = map;
  },
  unmounted() {
    this.map.remove();
    this.map = null;
  }
};
</script>

<style>
.map-container {
  flex: 1;
}
</style>
