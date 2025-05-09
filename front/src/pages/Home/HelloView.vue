<template>
  <div class="dashboard-container">
    <!-- Hero Section with Tool Name and Description - Centered version when no search results -->
    <div :class="['hero-section', { 'hero-section-centered': !hasResults }]">
      <div class="tool-info">
        <h1 :class="['tool-name', { 'tool-name-large': !hasResults }]">{{ t('brand.name') }}</h1>
        <h2 class="tool-subtitle">{{ t('brand.description') }}</h2>
      </div>

      <!-- Global Search - Centered when no results -->
      <div :class="['search-container', { 'search-container-centered': !hasResults }]">
        <a-input
          v-model="searchQuery"
          placeholder="请输入名称模糊搜索漏洞、POC、应用"
          allow-clear
          :loading="searchLoading"
          @press-enter="() => handleSearch(searchQuery)"
          @input="handleSearchInput"
        >
          <template #prefix>
            <icon-search />
          </template>
        </a-input>
      </div>
    </div>

    <!-- 系统监控卡片 - 当有搜索结果或者无搜索条件时显示 -->
    <div v-if="hasResults || !isSearching || searchQuery.trim() === ''" class="metrics-section">
      <a-row :gutter="[16, 16]" class="metric-cards">
        <a-col :xs="24" :sm="12" :md="12" :lg="6">
          <a-card class="metric-card cpu-card">
            <div class="card-header">
              <icon-dashboard class="metric-icon" />
              <span class="card-title">{{ t('pages.home.cpuUsage') }}</span>
            </div>
            <div class="metric-value">{{ cpuUsage }}%</div>
            <a-progress
              :percent="cpuUsageNumber"
              :show-text="false"
              :stroke-width="8"
              :stroke-color="{
                '0%': '#FF7D00',
                '100%': '#FF2D1F',
              }"
            />
          </a-card>
        </a-col>

        <a-col :xs="24" :sm="12" :md="12" :lg="6">
          <a-card class="metric-card memory-card">
            <div class="card-header">
              <icon-computer class="metric-icon" />
              <span class="card-title">{{ t('pages.home.memoryUsage') }}</span>
            </div>
            <div class="metric-value">{{ memoryUsage }}%</div>
            <a-progress
              :percent="memoryUsageNumber"
              :show-text="false"
              :stroke-width="8"
              :stroke-color="{
                '0%': '#FFB74D',
                '100%': '#FF7D00',
              }"
            />
          </a-card>
        </a-col>

        <a-col :xs="24" :sm="12" :md="12" :lg="6">
          <a-card class="metric-card network-card">
            <div class="card-header">
              <icon-wifi class="metric-icon" />
              <span class="card-title">{{ t('pages.home.networkBandwidth') }}</span>
            </div>
            <div class="metric-value">{{ networkBandwidth }}</div>
            <div class="network-stats">
              <div class="network-stat">
                <icon-up class="up-icon" />
                <span>{{ uploadSpeed }}</span>
              </div>
              <div class="network-stat">
                <icon-down class="down-icon" />
                <span>{{ downloadSpeed }}</span>
              </div>
            </div>
          </a-card>
        </a-col>

        <a-col :xs="24" :sm="12" :md="12" :lg="6">
          <a-card class="metric-card goroutine-card">
            <div class="card-header">
              <icon-code class="metric-icon" />
              <span class="card-title">{{ t('pages.home.goroutineCount') }}</span>
            </div>
            <div class="metric-value">{{ goroutineCount }}</div>
          </a-card>
        </a-col>
      </a-row>
    </div>

    <!-- Search Results - Only shown when there are results -->
    <div v-if="hasResults" class="search-results-section">
      <h2 class="section-title">{{ t('pages.home.searchResults') }}</h2>

      <!-- POC Results -->
      <div v-if="pocResults.length > 0" class="result-category">
        <div class="category-header">
          <icon-bug class="category-icon" />
          <h3>{{ t('pages.home.pocResults') }}</h3>
          <a-link class="more-link" @click="goToMoreResults('poc')">{{
            t('pages.home.viewMore')
          }}</a-link>
        </div>
        <a-table
          :columns="pocColumns"
          :data="pocResults"
          :pagination="{ pageSize: 5 }"
          :loading="pocLoading"
          size="medium"
          bordered
          stripe
        >
          <template #instance_id="{ record }">
            <a-link @click="pocDetailClick(record.instance_id)">{{ record.instance_id }}</a-link>
          </template>
          <template #level="{ record }">
            <a-tag :color="getVulLevelColor(record.level)">
              {{ getVulLevelName(record.level) }}
            </a-tag>
          </template>
          <template #vul_type="{ record }">
            {{ getVulTypeName(record.vul_type) }}
          </template>
        </a-table>
      </div>

      <!-- App Results -->
      <div v-if="appResults.length > 0" class="result-category">
        <div class="category-header">
          <icon-apps class="category-icon" />
          <h3>{{ t('pages.home.appResults') }}</h3>
          <a-link class="more-link" @click="goToMoreResults('app')">{{
            t('pages.home.viewMore')
          }}</a-link>
        </div>
        <a-table
          :columns="appColumns"
          :data="appResults"
          :pagination="{ pageSize: 5 }"
          :loading="appLoading"
          size="medium"
          bordered
          stripe
        >
          <template #instance_id="{ record }">
            <a-link @click="appDetailClick(record.instance_id)">{{ record.instance_id }}</a-link>
          </template>
        </a-table>
      </div>

      <!-- Vulnerability Results -->
      <div v-if="vulResults.length > 0" class="result-category">
        <div class="category-header">
          <icon-safe class="category-icon" />
          <h3>{{ t('pages.home.vulResults') }}</h3>
          <a-link class="more-link" @click="goToMoreResults('vul')">{{
            t('pages.home.viewMore')
          }}</a-link>
        </div>
        <a-table
          :columns="vulColumns"
          :data="vulResults"
          :pagination="{ pageSize: 5 }"
          :loading="vulLoading"
          size="medium"
          bordered
          stripe
        >
          <template #instance_id="{ record }">
            <a-link @click="vulDetailClick(record.instance_id)">{{ record.instance_id }}</a-link>
          </template>
        </a-table>
      </div>
    </div>

    <!-- No Results Message - 移到搜索结果区域外部 -->
    <div v-if="!hasResults && searchQuery.trim() !== '' && !isSearching" class="no-results-section">
      <a-empty :description="t('pages.home.noResults')" />
    </div>

    <!-- POC Checker Drawer -->
    <a-drawer
      :visible="pocCheckerVisible"
      :width="1000"
      :title="currentPoc ? currentPoc.name : t('pages.poc.quickTest')"
      @cancel="closePocChecker"
      unmountOnClose
    >
      <poc-checker :poc_instance_id="currentPocId" :initial-target="currentVulTarget"></poc-checker>
      <template #footer>
        <a-button @click="closePocChecker">{{ t('pages.poc.close') }}</a-button>
      </template>
    </a-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { Message, type TableColumnData, type TableData } from '@arco-design/web-vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { getSystemInfo } from '@/api/system'
