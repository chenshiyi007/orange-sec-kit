<template>
  <div class="poc-profile">
    <PageHeader title="POC详情"/>
    <div class="poc-profile-content">
      <a-form :model="form" layout="vertical">
        <a-row :gutter="16" >
          <a-col :span="16">
            <a-form-item field="name" label="漏洞名称">
              <a-input v-model="form.name" ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item field="instance_id" label="漏洞ID">
              <a-typography-text bold>
                {{ form.instance_id }}
              </a-typography-text>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item field="vul_type" label="漏洞类型">
              <a-select
                v-model="form.vul_type"
                :options="VulTypes"
                :field-names="{ value: 'key', label: 'label' }"
                allow-search
              >
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item field="level" label="漏洞等级">
              <a-select
                v-model="form.level"
                :options="VulLevel"
                :field-names="{ value: 'key', label: 'label' }"
                allow-search
              >
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item
              field="app_instance_id"
              label="应用"
              :rules="[{ required: true, message: '应用绑定不能为空' }]"
              :validate-trigger="['change', 'input', 'blur']"
            >
              <app-selector
                v-model:app_instance_id="selectAppId"
                v-model:app="app"
                :init_options="options"
              ></app-selector>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item field="app_company" label="厂商">
              <a-typography-text bold>
                {{ app.company }}
              </a-typography-text>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item field="app_version" label="版本">
              <a-typography-text bold>
                {{ app.version }}
              </a-typography-text>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="16">
            <a-form-item field="app_description" label="应用描述">
              <a-typography-paragraph>{{ app.description }} </a-typography-paragraph>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item field="fofa_finger" label="FOFA 指纹">
              <a-typography-text bold>
                {{ app.fofa_finger }}
              </a-typography-text>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item field="hunter_finger" label="Hunter 指纹">
              <a-typography-text bold>
                {{ app.hunter_finger }}
              </a-typography-text>
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
        </a-row>

        <a-row>
          <a-col :span="12">
            <a-form-item field="vul_description" label="漏洞与危害描述">
              <a-textarea v-model="form.vul_description" :auto-size="{ minRows: 5, maxRows: 10 }" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item field="vul_param" label="漏洞参数">
              <a-input v-model="form.vul_param" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item field="vul_path" label="漏洞路径">
              <a-input v-model="form.vul_path" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-item field="repair_suggestion" label="修复建议">
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
                class="monaco-editor"
                v-if="!loading"
                v-model:code="form.rule_link"
              ></monaco-editor>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="4" :offset="18" style="display: flex">
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
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { getPocDetail, updatePoc } from '@/api/poc.ts'
import { Notification } from '@arco-design/web-vue'
import { useRoute } from 'vue-router'
import MonacoEditor from '@/components/MonacoEditor.vue'
import { IconPen } from '@arco-design/web-vue/es/icon'
import WangEditor from '@/components/WangEditor.vue'
import { VulLevel, VulTypes } from '@/enums/enums.ts'
import AppSelector from '@/components/AppSelector.vue'
import PageHeader from '@/components/PageHeader.vue'
const route = useRoute()
const props = defineProps({
  poc_id:{
    type: String,
    default:''
  },
})
const pid = route.params.id as string
const loading = ref(true)
const updateLoading = ref(false)
const form = reactive({
  instance_id: '',
  name: '',
  app_instance_id: '',
  app_name: '',
  app_description: '',
  app_version: '',
  app_company: '',
  vul_description: '',
  vul_type: '',
  vul_path: '',
  vul_param: '',
  vul_reproduce: '',
  repair_suggestion: '',
  level: '',
  rule_link: '',
  fofa_finger: '',
  hunter_finger: '',
  create_time: '',
  update_time: '',
})
const selectAppId = ref('')
const app = ref({
  instance_id: '',
  name: '',
  description: '',
  version: '',
  company: '',
  fofa_finger: '',
  hunter_finger: '',
})
const options = ref<Array<{ instance_id: string; name: string; isNew: boolean }>>([])
const fetchData = async () => {
  loading.value = true
  const res = await getPocDetail({ instance_id: pid || props.poc_id })
  if (res.status !== 200) {
    Notification.warning('服务错误')
    return
  }
  if (res.data?.code === 0) {
    Object.assign(form, res.data?.data)
    selectAppId.value = form.app_instance_id
    Object.assign(app.value, {
      instance_id: form.app_instance_id,
      name: form.app_name,
      description: form.app_description,
      version: form.app_version,
      company: form.app_company,
      fofa_finger: form.fofa_finger,
      hunter_finger: form.hunter_finger,
    })
    options.value.push({
      instance_id: form.app_instance_id,
      name: form.app_name,
      isNew: true,
    })
  } else {
    Notification.warning(res.data?.message || '请求失败')
  }
  loading.value = false
}

onMounted(() => {
    fetchData()
})

const  clickUpdate = async ()=> {
  updateLoading.value = true
  try {
    const res = await updatePoc({
      app_instance_id: app.value.instance_id,
      instance_id: form.instance_id,
      level: form.level,
      name: form.name,
      repair_suggestion: form.repair_suggestion,
      rule_link: form.rule_link,
      vul_description: form.vul_description,
      vul_param: form.vul_param,
      vul_path: form.vul_path,
      vul_reproduce: form.vul_reproduce,
      vul_type: form.vul_type,
    })
    if (res.status !== 200){
      Notification.warning('服务错误')
      return
    }
    if (res.data?.code !== 0) {
      let msg = '更新失败'
      if (res.data?.message !== '') {
        msg = res.data?.message
      }
      Notification.warning(msg)
      return
    }
    Notification.success('修改成功')
    window.scrollTo(0, 0)
    fetchData()
  } catch (error) {
    void error
    Notification.warning('服务错误')
  }finally {
    updateLoading.value = false
  }
}

</script>

<style scoped>
.poc-profile-content {
  margin-top: 20px;
  padding-left: 24px;
}

.monaco-editor {
  width: 100%;
  min-height: 500px;
}
</style>
