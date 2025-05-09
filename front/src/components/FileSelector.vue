<template>
  <div class="file-selector">
    <div class="selector-container">
      <a-tooltip :content="filePath" position="top" :disabled="!filePath">
        <a-input
          v-model="filePath"
          :placeholder="placeholder || t('components.fileSelector.selectFilePlaceholder')"
          :style="{ width: width }"
          readonly
          class="path-input"
        />
      </a-tooltip>
      <a-button type="primary" @click="handleSelectFile" class="select-button">
        {{ t('components.fileSelector.selectFile') }}
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
  fileType: {
    type: String,
    default: 'txt',
  },
  placeholder: {
    type: String,
    default: '',
  },
  initialPath: {
    type: String,
    default: '',
  },
  filePath: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:filePath', 'file-selected'])

const filePath = ref(props.filePath || props.initialPath || '')
const error = ref('')

// 监听props.filePath的变化
watch(
  () => props.filePath,
  (newPath) => {
    if (newPath !== filePath.value) {
      filePath.value = newPath
    }
  },
)

// 监听props.initialPath的变化
watch(
  () => props.initialPath,
  (newPath) => {
    if (!filePath.value && newPath) {
      filePath.value = newPath
    }
  },
)

// 监听内部filePath的变化以更新v-model
watch(filePath, (newPath) => {
  emit('update:filePath', newPath)
})

// 组件挂载时初始化
onMounted(() => {
  if (props.filePath) {
    filePath.value = props.filePath
  } else if (props.initialPath) {
    filePath.value = props.initialPath
    emit('update:filePath', props.initialPath)
  }
})

const handleSelectFile = async () => {
  try {
    error.value = ''

    // 检查是否在Electron环境中
    if (!window.electronAPI) {
      error.value = t('components.fileSelector.electronOnly')
      return
    }

    // 检查selectFile API是否可用
    if (!window.electronAPI.selectFile) {
      error.value = t('components.fileSelector.apiNotAvailable', 'File selection API not available')
      return
    }

    // 根据fileType属性设置文件过滤器
    const fileTypes = props.fileType.split(',').map((type) => type.trim())
    const selectedPath = await window.electronAPI.selectFile(fileTypes)

    if (selectedPath) {
      filePath.value = selectedPath
      emit('update:filePath', selectedPath)
      emit('file-selected', selectedPath)
    }
  } catch (err) {
    console.error('选择文件出错:', err)
    error.value = t('components.fileSelector.selectError')
  }
}
</script>

<style scoped>
.file-selector {
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
