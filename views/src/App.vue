<script setup>
import { RouterView } from 'vue-router';

/* header and footer for common  */
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';
</script>

<template>
  <Header></Header>
  <v-app>
    <v-main>
      <RouterView v-slot="{ Component }">
        <template v-if="Component">
          <Transition name="fade">
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
          </Transition>
        </template>
      </RouterView>
    </v-main>
  </v-app>
  <Footer></Footer>
</template>
