import myAxios from '@/request.ts'

export interface HostUpdatePayload {
  instance_id: string
  host: string
  domain: string
  ip_address: string
  icp_number: string
  company: string
  address: string
  company_city: string
  company_province: string
  industry: string
  company_register_money: number
  baidu_rank: number
  yi_dong_rank: number
  google_rank: number
}

export const updateHost = async (params: HostUpdatePayload) => {
  return myAxios.request({
    url: '/api/hosts/update',
    method: 'POST',
    data: params,
  })
}
