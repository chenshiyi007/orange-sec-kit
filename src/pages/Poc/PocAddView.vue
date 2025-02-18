<template>
  <div class="poc-profile">
    <page-header title="新增 POC"></page-header>
    <div class="poc-profile-content">
      <a-form :model="form" layout="vertical" ref="formRef" @submit="clickAdd">
        <a-row :gutter="40">
          <a-col :span="12">
            <a-form-item field="name" label="POC名称">
              <a-input v-model="form.name" placeholder="为空则自动补充" />
            </a-form-item>
          </a-col>
          <a-col :span="40">
            <a-form-item
              field="level"
              label="漏洞等级"
              :rules="[{ required: true, message: '漏洞等级不能为空' }]"
            >
              <a-select
                v-model="form.level"
                :style="{ width: '320px' }"
                :options="VulLevel"
                :field-names="{ value: 'key', label: 'label' }"
              >
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="40">
          <a-col :span="12">
            <a-form-item
              field="app_instance_id"
              label="绑定应用"
              :rules="[{ required: true, message: '应用绑定不能为空' }]"
              :validate-trigger="['change', 'input', 'blur']"
            >
              <app-selector v-model:app_instance_id="selectAppId" :init_options="init_options"></app-selector>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item
              field="vul_type"
              label="漏洞类型"
              :rules="[{ required: true, message: '漏洞类型不能为空' }]"
            >
              <a-select
                v-model="form.vul_type"
                :style="{ width: '320px' }"
                :options="VulTypes"
                :field-names="{ value: 'key', label: 'label' }"
                allow-search
              >
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="40">
          <a-col :span="12">
            <a-form-item
              field="vul_path"
              label="漏洞路径"
              :rules="[{ required: true, message: '漏洞路径不能为空' }]"
            >
              <a-input v-model="form.vul_path" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item field="vul_param" label="漏洞参数">
              <a-input v-model="form.vul_param" style="width: 320px" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="20">
            <a-form-item
              field="vul_description"
              label="漏洞描述"
              :rules="[{ required: true, message: '漏洞描述不能为空' }]"
            >
              <a-textarea v-model="form.vul_description" :auto-size="{ minRows: 5, maxRows: 10 }" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="20">
            <a-form-item
              field="repair_suggestion"
              label="修复建议"
              :rules="[{ required: true, message: '修复建议不能为空' }]"
            >
              <a-textarea
                v-model="form.repair_suggestion"
                :auto-size="{ minRows: 5, maxRows: 10 }"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="20">
            <a-form-item field="vul_reproduce" label="复现步骤">
              <WangEditor v-model:content="form.vul_reproduce" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="20">
            <a-form-item field="rule_link">
              <template #label>
                <div style="display: flex; align-items: center; gap: 16px">
                  <span>检测规则</span>
                  <a-button type="primary" status="danger" shape="round" size="mini">
                    测试
                  </a-button>
                </div>
              </template>
              <monaco-editor
                style="min-height: 350px; width: 100%"
                class="monaco-editor"
                v-model:code="form.rule_link"
                v-model:clear="clear"
              ></monaco-editor>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="2" :offset="18">
            <a-form-item>
              <a-button html-type="submit" type="primary" shape="round" :loading="loading">
                <template #icon>
                  <IconPlus />
                </template>
                添加
              </a-button>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <a-modal
        v-model:visible="visible"
        messageType="success"
        width="500px"
        mask
        :esc-to-close="false"
        :closable="false"
        :maskClosable="false"
      >
        <a-typography-text>创建成功</a-typography-text>
        <template #footer>
          <a-button @click="handleContinue">
            <template #icon>
              <IconPlus />
            </template>
            保留并继续添加
          </a-button>
          <a-button @click="handleContinueAndEmpty">
            <template #icon>
              <IconPlus />
            </template>
            继续添加
          </a-button>
          <a-button @click="handleToFinish" type="primary">
            <template #icon>
              <IconCheck />
            </template>
            完成
          </a-button>
        </template>
      </a-modal>
    </div>
  </div>
</template>

<script setup lang="ts">
import PageHeader from '@/components/PageHeader.vue'
import { onMounted, reactive, ref, watchEffect } from 'vue'
import MonacoEditor from '@/components/MonacoEditor.vue'
import WangEditor from '@/components/WangEditor.vue'
import { IconPlus, IconCheck } from '@arco-design/web-vue/es/icon'
import { VulLevel, VulTypes } from '@/enums/enums.ts'
import { Notification } from '@arco-design/web-vue'
import AppSelector from '@/components/AppSelector.vue'
import * as Payloads from '@/interface/poc.ts'
import { createPoc } from '@/api/poc.ts'
import { useRoute, useRouter } from 'vue-router'
import { getAppDetail } from '@/api/app.ts'


const router = useRouter()
const route = useRoute()
const init_options = ref<Array<{ instance_id: string; name: string ; isNew: boolean }>>([])

const clear = ref(false)

const template = ref('template')

function clickAdd() {
  createPocHandler()
}

const initForm = reactive({
  name: '',
  app_instance_id: '',
  vul_description: '',
  vul_type: 'sql_inject',
  vul_path: '',
  vul_param: '',
  vul_reproduce: '',
  repair_suggestion: '',
  level: 'low',
  rule_link: template.value,
})

const selectAppId = ref<string>(route.params.id as string)

onMounted(async () => {
  const aid = route.params.id as string
  if (aid && aid !== '') {
    const res = await getAppDetail({
      instance_id: aid,
    })
    if (res.status !== 200) {
      Notification.error('服务错误')
      return
    }
    if (res.data.code !== 0) {
      Notification.error(res.data?.message || '服务错误')
      return
    }
    init_options.value.push({
      instance_id: aid,
      name:res.data?.data?.name,
      isNew:true,
    })
  }
})

const form = reactive({ ...initForm })

watchEffect(() => {
  form.app_instance_id = selectAppId.value
})

const loading = ref(false)
const visible = ref(false)

const createPocHandler = async () => {
  loading.value = true
  try {
    const params = form as Payloads.PocCreatePayload
    const res = await createPoc(params)
    if (res.status !== 200) {
      Notification.warning('创建失败')
      return
    }
    if (res.data?.code !== 0) {
      let message = '创建失败'
      if (res.data?.message && res.data?.message !== '') {
        message = res.data?.message
      }
      Notification.warning(message)
      window.scrollTo(0, 0)
      return
    }
    visible.value = true
  } catch (e) {
    void e
    Notification.warning('创建失败')
    window.scrollTo(0, 0)
  } finally {
    loading.value = false
  }
}

function handleToFinish() {
  router.go(-1)
}

function handleContinue() {
  visible.value = false
}

function handleContinueAndEmpty() {
  selectAppId.value = route.params.id as string
  Object.assign(form, initForm)
  visible.value = false
  clear.value = true
  window.scrollTo(0, 0)
}
</script>

<style scoped>
.poc-profile-content {
  margin-top: 10px;
  padding-left: 24px;
}
</style>
