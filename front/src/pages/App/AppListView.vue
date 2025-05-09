<template>
  <div class="notes">
    <div class="metrics-section">
      <a-row :gutter="20" class="mb-20">
        <a-col :span="6">
          <a-card hoverable class="metric-card app-count-card">
            <div class="card-header">
              <icon-apps class="metric-icon" />
              <span class="card-title">{{ t('pages.app.list.appCount') }}</span>
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
        <a-col :span="18" class="metrics-action-buttons">
          <a-space>
            <a-button type="primary" @click="appAddClick">
              <template #icon>
                <IconPlus />
              </template>
              {{ t('pages.app.list.addApp') }}
            </a-button>
            <a-button type="text" @click="handleImportClick">
              <template #icon>
                <IconImport />
              </template>
              {{ t('pages.app.list.import') }}
            </a-button>
            <a-button type="text" @click="handleExportClick">
              <template #icon>
                <IconExport />
              </template>
              {{ t('pages.app.list.export') }}
            </a-button>
          </a-space>
        </a-col>
      </a-row>
    </div>
    <div class="search-container">
      <a-row :gutter="[16, 16]">
        <a-col :xs="24" :sm="12" :md="6" :lg="6">
          <a-input v-model="searchName" :placeholder="t('pages.app.list.searchName')" allow-clear />
        </a-col>
        <a-col :xs="24" :sm="12" :md="6" :lg="6">
          <a-input
            v-model="searchVersion"
            :placeholder="t('pages.app.list.searchVersion')"
            allow-clear
          />
        </a-col>
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
      </a-row>
      <a-row :gutter="[16, 16]" style="margin-top: 16px">
        <a-col :xs="24" :sm="24" :md="24" :lg="24" class="action-buttons">
          <a-space>
            <a-button type="primary" @click="handlerSearch" :loading="searchLoading">
              <template #icon>
                <IconSearch />
              </template>
              {{ t('pages.app.list.search') }}
            </a-button>
            <a-button type="outline" @click="handleReset">
              {{ t('common.cancel') }}
            </a-button>
            <a-button
              type="text"
              @click="refreshData"
              shape="circle"
              :loading="loading"
              :title="t('pages.app.list.refresh')"
            >
              <template #icon>
                <IconRefresh />
              </template>
            </a-button>
            <a-button
              type="primary"
              status="danger"
              :disabled="selectedKeys.length === 0"
              :class="{ 'disabled-button': selectedKeys.length === 0 }"
              @click="popoverVisible = true"
            >
              <template #icon>
                <IconDelete />
              </template>
              {{ t('pages.app.list.batchDelete') }}
            </a-button>
            <a-modal
              :visible="popoverVisible"
              :title="t('pages.app.list.confirmDelete')"
              @cancel="handlerCancelDelete"
              simple
              unmount-on-close
            >
              <template #footer>
                <a-space>
                  <a-button @click="handlerCancelDelete">{{ t('pages.app.list.cancel') }}</a-button>
                  <a-button
                    type="primary"
                    status="danger"
                    @click="handlerDelete"
                    :loading="deleteLoading"
                  >
                    {{ t('pages.app.list.confirm') }}
                  </a-button>
                </a-space>
              </template>
              {{ t('pages.app.list.confirmDeleteMessage') }}
            </a-modal>
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

  <!-- Import Modal -->
  <a-modal
    :visible="importVisible"
    @cancel="handleImportCancel"
    :title="t('pages.app.list.importTitle')"
    :unmount-on-close="true"
    :mask-closable="false"
    :width="600"
  >
    <div class="import-container">
      <a-tabs v-model:active-key="importActiveTab">
        <!-- Auto Sync Tab -->
        <a-tab-pane key="autoSync" :title="t('pages.app.list.importAutoSync')">
          <div class="tab-content">
            <a-form :model="importFormData" layout="vertical">
              <a-form-item :label="t('pages.app.list.importSyncSource')">
                <a-radio-group v-model="syncSource">
                  <a-radio value="gitee">{{ t('pages.app.list.gitee') }}</a-radio>
                  <a-radio value="github">{{ t('pages.app.list.github') }}</a-radio>
                </a-radio-group>
              </a-form-item>
              <div class="sync-description">
                <a-alert type="info">
                  {{ t('pages.app.list.autoSyncDescription') }}
                </a-alert>
              </div>

              <!-- 添加重复导入处理选项 -->
              <a-form-item
                :label="t('pages.app.list.importDuplicateHandle')"
                class="duplicate-handle-item"
              >
                <a-space>
                  <a-switch v-model="importFormData.is_upset" />
                  <span>{{
                    importFormData.is_upset
                      ? t('pages.app.list.importUpdate')
                      : t('pages.app.list.importSkip')
                  }}</span>
                </a-space>
              </a-form-item>
            </a-form>
          </div>
        </a-tab-pane>

        <!-- From Folder Tab -->
        <a-tab-pane key="fromFolder" :title="t('pages.app.list.importFromFolder')">
          <div class="tab-content">
            <p class="import-description">{{ t('pages.app.list.importFolderDescription') }}</p>
            <FolderSelector
              :placeholder="t('pages.app.list.selectFolderPlaceholder')"
              v-model:folderPath="importFormData.folderPath"
            />

            <!-- 添加重复导入处理选项 -->
            <a-form :model="importFormData" layout="vertical" class="mt-20">
              <a-form-item
                :label="t('pages.app.list.importDuplicateHandle')"
                class="duplicate-handle-item"
              >
                <a-space>
                  <a-switch v-model="importFormData.is_upset" />
                  <span>{{
                    importFormData.is_upset
                      ? t('pages.app.list.importUpdate')
                      : t('pages.app.list.importSkip')
                  }}</span>
                </a-space>
              </a-form-item>
            </a-form>
          </div>
        </a-tab-pane>

        <!-- From File Tab -->
        <a-tab-pane key="fromFile" :title="t('pages.app.list.importFromFile')">
          <div class="tab-content">
            <p class="import-description">{{ t('pages.app.list.importFileDescription') }}</p>
            <FileSelector
              :placeholder="t('pages.app.list.selectFilePlaceholder')"
              file-type="oapp"
              v-model:filePath="importFormData.filePath"
            />

            <!-- 添加重复导入处理选项 -->
            <a-form :model="importFormData" layout="vertical" class="mt-20">
              <a-form-item
                :label="t('pages.app.list.importDuplicateHandle')"
                class="duplicate-handle-item"
              >
                <a-space>
                  <a-switch v-model="importFormData.is_upset" />
                  <span>{{
                    importFormData.is_upset
                      ? t('pages.app.list.importUpdate')
                      : t('pages.app.list.importSkip')
                  }}</span>
                </a-space>
              </a-form-item>
            </a-form>
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>

    <template #footer>
      <a-space>
        <a-button @click="handleImportCancel">{{ t('common.cancel') }}</a-button>
        <a-button type="primary" @click="handleImport" :loading="importLoading">
          {{ t('pages.app.list.startImport') }}
        </a-button>
      </a-space>
    </template>
  </a-modal>

  <!-- Export Modal -->
  <a-modal
    :visible="exportVisible"
    @cancel="handleExportCancel"
    :title="t('pages.app.list.exportTitle')"
    :unmount-on-close="true"
    :mask-closable="false"
    :width="600"
  >
    <div class="export-container">
      <a-form :model="{ exportAll }" layout="vertical">
        <a-form-item :label="t('pages.app.list.exportAll')">
          <a-switch v-model="exportAll" />
        </a-form-item>

        <div v-if="!exportAll" class="app-selection-section">
          <a-form-item :label="t('pages.app.list.selectAppsToExport')">
            <a-select
              v-model="selectedApps"
              :options="appList.map((app) => ({ label: app.name, value: app.instance_id }))"
              :placeholder="t('pages.app.list.selectAppsPlaceholder')"
              multiple
              allow-clear
              show-search
              filter-option
              @focus="handleAppFocus"
              @search="handleAppSearch"
              class="app-select"
            />
          </a-form-item>
        </div>
      </a-form>
    </div>

    <template #footer>
      <a-space>
        <a-button @click="handleExportCancel">{{ t('common.cancel') }}</a-button>
        <a-button type="primary" @click="handleExport" :loading="exportLoading">
          {{ t('pages.app.list.startExport') }}
        </a-button>
      </a-space>
    </template>
  </a-modal>
