<template>
  <div class="task_list">
    <a-row>
      <a-col :span="12">
        <a-button type="primary" @click="taskAddClick">
          <template #icon>
            <IconPlus />
          </template>
          {{ t('pages.task.addScanTask') }}
        </a-button>
      </a-col>
    </a-row>
    <TaskDashboard ref="dashboardRef" class="dashboard" />
    <div class="search-container">
      <a-row :gutter="[16, 16]">
        <a-col :xs="24" :sm="12" :md="8" :lg="6">
          <a-input :placeholder="t('pages.task.searchName')" allow-clear v-model="searchName" />
        </a-col>
        <a-col :xs="24" :sm="12" :md="8" :lg="6">
          <a-select
            v-model="searchStatus"
            :placeholder="t('pages.task.searchStatus')"
            allow-clear
            multiple
            style="width: 100%"
          >
            <a-option value="ready">{{ t('pages.task.status.ready') }}</a-option>
            <a-option value="get-targets">{{ t('pages.task.status.gettingTargets') }}</a-option>
            <a-option value="get-targets-finish">{{
              t('pages.task.status.targetsRetrieved')
            }}</a-option>
            <a-option value="scanning">{{ t('pages.task.status.scanning') }}</a-option>
            <a-option value="pausing">{{ t('pages.task.status.pausing') }}</a-option>
            <a-option value="paused">{{ t('pages.task.status.paused') }}</a-option>
            <a-option value="finish">{{ t('pages.task.status.finished') }}</a-option>
            <a-option value="error">{{ t('pages.task.status.error') }}</a-option>
          </a-select>
        </a-col>
        <a-col :xs="24" :sm="12" :md="6" :lg="6">
          <a-date-picker
            v-model="searchStartTime"
            :placeholder="t('pages.task.updateTimeGreater')"
            :disabledDate="(current?: Date) => (current ? dayjs(current).isAfter(dayjs()) : false)"
            style="width: 100%"
          />
        </a-col>
        <a-col :xs="24" :sm="12" :md="6" :lg="6">
          <a-date-picker
            v-model="searchEndTime"
            :placeholder="t('pages.task.updateTimeLess')"
            :disabledDate="(current?: Date) => (current ? dayjs(current).isAfter(dayjs()) : false)"
            style="width: 100%"
          />
        </a-col>
        <a-col :xs="24" :sm="24" :md="24" :lg="24" class="action-buttons">
          <a-space>
            <a-button type="primary" @click="handlerSearch" :loading="searchLoading">
              <template #icon>
                <IconSearch />
              </template>
              {{ t('pages.task.search') }}
            </a-button>
            <a-button type="text" @click="refreshData" shape="circle" :loading="loading">
              <template #icon>
                <IconRefresh />
              </template>
            </a-button>
            <a-button
              type="primary"
              @click="handleExportReport"
              :disabled="selectedKeys.length === 0"
            >
              <template #icon>
                <IconExport />
              </template>
              {{ t('pages.task.exportReport') }}
            </a-button>
            <a-popover
              trigger="click"
              :title="t('pages.task.confirmDelete')"
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
                {{ t('pages.task.batchDelete') }}
              </a-button>
              <template #content>
                <a-row :gutter="8" class="popover-content">
                  <a-col :span="12">
                    <a-button @click="handlerCancelDelete">{{ t('pages.task.cancel') }}</a-button>
                  </a-col>
                  <a-col :span="12">
                    <a-button
                      @click="handlerDelete"
                      type="primary"
                      status="danger"
                      :loading="deleteLoading"
                      >{{ t('pages.task.confirm') }}
                    </a-button>
                  </a-col>
                </a-row>
              </template>
            </a-popover>
          </a-space>
        </a-col>
      </a-row>
    </div>
    <div class="table-container">
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
        <template #task_percent="{ record }">
          <a-progress :percent="Number(record.task_percent)" :animation="true" :size="'small'" />
        </template>
        <template #targets="{ record }">
          <div class="target-tags">
            <a-space wrap>
              <a-tag
                v-for="(target, index) in getTargetsArray(record.targets)"
                :key="index"
                size="small"
              >
                {{ target }}
              </a-tag>
            </a-space>
          </div>
        </template>
        <template #status="{ record }">
          <a-tag :color="getStatusColor(record.status)">
            {{ getStatusText(record.status) }}
          </a-tag>
        </template>
        <template #optional="{ record }">
          <div class="table-item">
            <!-- 开始扫描按钮 -->
            <a-button
              v-if="['ready', 'finish', 'error', 'paused'].includes(record.status)"
              type="text"
              shape="circle"
              @click="handleStartScan(record.instance_id)"
            >
              <IconPlayCircle />
            </a-button>

            <!-- 暂停扫描按钮 - 可操作状态 -->
            <a-button
              v-if="['get-targets', 'get-targets-finish', 'scanning'].includes(record.status)"
              type="text"
              shape="circle"
              status="warning"
              @click="handlePauseScan(record.instance_id)"
            >
              <IconPauseCircle />
            </a-button>

            <!-- 暂停中状态显示 - 禁用状态 -->
            <a-tooltip :content="t('pages.task.statusTips.pausing')" position="top">
              <a-button
                v-if="record.status === 'pausing'"
                type="text"
                shape="circle"
                status="normal"
                disabled
              >
                <IconPauseCircle />
              </a-button>
            </a-tooltip>
          </div>
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
  </div>

  <!-- Task Add Drawer -->
  <a-drawer
    v-model:visible="addVisible"
    :title="t('pages.task.addTask')"
    :width="760"
    :footer="false"
    :mask-closable="false"
    :unmount-on-close="true"
    :esc-to-close="false"
  >
    <TaskAddView @submit="handleTaskSubmit" @cancel="handleAddCancel"></TaskAddView>
  </a-drawer>
