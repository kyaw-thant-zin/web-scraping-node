<script setup>

  import { useMeta } from 'vue-meta'
  import { ref, computed, onMounted } from 'vue'
  import { WebsiteName } from '@/api/constants.js'


  /* app config */
  useMeta({
    title: 'CAMPAIGN OUTPUT',
  })

  const campaign = ref('All Campaign')
  const campaigns = [
    {
      label: 'All Campaign',
      value: '1'
    },
    {
      label: 'Account',
      value: '2'
    },
  ]

  function filterByCampaign(val) {

  }

  function togglePublicPrivate(props, val) {

    console.log(props)
    console.log(val)
  }

  const columns = [

    { name: 'publicPrivate', label: 'Public Private', field: 'publicPrivate', align: 'center', sortable: true },
    {
      name: 'campaignName',
      required: true,
      label: 'Campaign Name',
      align: 'center',
      field: row => row.campaignName,
      format: val => `${val}`,
      sortable: true,
    },
    { name: 'tiktok', label: 'TikTok', field: 'tiktok', align: 'center', sortable: true },
    { name: 'postDate', label: 'Post Date', field: 'postDate', align: 'center', sortable: true },
    { name: 'account', label: 'Account', field: 'account', align: 'center', sortable: true },
    { name: 'hashtag', label: 'Hashtag', field: 'hashtag', align: 'center', sortable: true },
    { name: 'views', label: 'View', field: 'views', align: 'center', sortable: true },
    { name: 'link', label: 'Link', field: 'link', align: 'center', sortable: true },
    { name: 'priority', label: 'Priority', field: 'priority', align: 'center', sortable: true },
    { name: 'url', label: '', field: 'url', align: 'center', sortable: true },
  ]

  const rows = [
    {
      publicPrivate: true,
      campaignName: '超しまむら学園1',
      tiktok: '',
      postDate: '28/09/2022',
      account: '@Hashtag',
      hashtag: '#超しまむら学園',
      views: '1.2M',
      link: 'TikTok',
      priority: false,
      url: true
    },
    {
      publicPrivate: true,
      campaignName: '超しまむら学園2',
      tiktok: '',
      postDate: '28/09/2022',
      account: '@Hashtag',
      hashtag: '#超しまむら学園',
      views: '1.2M',
      link: 'TikTok',
      priority: false,
      url: true
    },
    {
      publicPrivate: true,
      campaignName: '超しまむら学園3',
      tiktok: '',
      postDate: '28/09/2022',
      account: '@Hashtag',
      hashtag: '#超しまむら学園',
      views: '1.2M',
      link: 'TikTok',
      priority: false,
      url: true
    },
    {
      publicPrivate: true,
      campaignName: '超しまむら学園4',
      tiktok: '',
      postDate: '28/09/2022',
      account: '@Hashtag',
      hashtag: '#超しまむら学園',
      views: '1.2M',
      link: 'TikTok',
      priority: false,
      url: true
    },
    {
      publicPrivate: true,
      campaignName: '超しまむら学園5',
      tiktok: '',
      postDate: '28/09/2022',
      account: '@Hashtag',
      hashtag: '#超しまむら学園',
      views: '1.2M',
      link: 'TikTok',
      priority: false,
      url: true
    },
    {
      publicPrivate: true,
      campaignName: '超しまむら学園6',
      tiktok: '',
      postDate: '28/09/2022',
      account: '@Hashtag',
      hashtag: '#超しまむら学園',
      views: '1.2M',
      link: 'TikTok',
      priority: false,
      url: true
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
  <div class="full-width">
    <div class="q-pa-sm row items-start q-gutter-md">
      <q-breadcrumbs>
          <q-breadcrumbs-el :label="$t('nav.dashboard')" icon="mdi-home-variant-outline" to="/" />
          <q-breadcrumbs-el :label="$t('nav.campaignOutput')" />
      </q-breadcrumbs>
    </div>
    <div class="full-width row wrap justify-start items-start content-start">
      <div class="q-px-md row">
        <q-toolbar>
          <q-toolbar-title class="page-ttl">
            {{ $t('nav.campaignOutput') }}
          </q-toolbar-title>
        </q-toolbar>
      </div>
      <div class="full-width row q-px-md q-mt-md">
        <div class="col-12">
          <q-card class="common-card">
            <q-card-section class="row justify-between items-center q-py-md  q-px-lg">
              <div class="common-card-ttl">Campaign Output</div>
              <div class="col-4">
                <q-select @update:model-value="val => filterByCampaign(val)"  name="campaign" borderless v-model="campaign" :options="campaigns" class="common-select p-sm" />
              </div>
            </q-card-section>
            <q-card-section class="q-px-none">
              <q-table
                class="index-table no-shadow"
                separator="none"
                :rows="rows"
                :columns="columns"
                color="primary"
                row-key="campaignName"
                v-model:pagination="pagination"
                hide-pagination
              >
                <template v-slot:body-cell-publicPrivate="props">
                  <q-td :props="props">
                    <q-toggle 
                      v-model="props.row.publicPrivate" 
                      checked-icon="mdi-lock"
                      color="negative"
                      unchecked-icon="mdi-earth"  
                      @update:model-value="val => togglePublicPrivate(props, val)"
                    />
                  </q-td>
                </template>
                <template v-slot:body-cell-priority="props">
                  <q-td>
                    <q-checkbox v-model="props.row.priority" class="common-checkbox" />
                  </q-td>
                </template>
                <template v-slot:body-cell-url="props">
                  <q-td>
                    <q-btn to="/" class="common-anchor" round flat icon="mdi-open-in-new"></q-btn>
                  </q-td>
                </template>
              </q-table>
              <div class="row justify-end q-mt-md">
                <q-pagination
                  v-model="pagination.page"
                  color="primary"
                  :max="pagesNumber"
                  size="md"
                  direction-links
                />
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">

  

</style>
