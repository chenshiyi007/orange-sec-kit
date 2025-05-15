<template>
  <div class="web-requester">
    <div class="request-panel">
      <!-- 请求控制面板 -->
      <div class="request-control-panel">
        <!-- 控制行 -->
        <div class="control-row">
          <!-- HTTP协议选择器 -->
          <a-select v-model="httpProtocol" :style="{ width: '120px' }" size="medium">
            <a-option value="http">HTTP</a-option>
            <a-option value="https">HTTPS</a-option>
          </a-select>

          <!-- 发送按钮 -->
          <a-button type="primary" :loading="loading" @click="sendRequest">
            {{ t('pages.tools.webRequester.send', '发送') }}
          </a-button>

          <div class="flex-spacer"></div>

          <!-- 超时时间控件 -->
          <div class="switch-label">
            <a-space :size="4">
              <a-tooltip content="请求超时时间(100ms~30s)">
                <span class="switch-text">超时时间</span>
              </a-tooltip>
              <a-input-number
                v-model="timeout"
                :min="100"
                :max="30000"
                :step="100"
                size="small"
                mode="button"
                style="width: 130px"
              />
              <span class="unit-text">ms</span>
            </a-space>
          </div>

          <!-- 重定向开关 -->
          <div class="switch-label">
            <a-space>
              <span class="switch-text">重定向</span>
              <a-switch v-model="isRedirect" size="small" />
            </a-space>
          </div>

          <!-- 代理设置 -->
          <div class="proxy-label">
            <a-space>
              <span class="proxy-text">代理</span>
              <a-switch v-model="useProxy" size="small" />
            </a-space>
          </div>
          <div class="proxy-input-container" v-if="useProxy">
            <a-input
              v-model="proxyAddress"
              placeholder="http://proxy.example.com:8080"
              :style="{ width: '320px' }"
            />
          </div>

          <!-- 在新窗口中打开按钮，仅在非独立页面中显示 -->
          <a-button
            v-if="!isStandalonePage"
            type="outline"
            size="small"
            class="new-window-btn"
            @click="openStandaloneWindow"
          >
            <template #icon>
              <icon-launch />
            </template>
            {{ t('pages.tools.webRequester.newWindow', '新窗口') }}
          </a-button>
        </div>
      </div>

      <!-- 请求和响应容器 - 水平分割 -->
      <div class="request-response-container">
        <!-- 请求部分 -->
        <div class="request-section" :style="{ width: `${leftPanelWidth}%` }">
          <div class="section-header">
            <h3>{{ t('pages.tools.webRequester.request', '请求数据包') }}</h3>
            <div class="empty-controls"></div>
          </div>
          <a-textarea
            v-model="rawRequest"
            allow-clear
            placeholder="输入完整的HTTP请求数据包..."
            class="request-textarea"
          ></a-textarea>
        </div>

        <!-- 拖动手柄 -->
        <div class="resize-handle" @mousedown="startResize" @touchstart="startResize">
          <div class="handle-line"></div>
        </div>

        <!-- 响应部分 -->
        <div class="response-section" :style="{ width: `${100 - leftPanelWidth}%` }">
          <div class="section-header">
            <h3>{{ t('pages.tools.webRequester.response', '响应数据包') }}</h3>
            <div v-if="response" class="section-controls">
              <span class="info-item"> {{ response.time }}ms</span>
              <span class="info-item"> {{ getResponseSize() }}</span>
              <a-button type="text" size="small" @click="copyResponseBody" :disabled="!response">
                <template #icon><icon-copy /></template>
                {{ t('common.copy', '复制') }}
              </a-button>
            </div>
            <div v-else class="empty-controls"></div>
          </div>

          <!-- 响应体 -->
          <a-textarea
            v-if="response"
            v-model="responseRaw"
            readonly
            class="response-textarea"
          ></a-textarea>

          <div v-else class="no-response">
            <icon-info-circle />
            {{ t('pages.tools.webRequester.noResponse', '暂无响应数据，请先发送请求') }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import { Message } from '@arco-design/web-vue'
import { IconCopy, IconInfoCircle, IconLaunch } from '@arco-design/web-vue/es/icon'
import NewWindowButton from '@/components/NewWindowButton.vue'
import { useRoute } from 'vue-router'
import { webRequest } from '@/api/tools'

const { t } = useI18n()
const route = useRoute()

// 判断当前是否为独立页面
const isStandalonePage = computed(() => {
  return route.path.startsWith('/standalone')
})

// 请求表单数据
const httpProtocol = ref('https')
const useProxy = ref(false)
const proxyAddress = ref('')
const loading = ref(false)
const isRedirect = ref(false)
const timeout = ref<number>(10000) // 明确指定为数字类型，默认超时时间1000ms

// 分割区域宽度控制
const leftPanelWidth = ref(50) // 默认50%
let isResizing = false

// 开始拖动调整大小
function startResize(e: MouseEvent | TouchEvent) {
  isResizing = true

  // 防止默认事件和冒泡
  e.preventDefault()

  // 添加全局事件监听器
  document.addEventListener('mousemove', handleResize)
  document.addEventListener('touchmove', handleResize)
  document.addEventListener('mouseup', stopResize)
  document.addEventListener('touchend', stopResize)

  // 设置鼠标样式
  document.body.style.cursor = 'col-resize'
  document.body.style.userSelect = 'none'
}

// 处理拖动事件
function handleResize(e: MouseEvent | TouchEvent) {
  if (!isResizing) return

  const container = document.querySelector('.request-response-container')
  if (!container) return

  const containerRect = container.getBoundingClientRect()
  const containerWidth = containerRect.width
  const containerLeft = containerRect.left

  // 获取鼠标/触摸位置
  const clientX = 'clientX' in e ? e.clientX : e.touches?.[0]?.clientX || 0

  // 计算位置百分比
  let newLeftWidth = ((clientX - containerLeft) / containerWidth) * 100

  // 限制最小宽度为20%，最大宽度为80%
  newLeftWidth = Math.max(20, Math.min(80, newLeftWidth))

  // 设置新宽度
  leftPanelWidth.value = newLeftWidth
}

// 停止拖动
function stopResize() {
  isResizing = false

  // 移除全局事件监听器
  document.removeEventListener('mousemove', handleResize)
  document.removeEventListener('touchmove', handleResize)
  document.removeEventListener('mouseup', stopResize)
  document.removeEventListener('touchend', stopResize)

  // 恢复鼠标样式
  document.body.style.cursor = ''
  document.body.style.userSelect = ''
}

// 组件卸载前清理
onBeforeUnmount(() => {
  document.removeEventListener('mousemove', handleResize)
  document.removeEventListener('touchmove', handleResize)
  document.removeEventListener('mouseup', stopResize)
  document.removeEventListener('touchend', stopResize)
})

// 默认请求模板
const DEFAULT_REQUEST = `GET / HTTP/1.1
Host: example.com
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate, br
Connection: keep-alive
Upgrade-Insecure-Requests: 1
Cache-Control: max-age=0


`

const rawRequest = ref(DEFAULT_REQUEST)

// 确保组件加载时模板已设置
onMounted(() => {
  if (!rawRequest.value) {
    rawRequest.value = DEFAULT_REQUEST
  }
})

// 响应数据
interface Response {
  status: number
  statusText: string
  headers: Record<string, string>
  body: string
  time: number
}

const response = ref<Response | null>(null)
const responseRaw = ref('')

// 获取状态码样式类
function getStatusClass(status: number) {
  if (status >= 200 && status < 300) return 'status-success'
  if (status >= 300 && status < 400) return 'status-redirect'
  if (status >= 400 && status < 500) return 'status-client-error'
  if (status >= 500) return 'status-server-error'
  return ''
}

// 复制响应体
function copyResponseBody() {
  if (!response.value || !response.value.body) return

  navigator.clipboard
    .writeText(responseRaw.value)
    .then(() => {
      Message.success(t('common.copied', '已复制到剪贴板'))
    })
    .catch((err) => {
      Message.error(t('common.copyFailed', '复制失败'))
    })
}

// 发送请求
async function sendRequest() {
  if (!rawRequest.value.trim()) {
    Message.warning(t('pages.tools.webRequester.urlRequired', '请输入请求数据包'))
    return
  }

  // 检查超时时间范围
  const timeoutValue = timeout.value
  if (timeoutValue < 100 || timeoutValue > 30000) {
    Message.warning('超时时间必须在100ms到30000ms之间')
    return
  }

  loading.value = true
  responseRaw.value = ''
  response.value = null

  try {
    // 准备请求参数 - 确保row_data是字符串而不是二进制数组
    const params: {
      protocol: string
      row_data: string
      proxy?: string
      isRedirect?: boolean
      timeout: number
    } = {
      protocol: httpProtocol.value,
      row_data: rawRequest.value,
      isRedirect: isRedirect.value,
      timeout: timeoutValue,
    }

    // 如果启用代理，添加代理地址
    if (useProxy.value && proxyAddress.value.trim()) {
      params.proxy = proxyAddress.value.trim()
    }

    console.log('Sending request with params:', params)

    // 发送请求
    const result = await webRequest(params)

    // 检查响应状态
    if (result.data.code === 0) {
      // 解析响应数据 - 新的结构体包含resp和spend_time
      const responseData = result.data.data.resp
      const spendTime = result.data.data.spend_time || 0

      if (responseData) {
        // 解析HTTP响应
        const parsedResponse = parseHttpResponse(responseData)

        // 设置响应数据，使用后端返回的耗时
        response.value = {
          status: parsedResponse.status,
          statusText: parsedResponse.statusText,
          headers: parsedResponse.headers,
          body: parsedResponse.body,
          time: spendTime,
        }

        // 设置原始响应文本
        responseRaw.value = responseData

        Message.success(t('pages.tools.webRequester.requestSuccess', '请求发送成功'))
      } else {
        throw new Error('Empty response from server')
      }
    } else {
      throw new Error(result.data.message || 'Server returned an error')
    }
  } catch (error: any) {
    console.error('Request failed:', error)
    Message.error(
      t('pages.tools.webRequester.requestFailed', '请求失败') +
        ': ' +
        (error.message || '未知错误'),
    )
  } finally {
    loading.value = false
  }
}

// 解析HTTP响应
function parseHttpResponse(rawResponse: string) {
  try {
    // 基本解析HTTP响应
    const lines = rawResponse.split('\n')

    // 解析状态行
    const statusLine = lines[0].trim()
    const statusMatch = statusLine.match(/HTTP\/\d\.\d\s+(\d+)\s+(.*)/)
    const status = statusMatch ? parseInt(statusMatch[1]) : 0
    const statusText = statusMatch ? statusMatch[2] : ''

    // 解析头部
    const headers: Record<string, string> = {}
    let bodyStartIndex = -1

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim()
      if (line === '') {
        bodyStartIndex = i + 1
        break
      }

      const separatorIndex = line.indexOf(':')
      if (separatorIndex > 0) {
        const headerName = line.substring(0, separatorIndex).trim().toLowerCase()
        const headerValue = line.substring(separatorIndex + 1).trim()
        headers[headerName] = headerValue
      }
    }

    // 提取响应体
    let body = ''
    if (bodyStartIndex > 0) {
      body = lines.slice(bodyStartIndex).join('\n')
    }

    return {
      status,
      statusText,
      headers,
      body,
    }
  } catch (error) {
    // 返回基本结构，避免UI错误
    return {
      status: 0,
      statusText: 'Parse Error',
      headers: { 'content-type': 'text/plain' },
      body: rawResponse,
    }
  }
}

