<template>
  <div class="app-profile-content">
    <a-form :model="form" layout="vertical" ref="formRef" @submit="addAppHandler">
      <a-row>
        <a-col :span="24">
          <a-form-item field="name" label="应用名称">
            <a-input v-model="form.name" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="24">
          <a-form-item field="version" label="应用版本">
            <a-input v-model="form.version" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="24">
          <a-form-item field="company" label="公司名称">
            <a-input v-model="form.company" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="24">
          <a-form-item field="hunter_finger" label="hunter指纹">
            <a-input v-model="form.hunter_finger" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="24">
          <a-form-item field="fofa_finger" label="fofa指纹">
            <a-input v-model="form.fofa_finger" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="24">
          <a-form-item field="description" label="应用描述">
            <a-textarea v-model="form.description" :auto-size="{ minRows: 5, maxRows: 10 }" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="2" :offset="16">
          <a-form-item>
            <a-button html-type="submit" type="primary" shape="round" :loading="addLoading">
              <template #icon>
                <IconPlus />
              </template>
              添加
            </a-button>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { IconPlus } from '@arco-design/web-vue/es/icon'
import { Notification } from '@arco-design/web-vue'
import * as Payloads from '@/interface/app.ts'
import { addApp } from '@/api/app.ts'

const initForm = reactive({
  name: '',
  description: '',
  fofa_finger: '',
  hunter_finger: '',
  version: '',
  company: '',
})

const form = reactive({ ...initForm })

const addLoading = ref(false)

const addAppHandler = async () => {
  addLoading.value = true
  try {
    const params = form as Payloads.AppAddPayload
    const res = await addApp(params)
    if (res.status !== 200) {
      Notification.warning('创建失败')
      return
    }
    if (res.data?.code !== 0) {
      Notification.warning(res.data?.message || '创建失败')
      return
    }
    addLoading.value = false
    window.location.href = `/wiki/app/detail/${res.data?.data}`;
  } catch (e) {
    void e
    Notification.warning('创建失败')
    window.scrollTo(0, 0)
  } finally {
    addLoading.value = false
  }
}
</script>

<style scoped>
.app-profile-content {
  margin-top: 10px;
  padding: 10px;
}
</style>
