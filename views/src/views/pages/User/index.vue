<script setup>

  import { useMeta } from 'vue-meta'
  import { ref, computed, onMounted } from 'vue'
  import { WebsiteName } from '@/api/constants.js'


  /* app config */
  useMeta({
    title: 'USER',
  })

  function togglePublicPrivate(props, val) {

    console.log(props)
    console.log(val)
  }

  const columns = [
    {
      name: 'campaignName',
      required: true,
      label: 'Campaign Name',
      align: 'center',
      field: row => row.campaignName,
      format: val => `${val}`,
      sortable: true,
    },
    { name: 'createdAt', label: 'Created', field: 'createdAt', align: 'center', sortable: true },
    { name: 'collectionType', label: 'Collection Type', field: 'collectionType', align: 'center', sortable: true },
    { name: 'account', label: 'Account', field: 'account', align: 'center', sortable: true },
    { name: 'tags', label: 'Tags', field: 'tags', align: 'center', sortable: true },
    { name: 'linkType', label: 'Link Type', field: 'linkType', align: 'center', sortable: true },
    { name: 'publicPrivate', label: 'Public Private', field: 'publicPrivate', align: 'center', sortable: true },
    { name: 'action', label: '', field: 'action', align: 'center', sortable: true },
  ]

  const rows = [
    {
      campaignName: '超しまむら学園1',
      createdAt: '28/09/2022',
      collectionType: 'Hashtag',
      account: '-',
      tags: '#超しまむら学園',
      linkType: 'TikTok',
      publicPrivate: true,
      action: true
    },
    {
      campaignName: '超しまむら学園2',
      createdAt: '28/09/2022',
      collectionType: 'Hashtag',
      account: '-',
      tags: '#超しまむら学園',
      linkType: 'TikTok',
      publicPrivate: true,
      action: true
    },
    {
      campaignName: '超しまむら学園3',
      createdAt: '28/09/2022',
      collectionType: 'Hashtag',
      account: '-',
      tags: '#超しまむら学園',
      linkType: 'TikTok',
      publicPrivate: true,
      action: true
    },
    {
      campaignName: '超しまむら学園4',
      createdAt: '28/09/2022',
      collectionType: 'Hashtag',
      account: '-',
      tags: '#超しまむら学園',
      linkType: 'TikTok',
      publicPrivate: true,
      action: true
    },
    {
      campaignName: '超しまむら学園5',
      createdAt: '28/09/2022',
      collectionType: 'Hashtag',
      account: '-',
      tags: '#超しまむら学園',
      linkType: 'TikTok',
      publicPrivate: true,
      action: true
    },
    {
      campaignName: '超しまむら学園6',
      createdAt: '28/09/2022',
      collectionType: 'Hashtag',
      account: '-',
      tags: '#超しまむら学園',
      linkType: 'TikTok',
      publicPrivate: true,
      action: true
    },
  ]

  const pagination = ref({
    sortBy: 'desc',
    descending: false,
    page: 1,
    rowsPerPage: 2
    // rowsNumber: xx if getting data from a server
  })

  const pagesNumber = computed(() => Math.ceil(rows.length / pagination.value.rowsPerPage))

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
        <q-breadcrumbs-el :label="$t('nav.home')" icon="mdi-home-variant-outline" to="/" />
        <q-breadcrumbs-el :label="$t('nav.user')" />
    </q-breadcrumbs>
  </div>
  <div class="full-width row wrap justify-start items-start content-start">
    <div class="q-px-md row">
      <q-toolbar>
        <q-toolbar-title class="page-ttl">
          {{ $t('nav.user') }}
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
