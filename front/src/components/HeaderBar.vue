<template>
  <div id="header-bar">
    <a-menu mode="horizontal" :selected-keys="selectKeys" @menu-item-click="doMenuClick">
      <a-menu-item key="0" :style="{ padding: 0, marginRight: '38px' }" disabled>
        <div class="title-bar">
          <div class="logo-wrapper">
            <img class="logo" src="@/assets/logo.jpg" alt="logo" />
          </div>
          <div class="title">{{ t('header.title') }}</div>
        </div>
      </a-menu-item>
      <a-menu-item v-for="item in visibleRouters" :key="item.path">
        {{ t(`menu.${item.meta?.i18nKey || ''}`) }}
      </a-menu-item>
    </a-menu>
    <div class="right-section">
      <!-- LanguageSwitch component removed -->
    </div>
  </div>
</template>
<script setup lang="ts">
import { routers } from '@/router/routers.ts'
import { useRouter } from 'vue-router'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const selectKeys = ref(['/'])

const router = useRouter()
router.afterEach((to) => {
  if (to.path.includes('wiki')) {
    selectKeys.value = ['/wiki']
  } else if (to.path.includes('tools')) {
    selectKeys.value = ['/tools']
  } else {
    selectKeys.value = [to.path]
  }
})

function doMenuClick(key: string) {
  router.push({ path: key })
}

const visibleRouters = computed(() => {
  //动态修改菜单组件
  return routers.filter((item) => {
    //根据权限校验菜单
    return !item.meta?.isNotAccess && !item.meta?.isHidden
  })
})
</script>

<style scoped>
#header-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.title-bar {
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-wrapper {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(255, 125, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
}

.title-bar .logo {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.title-bar .title {
  color: #ff7d00;
  margin-left: 12px;
  font-size: 18px;
  font-weight: 600;
}

.right-section {
  margin-right: 16px;
  display: flex;
  align-items: center;
}
</style>