import { listPocs } from '@/api/poc'
import { listVuls } from '@/api/vul'
import { listAppName } from '@/api/app'
import { VulLevel, VulTypes } from '@/enums/enums.ts'
import {
  IconDashboard,
  IconComputer,
  IconWifi,
  IconCode,
  IconSearch,
  IconBug,
  IconApps,
  IconSafe,
  IconUp,
  IconDown,
  IconEye,
  IconRefresh,
} from '@arco-design/web-vue/es/icon'
import type { VNodeChild } from 'vue'
import PocChecker from '@/components/PocChecker.vue'

const { t } = useI18n()
const router = useRouter()

// 仪表盘数据
const cpuUsage = ref('0')
const memoryUsage = ref('0')
const networkBandwidth = ref('0')
const uploadSpeed = ref('0')
const downloadSpeed = ref('0')
const goroutineCount = ref('0')

// 计算属性用于进度条显示
const cpuUsageNumber = computed(() => parseFloat(cpuUsage.value) / 100)
const memoryUsageNumber = computed(() => parseFloat(memoryUsage.value) / 100)

// 搜索相关数据
const searchQuery = ref('')
const searchLoading = ref(false)
const searchTimer = ref<number | null>(null)
const isSearching = ref(false)

// 搜索结果
const pocResults = ref<any[]>([])
const appResults = ref<any[]>([])
const vulResults = ref<any[]>([])
const pocLoading = ref(false)
const appLoading = ref(false)
const vulLoading = ref(false)

// Helper functions for POC level and type
const getVulLevelColor = (level: string): string => {
  const levelConfig = VulLevel.find((item) => item.key === level)
  return levelConfig ? levelConfig.color : 'gray'
}

