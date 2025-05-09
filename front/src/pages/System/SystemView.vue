<template>
  <div class="container">
    <!-- 系统信息卡片 -->
    <a-card class="config-card system-info-card">
      <template #title>
        <div class="card-title">
          <icon-info-circle />
          <span>{{ t('pages.system.systemInfo') }}</span>
        </div>
      </template>
      <div class="info-section">
        <div class="info-row">
          <span class="info-label">{{ t('pages.system.engineVersion') }}：</span>
          <a-tag color="arcoblue" size="medium">{{ formData.engine_version }}</a-tag>
        </div>
      </div>
    </a-card>
    <!-- 语言设置卡片 -->
    <a-card class="config-card language-card">
      <template #title>
        <div class="card-title">
          <icon-language />
          <span>{{ t('pages.system.languageSettings') }}</span>
        </div>
      </template>
      <div class="language-section">
        <div class="language-label">{{ t('pages.system.selectLanguage') }}:</div>
        <div class="language-selector">
          <LanguageSwitch />
        </div>
      </div>
    </a-card>

    <!-- 搜索引擎配置卡片 -->
    <a-card class="config-card search-engines-card">
      <template #title>
        <div class="card-title">
          <icon-search />
          <span>{{ t('pages.system.searchEngineConfig') }}</span>
        </div>
      </template>
      <a-form :model="formData" layout="vertical" class="compact-form">
        <!-- FOFA配置 -->
        <div class="section-container">
          <div class="section-header">
            <icon-code />
            <span>{{ t('pages.system.fofaConfig') }}</span>
          </div>
          <a-row :gutter="16">
            <a-col :span="16">
              <a-form-item field="fofa_key" :label="t('pages.system.fofaApiKey')">
                <div class="password-input-container">
                  <a-input
                    v-model="formData.fofa_key"
                    :placeholder="t('pages.system.enterFofaApiKey')"
                    allow-clear
                    :type="showFofaPassword ? 'text' : 'password'"
                    @change="updateFofaConfig"
                  />
                  <a-button class="password-toggle-btn" type="text" @click="toggleFofaPassword">
                    <icon-eye v-if="showFofaPassword" />
                    <icon-eye-invisible v-else />
                  </a-button>
                </div>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item field="fofa_max_count_enabled" :label="t('pages.system.limitMaxCount')">
                <a-switch v-model="fofaMaxCountEnabled" @change="handleFofaMaxCountToggle" />
                <a-input-number
                  v-if="fofaMaxCountEnabled"
                  v-model="formData.fofa_max_count"
                  :placeholder="t('pages.system.enterMaxCount')"
                  :min="1"
                  :max="10000"
                  :step="100"
                  class="max-count-input"
                  @change="updateFofaConfig"
                />
                <div class="form-tip" v-if="fofaMaxCountEnabled">
                  {{ t('pages.system.valueRange') }}
                </div>
              </a-form-item>
            </a-col>
          </a-row>
        </div>

        <!-- Hunter配置 -->
        <div class="section-container">
          <div class="section-header">
            <icon-search />
            <span>{{ t('pages.system.hunterConfig') }}</span>
          </div>
          <a-row :gutter="16">
            <a-col :span="16">
              <a-form-item field="hunter_key" :label="t('pages.system.hunterApiKey')">
                <div class="password-input-container">
                  <a-input
                    v-model="formData.hunter_key"
                    :placeholder="t('pages.system.enterHunterApiKey')"
                    allow-clear
                    :type="showHunterPassword ? 'text' : 'password'"
                    @change="updateHunterConfig"
                  />
                  <a-button class="password-toggle-btn" type="text" @click="toggleHunterPassword">
                    <icon-eye v-if="showHunterPassword" />
                    <icon-eye-invisible v-else />
                  </a-button>
                </div>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item
                field="hunter_max_count_enabled"
                :label="t('pages.system.limitMaxCount')"
              >
                <a-switch v-model="hunterMaxCountEnabled" @change="handleHunterMaxCountToggle" />
                <a-input-number
                  v-if="hunterMaxCountEnabled"
                  v-model="formData.hunter_max_count"
                  :placeholder="t('pages.system.enterMaxCount')"
                  :min="1"
                  :max="10000"
                  :step="100"
                  class="max-count-input"
                  @change="updateHunterConfig"
                />
                <div class="form-tip" v-if="hunterMaxCountEnabled">
                  {{ t('pages.system.valueRange') }}
                </div>
              </a-form-item>
            </a-col>
          </a-row>
        </div>

        <!-- 爱站配置 -->
        <div class="section-container">
          <div class="section-header">
            <icon-code />
            <span>{{ t('pages.system.aiZhanConfig') }}</span>
          </div>
          <a-row :gutter="16">
            <a-col :span="16">
              <a-form-item field="ai_zhan_token" :label="t('pages.system.aiZhanToken')">
                <div class="password-input-container">
                  <a-input
                    v-model="formData.ai_zhan_token"
                    :placeholder="t('pages.system.enterAiZhanToken')"
                    allow-clear
                    :type="showAiZhanPassword ? 'text' : 'password'"
                    @change="updateAiZhanConfig"
                  />
                  <a-button class="password-toggle-btn" type="text" @click="toggleAiZhanPassword">
                    <icon-eye v-if="showAiZhanPassword" />
                    <icon-eye-invisible v-else />
                  </a-button>
                </div>
                <a-tooltip position="right">
                  <template #content>
                    {{ t('pages.system.aiZhanTokenHelp') }}
                  </template>
                  <a-link @click="openAiZhanTokenUrl" class="token-help-link">
                    <icon-question-circle class="token-help-icon" />
                  </a-link>
                </a-tooltip>
              </a-form-item>
            </a-col>
          </a-row>
        </div>
      </a-form>
    </a-card>

    <!-- 文件夹配置卡片 -->
    <a-card class="config-card">
      <template #title>
        <div class="card-title">
          <icon-folder />
          <span>{{ t('pages.system.folderPathConfig') }}</span>
        </div>
      </template>
      <a-form :model="formData" layout="vertical" class="compact-form">
        <div class="section-container">
          <a-form-item field="site_collect_folder" :label="t('pages.system.siteCollectFolder')">
            <FolderSelector
              v-model:folderPath="formData.site_collect_folder"
              width="100%"
              @folder-selected="handleSiteCollectFolderSelected"
            />
          </a-form-item>
          <a-form-item field="report_export_folder" :label="t('pages.system.reportExportFolder')">
            <FolderSelector
              v-model:folderPath="formData.report_export_folder"
              width="100%"
              @folder-selected="handleReportExportFolderSelected"
            />
          </a-form-item>
          <a-form-item field="app_export_folder" :label="t('pages.system.appExportFolder')">
            <FolderSelector
              v-model:folderPath="formData.app_export_folder"
              width="100%"
              @folder-selected="handleAppExportFolderSelected"
            />
          </a-form-item>
        </div>
      </a-form>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { Message } from '@arco-design/web-vue'
