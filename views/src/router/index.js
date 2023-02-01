import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/views/pages/HomePage.vue'

// CAMPAIGN
import CampaignIndex from '@/views/pages/Campaign/index.vue'
import CampaignCreate from '@/views/pages/Campaign/create.vue'

// CAMPAIGN OUTPUT
import CampaignOutputIndex from '@/views/pages/CampaignOutput/index.vue'

// USER
import UserIndex from '@/views/pages/User/index.vue'

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
    {
      path: '/campaign-outputs',
      name: 'campaignOutput',
      children: [
        {
          path: '',
          name: 'campaignOutput.index',
          component: CampaignOutputIndex,
        },
      ]
    },
    {
      path: '/user',
      name: 'user',
      children: [
        {
          path: '',
          name: 'user.index',
          component: UserIndex,
        },
      ]
    },
  ],
});

export default router;