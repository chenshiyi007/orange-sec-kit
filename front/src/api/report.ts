import myAxios from '@/request.ts'

export interface PocExportPayload {
  poc_id: string
  need_assets: boolean
  need_reproduce: boolean
  vul_id?: Array<string>
}

export interface VulExportPayload {
  vul_id: string
}
export const ExportPoc = async (params: PocExportPayload) => {
  return myAxios.request({
    url: '/api/report/poc',
    method: 'POST',
    data: params,
  })
}

export const ExportVul = async (params: VulExportPayload) => {
  return myAxios.request({
    url: '/api/report/vul',
    method: 'POST',
    data: params,
  })
}
