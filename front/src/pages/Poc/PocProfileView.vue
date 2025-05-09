<template>
  <div class="poc-profile">
    <div class="custom-header">
      <PageHeader :title="t('pages.poc.profile.title')" />
      <div class="header-actions">
        <a-button type="primary" @click="handleExportReport">
          <template #icon>
            <icon-export />
          </template>
          {{ t('pages.vul.profile.exportReport') }}
        </a-button>
        <a-button type="text" @click="fetchData" shape="circle" :loading="loading">
          <template #icon>
            <icon-refresh />
          </template>
        </a-button>
      </div>
    </div>
    <div class="poc-profile-content">
      <a-form :model="form" layout="vertical">
        <!-- 基本信息卡片 -->
        <a-card class="content-card" :title="t('pages.poc.profile.basicInfo')">
          <a-row :gutter="24">
            <a-col :span="16">
              <a-form-item field="name" :label="t('pages.poc.profile.vulName')" required>
                <a-input
                  v-model="form.name"
                  allow-clear
                  :placeholder="t('pages.poc.profile.vulName')"
                ></a-input>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item field="instance_id" :label="t('pages.poc.profile.vulId')">
                <a-tag size="medium" color="arcoblue">{{
                  form.instance_id || t('pages.poc.profile.newPoc')
                }}</a-tag>
              </a-form-item>
            </a-col>
          </a-row>

          <a-row :gutter="24">
            <a-col :span="8">
              <a-form-item field="vul_type" :label="t('pages.poc.profile.vulType')" required>
                <a-select
                  v-model="form.vul_type"
                  :options="VulTypes"
                  :field-names="{ value: 'key', label: 'label' }"
                  allow-search
                  :placeholder="t('pages.poc.profile.vulType')"
                >
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item field="level" :label="t('pages.poc.profile.vulLevel')" required>
                <a-select
                  v-model="form.level"
                  :options="VulLevel"
                  :field-names="{ value: 'key', label: 'label' }"
                  allow-search
                  :placeholder="t('pages.poc.profile.vulLevel')"
                >
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item
                field="app_instance_id"
                :label="t('pages.poc.profile.application')"
                required
                :rules="[{ required: true, message: t('pages.poc.profile.applicationRequired') }]"
                :validate-trigger="['change', 'input', 'blur']"
              >
                <app-selector
                  v-model:app_instance_id="selectAppId"
                  v-model:app="app"
                  :init_options="options"
                ></app-selector>
              </a-form-item>
            </a-col>
          </a-row>

          <a-divider style="margin: 16px 0" />

          <!-- 应用信息展示区 -->
          <div v-if="app.instance_id" class="app-info">
            <a-descriptions :column="{ xs: 1, sm: 2, md: 3 }" bordered size="medium">
              <a-descriptions-item :label="t('pages.poc.profile.vendor')">{{
                app.company || '-'
              }}</a-descriptions-item>
              <a-descriptions-item :label="t('pages.poc.profile.version')">{{
                app.version || '-'
              }}</a-descriptions-item>
              <a-descriptions-item :label="t('pages.poc.profile.fofaFingerprint')">
                <a-typography-paragraph copyable>{{
                  app.fofa_finger || '-'
                }}</a-typography-paragraph>
              </a-descriptions-item>
              <a-descriptions-item :label="t('pages.poc.profile.hunterFingerprint')">
                <a-typography-paragraph copyable>{{
                  app.hunter_finger || '-'
                }}</a-typography-paragraph>
              </a-descriptions-item>
              <a-descriptions-item :label="t('pages.poc.profile.createTime')">{{
                form.create_time || '-'
              }}</a-descriptions-item>
              <a-descriptions-item :label="t('pages.poc.profile.updateTime')">{{
                form.update_time || '-'
              }}</a-descriptions-item>
            </a-descriptions>

            <a-typography-paragraph style="margin-top: 16px">
              <a-typography-title :heading="6">{{
                t('pages.poc.profile.applicationDescription')
              }}</a-typography-title>
              {{ app.description || t('pages.poc.profile.noDescription') }}
            </a-typography-paragraph>
          </div>
        </a-card>

        <!-- 漏洞详情卡片 -->
        <a-card class="content-card" :title="t('pages.poc.profile.vulDetail')">
          <a-row :gutter="24">
            <a-col :span="12">
              <a-form-item field="vul_path" :label="t('pages.poc.profile.vulPath')">
                <a-input
                  v-model="form.vul_path"
                  :placeholder="t('pages.poc.profile.vulPathPlaceholder')"
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item field="vul_param" :label="t('pages.poc.profile.vulParam')">
                <a-input
                  v-model="form.vul_param"
                  :placeholder="t('pages.poc.profile.vulParamPlaceholder')"
                />
              </a-form-item>
            </a-col>
          </a-row>

          <a-form-item field="vul_description" :label="t('pages.poc.profile.vulDescription')">
            <a-textarea
              v-model="form.vul_description"
              :auto-size="{ minRows: 4, maxRows: 8 }"
              :placeholder="t('pages.poc.profile.vulDescriptionPlaceholder')"
            />
          </a-form-item>

          <a-form-item field="repair_suggestion" :label="t('pages.poc.profile.repairSuggestion')">
            <a-textarea
              v-model="form.repair_suggestion"
              :auto-size="{ minRows: 4, maxRows: 8 }"
              :placeholder="t('pages.poc.profile.repairSuggestionPlaceholder')"
            />
          </a-form-item>
        </a-card>

        <!-- 复现步骤卡片 -->
        <a-card class="content-card" :title="t('pages.poc.profile.reproduceSteps')">
          <a-form-item field="vul_reproduce">
            <WangEditor v-model:content="form.vul_reproduce" />
          </a-form-item>
        </a-card>

        <!-- 检测规则卡片 -->
        <a-card class="content-card">
          <template #title>
            <div class="card-title-with-button">
              <span>{{ t('pages.poc.profile.detectionRule') }}</span>
              <div>
                <a-button type="text" @click="toggleRuleEditor">
                  <template #icon>
                    <icon-down v-if="!showRuleEditor" />
                    <icon-up v-else />
                  </template>
                  {{
                    showRuleEditor
                      ? t('pages.poc.profile.hideRule')
                      : t('pages.poc.profile.viewRule')
                  }}
                </a-button>
                <a-button
                  type="primary"
                  status="danger"
                  @click="showCheck"
                  style="margin-left: 8px"
                >
                  {{ t('pages.poc.profile.testRule') }}
                </a-button>
              </div>
            </div>
          </template>
          <a-form-item field="rule_link" v-show="showRuleEditor">
            <monaco-editor
              class="monaco-editor"
              v-if="!loading"
              v-model:code="form.rule_link"
            ></monaco-editor>
          </a-form-item>
        </a-card>

        <!-- 操作按钮 -->
        <div class="action-buttons">
          <a-space>
            <a-button size="large">{{ t('pages.poc.profile.cancel') }}</a-button>
            <a-button type="primary" size="large" @click="clickUpdate" :loading="updateLoading">
              <template #icon>
                <IconPen />
              </template>
              {{ t('pages.poc.profile.save') }}
            </a-button>
          </a-space>
        </div>
      </a-form>

      <!-- 规则测试抽屉 -->
      <a-drawer
        :visible="visible"
        :width="1000"
        :title="t('pages.poc.profile.ruleTest')"
        @cancel="handleOk"
        unmountOnClose
      >
        <poc-checker :rule_link="form.rule_link"></poc-checker>
        <template #footer>
          <a-button @click="handleOk">{{ t('pages.poc.profile.close') }}</a-button>
        </template>
      </a-drawer>

      <!-- 导出报告对话框 -->
      <a-modal
        :visible="exportModalVisible"
        :title="t('pages.poc.profile.exportReportConfig')"
        @cancel="closeExportModal"
        @before-ok="handleExportConfirm"
        :unmount-on-close="true"
        :ok-text="t('pages.poc.profile.confirmExport')"
        :cancel-text="t('pages.poc.profile.cancel')"
        :mask-closable="false"
        :esc-to-close="false"
        @close="closeExportModal"
        width="500px"
      >
        <a-form :model="exportConfig" layout="vertical" class="export-form">
          <a-form-item class="export-option">
            <a-space align="center">
              <a-switch
                v-model="exportConfig.includeVulReport"
                @update:model-value="onVulReportToggle"
              />
              <span class="option-label">{{ t('pages.poc.profile.includeVulReport') }}</span>
            </a-space>
          </a-form-item>

          <a-form-item v-if="exportConfig.includeVulReport" class="vul-select">
            <a-select
              v-model="exportConfig.selectedVuls"
              :placeholder="t('pages.poc.profile.selectVuls')"
              multiple
              :loading="vulLoading"
              :filter-option="false"
              :allow-search="true"
              @search="handleVulSearch"
              style="width: 100%"
            >
              <a-option v-for="vul in vulOptions" :key="vul.instance_id" :value="vul.instance_id">
                {{ vul.vul_url }} - {{ vul.name }}
              </a-option>
            </a-select>
          </a-form-item>
        </a-form>
      </a-modal>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { getPocDetail, updatePoc } from '@/api/poc.ts'
