import { createRouter, createWebHistory } from 'vue-router';
import ChatView from '@/views/ChatView.vue'; // Import the ChatView component
import SettingsView from '@/views/SettingsView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      children: [
        { 
          path: '',
          name: 'chat',
          component: ChatView
        },
        {
          path: 'settings/',
          name: 'settings',
          component: SettingsView
        }
      ]
    }
  //   {
  //     path: '',
  //     name: 'chat',
  //     component: ChatView
  //   }
  ]
});

export default router;
