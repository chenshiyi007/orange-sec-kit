import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import ArcoVue from '@arco-design/web-vue'
import '@arco-design/web-vue/dist/arco.css'
import 'bytemd/dist/index.css'
import 'highlight.js/styles/atom-one-dark.css'
import 'github-markdown-css/github-markdown-light.css';

const app = createApp(App)
app.use(ArcoVue)
app.use(createPinia())
app.use(router)

app.mount('#app')
