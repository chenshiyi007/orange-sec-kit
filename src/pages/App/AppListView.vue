<template>
  <div class="notes">
    <a-row class="title" align="center">
      <a-col :span="6">
        <a-statistic
          title="应用数量"
          :value="total"
          :value-from="0"
          :start="true"
          :animation-duration="1000"
          animation
        >
          <template #suffix>
            <IconArrowRise />
          </template>
        </a-statistic>
      </a-col>
    </a-row>
    <div class="search"></div>
    <a-row :gutter="8">
      <a-col :span="6">
        <a-input v-model="searchName" placeholder="应用名称模糊搜索" allow-clear />
      </a-col>
      <a-col :span="6">
        <a-input v-model="searchVersion" placeholder="应用版本模糊搜索" allow-clear />
      </a-col>
      <a-col :span="2">
        <a-button type="primary" @click="handlerSearch" :loading="searchLoading">
          <template #icon>
            <IconSearch />
          </template>
          搜索
        </a-button>
      </a-col>
      <a-col :span="2" >
        <a-button type="text" @click="refreshData" shape="circle" :loading="loading">
          <template #icon>
            <IconRefresh />
          </template>
        </a-button>
      </a-col>
      <a-col :span="4"  :offset="4" style="display: flex;justify-content: flex-end;">
        <a-button type="primary" @click="appAddClick">
          <template #icon>
            <IconPlus />
          </template>
          新增应用
        </a-button>
      </a-col>
    </a-row>
    <div class="table">
      <a-table
        :columns="columns"
        :data="data"
        :pagination="false"
        size="medium"
        bordered
        stripe
        :row-selection="rowSelection"
        row-key="instance_id"
        v-model:selectedKeys="selectedKeys"
      >
        <template #pocCount="{ record }">
          <a-badge :max-count="999" :count="record.poc_count" :dotStyle="{ background: '#165DFF' }">
          </a-badge>
        </template>
        <template #optional="{ record }">
          <div class="table-item">
            <a-button type="text" shape="circle" @click="appDetailClick(record?.instance_id || '')">
              <IconEye />
            </a-button>
          </div>
        </template>
        <template #fofa="{ record }">
          <a-typography-text v-if="record.fofa_finger !== ''" copyable
            >{{ record.fofa_finger }}
          </a-typography-text>
          <a-typography-text v-else>-</a-typography-text>
        </template>
        <template #hunter="{ record }">
          <a-typography-text v-if="record.hunter_finger !== ''" copyable
            >{{ record.hunter_finger }}
          </a-typography-text>
          <a-typography-text v-else>-</a-typography-text>
        </template>
      </a-table>
      <a-row style="margin-top: 8px">
        <a-col :span="2" v-if="selectedKeys.length > 0">
          <a-popover
            trigger="click"
            title="确认删除应用吗?"
            position="bottom"
            v-model:popup-visible="popoverVisible"
          >
            <a-button type="primary" status="danger"
              >批量删除
              <template #icon>
                <IconDelete />
              </template>
            </a-button>
            <template #content>
              <a-row :gutter="8" class="popover-content">
                <a-col :span="12">
                  <a-button @click="handlerCancelDelete">取消</a-button>
                </a-col>
                <a-col :span="12">
                  <a-button
                    @click="handlerDelete"
                    type="primary"
                    status="danger"
                    :loading="deleteLoading"
                    >确认
                  </a-button>
                </a-col>
              </a-row>
            </template>
          </a-popover>
        </a-col>
        <a-col :span="24">
          <a-pagination
            class="pagination"
            :total="total"
            :current="currentPage"
            :page-size="pageSize"
            show-jumper
            show-page-size
            @change="handlePageChange"
            :page-size-options="[10, 20, 50, 100]"
            @page-size-change="handlePageSizeChange"
          />
        </a-col>
      </a-row>
    </div>
  </div>
  <a-drawer
    :width="400"
    :visible="addVisible"
    unmountOnClose
    :footer="false"
    @cancel="handleAddCancel"
  >
    <div>
      <AppAddView></AppAddView>
    </div>
  </a-drawer>
</template>

<script setup lang="ts">
import {
  IconArrowRise,
  IconPlus,
  IconRefresh,
  IconEye,
  IconSearch,
  IconDelete,
} from '@arco-design/web-vue/es/icon'
import { onMounted, ref, reactive } from 'vue'
import { Notification, type TableColumnData, type TableRowSelection } from '@arco-design/web-vue'
import { listApps } from '@/api/app.ts'
import AppAddView from '@/pages/App/AppAddView.vue'
import { useRouter } from 'vue-router'
import { deleteApp } from '@/api/app.ts'

