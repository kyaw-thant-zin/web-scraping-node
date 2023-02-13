<script setup>

  import { useMeta } from 'vue-meta'
  import { useQuasar } from 'quasar'
  import { ref, computed, watchEffect } from 'vue'
  import { onBeforeRouteLeave } from 'vue-router'
  import { WebsiteName } from '@/api/constants.js'
  import { useCampaignOutputStore } from '@/stores/campaignOutput.js'

  // video component
  import Video from '@/views/components/Video.vue'

  const $q = useQuasar()
  const campaignOutputStore = useCampaignOutputStore()
  campaignOutputStore.handleCampaignOutputs()
  campaignOutputStore.handleCampaigns()

  /* app config */
  useMeta({
    title: 'CAMPAIGN OUTPUT',
  })

  const campaigns = ref([])
  function filterByCampaign(obj) {
    campaignOutputStore.storeCampaign(obj)
  }
  watchEffect(() => {

    if(campaignOutputStore._campaigns !== null) {
      campaigns.value = campaignOutputStore._campaigns
    }

  }, [campaignOutputStore._campaigns])

  function togglePublicPrivate(props, val) {
    console.log(props)
    console.log(val)
  }

  const visibileColumns = ['publicPrivate', 'campaignName', 'tiktok', 'postDate', 'account', 'hashtag', 'views', 'link', 'priority', 'url']
  const columns = [
    { name: 'id', required: false, label: 'ID', sortable: false },
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
  const rows = ref([])
  const filteredRows = (rows) => {
    if(campaignOutputStore._campaign.value == 0) {
      return rows
    } else {
      return rows.filter(row => row.id == campaignOutputStore._campaign.value)
    }
  }
  watchEffect(() => {

    if(campaignOutputStore._campaignOutputs !== null) {
      rows.value = filteredRows(campaignOutputStore._campaignOutputs)
    }

  }, [campaignOutputStore._campaignOutputs])

  const pagination = ref({
    sortBy: 'desc',
    descending: false,
    page: campaignOutputStore._campaignOutputTablePage,
    rowsPerPage: 12
  })
  const pagesNumber = computed(() => Math.ceil(rows.value.length / pagination.value.rowsPerPage))
  function onChangePagination(page) {
    campaignOutputStore.storeCampaignOutputTablePage(page)
  }
  onBeforeRouteLeave((to, from, next) => {
    campaignOutputStore.storeCampaignOutputTablePage(1)
    campaignOutputStore.storeCampaign({
      label: 'All Campaigns',
      value: 0
    })
    next()
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
                <q-select @update:model-value="val => filterByCampaign(val)"  name="campaign" borderless v-model="campaignOutputStore._campaign" :options="campaigns" class="common-select p-sm" />
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
                :visible-columns="visibileColumns"
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
                <template v-slot:body-cell-tiktok="props">
                  <q-td class="text-center">
                    <Video v-bind:url="props.row.tiktok"></Video>
                  </q-td>
                </template>
                <template v-slot:body-cell-priority="props">
                  <q-td class="text-center">
                    <q-checkbox v-model="props.row.priority" class="common-checkbox" />
                  </q-td>
                </template>
                <template v-slot:body-cell-url="props">
                  <q-td>
                    <a :href="props.row.url" target="_blank" rel="noopener noreferrer">
                      <q-btn class="common-anchor" round flat icon="mdi-open-in-new"></q-btn>
                    </a>
                  </q-td>
                </template>
              </q-table>
              <div class="row justify-end q-mt-md">
                <q-pagination
                  @update:model-value="onChangePagination"
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
