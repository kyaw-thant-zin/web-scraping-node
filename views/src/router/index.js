import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/views/pages/HomePage.vue'
import CampaignIndex from '@/views/pages/Campaign/index.vue'
import CampaignCreate from '@/views/pages/Campaign/create.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
        path: '/',
        name: 'home',
        component: HomePage,
    },
    {
      path: '/campaigns',
      name: 'campaigns',
      children: [
        {
          path: '',
          name: 'campaign.index',
          component: CampaignIndex,
        },
        {
          path: 'create',
          name: 'campaign.create',
          component: CampaignCreate,
        }
      ]
    },
  ],
});

export default router;