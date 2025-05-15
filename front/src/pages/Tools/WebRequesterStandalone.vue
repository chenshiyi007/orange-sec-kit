<template>
  <div class="standalone-wrapper">
    <!-- 只在无框架窗口模式下显示标题栏 -->
    <div v-if="isFrameless" class="standalone-header">
      <h2>{{ t('pages.tools.webRequester.title') }}</h2>
      <div class="header-spacer"></div>
      <a-button class="close-btn" type="text" size="small" @click="closeWindow">
        <template #icon>
          <icon-close />
        </template>
      </a-button>
    </div>
    <div class="standalone-content">
      <web-requester />
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { IconClose } from '@arco-design/web-vue/es/icon'

const WebRequester = defineAsyncComponent(() => import('@/pages/Tools/tools/WebRequester.vue'))
const { t } = useI18n()

// 检查是否在Electron环境中
const isElectron = ref(false)
// 检查是否为无框架窗口（暂时默认为false，现在我们使用标准窗口框架）
const isFrameless = ref(false)

onMounted(() => {
  isElectron.value = typeof (window as any).electronAPI !== 'undefined'
  // 这里可以通过URL参数或其他方式检测是否为无框架窗口
  // 目前我们使用标准窗口框架，所以设为false
  isFrameless.value = false
})

// 关闭窗口函数
function closeWindow() {
  if (isElectron.value) {
    const electronAPI = (window as any).electronAPI
    if (electronAPI) {
      if (typeof electronAPI.send === 'function') {
        electronAPI.send('close-current-window')
      } else if (typeof electronAPI.sendMessage === 'function') {
        electronAPI.sendMessage('close-current-window')
      }
    }
  }
}
</script>

<style scoped>
.standalone-wrapper {
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  background-color: var(--color-bg-2);
  overflow: hidden;
  border: none;
}

.standalone-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background-color: var(--color-bg-1);
  border-bottom: 1px solid var(--color-border);
  -webkit-app-region: drag; /* 允许拖动窗口 */
}

.standalone-header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 500;
  color: var(--color-text-1);
}

.header-spacer {
  flex: 1;
}

.close-btn {
  -webkit-app-region: no-drag; /* 按钮不允许拖动窗口 */
  color: var(--color-text-2);
}

.close-btn:hover {
  color: var(--color-text-1);
  background-color: var(--color-fill-3);
}

.standalone-content {
  flex: 1;
  padding: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
</style>
