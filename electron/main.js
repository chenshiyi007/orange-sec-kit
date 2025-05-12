const { app, BrowserWindow, shell, ipcMain, dialog, session, Menu } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');
const http = require('http');
const { globalShortcut } = require('electron');

// 禁用 Electron Security Warning
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true';

let mainWindow;
let backendProcess;
const isDevelopment = process.env.NODE_ENV === 'development';

// 专门用于Windows环境的后端路径查找函数
function findWindowsBackendPath(backendName) {
  const isWin = process.platform === 'win32';
  if (!isWin) return null;
  
  // 增加可能的路径查找逻辑
  const exePath = app.getPath('exe');
  const exeDir = path.dirname(exePath);
  
  // 常见的Windows Electron打包路径模式
  const possiblePaths = [
    // 应用根目录的resources路径
    path.join(exeDir, 'resources', 'backend', backendName),
    // 尝试不同的大小写
    path.join(exeDir, 'Resources', 'backend', backendName),
    // 常规路径
    path.join(app.getAppPath(), 'resources', 'backend', backendName),
    path.join(app.getAppPath(), 'Resources', 'backend', backendName),
    // 相对于应用程序目录的路径
    path.join(app.getAppPath(), '..', 'resources', 'backend', backendName),
  ];
  
  // 直接检查用户报告的路径
  const reportedPath = path.join(exeDir, 'resources', 'backend', 'orange_kit_backend.exe');
  if (fs.existsSync(reportedPath)) {
    return reportedPath;
  }
  
  // 检查所有可能的路径
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      return p;
    }
  }
  
  return null;
}

// 辅助函数：列出目录内容
function listDirectoryContents(dir) {
  try {
    const items = fs.readdirSync(dir);
    items.forEach(item => {
      const itemPath = path.join(dir, item);
      const stats = fs.statSync(itemPath);
    });
  } catch (err) {
    // 忽略错误
  }
}

// 启动后端服务
async function startBackend() {
  // 首先尝试从应用程序的资源目录加载后端
  const isWin = process.platform === 'win32';
  // 获取当前系统架构
  const arch = process.arch; // 可能是 'x64' 或 'arm64'
  
  let backendPath;
  // 获取对应架构的后端文件名
  const backendName = isWin 
    ? 'orange_kit_backend.exe' 
    : process.platform === 'darwin'
      ? `orange_kit_backend_darwin_${arch === 'x64' ? 'amd64' : 'arm64'}`
      : 'orange_kit_backend_linux_amd64';
  
  // Windows环境使用专门的路径查找函数
  if (isWin) {
    const windowsBackendPath = findWindowsBackendPath(backendName);
    if (windowsBackendPath) {
      backendPath = windowsBackendPath;
    }
  }
  
  // 如果Windows专用查找没有找到，继续使用原有逻辑
  if (!backendPath) {
    // 在打包环境中，使用资源路径
    if (!isDevelopment) {
      // 在macOS上，后端文件应该在Resources目录中
      if (process.platform === 'darwin') {
        // macOS路径：/Applications/小橘子漏洞工坊.app/Contents/Resources/backend/orange_kit_backend_x64 或 orange_kit_backend_arm64
        backendPath = path.join(app.getAppPath(), '..', '..', 'Resources', 'backend', backendName);
      } else if (isWin) {
        // Windows特定路径，尝试多种可能的路径格式
        backendPath = path.join(app.getAppPath(), 'resources', 'backend', backendName);
        // 检查是否存在
        if (!fs.existsSync(backendPath)) {
          // 尝试大写Resources
          backendPath = path.join(app.getAppPath(), 'Resources', 'backend', backendName);
        }
      } else {
        // Linux路径
        backendPath = path.join(app.getAppPath(), 'resources', 'backend', backendName);
      }
    } else {
      // 开发环境使用相对路径
      backendPath = path.join(__dirname, '..', 'backend', backendName);
    }
  }
  
  // 确保文件存在 - 尝试所有可能的路径
  if (!fs.existsSync(backendPath)) {
    // 尝试查找可能存在的路径
    const possiblePaths = [
      path.join(__dirname, '..', 'backend', backendName),
      path.join(app.getAppPath(), 'backend', backendName),
      path.join(process.resourcesPath || '', 'backend', backendName),
      path.join(app.getAppPath(), '..', 'backend', backendName),
      // 添加更多可能的Windows路径
      path.join(app.getAppPath(), 'resources', 'backend', backendName),
      path.join(app.getAppPath(), 'Resources', 'backend', backendName),
      // 应用程序根目录的resources路径
      path.join(path.dirname(app.getPath('exe')), 'resources', 'backend', backendName),
      path.join(path.dirname(app.getPath('exe')), 'Resources', 'backend', backendName)
    ];
    
    for (const p of possiblePaths) {
      if (fs.existsSync(p)) {
        backendPath = p;
        break;
      }
    }
    
    // 如果还是找不到，尝试使用通用名称(没有架构后缀)
    if (!fs.existsSync(backendPath)) {
      const genericBackendName = isWin 
        ? 'orange_kit_backend.exe' 
        : process.platform === 'darwin'
          ? 'orange_kit_backend_darwin_amd64' // 尝试默认的AMD64版本
          : 'orange_kit_backend_linux_amd64';
          
      const genericPaths = [
        path.join(__dirname, '..', 'backend', genericBackendName),
        path.join(app.getAppPath(), 'backend', genericBackendName),
        path.join(process.resourcesPath || '', 'backend', genericBackendName),
        path.join(app.getAppPath(), '..', 'backend', genericBackendName)
      ];
      
      for (const p of genericPaths) {
        if (fs.existsSync(p)) {
          backendPath = p;
          break;
        }
      }
      
      if (!fs.existsSync(backendPath)) {
        return null;
      }
    }
  }

  // 检查文件是否可执行
  try {
    fs.accessSync(backendPath, fs.constants.X_OK);
  } catch (err) {
    // 在MacOS/Linux尝试添加执行权限
    if (process.platform !== 'win32') {
      try {
        require('child_process').execSync(`chmod +x "${backendPath}"`);
      } catch (chmodErr) {
        // 忽略错误
      }
    }
  }
  
  // 启动后端进程
  let backend;
  
  if (isWin) {
    try {
      // 直接启动后端程序
      backend = spawn(backendPath, [], {
        cwd: path.dirname(backendPath),
        stdio: 'pipe',
        shell: false,
        windowsHide: false
      });
      
      return backend;
    } catch (err) {
      // 尝试备用启动方式
      try {
        // 使用cmd.exe
        backend = spawn('cmd.exe', ['/c', `"${backendPath}"`], {
          cwd: path.dirname(backendPath),
          stdio: 'pipe',
          shell: false,
          windowsHide: false
        });
        
        return backend;
      } catch (backupErr) {
        return null;
      }
    }
  } else {
    // 非Windows平台的正常启动逻辑
    backend = spawn(backendPath, [], {
      env: { ...process.env, NODE_ENV: 'production' },
      stdio: 'pipe', 
      shell: false,
      windowsHide: true,
      cwd: path.dirname(backendPath)
    });
    
    return backend;
  }
}

