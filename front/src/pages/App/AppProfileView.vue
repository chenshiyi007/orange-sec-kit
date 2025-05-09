<template>
  <div class="app-profile">
    <PageHeader :title="t('pages.app.profile.title')"></PageHeader>
    <div class="app-profile-content">
      <a-form :model="form" layout="vertical">
        <!-- 基本信息卡片 -->
        <a-card class="content-card" :title="t('pages.app.profile.basicInfo')">
          <a-row :gutter="24">
            <a-col :span="16">
              <a-form-item field="name" :label="t('pages.app.profile.appName')" required>
                <a-input
                  v-model="form.name"
                  allow-clear
                  :placeholder="t('pages.app.profile.enterAppName')"
                ></a-input>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item field="instance_id" :label="t('pages.app.profile.appId')">
                <a-tag size="medium" color="arcoblue">{{
                  form.instance_id || t('pages.app.profile.new')
                }}</a-tag>
              </a-form-item>
            </a-col>
          </a-row>

          <a-row :gutter="24">
            <a-col :span="8">
              <a-form-item field="version" :label="t('pages.app.profile.version')">
                <a-input
                  v-model="form.version"
                  :placeholder="t('pages.app.profile.enterVersion')"
                ></a-input>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item field="company" :label="t('pages.app.profile.vendor')">
                <a-input
                  v-model="form.company"
                  :placeholder="t('pages.app.profile.enterVendor')"
                ></a-input>
              </a-form-item>
            </a-col>
          </a-row>

          <a-row :gutter="24">
            <a-col :span="12">
              <a-form-item field="fofa_finger" :label="t('pages.app.profile.fofaFingerprint')">
                <a-input
                  v-model="form.fofa_finger"
                  :placeholder="t('pages.app.profile.enterFofaFingerprint')"
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item field="hunter_finger" :label="t('pages.app.profile.hunterFingerprint')">
                <a-input
                  v-model="form.hunter_finger"
                  :placeholder="t('pages.app.profile.enterHunterFingerprint')"
                />
              </a-form-item>
            </a-col>
          </a-row>

          <a-divider style="margin: 16px 0" />

          <a-descriptions
            :column="{ xs: 1, sm: 2 }"
            bordered
            size="medium"
            :title="t('pages.app.profile.systemInfo')"
            style="margin-bottom: 16px"
          >
            <a-descriptions-item :label="t('pages.app.profile.createTime')">{{
              form.create_time || '-'
            }}</a-descriptions-item>
            <a-descriptions-item :label="t('pages.app.profile.updateTime')">{{
              form.update_time || '-'
            }}</a-descriptions-item>
          </a-descriptions>
        </a-card>

        <!-- 应用描述卡片 -->
        <a-card class="content-card" :title="t('pages.app.profile.appDescription')">
          <a-form-item field="app_description">
            <a-textarea
              :auto-size="{ minRows: 4, maxRows: 8 }"
              v-model="form.description"
              :placeholder="t('pages.app.profile.enterAppDescription')"
            />
          </a-form-item>
        </a-card>

        <!-- 操作按钮 -->
        <div class="action-buttons">
          <a-space>
            <a-button size="large">{{ t('pages.app.profile.cancel') }}</a-button>
            <a-button type="primary" size="large" @click="clickUpdate" :loading="updateLoading">
              <template #icon>
                <IconPen />
              </template>
              {{ t('pages.app.profile.save') }}
            </a-button>
          </a-space>
        </div>
      </a-form>
    </div>

    <!-- POC列表卡片 -->
    <a-card class="content-card" :title="t('pages.app.profile.pocList')">
      <div class="pocs-content">
        <PocListView :app_id="aid" :isShowAdd="true"></PocListView>
      </div>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { Notification } from '@arco-design/web-vue'
import { useRoute } from 'vue-router'
import { IconPen } from '@arco-design/web-vue/es/icon'
import { getAppDetail, updateApp } from '@/api/app.ts'
import PocListView from '@/pages/Poc/PocListView.vue'
import PageHeader from '@/components/PageHeader.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const route = useRoute()
const aid = ref(route.params.id as string)
const loading = ref(true)
const updateLoading = ref(false)
const form = reactive({
  instance_id: '',
  name: '',
  description: '',
  version: '',
  company: '',
  fofa_finger: '',
  hunter_finger: '',
  create_time: '',
  update_time: '',
})

const fetchAppData = async () => {
  loading.value = true
  const res = await getAppDetail({ instance_id: aid.value })
  if (res.status !== 200) {
    Notification.warning(t('pages.app.profile.serviceError'))
    return
  }
  if (res.data?.code === 0) {
    Object.assign(form, res.data?.data)
  } else {
    Notification.warning(res.data?.message || t('pages.app.profile.requestFailed'))
  }
  loading.value = false
}

onMounted(async () => {
  await fetchAppData()
})

const clickUpdate = async () => {
  updateLoading.value = true
  try {
    const res = await updateApp({
      instance_id: aid.value,
      name: form.name,
      description: form.description,
      version: form.version,
      company: form.company,
      fofa_finger: form.fofa_finger,
      hunter_finger: form.hunter_finger,
    })
    if (res.status !== 200) {
      Notification.warning(t('pages.app.profile.serviceError'))
      return
    }
    if (res.data?.code !== 0) {
      Notification.warning(res.data?.message || t('pages.app.profile.updateFailed'))
      return
    }
    Notification.success(t('pages.app.profile.updateSuccess'))
    await fetchAppData()
  } catch (error) {
    void error
    Notification.warning(t('pages.app.profile.serviceError'))
  } finally {
    updateLoading.value = false
  }
}
</script>

<style scoped>
.app-profile-content {
  padding: 0 24px 24px;
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

.action-buttons {
  display: flex;
  justify-content: flex-end;
  margin-top: 24px;
  padding: 16px 0;
  border-top: 1px solid var(--color-border-2);
}

.pocs-content {
  margin-top: 0;
}

.pocs-content :deep(.notes) {
  padding: 0;
}

.pocs-content :deep(.title) {
  margin-top: 0;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .app-profile-content {
    padding: 0 12px 24px;
  }

  .content-card :deep(.arco-card-body) {
    padding: 16px;
  }
}
</style>
