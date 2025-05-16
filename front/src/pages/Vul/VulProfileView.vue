<template>
  <div class="vul-profile">
    <PageHeader :title="t('pages.vul.profile.title')" />

    <!-- 全局loading遮罩 -->
    <a-spin :loading="pageLoading" tip="Loading..." class="global-spin">
      <!-- 报告名称编辑区域 -->
      <div class="report-name-container" v-if="!loading">
        <div v-if="!isEditingName" class="report-name-display">
          <h2 class="report-title">{{ form.name || t('pages.vul.profile.untitledReport') }}</h2>
          <a-button type="text" size="small" class="edit-button" @click="startEditName">
            <template #icon>
              <icon-edit />
            </template>
          </a-button>
        </div>
        <div v-else class="report-name-edit">
          <a-input
            v-model="tempName"
            :placeholder="t('pages.vul.profile.vulName')"
            style="width: 400px"
            allow-clear
            @keyup.enter="saveNameEdit"
            ref="nameInputRef"
          />
          <a-space>
            <a-button type="primary" size="small" @click="saveNameEdit">
              <template #icon>
                <icon-check />
              </template>
              {{ t('common.save') }}
            </a-button>
            <a-button size="small" @click="cancelNameEdit">
              <template #icon>
                <icon-close />
              </template>
              {{ t('common.cancel') }}
            </a-button>
          </a-space>
        </div>
      </div>

      <!-- 操作按钮区域 -->
      <div class="action-header">
        <div class="vul-title">
          <a-tag v-if="!loading" size="medium" color="arcoblue"
            >{{ t('pages.vul.profile.vulId') }} {{ form.instance_id }}</a-tag
          >
          <a-tag v-if="!loading && form.task_id" size="medium" color="orange"
            >{{ t('pages.vul.profile.taskId') }} {{ form.task_id }}</a-tag
          >
          <a-tag v-if="!loading" size="medium" class="update-time-tag"
            >{{ t('pages.vul.profile.updateTime') }} {{ form.update_time || '-' }}</a-tag
          >
        </div>
        <div class="action-buttons-top">
          <a-space>
            <a-button type="primary" @click="handleExportReport" :loading="exportLoading">
              <template #icon>
                <icon-export />
              </template>
              {{ t('pages.vul.profile.exportReport') }}
            </a-button>
            <a-button type="text" shape="circle" @click="refreshData" :loading="loading">
              <template #icon>
                <icon-refresh />
              </template>
            </a-button>
          </a-space>
        </div>
      </div>

      <div class="vul-profile-content">
        <a-spin :loading="loading">
          <!-- 第一部分：漏洞信息 -->
          <a-card class="content-card" :title="t('pages.vul.profile.vulInfo')">
            <a-descriptions
              :column="{ xs: 1, sm: 1, md: 2 }"
              bordered
              size="medium"
              class="desc-container"
            >
              <a-descriptions-item :label="t('pages.vul.profile.appName')">
                {{ form.app_name || '-' }}
              </a-descriptions-item>
              <a-descriptions-item :label="t('pages.vul.profile.pocName')">
                {{ form.poc_name || '-' }}
              </a-descriptions-item>
              <a-descriptions-item :label="t('pages.vul.profile.appDesc')" :span="2">
                {{ form.app_desc || '-' }}
              </a-descriptions-item>
              <a-descriptions-item :label="t('pages.vul.profile.pocDesc')" :span="2">
                {{ form.poc_desc || '-' }}
              </a-descriptions-item>
              <a-descriptions-item :label="t('pages.vul.profile.repairSuggestion')" :span="2">
                {{ form.repair_suggestion || '-' }}
              </a-descriptions-item>
              <a-descriptions-item :label="t('pages.vul.profile.vulUrl')" :span="2">
                <a-input
                  v-model="form.vul_url"
                  allow-clear
                  :placeholder="t('pages.vul.profile.vulUrl')"
                  @change="handleVulUrlChange"
                />
              </a-descriptions-item>
            </a-descriptions>
          </a-card>

          <!-- 第二部分：站点和应用信息 -->
          <a-card class="content-card">
            <template #title>
              <div class="card-title-with-button">
                <span>{{ t('pages.vul.profile.siteAndAppInfo') }}</span>
                <div class="button-container">
                  <a-space size="small">
                    <a-button
                      type="outline"
                      size="small"
                      @click="autoFillAssetInfo"
                      :loading="autoFillLoading"
                    >
                      <template #icon>
                        <icon-edit />
                      </template>
                      {{ t('pages.vul.profile.autoFillAssetInfo') }}
                    </a-button>
                    <a-button
                      type="primary"
                      size="small"
                      @click="updateHostInfo"
                      :loading="saveLoading"
                      status="success"
                    >
                      <template #icon>
                        <icon-save />
                      </template>
                      {{ t('pages.vul.profile.save') }}
                    </a-button>
                  </a-space>
                </div>
              </div>
            </template>
            <a-form ref="siteFormRef" :model="form" layout="vertical" class="site-form">
              <a-row :gutter="[24, 8]">
                <a-col :span="12">
                  <a-form-item field="host" :label="t('pages.vul.profile.host')">
                    <a-input v-model="form.host" allow-clear />
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item field="domain" :label="t('pages.vul.profile.domain')">
                    <a-input v-model="form.domain" allow-clear />
                  </a-form-item>
                </a-col>
              </a-row>

              <a-row :gutter="[24, 8]">
                <a-col :span="12">
                  <a-form-item field="ip_address" :label="t('pages.vul.profile.ipAddress')">
                    <a-input v-model="form.ip_address" allow-clear />
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item field="company" :label="t('pages.vul.profile.vendor')">
                    <a-input v-model="form.company" allow-clear />
                  </a-form-item>
                </a-col>
              </a-row>

              <a-row :gutter="[24, 8]">
                <a-col :span="12">
                  <a-form-item field="icp_number" :label="t('pages.vul.profile.icpNumber')">
                    <a-input v-model="form.icp_number" allow-clear />
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item field="industry" :label="t('pages.vul.profile.industry')">
                    <a-input v-model="form.industry" allow-clear />
                  </a-form-item>
                </a-col>
              </a-row>

              <a-row :gutter="[24, 8]">
                <a-col :span="12">
                  <a-form-item field="address" :label="t('pages.vul.profile.address')">
                    <a-input v-model="form.address" allow-clear />
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item
                    field="company_province"
                    :label="t('pages.vul.profile.companyProvince')"
                  >
                    <a-input v-model="form.company_province" allow-clear />
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item field="company_city" :label="t('pages.vul.profile.companyCity')">
                    <a-input v-model="form.company_city" allow-clear />
                  </a-form-item>
                </a-col>
              </a-row>

              <a-row :gutter="[24, 8]">
                <a-col :span="8">
                  <a-form-item
                    field="company_register_money"
                    :label="t('pages.vul.profile.companyRegisterMoney')"
                  >
                    <a-input-number
                      v-model="form.company_register_money"
                      :min="0"
                      :precision="0"
                      :max="99999999"
                      :step="1"
                      mode="button"
                      style="width: 100%"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="5">
                  <a-form-item field="baidu_rank" :label="t('pages.vul.profile.baiduRank')">
                    <a-input-number
                      v-model="form.baidu_rank"
                      :min="0"
                      :precision="0"
                      :max="99"
                      :step="1"
                      mode="button"
                      style="width: 100%"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="5">
                  <a-form-item field="yi_dong_rank" :label="t('pages.vul.profile.yiDongRank')">
                    <a-input-number
                      v-model="form.yi_dong_rank"
                      :min="0"
                      :precision="0"
                      :max="99"
                      :step="1"
                      mode="button"
                      style="width: 100%"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item field="google_rank" :label="t('pages.vul.profile.googleRank')">
                    <a-input-number
                      v-model="form.google_rank"
                      :min="0"
                      :precision="0"
                      :max="99"
                      :step="1"
                      mode="button"
                      style="width: 100%"
                    />
                  </a-form-item>
                </a-col>
              </a-row>

              <!-- 资产信息图片 -->
              <a-divider>{{ t('pages.vul.profile.assetImages') }}</a-divider>
              <div class="asset-images-container">
                <div class="asset-images-list">
                  <div
                    v-for="(image, index) in form.asset_images"
                    :key="index"
                    class="asset-image-item"
                  >
                    <div class="asset-image-wrapper">
                      <img :src="image" class="asset-image" @click="previewImage(image)" />
                      <div class="asset-image-actions">
                        <a-button
                          type="primary"
                          shape="circle"
                          size="mini"
                          status="danger"
                          @click="removeAssetImage(index)"
                        >
                          <template #icon><icon-delete /></template>
                        </a-button>
                      </div>
                    </div>
                    <div class="image-description-container">
                      <div class="description-text">
                        {{ form.asset_image_descs[index] || t('pages.vul.profile.noDescription') }}
                      </div>
                    </div>
                  </div>
                </div>
                <a-button type="outline" class="add-image-btn" @click="openAssetImageModal">
                  <template #icon><icon-plus /></template>
                  {{ t('pages.vul.profile.addImage') }}
                </a-button>
              </div>
            </a-form>
          </a-card>

          <!-- 第四部分：漏洞详情 / Flows -->
          <a-card
            class="content-card"
            :title="t('pages.vul.profile.vulInfo')"
            v-if="form.flows && form.flows.length > 0"
          >
            <a-collapse accordion class="flow-collapse" v-model:active-key="activeCollapseKey">
              <a-collapse-item
                v-for="(flow, index) in form.flows"
                :key="index.toString()"
                :header="
                  t('components.pocChecker.step') + ' ' + (index + 1) + ': ' + flow.description
                "
              >
                <div class="info-line">
                  <a-space size="large" :wrap="true">
                    <div class="info-item">
                      <span class="info-label">{{ t('components.pocChecker.path') }}:</span>
                      <span class="info-value">{{ flow.url }}</span>
                    </div>
                    <div class="info-item">
                      <span class="info-label">{{ t('components.pocChecker.status') }}:</span>
                      <a-tag color="arcoblue">{{ flow.status_code }}</a-tag>
                    </div>
                    <div class="info-item">
                      <span class="info-label">{{ t('components.pocChecker.timeCost') }}:</span>
                      <a-tag color="green"
                        >{{ flow.spend_time }} {{ t('components.pocChecker.milliseconds') }}</a-tag
                      >
                    </div>
                  </a-space>
                </div>
                <a-split
                  :style="{
                    height: '500px',
                    width: '100%',
                    border: '1px solid var(--color-border)',
                    marginTop: '16px',
                    overflow: 'hidden',
                  }"
                  :default-size="0.5"
                  :min="0.2"
                  :size-to-pixel="true"
                  class="flow-split"
                >
                  <template #first>
                    <div class="split-content">
                      <div class="split-header">{{ t('components.pocChecker.request') }}</div>
                      <a-typography-paragraph code class="code-block">
                        {{ flow.request_header }}
                      </a-typography-paragraph>
                      <a-typography-paragraph code class="code-block" v-if="flow.request_body">
                        {{ flow.request_body }}
                      </a-typography-paragraph>
                    </div>
                  </template>
                  <template #second>
                    <div class="split-content">
                      <div class="split-header">{{ t('components.pocChecker.response') }}</div>
                      <a-typography-paragraph code class="code-block">
                        {{ flow.response_header }}
                      </a-typography-paragraph>
                      <a-typography-paragraph code class="code-block" v-if="flow.response_body">
                        {{ flow.response_body }}
                      </a-typography-paragraph>
                    </div>
                  </template>
                </a-split>
              </a-collapse-item>
            </a-collapse>

            <!-- 补充截图 -->
            <a-divider>{{ t('pages.vul.profile.supplementaryImages') }}</a-divider>
            <div class="asset-images-container">
              <div class="asset-images-list">
                <div
                  v-for="(image, index) in form.supplementary_images"
                  :key="index"
                  class="supplementary-image-item"
                >
                  <div class="supplementary-image-wrapper">
                    <img :src="image" class="supplementary-image" @click="previewImage(image)" />
                    <div class="supplementary-image-actions">
                      <a-button
                        type="primary"
                        shape="circle"
                        size="mini"
                        status="danger"
                        @click="removeSupplementaryImage(index)"
                      >
                        <template #icon><icon-delete /></template>
                      </a-button>
                    </div>
                  </div>
                  <div class="image-description-container">
                    <div class="description-text">
                      {{
                        form.supplementary_image_descs[index] ||
                        t('pages.vul.profile.noDescription')
                      }}
                    </div>
                  </div>
                </div>
              </div>
              <a-button type="outline" class="add-image-btn" @click="openSupplementaryImageModal">
                <template #icon><icon-plus /></template>
                {{ t('pages.vul.profile.addImage') }}
              </a-button>
            </div>
          </a-card>

          <!-- 按钮区域 -->
          <div class="action-buttons">
            <a-space>
              <a-button size="large" @click="goBack">{{ t('pages.vul.profile.back') }}</a-button>
              <a-button
                type="primary"
                status="success"
                size="large"
                @click="submitVulDetail"
                :loading="submitLoading"
              >
                <template #icon>
                  <icon-check />
                </template>
                {{ t('pages.vul.profile.submit') }}
              </a-button>
            </a-space>
          </div>
        </a-spin>
      </div>
    </a-spin>

    <!-- 图片预览 -->
    <a-modal v-model:visible="imagePreviewVisible" footer-less width="auto">
      <img :src="previewImageUrl" style="max-width: 90vw; max-height: 80vh" />
    </a-modal>

    <!-- 资产图片上传模态框 -->
    <a-modal
      v-model:visible="assetImageModalVisible"
      :title="t('pages.vul.profile.uploadAssetImage')"
      @cancel="resetImageUpload"
    >
      <div class="upload-modal-content">
        <div class="upload-preview-area">
          <div v-if="!tempImageUrl" class="upload-placeholder" @click="triggerUpload">
            <icon-upload />
            <div class="upload-tip">{{ t('pages.vul.profile.clickToUpload') }}</div>
            <div class="paste-tip">{{ t('pages.vul.profile.orPasteImage') }}</div>
          </div>
          <div v-else class="upload-preview">
            <img :src="tempImageUrl" class="preview-image" />
            <div class="preview-actions">
              <a-button type="primary" status="danger" circle size="mini" @click="resetImageUpload">
                <template #icon><icon-delete /></template>
              </a-button>
            </div>
          </div>
        </div>

        <a-form-item :label="t('pages.vul.profile.imageDesc')">
          <a-textarea
            v-model="tempImageDesc"
            :placeholder="t('pages.vul.profile.imageDescPlaceholder')"
            allow-clear
            :auto-size="{ minRows: 3, maxRows: 5 }"
          />
        </a-form-item>

        <input
          type="file"
          ref="fileInput"
          accept="image/*"
          style="display: none"
          @change="handleTempFileUpload"
        />
      </div>
      <template #footer>
        <a-button @click="resetImageUpload">{{ t('common.cancel') }}</a-button>
        <a-button
          type="primary"
          :disabled="!tempImageFile"
          :loading="uploadLoading"
          @click="uploadAssetImage"
        >
          {{ t('pages.vul.profile.upload') }}
        </a-button>
      </template>
    </a-modal>

    <!-- 补充图片上传模态框 -->
    <a-modal
      v-model:visible="supplementaryImageModalVisible"
      :title="t('pages.vul.profile.uploadSupplementaryImage')"
      @cancel="resetImageUpload"
    >
      <div class="upload-modal-content">
        <div class="upload-preview-area">
          <div v-if="!tempImageUrl" class="upload-placeholder" @click="triggerUpload">
            <icon-upload />
            <div class="upload-tip">{{ t('pages.vul.profile.clickToUpload') }}</div>
            <div class="paste-tip">{{ t('pages.vul.profile.orPasteImage') }}</div>
          </div>
          <div v-else class="upload-preview">
            <img :src="tempImageUrl" class="preview-image" />
            <div class="preview-actions">
              <a-button type="primary" status="danger" circle size="mini" @click="resetImageUpload">
                <template #icon><icon-delete /></template>
              </a-button>
            </div>
          </div>
        </div>

        <a-form-item :label="t('pages.vul.profile.imageDesc')">
          <a-textarea
            v-model="tempImageDesc"
            :placeholder="t('pages.vul.profile.imageDescPlaceholder')"
            allow-clear
            :auto-size="{ minRows: 3, maxRows: 5 }"
          />
        </a-form-item>

        <input
          type="file"
          ref="fileInput"
          accept="image/*"
          style="display: none"
          @change="handleTempFileUpload"
        />
      </div>
      <template #footer>
        <a-button @click="resetImageUpload">{{ t('common.cancel') }}</a-button>
        <a-button
          type="primary"
          :disabled="!tempImageFile"
          :loading="uploadLoading"
          @click="uploadSupplementaryImage"
        >
          {{ t('pages.vul.profile.upload') }}
        </a-button>
      </template>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, watch, onUnmounted, nextTick } from 'vue'
