<template>
  <a-tooltip :content="tooltipText" position="top">
    <a-button
      v-if="isElectron"
      :type="buttonType"
      :size="buttonSize"
      :status="buttonStatus"
      :shape="buttonShape"
      @click="openInNewWindow"
    >
      <template #icon>
        <slot name="icon">
          <icon-launch />
        </slot>
      </template>
    </a-button>
  </a-tooltip>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Message } from '@arco-design/web-vue'
import { IconLaunch } from '@arco-design/web-vue/es/icon'

const { t } = useI18n()

// 定义按钮类型
type ButtonType = 'text' | 'outline' | 'dashed' | 'primary' | 'secondary' | undefined
type ButtonSize = 'mini' | 'small' | 'medium' | 'large' | undefined
type ButtonStatus = 'normal' | 'success' | 'warning' | 'danger' | undefined
type ButtonShape = 'square' | 'round' | 'circle' | undefined

const props = defineProps({
  // 要打开的路由路径
  route: {
    type: String,
    required: true,
  },
  // 窗口标题
  title: {
    type: String,
    default: '',
  },
  // 窗口宽度
  width: {
    type: Number,
    default: 1200,
  },
  // 窗口高度
  height: {
    type: Number,
    default: 800,
  },
  // 按钮文本
  text: {
    type: String,
    default: '',
  },
  // 按钮类型
  type: {
    type: String,
    default: 'outline',
  },
  // 按钮尺寸
  size: {
    type: String,
    default: 'medium',
  },
  // 按钮状态
  status: {
    type: String,
    default: '',
  },
  // 按钮形状
  shape: {
    type: String,
    default: 'circle',
  },
})

// 提示文本
const tooltipText = computed(
  () => props.text || t('components.newWindowButton.openInNewWindow', '在新窗口打开'),
)

// 转换按钮属性，确保类型正确
const buttonType = computed(() => props.type as ButtonType)
const buttonSize = computed(() => props.size as ButtonSize)
const buttonStatus = computed(() => (props.status as ButtonStatus) || undefined)
const buttonShape = computed(() => (props.shape as ButtonShape) || undefined)

// 检查是否在Electron环境中
const isElectron = ref(false)

onMounted(() => {
  isElectron.value = window.electronAPI !== undefined
})

// 在新窗口中打开路由
const openInNewWindow = async () => {
  if (!isElectron.value || !window.electronAPI) {
    Message.warning(t('components.newWindowButton.electronOnly', '此功能仅在桌面应用中可用'))
    return
  }

  try {
    await window.electronAPI.openNewWindow({
      route: props.route,
      width: props.width,
      height: props.height,
      title: props.title || document.title,
    })
  } catch (error) {
    console.error('打开新窗口失败:', error)
    Message.error(t('components.newWindowButton.openFailed', '打开新窗口失败'))
  }
}
</script>

<style scoped>
/* 可根据需要添加样式 */
</style>
