<template>
  <div style="border: 1px solid #ccc">
    <Toolbar
      :editor="editorRef"
      :defaultConfig="toolbarConfig"
      :mode="mode"
      style="border-bottom: 1px solid #ccc"
    />
    <Editor
      v-model="content"
      :defaultConfig="editorConfig"
      :mode="mode"
      @onCreated="handleCreated"
      style="height: 500px; overflow-y: hidden"
    />
  </div>
</template>

<script setup lang="ts">
import {  onBeforeUnmount, ref, shallowRef } from 'vue'
// 禁用类型检查
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import type { IToolbarConfig, IDomEditor } from '@wangeditor/editor'
import Compressor from 'compressorjs'
import { Notification } from '@arco-design/web-vue'

const content = defineModel<string>('content', {
  required: true,
})

const mode = ref('default')

const editorRef = shallowRef()


const toolbarConfig: Partial<IToolbarConfig> = {
  excludeKeys: ['group-image', 'group-video'],
}
toolbarConfig.insertKeys = {
  index: 20,
  keys: 'uploadImage',
}

const editorConfig = {
  placeholder: '请输入内容...',
  MENU_CONF: {
    uploadImage: {
      customUpload(file: File, insertFn: (content: string | ArrayBuffer | null) => void) {
        const maxSize = 5 * 1024 * 1024 // 5MB 限制
        if (file.size > maxSize) {
          alert('图片不能超过 2MB！')
          return
        }
        new Compressor(file, {
          quality: 60,
          success(result) {
            const reader = new FileReader()
            reader.readAsDataURL(result)
            reader.onload = function () {
              insertFn(reader.result) // 插入压缩后的 Base64
            }
          },
          error(error: Error) {
            Notification.error(error.message)
          },
        })
      },
    },
  },
}

const handleCreated = (editor: IDomEditor) => {
  editorRef.value = editor
}

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})
</script>