import { getVulDetail, updateVul, getInfo } from '@/api/vul'
import { uploadImage, getImgs, deleteImg } from '@/api/common'
import { updateHost } from '@/api/host'
import { ExportVul } from '@/api/report'
import { Notification } from '@arco-design/web-vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import PageHeader from '@/components/PageHeader.vue'
import {
  IconExport,
  IconEdit,
  IconSave,
  IconDelete,
  IconPlus,
  IconCheck,
  IconClose,
  IconUpload,
  IconRefresh,
} from '@arco-design/web-vue/es/icon'
import * as dayjs from 'dayjs'
import myAxios from '@/request'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const loading = ref(true)
const pageLoading = ref(false)
const activeCollapseKey = ref<string[]>(['0'])
const exportLoading = ref(false)

// 图片数据接口
interface VulImage {
  instance_id: string
  desc: string
  img_url: string
}

// 漏洞流量接口定义
interface Flow {
  description: string
  url: string
  spend_time: number
  status_code: number
  request_header: string
  request_body: string
  response_header: string
  response_body: string
}

// 漏洞详情表单
const form = reactive({
  instance_id: '',
  create_time: '',
  update_time: '',
  name: '',
  task_id: '',
  task_name: '',
  poc_id: '',
  poc_name: '',
  poc_desc: '',
  app_name: '',
  app_desc: '',
  host: '',
  domain: '',
  ip_address: '',
  icp_number: '',
  company: '',
  address: '',
  company_city: '',
  company_province: '',
  industry: '',
  company_register_money: 0,
  baidu_rank: 0,
  yi_dong_rank: 0,
  google_rank: 0,
  vul_url: '',
  repair_suggestion: '',
  flows: [] as Flow[],
  asset_images: [] as string[], // Image URLs for display
  asset_image_descs: [] as string[],
  supplementary_images: [] as string[], // Image URLs for display
  supplementary_image_descs: [] as string[],
  target: '',
  proxy: '',
  save_poc: false,
  host_id: '', // Host ID for asset images
})

