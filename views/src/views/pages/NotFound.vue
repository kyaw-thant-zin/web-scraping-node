<script setup>

  import { useMeta } from 'vue-meta'
  import { ref, computed, onMounted } from 'vue'
  import { WebsiteName } from '@/api/constants.js'


  /* app config */
  useMeta({
    title: 'USER',
  })

  const pagesNumber = computed(() => {
    
  })

  onMounted(() => {
    // init function
    console.log('mounted')
  })

</script>

<template>
  <metainfo>
    <template v-slot:title="{ content }">{{
      content ? `${content} | ${WebsiteName}` : WebsiteName
    }}</template>
  </metainfo>
  <div class="q-pa-sm row items-start q-gutter-md">
    <q-breadcrumbs>
        <q-breadcrumbs-el :label="$t('nav.dashboard')" icon="mdi-home-variant-outline" to="/" />
        <q-breadcrumbs-el :label="$t('nav.user')" />
    </q-breadcrumbs>
  </div>
  <div class="full-width row wrap justify-start items-start content-start">
    <div class="q-px-md row">
      <q-toolbar>
        <q-toolbar-title class="page-ttl">
          404
        </q-toolbar-title>
      </q-toolbar>
    </div>
    <div class="full-width row q-px-md q-mt-md">
      <div class="col-12">
        <q-card class="common-card">
          <q-card-section class="row justify-between items-center q-py-md  q-px-lg">
            <div class="common-card-ttl">Account Information</div>
            <q-btn class="btn-common shadow-3" outline :label="`Save Changes`" to="/campaigns/create" no-caps />
          </q-card-section>
          <q-card-section class="q-px-none">
            
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>

<style lang="scss">

  

</style>
