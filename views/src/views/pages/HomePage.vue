<script setup>
import { useMeta } from 'vue-meta';
import { WebsiteName } from '@/api/constants.js';
/* app config */
useMeta({
  title: 'TOP',
});
</script>

<template>
  <metainfo>
    <template v-slot:title="{ content }">{{
      content ? `${content} | ${WebsiteName}` : WebsiteName
    }}</template>
  </metainfo>
  <div class="full-width">
    <div class="q-pa-sm row items-start q-gutter-md">
      <q-breadcrumbs>
          <q-breadcrumbs-el label="Home" icon="mdi-home-variant-outline" />
      </q-breadcrumbs>
    </div>
    <div class="full-width row wrap justify-start items-start content-start">
      <div class="q-px-md row">
        <q-toolbar>
          <q-toolbar-title class="page-ttl">
            {{ $t('nav.home') }}
          </q-toolbar-title>
        </q-toolbar>
      </div>
      <div class="full-width row q-px-md q-mt-md">
        <div  class="col-4">
          <q-card class="my-card">
            <q-card-section class="bg-primary text-white">
              <div class="text-h6">Our Changing Planet</div>
              <div class="text-subtitle2">by John Doe</div>
            </q-card-section>

            <q-separator />

            <q-card-actions align="right">
              <q-btn flat>view</q-btn>
            </q-card-actions>
          </q-card> 
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>
