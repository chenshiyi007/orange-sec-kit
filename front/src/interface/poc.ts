export interface PocListPayload {
  name: string
  page: number
  size: number
  level?: Array<string>
  vul_type?: Array<string>
  vul_path?: string
  vul_param?: string
  start_time?: number
  end_time?: number
  app_instance_id?: string
}

export interface PocDetailPayload {
  instance_id: string
}

export interface PocCreatePayload {
  name: string
  app_instance_id: string
  vul_description: string
  vul_type: string
  vul_path: string
  vul_param: string
  vul_reproduce: string
  repair_suggestion: string
  level: string
  rule_link: string
}

export interface PocUpdatePayload {
  instance_id: string
  name: string
  app_instance_id: string
  vul_description: string
  vul_type: string
  vul_path: string
  vul_param: string
  vul_reproduce: string
  repair_suggestion: string
  level: string
  rule_link: string
}
export interface PocDeletePayload {
  instance_id: Array<string>
}

export interface PocCheckPayload {
  target: string
  proxy?: string
  rule_link?: string
  poc_instance_id?: string
  save_poc?: boolean
  task_id?: string
}

export interface PocExportPayload {
  poc_id: string
  need_assets: boolean
  need_reproduce: boolean
  vul_id?: Array<string>
}
