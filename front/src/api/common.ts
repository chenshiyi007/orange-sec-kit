import myAxios from '@/request.ts'

// Interface for image upload payload
export interface UploadImagePayload {
  biz: string // Business type (e.g., 'asset', 'supplementary')
  image: File // Image file object
  instance_id: string // Related instance ID
  desc: string // Image description
}

export const uploadImage = async (params: UploadImagePayload) => {
  const formData = new FormData()
  formData.append('biz', params.biz)
  formData.append('image', params.image)
  formData.append('instance_id', params.instance_id)
  formData.append('desc', params.desc)

  return myAxios.request({
    url: '/api/common/upload-img',
    method: 'POST',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

export interface GetImagePayload {
  biz: string
  instance_id: string
}

export const getImgs = async (params: GetImagePayload) => {
  return myAxios.request({
    url: '/api/common/list/imgs',
    method: 'POST',
    data: params,
  })
}

export interface GetImagePayload {
  biz: string
  instance_id: string
}

export const deleteImg = async (id: string) => {
  return myAxios.request({
    url: '/api/common/img/delete',
    method: 'POST',
    data: {
      instance_id: id,
    },
  })
}

export const ws_message = () => {
  // 根据环境自动决定WebSocket URL
  let wsUrl = ''

  // 检查是否在Electron环境中
  const isElectron = window.electronAPI !== undefined
  const isProd = import.meta.env.PROD

  // 在打包的Electron应用中
  if (isProd && isElectron) {
    // 使用localhost替代127.0.0.1，避免可能的CORS问题
    wsUrl = 'ws://localhost:33333/api/common/ws/messages'
  }
  // 在浏览器生产环境中
  else if (isProd) {
    // 使用相对URL，这样会自动匹配当前域名
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    const host = window.location.host
    wsUrl = `${protocol}//${host}/api/common/ws/messages`
  }
  // 在开发环境中
  else {
    // 开发环境固定使用localhost
    wsUrl = 'ws://localhost:33333/api/common/ws/messages'
  }

  // 无论如何，都确保使用localhost而不是127.0.0.1
  wsUrl = wsUrl.replace('127.0.0.1', 'localhost')

  return wsUrl
}
