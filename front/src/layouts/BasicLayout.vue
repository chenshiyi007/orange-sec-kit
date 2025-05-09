<template>
  <div id="basic-layout">
    <a-layout class="layout">
      <a-layout-header class="header box-shadow">
        <HeaderBar />
      </a-layout-header>
      <a-layout-content class="content">
        <RouterView />
      </a-layout-content>
      <a-layout-footer class="footer box-shadow">
        <div class="footer-content">
          <div class="copyright">chensh1y1 &trade; @ 2025</div>
          <div class="social-links">
            <a
              href="https://gitee.com/chensh1y1/orange-sec-kit"
              target="_blank"
              rel="noopener noreferrer"
              class="social-link"
              @click.prevent="openExternalLink('https://gitee.com/chensh1y1/orange-sec-kit')"
            >
              <img src="@/assets/gitee.svg" alt="Gitee" class="icon" />
              <span>Gitee</span>
            </a>
            <a
              href="https://github.com/chenshiyi007/orange-sec-kit"
              target="_blank"
              rel="noopener noreferrer"
              class="social-link"
              @click.prevent="openExternalLink('https://github.com/chenshiyi007/orange-sec-kit')"
            >
              <icon-github />
              <span>GitHub</span>
            </a>
            <div class="social-link qrcode-container">
              <icon-message />
              <span>联系我们</span>
              <div class="qrcode">
                <img src="@/assets/logo.jpg" alt="联系我们二维码" />
              </div>
            </div>
          </div>
        </div>
      </a-layout-footer>
    </a-layout>
  </div>
</template>

<script setup lang="ts">
import HeaderBar from '@/components/HeaderBar.vue'
import { useI18n } from 'vue-i18n'
import { IconGithub, IconMessage } from '@arco-design/web-vue/es/icon'
import { onMounted, onUnmounted, ref } from 'vue'
import { Notification } from '@arco-design/web-vue'
import { useWebSocketMessages } from '@/components/MsgNotify.vue'
import { useRouter } from 'vue-router'

const { t } = useI18n()
const router = useRouter()

/**
 * Opens a URL in the user's default browser
 */
const openExternalLink = (url: string) => {
  // Check if we're in electron environment
  if (window.electronAPI && window.electronAPI.openExternal) {
    window.electronAPI.openExternal(url)
  } else {
    // Fallback for non-electron environment
    window.open(url, '_blank', 'noopener,noreferrer')
  }
}

// 存储最近通知，用于避免重复消息
interface NotificationRecord {
  content: string
  timestamp: number
}
const recentNotifications = ref<NotificationRecord[]>([])
const notificationThreshold = 5000 // 5秒内不重复显示相同内容的通知

// WebSocket 消息处理
let removeMessageListener: (() => void) | null = null

// 初始化 WebSocket 消息监听
const initWebSocketListener = () => {
  const { addMessageListener } = useWebSocketMessages()

  // 添加消息监听器
  removeMessageListener = addMessageListener(
    (message: { msg_type: string; type: string; content: string }) => {
      if (message.msg_type === 'message') {
        showNotification(message)
      }
    },
  )
}

// 显示通知并处理可能的动作
const showNotification = (message: { type: string; content: string }) => {
  // 检查是否是短时间内的重复消息
  const isDuplicate = recentNotifications.value.some(
    (n) => n.content === message.content && Date.now() - n.timestamp < notificationThreshold,
  )

  if (isDuplicate) {
    return // 跳过重复消息
  }

  // 记录此次通知
  recentNotifications.value.push({
    content: message.content,
    timestamp: Date.now(),
  })

  // 限制通知历史记录长度
  if (recentNotifications.value.length > 10) {
    recentNotifications.value.shift()
  }

  // 准备通知配置
  const notificationConfig = {
    title: getNotificationTitle(message.type),
    content: message.content,
    duration: 5000,
    position: 'topRight' as const,
    closable: true,
  }

  // 根据消息类型显示不同样式的通知
  if (message.type === 'success') {
    Notification.success(notificationConfig)
  } else if (message.type === 'error') {
    Notification.error(notificationConfig)
  } else {
    Notification.info(notificationConfig)
  }

  // 处理特定消息的导航
  handleMessageNavigation(message)
}

// 获取通知标题
const getNotificationTitle = (type: string): string => {
  switch (type) {
    case 'success':
      return t('notification.success') || '成功'
    case 'error':
      return t('notification.error') || '错误'
    default:
      return t('notification.info') || '通知'
  }
}

// 处理消息导航逻辑
const handleMessageNavigation = (message: { type: string; content: string }) => {
  // 这里添加消息处理逻辑
  // 例如：根据不同的消息内容，导航到不同的页面或执行不同的操作

  // 应用相关消息
  if (message.content.includes('应用') || message.content.includes('app')) {
    // 可以根据需要决定是否跳转或执行其他操作
  }

  // 任务完成消息
  if (message.content.includes('任务完成') || message.content.includes('task completed')) {
    // 任务完成后的处理
  }

  // 对于错误消息，可以采取特殊处理
  if (message.type === 'error') {
    // 错误处理逻辑
  }
}

// 组件挂载时设置消息监听
onMounted(() => {
  initWebSocketListener()
})

// 组件卸载时清除消息监听
onUnmounted(() => {
  if (removeMessageListener) {
    removeMessageListener()
  }
})
</script>

<style>
/* Global styles that apply to html and body */
html,
body {
  height: 100%;
  margin: 0;
  padding: 0;
}
</style>

<style scoped>
* {
  box-sizing: border-box;
}
.box-shadow {
  box-shadow: #eee 1px 1px 5px;
}
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
}

#basic-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
}

#basic-layout .header {
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: #fff;
}

#basic-layout .content {
  flex: 1;
  padding: 10px 20px;
  padding-bottom: 60px; /* Add padding to account for footer height */
  width: 100%;
}

#basic-layout .footer {
  position: fixed;
  bottom: 0;
  left: 0;
  padding: 12px 20px;
  width: 100%;
  height: 48px; /* Set explicit height for footer */
  background-color: #fff; /* 改为白色，与页头保持一致 */
  border-top: 1px solid #e8e8e8;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}

.footer-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.copyright {
  font-size: 14px;
  color: #666;
}

.social-links {
  display: flex;
  align-items: center;
  gap: 16px;
}

.social-link {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #666;
  text-decoration: none;
  transition: color 0.3s;
  position: relative;
  cursor: pointer;
  font-size: 13px;
}

.social-link:hover {
  color: #ff7d00;
}

.social-link .icon {
  width: 14px;
  height: 14px;
}

.social-link :deep(svg) {
  width: 14px;
  height: 14px;
}

.qrcode-container {
  position: relative;
}

.qrcode {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%) scale(0.8);
  opacity: 0;
  width: 110px;
  height: 110px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
  padding: 5px;
  transition: all 0.3s ease;
  pointer-events: none;
  z-index: 10;
}

.qrcode img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
}

.qrcode-container:hover .qrcode {
  opacity: 1;
  transform: translateX(-50%) scale(1);
}

@media (max-width: 768px) {
  .footer-content {
    flex-direction: column;
    gap: 8px;
  }

  .social-links {
    flex-wrap: wrap;
    justify-content: center;
  }
}
</style>
