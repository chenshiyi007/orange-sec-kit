import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'node:path'

// 检测是否在Electron环境中构建
const isElectronBuild = process.env.npm_lifecycle_event?.includes('electron')

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    host: true,
    proxy: {
      // 代理API请求到后端服务
      '/api': {
        target: 'http://localhost:33333',
        changeOrigin: true,
        secure: false,
        ws: true
      }
    }
  },
  base: './', // 使用相对路径
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    // 不使用哈希值，确保文件名称稳定
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name].js`,
        chunkFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name].[ext]`
      }
    },
    // 不压缩代码，方便调试
    minify: false,
    // 将所有内容打包成一个文件
    cssCodeSplit: false,
    // 确保产生完整的sourcemap
    sourcemap: true
  },
  // 针对Electron的文件路径处理
  experimental: {
    // 确保资源URL使用相对路径
    renderBuiltUrl(filename, { hostType }) {
      return `./${filename}`
    }
  }
})