import FolderSelector from '@/components/FolderSelector.vue'
import LanguageSwitch from '@/components/LanguageSwitch.vue'
import { getSystemConfig, saveSystemConfig } from '@/api/system'
import { useI18n } from 'vue-i18n'
import {
  IconSettings,
  IconSearch,
  IconFolder,
  IconRefresh,
  IconCode,
  IconSave,
  IconInfoCircle,
  IconLanguage,
  IconEye,
  IconEyeInvisible,
  IconQuestionCircle,
} from '@arco-design/web-vue/es/icon'

const { t } = useI18n()
const isDevelopment = import.meta.env.DEV

interface SystemConfig {
  fofa_key: string
  fofa_max_count: number
  hunter_key: string
  hunter_max_count: number
  ai_zhan_token: string
  site_collect_folder: string
  report_export_folder: string
  app_export_folder: string
  engine_version: string
}

const formData = ref<SystemConfig>({
  fofa_key: '',
  fofa_max_count: 0,
  hunter_key: '',
  hunter_max_count: 0,
  ai_zhan_token: '',
  site_collect_folder: '',
  report_export_folder: '',
  app_export_folder: '',
  engine_version: 'v1.0.0',
})

const loading = ref(false)
const updateLoading = ref(false)

// 最大数量限制开关状态
const fofaMaxCountEnabled = ref(false)
const hunterMaxCountEnabled = ref(false)

// 密码显示开关状态
const showFofaPassword = ref(false)
const showHunterPassword = ref(false)
const showAiZhanPassword = ref(false)

// 获取系统配置
const fetchSystemConfig = async () => {
  try {
    loading.value = true
    const res = await getSystemConfig()
    if (res.status !== 200) {
      Message.error(t('pages.system.getConfigFailed'))
      return
    }
    if (res.data.code !== 0) {
      Message.error(res.data.message || t('pages.system.getConfigFailed'))
      return
    }

    // 更新表单数据
    const data = res.data.data
    formData.value = {
      fofa_key: data.fofa_key || '',
      fofa_max_count: data.fofa_max_count || 0,
      hunter_key: data.hunter_key || '',
      hunter_max_count: data.hunter_max_count || 0,
      ai_zhan_token: data.ai_zhan_token || '',
      site_collect_folder: data.site_collect_folder || '',
      report_export_folder: data.report_export_folder || '',
      app_export_folder: data.app_export_folder || '',
      engine_version: data.engine_version || formData.value.engine_version,
    } as SystemConfig

    // 设置开关状态
    fofaMaxCountEnabled.value = formData.value.fofa_max_count > 0
    hunterMaxCountEnabled.value = formData.value.hunter_max_count > 0
  } catch (error) {
    console.error('获取系统配置失败', error)
    Message.error(t('pages.system.getConfigFailed'))
  } finally {
    loading.value = false
  }
}

