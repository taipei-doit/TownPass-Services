<script setup lang="ts">
import { RouterView } from 'vue-router';
</script>

<template>
  <RouterView v-slot="{ Component }">
    <KeepAlive include="CitizenReportView">
      <component :is="Component" />
    </KeepAlive>
  </RouterView>
</template>
