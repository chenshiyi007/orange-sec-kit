export interface VulListPayload {
  size: number
  page: number
  name?: string
  task_name?: string
  poc_name?: string
  company?: string
  vul_url?: string
  poc_id?: string
  task_id?: string
  host?: string
  start_time?: number
  end_time?: number
}

export interface VulDetailPayload {
  instance_id: string
}

export interface VulImgsPayload {
  instance_id: string
  Biz: string
}

export interface VulDeletePayload {
  instance_id: string[]
}

export interface VulUpdatePayload {
  instance_id: string
  name?: string
  vul_url?: string
}

// Future interfaces can be added as needed:
// export interface VulCreatePayload { }