import { ExportPoc } from '@/api/report.ts'
import { listTasks } from '@/api/task.ts'
import { listVuls } from '@/api/vul.ts'
import { Notification } from '@arco-design/web-vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import MonacoEditor from '@/components/MonacoEditor.vue'
import { IconPen, IconDown, IconUp, IconExport, IconRefresh } from '@arco-design/web-vue/es/icon'
import WangEditor from '@/components/WangEditor.vue'
import { VulLevel, VulTypes } from '@/enums/enums.ts'
import AppSelector from '@/components/AppSelector.vue'
import PageHeader from '@/components/PageHeader.vue'
import PocChecker from '@/components/PocChecker.vue'

const { t } = useI18n()
const route = useRoute()
const visible = ref(false)
const showRuleEditor = ref(false)
const props = defineProps({
  poc_id: {
    type: String,
    default: '',
  },
})

const exportModalVisible = ref(false)
const tasksLoading = ref(false)
const taskOptions = ref<Array<{ instance_id: string; name: string }>>([])
const vulOptions = ref<Array<{ instance_id: string; name: string; vul_url: string }>>([])
const vulLoading = ref(false)
const exportConfig = reactive({
  includeVulReport: false,
  selectedVuls: [] as string[],
})

const pid = route.params.id as string
const loading = ref(true)
const updateLoading = ref(false)
const form = reactive({
  instance_id: '',
  name: '',
  app_instance_id: '',
  app_name: '',
  app_description: '',
  app_version: '',
  app_company: '',
  vul_description: '',
  vul_type: '',
  vul_path: '',
  vul_param: '',
  vul_reproduce: '',
  repair_suggestion: '',
  level: '',
  rule_link: '',
  fofa_finger: '',
  hunter_finger: '',
  create_time: '',
  update_time: '',
})
const selectAppId = ref('')
const app = ref({
  instance_id: '',
  name: '',
  description: '',
  version: '',
  company: '',
  fofa_finger: '',
  hunter_finger: '',
})
const options = ref<Array<{ instance_id: string; name: string; isNew: boolean }>>([])

