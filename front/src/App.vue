<template>
  <div id="app">
    <template v-if="isStandalonePage">
      <router-view />
    </template>
    <template v-else>
      <BasicLayout />
    </template>
    <MsgNotify />
  </div>
</template>
<script setup lang="ts">
import BasicLayout from '@/layouts/BasicLayout.vue'
import MsgNotify from '@/components/MsgNotify.vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { watch, computed } from 'vue'

const route = useRoute()
const { locale } = useI18n()

// 判断当前是否为独立页面
const isStandalonePage = computed(() => {
  return (
    route.path.startsWith('/user') ||
    route.path.startsWith('/standalone') ||
    route.path.startsWith('/init') ||
    route.path === '/'
  )
})

// Set HTML lang attribute based on current locale
document.documentElement.lang = locale.value

// Watch for locale changes and update HTML lang attribute
watch(locale, (newLocale) => {
  document.documentElement.lang = newLocale
})
</script>
<style>
html,
body {
  height: 100%;
  margin: 0;
  padding: 0;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Hide Vue DevTools components */
.vue-devtools-inject,
#vue-devtools,
.v-devtools,
.vue-devtools,
[data-v-inspector],
[data-v-app-inspector] {
  display: none !important;
  visibility: hidden !important;
  opacity: 0 !important;
  pointer-events: none !important;
}
</style>
