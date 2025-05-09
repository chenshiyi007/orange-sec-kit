<template>
  <div>
    <!-- This component doesn't render anything visible, it just manages the WebSocket connection -->
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { ws_message } from '@/api/common'

interface WSMessage {
  msg_type: string
  type: string
  content: string
}

const socket = ref<WebSocket | null>(null)
const isConnected = ref(false)
const reconnectAttempts = ref(0)
const maxReconnectAttempts = 5
const reconnectDelay = 3000 // 3 seconds

// Connect to WebSocket
const connectWebSocket = async () => {
  try {
    // 获取WebSocket URL
    const wsUrl = ws_message()

    // 确保URL包含localhost而不是127.0.0.1
    let finalUrl = wsUrl
    if (finalUrl.includes('127.0.0.1')) {
      finalUrl = finalUrl.replace('127.0.0.1', 'localhost')
    }

    // 创建WebSocket连接
    if (window.electronAPI) {
      // 在Electron环境中直接连接
      socket.value = new WebSocket(finalUrl)
    } else {
      // 标准浏览器环境
      socket.value = new WebSocket(finalUrl)
    }

    socket.value.onopen = () => {
      isConnected.value = true
      reconnectAttempts.value = 0
    }

    socket.value.onmessage = (event) => {
      handleMessage(event.data)
    }

    socket.value.onclose = () => {
      isConnected.value = false
      handleReconnect()
    }

    socket.value.onerror = () => {
      isConnected.value = false
    }
  } catch (error) {
    handleReconnect()
  }
}

// Parse and handle messages
const handleMessage = (data: string) => {
  try {
    const message: WSMessage = JSON.parse(data)

    // Handle ping messages (heartbeat)
    if (message.msg_type === 'ping') {
      sendPong()
      return
    }

    // Handle notification messages and emit events
    if (message.msg_type === 'message') {
      // Emit message event for other components
      emitWSEvent('ws-message', message)
    }

    // Emit all messages for components that want to listen to everything
    emitWSEvent('ws-all-messages', message)
  } catch (error) {
    // Silent catch - no logging in production
  }
}

// Send pong response to server heartbeat
const sendPong = () => {
  if (socket.value && isConnected.value) {
    socket.value.send(JSON.stringify({ msg_type: 'pong' }))
  }
}

// Handle reconnection logic
const handleReconnect = () => {
  if (reconnectAttempts.value < maxReconnectAttempts) {
    reconnectAttempts.value++
    setTimeout(() => {
      connectWebSocket()
    }, reconnectDelay)
  }
}

// Event bus for other components to listen to messages
const emitWSEvent = (event: string, data: any) => {
  window.dispatchEvent(new CustomEvent(event, { detail: data }))
}

// 手动设置WebSocket URL并连接
const connectWithCustomUrl = (customUrl: string) => {
  try {
    if (socket.value) {
      // 先关闭现有连接
      socket.value.close()
    }

    socket.value = new WebSocket(customUrl)

    socket.value.onopen = () => {
      isConnected.value = true
      reconnectAttempts.value = 0
    }

    socket.value.onmessage = (event) => {
      handleMessage(event.data)
    }

    socket.value.onclose = () => {
      isConnected.value = false
    }

    socket.value.onerror = () => {
      isConnected.value = false
    }

    return true
  } catch (error) {
    return false
  }
}

// Lifecycle hooks
onMounted(() => {
  connectWebSocket()
})

onUnmounted(() => {
  if (socket.value) {
    socket.value.close()
  }
})

// 手动发送消息
const sendMessage = (message: any) => {
  if (socket.value && isConnected.value) {
    socket.value.send(JSON.stringify(message))
  }
}

// Export functions for components to use
defineExpose({
  sendMessage,
  connectWithCustomUrl,
})
</script>

<script lang="ts">
// Create a composable for other components to use
export function useWebSocketMessages() {
  const addMessageListener = (callback: (message: any) => void) => {
    const handler = (event: CustomEvent) => {
      callback(event.detail)
    }

    window.addEventListener('ws-message', handler as EventListener)

    // Return cleanup function
    return () => {
      window.removeEventListener('ws-message', handler as EventListener)
    }
  }

  const addAllMessagesListener = (callback: (message: any) => void) => {
    const handler = (event: CustomEvent) => {
      callback(event.detail)
    }

    window.addEventListener('ws-all-messages', handler as EventListener)

    // Return cleanup function
    return () => {
      window.removeEventListener('ws-all-messages', handler as EventListener)
    }
  }

  return {
    addMessageListener,
    addAllMessagesListener,
  }
}
</script>
