<script setup>

  import { useMeta } from 'vue-meta'
  import { useQuasar } from 'quasar'
  import { ref, watchEffect } from 'vue'
  import { WebsiteName } from '@/api/constants.js'
  import { useCampaignStore } from '@/stores/campaign.js'


  /* app config */
  useMeta({
    title: 'CAMPAIGN',
  })

  const $q = useQuasar()
  const campaignStore = useCampaignStore()
  campaignStore.handleCollectionTypes()
  campaignStore.handleLinkTypes()
  const collectionTypes = ref([])
  const linkTypes = ref([])

  const campaignCreateForm = ref(null)
  const formData = ref({
    campaignName: '',
    collectionType: {
      label: 'Hashtag',
      value: '1'
    },
    account: '',
    hashtag: '',
    linkType: {
      label: 'TikTok',
      value: '1'
    }
  })
  const collectionTypeInput = ref(false)

  function selectCollectionType(val) {
    if(val.label === 'Account') {
      collectionTypeInput.value = true
    } else {
      collectionTypeInput.value = false
    }
  }

  function submitForm() {
    campaignCreateForm.value.submit()
  }

  function onSubmit() {
    const resposne = campaignStore.handleCampaignCreate(formData.value)
  }

  const campaignNameLoading = ref(false)
  async function validateUnique(val) {
    campaignNameLoading.value = true
    const resposne = await campaignStore.handleUniqueField(val)
    campaignNameLoading.value = false
    return resposne || 'Campaign already exists.'
  }

  function requireOnce(val, field) {
    if(field === 'account') {
      if(collectionTypeInput.value === true) {
        return !!val.replace(/\s/g, '') || 'Field is required'
      }
    } else {
      if(collectionTypeInput.value === false) {
        return !!val.replace(/\s/g, '') || 'Field is required'
      }
    }
  }

  function resetForm() {
    formData.value.campaignName = ''
    formData.value.collectionType = {
      label: 'Hashtag',
      value: '1'
    }
    formData.value.account = ''
    formData.value.hashtag = ''
    formData.value.linkType = {
      label: 'TikTok',
      value: '1'
    }
    campaignCreateForm.value.resetValidation()
  }

  watchEffect( async () => {
    
    if(campaignStore._loading) {
        $q.loading.show()
    } else {
        $q.loading.hide()
    }

    if(campaignStore._collectionTypes !== null) {
      collectionTypes.value = campaignStore._collectionTypes
    }

    if(campaignStore._linkTypes !== null) {
      linkTypes.value = campaignStore._linkTypes
    }

    if(campaignStore._created) {
      $q.notify({
        caption: 'Congratulations, campaign has been successfully created.',
        message: 'SUCCESS',
        type: 'positive',
        timeout: 1000
      })
      resetForm()
      campaignStore.router.replace({ name: 'campaign.index' })
    } else {

    }

  }, [campaignStore])

</script>

<template>
  <metainfo>
    <template v-slot:title="{ content }">{{
      content ? `${content} | ${WebsiteName}` : WebsiteName
    }}</template>
  </metainfo>
  <div class="q-pa-sm row items-start q-gutter-md">
    <q-breadcrumbs>
        <q-breadcrumbs-el :label="$t('nav.dashboard')" icon="mdi-home-variant-outline" to="/" />
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
            <q-btn class="btn-common q-px-xl shadow-3" outline :label="`Create`" @click="submitForm()" no-caps />
          </q-card-section>
          <q-separator />
          <q-card-section class="q-px-none">
            <q-form
              ref="campaignCreateForm"
              @submit="onSubmit"
              class="q-gutter-md"
            >
              <div class="row q-px-lg q-mt-none">
                <div class="col-4">
                  <div class="common-input">
                    <label class="text-subtitle1 common-input-label">Campaign Name</label>
                    <q-input 
                      name="campaignName" 
                      borderless 
                      class="common-input-text" 
                      v-model="formData.campaignName"
                      :loading="campaignNameLoading"
                      lazy-rules
                      :rules="[
                        val => !!val.replace(/\s/g, '') || 'Field is required', 
                        (val, rules) => validateUnique(val),
                      ]"
                    />
                  </div>
                  <div class="common-input">
                    <label class="text-subtitle1 common-input-label">Collection Type</label>
                    <q-select 
                      name="collectionType" 
                      borderless 
                      @update:model-value="val => selectCollectionType(val)"  
                      v-model="formData.collectionType" 
                      :options="collectionTypes" 
                      class="common-select" 
                    />
                  </div>
                  <div class="common-input">
                    <label class="text-subtitle1 common-input-label">Account</label>
                    <q-input 
                      name="account" 
                      placeholder="#fashion,#music" 
                      borderless 
                      class="common-input-text" 
                      :disable="!collectionTypeInput" 
                      v-model="formData.account"
                      :rules="[
                        (val, rules) => requireOnce(val, 'account'),
                      ]"
                    />
                  </div>
                  <div class="common-input">
                    <label class="text-subtitle1 common-input-label">Hashtag</label>
                    <q-input 
                      name="hashtag" 
                      placeholder="Ex:@TikTok" 
                      borderless 
                      class="common-input-text"
                      :disable="collectionTypeInput" 
                      v-model="formData.hashtag"
                      :rules="[
                        (val, rules) => requireOnce(val, 'hashtag'),
                      ]"
                    />
                  </div>
                  <div class="common-input">
                    <label class="text-subtitle1 common-input-label">Link Type</label>
                    <q-select 
                      name="linkType" 
                      borderless 
                      class="common-select" 
                      v-model="formData.linkType" 
                      :options="linkTypes" 
                    />
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