const siteFormRef = ref()
const fileInput = ref()
const imagePreviewVisible = ref(false)
const previewImageUrl = ref('')
const saveLoading = ref(false)
const autoFillLoading = ref(false)
const submitLoading = ref(false)
const assetImageModalVisible = ref(false)
const supplementaryImageModalVisible = ref(false)
const uploadLoading = ref(false)
const tempImageUrl = ref('')
const tempImageDesc = ref('')
const tempImageFile = ref<File | null>(null)
const currentUploadType = ref<'asset' | 'supplementary'>('asset')

// 报告名称编辑状态
const isEditingName = ref(false)
const tempName = ref('')
const nameInputRef = ref()

// Add debounce function to prevent multiple rapid API calls
const debounce = (fn: Function, delay = 300) => {
  let timer: number | null = null
  return function (...args: any[]) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn(...args)
      timer = null
    }, delay) as unknown as number
  }
}

// API update functions
const updateReportName = async () => {
  try {
    const res = await updateVul({
      instance_id: form.instance_id,
      name: form.name,
    })

    if (res.status === 200 && res.data?.code === 0) {
      Notification.success({
        title: t('pages.vul.profile.updateSuccess'),
        content: t('pages.vul.profile.reportNameUpdated'),
      })
    } else {
      Notification.error({
        title: t('pages.vul.profile.updateFailed'),
        content: res.data?.message || t('pages.vul.profile.updateError'),
      })
    }
  } catch (error) {
    console.error('Failed to update report name:', error)
    Notification.error({
      title: t('pages.vul.profile.updateFailed'),
      content: t('pages.vul.profile.updateError'),
    })
  }
}

