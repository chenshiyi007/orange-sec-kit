<template>
  <div ref="editor"></div>
</template>
<script setup lang="ts">
import * as monaco from 'monaco-editor'
import { onMounted, onUnmounted, ref, watch } from 'vue'

const code = defineModel<string>('code')
const clear = defineModel<boolean>('clear')

const editor = ref<HTMLElement | null>(null)
let monacoEditor: monaco.editor.IStandaloneCodeEditor | null = null

// 初始化编辑器
onMounted(() => {
  if (editor.value) {
    monacoEditor = monaco.editor.create(editor.value, {
      value: code.value, // 初始化代码
      language: 'yaml',
      theme: 'vs-dark',
      colorDecorators: true,
      automaticLayout: true,
    })
    // 监听内容变化
    monacoEditor.onDidChangeModelContent(() => {
      code.value = monacoEditor?.getValue() || '' // 将最新代码传递给父组件
    })
  }
})

watch(()=>clear.value, (value) => {
  if (value) {
    monacoEditor?.setValue('')
  }
})

// 组件卸载时释放资源
onUnmounted(() => {
  if (monacoEditor) {
    monacoEditor.dispose()
  }
})
</script>
