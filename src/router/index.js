import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'
/* Router Modules */
import planObjRouter from './modules/plan_obj'
import planPlanRouter from './modules/plan_plan'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/home',
    component: () => import('@/views/home/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  // {
  //   path: '/iframe',
  //   component: Layout,
  //   redirect: '/iframe',
  //   children: [
  //     {
  //       path: 'iframe',
  //       name: 'iframe',
  //       component: () => import('@/views/iframe/'),
  //       meta: { title: 'iframe', icon: 'iframe' }
  //     }
  //   ]
  // },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const routerMap = {
  //  login:require('login/index').default // 同步的方式
  dashboard: () => import('@/views/dashboard/index'),
  main: () => import('@/views/main'), // 异步的方式
  drawer: () => import('@/views/drawer'),
  layout: () => import('@/layout')
}
//之后遍历这个map 并将 component 替换为map[component]
// const asyncRoutes = []

//异步挂载的路由
//动态需要根据权限加载的路由表
// export const asyncRoutes = []

// export const asyncRoutes = [
//   {
//     path: '/tested',
//     component: Layout,
//     // name: 'tested',
//     meta: { roles: ['router_ready'] }, //页面需要的权限
//     // hidden: true,
//     children: [
//       {
//         path: '',
//         // component: () => import('@/views/router_ready/tested'),
//         component: () => import('@/views/currency'),
//         name: 'tested',
//         meta: {
//           title: '被测单位',
//           icon: 'unit',
//           roles: ['router_ready'],
//           itemName: '被测单位',
//           tblAlias: '被测单位管理界面',
//           operationID: '51',
//           resId: '1469'
//         } //页面需要的权限
//       }
//     ]
//   },
//   {
//     path: '/readySystem',
//     component: Layout,
//     meta: { roles: ['router_ready'] }, //页面需要的权限
//     children: [
//       {
//         path: '',
//         // component: () => import('@/views/router_ready/system'),
//         component: () => import('@/views/currency'),
//         name: 'readySystem',
//         meta: {
//           title: '被测信息系统',
//           icon: 'system',
//           roles: ['router_ready'],
//           itemName: '被测信息系统',
//           tblAlias: '等级测评项目管理界面',
//           operationID: '51',
//           resId: '3002'
//         } //页面需要的权限
//       }
//     ]
//   },
//   {
//     path: '/personnel',
//     component: Layout,
//     meta: { roles: ['router_ready'] }, //页面需要的权限
//     children: [
//       {
//         path: '',
//         component: () => import('@/views/router_ready/personnel'),
//         name: 'personnel',
//         meta: {
//           title: '系统测评人员',
//           icon: 'user',
//           roles: ['router_ready']
//         } //页面需要的权限
//       }
//     ]
//   },
//   {
//     path: '/tools',
//     component: Layout,
//     meta: { roles: ['router_ready'] }, //页面需要的权限
//     children: [
//       {
//         path: '',
//         component: () => import('@/views/router_ready/tools'),
//         name: 'tools',
//         meta: {
//           title: '现场测试工具',
//           icon: 'tools',
//           roles: ['router_ready']
//         } //页面需要的权限
//       }
//     ]
//   },
//   {
//     path: '/planSystem',
//     component: Layout,
//     meta: { roles: ['router_plan'] }, //页面需要的权限
//     children: [
//       {
//         path: '',
//         component: () => import('@/views/router_plan/system'),
//         name: 'planSystem',
//         meta: {
//           title: '信息系统',
//           icon: 'system',
//           roles: ['router_plan']
//         } //页面需要的权限
//       }
//     ]
//   },
//   planObjRouter,
//   planPlanRouter,

//   // 404 page must be placed at the end !!!
//   { path: '*', redirect: '/404', hidden: true }
// ]

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  })

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
