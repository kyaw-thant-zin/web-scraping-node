import App from './App.vue'
import router from './router'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import vuetify from './plugins/vuetify'
import { createMetaManager } from 'vue-meta'
import { loadFonts } from './plugins/webfontloader'



loadFonts()

createApp(App)
  .use(createPinia())
  .use(router)
  .use(createMetaManager())
  .use(vuetify)
  .mount('#app')