function createWindow() {
  // 设置默认的网络会话，用于控制请求
  const ses = session.defaultSession;
  
  // 隐藏默认菜单
  Menu.setApplicationMenu(null);
  
  // 拦截WebSocket请求，修改Origin头
  ses.webRequest.onBeforeSendHeaders((details, callback) => {
    // 检查是否是WebSocket请求
    if (details.url.startsWith('ws://') || details.url.startsWith('wss://')) {
      // 强制设置WebSocket请求的Origin头为localhost
      if (details.url.includes('localhost') || details.url.includes('127.0.0.1')) {
        // 修改Origin头，确保后端CheckOrigin函数通过验证
        details.requestHeaders['Origin'] = 'http://localhost:33333';
        details.requestHeaders['Host'] = 'localhost:33333';
      }
    }
    
    callback({ requestHeaders: details.requestHeaders });
  });
  
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      // 允许WebSockets和远程内容
      webSecurity: false, // 警告：这会禁用同源策略，仅在桌面应用中这样做是安全的
      devTools: true, // 确保开发者工具可用
    },
    show: false,
  });

  // 加载应用
  if (isDevelopment) {
    mainWindow.loadURL('http://localhost:5173');
    // 在开发环境下自动打开开发者工具
    mainWindow.webContents.openDevTools();
  } else {
    const indexPath = path.join(__dirname, '..', 'front', 'dist', 'index.html');
    mainWindow.loadFile(indexPath);
  }

  // 当窗口准备好了再显示，避免白屏
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // 打开外部链接
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// 为API添加相应的处理函数
function setupIPC() {
  // 选择文件夹
  ipcMain.handle('select-folder', async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ['openDirectory']
    });
    
    return result.canceled ? null : result.filePaths[0];
  });
  
  // 选择文件
  ipcMain.handle('select-file', async (event, fileTypes) => {
    const filters = fileTypes && fileTypes.length > 0 ? [
      { name: 'Allowed Files', extensions: fileTypes }
    ] : [
      { name: 'All Files', extensions: ['*'] }
    ];
    
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ['openFile'],
      filters
    });
    
    return result.canceled ? null : result.filePaths[0];
  });
  
  // 打开新窗口
  ipcMain.handle('open-new-window', async (event, options) => {
    const newWindow = new BrowserWindow({
      width: options.width || 800,
      height: options.height || 600,
      parent: options.modal ? mainWindow : null,
      modal: options.modal || false,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        nodeIntegration: false,
        contextIsolation: true,
      },
      title: options.title || '小橘子漏洞工坊',
    });
    
    if (isDevelopment) {
      await newWindow.loadURL(`http://localhost:5173${options.route || '/'}`);
      if (options.devTools) {
        newWindow.webContents.openDevTools();
      }
    } else {
      // 在生产环境中，需要加载已构建的HTML文件
      await newWindow.loadFile(path.join(__dirname, '..', 'front', 'dist', 'index.html'), {
        hash: options.route
      });
    }
    
    return newWindow.id;
  });
  
  // 检查后端是否就绪
  ipcMain.handle('is-backend-ready', async () => {
    // 如果我们自己启动了后端进程，先检查进程是否存在
    if (backendProcess) {
      // 即使有进程，也通过HTTP请求确认服务确实可访问
      try {
        const isReachable = await checkBackendReachable();
        if (isReachable) {
          return true;
        } else {
          // 给它一些时间启动，避免过早判断
          await new Promise(resolve => setTimeout(resolve, 2000));
          const retryReachable = await checkBackendReachable();
          return retryReachable;
        }
      } catch (error) {
        return false;
      }
    }
    
    // 检查端口33333是否已有服务在监听
    try {
      const isReachable = await checkBackendReachable();
      return isReachable;
    } catch (error) {
      return false;
    }
  });
  
  // 打开外部链接
  ipcMain.handle('open-external', async (event, url) => {
    await shell.openExternal(url);
  });
}

