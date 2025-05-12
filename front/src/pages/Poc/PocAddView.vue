<template>
  <div class="poc-profile">
    <page-header :title="t('pages.poc.add.title')"></page-header>
    <div class="poc-profile-content">
      <a-form :model="form" layout="vertical" ref="formRef" @submit="clickAdd">
        <!-- 基本信息卡片 -->
        <a-card class="content-card" :title="t('pages.poc.profile.basicInfo')">
          <a-row :gutter="24">
            <a-col :span="16">
              <a-form-item field="name" :label="t('pages.poc.add.pocName')">
                <a-input v-model="form.name" :placeholder="t('pages.poc.add.pocNamePlaceholder')" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item
                field="level"
                :label="t('pages.poc.add.vulLevel')"
                :rules="[{ required: true, message: t('pages.poc.add.vulLevelRequired') }]"
              >
                <a-select
                  v-model="form.level"
                  :options="VulLevel"
                  :field-names="{ value: 'key', label: 'label' }"
                >
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :span="16">
              <a-form-item
                field="app_instance_id"
                :label="t('pages.poc.add.bindApp')"
                :rules="[{ required: true, message: t('pages.poc.profile.applicationRequired') }]"
                :validate-trigger="['change', 'input', 'blur']"
              >
                <app-selector
                  v-model:app_instance_id="selectAppId"
                  :init_options="init_options"
                ></app-selector>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item
                field="vul_type"
                :label="t('pages.poc.add.vulType')"
                :rules="[{ required: true, message: t('pages.poc.add.vulTypeRequired') }]"
              >
                <a-select
                  v-model="form.vul_type"
                  :options="VulTypes"
                  :field-names="{ value: 'key', label: 'label' }"
                  allow-search
                >
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :span="16">
              <a-form-item
                field="vul_path"
                :label="t('pages.poc.profile.vulPath')"
                :rules="[{ required: true, message: t('pages.poc.add.vulPathRequired') }]"
              >
                <a-input v-model="form.vul_path" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item field="vul_param" :label="t('pages.poc.profile.vulParam')">
                <a-input v-model="form.vul_param" />
              </a-form-item>
            </a-col>
          </a-row>
        </a-card>

        <!-- 漏洞详情卡片 -->
        <a-card class="content-card" :title="t('pages.poc.profile.vulDetail')">
          <a-form-item
            field="vul_description"
            :label="t('pages.poc.add.vulDescription')"
            :rules="[{ required: true, message: t('pages.poc.add.vulDescriptionRequired') }]"
          >
            <a-textarea v-model="form.vul_description" :auto-size="{ minRows: 5, maxRows: 8 }" />
          </a-form-item>
          <a-form-item
            field="repair_suggestion"
            :label="t('pages.poc.profile.repairSuggestion')"
            :rules="[{ required: true, message: t('pages.poc.add.repairSuggestionRequired') }]"
          >
            <a-textarea v-model="form.repair_suggestion" :auto-size="{ minRows: 5, maxRows: 8 }" />
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
              <a-button type="primary" status="danger" @click="showRuleTest" size="small">
                {{ t('pages.poc.profile.testRule') }}
              </a-button>
            </div>
          </template>
          <a-form-item field="rule_link">
            <monaco-editor
              style="min-height: 350px; width: 100%"
              class="monaco-editor"
              v-model:code="form.rule_link"
              v-model:clear="clear"
            ></monaco-editor>
          </a-form-item>
        </a-card>

        <!-- 操作按钮 -->
        <div class="action-buttons">
          <a-space>
            <a-button size="large" @click="handleCancel">{{
              t('pages.poc.profile.cancel')
            }}</a-button>
            <a-button type="primary" size="large" html-type="submit" :loading="loading">
              <template #icon>
                <IconPlus />
              </template>
              {{ t('pages.poc.add.add') }}
            </a-button>
          </a-space>
        </div>
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
        <a-typography-text>{{ t('pages.poc.add.createSuccess') }}</a-typography-text>
        <template #footer>
          <a-button @click="handleContinue">
            <template #icon>
              <IconPlus />
            </template>
            {{ t('pages.poc.add.keepAndContinue') }}
          </a-button>
          <a-button @click="handleContinueAndEmpty">
            <template #icon>
              <IconPlus />
            </template>
            {{ t('pages.poc.add.continueAdd') }}
          </a-button>
          <a-button @click="handleToFinish" type="primary">
            <template #icon>
              <IconCheck />
            </template>
            {{ t('pages.poc.add.finish') }}
          </a-button>
        </template>
      </a-modal>

      <!-- Rule test drawer -->
      <a-drawer
        :visible="testRuleVisible"
        :width="1000"
        :title="t('pages.poc.profile.ruleTest')"
        @cancel="closeRuleTest"
        unmountOnClose
      >
        <poc-checker :rule_link="form.rule_link"></poc-checker>
        <template #footer>
          <a-button @click="closeRuleTest">{{ t('pages.poc.close') }}</a-button>
        </template>
      </a-drawer>
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
import { useI18n } from 'vue-i18n'
import PocChecker from '@/components/PocChecker.vue'

const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const init_options = ref<Array<{ instance_id: string; name: string; isNew: boolean }>>([])

const clear = ref(false)

const template = ref(`expression: step1 && step2 #规则模板
rules:
    - step1: #规则一
      description: 步骤一的描述
      path: / #请求路径
      method: POST #请求方式
      follow_redirect: true #是否跟随重定向,默认为fasle
      headers: #设置请求头
        token: xxxxx #参考设置
        origin: xxxxx.com
      set: #参考变量设置
        key1: md5(randNumber(),32) #md5加密随机数字,并取32位加密后的结果
        key2: randStr(10) #随机长度为10的字符串
      body: id={{ key1 }}&name={{ key2 }} #请求体, 使用{{}}包裹设置的变量
      expression: response.status == 200 && response.body.icontains({{ key1 }})
    - step2:
      description: 步骤二的描述
      path: /test
      method: GET
      expression: response.status == 200`)


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
      Notification.error(t('common.serviceError'))
      return
    }
    if (res.data.code !== 0) {
      Notification.error(res.data?.message || t('common.serviceError'))
      return
    }
    init_options.value.push({
      instance_id: aid,
      name: res.data?.data?.name,
      isNew: true,
    })
  }
})

const form = reactive({ ...initForm })

watchEffect(() => {
  form.app_instance_id = selectAppId.value
})

const loading = ref(false)
const visible = ref(false)
const testRuleVisible = ref(false)

const createPocHandler = async () => {
  loading.value = true
  try {
    const params = form as Payloads.PocCreatePayload
    const res = await createPoc(params)
    if (res.status !== 200) {
      Notification.warning(t('pages.poc.add.createFailed'))
      return
    }
    if (res.data?.code !== 0) {
      let message = t('pages.poc.add.createFailed')
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
    Notification.warning(t('pages.poc.add.createFailed'))
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

function handleCancel() {
  router.go(-1)
}

const showRuleTest = () => {
  testRuleVisible.value = true
}

const closeRuleTest = () => {
  testRuleVisible.value = false
}
</script>

<style scoped>
.poc-profile-content {
  padding: 0 24px 40px;
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

.action-buttons {
  display: flex;
  justify-content: flex-end;
  margin-top: 24px;
  padding: 16px 0;
  border-top: 1px solid var(--color-border-2);
}

.monaco-editor {
  width: 100%;
  min-height: 350px;
  border: 1px solid var(--color-border-2);
  border-radius: 4px;
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
