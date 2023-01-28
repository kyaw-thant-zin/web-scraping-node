<script setup>
  import { ref } from 'vue'
  const options = [
    'EN', 'JP'
  ]

  const showChannel = (val) => {
    saveToLocalStorage('locale', val)
  }

  function saveToLocalStorage(key, val) {
    localStorage.setItem( key, val)
  }

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
      path: '/campaign'
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
    },
    {
      icon: 'mdi-application-cog-outline',
      label: 'generalSetting',
      styleColor: '#7764E4',
      path: '/'
    }
  ]
  const leftDrawerOpen = ref(false)
  const drawer = leftDrawerOpen
  const toggleLeftDrawer = () => {
    leftDrawerOpen.value = !leftDrawerOpen.value
  }
</script>
<template>
    <q-header bordered class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-space />
        <q-select standout="bg-primary text-white" v-model="$i18n.locale" :options="options" @update:model-value="val => showChannel(val)" >
          <template v-slot:prepend>
            <q-icon name="mdi-translate"  color="white" />
          </template>
        </q-select>
        <q-btn flat round dense icon="apps" class="q-mr-xs" />
        <q-btn flat round dense icon="more_vert" />
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="drawer" side="left" bordered>
        <q-scroll-area class="fit">
          <q-list>
            <q-item >
              <q-item-section>
                <router-link to="/">HASHVANK</router-link>
              </q-item-section>
            </q-item>
            <q-separator />
            <template v-for="(menuItem, index) in menuList" :key="index">
              <router-link :to="menuItem.path">
                <q-item clickable :active="menuItem.label === 'Outbox'" v-ripple>
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
  