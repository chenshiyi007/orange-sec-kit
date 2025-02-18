<template>
  <PageHeader title="Hello View" subtitle="这是首页" />
  <app-selector v-model:app="appdata" v-model:app_instance_id="selectValue"></app-selector>
  <a-button @click="show">show</a-button>
  <a-button @click="set">set</a-button>
  <WangEditor v-model:content="content" />
  <a-select v-model="content"></a-select>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import PageHeader from '@/components/PageHeader.vue'
import AppSelector from '@/components/AppSelector.vue'
import WangEditor from '@/components/WangEditor.vue'

const selectValue = ref('')
const appdata = ref({})
const content = ref('')

function show() {
  console.log(content.value)
}

function set() {
  selectValue.value = "hhhhh"
}
</script>
<style scoped>

</style>
