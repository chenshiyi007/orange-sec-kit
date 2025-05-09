export interface AppListPayload {
  name: string
  page: number
  size: number
  start_time?: number
  end_time?: number
  version?: string
}

export interface AppProfile {
  instance_id: string
}

export interface AppAddPayload {
  name: string
  description: string
  fofa_finger: string
  hunter_finger: string
  version: string
  company: string
}

export interface AppUpdatePayload {
  instance_id: string
  name: string
  description: string
  fofa_finger: string
  hunter_finger: string
  version: string
  company: string
}

export interface AppDeletePayload {
  instance_id: Array<string>
}

export interface AppImportPayload {
  is_upset: boolean
  sync?: string
  file_path?: string
}
