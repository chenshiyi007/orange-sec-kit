<template>
  <div id="app">
    <template v-if="route.path.startsWith('/user')">
      <router-view/>
    </template>
    <template v-else>
      <BasicLayout/>
    </template>
  </div>
</template>
<script setup lang="ts">
import BasicLayout from '@/layouts/BasicLayout.vue'
import { useRoute } from 'vue-router'

const route = useRoute()
</script>
<style scoped>

</style>
