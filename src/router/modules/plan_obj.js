/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const planObjRouter = {
  path: '/object',
  component: Layout,
  redirect: '/object/technology/securityLevel',
  name: 'object',
  meta: {
    title: '测评对象',
    icon: 'obj',
    roles: ['router_plan']
  },
  children: [
    {
      path: 'technology',
      component: () => import('@/views/router_plan/object/technology'), // Parent router-view
      name: 'technology',
      meta: { title: '技术要求', roles: ['router_plan'] },
      redirect: '/router_plan/object/technology',
      children: [
        {
          path: 'securityLevel',
          component: () =>
            import('@/views/router_plan/object/technology/securityLevel'),
          name: 'securityLevel_technology',
          meta: { title: '安全层面', roles: ['router_plan'] }
        },
        {
          path: 'objList',
          component: () =>
            import('@/views/router_plan/object/technology/objList'),
          name: 'objList_technology',
          meta: { title: '测评对象清单', roles: ['router_plan'] }
        }
      ]
    },
    {
      path: 'manage',
      component: () => import('@/views/router_plan/object/manage'), // Parent router-view
      name: 'manage',
      meta: { title: '管理要求', roles: ['router_plan'] },
      redirect: '/router_plan/object/manage',
      children: [
        {
          path: 'securityLevel',
          component: () =>
            import('@/views/router_plan/object/manage/securityLevel'),
          name: 'securityLevel_manage',
          meta: { title: '安全层面', roles: ['router_plan'] }
        },
        {
          path: 'objList',
          component: () => import('@/views/router_plan/object/manage/objList'),
          name: 'objList_manage',
          meta: { title: '测评对象清单', roles: ['router_plan'] }
        }
      ]
    },
    {
      path: 'currency',
      component: () => import('@/views/router_plan/object/currency'), // Parent router-view
      name: 'currency',
      meta: { title: '通用要求', roles: ['router_plan'] },
      redirect: '/router_plan/object/currency',
      children: [
        {
          path: 'securityLevel_currency',
          component: () =>
            import('@/views/router_plan/object/currency/securityLevel'),
          name: 'securityLevel_currency',
          meta: { title: '安全层面', roles: ['router_plan'] }
        },
        {
          path: 'objList',
          component: () =>
            import('@/views/router_plan/object/currency/objList'),
          name: 'objList_currency',
          meta: { title: '测评对象清单', roles: ['router_plan'] }
        }
      ]
    }
  ]
}

export default planObjRouter
