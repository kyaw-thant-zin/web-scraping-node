<script setup>
import { ref } from 'vue'
import { useMeta } from 'vue-meta'
import { WebsiteName } from '@/api/constants.js'

/* app config */
useMeta({
  title: 'DASHBOARD',
});

const storageValue = ref(65)
const requestValue = ref(40)

const mainChartSeries = [{
    name: 'Campaign Output',
    type: 'column',
    data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30, 23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30, 55, 44]
  }, {
    name: 'Link Setting',
    type: 'area',
    data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43, 44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43, 22, 66]
  }, {
    name: 'API Request',
    type: 'line',
    data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39, 30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39, 33, 22]
}]

const mainChartOptions = {
  chart: {
    height: 350,
    type: 'line',
    stacked: false,
  },
  stroke: {
    width: [0, 2, 5],
    curve: 'smooth'
  },
  plotOptions: {
    bar: {
      columnWidth: '50%'
    }
  },     
  fill: {
    opacity: [0.85, 0.25, 1],
    gradient: {
      inverseColors: false,
      shade: 'light',
      type: "vertical",
      opacityFrom: 0.85,
      opacityTo: 0.55,
      stops: [0, 100, 100, 100]
    }
  },
  labels: Array.from({length: 24}, (_, i) => i + ':00'),
  markers: {
    size: 0
  },
  xaxis: {
  },
  yaxis: {
    title: {
      text: '',
    },
    min: 0
  },
  tooltip: {
    shared: true,
    intersect: false,
    y: {
      formatter: function (y) {
        if (typeof y !== "undefined") {
          return y.toFixed(0);
        }
        return y;
            
      }
    }
  }
}

const storageChartSeries = [80, 20]
const storageChartOptions = {
  chart: {
    type: 'pie',
  },
  labels: ['Storage Usage', 'Available'],
  colors: ['#C10015', '#D5D6D6'],
  legend: {
    position: 'right'
  }
}

const requestChartSeries = [40, 60]
const requestChartOptions = {
  chart: {
    type: 'pie',
  },
  labels: ['Requests', 'Available'],
  colors: ['#21BA45', '#D5D6D6'],
  legend: {
    position: 'right'
  }
}

</script>

