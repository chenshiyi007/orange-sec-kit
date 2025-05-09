<template>
  <div class="burp-password-scanner">
    <h2>{{ t('pages.tools.passwordScanner.title') || '弱口令验证' }}</h2>
    <p>
      {{
        t('pages.tools.passwordScanner.description') ||
        '验证目标系统是否存在弱口令风险，支持多种服务类型'
      }}
    </p>

    <div class="burp-container">
      <a-spin :loading="loading" tip="验证中...">
        <!-- 主要内容区域 - 双列布局 -->
        <div class="scanner-row">
          <!-- 表单面板 -->
          <div class="form-panel">
            <div class="panel-header">
              <h3>{{ t('pages.tools.passwordScanner.configPanel') || '配置面板' }}</h3>
            </div>

            <a-form :model="formData" layout="vertical">
              <!-- 服务类型 -->
              <a-form-item
                field="model"
                :label="t('pages.tools.passwordScanner.modelType') || '服务类型'"
                required
              >
                <a-select
                  v-model="formData.model"
                  :placeholder="t('pages.tools.passwordScanner.selectModel') || '请选择服务类型'"
                  allow-clear
                >
                  <a-option v-for="model in modelList" :key="model" :value="model">{{
                    model
                  }}</a-option>
                </a-select>
              </a-form-item>

              <!-- 目标主机 -->
              <a-form-item
                field="host"
                :label="t('pages.tools.passwordScanner.targetHost') || '目标主机'"
                required
              >
                <a-input
                  v-model="formData.host"
                  :placeholder="t('pages.tools.passwordScanner.enterHost') || '请输入主机地址'"
                  allow-clear
                />
              </a-form-item>

              <!-- 端口 -->
              <a-form-item
                field="port"
                :label="t('pages.tools.passwordScanner.port') || '端口'"
                required
              >
                <a-input-number
                  v-model="formData.port"
                  :min="1"
                  :max="65535"
                  :placeholder="t('pages.tools.passwordScanner.enterPort') || '请输入端口'"
                  style="width: 100%"
                />
              </a-form-item>

              <!-- 超时时间 -->
              <a-form-item
                field="timeout"
                :label="t('pages.tools.passwordScanner.timeout') || '超时时间 (秒)'"
              >
                <a-input-number
                  v-model="formData.time_out"
                  :min="1"
                  :max="60"
                  :step="1"
                  :placeholder="t('pages.tools.passwordScanner.enterTimeout') || '请输入超时时间'"
                  style="width: 100%"
                />
              </a-form-item>

              <!-- 用户名 -->
              <a-form-item
                field="username"
                :label="t('pages.tools.passwordScanner.username') || '用户名'"
              >
                <a-input
                  v-model="formData.user_name"
                  :placeholder="
                    t('pages.tools.passwordScanner.enterUsername') || '请输入用户名（可选）'
                  "
                  allow-clear
                />
              </a-form-item>

              <!-- 密码 -->
              <a-form-item
                field="password"
                :label="t('pages.tools.passwordScanner.password') || '密码'"
              >
                <div class="password-input-container">
                  <a-input
                    v-model="formData.password"
                    :placeholder="
                      t('pages.tools.passwordScanner.enterPassword') || '请输入密码（可选）'
                    "
                    :type="showPassword ? 'text' : 'password'"
                    allow-clear
                  />
                  <a-button
                    class="password-toggle-btn"
                    type="text"
                    @click="togglePasswordVisibility"
                  >
                    <icon-eye v-if="showPassword" />
                    <icon-eye-invisible v-else />
                  </a-button>
                </div>
              </a-form-item>
            </a-form>

            <div class="panel-footer">
              <a-space>
                <a-button type="primary" status="success" @click="submitCheck" :disabled="loading">
                  <template #icon><icon-play-circle /></template>
                  {{ t('pages.tools.passwordScanner.startCheck') || '开始验证' }}
                </a-button>
                <a-button @click="resetForm" :disabled="loading">
                  <template #icon><icon-refresh /></template>
                  {{ t('pages.tools.passwordScanner.reset') || '重置' }}
                </a-button>
              </a-space>
            </div>
          </div>

          <!-- 结果面板 -->
          <div class="result-panel">
            <div class="panel-header">
              <h3>{{ t('pages.tools.passwordScanner.results') || '验证结果' }}</h3>
            </div>

            <div class="result-content">
              <div v-if="!resultData && !error" class="no-result">
                <a-empty
                  :description="
                    t('pages.tools.passwordScanner.noResults') || '尚未执行验证或无验证结果'
                  "
                />
              </div>

              <div v-if="error" class="error-result">
                <a-alert
                  type="error"
                  :title="t('pages.tools.passwordScanner.errorOccurred') || '发生错误'"
                  :content="error"
                  show-icon
                />
              </div>

              <div v-if="resultData" class="result-success">
                <a-result
                  :status="resultData.success ? 'success' : 'error'"
                  :title="
                    resultData.success
                      ? t('pages.tools.passwordScanner.weakPasswordFound') || '发现弱口令'
                      : t('pages.tools.passwordScanner.passwordSecure') || '未发现弱口令'
                  "
                >
                  <template #subtitle>
                    <div class="result-subtitle">
                      <div>
                        <strong
                          >{{ t('pages.tools.passwordScanner.targetHost') || '目标主机' }}:</strong
                        >
                        {{ formData.host }}:{{ formData.port }}
                      </div>
                      <div>
                        <strong
                          >{{ t('pages.tools.passwordScanner.serviceType') || '服务类型' }}:</strong
                        >
                        {{ formData.model }}
                      </div>
                      <!-- 始终显示message内容 -->
                      <div v-if="resultData.message" class="result-message">
                        {{ resultData.message }}
                      </div>
                    </div>
                  </template>
                </a-result>
              </div>
            </div>
          </div>
        </div>
      </a-spin>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { Message } from '@arco-design/web-vue'
