import { type RouteRecordRaw } from 'vue-router'
import HelloView from '@/pages/Home/HelloView.vue'
import WikiLayout from '@/layouts/WikiLayout.vue'
import PocsView from '@/pages/Poc/PocListView.vue'
import AppsView from '@/pages/App/AppListView.vue'
import PocProfileView from '@/pages/Poc/PocProfileView.vue'
import PocAddView from '@/pages/Poc/PocAddView.vue'
import AppProfileView from '@/pages/App/AppProfileView.vue'
import TaskListView from '@/pages/Task/TaskListView.vue'
import VulListView from '@/pages/Vul/VulListView.vue'
import VulProfileView from '@/pages/Vul/VulProfileView.vue'
import ToolsView from '@/pages/Tools/ToolsView.vue'
import SystemView from '@/pages/System/SystemView.vue'
import WebRequesterStandalone from '@/pages/Tools/WebRequesterStandalone.vue'
import UserAgreement from '@/pages/Init/UserAgreement.vue'
import LoadingPage from '@/pages/Init/LoadingPage.vue'

export const routers: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: '初始化',
    component: LoadingPage,
    meta: {
      isHidden: true,
    },
  },
  {
    path: '/init/agreement',
    name: '用户协议',
    component: UserAgreement,
    meta: {
      isHidden: true,
    },
  },
  {
    path: '/home',
    name: '首页',
    component: HelloView,
    meta: {
      i18nKey: 'home',
    },
  },
  {
    path: '/wiki',
    component: WikiLayout,
    name: '文库中心',
    meta: {
      i18nKey: 'wikiCenter',
    },
    children: [
      {
        path: '',
        name: '漏洞wiki',
        component: AppsView,
        meta: {
          i18nKey: 'vulWiki',
        },
      },
      {
        path: 'poc',
        name: '漏洞文库',
        component: PocsView,
        meta: {
          i18nKey: 'vulLibrary',
        },
      },
      {
        path: 'app',
        name: '应用文库',
        component: AppsView,
        meta: {
          i18nKey: 'appLibrary',
        },
      },
      {
        path: 'poc/detail/:id',
        component: PocProfileView,
      },
      {
        path: 'poc/add/:id',
        component: PocAddView,
      },
      {
        path: 'poc/add',
        component: PocAddView,
      },
      {
        path: 'app/detail/:id',
        component: AppProfileView,
      },
    ],
  },
  {
    path: '/tasks',
    name: '任务下发',
    component: TaskListView,
    meta: {
      i18nKey: 'taskDistribution',
    },
  },
  {
    path: '/vuls',
    name: '漏洞中心',
    component: VulListView,
    meta: {
      i18nKey: 'vulCenter',
    },
  },
  {
    path: '/vuls/detail/:id',
    component: VulProfileView,
    meta: {
      isHidden: true,
    },
  },
  {
    path: '/tools',
    name: '工具合集',
    component: ToolsView,
    meta: {
      i18nKey: 'toolCollection',
    },
    children: [
      {
        path: '',
        redirect: '/tools/webRequester',
      },
      {
        path: ':tool',
        component: ToolsView,
      },
    ],
  },
  {
    path: '/standalone/webrequester',
    name: 'WebRequester独立页面',
    component: WebRequesterStandalone,
    meta: {
      isHidden: true,
    },
  },
  {
    path: '/setting',
    name: '系统设置',
    component: SystemView,
    meta: {
      i18nKey: 'systemSettings',
    },
  },
]