const getVulLevelName = (level: string): string => {
  const levelConfig = VulLevel.find((item) => item.key === level)
  return levelConfig ? levelConfig.label : '未知等级'
}

const getVulTypeName = (type: string): string => {
  const typeConfig = VulTypes.find((item) => item.key === type)
  return typeConfig ? typeConfig.label : '未知类型'
}

// Navigation to full result pages
const goToMoreResults = (type: string) => {
  switch (type) {
    case 'poc':
      window.open(`/wiki/poc?name=${encodeURIComponent(searchQuery.value)}`, '_blank')
      break
    case 'app':
      window.open(`/wiki/app?name=${encodeURIComponent(searchQuery.value)}`, '_blank')
      break
    case 'vul':
      window.open(`/vuls?name=${encodeURIComponent(searchQuery.value)}`, '_blank')
      break
  }
}

// 表格列定义 - POC表格
const pocColumns = computed<TableColumnData[]>(() => [
  {
    title: 'ID',
    dataIndex: 'instance_id',
    width: 180,
    ellipsis: true,
    tooltip: true,
    slotName: 'instance_id',
  },
  {
    title: t('pages.poc.columns.vulName'),
    dataIndex: 'name',
    ellipsis: true,
    tooltip: true,
  },
  {
    title: t('pages.poc.columns.vulType'),
    dataIndex: 'vul_type',
    width: 150,
    slotName: 'vul_type',
  },
  {
    title: t('pages.poc.columns.vulLevel'),
    dataIndex: 'level',
    width: 100,
    slotName: 'level',
    align: 'center',
  },
  {
    title: t('pages.poc.columns.updateTime'),
    dataIndex: 'update_time',
    width: 160,
    align: 'center',
  },
])

// 应用表格列定义
const appColumns = computed<TableColumnData[]>(() => [
  {
    title: 'ID',
    dataIndex: 'instance_id',
    width: 180,
    ellipsis: true,
    tooltip: true,
    slotName: 'instance_id',
  },
  {
    title: t('pages.app.list.columns.appName'),
    dataIndex: 'name',
    ellipsis: true,
    tooltip: true,
  },
  {
    title: t('pages.app.list.columns.version'),
    dataIndex: 'version',
    width: 120,
  },
  {
    title: t('pages.app.list.columns.updateTime'),
    dataIndex: 'update_time',
    width: 160,
    align: 'center',
  },
])

// 漏洞表格列定义
const vulColumns = computed<TableColumnData[]>(() => [
  {
    title: 'ID',
    dataIndex: 'instance_id',
    width: 180,
    ellipsis: true,
    tooltip: true,
    slotName: 'instance_id',
  },
  {
    title: t('pages.vul.columns.vulName'),
    dataIndex: 'name',
    ellipsis: true,
    tooltip: true,
  },
  {
    title: t('pages.vul.columns.vulUrl'),
    dataIndex: 'vul_url',
    ellipsis: true,
    tooltip: true,
    width: 180,
  },
  {
    title: t('pages.vul.columns.vendor'),
    dataIndex: 'company',
    width: 150,
  },
  {
    title: t('pages.vul.columns.updateTime'),
    dataIndex: 'update_time',
    width: 160,
    align: 'center',
  },
])

// 计算属性：是否有搜索结果
const hasResults = computed(
  () => pocResults.value.length > 0 || appResults.value.length > 0 || vulResults.value.length > 0,
)

// 获取系统信息
const fetchSystemInfo = async () => {
  try {
    const response = await getSystemInfo()
    if (response.data.code === 0 && response.data.data) {
      const data = response.data.data
      cpuUsage.value = data.cpu
      memoryUsage.value = data.mem
      networkBandwidth.value = data.net_total
      uploadSpeed.value = data.net_upload
      downloadSpeed.value = data.net_download
      goroutineCount.value = data.goroutines
    }
  } catch (error) {
    Message.error(t('pages.home.systemInfoError'))
  }
}

// 搜索处理函数
const handleSearch = (value?: string) => {
  if (value !== undefined) {
    searchQuery.value = value
  }
  performSearch()
}

// 输入时处理函数 - 防抖
const handleSearchInput = () => {
  if (searchTimer.value) {
    clearTimeout(searchTimer.value)
  }

  searchTimer.value = window.setTimeout(() => {
    if (searchQuery.value.trim().length >= 2) {
      performSearch()
    } else if (searchQuery.value.trim() === '') {
      clearResults()
    }
  }, 500)
}

