<script setup>
import { ref } from 'vue'

  const model = ref(null)
  const options = [
    'EN', 'JP'
  ]

  const menuList = [
    {
      icon: 'mdi-home-variant-outline',
      label: 'ホーム',
      styleColor: '#7764E4'
    },
    {
      icon: 'mdi-email-outline',
      label: 'キャンペーン',
      styleColor: '#F53C56'
    },
    {
      icon: 'mdi-package-variant-closed',
      label: '表示設定',
      styleColor: '#11CDEF'
    },
    {
      icon: 'mdi-file-document-outline',
      label: 'レポート',
      styleColor: '#FB6340'
    },
    {
      icon: 'mdi-message-outline',
      label: 'リンク設定',
      styleColor: '#FEB969'
    },
    {
      icon: 'mdi-cog-outline',
      label: '埋め込みコード',
      styleColor: '#FB6340'
    },
    {
      icon: 'mdi-application-cog-outline',
      label: '全般設定',
      styleColor: '#7764E4'
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
        <q-select standout="bg-primary text-white" v-model="model" :options="options">
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
              <router-link to="/">
                <q-item clickable :active="menuItem.label === 'Outbox'" v-ripple>
                    <q-item-section avatar>
                      <q-icon :name="menuItem.icon" :style="{ color: menuItem.styleColor }" />
                    </q-item-section>
                    <q-item-section>
                      {{ menuItem.label }}
                    </q-item-section>
                </q-item>
            </router-link>
            </template>

          </q-list>
        </q-scroll-area>
    </q-drawer>

</template>
  