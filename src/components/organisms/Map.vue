<template>
  <div ref="mapContainer" class="map-container"></div>
</template>

<script>
import mapboxgl from 'mapbox-gl';
import axios from 'axios';

mapboxgl.accessToken =
  'pk.eyJ1IjoiZjc0MTE0NzYwIiwiYSI6ImNtMHJyenV3eTBjOGQyaXNicDFsbXU2YzIifQ.fhoguJDc6TfWAGwn471Hog';
export default {
  mounted() {
    const map = new mapboxgl.Map({
      container: this.$refs.mapContainer,
      style: 'mapbox://styles/mapbox/light-v11', // Replace with your preferred map style
      center: [121.5624999, 25.0325917],
      zoom: 15
    });

    // axios
    //   .post(
    //     'https://itaipeiparking.pma.gov.taipei/MapAPI/GetAllPOIData',
    //     {
    //       lon: 121.55574793722592,
    //       lat: 25.036061711414888,
    //       catagory: 'car',
    //       type: 1
    //     },
    //     {
    //       headers: {
    //         'Content-Type': 'application/x-www-form-urlencoded'
    //       }
    //     }
    //   )
    //   .then((i) => console.log(i));
    let lon = 121.5624999,
      lat = 25.0325917;
    axios
      .get(
        // 'https://api.wavjaby.nckuctf.org:25569'
        `http://127.0.0.1:8000?lon=${lon}&lat=${lat}`
      )
      .then((i) => i.data)
      .then((i) => {
        console.log(i);
        addPoints(
          'parkingLot',
          i.parkingLot.map((i) => ({
            type: 'Feature',
            properties: {
              color: '#ff0000'
            },
            geometry: {
              type: 'Point',
              coordinates: [i.lon, i.lat]
            }
          })),
          1,
          3
        );
        addPolygon(
          'parkingGrid',
          i.parkingGrid.map((i) => ({
            type: 'Feature',
            properties: {
              color: i.available ? '#81b29a' : '#e07a5f'
            },
            geometry: {
              type: 'Polygon',
              coordinates: [i.wkt]
            }
          })),
          1
        );
      });

    this.map = map;

    function addSourceAndLayer(id, features, layerConfig) {
      const srcId = id + '_src';
      if (map.getLayer(id)) map.removeLayer(id);
      if (map.getSource(srcId)) map.removeSource(srcId);
      map.addSource(srcId, {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: features }
      });
      layerConfig.id = id;
      layerConfig.source = srcId;
      map.addLayer(layerConfig);
    }

    function addPoints(id, features, opacity, radius) {
      addSourceAndLayer(id, features, {
        type: 'circle',
        layout: {},
        paint: {
          'circle-opacity': opacity,
          'circle-color': ['get', 'color'],
          'circle-radius': radius
        }
      });
    }

    function addPolygon(id, features, opacity) {
      addSourceAndLayer(id, features, {
        type: 'fill',
        layout: {},
        paint: {
          'fill-opacity': opacity,
          'fill-color': ['get', 'color']
        }
      });
    }
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