// 清空结果
const clearResults = () => {
  pocResults.value = []
  appResults.value = []
  vulResults.value = []
}

// 执行搜索
const performSearch = async () => {
  if (searchQuery.value.trim() === '') {
    clearResults()
    return
  }

  isSearching.value = true
  searchLoading.value = true

  // 同时搜索POC、应用和漏洞
  await Promise.all([searchPocs(), searchApps(), searchVuls()])

  searchLoading.value = false
  isSearching.value = false
}

// 搜索POC
const searchPocs = async () => {
  pocLoading.value = true
  try {
    const res = await listPocs({
      name: searchQuery.value,
      page: 1,
      size: 10,
    })

    if (res.status === 200 && res.data?.code === 0) {
      pocResults.value = res.data?.data?.items || []
    } else {
      pocResults.value = []
    }
  } catch (error) {
    pocResults.value = []
    console.error('搜索POC失败:', error)
  } finally {
    pocLoading.value = false
  }
}

// 搜索应用
const searchApps = async () => {
  appLoading.value = true
  try {
    const res = await listAppName({
      name: searchQuery.value,
      page: 1,
      size: 10,
    })

    if (res.status === 200 && res.data?.code === 0) {
      appResults.value = res.data?.data?.items || []
    } else {
      appResults.value = []
    }
  } catch (error) {
    appResults.value = []
    console.error('搜索应用失败:', error)
  } finally {
    appLoading.value = false
  }
}

// 搜索漏洞
const searchVuls = async () => {
  vulLoading.value = true
  try {
    const res = await listVuls({
      name: searchQuery.value,
      page: 1,
      size: 10,
    })

    if (res.status === 200 && res.data?.code === 0) {
      vulResults.value = res.data?.data?.items || []
    } else {
      vulResults.value = []
    }
  } catch (error) {
    vulResults.value = []
    console.error('搜索漏洞失败:', error)
  } finally {
    vulLoading.value = false
  }
}

// Add POC Checker and retest functionality
const pocCheckerVisible = ref(false)
const currentPocId = ref('')
const currentPoc = ref<any>(null)
const currentVulTarget = ref('')

// Function to open POC checker
const openPocChecker = (poc: any) => {
  currentPoc.value = poc
  currentPocId.value = poc.instance_id
  pocCheckerVisible.value = true
}

// Function to close POC checker
const closePocChecker = () => {
  pocCheckerVisible.value = false
  currentPoc.value = null
  currentPocId.value = ''
}

// Function to open vulnerability retest
const openVulRetest = (vul: any) => {
  currentPocId.value = vul.poc_id
  currentVulTarget.value = vul.vul_url
  pocCheckerVisible.value = true
}

// Updated navigation functions with correct paths
const pocDetailClick = (pocId: string) => {
  if (pocId && pocId !== '') {
    // 使用新窗口打开
    window.open(`/wiki/poc/detail/${pocId}`, '_blank')
  }
}

const appDetailClick = (appId: string) => {
  if (appId && appId !== '') {
    // 使用新窗口打开
    window.open(`/wiki/app/detail/${appId}`, '_blank')
  }
}

const vulDetailClick = (vulId: string) => {
  if (vulId && vulId !== '') {
    // 使用新窗口打开
    window.open(`/vuls/detail/${vulId}`, '_blank')
  }
}

// 系统信息更新定时器
let dataTimer: number | null = null

onMounted(() => {
  // 立即获取一次系统信息
  fetchSystemInfo()
  // 设置定时更新，每8秒更新一次
  dataTimer = window.setInterval(fetchSystemInfo, 8000)
})

onUnmounted(() => {
  // 清理资源
  if (dataTimer) {
    clearInterval(dataTimer)
    dataTimer = null
  }

  if (searchTimer.value) {
    clearTimeout(searchTimer.value)
    searchTimer.value = null
  }
})
</script>

<style scoped>
.dashboard-container {
  padding: 16px;
  min-height: calc(100vh - 64px);
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  overflow-x: hidden;
}

/* Hero Section */
.hero-section {
  background: none;
  border-radius: 8px;
  padding: 0 0 0; /* 完全移除内边距 */
  margin-bottom: 0; /* 移除底部间距 */
  color: #1d2129;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0; /* 移除间距 */
  transition: all 0.3s ease;
}

