import { type RouteRecordRaw } from 'vue-router'
import HelloView from '@/pages/HelloView.vue'
import NotesView from '@/pages/NotesView.vue'
import WikiLayout from '@/layouts/WikiLayout.vue'
import PocsView from '@/pages/Poc/PocListView.vue'
import AppsView from '@/pages/App/AppListView.vue'
import PocProfileView from '@/pages/Poc/PocProfileView.vue'
import PocAddView from '@/pages/Poc/PocAddView.vue'
import AppProfileView from '@/pages/App/AppProfileView.vue'

export const routers: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: '首页',
    component: HelloView,
  },
  {
    path: '/wiki',
    component: WikiLayout,
    name: '文库中心',
    children: [
      {
        path: '',
        name: '漏洞wiki',
        component: AppsView,
      },
      {
        path: 'poc',
        name: '漏洞文库',
        component: PocsView,
      },
      {
        path: 'app',
        name: '应用文库',
        component: AppsView,
      },
      {
        path:'poc/detail/:id',
        component: PocProfileView,
      },
      {
        path:'poc/add/:id',
        component: PocAddView,
      },
      {
        path:'poc/add',
        component: PocAddView,
      },
      {
        path:'app/detail/:id',
        component: AppProfileView,
      },
    ],
  },
  {
    path: '/tasks',
    name: '任务下发',
    component: NotesView,
  },
  {
    path: '/vuls',
    name: '漏洞中心',
    component: NotesView,
  },
  {
    path: '/tools',
    name: '工具合集',
    component: NotesView,
  },
  {
    path: '/setting',
    name: '系统设置',
    component: NotesView,
  },
]
