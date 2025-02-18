<template>
  <div class="notes">
    <h2>Hello POC</h2>
    <WangEditor :content="editorContent" @update="handleUpdate" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import WangEditor from "@/components/WangEditor.vue";


const editorContent = ref('<p>默认内容</p>')


const handleUpdate = (content: string) => {
  editorContent.value = content
}

</script>
