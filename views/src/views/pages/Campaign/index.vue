<script setup>

  import { useMeta } from 'vue-meta'
  import { useQuasar } from 'quasar'
  import { ref, computed, watchEffect } from 'vue'
  import { WebsiteName } from '@/api/constants.js'
  import { useCampaignStore } from '@/stores/campaign.js'
  import { onBeforeRouteLeave } from 'vue-router'

  /* app config */
  useMeta({
    title: 'CAMPAIGN',
  })

  const $q = useQuasar()
  const campaignStore = useCampaignStore()
  campaignStore.handleCampaigns()

  const columns = [
    { name: 'id', required: false, label: 'ID', sortable: false },
    {
      name: 'campaignName',
      required: true,
      label: 'Campaign Name',
      field: row => row.campaignName,
      format: val => `${val}`,
      align: 'center',
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

  const visibileColumns = ['campaignName', 'createdAt', 'collectionType', 'account', 'tags', 'linkType', 'publicPrivate', 'action']

  const rows = ref([])

  const pagination = ref({
    sortBy: 'desc',
    descending: false,
    page: campaignStore._campaignTablePage,
    rowsPerPage: 10
  })
  const pagesNumber = computed(() => Math.ceil(rows.value.length / pagination.value.rowsPerPage))

  async function togglePublicPrivate(props, val) {
    await campaignStore.handleCampaignVisibilityUpdate(props.row.id, val)
  }

  function onChangePagination(page) {
    campaignStore.storeCampaignTablePage(page)
  }

  function showConfirmDialog(row) {
    $q.dialog({
      title: `Are you sure you want to delete <br>"${row.campaignName}"?`,
      message: 'This campaign will be deleted immediately and also Campaign Outputs, Link Settings and InputCode. You can\'t undo this action.',
      cancel: true,
      persistent: true,
      html: true,
      ok: {
        push: true,
        color: 'negative'
      },
    }).onOk(() => {
        campaignStore.handleCampaignDestroy(row.id)
    })
  }

  onBeforeRouteLeave((to, from, next) => {
    campaignStore.storeCampaignTablePage(1)
    next()
  })

  watchEffect(() => {

    if(campaignStore._campaigns !== null) {
      rows.value = campaignStore._campaigns
    }

    if(campaignStore._updateVisibility === true) {
      $q.notify({
        caption: 'The campaign is successful updated Public Private',
        message: 'SUCCESS',
        type: 'positive',
        timeout: 1000
      })
    }

  }, [campaignStore._campaigns, campaignStore._updateVisibility])

  watchEffect(() => {

    if(campaignStore._destroyed === true) {
      campaignStore.handleCampaigns()
      $q.notify({
        caption: 'The campaign is successful deleted!',
        message: 'SUCCESS',
        type: 'positive',
        timeout: 1000
      })
    }

  }, [campaignStore._destroyed])

  watchEffect( () => {
    
    if(campaignStore._loading) {
        $q.loading.show()
    } else {
        $q.loading.hide()
    }

  }, [campaignStore._loading])


</script>

<template>
  <metainfo>
    <template v-slot:title="{ content }">{{
      content ? `${content} | ${WebsiteName}` : WebsiteName
    }}</template>
  </metainfo>
  <div class="full-width  q-mb-xl">
    <div class="q-pa-sm row items-start q-gutter-md">
      <q-breadcrumbs>
          <q-breadcrumbs-el :label="$t('nav.dashboard')" icon="mdi-home-variant-outline" to="/" />
          <q-breadcrumbs-el :label="$t('nav.campaign')" />
      </q-breadcrumbs>
    </div>
    <div class="full-width row wrap justify-start items-start content-start">
      <div class="q-px-md row">
        <q-toolbar>
          <q-toolbar-title class="page-ttl">
            {{ $t('nav.campaign') }}
          </q-toolbar-title>
        </q-toolbar>
      </div>
      <div class="full-width row q-px-md q-mt-md">
        <div class="col-12">
          <q-card class="common-card">
            <q-card-section class="row justify-between items-center q-py-md  q-px-lg">
              <div class="common-card-ttl">{{ $t('table.title.campaign') }}</div>
              <q-btn class="btn-common shadow-3" outline :label="$t('table.btn.createNew')" to="/campaigns/create" no-caps />
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
                <template v-slot:body-cell-action="props">
                  <q-td>
                    <q-btn color="grey-7" round flat icon="more_vert">
                      <q-menu auto-close :offset="[-7, 5]">
                        <q-list>
                          <q-item clickable :to="{ name: 'campaign.edit', params: { id: props.row.id } }">
                            <q-item-section>Edit</q-item-section>
                          </q-item>
                          <q-item clickable @click="showConfirmDialog(props.row)">
                            <q-item-section>Delete</q-item-section>
                          </q-item>
                        </q-list>
                      </q-menu>
                    </q-btn>
                  </q-td>
                </template>
              </q-table>
              <div class="row justify-end q-mt-md q-pr-lg">
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
