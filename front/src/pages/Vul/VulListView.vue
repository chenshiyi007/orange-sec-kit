<template>
  <div class="notes">
    <div class="metrics-section">
      <a-row :gutter="20" class="mb-20">
        <a-col :span="6">
          <a-card hoverable class="metric-card vul-count-card">
            <div class="card-header">
              <icon-bug class="metric-icon" />
              <span class="card-title">{{ t('pages.vul.vulCount') }}</span>
            </div>
            <div class="metric-value">{{ total }}</div>
            <a-statistic
              :value="total"
              :value-from="0"
              :start="true"
              :animation-duration="1000"
              animation
              :value-style="{ display: 'none' }"
            >
              <template #suffix>
                <icon-arrow-rise style="color: #ff7d00; margin-left: 4px" />
              </template>
            </a-statistic>
          </a-card>
        </a-col>
      </a-row>
    </div>
    <div class="search-container">
      <a-row :gutter="[16, 16]">
        <a-col :xs="24" :sm="12" :md="6" :lg="6">
          <a-input v-model="searchPocId" :placeholder="t('pages.vul.searchPocId')" allow-clear />
        </a-col>
        <a-col :xs="24" :sm="12" :md="6" :lg="6">
          <a-input v-model="searchTaskId" :placeholder="t('pages.vul.searchTaskId')" allow-clear />
        </a-col>
        <a-col :xs="24" :sm="12" :md="6" :lg="6">
          <a-input
            v-model="searchCompany"
            :placeholder="t('pages.vul.searchCompany')"
            allow-clear
          />
        </a-col>
        <a-col :xs="24" :sm="12" :md="6" :lg="6">
          <a-input v-model="searchHost" :placeholder="t('pages.vul.searchHost')" allow-clear />
        </a-col>
      </a-row>
      <a-row :gutter="[16, 16]" style="margin-top: 16px">
        <a-col :xs="24" :sm="12" :md="6" :lg="6">
          <a-date-picker
            v-model="searchStartTime"
            :placeholder="t('pages.vul.updateTimeGreater')"
            :disabledDate="(current?: Date) => (current ? dayjs(current).isAfter(dayjs()) : false)"
            style="width: 100%"
          />
        </a-col>
        <a-col :xs="24" :sm="12" :md="6" :lg="6">
          <a-date-picker
            v-model="searchEndTime"
            :placeholder="t('pages.vul.updateTimeLess')"
            :disabledDate="(current?: Date) => (current ? dayjs(current).isAfter(dayjs()) : false)"
            style="width: 100%"
          />
        </a-col>
        <a-col :xs="24" :sm="24" :md="12" :lg="12" class="action-buttons">
          <a-space>
            <a-button type="primary" @click="handlerSearch" :loading="searchLoading">
              <template #icon>
                <IconSearch />
              </template>
              {{ t('pages.vul.search') }}
            </a-button>
            <a-button type="text" @click="refreshData" shape="circle" :loading="loading">
              <template #icon>
                <IconRefresh />
              </template>
            </a-button>
            <a-popover
              trigger="click"
              :title="t('pages.vul.confirmDelete')"
              position="bottom"
              v-model:popup-visible="popoverVisible"
            >
              <a-button
                type="primary"
                status="danger"
                :disabled="selectedKeys.length === 0"
                :class="{ 'disabled-button': selectedKeys.length === 0 }"
              >
                <template #icon>
                  <IconDelete />
                </template>
                {{ t('pages.vul.batchDelete') }}
              </a-button>
              <template #content>
                <a-row :gutter="8" class="popover-content">
                  <a-col :span="12">
                    <a-button @click="handlerCancelDelete">{{ t('pages.vul.cancel') }}</a-button>
                  </a-col>
                  <a-col :span="12">
                    <a-button
                      @click="handlerDelete"
                      type="primary"
                      status="danger"
                      :loading="deleteLoading"
                      >{{ t('pages.vul.confirm') }}
                    </a-button>
                  </a-col>
                </a-row>
              </template>
            </a-popover>
          </a-space>
        </a-col>
      </a-row>
    </div>
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
        :scroll="{ x: '100%', y: '100%' }"
      >
        <template #optional="{ record }">
          <div class="table-item">
            <a-button type="text" shape="circle" @click="vulDetailClick(record?.instance_id || '')">
              <IconEye />
            </a-button>
            <a-tooltip :content="t('pages.vul.retest')" position="top" mini>
              <a-button
                type="text"
                shape="circle"
                @click="openRetestDrawer(record)"
                status="success"
              >
                <IconRefresh />
              </a-button>
            </a-tooltip>
          </div>
        </template>
        <template #poc_name="{ record }">
          <a-link
            @click="pocDetailClick(record?.poc_id || '')"
            :hoverable="true"
            v-text="sanitizeText(record.poc_name)"
          >
          </a-link>
        </template>
      </a-table>
      <a-row :gutter="8" style="margin-top: 8px">
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
    <a-drawer
      v-model:visible="retestDrawerVisible"
      :width="800"
      :title="t('pages.vul.retest')"
      @cancel="closeRetestDrawer"
      unmountOnClose
    >
      <PocChecker
        :poc_instance_id="currentPocId"
        :initial-target="currentTarget"
        :task-id="currentTaskId"
      />
      <template #footer>
        <a-button @click="closeRetestDrawer">{{ t('common.cancel') }}</a-button>
      </template>
    </a-drawer>
  </div>
