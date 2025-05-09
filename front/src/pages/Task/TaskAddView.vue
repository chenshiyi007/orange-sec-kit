<template>
  <div class="task-add-container">
    <a-form :model="form" layout="vertical" ref="formRef" @submit="addTaskHandler">
      <div class="form-section">
        <a-form-item
          field="name"
          :label="t('pages.task.add.taskName')"
          :tooltip="t('pages.task.add.taskNameTip')"
        >
          <a-input
            v-model="form.name"
            :placeholder="t('pages.task.add.enterTaskName')"
            class="form-control"
          />
        </a-form-item>

        <div class="input-row">
          <a-form-item
            field="worker_count"
            :label="t('pages.task.add.concurrency')"
            class="worker-item"
          >
            <div class="worker-slider-container">
              <a-slider
                v-model="form.worker_count"
                :min="1"
                :max="200"
                :step="1"
                :show-ticks="false"
                :show-input="false"
                class="worker-slider"
              />
              <div class="worker-badge">{{ form.worker_count }}</div>
            </div>
          </a-form-item>

          <a-form-item
            field="proxy"
            :label="t('pages.task.add.proxySettings')"
            :tooltip="t('pages.task.add.proxyExample')"
            class="proxy-item"
          >
            <div class="proxy-container">
              <a-switch v-model="useProxy" />
              <a-input
                v-if="useProxy"
                v-model="form.proxy"
                :placeholder="t('pages.task.add.enterProxyAddress')"
                class="proxy-input"
              />
            </div>
          </a-form-item>
        </div>
      </div>

      <div class="form-section">
        <div class="section-row">
          <div class="section-column scan-column">
            <div class="section-header">{{ t('pages.task.add.scanMode') }}</div>
            <div class="section-content">
              <a-tabs v-model:activeKey="activeScanMode" class="section-tabs">
                <a-tab-pane key="poc" :title="t('pages.task.add.pocScanMode')">
                  <div class="scan-content">
                    <div class="scan-switch-container">
                      <span class="scan-switch-label">{{ t('pages.task.add.scanAllPoc') }}</span>
                      <a-switch v-model="scanAllPoc" @change="handleScanAllPocChange" />
                    </div>

                    <a-form-item
                      v-if="!scanAllPoc"
                      field="poc_id"
                      :label="t('pages.task.add.selectPoc')"
                    >
                      <a-select
                        v-model="form.poc_id"
                        :placeholder="t('pages.task.add.selectPoc')"
                        allow-search
                        allow-clear
                        multiple
                        class="form-control"
                        @search="handlePocSearch"
                      >
                        <a-option
                          v-for="item in pocList"
                          :key="item.value"
                          :value="item.value"
                          :label="item.label"
                        >
                          {{ item.label }}
                        </a-option>
                      </a-select>
                    </a-form-item>
                  </div>
                </a-tab-pane>

                <a-tab-pane key="app" :title="t('pages.task.add.appScanMode')">
                  <div class="scan-content">
                    <a-form-item field="app_id" :label="t('pages.task.add.selectApplication')">
                      <a-select
                        v-model="form.app_id"
                        :placeholder="t('pages.task.add.selectApplication')"
                        allow-search
                        allow-clear
                        multiple
                        class="form-control"
                        @search="handleAppSearch"
                      >
                        <a-option
                          v-for="item in appList"
                          :key="item.value"
                          :value="item.value"
                          :label="item.label"
                        >
                          {{ item.label }}
                        </a-option>
                      </a-select>
                    </a-form-item>
                  </div>
                </a-tab-pane>
              </a-tabs>
            </div>
          </div>

          <div class="section-column target-column">
            <div class="section-header">{{ t('pages.task.add.targetSettings') }}</div>
            <div class="section-content">
              <a-tabs v-model:activeKey="activeTargetType" class="section-tabs">
                <a-tab-pane
                  key="target_auto_search"
                  :title="t('pages.task.add.autoSearch')"
                  :disabled="!canUseAutoSearch"
                >
                  <div v-if="!canUseAutoSearch" class="auto-search-disabled">
                    <a-empty
                      :description="t('pages.task.add.autoSearchLimited')"
                      :image-size="100"
                    />
                  </div>
                  <div v-else class="auto-search-container">
                    <div class="auto-search-options">
                      <div class="search-engine-selection">
                        <div class="search-engine-label">
                          {{ t('pages.task.add.searchEngines') }}:
                        </div>
                        <a-select
                          v-model="form.search_engines"
                          :placeholder="t('pages.task.add.selectSearchEngines')"
                          multiple
                          class="search-engine-select"
                        >
                          <a-option value="fofa">FOFA</a-option>
                          <a-option value="hunter">Hunter</a-option>
                        </a-select>
                      </div>

                      <div class="search-save-option">
                        <a-typography-text>{{
                          t('pages.task.add.saveSearchResults')
                        }}</a-typography-text>
                        <a-switch v-model="form.is_save_target" />
                      </div>
                    </div>
                  </div>
                </a-tab-pane>

                <a-tab-pane key="target_file" :title="t('pages.task.add.fileImport')">
                  <div class="file-upload-container">
                    <FileSelector
                      v-model:filePath="form.target_file"
                      width="100%"
                      fileType="txt"
                      :placeholder="t('pages.task.add.selectTxtFile')"
                    />
                  </div>
                </a-tab-pane>

                <a-tab-pane key="targets" :title="t('pages.task.add.manualInput')">
                  <a-textarea
                    v-model="form.targets"
                    :max-length="3000"
                    show-word-limit
                    :placeholder="t('pages.task.add.enterTargetsOneLine')"
                    :auto-size="{ minRows: 8, maxRows: 10 }"
                    class="target-textarea"
                  />
                </a-tab-pane>
              </a-tabs>
            </div>
          </div>
        </div>
      </div>

      <div class="form-footer">
        <a-space>
          <a-button @click="handleCancel" class="btn-cancel">
            {{ t('common.cancel') }}
          </a-button>
          <a-button html-type="submit" type="primary" :loading="addLoading" class="btn-submit">
            <template #icon>
              <icon-plus />
            </template>
            {{ t('pages.task.add.addTask') }}
          </a-button>
        </a-space>
      </div>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, defineProps, defineEmits, computed, onMounted, watch } from 'vue'
