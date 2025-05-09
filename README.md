# 小橘子漏洞工坊 - 桌面版

小橘子漏洞工坊安全工具集的桌面版应用，基于Electron构建。

## 项目结构

- `electron/` - Electron主进程和预加载脚本
- `front/` - Vue 3 + Vite前端应用
- `backend/` - 后端可执行文件
- `resources/` - 应用资源（图标等）

## 开发指南

### 开发环境配置

1. 安装依赖
   ```bash
   npm install
   cd front && npm install
   ```

2. 开发模式运行
   ```bash
   npm run dev
   ```
   这将启动前端开发服务器，并在其就绪后启动Electron应用。

### 构建应用

构建适用于当前平台的安装包:
```bash
npm run build
```

构建特定平台的安装包:
```bash
# macOS
npm run build:mac

# Windows
npm run build:win

# Linux
npm run build:linux
```

构建后的文件将保存在`dist/`目录下。

## 应用配置

应用配置在`package.json`的`build`部分进行设置，包括:

- 应用ID
- 产品名称
- 打包文件
- 图标
- 安装程序选项

## 注意事项

1. 后端应用将作为资源被打包，根据操作系统决定启动`.exe`或无扩展名的可执行文件
2. 在Windows上需要命名为`orange_kit_backend.exe`，在其他平台上需要命名为`orange_kit_backend`
3. 构建前请确保已将正确的后端文件放在`backend/`目录中
