import myAxios from '@/request.ts'
import * as Payloads from '../interface/task.ts'

export const listTasks = async (params: Payloads.TaskListPayload) => {
  return myAxios.request({
    url: '/api/tasks/list',
    method: 'POST',
    data: params,
  })
}

export const createTask = async (params: Payloads.TaskCreatePayload) => {
  // 确保布尔字段的类型正确
  const data = {
    ...params,
    target_auto_search: !!params.target_auto_search,
    is_save_target: !!params.is_save_target,
  }

  return myAxios.request({
    url: '/api/tasks/create',
    method: 'POST',
    data,
  })
}

export const deleteTasks = async (params: Array<string>) => {
  // 确保布尔字段的类型正确
  const data = {
    task_id: params,
  }

  return myAxios.request({
    url: '/api/tasks/delete',
    method: 'POST',
    data,
  })
}

export const startScan = async (instanceId: string) => {
  return myAxios.request({
    url: '/api/tasks/start',
    method: 'POST',
    data: {
      task_id: instanceId,
    },
  })
}

export const pauseScan = async (instanceId: string) => {
  return myAxios.request({
    url: '/api/tasks/pause',
    method: 'POST',
    data: {
      task_id: instanceId,
    },
  })
}

export const getTaskStatistics = async () => {
  return myAxios.request({
    url: '/api/tasks/statistics',
    method: 'GET',
  })
}

export const exportTaskReport = async (taskIds: string[]) => {
  return myAxios.request({
    url: '/api/tasks/export/docx',
    method: 'POST',
    data: {
      task_id: taskIds,
    },
  })
}
