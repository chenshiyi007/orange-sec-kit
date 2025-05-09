<template>
  <div class="notes">
    <div class="metrics-section">
      <a-row :gutter="20" class="mb-20">
        <a-col :span="6">
          <a-card hoverable class="metric-card poc-count-card">
            <div class="card-header">
              <icon-fire class="metric-icon" />
              <span class="card-title">{{ t('pages.poc.pocCount') }}</span>
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
        <a-col :xs="24" :sm="12" :md="8" :lg="6">
          <a-input v-model="searchName" :placeholder="t('pages.poc.searchName')" allow-clear />
        </a-col>
        <a-col :xs="24" :sm="12" :md="8" :lg="6">
          <a-select
            v-model="searchVulType"
            :placeholder="t('pages.poc.searchVulType')"
            allow-clear
            multiple
            style="width: 100%"
          >
            <a-option v-for="type in VulTypes" :key="type.key" :value="type.key">
              {{ type.label }}
            </a-option>
          </a-select>
        </a-col>
        <a-col :xs="24" :sm="12" :md="8" :lg="6">
          <a-select
            v-model="searchVulLevel"
            :placeholder="t('pages.poc.searchVulLevel')"
            allow-clear
            multiple
            style="width: 100%"
          >
            <a-option v-for="level in VulLevel" :key="level.key" :value="level.key">
              <a-tag :color="level.color" size="small" style="margin-right: 4px">{{
                level.label
              }}</a-tag>
            </a-option>
          </a-select>
        </a-col>
        <a-col :xs="24" :sm="12" :md="8" :lg="6">
          <a-input v-model="searchParam" :placeholder="t('pages.poc.searchParam')" allow-clear />
        </a-col>
        <a-col :xs="24" :sm="12" :md="6" :lg="6">
          <a-date-picker
            v-model="searchStartTime"
            :placeholder="t('pages.poc.updateTimeGreater')"
            :disabledDate="(current?: Date) => (current ? dayjs(current).isAfter(dayjs()) : false)"
            style="width: 100%"
          />
        </a-col>
        <a-col :xs="24" :sm="12" :md="6" :lg="6">
          <a-date-picker
            v-model="searchEndTime"
            :placeholder="t('pages.poc.updateTimeLess')"
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
              {{ t('pages.poc.search') }}
            </a-button>
            <a-button type="text" @click="refreshData" shape="circle" :loading="loading">
              <template #icon>
                <IconRefresh />
              </template>
            </a-button>
            <a-button v-if="isShowAdd" type="primary" @click="pocAddClick">
              <template #icon>
                <IconPlus />
              </template>
              {{ t('pages.poc.addPoc') }}
            </a-button>
            <a-popover
              trigger="click"
              :title="t('pages.poc.confirmDelete')"
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
                {{ t('pages.poc.batchDelete') }}
              </a-button>
              <template #content>
                <a-row :gutter="8" class="popover-content">
                  <a-col :span="12">
                    <a-button @click="handlerCancelDelete">{{ t('pages.poc.cancel') }}</a-button>
                  </a-col>
                  <a-col :span="12">
                    <a-button
                      @click="handlerDelete"
                      type="primary"
                      status="danger"
                      :loading="deleteLoading"
                      >{{ t('pages.poc.confirm') }}
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
      >
        <template #optional="{ record }">
          <div class="table-item">
            <a-button type="text" shape="circle" @click="pocDetailClick(record?.instance_id || '')">
              <IconEye />
            </a-button>
            <a-tooltip :content="t('pages.poc.quickTest')" position="top" mini>
              <a-button type="text" shape="circle" status="danger" @click="openPocChecker(record)">
                <IconBug />
              </a-button>
            </a-tooltip>
          </div>
        </template>
        <template #level="{ record }">
          <a-tag :color="getColor(record.level)"> {{ getLevel(record.level) }}</a-tag>
        </template>
        <template #vul_type="{ record }">
          {{ getVulType(record.vul_type) }}
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

    <!-- POC Checker Drawer -->
    <a-drawer
      :visible="pocCheckerVisible"
      :width="1000"
      :title="currentPoc ? currentPoc.name : t('pages.poc.quickTest')"
      @cancel="closePocChecker"
      unmountOnClose
    >
      <poc-checker :poc_instance_id="currentPocId"></poc-checker>
      <template #footer>
        <a-button @click="closePocChecker">{{ t('pages.poc.close') }}</a-button>
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
  IconBug,
  IconSearch,
  IconDelete,
  IconFire,
} from '@arco-design/web-vue/es/icon'
import { onMounted, ref, reactive, watch } from 'vue'
import { deletePocs, listPocs } from '@/api/poc.ts'
import { Notification, type TableColumnData, type TableRowSelection } from '@arco-design/web-vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { VulLevel, VulTypes } from '@/enums/enums.ts'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import PocChecker from '@/components/PocChecker.vue'

