<template>
  <div class="folder-selector">
    <div class="selector-container">
      <a-tooltip :content="folderPath" position="top" :disabled="!folderPath">
        <a-input
          v-model="folderPath"
          :placeholder="t('components.folderSelector.selectFolderPlaceholder')"
          :style="{ width: width }"
          readonly
          class="path-input"
        />
      </a-tooltip>
      <a-button type="primary" @click="handleSelectFolder" class="select-button">
        {{ t('components.folderSelector.selectFolder') }}
      </a-button>
    </div>
    <div v-if="error" class="error-message">{{ error }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  width: {
    type: String,
    default: '300px',
  },
  initialPath: {
    type: String,
    default: '',
  },
  folderPath: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:folderPath', 'folder-selected'])

const folderPath = ref(props.folderPath || props.initialPath || '')
const error = ref('')

// 监听props.folderPath的变化
watch(
  () => props.folderPath,
  (newPath) => {
    if (newPath !== folderPath.value) {
      folderPath.value = newPath
    }
  },
)

// 监听props.initialPath的变化
watch(
  () => props.initialPath,
  (newPath) => {
    if (!folderPath.value && newPath) {
      folderPath.value = newPath
    }
  },
)

// 监听内部folderPath的变化以更新v-model
watch(folderPath, (newPath) => {
  emit('update:folderPath', newPath)
})

// 组件挂载时初始化
onMounted(() => {
  if (props.folderPath) {
    folderPath.value = props.folderPath
  } else if (props.initialPath) {
    folderPath.value = props.initialPath
    emit('update:folderPath', props.initialPath)
  }
})

const handleSelectFolder = async () => {
  try {
    error.value = ''

    // 检查是否在Electron环境中
    if (!window.electronAPI) {
      error.value = t('components.folderSelector.electronOnly')
      return
    }

    // 检查selectFolder API是否可用
    if (!window.electronAPI.selectFolder) {
      error.value = t('components.folderSelector.apiNotAvailable', 'Folder selection API not available')
      return
    }

    const selectedPath = await window.electronAPI.selectFolder()

    if (selectedPath) {
      // 处理并规范化路径
      let normalizedPath = selectedPath
      // 检测平台并规范化路径
      const isWindows = window.electronAPI.getOSInfo &&
                        window.electronAPI.getOSInfo().platform === 'win32'

      if (isWindows) {
        // Windows环境下，确保使用反斜杠
        normalizedPath = selectedPath.replace(/\//g, '\\')
      } else {
        // Mac/Linux环境下，确保使用斜杠
        normalizedPath = selectedPath.replace(/\\/g, '/')
      }

      // 更新本地状态并发出事件
      folderPath.value = normalizedPath
      emit('update:folderPath', normalizedPath)
      emit('folder-selected', normalizedPath)
    }
  } catch (err) {
    console.error('选择文件夹出错:', err)
    error.value = t('components.folderSelector.selectError')
  }
}
</script>

<style scoped>
.folder-selector {
  margin-bottom: 8px;
}

.selector-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

.path-input {
  flex: 1;
}

.path-input :deep(input) {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.select-button {
  flex-shrink: 0;
}

.error-message {
  color: #f53f3f;
  margin-top: 4px;
  font-size: 14px;
}
</style>
