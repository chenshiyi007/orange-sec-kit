import myAxios from '@/request.ts'

interface SystemInfoResponse {
  code: number
  message: string
  data: {
    cpu: string
    mem: string
    net_upload: string
    net_download: string
    net_total: string
    goroutines: string
  }
}

export const getSystemInfo = async () => {
  return myAxios.request<SystemInfoResponse>({
    url: '/api/system/infos',
    method: 'GET',
  })
}

// 系统配置接口响应类型
interface SystemConfigResponse {
  code: number
  message: string
  data: {
    fofa_key: string
    fofa_max_count: number
    hunter_key: string
    hunter_max_count: number
    ai_zhan_token: string
    site_collect_folder: string
    report_export_folder: string
    app_export_folder: string
    engine_version?: string
    system_auth: string
    system_auth_end_time: string
  }
}

// 获取系统配置
export const getSystemConfig = async () => {
  return myAxios.request<SystemConfigResponse>({
    url: '/api/system/configs',
    method: 'GET',
  })
}

// 保存系统配置
export const saveSystemConfig = async (config: {
  fofa_key: string
  fofa_max_count: number
  hunter_key: string
  hunter_max_count: number
  ai_zhan_token: string
  site_collect_folder: string
  report_export_folder: string
  app_export_folder: string
  license_path: string
}) => {
  return myAxios.request<{ code: number; message: string }>({
    url: '/api/system/configs/update',
    method: 'POST',
    data: config,
  })
}

// 用户协议接口响应类型
interface UserAgreementResponse {
  code: number
  message: string
  data: boolean
}

export const getUserAgree = async () => {
  return myAxios.request<UserAgreementResponse>({
    url: '/api/system/user_agree',
    method: 'GET',
  })
}

// 更新用户协议接口
export const updateUserAgree = async () => {
  return myAxios.request<{ code: number; message: string }>({
    url: '/api/system/user_agree/update',
    method: 'POST',
  })
}