</template>

<script setup lang="ts">
import {
  IconArrowRise,
  IconPlus,
  IconRefresh,
  IconEye,
  IconSearch,
  IconDelete,
  IconApps,
  IconImport,
  IconExport,
} from '@arco-design/web-vue/es/icon'
import { onMounted, ref, reactive, watch, onUnmounted } from 'vue'
import { Notification, type TableColumnData, type TableRowSelection } from '@arco-design/web-vue'
import { listApps } from '@/api/app.ts'
import AppAddView from '@/pages/App/AppAddView.vue'
import { useRouter } from 'vue-router'
import { deleteApp, exportApp, importApp } from '@/api/app.ts'
import * as Payloads from '@/interface/app.ts'
import { useI18n } from 'vue-i18n'
import FolderSelector from '@/components/FolderSelector.vue'
import FileSelector from '@/components/FileSelector.vue'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

const { t } = useI18n()
dayjs.extend(utc)
const router = useRouter()
const searchLoading = ref(false)
const searchName = ref('')
const searchVersion = ref('')
const searchStartTime = ref()
const searchEndTime = ref()
const selectedKeys = ref([])
const popoverVisible = ref(false)
const deleteLoading = ref(false)

// Import modal related states
const importVisible = ref(false)
const importActiveTab = ref('autoSync')
const syncSource = ref('gitee') // gitee or github
const importLoading = ref(false)
const importFormData = reactive({
  syncSource: 'gitee',
  is_upset: true, // 默认设置为更新
  importMethod: 'autoSync', // 默认导入方法
  source: 'gitee', // 自动同步的源
  folderPath: '', // 文件夹路径
  filePath: '', // 文件路径
})

