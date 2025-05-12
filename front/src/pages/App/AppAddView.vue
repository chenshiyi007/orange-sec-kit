<template>
  <div class="app-profile-content">
    <a-form :model="form" layout="vertical" ref="formRef" @submit="addAppHandler">
      <a-row>
        <a-col :span="24">
          <a-form-item field="name" :label="t('pages.app.add.appName')">
            <a-input v-model="form.name" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="24">
          <a-form-item field="version" :label="t('pages.app.add.appVersion')">
            <a-input v-model="form.version" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="24">
          <a-form-item field="company" :label="t('pages.app.add.companyName')">
            <a-input v-model="form.company" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="24">
          <a-form-item field="hunter_finger" :label="t('pages.app.add.hunterFingerprint')">
            <a-input v-model="form.hunter_finger" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="24">
          <a-form-item field="fofa_finger" :label="t('pages.app.add.fofaFingerprint')">
            <a-input v-model="form.fofa_finger" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="24">
          <a-form-item field="description" :label="t('pages.app.add.appDescription')">
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
              {{ t('pages.app.add.add') }}
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
import { Notification, Message } from '@arco-design/web-vue'
import * as Payloads from '@/interface/app.ts'
import { addApp } from '@/api/app.ts'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const { t } = useI18n()
const router = useRouter()

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
      Notification.warning(t('pages.app.add.createFailed'))
      return
    }
    if (res.data?.code !== 0) {
      Notification.warning(res.data?.message || t('pages.app.add.createFailed'))
      return
    }
    addLoading.value = false
    Message.success(t('pages.app.add.createSuccess'))
    router.push(`/wiki/app/detail/${res.data?.data}`)
  } catch (e) {
    void e
    Notification.warning(t('pages.app.add.createFailed'))
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