import { getWeekPasswordModels, checkWeekPassword } from '@/api/tools'
import type { WeekPasswordCheck } from '@/api/tools'
import {
  IconRefresh,
  IconPlayCircle,
  IconEye,
  IconEyeInvisible,
} from '@arco-design/web-vue/es/icon'

const { t } = useI18n()

// 服务类型列表
const modelList = ref<string[]>([])

// 表单数据
const formData = reactive<WeekPasswordCheck>({
  model: '',
  host: '',
  port: 22,
  user_name: '',
  password: '',
  time_out: 10,
})

// 密码显示控制
const showPassword = ref(false)

// 加载和结果状态
const loading = ref(false)
const error = ref('')
const resultData = ref<any>(null)

// 切换密码显示/隐藏
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

// 获取服务类型列表
const fetchModelList = async () => {
  try {
    loading.value = true
    const res = await getWeekPasswordModels()
    if (res.data && res.data.code === 0 && res.data.data) {
      modelList.value = res.data.data
    } else {
      error.value = res.data?.message || '获取服务类型列表失败'
      Message.error(error.value)
    }
  } catch (err: any) {
    error.value = err.message || '获取服务类型列表失败'
    Message.error(error.value)
  } finally {
    loading.value = false
  }
}

// 提交检测请求
const submitCheck = async () => {
  if (!validateForm()) return

  try {
    loading.value = true
    error.value = ''
    resultData.value = null

    const res = await checkWeekPassword(formData)
    if (res.data && res.data.code === 0) {
      // 接口返回 {code:0, message:string, data:boolean}
      // data为true表示存在弱口令，false表示不存在
      resultData.value = {
        success: res.data.data, // 直接使用返回的boolean值
        message: res.data.message, // 保存message信息
      }

      Message.success(
        resultData.value.success
          ? t('pages.tools.passwordScanner.checkCompleteWeakFound') || '验证完成，发现弱口令'
          : t('pages.tools.passwordScanner.checkCompleteNoWeak') || '验证完成，未发现弱口令',
      )
    } else {
      error.value = res.data?.message || '验证失败'
      Message.error(error.value)
    }
  } catch (err: any) {
    error.value = err.message || '验证请求失败'
    Message.error(error.value)
  } finally {
    loading.value = false
  }
}

// 表单验证
const validateForm = () => {
  if (!formData.model) {
    Message.warning(t('pages.tools.passwordScanner.modelRequired') || '请选择服务类型')
    return false
  }
  if (!formData.host) {
    Message.warning(t('pages.tools.passwordScanner.hostRequired') || '请输入目标主机')
    return false
  }
  if (!formData.port || formData.port < 1 || formData.port > 65535) {
    Message.warning(
      t('pages.tools.passwordScanner.validPortRequired') || '请输入有效的端口号(1-65535)',
    )
    return false
  }
  return true
}

// 重置表单
const resetForm = () => {
  formData.model = ''
  formData.host = ''
  formData.port = 22
  formData.user_name = ''
  formData.password = ''
  formData.time_out = 10
  error.value = ''
  resultData.value = null
}

// 组件挂载时获取服务类型列表
onMounted(() => {
  fetchModelList()
})
</script>

<style scoped>
.burp-password-scanner {
  padding: 16px;
}

.burp-container {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.scanner-row {
  display: flex;
  gap: 16px;
}

.form-panel,
.result-panel {
  flex: 1;
  background-color: var(--color-bg-2);
  padding: 16px;
  border-radius: 4px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.panel-header h3 {
  margin: 0;
  font-size: 16px;
}

.panel-footer {
  margin-top: 16px;
  display: flex;
  justify-content: center;
  gap: 8px;
}

.result-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.no-result {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  color: var(--color-text-3);
}

.error-result,
.result-success {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.result-success :deep(.arco-result) {
  padding: 24px 0;
}

.result-subtitle {
  margin-top: 16px;
  font-size: 14px;
  line-height: 1.6;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

.result-message {
  margin-top: 16px;
  padding: 12px 16px;
  background-color: var(--color-fill-2);
  border-radius: 4px;
  font-size: 14px;
  color: var(--color-text-2);
  line-height: 1.6;
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

/* 适配移动设备 */
@media (max-width: 1024px) {
  .scanner-row {
    flex-direction: column;
  }
}
</style>
