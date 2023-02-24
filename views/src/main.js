import App from './App.vue'
import router from './router'
import messages from './lang'
import { createApp, markRaw } from 'vue'
import { Quasar, Loading, Notify, Dialog } from 'quasar'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'
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
import '@quasar/extras/fontawesome-v6/fontawesome-v6.css'

// Import Quasar css
import 'quasar/dist/quasar.css'

// Common CSS
import '@/assets/scss/common.scss'

const i18n = createI18n({
  locale: 'JP', // default language
  messages
})

const localStorageLocale = localStorage.getItem('locale') || ''

if(localStorageLocale) {
  i18n.global.locale = localStorageLocale
}

export default i18n

const pinia = createPinia()
pinia.use(({ store }) => {
  store.router = markRaw(router)
},
)

createApp(App)
  .use(i18n)
  .use(pinia)
  .use(router)
  .use(createMetaManager())
  .use(Quasar, {
    plugins: {
      Loading,
      Notify,
      Dialog
    }, // import Quasar plugins and add here
  })
  .mount('#app')
