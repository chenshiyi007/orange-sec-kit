import myAxios from '@/request.ts'
import * as Payloads from '../interface/vul.ts'

export const listVuls = async (params: Payloads.VulListPayload) => {
  return myAxios.request({
    url: '/api/vuls/list',
    method: 'POST',
    data: params,
  })
}

export const getVulDetail = async (params: Payloads.VulDetailPayload) => {
  return myAxios.request({
    url: '/api/vuls/detail',
    method: 'POST',
    data: params,
  })
}

export const deleteVuls = async (params: Payloads.VulDeletePayload) => {
  return myAxios.request({
    url: '/api/vuls/delete',
    method: 'POST',
    data: params,
  })
}

export const updateVul = async (params: Payloads.VulUpdatePayload) => {
  return myAxios.request({
    url: '/api/vuls/update',
    method: 'POST',
    data: params,
  })
}

export const getInfo = async (params: Payloads.VulDetailPayload) => {
  return myAxios.request({
    url: '/api/vuls/get_info',
    method: 'POST',
    timeout: 30000,
    data: params,
  })
}