// Watch importActiveTab to update importMethod
watch(importActiveTab, (newValue) => {
  importFormData.importMethod = newValue
})

// Watch syncSource to update source in importFormData
watch(syncSource, (newValue) => {
  importFormData.syncSource = newValue
  importFormData.source = newValue
})

// Export modal related states
const exportVisible = ref(false)
const exportAll = ref(false)
const exportLoading = ref(false)
const appList = ref<any[]>([])
const selectedApps = ref<string[]>([])

// 将column配置改为计算属性以支持多语言
const columns = [
  {
    title: t('pages.app.list.columns.id'),
    dataIndex: 'instance_id',
    ellipsis: true,
    tooltip: true,
    width: 120,
    fixed: 'left',
  },
  {
    title: t('pages.app.list.columns.appName'),
    dataIndex: 'name',
    width: 180,
    ellipsis: true,
    tooltip: true,
  },
  {
    title: t('pages.app.list.columns.version'),
    dataIndex: 'version',
    width: 120,
    ellipsis: true,
    tooltip: true,
  },
  {
    title: t('pages.app.list.columns.pocCount'),
    dataIndex: 'poc_count',
    width: 100,
    slotName: 'pocCount',
    align: 'center',
  },
  {
    title: t('pages.app.list.columns.fofaFingerprint'),
    dataIndex: 'fofa_finger',
    width: 180,
    slotName: 'fofa',
    ellipsis: true,
    tooltip: true,
    minWidth: 150,
  },
  {
    title: t('pages.app.list.columns.hunterFingerprint'),
    dataIndex: 'hunter_finger',
    slotName: 'hunter',
    width: 180,
    ellipsis: true,
    tooltip: true,
    minWidth: 150,
  },
  {
    title: t('pages.app.list.columns.updateTime'),
    dataIndex: 'update_time',
    align: 'center',
    width: 160,
  },
  {
    title: t('pages.app.list.columns.operations'),
    slotName: 'optional',
    width: 100,
    align: 'center',
    fixed: 'right',
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

// 定义localStorage键名
const STORAGE_KEY = 'app_list_pagination'

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
    const res = await listApps({
      size: pageSize.value,
      page: currentPage.value,
      name: searchName.value,
      version: searchVersion.value,
      start_time: searchStartTime.value ? dayjs.utc(searchStartTime.value).valueOf() : undefined,
      end_time: searchEndTime.value ? dayjs.utc(searchEndTime.value).valueOf() : undefined,
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
    data.value.forEach((item) => {
      item.disabled = item.poc_count > 0
    })
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
    const res = await deleteApp({
      instance_id: selectedKeys.value,
    })
    if (res.status !== 200) {
      Notification.error(t('common.serviceError'))
      return
    }
    if (res.data?.code !== 0) {
      Notification.error(res.data?.message || t('common.serviceError'))
    }
    Notification.success(t('pages.app.list.deleteSuccess'))
  } catch (e) {
    void e
    Notification.error(t('common.serviceError'))
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

function handleReset() {
  // 重置所有搜索字段
  searchName.value = ''
  searchVersion.value = ''
  searchStartTime.value = undefined
  searchEndTime.value = undefined

  // 重置页码并执行搜索
  currentPage.value = 1
  handlerSearch()
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

onMounted(() => {
  // 恢复保存的分页状态
  restorePaginationState()
  fetchData()
})

const appDetailClick = (app: string) => {
  // 在查看详情前保存分页状态，确保返回时能还原
  savePaginationState()
  if (app && app !== '') {
    router.push(`/wiki/app/detail/${app}`)
  } else {
    Notification.error(t('pages.app.list.emptyAppIdError'))
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

// Import related functions
function handleImportClick() {
  importVisible.value = true
}

function handleImportCancel() {
  importVisible.value = false
}

const handleImport = async () => {
  importLoading.value = true

  // 创建通用参数对象，符合AppImportPayload接口
  const importParams: Payloads.AppImportPayload = {
    is_upset: importFormData.is_upset,
  }

  // 根据不同导入方式添加参数
  if (importFormData.importMethod === 'autoSync') {
    importParams.sync = importFormData.source
  } else if (importFormData.importMethod === 'fromFolder') {
    importParams.file_path = importFormData.folderPath
  } else if (importFormData.importMethod === 'fromFile') {
    importParams.file_path = importFormData.filePath
  }

  try {
    const res = await importApp(importParams)

    if (res.status !== 200) {
      Notification.error(t('common.serviceError'))
      return
    }

    if (res.data?.code !== 0) {
      Notification.error(res.data?.message || t('common.serviceError'))
      return
    }

    Notification.success(t('pages.app.list.importSuccess'))

    // 如果是文件或文件夹导入，等待1秒后再次刷新数据
    if (
      importFormData.importMethod === 'fromFolder' ||
      importFormData.importMethod === 'fromFile'
    ) {
      fetchData() // 立即刷新一次
      setTimeout(() => {
        fetchData() // 1秒后再次刷新
      }, 1000)
    } else {
      fetchData() // 其他导入方式只刷新一次
    }
  } catch (error) {
    console.error('Import error:', error)
    Notification.error(t('common.serviceError'))
  } finally {
    importLoading.value = false
    importVisible.value = false
  }
}

// Export related functions
function handleExportClick() {
  // 打开导出对话框时加载应用列表
  getAppList()
  exportVisible.value = true
}

function handleExportCancel() {
  exportVisible.value = false
  // Reset selection when closing
  selectedApps.value = []
}

// 获取应用列表
async function getAppList(keyword = '') {
  try {
    const res = await listApps({
      size: 100,
      page: 1,
      name: keyword,
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
    appList.value = res.data?.data?.items || []
  } catch (e) {
    void e
    Notification.error(t('common.serviceError'))
  }
}

// 处理应用搜索
function handleAppSearch(keyword: string) {
  getAppList(keyword)
}

// 处理应用列表聚焦
function handleAppFocus() {
  if (appList.value.length === 0) {
    getAppList()
  }
}

function handleExport() {
  exportLoading.value = true

  // Prepare the instance_id parameter - use ["all"] for all apps or the selected app ids
  const instance_id = exportAll.value ? ['all'] : selectedApps.value

  if (!exportAll.value && instance_id.length === 0) {
    Notification.warning(t('pages.app.list.noAppsSelected'))
    exportLoading.value = false
    return
  }

  exportApp({ instance_id })
    .then((res) => {
      if (res.status !== 200) {
        Notification.error(t('common.serviceError'))
        return
      }

      if (res.data?.code !== 0) {
        Notification.error(res.data?.message || t('pages.app.list.exportFailed'))
        return
      }

      // Just log the data and show success notification
      if (res.data?.data) {
        Notification.success(t('pages.app.list.exportSuccess'))
      }
    })
    .catch((error) => {
      console.error('Export error:', error)
      Notification.error(t('pages.app.list.exportFailed'))
    })
    .finally(() => {
      exportLoading.value = false
      exportVisible.value = false
    })
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

.metrics-action-buttons {
  display: flex;
  justify-content: flex-end;
  align-items: center;
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

.app-count-card .metric-icon {
  color: #ff7d00;
}

.table {
  margin-top: 10px;
  width: 100%;
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
}

.popover-content {
  margin-top: 10px;
}

@media (max-width: 768px) {
  .action-buttons {
    justify-content: flex-start;
    margin-top: 8px;
  }

  :deep(.arco-table-tbody > tr > td) {
    padding: 8px 6px;
  }

  :deep(.arco-table-th) {
    padding: 8px 6px;
  }
}

:deep(.arco-table-container) {
  width: 100%;
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

/* Import Modal Styles */
.import-container {
  padding: 10px 0;
}

.tab-content {
  padding: 16px;
  min-height: 250px;
}

.import-description {
  margin-bottom: 20px;
  color: var(--color-text-3);
  font-size: 14px;
}

.sync-description {
  margin-top: 20px;
}

.duplicate-handle-item {
  margin-top: 20px;
}

.import-option-tip {
  margin-top: 8px;
  color: var(--color-text-3);
  font-size: 12px;
  line-height: 1.5;
}

.mt-20 {
  margin-top: 20px;
}

/* Export Modal Styles */
.export-container {
  padding: 10px 0;
}

.app-selection-section {
  margin-top: 16px;
}

.app-select {
  width: 100%;
}
</style>