// 更新FOFA配置
const updateFofaConfig = async () => {
  if (updateLoading.value) return
  try {
    updateLoading.value = true

    // 创建要提交的配置数据（只包含FOFA相关配置）
    const configToSave = {
      fofa_key: formData.value.fofa_key,
      fofa_max_count: fofaMaxCountEnabled.value ? formData.value.fofa_max_count : 0,
      hunter_key: formData.value.hunter_key,
      hunter_max_count: formData.value.hunter_max_count,
      ai_zhan_token: formData.value.ai_zhan_token,
      site_collect_folder: formData.value.site_collect_folder,
      report_export_folder: formData.value.report_export_folder,
      app_export_folder: formData.value.app_export_folder,
      license_path: '',
    }

    const res = await saveSystemConfig(configToSave)
    if (res.status !== 200 || res.data.code !== 0) {
      Message.error(res.data.message || t('pages.system.updateFofaConfigFailed'))
      return
    }
    Message.success(t('pages.system.updateFofaConfigSuccess'))
  } catch (error) {
    console.error('更新FOFA配置失败', error)
    Message.error(t('pages.system.updateFofaConfigFailed'))
  } finally {
    updateLoading.value = false
  }
}

// 更新Hunter配置
const updateHunterConfig = async () => {
  if (updateLoading.value) return
  try {
    updateLoading.value = true

    // 创建要提交的配置数据（只包含Hunter相关配置）
    const configToSave = {
      fofa_key: formData.value.fofa_key,
      fofa_max_count: formData.value.fofa_max_count,
      hunter_key: formData.value.hunter_key,
      hunter_max_count: hunterMaxCountEnabled.value ? formData.value.hunter_max_count : 0,
      ai_zhan_token: formData.value.ai_zhan_token,
      site_collect_folder: formData.value.site_collect_folder,
      report_export_folder: formData.value.report_export_folder,
      app_export_folder: formData.value.app_export_folder,
      license_path: '',
    }

    const res = await saveSystemConfig(configToSave)
    if (res.status !== 200 || res.data.code !== 0) {
      Message.error(res.data.message || t('pages.system.updateHunterConfigFailed'))
      return
    }
    Message.success(t('pages.system.updateHunterConfigSuccess'))
  } catch (error) {
    console.error('更新Hunter配置失败', error)
    Message.error(t('pages.system.updateHunterConfigFailed'))
  } finally {
    updateLoading.value = false
  }
}

// 更新爱站配置
const updateAiZhanConfig = async () => {
  if (updateLoading.value) return
  try {
    updateLoading.value = true

    const configToSave = {
      fofa_key: formData.value.fofa_key,
      fofa_max_count: formData.value.fofa_max_count,
      hunter_key: formData.value.hunter_key,
      hunter_max_count: formData.value.hunter_max_count,
      ai_zhan_token: formData.value.ai_zhan_token,
      site_collect_folder: formData.value.site_collect_folder,
      report_export_folder: formData.value.report_export_folder,
      app_export_folder: formData.value.app_export_folder,
      license_path: '',
    }

    const res = await saveSystemConfig(configToSave)
    if (res.status !== 200 || res.data.code !== 0) {
      Message.error(res.data.message || t('pages.system.updateAiZhanConfigFailed'))
      return
    }
    Message.success(t('pages.system.updateAiZhanConfigSuccess'))
  } catch (error) {
    Message.error(t('pages.system.updateAiZhanConfigFailed'))
  } finally {
    updateLoading.value = false
  }
}

// 处理FOFA最大数量开关切换
const handleFofaMaxCountToggle = async (value: string | number | boolean) => {
  const enabled = Boolean(value)
  if (!enabled) {
    formData.value.fofa_max_count = 0
    await updateFofaConfig()
  }
}

// 处理Hunter最大数量开关切换
const handleHunterMaxCountToggle = async (value: string | number | boolean) => {
  const enabled = Boolean(value)
  if (!enabled) {
    formData.value.hunter_max_count = 0
    await updateHunterConfig()
  }
}

// 处理文件夹选择事件
const handleSiteCollectFolderSelected = (path: string) => {
  formData.value.site_collect_folder = path;
  updateFolderConfig(path);
};

