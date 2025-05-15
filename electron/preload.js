const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getOSInfo: () => {
    return {
      platform: process.platform,
      arch: process.arch,
      version: process.getSystemVersion()
    };
  },
  
  send: (channel, data) => ipcRenderer.send(channel, data),
  on: (channel, callback) => ipcRenderer.on(channel, callback),
  selectFolder: () => ipcRenderer.invoke('select-folder'),
  selectFile: (fileTypes) => ipcRenderer.invoke('select-file', fileTypes),
  openNewWindow: (options) => ipcRenderer.invoke('open-new-window', options),
  isBackendReady: () => ipcRenderer.invoke('is-backend-ready'),
  openExternal: (url) => ipcRenderer.invoke('open-external', url),
  
  // 轮询检查后端状态 - 定时检查后端是否就绪
  pollBackendStatus: (callback, interval = 2000) => {
    const checkInterval = setInterval(async () => {
      try {
        const isReady = await ipcRenderer.invoke('is-backend-ready');
        callback(isReady);
        if (isReady) {
          clearInterval(checkInterval);
        }
      } catch (err) {
        callback(false);
      }
    }, interval);
    
    return () => clearInterval(checkInterval); // 返回清理函数
  },
  
  sendMessage: (channel, data) => {
    // 白名单通道
    const validChannels = ['toMain', 'close-current-window'];
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
  
  // 接收来自主进程的消息
  receiveMessage: (channel, func) => {
    const validChannels = ['fromMain'];
    if (validChannels.includes(channel)) {
      // 使用一次性函数防止内存泄漏
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    }
  }
});

// 通知渲染进程预加载脚本已完成加载
window.addEventListener('DOMContentLoaded', () => {
  // 预加载脚本已加载完成
}); 