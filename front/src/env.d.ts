/// <reference types="vite/client" />

// 声明Vue文件模块，让TypeScript识别.vue文件
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
