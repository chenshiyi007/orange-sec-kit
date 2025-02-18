<template>
  <a-select
    v-model="selectedValue"
    :options="options"
    placeholder="请输入应用名"
    :field-names="{ value: 'instance_id', label: 'name' }"
    allow-search
    @search="handleSearch"
    @focus="handleFocus"
    @dropdown-reach-bottom="handleGetMore"
  />
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { Notification } from '@arco-design/web-vue'
import { listAppName } from '@/api/app.ts'
import { debounce } from 'lodash'
const props = defineProps({
  'init_options':{
    type: Array<{ instance_id: string; name: string ; isNew: boolean }>,
    default:[],
  }
})
const selectedValue = defineModel<string>('app_instance_id')
const appResult = defineModel<object>('app')
const loading = ref(false)
const page = ref(1)
const isFinished = ref(false)
const searchText = ref('')
const options = ref<Array<{ instance_id: string; name: string ; isNew: boolean }>>(props.init_options)
watch(
  () => selectedValue.value,
  (value) => {
    if (selectedValue.value === '') {
      appResult.value = {}
    }
    const app = options.value.find(item => item.instance_id === value)
    if (app && !app.isNew) {
      appResult.value = app
    }
  }
)

// 搜索防抖
const handleSearch = debounce((value: string) => {
  isFinished.value = false
  page.value = 1 // 重新搜索时，重置分页
  searchText.value = value
  getApps(value)
}, 300)

// 聚焦时加载数据（仅当数据为空时）
function handleFocus() {
  if (options.value.length === 0 || props.init_options.length !== 0) {
    page.value = 1
    isFinished.value = false
    getApps('')
  }
}

// 滚动到底部加载更多
function handleGetMore() {
  if (!isFinished.value) {
    page.value += 1
    getApps(searchText.value as string)
  }
}

onMounted(() => {
    if (selectedValue.value === '') {
      return
    }

  }
)

// 请求数据
  const getApps = async (name: string) => {
    if (isFinished.value) return
    loading.value = true
    try {
      const res = await listAppName({ name, size: 10, page: page.value })
      if (res.status !== 200) {
        Notification.warning('服务错误')
        return
      }
      if (res.data?.code === 0) {
        const newItems = res.data.data.items
        if (newItems.length === 0 && page.value !== 1) {
          isFinished.value = true
          return
        } else {
          isFinished.value = false
        }
// eslint-disable-next-line @typescript-eslint/no-explicit-any
        newItems.forEach((item: any) => {
          item.name = item.name+" ("+item.version+")";
        })
        options.value = page.value === 1 ? newItems : deduplicate([...options.value, ...newItems])
      } else {
        Notification.warning(res.data?.message || '请求失败')
      }
    } catch {
      Notification.error('请求异常')
    } finally {
      loading.value = false
    }
  }

// 去重
  const deduplicate = (list: Array<{ instance_id: string; name: string }>) => {
    const seen = new Set()
    return list.filter((item) => {
      if (seen.has(item.instance_id)) return false
      seen.add(item.instance_id)
      return true
    })
  }
</script>
