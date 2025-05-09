import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import ArcoVue from '@arco-design/web-vue'
import '@arco-design/web-vue/dist/arco.css'
import 'bytemd/dist/index.css'
import 'highlight.js/styles/atom-one-dark.css'
import 'github-markdown-css/github-markdown-light.css'
import i18n from './locales'

// 检查是否在Electron环境中
console.log('应用启动中...')
console.log('当前环境:', import.meta.env.MODE)
console.log('Electron API可用:', !!window.electronAPI)

// 确保window.electronAPI接口可用，即使在浏览器环境下也不会报错
if (!window.electronAPI) {
  console.warn('未检测到Electron API, 可能运行在浏览器环境中')
  // 提供空实现，避免在浏览器环境下调用时出错
  window.electronAPI = {
    send: () => {},
    on: () => (() => {}),
    selectFolder: () => Promise.resolve(null),
    selectFile: () => Promise.resolve(null),
    openNewWindow: () => Promise.resolve(null as any),
    isBackendReady: () => Promise.resolve(true),
    openExternal: (url) => {
      window.open(url, '_blank')
      return Promise.resolve()
    },
    getOSInfo: () => ({
      platform: 'web',
      arch: 'web',
      version: 'web'
    }),
    sendMessage: () => {},
    receiveMessage: () => (() => {})
  }
}

// Disable Vue DevTools
// @ts-ignore
if (window.__VUE_DEVTOOLS_GLOBAL_HOOK__) {
  // @ts-ignore
  window.__VUE_DEVTOOLS_GLOBAL_HOOK__.emit = () => {}
}

// Remove Vue DevTools from DOM if present
const removeDevTools = () => {
  const devtoolsEl = document.querySelector('.vue-devtools-inject, #vue-devtools, .v-devtools')
  if (devtoolsEl && devtoolsEl.parentNode) {
    devtoolsEl.parentNode.removeChild(devtoolsEl)
    console.log('Vue DevTools removed from DOM')
  }
}

// Run immediately and periodically check
removeDevTools()
setInterval(removeDevTools, 1000)

const app = createApp(App)
app.use(ArcoVue)
app.use(createPinia())
app.use(router)
app.use(i18n)

app.mount('#app')