<template>
  <metainfo>
    <template v-slot:title="{ content }">{{
      content ? `${content} | ${WebsiteName}` : WebsiteName
    }}</template>
  </metainfo>
  <div class="full-width q-mb-xl">
    <div class="q-pa-sm row items-start q-gutter-md">
      <q-breadcrumbs>
          <q-breadcrumbs-el :label="$t('nav.dashboard')" icon="mdi-home-variant-outline" />
      </q-breadcrumbs>
    </div>
    <div class="full-width row wrap justify-start items-start content-start">
      <div class="q-px-md row">
        <q-toolbar>
          <q-toolbar-title class="page-ttl">
            {{ $t('nav.dashboard') }}
          </q-toolbar-title>
        </q-toolbar>
      </div>
      <div class="full-width q-px-md q-mt-md">
        <div class="row justify-between q-gutter-y-lg ">
          <div class="col-12 col-sm-12 col-md-12 col-lg-8 q-gutter-x-sm">
            <q-card>
              <q-card-section style="overflow-x: auto;">
                <apexchart type="line" height="350" style="min-width: 680px;" :options="mainChartOptions" :series="mainChartSeries"></apexchart>
              </q-card-section>
            </q-card>
            <div class="row q-mt-lg justify-between q-gutter-y-md">
              <div class="col-6 col-xs-6 col-sm-4 q-gutter-x-sm">
                <q-card class="">
                  <q-item class="bg-main text-white">
                    <q-icon color="white" name="mdi-lock-open-outline" size="md"/>
                    <q-item-section class="q-ml-md">
                      <q-item-label>Campaign 1</q-item-label>
                      <q-item-label caption>
                        <q-icon color="white" name="mdi-clock-time-eight-outline" />
                        <span class="text-white q-ml-xs">21/12/23</span>
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-card-section class="q-gutter-x-md q-gutter-y-sm">
                    <q-chip class="bg-whitegrey" icon="mdi-email-outline">
                      #TGC
                    </q-chip>
                    <q-chip class="bg-whitegrey" icon="mdi-package-variant-closed">
                      Campaign Output
                      <q-badge class="custom-badge" floating>22</q-badge>
                    </q-chip>
                    <q-chip class="bg-whitegrey" icon="mdi-message-outline">
                      Link Setting
                      <q-badge class="custom-badge" floating>22</q-badge>
                    </q-chip>
                    <q-chip class="bg-whitegrey" icon="mdi-cloud-download-outline">
                      API Request
                      <q-badge class="custom-badge" floating>22</q-badge>
                    </q-chip>
                  </q-card-section>
                  <q-separator />
                  <q-card-actions>
                    <q-icon name="event" size="xs" /> 
                    <p class="text-caption q-mb-none q-ml-xs">Last run - 21/02/2023 13:40</p>
                  </q-card-actions>
                </q-card> 
              </div>
              <div class="col-6 col-xs-6 col-sm-4 q-gutter-x-sm">
                <q-card class="lock-card">
                  <q-item class="bg-main text-white">
                    <q-icon color="white" name="mdi-lock-outline" size="md"/>
                    <q-item-section class="q-ml-md">
                      <q-item-label>Campaign 1</q-item-label>
                      <q-item-label caption>
                        <q-icon color="white" name="mdi-clock-time-eight-outline" />
                        <span class="text-white q-ml-xs">21/12/23</span>
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-card-section class="q-gutter-x-md q-gutter-y-sm">
                    <q-chip class="bg-whitegrey" icon="mdi-email-outline">
                      #TGC
                    </q-chip>
                    <q-chip class="bg-whitegrey" icon="mdi-package-variant-closed">
                      Campaign Output
                      <q-badge class="custom-badge" floating>22</q-badge>
                    </q-chip>
                    <q-chip class="bg-whitegrey" icon="mdi-message-outline">
                      Link Setting
                      <q-badge class="custom-badge" floating>22</q-badge>
                    </q-chip>
                    <q-chip class="bg-whitegrey" icon="mdi-cloud-download-outline">
                      API Request
                      <q-badge class="custom-badge" floating>22</q-badge>
                    </q-chip>
                  </q-card-section>
                </q-card> 
              </div>
              <div class="col-6 col-xs-6 col-sm-4 q-gutter-x-sm">
                <q-card class="lock-card">
                  <q-item class="bg-main text-white">
                    <q-icon color="white" name="mdi-lock-outline" size="md"/>
                    <q-item-section class="q-ml-md">
                      <q-item-label>Campaign 1</q-item-label>
                      <q-item-label caption>
                        <q-icon color="white" name="mdi-clock-time-eight-outline" />
                        <span class="text-white q-ml-xs">21/12/23</span>
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-card-section class="q-gutter-x-md q-gutter-y-sm">
                    <q-chip class="bg-whitegrey" icon="mdi-email-outline">
                      #TGC
                    </q-chip>
                    <q-chip class="bg-whitegrey" icon="mdi-package-variant-closed">
                      Campaign Output
                      <q-badge class="custom-badge" floating>22</q-badge>
                    </q-chip>
                    <q-chip class="bg-whitegrey" icon="mdi-message-outline">
                      Link Setting
                      <q-badge class="custom-badge" floating>22</q-badge>
                    </q-chip>
                    <q-chip class="bg-whitegrey" icon="mdi-cloud-download-outline">
                      API Request
                      <q-badge class="custom-badge" floating>22</q-badge>
                    </q-chip>
                  </q-card-section>
                </q-card> 
              </div>
              <div class="col-6 col-xs-6 col-sm-4 q-gutter-x-sm">
                <q-card class="">
                  <q-item class="bg-main text-white">
                    <q-icon color="white" name="mdi-lock-open-outline" size="md"/>
                    <q-item-section class="q-ml-md">
                      <q-item-label>Campaign 1</q-item-label>
                      <q-item-label caption>
                        <q-icon color="white" name="mdi-clock-time-eight-outline" />
                        <span class="text-white q-ml-xs">21/12/23</span>
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-card-section class="q-gutter-x-md q-gutter-y-sm">
                    <q-chip class="bg-whitegrey" icon="mdi-email-outline">
                      #TGC
                    </q-chip>
                    <q-chip class="bg-whitegrey" icon="mdi-package-variant-closed">
                      Campaign Output
                      <q-badge class="custom-badge" floating>22</q-badge>
                    </q-chip>
                    <q-chip class="bg-whitegrey" icon="mdi-message-outline">
                      Link Setting
                      <q-badge class="custom-badge" floating>22</q-badge>
                    </q-chip>
                    <q-chip class="bg-whitegrey" icon="mdi-cloud-download-outline">
                      API Request
                      <q-badge class="custom-badge" floating>22</q-badge>
                    </q-chip>
                  </q-card-section>
                </q-card> 
              </div>
            </div>
          </div>
          <div  class="col-12 col-sm-12 col-md-12 col-lg-4 q-gutter-x-sm">
            <q-card>
              <q-card-section>
                <q-list padding>
                  <q-item>
                    <q-item-section>
                      <q-item-label class="text-center text-h6">Detail</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-separator />
                  <q-item>
                    <q-item-section avatar>
                      <q-icon class="color-cm" name="mdi-email-outline" />
                    </q-item-section>
                    <q-item-section>Campaign</q-item-section>
                    <q-item-section side>
                      <q-item-label caption>
                        <q-chip class="detail-chip">
                          22
                        </q-chip>
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section avatar>
                      <q-icon class="color-co" name="mdi-package-variant-closed" />
                    </q-item-section>
                    <q-item-section>Campaign Output</q-item-section>
                    <q-item-section side>
                      <q-item-label caption>
                        <q-chip class="detail-chip">
                          22
                        </q-chip>
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section avatar>
                      <q-icon class="color-ls" name="mdi-message-outline" />
                    </q-item-section>
                    <q-item-section>Link Setting</q-item-section>
                    <q-item-section side>
                      <q-item-label caption>
                        <q-chip class="detail-chip">
                          22
                        </q-chip>
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section avatar>
                      <q-icon class="color-ic" name="mdi-cog-outline" />
                    </q-item-section>
                    <q-item-section>InputCode</q-item-section>
                    <q-item-section side>
                      <q-item-label caption>
                        <q-chip class="detail-chip">
                          22
                        </q-chip>
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item class="q-mt-lg">
                    <q-item-section>
                      <div class="row justify-between q-gutter-y-md">
                        <div class="col-12 col-xs-12 col-sm-6 col-md-5 col-lg-12">
                          <div class="row">
                            <div class="col-12">
                              <apexchart width="100%" height="auto" :options="storageChartOptions" :series="storageChartSeries"></apexchart>
                            </div>
                            <div class="col-12 q-pr-md">
                              <div class="text-subtitle1">Storage</div>
                              <p>Storage allows using of Campaigns, Campaign Outputs, and Link Settings.</p>
                            </div>
                          </div>
                        </div>
                        <div class="col-12 col-xs-12 col-sm-6 col-md-5 col-lg-12">
                          <div class="row">
                            <div class="col-12">
                              <apexchart width="100%" height="auto" :options="requestChartOptions" :series="requestChartSeries"></apexchart>
                            </div>
                            <div class="col-12 q-pr-md">
                              <div class="text-subtitle1">Rate Limiting</div>
                              <p>For API requests using, you can make up to 500 requests per hour.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>