// 检查后端服务是否可访问
function checkBackendReachable() {
  return new Promise((resolve) => {
    // 固定后端端口为33333
    const backendPort = 33333;
    // 使用系统信息API
    const apiPath = '/api/system/infos';
    
    // 设置超时时间
    const timeout = process.platform === 'win32' ? 8000 : 5000;
    
    // 创建请求 - 使用127.0.0.1强制IPv4
    const req = http.request({
      hostname: '127.0.0.1', // 明确使用IPv4地址
      port: backendPort,
      path: apiPath,
      method: 'GET',
      timeout: timeout
    }, (res) => {
      let data = '';
      
      // 收集响应数据
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      // 响应结束
      res.on('end', () => {
        // 成功收到响应，后端就绪
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
    
    req.on('error', (err) => {
      // 如果连接被拒绝，尝试使用简单的端口检测
      if (err.code === 'ECONNREFUSED') {
        try {
          const net = require('net');
          const testSocket = new net.Socket();
          
          testSocket.on('connect', () => {
            testSocket.destroy();
            resolve(true);
          });
          
          testSocket.on('error', () => {
            testSocket.destroy();
            resolve(false);
          });
          
          testSocket.on('timeout', () => {
            testSocket.destroy();
            resolve(false);
          });
          
          testSocket.setTimeout(2000);
          testSocket.connect(33333, '127.0.0.1');
        } catch (socketError) {
          resolve(false);
        }
      } else {
        resolve(false);
      }
    });
    
    req.on('timeout', () => {
      req.destroy();
      resolve(false);
    });
    
    req.end();
  });
}

// 这个方法将会在 Electron 完成初始化
// 以及创建浏览器窗口的时候调用
app.whenReady().then(async () => {
  // 设置IPC处理函数
  setupIPC();
  
  // 先创建和显示主窗口
  createWindow();
  
  // 在后台启动后端服务
  setTimeout(async () => {
    backendProcess = await startBackend();
  }, 500);
  
  // 设置开发者工具快捷键
  app.on('web-contents-created', (e, contents) => {
    // 添加自定义开发者工具快捷键
    // Windows: F12 和 Ctrl+Shift+I
    // macOS: Command+Option+I
    contents.on('before-input-event', (event, input) => {
      // F12 快捷键 (主要用于Windows)
      if (input.key === 'F12' && !input.control && !input.meta && !input.shift && !input.alt) {
        contents.openDevTools();
        event.preventDefault();
      }
      
      // Windows/Linux: Ctrl+Shift+I
      if (input.key === 'I' && input.control && input.shift && !input.alt && !input.meta) {
        contents.openDevTools();
        event.preventDefault();
      }
      
      // macOS: Command+Option+I
      if (input.key === 'i' && !input.control && !input.shift && input.alt && input.meta) {
        contents.openDevTools();
        event.preventDefault();
      }
    });
  });

  // 注册调试全局快捷键
  globalShortcut.register(process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I', () => {
    const focusedWindow = BrowserWindow.getFocusedWindow();
    if (focusedWindow) {
      focusedWindow.webContents.toggleDevTools();
    }
  });
  
  // 保持菜单隐藏
  Menu.setApplicationMenu(null);

  app.on('activate', () => {
    // 在 macOS 系统内, 如果没有已开启的应用窗口
    // 点击 dock 图标时通常会重新创建一个窗口
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// 除了 macOS 外，当所有窗口都被关闭的时候退出程序
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    try {
      if (backendProcess && backendProcess.kill) {
        backendProcess.kill();
      }
    } catch (err) {
      // 忽略退出时可能出现的错误
    }
    app.quit();
  }
});

// 在 macOS 上，用户关闭所有窗口后退出程序
app.on('before-quit', () => {
  try {
    if (backendProcess && backendProcess.kill) {
      backendProcess.kill();
    }
  } catch (err) {
    // 忽略退出时可能出现的错误
  }
});

// 在开发环境下，当窗口被关闭后，如果应用程序没有其他窗口
// 我们应该不会让应用程序退出
if (isDevelopment) {
  app.on('window-all-closed', (e) => {
    e.preventDefault();
    try {
      if (backendProcess && backendProcess.kill) {
        backendProcess.kill();
      }
    } catch (err) {
      // 忽略退出时可能出现的错误
    }
    app.quit();
  });
} 