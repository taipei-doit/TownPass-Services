<script setup lang="ts">
import { ref, onMounted } from 'vue';
import LibraryTabsView from '@/components/organisms/LibraryTabsView.vue';
import LibrarySearchView from '@/components/organisms/LibrarySearchView.vue';
import LibraryMyRecordsView from '@/components/organisms/LibraryMyRecordsView.vue';
import LibraryMapView from '@/components/organisms/LibraryMapView.vue';

import { useRoute } from 'vue-router';

const route = useRoute();

const activeTab = ref(0);

onMounted(() => {
  if (route.query.type && Number(route.query.type) <= 2) {
    activeTab.value = Number(route.query.type as String);
  } else {
    activeTab.value = 0;
  }
});
</script>

<template>
  <LibraryTabsView v-model="activeTab">
    <template #tab0>
      <LibrarySearchView />
    </template>
    <template #tab1>
      <LibraryMyRecordsView />
    </template>
    <template #tab2>
      <LibraryMapView />
    </template>
  </LibraryTabsView>
</template>

<style lang="postcss"></style>
