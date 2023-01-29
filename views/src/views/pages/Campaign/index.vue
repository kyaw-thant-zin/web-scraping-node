<script setup>

  import { useMeta } from 'vue-meta'
  import { ref, computed, onMounted } from 'vue'
  import { WebsiteName } from '@/api/constants.js'


  /* app config */
  useMeta({
    title: 'CAMPAIGN',
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
    },
    {
      campaignName: '超しまむら学園2',
      createdAt: '28/09/2022',
      collectionType: 'Hashtag',
      account: '-',
      tags: '#超しまむら学園',
      linkType: 'TikTok',
      publicPrivate: true,
    },
    {
      campaignName: '超しまむら学園3',
      createdAt: '28/09/2022',
      collectionType: 'Hashtag',
      account: '-',
      tags: '#超しまむら学園',
      linkType: 'TikTok',
      publicPrivate: true,
    },
    {
      campaignName: '超しまむら学園4',
      createdAt: '28/09/2022',
      collectionType: 'Hashtag',
      account: '-',
      tags: '#超しまむら学園',
      linkType: 'TikTok',
      publicPrivate: true,
    },
    {
      campaignName: '超しまむら学園5',
      createdAt: '28/09/2022',
      collectionType: 'Hashtag',
      account: '-',
      tags: '#超しまむら学園',
      linkType: 'TikTok',
      publicPrivate: true,
    },
    {
      campaignName: '超しまむら学園6',
      createdAt: '28/09/2022',
      collectionType: 'Hashtag',
      account: '-',
      tags: '#超しまむら学園',
      linkType: 'TikTok',
      publicPrivate: true,
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
        <q-table
          class="index-table"
          separator="none"
          :title="$t('table.title.campaign')"
          :rows="rows"
          :columns="columns"
          color="primary"
          row-key="campaignName"
          v-model:pagination="pagination"
          hide-pagination
        >
          <template v-slot:top-right>
            <q-btn class="btn-common" outline :label="$t('table.btn.createNew')" to="/campaigns/create" no-caps />
          </template>
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
          <!-- <template v-slot:body-cell-publicPrivate="props">
            <q-td key="calories" :props="props">
              {{ props.row.calories }}
              <q-popup-edit 
                v-model="props.row.calories" 
                v-slot="scope"
              >
                <q-input 
                  v-model="scope.value" 
                  :model-value="scope.value" 
                  dense 
                  autofocus 
                  @keyup.enter="scope.set"
                >
                <template v-slot:after>
                  <div>
                    <q-btn
                    flat dense color="negative" icon="cancel"
                    @click.stop.prevent="scope.cancel"
                  />

                  <q-btn
                    flat dense color="positive" icon="check_circle"
                    @click.stop.prevent="scope.set"
                    :disable="scope.validate(scope.value) === false || scope.initialValue === scope.value"
                  />
                  </div>
                </template>
                </q-input>
              </q-popup-edit>
            </q-td>
          </template> -->
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
      </div>
    </div>
  </div>
</template>

<style lang="scss">

  

</style>
