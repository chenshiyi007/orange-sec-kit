export interface TaskListPayload {
  page: number
  size: number
  name?: string
  status?: Array<string>
  start_time?: number
  end_time?: number
}

export interface TaskCreatePayload {
  name: string
  targets?: string
  target_file?: string
  target_auto_search?: boolean
  is_save_target?: boolean
  worker_count: number
  app_id: Array<string>
  poc_id: Array<string>
  proxy?: string
  scan_mode: string
  search_engines?: Array<string>
  scan_config?: string
}