const updateVulUrl = async () => {
  try {
    const res = await updateVul({
      instance_id: form.instance_id,
      vul_url: form.vul_url,
    })

    if (res.status === 200 && res.data?.code === 0) {
      Notification.success({
        title: t('pages.vul.profile.updateSuccess'),
        content: t('pages.vul.profile.vulUrlUpdated'),
      })
    } else {
      Notification.error({
        title: t('pages.vul.profile.updateFailed'),
        content: res.data?.message || t('pages.vul.profile.updateError'),
      })
    }
  } catch (error) {
    console.error('Failed to update vulnerability URL:', error)
    Notification.error({
      title: t('pages.vul.profile.updateFailed'),
      content: t('pages.vul.profile.updateError'),
    })
  }
}

// Debounced update functions
const debouncedUpdateName = debounce(updateReportName, 500)
const debouncedUpdateVulUrl = debounce(updateVulUrl, 500)

// Handlers for input changes
const handleNameChange = () => {
  debouncedUpdateName()
}

const handleVulUrlChange = () => {
  debouncedUpdateVulUrl()
}

// 获取完整的图片URL
const getFullImageUrl = (relativePath: string) => {
  if (!relativePath) return ''

  // 如果已经是完整URL，则直接返回
  if (relativePath.startsWith('http://') || relativePath.startsWith('https://')) {
    return relativePath
  }

  // 否则，添加后端基础URL前缀
  const baseURL = myAxios.defaults.baseURL || 'http://127.0.0.1:33333'

  // 确保路径格式正确（处理可能的双斜杠）
  if (relativePath.startsWith('/')) {
    return `${baseURL}${relativePath}`
  } else {
    return `${baseURL}/${relativePath}`
  }
}

// 触发文件选择器
const triggerUpload = () => {
  fileInput.value.click()
}

// 处理文件上传
const handleFileUpload = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    const file = target.files[0]
    if (file.type.startsWith('image/')) {
      // Create a URL for display
      const imageUrl = URL.createObjectURL(file)

      // Store the File object and URL
      if (form.asset_images.length < 3) {
        form.asset_images.push(imageUrl)
        form.asset_image_descs.push('')

        // Show notification to remind user to add description
        Notification.info({
          title: t('pages.vul.profile.imageUploaded'),
          content: t('pages.vul.profile.pleaseAddDescription'),
          duration: 3000,
        })
      }
    }
    // 重置文件输入，以便能够上传相同的文件
    target.value = ''
  }
}

// 移除图片
const removeImage = (index: number) => {
  // Revoke the object URL to prevent memory leaks
  URL.revokeObjectURL(form.asset_images[index])

  form.asset_images.splice(index, 1)
  form.asset_image_descs.splice(index, 1)
}

// 预览图片
const previewImage = (image: string) => {
  previewImageUrl.value = image
  imagePreviewVisible.value = true
}

// 预览补充截图
const previewSupplementaryImage = (image: string) => {
  previewImageUrl.value = image
  imagePreviewVisible.value = true
}

// 保存站点信息
const updateHostInfo = async () => {
  saveLoading.value = true
  try {
    if (!form.host_id) {
      Notification.error({
        title: t('pages.vul.profile.saveError'),
        content: t('pages.vul.profile.missingHostId'),
      })
      return
    }

    // 准备站点信息更新数据
    const hostData = {
      instance_id: form.host_id,
      host: form.host || '',
      domain: form.domain || '',
      ip_address: form.ip_address || '',
      icp_number: form.icp_number || '',
      company: form.company || '',
      address: form.address || '',
      company_city: form.company_city || '',
      company_province: form.company_province || '',
      industry: form.industry || '',
      company_register_money: form.company_register_money || 0,
      baidu_rank: form.baidu_rank || 0,
      yi_dong_rank: form.yi_dong_rank || 0,
      google_rank: form.google_rank || 0,
    }

    // 调用API保存站点信息
    const res = await updateHost(hostData)

    if (res.status === 200 && res.data?.code === 0) {
      Notification.success({
        title: t('pages.vul.profile.saveSuccess'),
        content: t('pages.vul.profile.saveSuccessDesc'),
      })
    } else {
      Notification.error({
        title: t('pages.vul.profile.saveError'),
        content: res.data?.message || t('pages.vul.profile.saveErrorDesc'),
      })
    }
  } catch (error) {
    console.error(`${t('pages.vul.profile.saveError')}:`, error)
    Notification.error({
      title: t('pages.vul.profile.saveError'),
      content: t('pages.vul.profile.saveErrorDesc'),
    })
  } finally {
    saveLoading.value = false
  }
}

