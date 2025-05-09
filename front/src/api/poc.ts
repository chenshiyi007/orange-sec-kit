import myAxios from '@/request.ts'
import * as Payloads from '../interface/poc.ts'

export const listPocs = async (params: Payloads.PocListPayload) => {
  return myAxios.request({
    url: '/api/pocs/list',
    method: 'POST',
    data: params,
  })
}
export const getPocDetail = async (params: Payloads.PocDetailPayload) => {
  return myAxios.request({
    url: '/api/pocs/detail',
    method: 'POST',
    data: params,
  })
}

export const createPoc = async (params: Payloads.PocCreatePayload) => {
  return myAxios.request({
    url: '/api/pocs/create',
    method: 'POST',
    data: params,
  })
}

export const updatePoc = async (params: Payloads.PocUpdatePayload) => {
  return myAxios.request({
    url: '/api/pocs/update',
    method: 'POST',
    data: params,
  })
}

export const deletePocs = async (params: Payloads.PocDeletePayload) => {
  return myAxios.request({
    url: '/api/pocs/delete',
    method: 'POST',
    data: params,
  })
}

export const checkPoc = async (params: Payloads.PocCheckPayload) => {
  return myAxios.request({
    url: '/api/pocs/check_rule',
    method: 'POST',
    data: params,
  })
}

export const ExportPoc = async (params: Payloads.PocExportPayload) => {
  return myAxios.request({
    url: '/api/pocs/export/docx',
    method: 'POST',
    data: params,
  })
}