const handleReportExportFolderSelected = (path: string) => {
  formData.value.report_export_folder = path;
  updateFolderConfig(path);
};

const handleAppExportFolderSelected = (path: string) => {
  formData.value.app_export_folder = path;
  updateFolderConfig(path);
};

// 切换 FOFA 密码显示
const toggleFofaPassword = () => {
  showFofaPassword.value = !showFofaPassword.value
}

// 切换 Hunter 密码显示
const toggleHunterPassword = () => {
  showHunterPassword.value = !showHunterPassword.value
}

// 切换 爱站 密码显示
const toggleAiZhanPassword = () => {
  showAiZhanPassword.value = !showAiZhanPassword.value
}

// 打开爱站Token获取页面
const openAiZhanTokenUrl = () => {
  // 检查是否在electron环境中
  if (window.electronAPI && window.electronAPI.openExternal) {
    window.electronAPI.openExternal('https://apistore.aizhan.com/detail/23/')
  } else {
    // 非electron环境的回退方案
    window.open('https://apistore.aizhan.com/detail/23/', '_blank', 'noopener,noreferrer')
  }
}

// 监听开关状态变化
watch(fofaMaxCountEnabled, (enabled) => {
  if (!enabled) {
    formData.value.fofa_max_count = 0
  }
})

watch(hunterMaxCountEnabled, (enabled) => {
  if (!enabled) {
    formData.value.hunter_max_count = 0
  }
})

// 更新文件夹配置
const updateFolderConfig = async (selectedPath?: string) => {
  if (updateLoading.value) return
  try {
    updateLoading.value = true

    const configToSave = {
      fofa_key: formData.value.fofa_key,
      fofa_max_count: formData.value.fofa_max_count,
      hunter_key: formData.value.hunter_key,
      hunter_max_count: formData.value.hunter_max_count,
      ai_zhan_token: formData.value.ai_zhan_token,
      site_collect_folder: formData.value.site_collect_folder,
      report_export_folder: formData.value.report_export_folder,
      app_export_folder: formData.value.app_export_folder,
      license_path: '',
    }

    const res = await saveSystemConfig(configToSave)
    if (res.status !== 200 || res.data.code !== 0) {
      Message.error(res.data.message || t('pages.system.updateFolderConfigFailed'))
      return
    }
    Message.success(t('pages.system.updateFolderConfigSuccess'))
  } catch (error) {
    console.error('更新文件夹配置失败', error)
    Message.error(t('pages.system.updateFolderConfigFailed'))
  } finally {
    updateLoading.value = false
  }
}

onMounted(() => {
  fetchSystemConfig()
})
</script>

<style scoped>
.container {
  padding: 16px;
  max-width: 1000px;
  margin: 0 auto;
}

.config-card {
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  margin-bottom: 16px;
}

.language-card {
  margin-bottom: 16px;
}

.system-info-card {
  margin-bottom: 16px;
}

.search-engines-card {
  margin-bottom: 16px;
}

.card-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
}

.compact-form {
  padding: 8px;
}

.section-container {
  background-color: #f9f9fa;
  border-radius: 6px;
  padding: 16px;
  margin-bottom: 20px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 500;
  margin-bottom: 16px;
  color: #1d2129;
}

.form-tip {
  font-size: 12px;
  color: #86909c;
  margin-top: 4px;
}

.max-count-input {
  margin-top: 8px;
  width: 100%;
}

:deep(.arco-switch) {
  margin-top: 2px;
}

:deep(.arco-form-item-wrapper) {
  margin-bottom: 16px;
}

:deep(.arco-form-item:last-child .arco-form-item-wrapper) {
  margin-bottom: 0;
}

.info-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.info-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.info-label {
  font-size: 14px;
  font-weight: 500;
  color: #1d2129;
}

.language-section {
  display: flex;
  align-items: center;
  padding: 8px 0;
}

.language-label {
  font-size: 14px;
  font-weight: 500;
  margin-right: 16px;
  color: #1d2129;
  min-width: 100px;
}

.language-selector {
  flex: 1;
}

.language-selector :deep(.language-switch) {
  margin-left: 0;
}

.password-input-container {
  position: relative;
  display: flex;
  width: 100%;
}

.password-input-container :deep(.arco-input-wrapper) {
  flex: 1;
}

.password-toggle-btn {
  position: absolute;
  right: 34px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
  color: #86909c;
  height: auto;
  padding: 4px;
  margin: 0;
  border-radius: 50%;
}

.password-toggle-btn:hover {
  color: #165dff;
  background-color: rgba(22, 93, 255, 0.05);
}

.token-help-link {
  margin-left: 8px;
  color: #86909c;
  text-decoration: none;
}

.token-help-icon {
  margin-left: 8px;
}
</style>