const submitVulDetail = async () => {
  submitLoading.value = true
  try {
    // 提示功能待实现
    await new Promise((resolve) => setTimeout(resolve, 500))

    Notification.info({
      title: t('pages.vul.profile.submit'),
      content: t('pages.vul.profile.featureNotImplemented'),
    })
  } catch (error) {
    console.error(`${t('pages.vul.profile.submitError')}:`, error)
    Notification.error({
      title: t('pages.vul.profile.submitError'),
      content: t('pages.vul.profile.submitErrorDesc'),
    })
  } finally {
    submitLoading.value = false
  }
}

// 从服务器获取图片列表
const fetchImages = async () => {
  if (!form.instance_id) return

  try {
    // 获取资产图片 - 使用host_id
    if (form.host_id) {
      const assetRes = await getImgs({
        biz: 'vul_asset',
        instance_id: form.host_id, // 使用host_id而不是instance_id
      })

      if (assetRes.status === 200 && assetRes.data?.code === 0) {
        const assetImages = assetRes.data.data || []
        form.asset_images = assetImages.map((img: VulImage) => getFullImageUrl(img.img_url))
        form.asset_image_descs = assetImages.map((img: VulImage) => img.desc || '')
      }
    }

    // 获取补充图片 - 继续使用漏洞的instance_id
    const suppRes = await getImgs({
      biz: 'vul_desc',
      instance_id: form.instance_id,
    })

    if (suppRes.status === 200 && suppRes.data?.code === 0) {
      const suppImages = suppRes.data.data || []
      form.supplementary_images = suppImages.map((img: VulImage) => getFullImageUrl(img.img_url))
      form.supplementary_image_descs = suppImages.map((img: VulImage) => img.desc || '')
    }
  } catch (error) {
    console.error('Failed to fetch images:', error)
    Notification.error({
      title: t('pages.vul.profile.loadError'),
      content: t('pages.vul.profile.failedToLoadImages'),
    })
  }
}

// 处理粘贴事件，从剪贴板获取图片
const handlePaste = (event: ClipboardEvent) => {
  const items = event.clipboardData?.items
  if (!items) return

  // 查找剪贴板中的图片数据
  for (let i = 0; i < items.length; i++) {
    if (items[i].type.indexOf('image') !== -1) {
      // 获取图片文件
      const file = items[i].getAsFile()
      if (file) {
        // 创建临时URL用于预览
        tempImageUrl.value = URL.createObjectURL(file)
        tempImageFile.value = file

        // 显示成功提示
        Notification.success({
          title: t('pages.vul.profile.clipboardImage'),
          content: t('pages.vul.profile.imageFromClipboard'),
          duration: 3000,
        })
        break
      }
    }
  }
}

// 添加剪贴板事件监听
const addPasteListener = () => {
  document.addEventListener('paste', handlePaste)
}

// 移除剪贴板事件监听
const removePasteListener = () => {
  document.removeEventListener('paste', handlePaste)
}

// 修改打开资产图片上传模态框函数
const openAssetImageModal = () => {
  resetImageUpload()
  currentUploadType.value = 'asset'
  assetImageModalVisible.value = true
  // 添加剪贴板监听
  addPasteListener()
}

// 修改打开补充图片上传模态框函数
const openSupplementaryImageModal = () => {
  resetImageUpload()
  currentUploadType.value = 'supplementary'
  supplementaryImageModalVisible.value = true
  // 添加剪贴板监听
  addPasteListener()
}

// 处理临时文件上传
const handleTempFileUpload = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    const file = target.files[0]
    if (file.type.startsWith('image/')) {
      // 创建临时URL用于预览
      tempImageUrl.value = URL.createObjectURL(file)
      tempImageFile.value = file
    } else {
      Notification.warning({
        title: t('pages.vul.profile.invalidFileType'),
        content: t('pages.vul.profile.pleaseSelectImage'),
      })
    }
    // 重置文件输入，以便能够上传相同的文件
    target.value = ''
  }
}

// 修改重置图片上传状态函数，移除剪贴板监听器
const resetImageUpload = () => {
  if (tempImageUrl.value) {
    URL.revokeObjectURL(tempImageUrl.value)
  }
  tempImageUrl.value = ''
  tempImageDesc.value = ''
  tempImageFile.value = null
  assetImageModalVisible.value = false
  supplementaryImageModalVisible.value = false
  // 移除剪贴板监听
  removePasteListener()
}

// 移除资产图片
const removeAssetImage = async (index: number) => {
  try {
    // 获取资产图片列表
    const assetRes = await getImgs({
      biz: 'vul_asset',
      instance_id: form.host_id, // 使用host_id而不是instance_id
    })

    if (assetRes.status === 200 && assetRes.data?.code === 0) {
      const assetImages = assetRes.data.data || []
      if (assetImages.length > index) {
        // 调用删除图片API
        const imageId = assetImages[index].instance_id
        await deleteImg(imageId)
      }
    }

    // 从前端列表中移除
    form.asset_images.splice(index, 1)
    form.asset_image_descs.splice(index, 1)

    Notification.success({
      title: t('pages.vul.profile.deleteSuccess'),
      content: t('pages.vul.profile.imageDeletedSuccessfully'),
    })
  } catch (error) {
    console.error('Failed to delete asset image:', error)
    Notification.error({
      title: t('pages.vul.profile.deleteFailed'),
      content: t('pages.vul.profile.deleteError'),
    })
  }
}

// 移除补充图片
const removeSupplementaryImage = async (index: number) => {
  try {
    // 获取补充图片列表
    const suppRes = await getImgs({
      biz: 'vul_desc',
      instance_id: form.instance_id,
    })

    if (suppRes.status === 200 && suppRes.data?.code === 0) {
      const suppImages = suppRes.data.data || []
      if (suppImages.length > index) {
        // 调用删除图片API
        const imageId = suppImages[index].instance_id
        await deleteImg(imageId)
      }
    }

    // 从前端列表中移除
    form.supplementary_images.splice(index, 1)
    form.supplementary_image_descs.splice(index, 1)

    Notification.success({
      title: t('pages.vul.profile.deleteSuccess'),
      content: t('pages.vul.profile.imageDeletedSuccessfully'),
    })
  } catch (error) {
    console.error('Failed to delete supplementary image:', error)
    Notification.error({
      title: t('pages.vul.profile.deleteFailed'),
      content: t('pages.vul.profile.deleteError'),
    })
  }
}

