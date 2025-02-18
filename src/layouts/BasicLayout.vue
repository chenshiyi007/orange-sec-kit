<template>
  <div id="basic-layout" >
    <a-layout class="layout" >
      <a-layout-header class="header box-shadow">
        <HeaderBar />
      </a-layout-header>
      <a-layout-content class="content">
        <RouterView />
      </a-layout-content>
      <a-layout-footer class="footer box-shadow">Footer</a-layout-footer>
    </a-layout>
  </div>
</template>

<script setup lang="ts">
import HeaderBar from '@/components/HeaderBar.vue'
</script>

<style scoped>
* {
  box-sizing: border-box;
}
.box-shadow {
  box-shadow: #eee 1px 1px 5px;
}
.layout {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
}
#basic-layout .footer {
  padding: 10px;
  width: 100%;
  text-align: center;
}
#basic-layout .content {
  flex:1;
  padding: 10px 20px;
}
</style>