const fetchData = async () => {
  loading.value = true
  const res = await getPocDetail({ instance_id: pid || props.poc_id })
  if (res.status !== 200) {
    Notification.warning(t('pages.poc.profile.serviceError'))
    return
  }
  if (res.data?.code === 0) {
    Object.assign(form, res.data?.data)
    selectAppId.value = form.app_instance_id
    Object.assign(app.value, {
      instance_id: form.app_instance_id,
      name: form.app_name,
      description: form.app_description,
      version: form.app_version,
      company: form.app_company,
      fofa_finger: form.fofa_finger,
      hunter_finger: form.hunter_finger,
    })
    options.value.push({
      instance_id: form.app_instance_id,
      name: form.app_name,
      isNew: true,
    })
  } else {
    Notification.warning(res.data?.message || t('pages.poc.profile.serviceError'))
  }
  loading.value = false
}

const toggleRuleEditor = () => {
  showRuleEditor.value = !showRuleEditor.value
}

onMounted(() => {
  fetchData()
})

const clickUpdate = async () => {
  updateLoading.value = true
  try {
    const res = await updatePoc({
      app_instance_id: app.value.instance_id,
      instance_id: form.instance_id,
      level: form.level,
      name: form.name,
      repair_suggestion: form.repair_suggestion,
      rule_link: form.rule_link,
      vul_description: form.vul_description,
      vul_param: form.vul_param,
      vul_path: form.vul_path,
      vul_reproduce: form.vul_reproduce,
      vul_type: form.vul_type,
    })
    if (res.status !== 200) {
      Notification.warning(t('pages.poc.profile.serviceError'))
      return
    }
    if (res.data?.code !== 0) {
      let msg = t('pages.poc.profile.updateFailed')
      if (res.data?.message !== '') {
        msg = res.data?.message
      }
      Notification.warning(msg)
      return
    }
    Notification.success({
      title: t('pages.poc.profile.updateSuccess'),
      content: t('pages.poc.profile.updateSuccessDesc'),
      duration: 3000,
    })
    window.scrollTo(0, 0)
    fetchData()
  } catch (error) {
    void error
    Notification.warning(t('pages.poc.profile.serviceError'))
  } finally {
    updateLoading.value = false
  }
}

