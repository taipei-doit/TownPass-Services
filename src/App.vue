<script setup lang="ts">
import { RouterView } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { storeToRefs } from 'pinia';

const store = useUserStore();

const { user } = storeToRefs(store);

/**
 * use flutter_inappwebview's Web Message Listeners to get user info from app
 * @see https://inappwebview.dev/docs/webview/javascript/communication#web-message-listeners
 */

if (typeof userInfo !== 'undefined' && userInfo) {
  userInfo.postMessage('created');
  userInfo.onmessage = (event: any) => {
    if (event && event.data) {
      const info = JSON.parse(event.data);
      user.value = info;
    }
  };
}
</script>

<template>
  <RouterView />
</template>
