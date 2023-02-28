import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/views/pages/HomePage.vue'

import { useAuthStore } from '@/stores/auth.js'

// AUTH
import signIn from '@/views/pages/Auth/signIn.vue'
import signUp from '@/views/pages/Auth/signUp.vue'
import forgotPassword from '@/views/pages/Auth/forgotPassword.vue'

// DASHBOARD
import Dashboard from '@/views/pages/Dashboard/index.vue'

// CAMPAIGN
import CampaignIndex from '@/views/pages/Campaign/index.vue'
import CampaignCreate from '@/views/pages/Campaign/create.vue'
import CampaignEdit from '@/views/pages/Campaign/edit.vue'

// CAMPAIGN OUTPUT
import CampaignOutputIndex from '@/views/pages/CampaignOutput/index.vue'

// REPORT
import Report from '@/views/pages/Report/index.vue'

// LINK SETTING
import LinkSetting from '@/views/pages/LinkSetting/index.vue'

// INPUT CODE
import InputCode from '@/views/pages/InputCode/index.vue'

// USER
import UserIndex from '@/views/pages/User/index.vue'

// 404 NOT FOUND
import notFound from '@/views/pages/NotFound.vue'

const isLoggedIn = async () => {
  // CHECK AUTH AND REDIRECT
  const authStore = useAuthStore()
  if(authStore._uuid != null) {
    return authStore.handleCheckAuth(authStore.uuid)
  } else {
    return false
  }
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
        const authStore = useAuthStore()
        await authStore.handleSignOut()
        next('/sign-in')
      }
    },
    {
      path: '/forgot-password',
      name: 'forgotPassword',
      component: forgotPassword,
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard,
      meta: { requiresAuth: true },
    },
    {
      path: '/campaigns',
      name: 'campaigns',
      meta: { requiresAuth: true },
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
        },
        {
          path: ':id/edit',
          name: 'campaign.edit',
          component: CampaignEdit,
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
      path: '/report',
      name: 'report',
      component: Report,
      meta: { requiresAuth: true },
    },
    {
      path: '/link-setting',
      name: 'linkSetting',
      component: LinkSetting,
      meta: { requiresAuth: true },
    },
    {
      path: '/input-code',
      name: 'inputCode',
      component: InputCode,
      meta: { requiresAuth: true },
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
    console.log('next auth')
    next({ path: '/sign-in' })
    return
  }
  next()
  return
})

export default router;