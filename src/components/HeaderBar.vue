<template>
  <div id="header-bar">
    <a-menu mode="horizontal" :selected-keys="selectKeys" @menu-item-click="doMenuClick">
      <a-menu-item key="0" :style="{ padding: 0, marginRight: '38px' }" disabled>
        <div class="title-bar">
          <img class="logo" src="@/assets/logo.svg" alt="logo" />
          <div class="title">XX管理系统</div>
        </div>
      </a-menu-item>
      <a-menu-item v-for="item in visibleRouters" :key="item.path" >
        {{ item.name }}
      </a-menu-item>
    </a-menu>
  </div>
</template>
<script setup lang="ts">
import { routers } from '@/router/routers.ts'
import { useRouter } from 'vue-router'
import { computed, ref } from 'vue'

const selectKeys = ref(['/'])

const router = useRouter()
router.afterEach((to) => {
  selectKeys.value = [to.path]
})

function doMenuClick(key: string) {
  router.push({ path: key })
}

const visibleRouters = computed(() => { //动态修改菜单组件
  return routers.filter((item) => {
    //todo 根据权限校验菜单
    return !item.meta?.isNotAccess
  })
})

</script>

<style scoped>
.title-bar {
  display: flex;
  align-items: center;
  justify-content: center;
}

.title-bar .logo {
  width: 30px;
}

.title-bar .title {
  color: black;
  margin-left: 16px;
}
</style>