function showCheck() {
  visible.value = true
}

function handleOk() {
  visible.value = false
}

const handleExportReport = () => {
  exportModalVisible.value = true
}

const closeExportModal = () => {
  exportModalVisible.value = false
  Object.assign(exportConfig, {
    includeVulReport: false,
    selectedVuls: [],
  })
}

const onVulReportToggle = (val: unknown) => {
  const value = Boolean(val)
  if (value) {
    loadVuls()
  } else {
    exportConfig.selectedVuls = []
  }
}

const loadVuls = async (searchName = '') => {
  vulLoading.value = true
  try {
    const pocId = pid || props.poc_id
    const res = await listVuls({
      size: 50,
      page: 1,
      name: searchName,
      poc_id: pocId,
    })
    if (res.status === 200 && res.data?.code === 0) {
      vulOptions.value = (res.data.data.items || []).map((vul: any) => ({
        instance_id: vul.instance_id,
        name: vul.name,
        vul_url: vul.vul_url,
      }))
    } else {
      Notification.warning(t('pages.poc.profile.vulLoadFailed'))
    }
  } catch (error) {
    console.error('Failed to load vulnerabilities:', error)
    Notification.error(t('pages.poc.profile.serviceError'))
  } finally {
    vulLoading.value = false
  }
}

const handleVulSearch = (value: string) => {
  loadVuls(value)
}

const handleExportConfirm = async (done: (closed: boolean) => void) => {
  if (exportConfig.includeVulReport && exportConfig.selectedVuls.length === 0) {
    Notification.warning(t('pages.poc.profile.pleaseSelectVuls'))
    done(false)
    return
  }

  try {
    // 调用ExportPoc API
    const res = await ExportPoc({
      poc_id: pid || props.poc_id,
      need_assets: false,
      need_reproduce: false,
      vul_id: exportConfig.includeVulReport ? exportConfig.selectedVuls : undefined,
    })

    if (res.status === 200 && res.data?.code === 0) {
      exportModalVisible.value = false // Explicitly close the modal
      setTimeout(() => {
        // Double-check that modal is closed
        if (exportModalVisible.value) {
          exportModalVisible.value = false
        }
      }, 100)

      Notification.success({
        title: t('pages.poc.profile.exportStarted'),
        content: t('pages.poc.profile.exportSuccess'),
        duration: 3000,
      })
      done(true) // Tell the modal it can close
    } else {
      Notification.error(res.data?.message || t('pages.poc.profile.exportFailed'))
      done(false)
    }
  } catch (error) {
    console.error('Export failed:', error)
    Notification.error(t('pages.poc.profile.exportFailed'))
    done(false)
  }
}
</script>

<style scoped>
.poc-profile-content {
  padding: 0 24px 40px;
}

.custom-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  margin-bottom: 16px;
  background-color: var(--color-bg-2);
}

.custom-header :deep(.arco-page-header) {
  padding: 16px 0;
  background-color: transparent;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.content-card {
  margin-bottom: 24px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.content-card :deep(.arco-card-header) {
  background-color: var(--color-bg-2);
  border-bottom: 1px solid var(--color-border-2);
  padding: 16px 20px;
}

.content-card :deep(.arco-card-body) {
  padding: 20px;
}

.card-title-with-button {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.app-info {
  padding: 8px 0;
  border-radius: 4px;
}

.app-info :deep(.arco-descriptions) {
  border: 1px solid var(--color-border-3);
}

.app-info :deep(.arco-descriptions-title) {
  font-weight: 500;
}

.action-buttons {
  display: flex;
  justify-content: flex-end;
  margin-top: 24px;
  padding: 16px 0;
  border-top: 1px solid var(--color-border-2);
}

.monaco-editor {
  width: 100%;
  min-height: 400px;
  border: 1px solid var(--color-border-2);
  border-radius: 4px;
}

.export-form {
  padding: 16px 0;
}

.export-option {
  margin-bottom: 16px;
}

.option-label {
  font-size: 14px;
  margin-left: 8px;
}

.vul-select {
  margin-top: 8px;
  margin-bottom: 0;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .poc-profile-content {
    padding: 0 12px 24px;
  }

  .content-card :deep(.arco-card-body) {
    padding: 16px;
  }

  .monaco-editor {
    min-height: 300px;
  }
}
</style>
