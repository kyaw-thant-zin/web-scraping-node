<script setup>
  import { useMeta } from 'vue-meta'
  import { useQuasar } from 'quasar'
  import { ref, computed, watchEffect } from 'vue'
  import { WebsiteName } from '@/api/constants.js'

  /* app config */
  useMeta({
    title: 'LINK SETTING',
  })

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
    page: 2,
    rowsPerPage: 12
  })
  const pagesNumber = computed(() => Math.ceil(rows.value.length / pagination.value.rowsPerPage))

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
                <template v-slot:body-cell-link="props">
                  <q-td @dblclick="$event => editCell($event, props.row)">
                    <div v-if="props.row.showText" class="ellipsis" style="width: 170px;">{{ props.row.link }}</div>
                    <div v-else class="input-wr">
                      <q-input 
                        type="url"
                        outlined 
                        autofocus
                        class="input-sm"
                        v-model="props.row.link" 
                        @keyup.enter="$event =>updateLink($event , props.row)"
                        @blur="$event =>updateLink($event , props.row)"
                        lazy-rules
                        :rules="[
                          val => !!val.replace(/\s/g, '') || 'Field is required', 
                          (val, rules) => validateURL(val),
                        ]"
                       />
                    </div>
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
