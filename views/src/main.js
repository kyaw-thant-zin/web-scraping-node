import App from './App.vue'
import router from './router'
import { createApp } from 'vue'
import { Quasar } from 'quasar'
import { createPinia } from 'pinia'
import { createMetaManager } from 'vue-meta'

// Import icon libraries
import '@quasar/extras/material-icons/material-icons.css'
import '@quasar/extras/material-icons-outlined/material-icons-outlined.css'
import '@quasar/extras/material-icons-round/material-icons-round.css'
import '@quasar/extras/material-icons-sharp/material-icons-sharp.css'
import '@quasar/extras/material-symbols-outlined/material-symbols-outlined.css'
import '@quasar/extras/material-symbols-rounded/material-symbols-rounded.css'
import '@quasar/extras/material-symbols-sharp/material-symbols-sharp.css'
import '@quasar/extras/mdi-v6/mdi-v6.css'
import '@quasar/extras/ionicons-v4/ionicons-v4.css'

// Import Quasar css
import 'quasar/dist/quasar.css'

// Common CSS
import '@/assets/scss/common.scss'

createApp(App)
  .use(createPinia())
  .use(router)
  .use(createMetaManager())
  .use(Quasar, {
    plugins: {}, // import Quasar plugins and add here
  })
  .mount('#app')
