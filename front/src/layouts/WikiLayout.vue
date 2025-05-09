<template>
  <div id="wiki-layout">
    <a-layout class="layout">
      <a-layout-sider
        class="sub-menu"
        style="width: 100px; height: 100px; display: flex; flex-direction: column"
      >
        <a-menu mode="vertical" :selected-keys="selectKeys" @menu-item-click="doMenuClick">
          <a-menu-item key="app">
            <template #icon>
              <IconApps />
            </template>
            {{ t('layouts.wiki.application') }}
          </a-menu-item>
          <a-menu-item key="poc">
            <template #icon>
              <IconFire />
            </template>
            {{ t('layouts.wiki.vulnerability') }}
          </a-menu-item>
        </a-menu>
      </a-layout-sider>
      <a-layout-content class="content box-shadow">
        <RouterView />
      </a-layout-content>
    </a-layout>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, type RouteLocationNormalized } from 'vue-router'
import { IconApps, IconFire } from '@arco-design/web-vue/es/icon'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const selectKeys = ref([''])

const router = useRouter()

// 初始化 selectKeys
const setSelectKeys = () => {
  const currentPath = router.currentRoute.value.path
  if (currentPath.includes('poc')) {
    selectKeys.value = ['poc']
  } else if (currentPath.includes('app')) {
    selectKeys.value = ['app']
  }
}

router.afterEach((to: RouteLocationNormalized) => {
  void to
  setSelectKeys()
})

onMounted(() => {
  setSelectKeys()
})

function doMenuClick(key: string) {
  router.push({ path: `/wiki/${key}` })
}
</script>

<style scoped>
.content {
  margin-left: 16px;
  padding: 20px;
}
.box-shadow {
  box-shadow: #eee 1px 1px 5px;
}
</style>