import { IconPlus } from '@arco-design/web-vue/es/icon'
import FileSelector from '@/components/FileSelector.vue'
import { Notification } from '@arco-design/web-vue'
import { listApps } from '@/api/app.ts'
import { listPocs } from '@/api/poc.ts'
import { createTask } from '@/api/task.ts'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// Props and Emits
const props = defineProps({
  initialForm: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits(['submit', 'cancel'])

// 定义后端接口返回类型
interface AppItem {
  instance_id: string
  name: string
  [key: string]: unknown
}

// 前端使用的Item类型
interface PocItem {
  label: string
  value: string
  disabled: boolean
}

const initForm = reactive({
  name: '',
  targets: '',
  target_file: '',
  target_auto_search: false as boolean,
  is_save_target: false,
  worker_count: 100,
  app_id: [] as string[],
  poc_id: [] as string[],
  proxy: '',
  scan_mode: 'poc',
  search_engines: [] as string[], // 添加搜索引擎字段
})

const form = reactive({
  ...initForm,
  ...props.initialForm,
  // 强制确保类型正确
  target_auto_search: props.initialForm?.target_auto_search === true ? true : false,
  search_engines: props.initialForm?.search_engines || [],
})
const addLoading = ref(false)
const useProxy = ref(false)
const activeTargetType = ref('target_auto_search')
const formRef = ref()
const appList = ref<PocItem[]>([])
const pocList = ref<PocItem[]>([])
const appSearchKeyword = ref('')
const pocSearchKeyword = ref('')
const scanAllPoc = ref(false)
const activeScanMode = ref('poc')

const handleCancel = () => {
  emit('cancel')
}

const resetForm = () => {
  Object.assign(form, initForm)
  useProxy.value = false
  activeTargetType.value = 'target_auto_search'
  scanAllPoc.value = false
  activeScanMode.value = 'poc'
}

// 获取应用列表的函数
const searchApps = async (keyword: string) => {
  try {
    const res = await listApps({
      name: keyword,
      page: 1,
      size: 200,
    })
    if (res.status === 200 && res.data?.code === 0) {
      appList.value = (res.data?.data?.items || []).map((item: AppItem) => ({
        label: item.name,
        value: item.instance_id,
        disabled: false,
      }))
    }
  } catch (e) {
    void e
    Notification.error(t('pages.task.add.fetchAppListFailed'))
  }
}

// 处理应用搜索
const handleAppSearch = (keyword: string) => {
  appSearchKeyword.value = keyword
  searchApps(keyword)
}

// 获取POC列表的函数
const searchPocs = async (keyword: string) => {
  try {
    // 调用真实的POC列表API
    const res = await listPocs({
      name: keyword,
      page: 1,
      size: 200,
    })

    if (res.status === 200 && res.data?.code === 0) {
      pocList.value = (res.data?.data?.items || []).map((item: any) => ({
        label: item.name,
        value: item.instance_id,
        disabled: false,
      }))
    }
  } catch (e) {
    void e
    Notification.error(t('pages.task.add.fetchPocListFailed'))
  }
}

// 处理POC搜索
const handlePocSearch = (keyword: string) => {
  pocSearchKeyword.value = keyword
  searchPocs(keyword)
}

// 组件挂载时加载应用列表和POC列表
onMounted(() => {
  searchApps('')
  searchPocs('')
})

// 监听目标类型的切换
watch(activeTargetType, (newVal) => {
  if (newVal === 'target_auto_search') {
    form.target_auto_search = true
  } else {
    form.target_auto_search = false
  }
})

// 监听代理开关状态
watch(useProxy, (newVal) => {
  if (newVal && !form.proxy) {
    // 如果开启代理且当前代理地址为空，则设置默认值
    form.proxy = 'http://127.0.0.1:7890'
  }
})

// 计算是否可以使用自动搜索
const canUseAutoSearch = computed(() => {
  if (activeScanMode.value === 'poc') {
    // POC模式：需要选择单个POC，不能开启全部POC扫描
    return !scanAllPoc.value && form.poc_id.length === 1
  } else if (activeScanMode.value === 'app') {
    // 应用模式：只能选择单个应用
    return form.app_id.length === 1
  }
  return false
})

// 监听扫描模式切换
watch(activeScanMode, () => {
  // 不自动切换标签页，仅更新状态
})

// 监听POC选择变化
watch(
  () => form.poc_id,
  (newVal) => {
    // 不自动切换标签页，仅更新状态
  },
  { deep: true },
)

// 监听应用选择变化
watch(
  () => form.app_id,
  (newVal) => {
    // 不自动切换标签页，仅更新状态
  },
  { deep: true },
)

// 监听全部POC扫描开关变化
watch(scanAllPoc, (newVal) => {
  // 不自动切换标签页，仅更新状态
})

const addTaskHandler = async () => {
  addLoading.value = true
  try {
    // Validate all form fields
    await formRef.value.validate()

    // 验证目标设置
    if (activeTargetType.value === 'targets' && !form.targets) {
      Notification.warning(t('pages.task.add.enterTarget'))
      return
    }
    if (activeTargetType.value === 'target_file' && !form.target_file) {
      Notification.warning(t('pages.task.add.selectTargetFile'))
      return
    }
    if (activeTargetType.value === 'target_auto_search' && form.search_engines.length === 0) {
      Notification.warning(t('pages.task.add.selectSearchEngine'))
      return
    }

    // 准备提交的数据
    const submitData = { ...form }

    // 确保target_auto_search是布尔值
    submitData.target_auto_search = activeTargetType.value === 'target_auto_search'

    // 设置扫描模式
    submitData.scan_mode = activeScanMode.value

    // 如果是POC模式但没有选择任何POC且不是扫描全部
    if (
      activeScanMode.value === 'poc' &&
      !scanAllPoc.value &&
      (!form.poc_id || form.poc_id.length === 0)
    ) {
      Notification.warning(t('pages.task.add.selectPocRequired'))
      addLoading.value = false
      return
    }

    // 如果是应用模式但没有选择任何应用
    if (activeScanMode.value === 'app' && (!form.app_id || form.app_id.length === 0)) {
      Notification.warning(t('pages.task.add.selectAppRequired'))
      addLoading.value = false
      return
    }

    // 直接调用API创建任务
    console.log('Form data:', submitData)
    const res = await createTask(submitData)

    if (res.status === 200 && res.data?.code === 0) {
      // Reset the form
      resetForm()
      Notification.success(t('pages.task.add.taskCreatedSuccess'))
      // 关闭表单
      emit('cancel')
    } else {
      Notification.error(
        `${t('pages.task.add.createFailed')}: ${res.data?.message || t('common.unknownError')}`,
      )
    }
  } catch (e) {
    console.error(e)
    Notification.error(t('pages.task.add.createFailed'))
  } finally {
    addLoading.value = false
  }
}

// 处理扫描全部POC开关变化
const handleScanAllPocChange = (value: string | number | boolean) => {
  const checked = value as boolean
  if (checked) {
    // 如果选择扫描全部POC，设置poc_id为['all']
    form.poc_id = ['all']
  } else {
    // 如果取消扫描全部POC，清空poc_id
    form.poc_id = []
  }
}
</script>

<style scoped>
.task-add-container {
  padding: 12px;
  width: 100%;
  max-width: 720px;
  margin: 0 auto;
  box-sizing: border-box;
  overflow: hidden;
}

.form-section {
  margin-bottom: 24px;
  width: 100%;
}

.input-row {
  display: flex;
  gap: 24px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.worker-item {
  flex: 1;
  min-width: 250px;
}

.proxy-item {
  flex: 1;
  min-width: 250px;
}

.section-row {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.section-column {
  flex: 1;
  min-width: 300px;
  display: flex;
  flex-direction: column;
}

.scan-column {
  flex: 0.9;
}

.target-column {
  flex: 1.1;
}

.section-header {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 12px;
  color: var(--color-text-1);
}

.section-content {
  background-color: var(--color-bg-2);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  height: 100%;
  overflow: hidden;
}

.section-tabs {
  padding: 12px;
}

.scan-content {
  padding-top: 8px;
}

.form-control {
  width: 100%;
}

.form-tip {
  font-size: 12px;
  color: var(--color-text-3);
  margin-top: 4px;
}

/* 表单项标签样式 */
:deep(.arco-form-item-label > label) {
  font-weight: 500;
  color: var(--color-text-1);
  margin-bottom: 8px;
}

.worker-slider-container {
  display: flex;
  align-items: center;
  width: 100%;
  gap: 16px;
  height: 32px;
}

.worker-badge {
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 40px;
  height: 28px;
  background-color: var(--color-fill-2);
  border-radius: 14px;
  font-weight: 500;
  color: var(--color-text-1);
  padding: 0 10px;
}

.proxy-container {
  display: flex;
  align-items: center;
  gap: 16px;
  height: 32px;
}

.proxy-input {
  flex: 1;
}

/* 下方扫描模式部分 */
.scan-switch-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  margin-bottom: 16px;
  border-bottom: 1px dashed var(--color-border-2);
  margin-top: 8px;
}

.scan-switch-label {
  font-weight: 500;
  color: var(--color-text-1);
}

/* 目标输入部分 */
.target-textarea {
  width: 100%;
  border-radius: 4px;
  background-color: var(--color-fill-2);
  border: 1px solid var(--color-border-2);
  margin-top: 8px;
}

.file-upload-container {
  padding: 20px 12px;
  margin-top: 16px;
  background-color: var(--color-fill-2);
  border-radius: 8px;
  text-align: center;
}

/* 自动搜索部分 */
.auto-search-container {
  padding: 8px 0;
  margin-top: 8px;
}

.auto-search-disabled {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  height: 200px;
}

.auto-search-options {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.search-engine-selection {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.search-engine-label {
  font-weight: 500;
  color: var(--color-text-1);
}

.search-engine-select {
  width: 100%;
}

.search-save-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background-color: var(--color-fill-2);
  border-radius: 8px;
}

.form-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid var(--color-border-2);
}

.btn-cancel,
.btn-submit {
  min-width: 100px;
  height: 40px;
  font-weight: 500;
}

:deep(.btn-submit .arco-btn-icon) {
  margin-right: 6px;
}

:deep(.arco-tabs-content) {
  padding: 0;
}

:deep(.arco-form-item-content) {
  min-height: auto;
}

/* 防止内容溢出 */
:deep(.arco-select-dropdown) {
  max-width: 300px;
}

:deep(.arco-select-view-value) {
  max-width: 100%;
}

:deep(.arco-tabs-header) {
  padding: 0 4px;
}

/* 消除水平滚动条 */
:deep(.arco-tabs-content-inner) {
  overflow: hidden !important;
}

@media (max-width: 1200px) {
  .section-row {
    flex-direction: column;
    gap: 24px;
  }

  .section-column {
    width: 100%;
  }
}

@media (max-width: 768px) {
  .task-add-container {
    padding: 12px;
  }

  .input-row {
    flex-direction: column;
    gap: 16px;
  }

  .worker-item,
  .proxy-item {
    width: 100%;
  }
}
</style>
