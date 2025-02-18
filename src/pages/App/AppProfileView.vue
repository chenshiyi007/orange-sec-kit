<template>
  <div class="app-profile">
    <PageHeader title="应用详情"></PageHeader>
    <div class="app-profile-content">
      <a-form :model="form" layout="vertical">
        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item field="instance_id" label="应用ID">
              <a-typography-text bold>
                {{ form.instance_id }}
              </a-typography-text>
            </a-form-item>
          </a-col>
          <a-col :span="10">
            <a-form-item field="name" label="应用名称">
              <a-input v-model="form.name"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item field="version" label="版本">
              <a-input v-model="form.version"></a-input>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item field="company" label="厂商">
              <a-input v-model="form.company"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item field="fofa_finger" label="FOFA 指纹">
              <a-input v-model="form.fofa_finger" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item field="hunter_finger" label="Hunter 指纹">
              <a-input v-model="form.hunter_finger" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="20">
            <a-form-item field="app_description" label="应用描述">
              <a-textarea :auto-size="{ minRows: 5, maxRows: 10 }" v-model="form.description" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item field="create_time" label="创建时间">
              <a-typography-text bold>
                {{ form.create_time }}
              </a-typography-text>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item field="update_time" label="更新时间">
              <a-typography-text bold>
                {{ form.update_time }}
              </a-typography-text>
            </a-form-item>
          </a-col>
          <a-col :span="4">
            <a-form-item>
              <a-button type="primary" shape="round" @click="clickUpdate" :loading="updateLoading">
                <template #icon>
                  <IconPen />
                </template>
                保存
              </a-button>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <div class="pocs-content">
      <div class="table">
        <PocListView :app_id="aid" :isShowAdd="true"></PocListView>
      </div>
    </div>
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
    Notification.warning('服务错误')
    return
  }
  if (res.data?.code === 0) {
    Object.assign(form, res.data?.data)
  } else {
    Notification.warning(res.data?.message || '请求失败')
  }
  loading.value = false
}

onMounted(async () => {
  await fetchAppData()
})

const clickUpdate = async () =>
{
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
      Notification.warning('服务错误')
      return
    }
    if (res.data?.code !== 0) {
      Notification.warning(res.data?.message || '更新失败')
      return
    }
    Notification.success('修改成功')
    await fetchAppData()
  } catch (error) {
    void error
    Notification.warning('服务错误')
  } finally {
    updateLoading.value = false
  }
}
</script>

<style scoped>
.app-profile-content {
  margin-top: 20px;
}
</style>
