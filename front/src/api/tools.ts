import myAxios from '@/request.ts'

// 弱口令检测模型数据类型
export interface WeekPasswordCheck {
  model: string // 检测组件/模型
  host: string // 目标主机
  port: number // 端口
  user_name: string // 用户名
  password: string // 密码
  time_out: number // 超时时间
}

// 获取可用的弱口令检测组件列表
export function getWeekPasswordModels() {
  return myAxios.get('/api/tools/week_password/list')
}

// 执行弱口令检测
export function checkWeekPassword(params: WeekPasswordCheck) {
  return myAxios.post('/api/tools/week_password/check', params)
}

export interface WebRequestPayload {
  protocol: string // 协议
  row_data: string // 请求包
  proxy?: string // 代理
  isRedirect?: boolean // 是否重定向
  timeout: number // 超时时间(ms)
}

// web发包
export function webRequest(params: WebRequestPayload) {
  // 设置超时时间
  const requestOptions = {
    timeout: params.timeout, // 使用传入的超时时间设置axios请求
  }

  return myAxios.post('/api/tools/web_request/send', params, requestOptions)
}
