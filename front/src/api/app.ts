import * as Payloads from '@/interface/app.ts'
import myAxios from '@/request.ts'

export const listApps = async (params: Payloads.AppListPayload) => {
  return myAxios.request({
    url: '/api/apps/list',
    method: 'POST',
    data: params,
  })
}

export const listAppName = async (params: Payloads.AppListPayload) => {
  return myAxios.request({
    url: '/api/apps/list_name',
    method: 'POST',
    data: params,
  })
}

export const addApp = async (params: Payloads.AppAddPayload) => {
  return myAxios.request({
    url: '/api/apps/create',
    method: 'POST',
    data: params,
  })
}

export const getAppDetail = async (params: Payloads.AppProfile) => {
  return myAxios.request({
    url: '/api/apps/detail',
    method: 'POST',
    data: params,
  })
}

export const updateApp = async (params: Payloads.AppUpdatePayload) => {
  return myAxios.request({
    url: '/api/apps/update',
    method: 'POST',
    data: params,
  })
}

export const deleteApp = async (params: Payloads.AppDeletePayload) => {
  return myAxios.request({
    url: '/api/apps/delete',
    method: 'POST',
    data: params,
  })
}

export const exportApp = async (params: Payloads.AppDeletePayload) => {
  return myAxios.request({
    url: '/api/apps/exports',
    method: 'POST',
    data: params,
  })
}

export const importApp = async (params: Payloads.AppImportPayload) => {
  return myAxios.request({
    url: '/api/apps/imports',
    method: 'POST',
    data: params,
  })
}