// Define Poc interface for TypeScript
interface Poc {
  instance_id: string
  name: string
  vul_type: string
  level: string
  vul_path: string
  vul_param: string
  update_time: string
  fofa_finger?: string
  [key: string]: any
}

const { t } = useI18n()

const props = defineProps({
  app_id: {
    type: String,
    default: '',
  },
  isShowAdd: {
    type: Boolean,
    default: false,
  },
})

dayjs.extend(utc)
const searchLoading = ref(false)
const searchName = ref('')
const searchVulType = ref<string[]>([])
const searchVulLevel = ref<string[]>([])
const searchParam = ref('')
const searchStartTime = ref()
const searchEndTime = ref()
const selectedKeys = ref([])
const popoverVisible = ref(false)
const deleteLoading = ref(false)
const pocCheckerVisible = ref(false)
const currentPoc = ref<Poc | null>(null)
const currentPocId = ref('')

// POC Checker functions
const openPocChecker = (poc: Poc) => {
  currentPoc.value = poc
  currentPocId.value = poc.instance_id
  pocCheckerVisible.value = true
}

const closePocChecker = () => {
  pocCheckerVisible.value = false
  currentPoc.value = null
  currentPocId.value = ''
}

const columns = [
  {
    title: t('pages.poc.columns.id'),
    dataIndex: 'instance_id',
    ellipsis: true,
    tooltip: true,
    width: 120,
    fixed: 'left',
  },
  {
    title: t('pages.poc.columns.vulName'),
    dataIndex: 'name',
    width: 180,
    ellipsis: true,
    tooltip: true,
  },
  {
    title: t('pages.poc.columns.vulType'),
    dataIndex: 'vul_type',
    slotName: 'vul_type',
    width: 120,
    ellipsis: true,
    tooltip: true,
  },
  {
    title: t('pages.poc.columns.vulLevel'),
    dataIndex: 'level',
    slotName: 'level',
    width: 100,
    align: 'center',
  },
  {
    title: t('pages.poc.columns.vulPath'),
    dataIndex: 'vul_path',
    ellipsis: true,
    tooltip: true,
    minWidth: 200,
    cellStyle: { wordBreak: 'break-all' },
  },
  {
    title: t('pages.poc.columns.vulParam'),
    dataIndex: 'vul_param',
    width: 120,
    ellipsis: true,
    tooltip: true,
  },
  {
    title: t('pages.poc.columns.updateTime'),
    dataIndex: 'update_time',
    align: 'center',
    width: 160,
  },
  {
    title: t('pages.poc.columns.operations'),
    slotName: 'optional',
    width: 100,
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
const STORAGE_KEY = 'poc_list_pagination'

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
    const res = await listPocs({
      app_instance_id: props.app_id,
      size: pageSize.value,
      page: currentPage.value,
      name: searchName.value,
      vul_param: searchParam.value,
      vul_type: searchVulType.value,
      level: searchVulLevel.value,
      start_time: searchStartTime.value ? dayjs.utc(searchStartTime.value).valueOf() : -1,
      end_time: searchEndTime.value
        ? dayjs.utc(searchEndTime.value).valueOf()
        : dayjs.utc(Date.now()).valueOf(),
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
  } catch (e) {
    void e
    Notification.error('服务错误')
  } finally {
  }
}

const deleteData = async () => {
  deleteLoading.value = true
  try {
    const res = await deletePocs({
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

onMounted(() => {
  // 恢复保存的分页状态
  restorePaginationState()
  fetchData()
})

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
  savePaginationState()
  fetchData()
}

function handlePageSizeChange(size: number) {
  pageSize.value = size
  savePaginationState()
  fetchData()
}

const getColor = (level: string) => {
  const levelConfig = VulLevel.find((item) => item.key === level)
  return levelConfig ? levelConfig.color : 'gray'
}

const getLevel = (level: string) => {
  const levelConfig = VulLevel.find((item) => item.key === level)
  return levelConfig ? levelConfig.label : '未知等级'
}

const getVulType = (type: string) => {
  const TypeConfig = VulTypes.find((item) => item.key === type)
  return TypeConfig ? TypeConfig.label : '未知类型'
}

const pocDetailClick = (poc: string) => {
  // 先保存分页状态，再跳转
  savePaginationState()
  if (poc && poc !== '') {
    router.push(`/wiki/poc/detail/${poc}`)
  } else {
    router.push(`/wiki/poc/add/${props.app_id}`)
  }
}

function pocAddClick() {
  router.push(`/wiki/poc/add/${props.app_id}`)
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

.poc-count-card .metric-icon {
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
</style>
