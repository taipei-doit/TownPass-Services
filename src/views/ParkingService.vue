<script setup lang="ts">
import Map from '@/components/organisms/Map.vue';
import 'mapbox-gl/dist/mapbox-gl.css';
import NavigatorCard from '@/components/organisms/NavigatorCard.vue';
</script>
<template>
  <div class="h-screen flex flex-col overflow-hidden position-relative">
    <div class="flex flex-1">
      <Map />
    </div>
    <NavigatorCard
      parkName="foo"
      remainingSpace="10"
      price="40 元/小時"
      distance="10"
      display="navigator_park"
      timePassed="10"
      maxTime="200"
      show
    />
  </div>
</template>
