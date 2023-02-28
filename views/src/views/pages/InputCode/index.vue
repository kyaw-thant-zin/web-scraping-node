<script setup>
  import { useMeta } from 'vue-meta'
  import { copyToClipboard, useQuasar } from 'quasar'
  import { ref, computed, watchEffect } from 'vue'
  import { WebsiteName } from '@/api/constants.js'
  import { useInputCodeStore } from '@/stores/inputCode.js'
  import { onBeforeRouteLeave } from 'vue-router'

  /* app config */
  useMeta({
    title: 'INPUTCODE',
  })

  const $q = useQuasar()
  const inputCodeStore = useInputCodeStore()
  inputCodeStore.handleInputCodes()

  const visibileColumns = ['campaignName', 'layoutType', 'layoutContent', 'apiCode']
  const columns = [
    { name: 'id', required: false, label: 'ID', sortable: true, field: row => row.id, format: val => `${val}`, },
    { name: 'campaignName', label: 'Campaign Name', field: 'campaignName', align: 'center', sortable: true },
    { name: 'layoutType', label: 'Layout Type', field: 'layoutType', align: 'center', sortable: true },
    { name: 'layoutContent', label: 'Layout Content', field: 'layoutContent', align: 'center', sortable: true },
    { name: 'apiCode', label: 'Api Code (JS)', field: 'apiCode', align: 'center', sortable: true },
  ]
  const rows = ref([])
  const pagination = ref({
    sortBy: 'desc',
    descending: false,
    page: inputCodeStore._inputCodeTablePage,
    rowsPerPage: 12
  })
  const pagesNumber = computed(() => Math.ceil(rows.value.length / pagination.value.rowsPerPage))
  function onChangePagination(page) {
    inputCodeStore.storeInputCodeTablePage(page)
  }
  onBeforeRouteLeave((to, from, next) => {
    inputCodeStore.storeInputCodeTablePage(1)
    next()
  })

  watchEffect(() => {
    if(inputCodeStore._inputCodes != null) {
      rows.value = inputCodeStore._inputCodes
    }
  }, [inputCodeStore._inputCodes])

  const editCell = (e, row) => {
    if(row.visibility && row.showText) {
      row.showText = false
    }
  }

  const updateLayoutType = async (e, row) => {
    const val = e.target.value
    if(val && val.replace(/\s/g, '') != '' && val >= 0) {
      inputCodeStore.handleUpdateLayoutType(row.id, val)
      row.showText = true
    }
  }

  watchEffect(() => {

    if(inputCodeStore._updatedLayoutType) {
      if(inputCodeStore._updatedLayoutType?.success) {
        $q.notify({
          caption: inputCodeStore._updatedLayoutType.message,
          type: 'positive',
          timeout: 1000
        })

      } else {
        $q.notify({
          caption: inputCodeStore._updatedLayoutType.message,
          type: 'negative',
          timeout: 1000
        })
      }
    }
  }, [inputCodeStore._updatedLayoutType])

  const toggleShowAccount = (row, val) => {
    if(row.visibility) {
      inputCodeStore.handleUpdateLayoutContent(row.id, val, 'account')
    }
  }
  const toggleShowTitle = (row, val) => {
    if(row.visibility) {
      inputCodeStore.handleUpdateLayoutContent(row.id, val, 'title')
    }
  }
  const toggleShowHashtag = (row, val) => {
    if(row.visibility) {
      inputCodeStore.handleUpdateLayoutContent(row.id, val, 'hashtag')
    }
  }
  watchEffect(() => {
    if(inputCodeStore._updatedLayoutContent) {
      if(inputCodeStore._updatedLayoutContent?.success) {
        $q.notify({
          caption: inputCodeStore._updatedLayoutContent.message,
          type: 'positive',
          timeout: 1000
        })

      } else {
        $q.notify({
          caption: inputCodeStore._updatedLayoutContent.message,
          type: 'negative',
          timeout: 1000
        })
      }
    }
  }, [inputCodeStore._updatedLayoutContent])

  const copyCodes = (apiCode) => {
    inputCodeStore.copyHTML(apiCode)
  }

  const checkVisibility = (row) => {
    if(!row.visibility) {
      $q.notify({
        caption: `The campaign "${row.campaignName}" is private!`,
        type: 'info',
        timeout: 1000
      })
    }
  }

