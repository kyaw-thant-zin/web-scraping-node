import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/views/pages/HomePage.vue'

// API
import { API } from '@/api/index.js'

// AUTH
import signIn from '@/views/pages/Auth/signIn.vue'
import signUp from '@/views/pages/Auth/signUp.vue'
import forgotPassword from '@/views/pages/Auth/forgotPassword.vue'


// CAMPAIGN
import CampaignIndex from '@/views/pages/Campaign/index.vue'
import CampaignCreate from '@/views/pages/Campaign/create.vue'

// CAMPAIGN OUTPUT
import CampaignOutputIndex from '@/views/pages/CampaignOutput/index.vue'

// USER
import UserIndex from '@/views/pages/User/index.vue'

// 404 NOT FOUND
import notFound from '@/views/pages/NotFound.vue'

const isLoggedIn = async () => {
  // CHECK AUTH AND REDIRECT
  const response = await API.checkAuth()
  return response
}

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
      path: '/sign-out',
      name: 'signOut',
      async beforeEnter (to, from, next) {
        // Perform sign out logic here (e.g. clear authentication token)
        const response = await API.user.signOut()
        console.log(response)
        next('/sign-in')
      }
    },
    {
      path: '/forgot-password',
      name: 'forgotPassword',
      component: forgotPassword,
    },
    {
      path: '/campaigns',
      name: 'campaigns',
      meta: { 
        requiresAuth: true 
      },
      children: [
        {
          path: '',
          name: 'campaign.index',
          component: CampaignIndex,
          meta: { requiresAuth: true },
        },
        {
          path: 'create',
          name: 'campaign.create',
          component: CampaignCreate,
          meta: { requiresAuth: true },
        }
      ]
    },
    {
      path: '/campaign-outputs',
      name: 'campaignOutput',
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'campaignOutput.index',
          component: CampaignOutputIndex,
          meta: { requiresAuth: true },
        },
      ]
    },
    {
      path: '/user',
      name: 'user',
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'user.index',
          component: UserIndex,
          meta: { requiresAuth: true },
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

router.beforeEach( async (to, from, next) => {
  if (to.meta.requiresAuth && !await isLoggedIn()) {
    next({ path: '/sign-in' })
  } else {
    next()
  }
})

export default router;