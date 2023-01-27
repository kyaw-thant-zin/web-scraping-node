<script setup>
import { RouterView } from 'vue-router';

/* header and footer for common  */
import Header from '@/views/layout/Header.vue';
import Footer from '@/views/layout/Footer.vue';
</script>

<template>
  <q-layout view="lHh LpR lff">
    <Header></Header>
    <q-page-container>
      <RouterView v-slot="{ Component }">
          <template v-if="Component">
            <Transition name="fade">
              <div>
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
    <Footer></Footer>
  </q-layout>
</template>