/* Centered version for when there are no search results */
.hero-section-centered {
  flex: 0.6; /* 从1降低到0.6，减少占用空间 */
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0;
  margin: 30px 0; /* 使用固定边距替代auto */
}

.tool-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 0;
}

.tool-name {
  font-size: 42px;
  font-weight: bold;
  margin: 0;
  color: #ff7d00;
  text-shadow: none;
  transition: all 0.3s ease;
}

.tool-name-large {
  font-size: 56px;
  margin-bottom: 18px; /* 增加一点间距 */
}

.tool-subtitle {
  font-size: 18px;
  font-weight: 500;
  margin: 0 0 10px; /* 只保留一点底部边距 */
  color: #4e5969;
  max-width: 800px;
  transition: all 0.3s ease;
}

.search-container {
  max-width: 800px;
  width: 100%;
  margin: 0 auto 10px; /* 减少与系统指标的距离 */
  transition: all 0.3s ease;
}

.search-container-centered {
  max-width: 1000px;
  margin-top: 20px;
}

.search-container :deep(.arco-input) {
  font-size: 16px;
  height: 48px;
  line-height: 48px;
  vertical-align: middle;
  text-align: left;
}

.search-container :deep(.arco-input-wrapper) {
  background-color: white;
  border: 1px solid #e5e6eb;
  border-radius: 8px;
  box-shadow: none;
  height: 50px;
  overflow: hidden;
  display: flex;
  align-items: center;
}

.search-container :deep(.arco-input-prefix) {
  margin-right: 8px;
  margin-left: 15px;
}

.search-container :deep(.arco-input-wrapper:hover),
.search-container :deep(.arco-input-wrapper:focus-within) {
  border-color: #ff7d00;
  box-shadow: 0 0 0 2px rgba(255, 125, 0, 0.1);
}

/* Metrics Section */
.metrics-section {
  margin-top: 0;
  margin-bottom: 24px;
}

.section-title {
  font-size: 20px;
  margin: 0 0 12px;
  color: #1d2129;
  font-weight: 600;
}

.metric-cards {
  margin-top: 0;
}

.metric-card {
  height: 160px;
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
  background-clip: text;
  -webkit-text-fill-color: transparent;
  text-align: center;
  width: 100%;
}

/* Card variations */
.cpu-card .metric-icon {
  color: #ff2d1f;
}

.memory-card .metric-icon {
  color: #ff7d00;
}

.network-card .metric-icon {
  color: #ffb74d;
}

.goroutine-card .metric-icon {
  color: #ff6e27;
}

.network-stats {
  display: flex;
  justify-content: space-around;
  width: 100%;
  margin-top: 12px;
}

.network-stat {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 500;
}

.up-icon {
  color: #ff2d1f;
}

.down-icon {
  color: #ffb74d;
}

/* Search Results Section */
.search-results-section {
  margin-top: 16px; /* 减少与系统指标的间距 */
}

.result-category {
  margin-bottom: 24px;
}

.category-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  position: relative;
}

.category-icon {
  font-size: 20px;
  color: #ff7d00;
}

.category-header h3 {
  font-size: 18px;
  margin: 0;
  font-weight: 600;
  color: #1d2129;
}

.more-link {
  font-size: 14px;
  color: #ff7d00;
  margin-left: 8px;
  position: absolute;
  right: 0;
}

/* Table customization */
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

:deep(.arco-table-tr:hover) {
  background-color: #fff0e6;
  cursor: pointer;
}

/* Make metrics section responsive */
@media screen and (max-width: 768px) {
  .hero-section {
    padding: 24px;
  }

  .hero-section-centered {
    padding: 40px 24px;
  }

  .tool-name {
    font-size: 28px;
  }

  .tool-name-large {
    font-size: 36px;
  }

  .tool-description {
    font-size: 14px;
  }

  .tool-description-large {
    font-size: 18px;
  }

  .section-title {
    font-size: 18px;
  }

  .metric-value {
    font-size: 24px;
  }
}

.table-item {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

/* 为Goroutine卡片添加占位元素保持高度一致 */
.goroutine-card::after {
  content: '';
  height: 40px; /* 确保总高度与其他卡片一致 */
  display: block;
}

.no-results-section {
  margin-top: 24px;
  padding: 32px 0;
  text-align: center;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}
</style>