</template>

<script setup lang="ts">
import {
  IconPlus,
  IconRefresh,
  IconPlayCircle,
  IconPauseCircle,
  IconSearch,
  IconDelete,
  IconExport,
} from '@arco-design/web-vue/es/icon'
import { onMounted, ref, reactive, onUnmounted } from 'vue'
import { Notification, type TableColumnData, type TableRowSelection } from '@arco-design/web-vue'
import { useI18n } from 'vue-i18n'

import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import TaskDashboard from '@/pages/Task/TaskDashboard.vue'
import { listTasks, deleteTasks, startScan, pauseScan, exportTaskReport } from '@/api/task.ts'
import TaskAddView from '@/pages/Task/TaskAddView.vue'

const { t } = useI18n()

dayjs.extend(utc)
const addVisible = ref(false)
const searchLoading = ref(false)
const searchName = ref('')
const searchStatus = ref<string[]>([])
const searchStartTime = ref()
const searchEndTime = ref()
const selectedKeys = ref([])
const popoverVisible = ref(false)
const deleteLoading = ref(false)
const columns = [
  {
    title: t('pages.task.columns.id'),
    dataIndex: 'instance_id',
    ellipsis: true,
    tooltip: true,
    width: 120,
    fixed: 'left',
  },
  {
    title: t('pages.task.columns.taskName'),
    dataIndex: 'name',
    width: 180,
    ellipsis: true,
    tooltip: true,
  },
  {
    title: t('pages.task.columns.targets'),
    dataIndex: 'targets',
    slotName: 'targets',
    width: 160,
    ellipsis: true,
    tooltip: true,
  },
  {
    title: t('pages.task.columns.taskProgress'),
    dataIndex: 'task_percent',
    slotName: 'task_percent',
    width: 200,
  },
  {
    title: t('pages.task.columns.taskStatus'),
    dataIndex: 'status',
    slotName: 'status',
    width: 120,
  },
  {
    title: t('pages.task.columns.updateTime'),
    dataIndex: 'update_time',
    align: 'center',
    width: 160,
  },
  {
    title: t('pages.task.columns.operations'),
    slotName: 'optional',
    width: 100,
    align: 'center',
    fixed: 'right',
  },
] as TableColumnData[]

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

const dashboardRef = ref()

// 定义localStorage键名
const STORAGE_KEY = 'task_list_pagination'

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

// Define the task form data type
interface TaskFormData {
  name: string
  targets: string
  target_file: string
  target_auto_search: string
  is_save_target: boolean
  worker_count: number
  app_id: string
  poc_id: string[]
  proxy: string
  scan_type: string
  scan_config: string
}

// 自动刷新相关变量
const autoRefreshInterval = ref<number | null>(null)
const activeStatusTypes = ['scanning', 'get-targets', 'pausing']

// 检查是否有活动中的任务
const checkActiveTask = (taskList: any[]) => {
  return taskList.some((task) => activeStatusTypes.includes(task.status))
}

// 开始自动刷新
const startAutoRefresh = () => {
  // 如果已经有定时器在运行，先清除
  if (autoRefreshInterval.value) {
    clearInterval(autoRefreshInterval.value)
  }

  // 设置新的定时器，每2秒刷新一次
  autoRefreshInterval.value = window.setInterval(() => {
    fetchData(false) // 不显示加载动画的静默刷新
  }, 1000)
}