// 上传资产图片
const uploadAssetImage = async () => {
  if (!form.host_id) {
    // 如果没有host_id，提示用户
    Notification.warning(t('common.uploadImages.missingInformation'))
    return
  }

  if (!tempImageFile.value) {
    Notification.warning(t('common.uploadImages.noImageSelected'))
    return
  }

  uploadLoading.value = true
  try {
    await uploadImage({
      biz: 'vul_asset',
      image: tempImageFile.value,
      instance_id: form.host_id, // 使用host_id而不是instance_id
      desc: tempImageDesc.value || '',
    })
    Notification.success(t('common.uploadImages.uploadedSuccessfully'))
    assetImageModalVisible.value = false
    tempImageFile.value = null
    tempImageDesc.value = ''
    // 上传成功后获取最新图片
    fetchImages()
  } catch (error) {
    console.error('Upload failed:', error)
    Notification.error(t('common.uploadImages.uploadFailed'))
  } finally {
    uploadLoading.value = false
  }
}

// 上传补充图片
const uploadSupplementaryImage = async () => {
  if (!form.instance_id) {
    // 如果没有实例ID，提示用户
    Notification.warning(t('common.uploadImages.missingInformation'))
    return
  }

  if (!tempImageFile.value) {
    Notification.warning(t('common.uploadImages.noImageSelected'))
    return
  }

  uploadLoading.value = true
  try {
    await uploadImage({
      biz: 'vul_desc',
      image: tempImageFile.value,
      instance_id: form.instance_id,
      desc: tempImageDesc.value || '',
    })
    Notification.success(t('common.uploadImages.uploadedSuccessfully'))
    supplementaryImageModalVisible.value = false
    tempImageFile.value = null
    tempImageDesc.value = ''
    // 上传成功后获取最新图片
    fetchImages()
  } catch (error) {
    console.error('Upload failed:', error)
    Notification.error(t('common.uploadImages.uploadFailed'))
  } finally {
    uploadLoading.value = false
  }
}

const fetchData = async () => {
  loading.value = true
  try {
    const vulId = route.params.id as string
    if (!vulId) {
      Notification.error(t('pages.vul.profile.emptyVulId'))
      router.push('/vuls')
      return
    }

    const res = await getVulDetail({ instance_id: vulId })
    if (res.status !== 200) {
      Notification.error(t('pages.vul.profile.serviceError'))
      return
    }

    if (res.data?.code === 0) {
      Object.assign(form, res.data?.data)
      // 如果存在flows并且有数据，默认展开第一个
      if (form.flows && form.flows.length > 0) {
        activeCollapseKey.value = ['0']
      }

      // 获取图片列表
      await fetchImages()
    } else {
      Notification.error(res.data?.message || t('pages.vul.profile.serviceError'))
    }
  } catch (error) {
    console.error(`${t('pages.vul.profile.loadError')}:`, error)
    Notification.error({
      title: t('pages.vul.profile.loadFailed'),
      content: t('pages.vul.profile.loadFailedDesc'),
    })
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  router.back()
}

const refreshData = () => {
  loading.value = true
  fetchData()
}

const autoFillAssetInfo = async () => {
  if (!form.instance_id) {
    Notification.warning({
      title: t('pages.vul.profile.autoFillAssetInfo'),
      content: t('pages.vul.profile.emptyVulId'),
    })
    return
  }

  try {
    // 显示loading状态
    autoFillLoading.value = true
    // 显示全局loading遮罩
    pageLoading.value = true

    // 调用获取信息接口
    const res = await getInfo({ instance_id: form.instance_id })

    if (res.status === 200 && res.data?.code === 0) {
      Notification.success({
        title: t('pages.vul.profile.autoFillAssetInfo'),
        content: t('pages.vul.profile.updateSuccess'),
      })

      // 刷新页面数据
      await fetchData()
    } else {
      Notification.error({
        title: t('pages.vul.profile.autoFillAssetInfo'),
        content: res.data?.message || t('pages.vul.profile.updateFailed'),
      })
    }
  } catch (error) {
    console.error('Failed to auto fill asset info:', error)
    Notification.error({
      title: t('pages.vul.profile.autoFillAssetInfo'),
      content: t('pages.vul.profile.updateError'),
    })
  } finally {
    autoFillLoading.value = false
    // 关闭全局loading遮罩
    pageLoading.value = false
  }
}

// 开始编辑名称
const startEditName = () => {
  tempName.value = form.name
  isEditingName.value = true
  // 等待DOM更新后聚焦输入框
  nextTick(() => {
    if (nameInputRef.value) {
      nameInputRef.value.focus()
    }
  })
}

// 保存名称编辑
const saveNameEdit = async () => {
  if (tempName.value !== form.name) {
    form.name = tempName.value
    try {
      const res = await updateVul({
        instance_id: form.instance_id,
        name: form.name,
      })

      if (res.status === 200 && res.data?.code === 0) {
        Notification.success({
          title: t('pages.vul.profile.updateSuccess'),
          content: t('pages.vul.profile.reportNameUpdated'),
        })
      } else {
        Notification.error({
          title: t('pages.vul.profile.updateFailed'),
          content: res.data?.message || t('pages.vul.profile.updateError'),
        })
      }
    } catch (error) {
      console.error('Failed to update report name:', error)
      Notification.error({
        title: t('pages.vul.profile.updateFailed'),
        content: t('pages.vul.profile.updateError'),
      })
    }
  }
  isEditingName.value = false
}

// 取消名称编辑
const cancelNameEdit = () => {
  isEditingName.value = false
}

// 处理导出报告
const handleExportReport = async () => {
  if (!form.instance_id) {
    Notification.warning({
      title: t('pages.vul.profile.exportFailed'),
      content: t('pages.vul.profile.noVulId'),
    })
    return
  }

  exportLoading.value = true
  try {
    const res = await ExportVul({
      vul_id: form.instance_id,
    })

    if (res.status === 200 && res.data?.code === 0) {
      Notification.success({
        title: t('pages.vul.profile.exportStarted'),
        content: t('pages.vul.profile.exportSuccess'),
        duration: 3000,
      })
    } else {
      Notification.error({
        title: t('pages.vul.profile.exportFailed'),
        content: res.data?.message || t('pages.vul.profile.exportError'),
      })
    }
  } catch (error) {
    console.error('Failed to export report:', error)
    Notification.error({
      title: t('pages.vul.profile.exportFailed'),
      content: t('pages.vul.profile.exportError'),
    })
  } finally {
    exportLoading.value = false
  }
}

onMounted(() => {
  fetchData()
})

// 确保在组件卸载时移除任何剪贴板事件监听器
onUnmounted(() => {
  removePasteListener()
})
</script>

<style scoped>
.vul-profile {
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  padding: 0 16px;
}

.vul-profile-content {
  padding: 0 16px 40px;
  overflow-x: visible;
}

.report-name-container {
  display: flex;
  align-items: center;
  margin: 0 24px 16px;
  padding: 8px 0;
}

.report-name-display {
  display: flex;
  align-items: center;
  position: relative;
}

.report-title {
  font-size: 24px;
  font-weight: 600;
  margin: 0;
  color: var(--color-text-1);
}

.edit-button {
  margin-left: 12px;
  opacity: 0.6;
  transition: opacity 0.2s;
}

.edit-button:hover {
  opacity: 1;
}

.report-name-edit {
  display: flex;
  align-items: center;
  gap: 12px;
}

.action-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 24px 16px;
  padding: 16px 0;
  border-bottom: 1px solid var(--color-border-2);
}

