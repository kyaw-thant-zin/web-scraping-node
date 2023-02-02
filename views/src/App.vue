<script setup>
import { RouterView, useRoute } from 'vue-router';
import { ref, computed, onMounted } from 'vue'

/* header and footer for common  */
import Header from '@/views/layout/Header.vue';
import Footer from '@/views/layout/Footer.vue';

const authRoute = [
  'signUp',
  'signIn',
  'forgotPassword'
]

const routeName = computed(() => { 
  const route = useRoute()
  return route.name
})

</script>

<template>
  <q-layout class="l" view="lHh LpR lff">
    <template v-if="!authRoute.includes(routeName)">
      <Header></Header>
    </template>
    <q-page-container class="row fit min-height-fit">
      <RouterView v-slot="{ Component }">
        <template v-if="Component">
            <Transition name="fade">
              <div class="fit row min-height-fit">
                <KeepAlive>
                  <Suspense>
                    <!-- main content -->
                    <component :is="Component"></component>

                    <!-- loading state -->
                    <template #fallback>
                      Loading...
                    </template>
                  </Suspense>
                </KeepAlive>
              </div>
            </Transition>
        </template>
      </RouterView>
    </q-page-container>
    <template v-if="!authRoute.includes(routeName)">
      <Footer></Footer>
    </template>
  </q-layout>
</template>
