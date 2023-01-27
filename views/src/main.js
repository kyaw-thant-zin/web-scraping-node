import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createMetaManager } from 'vue-meta';

import App from './App.vue';
import router from './router';

import './assets/scss/common.scss';

const app = createApp(App);
const metaManager = createMetaManager();

app.use(createPinia());
app.use(router);
app.use(metaManager);

app.mount('#app');