.vul-title {
  display: flex;
  align-items: center;
  flex: 1;
  overflow: hidden;
}

.vul-title :deep(.arco-typography) {
  margin: 0;
  color: var(--color-text-1);
  font-weight: 600;
}

.vul-title :deep(.arco-tag) {
  margin-left: 12px;
}

.update-time-tag {
  background-color: var(--color-fill-2);
  color: var(--color-text-2);
  border-color: var(--color-border-2);
}

.action-buttons-top {
  display: flex;
  justify-content: flex-end;
  flex-shrink: 0;
  margin-left: 16px;
}

.content-card {
  margin-bottom: 24px;
  border-radius: 8px;
  overflow: visible;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.content-card :deep(.arco-card-header) {
  background-color: var(--color-bg-2);
  border-bottom: 1px solid var(--color-border-2);
  padding: 16px 20px;
  z-index: 1;
  display: block;
  overflow: visible;
}

.content-card :deep(.arco-card-header-title) {
  overflow: visible;
  display: block;
}

.content-card :deep(.arco-card-body) {
  padding: 20px;
  overflow: visible;
}

.card-title-with-button {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  flex-wrap: wrap;
  gap: 10px;
}

.card-title-with-button span {
  font-size: 16px;
  font-weight: 500;
}

.card-title-with-button :deep(.arco-space) {
  margin-left: 0;
  flex-wrap: nowrap;
}

.card-title-with-button :deep(.arco-btn) {
  min-width: auto;
  white-space: nowrap;
}

.action-buttons {
  display: flex;
  justify-content: center;
  margin-top: 24px;
  padding: 16px 0;
  border-top: 1px solid var(--color-border-2);
}

.action-buttons :deep(.arco-space) {
  gap: 16px;
}

/* Flow collapse styles */
.flow-collapse {
  margin-top: 16px;
  width: 100%;
}

.code-block {
  font-family: monospace;
  white-space: pre-wrap;
  overflow-x: auto;
  padding: 8px;
  margin: 0;
  background-color: var(--color-bg-1);
  border-radius: 4px;
  width: 100%;
  box-sizing: border-box;
  font-size: 13px;
  line-height: 1.5;
}

.split-content {
  height: 100%;
  padding: 8px;
  overflow: auto;
  width: 100%;
}

.split-header {
  font-weight: bold;
  margin-bottom: 8px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--color-border);
  position: sticky;
  top: 0;
  background-color: var(--color-bg-1);
  z-index: 1;
}

/* Info Line Styling */
.info-line {
  padding: 12px 16px;
  background-color: var(--color-bg-1);
  border-radius: 4px;
  margin-bottom: 16px;
  overflow-x: auto;
}

.info-item {
  display: flex;
  align-items: center;
  white-space: normal;
  margin-right: 12px;
  margin-bottom: 4px;
}

.info-label {
  font-weight: 500;
  margin-right: 8px;
  color: var(--color-text-2);
}

.info-value {
  word-break: break-all;
  max-width: 600px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .vul-profile-content {
    padding: 0 12px 24px;
  }

  .action-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    margin: 0 12px 16px;
  }

  .action-buttons-top {
    margin-left: 0;
    width: 100%;
  }

  .action-buttons-top :deep(.arco-space) {
    width: 100%;
    justify-content: flex-end;
  }

  .content-card :deep(.arco-card-body) {
    padding: 16px;
  }

  .info-line :deep(.arco-space) {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .info-value {
    max-width: 100%;
  }

  .asset-images-list {
    justify-content: center;
  }

  .flow-split {
    height: 600px !important;
  }

  .card-title-with-button {
    flex-direction: column;
    align-items: flex-start;
  }

  .card-title-with-button :deep(.arco-space) {
    margin-top: 8px;
    width: 100%;
    justify-content: flex-start;
  }
}

.vul-info-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.vul-info-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.vul-info-label {
  font-weight: 500;
  color: var(--color-text-2);
  font-size: 14px;
}

.vul-info-value {
  color: var(--color-text-1);
  word-break: break-word;
}

.description-text {
  background-color: var(--color-fill-1);
  padding: 8px;
  border-radius: 4px;
  font-size: 14px;
  line-height: 1.6;
}

.desc-container {
  width: 100%;
  overflow: visible;
}

.desc-container :deep(.arco-descriptions-item-label) {
  font-weight: 500;
  background-color: var(--color-fill-2);
  width: 140px;
  white-space: nowrap;
  overflow: visible;
}

.desc-container :deep(.arco-descriptions-item-value) {
  padding: 12px 16px;
  line-height: 1.6;
  word-break: break-word;
  min-height: 48px;
  overflow: visible;
}

.asset-images-container {
  margin-top: 16px;
}

.asset-images-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 16px;
  justify-content: flex-start;
}

.asset-image-item {
  width: 220px;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
  border: 1px solid var(--color-border-2);
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.06);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.asset-image-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
}

.asset-image-wrapper {
  width: 100%;
  height: 160px;
  position: relative;
}

.asset-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  cursor: pointer;
}

.asset-image-actions {
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
  gap: 4px;
}

