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
      name: 'isActive',
      // required: true,
      label: 'Dessert (100g serving)',
      align: 'center',
      field: row => row.name,
      format: val => `${val}`,
      sortable: true,
    },
    { name: 'calories', align: 'center', label: 'Calories', field: 'calories', sortable: true },
  ]

  const rows = ref([
    {
      isActive: true,
      calories: 159,
    },
    {
      isActive: false,
      calories: 159,
    },
    {
      isActive: true,
      calories: 159,
    },
  ])

  const pagination = ref({
    sortBy: 'desc',
    descending: false,
    page: 1,
    rowsPerPage: 3
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
        <q-breadcrumbs-el :label="$t('nav.home')" icon="home" />
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
          title="キャンペーン一覧"
          :rows="rows"
          :columns="columns"
          color="primary"
          row-key="isActive"
          v-model:pagination="pagination"
          hide-pagination
        >
          <template v-slot:top-right>
            <q-btn
              color="primary"
              icon-right="archive"
              label="Export to csv"
              no-caps
            />
          </template>
          <template v-slot:body-cell-isActive="props">
            <q-td :props="props">
              <q-toggle 
                v-model="props.row.isActive" 
                checked-icon="check"
                color="primary"
                unchecked-icon="clear"  
                @update:model-value="val => togglePublicPrivate(props, val)"
              />
              {{ props.row.isActive }}
            </q-td>
          </template>
          <template v-slot:body-cell-calories="props">
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
      </div>
    </div>
  </div>
</template>

<style lang="scss">

  

</style>
