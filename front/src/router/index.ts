import { createRouter, createWebHashHistory } from 'vue-router'
import { routers } from '@/router/routers.ts'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: routers,
})

export default router
