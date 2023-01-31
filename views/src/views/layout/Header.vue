<script setup>
  import { ref, onMounted, watchEffect } from 'vue'
  import { useRoute } from 'vue-router'

  const route = useRoute()
  const activeLink = ref()

  watchEffect( async () => {

    // set active class to sidebar nav when navigate with breadcrumbs or page refresh
    let routeName = route.name
    if(routeName !== undefined) {
      if(routeName.includes('.')) {
        const routeNameIndex = routeName.indexOf(".")
        routeName = routeName.substring(0, routeNameIndex)
      }

      activeLink.value = routeName
    }

  }, [route])

  const options = [
    'EN', 'JP'
  ]

  // save locale into browser localstorage
  const showChannel = (val) => {
    saveToLocalStorage('locale', val)
  }

  function saveToLocalStorage(key, val) {
    localStorage.setItem( key, val)
  }

  // sidebar nav menu list
  const menuList = [
    {
      icon: 'mdi-home-variant-outline',
      label: 'home',
      styleColor: '#7764E4',
      path: '/'
    },
    {
      icon: 'mdi-email-outline',
      label: 'campaign',
      styleColor: '#F53C56',
      path: '/campaigns'
    },
    {
      icon: 'mdi-package-variant-closed',
      label: 'campaignOutput',
      styleColor: '#11CDEF',
      path: '/'
    },
    {
      icon: 'mdi-file-document-outline',
      label: 'report',
      styleColor: '#FB6340',
      path: '/'
    },
    {
      icon: 'mdi-message-outline',
      label: 'linkSetting',
      styleColor: '#FEB969',
      path: '/'
    },
    {
      icon: 'mdi-cog-outline',
      label: 'inputCode',
      styleColor: '#FB6340',
      path: '/'
    },{
      icon: 'mdi-account-edit',
      label: 'user',
      styleColor: '#7764E4',
      path: '/user'
    },
    {
      icon: 'mdi-application-cog-outline',
      label: 'generalSetting',
      styleColor: '#7764E4',
      path: '/'
    },

  ]
  // trigger sidebar open and close
  const leftDrawerOpen = ref(false)
  const drawer = leftDrawerOpen
  const toggleLeftDrawer = () => {
    leftDrawerOpen.value = !leftDrawerOpen.value
  }



  
</script>
<template>
    <q-header bordered class="l-hd text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-space />
        <q-select class="white-select" borderless v-model="$i18n.locale" :options="options" @update:model-value="val => showChannel(val)" >
          <template v-slot:prepend>
            <q-icon name="mdi-translate" color="white" />
          </template>
        </q-select>
        <q-btn size="sm" round outline class="q-ml-md" to="/">
          <q-avatar size="sm" text-color="white">J</q-avatar>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer class="l-sb" show-if-above v-model="drawer" side="left" bordered :width="245">
        <q-scroll-area class="fit">
          <q-list>
            <q-item >
              <q-item-section>
                <router-link class="l-sb-logo" to="/">HASHVANK</router-link>
              </q-item-section>
            </q-item>
            <template v-for="(menuItem, index) in menuList" :key="index">
              <router-link :to="menuItem.path">
                <q-item  class="q-mt-md" clickable :active="activeLink === menuItem.label" @click="activeLink = menuItem.label" active-class="active-sb" v-ripple>
                    <q-item-section avatar>
                      <q-icon :name="menuItem.icon" :style="{ color: menuItem.styleColor }" />
                    </q-item-section>
                    <q-item-section>
                      {{ $t(`nav.${menuItem.label}`) }}
                    </q-item-section>
                </q-item>
            </router-link>
            </template>

          </q-list>
        </q-scroll-area>
    </q-drawer>

</template>

<style lang="scss">


</style>
  