</template>

<script setup lang="ts">
import {
  IconArrowRise,
  IconPlus,
  IconRefresh,
  IconEye,
  IconSearch,
  IconDelete,
  IconBug,
} from '@arco-design/web-vue/es/icon'
import { onMounted, ref, reactive } from 'vue'
import { Notification, type TableColumnData, type TableRowSelection } from '@arco-design/web-vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { listVuls, deleteVuls } from '@/api/vul.ts'
import PocChecker from '@/components/PocChecker.vue'

const { t } = useI18n()

dayjs.extend(utc)
const searchLoading = ref(false)
const searchPocId = ref('')
const searchTaskId = ref('')
const searchCompany = ref('')
const searchHost = ref('')
const searchStartTime = ref()
const searchEndTime = ref()
const selectedKeys = ref([])
const popoverVisible = ref(false)
const deleteLoading = ref(false)
const columns = [
  {
    title: t('pages.vul.columns.id'),
    dataIndex: 'instance_id',
    ellipsis: true,
    tooltip: true,
    width: 110,
    fixed: 'left',
  },
  {
    title: t('pages.vul.columns.vulName'),
    dataIndex: 'name',
    width: 160,
    ellipsis: true,
    tooltip: true,
  },
  {
    title: t('pages.vul.columns.vendor'),
    dataIndex: 'company',
    width: 120,
    ellipsis: true,
    tooltip: true,
  },
  {
    title: t('pages.vul.columns.vulUrl'),
    dataIndex: 'vul_url',
    ellipsis: true,
    tooltip: true,
    width: 240,
    cellStyle: { wordBreak: 'break-all' },
  },
  {
    title: t('pages.vul.columns.taskName'),
    dataIndex: 'task_name',
    width: 150,
    ellipsis: true,
    tooltip: true,
  },
  {
    title: t('pages.vul.columns.pocName'),
    dataIndex: 'poc_name',
    slotName: 'poc_name',
    width: 150,
    ellipsis: true,
    tooltip: true,
  },
  {
    title: t('pages.vul.columns.updateTime'),
    dataIndex: 'update_time',
    align: 'center',
    width: 150,
  },
  {
    title: t('pages.vul.columns.operations'),
    slotName: 'optional',
    width: 90,
    align: 'center',
    fixed: 'right',
  },
] as TableColumnData[]
const router = useRouter()
const data = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const loading = ref(false)

const rowSelection = reactive({
  type: 'checkbox',
  showCheckedAll: true,
  onlyCurrent: false,
}) as TableRowSelection

// 定义localStorage键名
const STORAGE_KEY = 'vul_list_pagination'

// 保存分页状态
const savePaginationState = () => {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      currentPage: currentPage.value,
      pageSize: pageSize.value,
    }),
  )
}

// 恢复分页状态
const restorePaginationState = () => {
  const savedState = localStorage.getItem(STORAGE_KEY)
  if (savedState) {
    try {
      const { currentPage: savedPage, pageSize: savedSize } = JSON.parse(savedState)
      currentPage.value = savedPage
      pageSize.value = savedSize
    } catch (e) {
      console.error('Failed to parse saved pagination state', e)
    }
  }
}

const fetchData = async () => {
  try {
    const res = await listVuls({
      size: pageSize.value,
      page: currentPage.value,
      poc_id: searchPocId.value,
      task_id: searchTaskId.value,
      company: searchCompany.value,
      host: searchHost.value,
      start_time: searchStartTime.value ? dayjs.utc(searchStartTime.value).valueOf() : -1,
      end_time: searchEndTime.value
        ? dayjs.utc(searchEndTime.value).valueOf()
        : dayjs.utc(Date.now()).valueOf(),
    })
    if (res.status !== 200) {
      return Notification.error(t('common.serviceError'))
    }
    if (res.data?.code !== 0) {
      let msg = t('common.serviceError')
      if (res.data?.message && res.data?.message !== '') {
        msg = res.data?.message
      }
      Notification.warning(msg)
      return
    }
    total.value = res.data?.data?.total
    data.value = res.data?.data?.items
  } catch (e) {
    void e
    Notification.error(t('common.serviceError'))
  } finally {
    loading.value = false
  }
}

