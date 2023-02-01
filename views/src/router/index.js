import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/views/pages/HomePage.vue'

// AUTH
import signIn from '@/views/pages/Auth/signIn.vue'
import signUp from '@/views/pages/Auth/signUp.vue'

// CAMPAIGN
import CampaignIndex from '@/views/pages/Campaign/index.vue'
import CampaignCreate from '@/views/pages/Campaign/create.vue'

// CAMPAIGN OUTPUT
import CampaignOutputIndex from '@/views/pages/CampaignOutput/index.vue'

// USER
import UserIndex from '@/views/pages/User/index.vue'

// 404 NOT FOUND
import notFound from '@/views/pages/NotFound.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
        path: '/',
        name: 'home',
        component: HomePage,
    },
    {
      path: '/sign-in',
      name: 'signIn',
      component: signIn,
    },
    {
      path: '/sign-up',
      name: 'signUp',
      component: signUp,
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
    {
      path: '/:catchAll(.*)',
      name: 'notFound',
      component: notFound,
    },
  ],
});

export default router;