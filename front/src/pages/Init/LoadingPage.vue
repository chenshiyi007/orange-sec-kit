<template>
  <div class="loading-container">
    <div class="loading-content">
      <div class="loading-spinner"></div>
      <h2>{{ loadingMessage }}</h2>
      <p>{{ loadingDescription }}</p>

      <!-- 添加重试按钮 -->
      <a-button v-if="showRetry" type="primary" @click="retryCheck" style="margin-top: 20px;">
        重试连接
      </a-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { getUserAgree } from '@/api/system'

const router = useRouter()
const loadingMessage = ref('正在加载中...')
const loadingDescription = ref('正在启动后端服务...')

// 重试变量和方法
const showRetry = ref(false)
const retryCheck = async () => {
  showRetry.value = false
  loadingMessage.value = '正在加载中...'
  loadingDescription.value = '正在启动后端服务...'

  // 重新检查后端状态
  const backendReady = await waitForBackend()
  handleBackendStatus(backendReady)
}

// 处理后端状态检查结果
const handleBackendStatus = async (backendReady: boolean) => {
  if (backendReady) {
    // 后端服务已就绪，检查用户协议状态
    await checkUserAgreement()
  } else {
    // 后端服务启动失败
    console.error('后端服务检测失败!')
    loadingMessage.value = '后端服务连接失败'
    loadingDescription.value = '请确保后端服务正在运行，端口是否正确'
    showRetry.value = true
  }
}

// 检查后端服务是否就绪
const checkBackendReady = async (): Promise<boolean> => {
  console.log('正在检查后端服务...')

  // 判断是否在Electron环境
  if (window.electronAPI) {
    console.log('在Electron环境中检查后端...')
    try {
      // 使用Electron IPC检查后端状态
      const isReady = await window.electronAPI.isBackendReady()
      console.log('Electron后端检查结果:', isReady)
      return isReady
    } catch (error) {
      console.error('Electron检查后端服务失败:', error)
      // 如果Electron方法失败，尝试使用HTTP请求检查
      return await checkBackendWithHttp()
    }
  } else {
    console.log('在浏览器环境中检查后端...')
    return await checkBackendWithHttp()
  }
}

// 使用HTTP请求检查后端服务
const checkBackendWithHttp = async (): Promise<boolean> => {
  // 使用真实的API调用来验证后端服务状态
  try {
    console.log('使用getUserAgree API检查后端...')

    const response = await getUserAgree()

    console.log('后端getUserAgree响应:', response)

    // 如果能成功获取响应，说明后端服务正常
    return true
  } catch (error) {
    console.error('检查后端服务失败:', error)
    return false
  }
}

// 等待后端服务就绪
const waitForBackend = async (): Promise<boolean> => {
  let attempts = 0
  const maxAttempts = 30 // 增加到30次尝试，每次间隔1秒

  console.log('开始等待后端服务就绪...')
  console.log('当前环境:', import.meta.env.MODE)
  console.log('是否Electron环境:', !!window.electronAPI)

  while (attempts < maxAttempts) {
    console.log(`尝试第 ${attempts + 1}/${maxAttempts} 次检查后端`)
    const isReady = await checkBackendReady()
    console.log(`后端检查结果: ${isReady ? '就绪' : '未就绪'}`)

    if (isReady) {
      console.log('后端服务已就绪！')
      return true
    }

    // 等待1秒后再次检查
    console.log('等待1秒后再次检查...')
    await new Promise((resolve) => setTimeout(resolve, 1000))
    attempts++

    // 更新加载提示
    loadingDescription.value = `正在启动后端服务...（${attempts}/${maxAttempts}）`
  }

  // 超过最大尝试次数，仍未就绪
  console.error('后端服务检查失败: 超过最大尝试次数')
  return false
}

// 检查用户协议状态
const checkUserAgreement = async () => {
  loadingMessage.value = '正在检查用户协议状态...'
  loadingDescription.value = '请稍候...'

  try {
    // 添加短暂延迟，确保加载动画至少显示一段时间
    const delay = new Promise((resolve) => setTimeout(resolve, 500))

    // 调用后端接口获取用户协议同意状态
    const res = await getUserAgree()

    // 等待延迟完成
    await delay

    if (res.data.code === 0) {
      if (res.data.data) {
        // 用户已同意协议，跳转到主页
        router.replace('/home')
      } else {
        // 用户未同意协议，跳转到协议页面
        router.replace('/init/agreement')
      }
    } else {
      console.error('获取用户协议状态失败:', res.data.message)
      // 出错时也跳转到协议页面
      router.replace('/init/agreement')
    }
  } catch (error) {
    console.error('检查用户协议状态出错:', error)
    // 出错时跳转到协议页面
    router.replace('/init/agreement')
  }
}

onMounted(async () => {
  console.log('LoadingPage 组件已加载')

  // 首先等待后端服务就绪
  const backendReady = await waitForBackend()
  handleBackendStatus(backendReady)
})
</script>

<style scoped>
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f7fa;
}

.loading-content {
  text-align: center;
  padding: 30px;
  border-radius: 8px;
  background-color: white;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.loading-spinner {
  display: inline-block;
  width: 50px;
  height: 50px;
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: #409eff;
  animation: spin 1s ease-in-out infinite;
  margin-bottom: 20px;
}

h2 {
  margin: 0 0 10px 0;
  color: #303133;
}

p {
  color: #606266;
  margin: 0;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