const deleteData = async () => {
  deleteLoading.value = true
  try {
    const res = await deleteVuls({
      instance_id: selectedKeys.value,
    })
    if (res.status !== 200) {
      Notification.error(t('common.serviceError'))
      return
    }
    if (res.data?.code !== 0) {
      Notification.error(res.data?.message || t('common.serviceError'))
    }
    Notification.success(t('pages.vul.deleteSuccess'))
  } catch (e) {
    void e
    Notification.error(t('common.serviceError'))
  } finally {
    deleteLoading.value = false
  }
}

onMounted(() => {
  // 恢复保存的分页状态
  restorePaginationState()
  fetchData()
})

function handleReset() {
  // Reset all search fields
  searchPocId.value = ''
  searchTaskId.value = ''
  searchCompany.value = ''
  searchHost.value = ''
  searchStartTime.value = undefined
  searchEndTime.value = undefined

  // Reset page to 1 and perform search
  currentPage.value = 1
  handlerSearch()
}

const refreshData = () => {
  loading.value = true
  fetchData()
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
  savePaginationState()
  fetchData()
}

function handlePageSizeChange(size: number) {
  pageSize.value = size
  savePaginationState()
  fetchData()
}

const vulDetailClick = (vulId: string) => {
  // 先保存分页状态，再跳转
  savePaginationState()
  if (vulId && vulId !== '') {
    router.push(`/vuls/detail/${vulId}`)
  }
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

const pocDetailClick = (pocId: string) => {
  // 先保存分页状态，再跳转
  savePaginationState()
  if (pocId && pocId !== '') {
    router.push(`/wiki/poc/detail/${pocId}`)
  }
}

const retestDrawerVisible = ref(false)
const currentPocId = ref('')
const currentTarget = ref('')
const currentTaskId = ref('')

function openRetestDrawer(record: any) {
  currentPocId.value = record.poc_id
  currentTarget.value = record.vul_url
  currentTaskId.value = record.task_id
  retestDrawerVisible.value = true
}

function closeRetestDrawer() {
  retestDrawerVisible.value = false
}

// Function to sanitize text to prevent HTML injection
const sanitizeText = (text: string): string => {
  if (!text) return ''
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}
</script>

<style scoped>
/* Metrics Section */
.metrics-section {
  margin-bottom: 24px;
}

.mb-20 {
  margin-bottom: 20px;
}

.metric-card {
  height: 140px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
}

.metric-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.metric-icon {
  font-size: 22px;
  color: #ff7d00;
}

.card-title {
  font-weight: 600;
  font-size: 16px;
}

.metric-value {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 12px;
  background: linear-gradient(90deg, #ff7d00 0%, #ff2d1f 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-align: center;
  width: 100%;
}

.vul-count-card .metric-icon {
  color: #ff7d00;
}

.notes {
  width: 100%;
  overflow-x: hidden; /* 防止外层水平滚动 */
}

.table {
  margin-top: 10px;
  width: 100%;
  background-color: var(--color-bg-2);
  border-radius: 4px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  padding: 16px;
  overflow-x: hidden; /* 防止表格容器出现滚动条 */
}

/* Table specific styles - ensuring proper table display without scrollbars */
:deep(.arco-table) {
  width: 100% !important;
  overflow-x: auto !important; /* 让表格内部滚动 */
}

:deep(.arco-table-body) {
  overflow-x: auto !important; /* 表格内容可以滚动 */
  width: 100% !important;
}

:deep(.arco-table-container) {
  width: 100%;
  overflow-x: hidden; /* 防止容器出现滚动条 */
}

:deep(.arco-table-element) {
  overflow-x: auto !important; /* 确保表格元素内可以滚动 */
}

:deep(.arco-table-layout-fixed) {
  table-layout: fixed;
  width: 100%;
}

:deep(.arco-table-th),
:deep(.arco-table-td) {
  word-break: break-word;
  white-space: normal;
}

/* 固定列样式优化 */
:deep(.arco-table-col-fixed-left),
:deep(.arco-table-col-fixed-right) {
  z-index: 2;
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

.search-container {
  margin: 16px 0;
  padding: 16px;
  background-color: var(--color-bg-2);
  border-radius: 4px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.action-buttons {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-left: 12px;
}

.action-buttons :deep(.arco-btn) {
  margin-top: 0;
}

.action-buttons .arco-space {
  flex-wrap: nowrap;
  display: flex;
  justify-content: flex-end;
}

.popover-content {
  margin-top: 10px;
}

/* 添加媒体查询，在小屏幕上优化表现 */
@media (max-width: 768px) {
  .action-buttons {
    justify-content: flex-start;
    margin-top: 8px;
    height: auto;
  }

  :deep(.arco-table-tbody > tr > td) {
    padding: 8px 6px;
  }

  :deep(.arco-table-th) {
    padding: 8px 6px;
  }
}

/* 添加禁用按钮的样式 */
.disabled-button {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 调整操作按钮的间距 */
.action-buttons .arco-space {
  display: flex;
  align-items: center;
}

.action-buttons .arco-space-item {
  margin-right: 8px;
}

.action-buttons .arco-space-item:last-child {
  margin-right: 0;
}
</style>
