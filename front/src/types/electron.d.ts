// Electron API类型声明
interface ElectronAPI {
  // 基础API
  send: (channel: string, data: any) => void
  on: (channel: string, callback: (event: any, ...args: any[]) => void) => (() => void)

  // 文件选择API
  selectFolder: () => Promise<string | null>
  selectFile: (fileTypes?: string[]) => Promise<string | null>

  // 窗口管理API
  openNewWindow: (options: {
    width?: number
    height?: number
    modal?: boolean
    route?: string
    devTools?: boolean
    title?: string
  }) => Promise<number>

  // 系统API
  isBackendReady: () => Promise<boolean>
  openExternal: (url: string) => Promise<void>
  getOSInfo: () => {
    platform: string
    arch: string
    version: string
  }

  // 消息传递API
  sendMessage: (channel: string, data: any) => void
  receiveMessage: (channel: string, func: (...args: any[]) => void) => void
}

// 扩展Window接口
declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}

export {};