// 获取响应大小
function getResponseSize() {
  if (!response.value || !response.value.body) return '0 bytes'
  return `${response.value.body.length} bytes`
}

// 在独立窗口中打开
function openStandaloneWindow() {
  // 使用any类型绕过TypeScript检查
  const electronAPI = (window as any).electronAPI

  if (electronAPI && typeof electronAPI.openNewWindow === 'function') {
    electronAPI.openNewWindow({
      route: '#/standalone/webrequester', // 添加#确保正确使用哈希路由
      width: 1200,
      height: 800,
      title: t('pages.tools.webRequester.title', 'Web发包工具'),
      frame: true, // 改为true启用标准窗口框架
    }).catch((error: any) => {
      console.error('打开新窗口失败:', error)
      Message.error(t('pages.tools.webRequester.openWindowFailed', '打开新窗口失败'))
    })
  } else {
    Message.warning(t('common.electronOnly', '此功能仅在桌面应用中可用'))
  }
}
</script>

<style scoped>
.web-requester {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.request-panel {
  display: flex;
  flex-direction: column;
  flex: 1;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  overflow: hidden;
  margin-top: 16px;
  background-color: var(--color-bg-1);
}

.request-control-panel {
  padding: 16px;
  border-bottom: 1px solid var(--color-border);
  background-color: var(--color-bg-2);
}

.control-row {
  display: flex;
  gap: 12px;
  align-items: center;
  height: 32px;
}

.proxy-label,
.switch-label {
  display: flex;
  align-items: center;
  white-space: nowrap;
}

.flex-spacer {
  flex: 1;
}

.switch-text {
  margin-left: 8px;
  font-size: 14px;
  color: var(--color-text-2);
}

.unit-text {
  font-size: 13px;
  color: var(--color-text-3);
}

.proxy-text {
  margin-left: 8px;
  font-size: 14px;
  color: var(--color-text-2);
}

.proxy-input-container {
  transition: all 0.2s ease;
}

.new-window-btn {
  margin-left: 10px;
}

.request-response-container {
  display: flex;
  flex-direction: row;
  height: calc(100vh - 220px);
  overflow: hidden;
  position: relative;
}

.request-section,
.response-section {
  display: flex;
  flex-direction: column;
  padding: 16px;
  overflow: hidden;
  height: 100%;
}

.request-section {
  padding-top: 16px; /* 恢复正常内边距 */
}

.resize-handle {
  width: 10px;
  cursor: col-resize;
  background-color: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  z-index: 10;
  transition: background-color 0.2s;
}

.resize-handle:hover {
  background-color: rgba(var(--primary-4), 0.1);
}

.resize-handle:active {
  background-color: rgba(var(--primary-4), 0.2);
}

.handle-line {
  width: 2px;
  height: 40px;
  background-color: var(--color-border);
  border-radius: 2px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.section-header h3 {
  margin: 0;
  font-size: 16px;
}

.section-controls {
  display: flex;
  gap: 12px;
  align-items: center;
}

.empty-controls {
  width: 214px; /* 与响应数据包区域的控件宽度对应 */
  height: 32px; /* 增加高度，使请求文本区域下移 */
}

.info-item {
  color: var(--color-text-3);
  font-size: 13px;
}

.no-response {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px;
  color: var(--color-text-3);
  gap: 8px;
}

.request-textarea,
.response-textarea {
  flex: 1;
  min-height: 200px;
  font-family: monospace;
}

.request-textarea {
  margin-top: 8px; /* 增加顶部外边距，进一步调整对齐 */
}

.response-section {
  padding-top: 16px; /* 与请求区域保持一致的顶部内边距 */
}

.response-textarea {
  margin-top: 8px; /* 与请求文本区域保持一致的顶部外边距 */
}
</style>