// 停止自动刷新
const stopAutoRefresh = () => {
  if (autoRefreshInterval.value) {
    clearInterval(autoRefreshInterval.value)
    autoRefreshInterval.value = null
  }
}

// 组件卸载时清除定时器
onUnmounted(() => {
  stopAutoRefresh()
})

// 修改fetchData函数，增加是否显示加载状态的参数
const fetchData = async (showLoading = true) => {
  if (showLoading) {
    loading.value = true
  }

  try {
    const res = await listTasks({
      size: pageSize.value,
      page: currentPage.value,
      name: searchName.value,
      status: searchStatus.value,
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

    // 判断是否有活动中的任务，决定是否启用自动刷新
    if (checkActiveTask(data.value)) {
      startAutoRefresh()
    } else {
      stopAutoRefresh()
    }

    // 刷新 dashboard 数据
    dashboardRef.value?.refresh()
  } catch (e) {
    console.error(e)
    // Handle error in a generic way without relying on specific error types
    const errorMessage =
      typeof e === 'object' && e !== null && 'message' in e
        ? String(e.message)
        : t('common.serviceError')
    Notification.error(errorMessage)
  } finally {
    if (showLoading) {
      loading.value = false
    }
  }
}

const deleteData = async () => {
  deleteLoading.value = true
  try {
    const res = await deleteTasks(selectedKeys.value)
    if (res.status !== 200) {
      Notification.error(res.data?.message || t('common.serviceError'))
      return
    }
    if (res.data?.code !== 0) {
      Notification.error(res.data?.message || t('common.serviceError'))
      return
    }
    Notification.success(t('pages.task.deleteSuccess'))
  } catch (e) {
    console.error(e)
    // Handle error in a generic way without relying on specific error types
    const errorMessage =
      typeof e === 'object' && e !== null && 'message' in e
        ? String(e.message)
        : t('common.serviceError')
    Notification.error(errorMessage)
  } finally {
    deleteLoading.value = false
  }
}

onMounted(() => {
  // 恢复保存的分页状态
  restorePaginationState()
  fetchData()
})

function refreshData() {
  loading.value = true
  setTimeout(async () => {
    await fetchData()
    dashboardRef.value?.refresh()
    loading.value = false
  }, 300)
}

function handlerSearch() {
  searchLoading.value = true
  setTimeout(async () => {
    try {
      await fetchData()
      dashboardRef.value?.refresh()
    } catch (e) {
      console.error(e)
      // Handle error in a generic way without relying on specific error types
      const errorMessage =
        typeof e === 'object' && e !== null && 'message' in e
          ? String(e.message)
          : t('common.serviceError')
      Notification.error(errorMessage)
    } finally {
      searchLoading.value = false
    }
  }, 300)
}

function handlePageChange(page: number) {
  currentPage.value = page
  // 保存分页状态
  savePaginationState()
  fetchData()
  dashboardRef.value?.refresh()
}

function handlePageSizeChange(size: number) {
  pageSize.value = size
  // 保存分页状态
  savePaginationState()
  fetchData()
  dashboardRef.value?.refresh()
}

function taskAddClick() {
  addVisible.value = true
}

async function handlerDelete() {
  try {
    await deleteData()
    popoverVisible.value = false
    await fetchData()
    dashboardRef.value?.refresh()
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
  fetchData()
  dashboardRef.value?.refresh()
}

function handleTaskSubmit(formData: TaskFormData) {
  // 关闭模态框
  addVisible.value = false
  // 刷新数据列表
  setTimeout(() => {
    fetchData() // 延迟执行，确保后端数据已更新
    dashboardRef.value?.refresh()
  }, 500)
}

const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    ready: t('pages.task.status.ready'),
    'get-targets': t('pages.task.status.gettingTargets'),
    'get-targets-finish': t('pages.task.status.targetsRetrieved'),
    scanning: t('pages.task.status.scanning'),
    pausing: t('pages.task.status.pausing'),
    paused: t('pages.task.status.paused'),
    finish: t('pages.task.status.finished'),
    error: t('pages.task.status.error'),
    unknown: t('pages.task.status.unknown'),
  }
  return statusMap[status] || t('pages.task.status.unknown')
}

const getStatusColor = (status: string) => {
  const colorMap: Record<string, string> = {
    ready: 'blue',
    'get-targets': 'purple',
    'get-targets-finish': 'cyan',
    scanning: 'green',
    pausing: 'orange',
    paused: 'gray',
    finish: 'arcoblue',
    error: 'red',
    unknown: 'gray',
  }
  return colorMap[status] || 'gray'
}

// 处理targets字段，将字符串分割为数组用于显示
const getTargetsArray = (targetsStr: string) => {
  if (!targetsStr) return []

  // 分割字符串，可能是逗号分隔或换行符分隔
  const targets = targetsStr.split(/[,\n]/).filter((t) => t.trim())

  // 限制显示数量，最多显示3个
  return targets.slice(0, 3)
}

// 修改开始扫描处理函数
const handleStartScan = async (instanceId: string) => {
  try {
    const res = await startScan(instanceId)
    if (res.status !== 200) {
      return Notification.error(res.data?.message || t('common.serviceError'))
    }
    if (res.data?.code !== 0) {
      return Notification.error(res.data?.message || t('pages.task.scanStartFailed'))
    }
    // 成功后等待500ms再显示提示
    await new Promise((resolve) => setTimeout(resolve, 500))
    Notification.success(t('pages.task.scanStartSuccess'))
    await fetchData() // 刷新数据
  } catch (e) {
    console.error(e)
    // Handle error in a generic way without relying on specific error types
    const errorMessage =
      typeof e === 'object' && e !== null && 'message' in e
        ? String(e.message)
        : t('common.serviceError')
    Notification.error(errorMessage)
  }
}

// 修改暂停扫描处理函数
const handlePauseScan = async (instanceId: string) => {
  try {
    const res = await pauseScan(instanceId)
    if (res.status !== 200) {
      return Notification.error(res.data?.message || t('common.serviceError'))
    }
    if (res.data?.code !== 0) {
      return Notification.error(res.data?.message || t('pages.task.scanPauseFailed'))
    }
    // 成功后等待500ms再显示提示
    await new Promise((resolve) => setTimeout(resolve, 500))
    Notification.success(t('pages.task.scanPauseSuccess'))
    await fetchData() // 刷新数据
  } catch (e) {
    console.error(e)
    // Handle error in a generic way without relying on specific error types
    const errorMessage =
      typeof e === 'object' && e !== null && 'message' in e
        ? String(e.message)
        : t('common.serviceError')
    Notification.error(errorMessage)
  }
}

// 处理导出报告
const handleExportReport = async () => {
  if (selectedKeys.value.length === 0) {
    return Notification.warning(t('pages.task.noTasksSelected'))
  }

  try {
    const res = await exportTaskReport(selectedKeys.value)
    if (res.status !== 200) {
      return Notification.error(res.data?.message || t('common.serviceError'))
    }
    if (res.data?.code !== 0) {
      return Notification.error(res.data?.message || t('pages.task.exportFailed'))
    }

    Notification.success({
      title: t('pages.task.exportStarted'),
      content: t('pages.task.exportSuccess'),
      duration: 3000,
    })
  } catch (error) {
    console.error(error)
    // Handle error in a generic way without relying on specific error types
    const errorMessage =
      typeof error === 'object' && error !== null && 'message' in error
        ? String(error.message)
        : t('common.serviceError')
    Notification.error(errorMessage)
  }
}
</script>

<style scoped>
.task_list {
  padding: 20px;
}

/* 只保留最基本的margin，不添加其他可能影响子组件的样式 */
.dashboard {
  margin: 20px 0;
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
}

.action-main-buttons {
  display: flex;
  margin-bottom: 16px;
}

.table-container {
  margin-top: 10px;
  width: 100%;
  overflow: hidden;
  background-color: var(--color-bg-2);
  border-radius: 4px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  padding: 16px;
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

.popover-content {
  margin-top: 10px;
}

/* 添加媒体查询，在小屏幕上优化表现 */
@media (max-width: 768px) {
  :deep(.arco-table-tbody > tr > td) {
    padding: 8px 6px;
  }

  :deep(.arco-table-th) {
    padding: 8px 6px;
  }

  .action-buttons {
    justify-content: flex-start;
    margin-top: 8px;
  }
}

/* 让表格内容列均匀分布 */
:deep(.arco-table-container) {
  width: 100%;
}

:deep(.arco-table-layout-fixed) {
  table-layout: fixed;
  width: 100%;
}

/* 解决某些列可能太窄的问题 */
:deep(.arco-table-th),
:deep(.arco-table-td) {
  word-break: break-word;
  white-space: normal;
}

/* 添加操作按钮的间距 */
.table-item .arco-btn {
  margin: 0 4px;
}

/* 添加禁用状态按钮的样式 */
.table-item .arco-btn[disabled] {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 添加禁用按钮的样式 */
.disabled-button {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 目标标签样式 */
.target-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.target-tags :deep(.arco-tag) {
  margin-right: 0;
  max-width: 140px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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
