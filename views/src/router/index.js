import i18n from '@/main.js'
import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/views/pages/HomePage.vue'
import CampaignPage from '@/views/pages/CampaignPage.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
        path: '/:locale?',
        name: 'home',
        component: HomePage,
    },
    {
      path: '/:locale?/campaign',
      name: 'campaign',
      component: CampaignPage,
    },
  ],
});

export default router;