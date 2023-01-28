<script setup>
import { useMeta } from 'vue-meta';
import { WebsiteName } from '@/api/constants.js';
/* app config */
useMeta({
  title: 'CAMPAIGN',
});
</script>

<template>
  <metainfo>
    <template v-slot:title="{ content }">{{
      content ? `${content} | ${WebsiteName}` : WebsiteName
    }}</template>
  </metainfo>
  <div class="q-pa-sm row items-start q-gutter-md">
    <q-breadcrumbs>
        <q-breadcrumbs-el :label="$t('nav.home')" icon="home" />
        <q-breadcrumbs-el :label="$t('nav.campaign')" />
    </q-breadcrumbs>
  </div>
  <div class="q-pa-md row items-start q-gutter-md">
    <q-toolbar>
      <q-toolbar-title>
        {{ $t('nav.campaign') }}
      </q-toolbar-title>
    </q-toolbar>
    
  </div>
</template>

<style scoped lang="scss">

</style>
