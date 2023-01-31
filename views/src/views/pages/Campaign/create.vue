<script setup>

  import { useMeta } from 'vue-meta'
  import { ref, computed, onMounted } from 'vue'
  import { WebsiteName } from '@/api/constants.js'


  /* app config */
  useMeta({
    title: 'CAMPAIGN',
  })

  const collectionTypes = [
    {
      label: 'Hashtag',
      value: '1'
    },
    {
      label: 'Account',
      value: '2'
    },
  ]
  const collectionType = ref('Hashtag')
  const collectionTypeInput = ref(false)

  const linkTypes = [
    {
      label: 'TikTok',
      value: '1'
    },
    {
      label: 'Server',
      value: '2'
    },
  ]
  const linkType = ref()

  function selectCollectionType(val) {
    
  }

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
        <q-breadcrumbs-el :label="$t('nav.campaign')" icon="mdi-email-outline" to="/campaigns" />
        <q-breadcrumbs-el :label="$t('nav.campaign')" />
    </q-breadcrumbs>
  </div>
  <div class="full-width row wrap q-mb-xl">
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
          <q-card-section class="row justify-between items-center q-py-md q-px-lg">
            <div class="common-card-ttl">New Campaign</div>
            <q-btn class="btn-common q-px-xl shadow-3" outline :label="`Create`" to="/campaigns/create" no-caps />
          </q-card-section>
          <q-separator />
          <q-card-section class="q-px-none">
            <q-form
              @submit="onSubmit"
              @reset="onReset"
              class="q-gutter-md"
            >
              <div class="row q-px-lg q-mt-none">
                <div class="col-4">
                  <div class="common-input">
                    <label class="text-subtitle1 common-input-label">Campaign Name</label>
                    <q-input name="campaignName" borderless class="common-input-text" />
                  </div>
                  <div class="common-input">
                    <label class="text-subtitle1 common-input-label">Collection Type</label>
                    <q-select @update:model-value="val => selectCollectionType(val)"  name="collectionType" borderless v-model="collectionType" :options="collectionTypes" class="common-select" />
                  </div>
                  <div class="common-input">
                    <label class="text-subtitle1 common-input-label">Account</label>
                    <q-input name="account" :disable="!collectionTypeInput" placeholder="#fashion,#music" borderless class="common-input-text" />
                  </div>
                  <div class="common-input">
                    <label class="text-subtitle1 common-input-label">Hashtag</label>
                    <q-input name="hashtag" :disable="collectionTypeInput" placeholder="Ex:@TikTok" borderless class="common-input-text" />
                  </div>
                  <div class="common-input">
                    <label class="text-subtitle1 common-input-label">Link Type</label>
                    <q-select name="linkType" borderless v-model="linkType" :options="linkTypes" class="common-select" />
                  </div>
                </div>
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>

<style lang="scss">

  

</style>
