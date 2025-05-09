<template>
  <div id="pocChecker" class="poc-checker-container">
    <a-form :model="form" layout="inline" @submit="doCheck" class="check-form">
      <a-form-item
        field="target"
        :tooltip="t('components.pocChecker.testSiteTooltip')"
        :label="t('components.pocChecker.testSite')"
        :rules="[{ required: true, message: t('components.pocChecker.testSiteRequired') }]"
      >
        <a-input
          v-model="form.target"
          :placeholder="t('components.pocChecker.testSiteInputPlaceholder')"
        />
      </a-form-item>
      <a-form-item
        v-if="poc_instance_id && !rule_link"
        field="save_poc"
        :label="t('components.pocChecker.savePoc')"
      >
        <a-switch :default-checked="false" v-model="form.save_poc" />
      </a-form-item>
      <a-form-item
        field="proxy"
        :label="t('components.pocChecker.proxy')"
        :tooltip="t('components.pocChecker.proxyTooltip')"
      >
        <a-space>
          <a-switch :default-checked="false" v-model="useProxy" />
          <a-input
            v-if="useProxy"
            v-model="form.proxy"
            :placeholder="t('components.pocChecker.proxyInputPlaceholder')"
          />
        </a-space>
      </a-form-item>
      <a-form-item>
        <a-space>
          <a-button html-type="submit" type="primary" :loading="isRunningCheck">
            {{ t('components.pocChecker.run') }}
          </a-button>
        </a-space>
      </a-form-item>
    </a-form>
    <div class="rule-result" v-if="showResult">
      <a-space>
        <a-typography-text bold>{{ t('components.pocChecker.testResult') }}</a-typography-text>
        <a-tag v-if="resultForm.is_vul" bordered color="rgb(var(--danger-6))">
          {{ t('components.pocChecker.vulExists') }}
        </a-tag>
        <a-tag v-else bordered color="rgb(var(--primary-2))">
          {{ t('components.pocChecker.vulNotExists') }}
        </a-tag>
      </a-space>
      <a-collapse accordion class="flow-collapse" v-model:active-key="activeCollapseKey">
        <a-collapse-item
          v-for="(flow, index) in resultForm.flows"
          :key="index.toString()"
          :header="t('components.pocChecker.step') + ' ' + (index + 1) + ': ' + flow.description"
        >
          <div class="info-line">
            <a-space size="large">
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { checkPoc } from '@/api/poc.ts'
import { Notification } from '@arco-design/web-vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  rule_link: {
    type: String,
    default: '',
  },
  poc_instance_id: {
    type: String,
    default: '',
  },
  initialTarget: {
    type: String,
    default: '',
  },
  taskId: {
    type: String,
    default: '',
  },
})
const isRunningCheck = ref<boolean>(false)
const useProxy = ref<boolean>(false)
const showResult = ref(false)
const activeCollapseKey = ref<string[]>(['0'])
const form = reactive({
  target: props.initialTarget || '',
  proxy: '',
  save_poc: false,
})
const resultForm = ref<{
  is_vul: boolean
  flows: Array<{
    description: string
    url: string
    spend_time: number
    status_code: number
    request_header: string
    request_body: string
    response_header: string
    response_body: string
  }>
}>({
  is_vul: false,
  flows: [],
})

// Watch for changes in showResult to set the active collapse item
watch(showResult, (newVal) => {
  if (newVal && resultForm.value.flows.length > 0) {
    activeCollapseKey.value = ['0']
  }
})

// 添加watch来监听initialTarget变化
watch(
  () => props.initialTarget,
  (newVal) => {
    if (newVal) {
      form.target = newVal
    }
  },
)

const doCheck = async () => {
  showResult.value = false
  isRunningCheck.value = true
  try {
    const res = await checkPoc({
      target: form.target,
      proxy: useProxy.value ? form.proxy : '',
      rule_link: props.rule_link,
      poc_instance_id: props.poc_instance_id,
      save_poc: form.save_poc,
      task_id: props.taskId,
    })
    if (res.status !== 200) {
      return Notification.error(t('components.pocChecker.serviceError'))
    }
    if (res.data?.code !== 0) {
      let msg = t('components.pocChecker.serviceError')
      if (res.data?.message && res.data?.message !== '') {
        msg = res.data?.message
      }
      Notification.warning(msg)
      return
    }
    resultForm.value = res.data?.data
    showResult.value = true
    // Ensure the first collapse item is opened
    if (resultForm.value.flows.length > 0) {
      activeCollapseKey.value = ['0']
    }
  } catch (e) {
    console.error('请求失败', e)
    Notification.error(t('components.pocChecker.executionFailed'))
  } finally {
    isRunningCheck.value = false
  }
}
</script>

<style scoped>
.poc-checker-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 100%;
  overflow-x: hidden;
}

.check-form {
  background-color: var(--color-bg-2);
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  flex-wrap: wrap;
  row-gap: 16px;
  width: 100%;
}

.rule-result {
  background-color: var(--color-bg-2);
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
}

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
  white-space: nowrap;
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

@media (max-width: 768px) {
  .check-form {
    flex-direction: column;
  }

  .check-form :deep(.arco-form-item) {
    margin-right: 0;
    margin-bottom: 16px;
  }

  .check-form :deep(.arco-form-item:last-child) {
    margin-bottom: 0;
  }

  .info-line {
    padding: 12px;
  }

  .info-line :deep(.arco-space) {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .info-value {
    max-width: 100%;
  }
}
</style>