</script>

<template>
  <metainfo>
    <template v-slot:title="{ content }">{{
      content ? `${content} | ${WebsiteName}` : WebsiteName
    }}</template>
  </metainfo>
  <div class="full-width column q-mb-xl">
    <div class="q-pa-sm row items-start q-gutter-md">
      <q-breadcrumbs>
          <q-breadcrumbs-el :label="$t('nav.dashboard')" icon="mdi-home-variant-outline" to="/" />
          <q-breadcrumbs-el :label="$t('nav.inputCode')" />
      </q-breadcrumbs>
    </div>
    <div class="full-width row wrap justify-start items-start content-start">
      <div class="q-px-md row">
        <q-toolbar>
          <q-toolbar-title class="page-ttl">
            {{ $t('nav.inputCode') }}
          </q-toolbar-title>
        </q-toolbar>
      </div>
      <div class="full-width row q-px-md q-mt-md">
        <div class="col-12">
          <q-card class="common-card">
            <q-card-section class="row justify-between items-center q-py-md  q-px-lg">
              <div class="common-card-ttl">{{ $t('table.title.inputCode') }}</div>
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
                
                <template v-slot:body="props">
                  <q-tr :props="props" :class="{ disabled: !props.row.visibility, 'row-disabled': true }" @click="e => checkVisibility(props.row)">
                    
                    <q-td key="campaignName" :props="props">
                      {{ props.row.campaignName }}
                    </q-td>

                    <q-td key="layoutType" :props="props" @dblclick="$event => editCell($event, props.row)">
                        <div v-if="props.row.showText" class="text-center">
                          <div class="text-outlined shadow-1">{{ props.row.layoutType }}</div>
                        </div>
                        <div v-else class="input-wr ic-input">
                          <q-input 
                            style="max-width: 50px"
                            class="shadow-3"
                            type="url"
                            outlined 
                            autofocus
                            v-model="props.row.layoutType" 
                            @keyup.enter="$event =>updateLayoutType($event, props.row)"
                            @blur="$event =>updateLayoutType($event, props.row)"
                          />
                        </div>
                    </q-td>

                    <q-td key="layoutContent" :props="props" class="text-center">
                        <div class="full-width row justify-center">
                          <div class="col-auto">
                            <q-checkbox
                              class="ic-checkbox"
                              label="Account"
                              checked-icon="task_alt"
                              unchecked-icon="highlight_off"
                              v-model="props.row.showAccount"
                              @update:model-value="val => toggleShowAccount(props.row, val)"
                              :disable="!props.row.visibility"
                            />
                          </div>
                          <div class="col-auto q-mx-md">
                            <q-checkbox
                              class="ic-checkbox"
                              label="Title"
                              checked-icon="task_alt"
                              unchecked-icon="highlight_off"
                              v-model="props.row.showTitle"
                              @update:model-value="val => toggleShowTitle(props.row, val)"
                              :disable="!props.row.visibility"
                            />
                          </div>
                          <div class="col-auto">
                            <q-checkbox
                              class="ic-checkbox"
                              label="Hashtag"
                              checked-icon="task_alt"
                              unchecked-icon="highlight_off"
                              v-model="props.row.showHashtag"
                              @update:model-value="val => toggleShowHashtag(props.row, val)"
                              :disable="!props.row.visibility"
                            />
                          </div>
                        </div>
                    </q-td>
                        
                    <q-td key="apiCode" :props="props" class="text-center">
                        <q-btn 
                          no-caps 
                          class="btn-fixed-width ic-copy-btn" 
                          label="Copy" 
                          icon-right="mdi-content-copy" 
                          @click="copyCodes(props.row.apiCode)"
                          :disable="!props.row.visibility"
                        />
                    </q-td>

                  </q-tr>
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