const router = useRouter()
const searchLoading = ref(false)
const searchName = ref('')
const searchVersion = ref('')
const selectedKeys = ref([])
const popoverVisible = ref(false)
const deleteLoading = ref(false)
const columns = [
  {
    title: 'ID',
    dataIndex: 'instance_id',
    ellipsis: true,
    tooltip: true,
    width: 100,
  },
  {
    title: '应用名称',
    dataIndex: 'name',
    width: 200,
    ellipsis: true,
    tooltip: true,
  },
  {
    title: '版本',
    dataIndex: 'version',
    width: 100,
    ellipsis: true,
    tooltip: true,
  },
  {
    title: 'poc数量',
    dataIndex: 'poc_count',
    width: 100,
    slotName: 'pocCount',
    ellipsis: true,
    tooltip: true,
  },
  {
    title: 'FOFA指纹',
    dataIndex: 'fofa_finger',
    width: 180,
    slotName: 'fofa',
    ellipsis: true,
    tooltip: true,
  },
  {
    title: 'HUNTER指纹',
    dataIndex: 'hunter_finger',
    slotName: 'hunter',
    width: 180,
    ellipsis: true,
    tooltip: true,
  },
  {
    title: '更新时间',
    dataIndex: 'update_time',
    align: 'center',
  },
  {
    title: '操作',
    slotName: 'optional',
    width: 100,
    align: 'center',
  },
] as TableColumnData[]

const addVisible = ref(false)

const rowSelection = reactive({
  type: 'checkbox',
  showCheckedAll: true,
  onlyCurrent: false,
}) as TableRowSelection
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const data = ref<Array<any>>([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const loading = ref(false)

const fetchData = async () => {
  try {
    const res = await listApps({
      size: pageSize.value,
      page: currentPage.value,
      name: searchName.value,
    })
    if (res.status !== 200) {
      return Notification.error('服务错误')
    }
    if (res.data?.code !== 0) {
      let msg = '服务错误'
      if (res.data?.message && res.data?.message !== '') {
        msg = res.data?.message
      }
      Notification.warning(msg)
      return
    }
    total.value = res.data?.data?.total
    data.value = res.data?.data?.items
    data.value.forEach((item) => {
      item.disabled = item.poc_count > 0
    })
  } catch (e) {
    void e
    Notification.error('服务错误')
  } finally {
  }
}

const deleteData = async () => {
  deleteLoading.value = true
  try {
    const res = await deleteApp({
      instance_id: selectedKeys.value,
    })
    if (res.status !== 200) {
      Notification.error('服务错误')
      return
    }
    if (res.data?.code !== 0) {
      Notification.error(res.data?.message || '服务错误')
    }
    Notification.success('删除成功')
  } catch (e) {
    void e
    Notification.error('服务错误')
  } finally {
    deleteLoading.value = false
  }
}

function refreshData() {
  loading.value = true
  setTimeout(async () => {
    await fetchData()
    loading.value = false
  }, 300)
}

function handlerSearch() {
  searchLoading.value = true
  setTimeout(() => {
    fetchData()
    searchLoading.value = false
  }, 300)
}

function handlePageChange(page: number) {
  currentPage.value = page
  fetchData()
}

function handlePageSizeChange(size: number) {
  pageSize.value = size
  fetchData()
}

onMounted(() => {
  fetchData()
})

const appDetailClick = (app: string) => {
  if (app && app !== '') {
    router.push(`/wiki/app/detail/${app}`)
  } else {
    Notification.error('应用id为空，查看失败')
  }
}

function appAddClick() {
  addVisible.value = true
}

async function handlerDelete() {
  try {
    await deleteData()
    popoverVisible.value = false
    await fetchData()
    selectedKeys.value = []
  } catch (error) {
    console.error('删除操作出错:', error)
  }
}

function handlerCancelDelete() {
  popoverVisible.value = false
}

function handleAddCancel() {
  addVisible.value = false
}
</script>

<style scoped>
.table {
  margin-top: 10px;
}

.pagination {
  margin-top: 10px;
  display: flex;
  justify-content: flex-end;
}

.table-item {
  display: flex;
  align-items: center;
  justify-content: center;
}

.search {
  margin-top: 10px;
}

.popover-content {
  margin-top: 10px;
}
</style>
