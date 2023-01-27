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
  <h3>TOP page</h3>
</template>

<style scoped lang="scss">

</style>