.asset-image-upload-container {
  width: 200px;
  height: 150px;
  border: 2px dashed var(--color-border-3);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
}

.asset-image-upload-container:hover {
  border-color: var(--color-primary-5);
  background-color: var(--color-fill-1);
}

.asset-image-upload {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: var(--color-text-3);
}

.asset-image-upload :deep(.arco-icon) {
  font-size: 24px;
}

.image-description-container {
  padding: 12px;
  background-color: var(--color-fill-1);
  border-top: 1px solid var(--color-border-2);
  flex-grow: 1;
}

.description-label {
  font-size: 12px;
  color: var(--color-text-3);
  margin-bottom: 6px;
  font-weight: 500;
}

.supplementary-image-item {
  width: 220px;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
  border: 1px solid var(--color-border-2);
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.06);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.supplementary-image-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
}

.supplementary-image-wrapper {
  width: 100%;
  height: 160px;
  position: relative;
}

.supplementary-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  cursor: pointer;
}

.supplementary-image-actions {
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
  gap: 4px;
}

.add-image-btn {
  margin-top: 8px;
  padding: 6px 16px;
  font-weight: 500;
}

.upload-modal-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.upload-preview-area {
  width: 100%;
  height: 240px;
  border: 1px dashed var(--color-border-3);
  border-radius: 8px;
  overflow: hidden;
}

.upload-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background-color: var(--color-fill-1);
  transition: all 0.3s;
}

.upload-placeholder:hover {
  background-color: var(--color-fill-2);
}

.upload-placeholder :deep(.arco-icon) {
  font-size: 40px;
  color: var(--color-text-3);
}

.upload-tip {
  margin-top: 16px;
  color: var(--color-text-3);
  font-size: 14px;
}

.paste-tip {
  margin-top: 8px;
  color: var(--color-text-3);
  font-size: 12px;
  opacity: 0.8;
}

.upload-preview {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.preview-actions {
  position: absolute;
  top: 8px;
  right: 8px;
}

.description-text {
  font-size: 13px;
  color: var(--color-text-2);
  line-height: 1.5;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.global-spin {
  width: 100%;
  height: 100%;

  :deep(.arco-spin-mask) {
    background-color: rgba(255, 255, 255, 0.6);
    z-index: 100;
  }

  :deep(.arco-spin-tip) {
    font-size: 16px;
    font-weight: 500;
  }
}

/* Additional responsive styles for medium screens */
@media (max-width: 1024px) {
  .vul-profile {
    max-width: 95%;
    padding: 0 8px;
  }

  .vul-profile-content {
    padding: 0 8px 24px;
  }

  .card-title-with-button span {
    font-size: 15px;
  }

  .card-title-with-button :deep(.arco-btn) {
    font-size: 13px;
    padding: 0 10px;
  }
}

.flow-split {
  max-width: 100%;
}

@media (max-width: 768px) {
  .action-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    margin: 0 12px 16px;
  }

  .action-buttons-top {
    margin-left: 0;
    width: 100%;
  }

  .card-title-with-button {
    flex-direction: column;
    align-items: flex-start;
  }

  .card-title-with-button .button-container {
    margin-top: 8px;
    width: 100%;
  }

  .card-title-with-button :deep(.arco-space) {
    margin-top: 0;
    width: 100%;
    justify-content: flex-start;
  }

  .action-buttons-top :deep(.arco-space) {
    width: 100%;
    justify-content: flex-end;
  }

  .content-card :deep(.arco-card-body) {
    padding: 16px 12px;
  }

  .content-card :deep(.arco-card-header) {
    padding: 12px 16px;
  }

  .flow-split {
    height: 600px !important;
  }

  /* Make split panels stack on small screens */
  .flow-split :deep(.arco-split-pane) {
    width: 100% !important;
    height: 50% !important;
    position: static !important;
    flex-direction: column;
  }

  .flow-split :deep(.arco-split-trigger) {
    display: none;
  }

  .asset-images-list {
    justify-content: center;
  }
}

/* 添加全局响应式样式 */
@media (max-width: 1366px) {
  .vul-profile {
    max-width: 1100px;
  }
}

@media (max-width: 1100px) {
  .vul-profile {
    max-width: 92%;
  }

  .asset-image-item, .supplementary-image-item {
    width: calc(50% - 15px);
    min-width: 200px;
  }
}

@media (max-width: 576px) {
  .vul-profile {
    max-width: 100%;
    padding: 0 8px;
  }

  .asset-image-item, .supplementary-image-item {
    width: 100%;
  }

  .report-name-edit {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .report-name-edit :deep(.arco-input) {
    width: 100% !important;
  }
}

/* 修复表单布局 */
.vul-profile :deep(.arco-form-item) {
  margin-bottom: 20px;
  overflow: visible;
}

.vul-profile :deep(.arco-form-item-label-col) {
  overflow: visible;
}

.vul-profile :deep(.arco-form-item-control-wrapper) {
  overflow: visible;
}

/* 确保下拉菜单和数值输入框显示正常 */
.vul-profile :deep(.arco-select-dropdown),
.vul-profile :deep(.arco-input-number-popup) {
  z-index: 1000;
}

/* 修复响应式表单布局 */
@media (max-width: 768px) {
  .vul-profile :deep(.arco-row) {
    margin-left: -8px !important;
    margin-right: -8px !important;
  }

  .vul-profile :deep(.arco-col) {
    padding-left: 8px !important;
    padding-right: 8px !important;
  }
}

.site-form {
  overflow: visible;
}

.site-form :deep(.arco-form-item-label) {
  padding-bottom: 4px;
}

.site-form :deep(.arco-row) {
  margin-bottom: 4px;
}

.site-form :deep(.arco-input-wrapper),
.site-form :deep(.arco-input-number),
.site-form :deep(.arco-select) {
  width: 100%;
}

.button-container {
  display: flex;
  flex-shrink: 0;
}

/* Reset any problematic overflow styles from Arco components */
.vul-profile :deep(.arco-btn) {
  overflow: visible;
  z-index: 2;
}

.vul-profile :deep(.arco-space) {
  overflow: visible;
}

.vul-profile :deep(.arco-input-wrapper) {
  overflow: visible;
}

.vul-profile :deep(.arco-form-item-control) {
  overflow: visible;
}

.vul-profile :deep(.arco-card) {
  overflow: visible;
}
</style>
