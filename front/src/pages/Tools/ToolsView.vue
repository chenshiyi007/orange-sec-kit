<template>
  <div id="tools-view">
    <a-layout class="tools-layout">
      <a-layout-sider class="tools-sider" :width="200">
        <a-menu mode="vertical" :selected-keys="[currentTool]" @menu-item-click="handleMenuClick">
          <a-menu-item key="webRequester">
            <template #icon>
              <icon-launch />
            </template>
            {{ t('pages.tools.webRequester.title') || 'Web发包' }}
          </a-menu-item>
          <a-menu-item key="encoderTool">
            <template #icon>
              <icon-code-block />
            </template>
            {{ t('pages.tools.encoderTool.title') || '编码解码' }}
          </a-menu-item>
          <a-menu-item key="cryptoTool">
            <template #icon>
              <icon-lock />
            </template>
            {{ t('pages.tools.cryptoTool.title') || '加密解密' }}
          </a-menu-item>
          <a-menu-item key="passwordScanner">
            <template #icon>
              <icon-safe />
            </template>
            {{ t('pages.tools.passwordScanner.title') || '口令验证' }}
          </a-menu-item>
        </a-menu>
      </a-layout-sider>
      <a-layout-content class="tools-content">
        <div class="content-container">
          <component :is="currentToolComponent"></component>
        </div>
      </a-layout-content>
    </a-layout>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineAsyncComponent, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { IconCodeBlock, IconLaunch, IconLock, IconSafe } from '@arco-design/web-vue/es/icon'

const { t } = useI18n()
const router = useRouter()
const route = useRoute()

// Lazy load tool components
const webRequester = defineAsyncComponent(() => import('@/pages/Tools/tools/WebRequester.vue'))
const EncoderTool = defineAsyncComponent(() => import('@/pages/Tools/tools/EncoderTool.vue'))
const CryptoTool = defineAsyncComponent(() => import('@/pages/Tools/tools/CryptoTool.vue'))
const PasswordScanner = defineAsyncComponent(
  () => import('@/pages/Tools/tools/PasswordScanner.vue'),
)

// Set the current active tool based on route or default
const currentTool = ref('webRequester')

// Set the initial tool based on the URL parameter or default to webRequester
onMounted(() => {
  const toolParam = route.params.tool as string
  if (
    toolParam &&
    ['webRequester', 'encoderTool', 'cryptoTool', 'passwordScanner'].includes(toolParam)
  ) {
    currentTool.value = toolParam
  } else {
    // Default to webRequester if no valid tool is specified
    currentTool.value = 'webRequester'
    router.replace({ path: `/tools/webRequester` })
  }
})

// Computed to determine which component to render
const currentToolComponent = computed(() => {
  switch (currentTool.value) {
    case 'encoderTool':
      return EncoderTool
    case 'cryptoTool':
      return CryptoTool
    case 'passwordScanner':
      return PasswordScanner
    case 'webRequester':
      return webRequester
    default:
      return webRequester
  }
})

// Handle menu item click to change tool
const handleMenuClick = (key: string) => {
  currentTool.value = key
  router.replace({ path: `/tools/${key}` })
}
</script>

<style scoped>
#tools-view {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.tools-layout {
  flex: 1;
  margin-top: 16px;
  background-color: var(--color-bg-2);
  border-radius: 4px;
  overflow: hidden;
  display: flex;
  height: calc(100vh - 150px);
}

.tools-sider {
  background-color: var(--color-bg-2);
  border-right: 1px solid var(--color-border);
  overflow-y: auto;
}

.tools-content {
  padding: 16px;
  background-color: var(--color-bg-2);
  flex: 1;
  overflow-y: auto;
}

.content-container {
  background-color: var(--color-bg-1);
  border-radius: 4px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}
</style>
