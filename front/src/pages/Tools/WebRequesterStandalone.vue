<template>
  <div class="standalone-wrapper">
    <div class="standalone-header">
      <h2>{{ t('pages.tools.webRequester.title') }}</h2>
    </div>
    <div class="standalone-content">
      <web-requester />
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import { useI18n } from 'vue-i18n'

const WebRequester = defineAsyncComponent(() => import('@/pages/Tools/tools/WebRequester.vue'))
const { t } = useI18n()
</script>

<style scoped>
.standalone-wrapper {
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  background-color: var(--color-bg-2);
}

.standalone-header {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background-color: var(--color-bg-1);
  border-bottom: 1px solid var(--color-border);
}

.standalone-header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 500;
  color: var(--color-text-1);
}

.standalone-content {
  flex: 1;
  padding: 16px;
  overflow: auto;
}
</style>
