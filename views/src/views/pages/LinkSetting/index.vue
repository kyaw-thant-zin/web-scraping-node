<script setup>
  import { useMeta } from 'vue-meta'
  import { useQuasar } from 'quasar'
  import { ref, computed, watchEffect } from 'vue'
  import { WebsiteName } from '@/api/constants.js'
  import { useLinkSettingStore } from '@/stores/linkSetting.js'
  import { onBeforeRouteLeave } from 'vue-router'

  /* app config */
  useMeta({
    title: 'LINK SETTING',
  })

  const $q = useQuasar()
  const linkSettingStore = useLinkSettingStore()
  linkSettingStore.handleLinkSettings()

  const importCSV = ref(null)

  const visibileColumns = ['hashtag', 'imgURL', 'title', 'pageURL']
  const columns = [
    { name: 'id', required: false, label: 'ID', sortable: true, field: row => row.id, format: val => `${val}`, },
    { name: 'hashtag', label: 'Hashtag', field: 'hashtag', align: 'center', sortable: true },
    { name: 'imgURL', label: 'Img URL', field: 'imgURL', align: 'center', sortable: true },
    { name: 'title', label: 'Title', field: 'title', align: 'center', sortable: true },
    { name: 'pageURL', label: 'Page URL', field: 'pageURL', align: 'center', sortable: true },
  ]
  const rows = ref([])
  const pagination = ref({
    sortBy: 'desc',
    descending: false,
    page: linkSettingStore._linkSettingTablePage,
    rowsPerPage: 12
  })
  const pagesNumber = computed(() => Math.ceil(rows.value.length / pagination.value.rowsPerPage))
  function onChangePagination(page) {
    linkSettingStore.storeLinkSettingTablePage(page)
  }
  onBeforeRouteLeave((to, from, next) => {
    linkSettingStore.storeLinkSettingTablePage(1)
    next()
  })

  const onChangeImportCSV = () => {
    linkSettingStore.handleInportCSV(importCSV.value)
  }

  const csvExport = async (e) => {
    await linkSettingStore.handleExportCSV(columns, rows.value)
  }

  const onRejected = (rejectedEntries) => {
    $q.notify({
      type: 'negative',
      message: `File format did not support, Please select the CSV only!`
    })
  } 
  watchEffect( () => {
    
    if(linkSettingStore._linkSettings != null) {
      rows.value = linkSettingStore._linkSettings
    } 

  }, [linkSettingStore._linkSettings])

  watchEffect( () => {
    
    if(linkSettingStore._loading) {
        $q.loading.show()
    } else {
        $q.loading.hide()
    }

  }, [linkSettingStore._loading])

  watchEffect( () => {
    if(linkSettingStore._importedCSV) {
      $q.notify({
        caption: 'CSV data successfully imported!',
        message: 'SUCCESS',
        type: 'positive',
        timeout: 1000
      })
    } 

  }, [linkSettingStore._importedCSV])

</script>

<template>
  <metainfo>
    <template v-slot:title="{ content }">{{
      content ? `${content} | ${WebsiteName}` : WebsiteName
    }}</template>
  </metainfo>
  <div class="full-width column">
    <div class="q-pa-sm row items-start q-gutter-md">
      <q-breadcrumbs>
          <q-breadcrumbs-el :label="$t('nav.dashboard')" icon="mdi-home-variant-outline" to="/" />
          <q-breadcrumbs-el :label="$t('nav.linkSetting')" />
      </q-breadcrumbs>
    </div>
    <div class="full-width row wrap justify-start items-start content-start">
      <div class="q-px-md row">
        <q-toolbar>
          <q-toolbar-title class="page-ttl">
            {{ $t('nav.linkSetting') }}
          </q-toolbar-title>
        </q-toolbar>
      </div>
      <div class="full-width row q-px-md q-mt-md">
        <div class="col-12">
          <q-card class="common-card">
            <q-card-section class="row justify-between items-center q-py-md  q-px-lg">
              <div class="common-card-ttl">{{ $t('table.title.linkSetting') }}</div>
              <div>
                <q-btn class="btn-common shadow-3" outline label="CSV Export" no-caps @click="e => csvExport(e)"></q-btn>
                <q-btn class="btn-common shadow-3 q-ml-md import-csv-btn" outline label="CSV Import" no-caps :loading="false">
                  <template v-slot:loading>
                    <q-spinner-facebook />
                  </template>
                  <q-file 
                    class="hide-q-file"  
                    name="importCSV" 
                    v-model="importCSV" 
                    accept=".csv"
                    @update:model-value="onChangeImportCSV"
                    @rejected="onRejected"
                  />
                </q-btn>
              </div>
            </q-card-section> 
            <q-card-section class="q-px-none">
              <q-table
                class="index-table no-shadow"
                separator="none"
                :rows="rows"
                :columns="columns"
                color="primary"
                row-key="id"
                v-model:pagination="pagination"
                hide-pagination
                :visible-columns="visibileColumns"
              >
                    
                <template v-slot:body-cell-imgURL="props">
                  <q-td>
                    <div class="full-width row no-wrap items-center">
                      <div class="col-auto">
                        <q-img
                          v-if="props.row.imgURL !== null"
                          :src="props.row.imgURL"
                          class="q-my-md ls-tb-img"
                          style="width: 100px"
                          loading="lazy"
                          spinner-color="black"
                        >
                          <template v-slot:error>
                            <div class="absolute-full flex flex-center bg-negative text-white">
                              Cannot load image
                            </div>
                          </template>
                        </q-img>
                      </div>
                      <div class="col-auto">
                        <a :href="props.row.imgURL" target="_blank" class="ls-img-anchor" rel="noopener noreferrer">
                          <div class="ellipsis q-ml-md" style="width: 170px;">{{ props.row.imgURL }}</div>
                        </a>
                      </div>
                    </div>
                  </q-td>
                </template>
                <template v-slot:body-cell-pageURL="props">
                  <q-td>
                    <a :href="props.row.pageURL" target="_blank" class="ls-img-anchor" rel="noopener noreferrer">
                      <div class="ellipsis q-ml-md" style="width: 200px;">{{ props.row.pageURL }}</div>
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
