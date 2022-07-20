/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const planObjRouter = {
  path: '/plan',
  component: Layout,
  redirect: '/plan/technology/securityLevel',
  name: 'plan',
  meta: {
    title: '测评方案',
    icon: 'plan',
    roles: ['router_plan']
  },
  children: [
    {
      path: 'technology',
      component: () => import('@/views/router_plan/plan/technology'), // Parent router-view
      name: 'plan_technology',
      meta: { title: '技术要求', roles: ['router_plan'] },
      redirect: '/router_plan/plan/technology',
      children: [
        {
          path: 'testUnit',
          component: () =>
            import('@/views/router_plan/plan/technology/testUnit'),
          name: 'testUnit_technology',
          meta: { title: '测评单元', roles: ['router_plan'] }
        },
        {
          path: 'testObj',
          component: () =>
            import('@/views/router_plan/plan/technology/testObj'),
          name: 'testObj_technology',
          meta: { title: '测评对象', roles: ['router_plan'] }
        },
        {
          path: 'testPut',
          component: () =>
            import('@/views/router_plan/plan/technology/testPut'),
          name: 'testPut_technology',
          meta: { title: '测评实施', roles: ['router_plan'] }
        },
        {
          path: 'testMethod',
          component: () =>
            import('@/views/router_plan/plan/technology/testMethod'),
          name: 'testMethod_technology',
          meta: { title: '测评方法', roles: ['router_plan'] }
        }
      ]
    },
    {
      path: 'manage',
      component: () => import('@/views/router_plan/plan/manage'), // Parent router-view
      name: 'plan_manage',
      meta: { title: '技术要求', roles: ['router_plan'] },
      redirect: '/router_plan/plan/manage',
      children: [
        {
          path: 'testUnit',
          component: () => import('@/views/router_plan/plan/manage/testUnit'),
          name: 'testUnit_manage',
          meta: { title: '测评单元', roles: ['router_plan'] }
        },
        {
          path: 'testObj',
          component: () => import('@/views/router_plan/plan/manage/testObj'),
          name: 'testObj_manage',
          meta: { title: '测评对象', roles: ['router_plan'] }
        },
        {
          path: 'testPut',
          component: () => import('@/views/router_plan/plan/manage/testPut'),
          name: 'testPut_manage',
          meta: { title: '测评实施', roles: ['router_plan'] }
        },
        {
          path: 'testMethod',
          component: () => import('@/views/router_plan/plan/manage/testMethod'),
          name: 'testMethod_manage',
          meta: { title: '测评方法', roles: ['router_plan'] }
        }
      ]
    },
    {
      path: 'currency',
      component: () => import('@/views/router_plan/plan/currency'), // Parent router-view
      name: 'plan_currency',
      meta: { title: '技术要求', roles: ['router_plan'] },
      redirect: '/router_plan/plan/currency',
      children: [
        {
          path: 'testUnit',
          component: () => import('@/views/router_plan/plan/currency/testUnit'),
          name: 'testUnit_currency',
          meta: { title: '测评单元', roles: ['router_plan'] }
        },
        {
          path: 'testObj',
          component: () => import('@/views/router_plan/plan/currency/testObj'),
          name: 'testObj_currency',
          meta: { title: '测评对象', roles: ['router_plan'] }
        },
        {
          path: 'testPut',
          component: () => import('@/views/router_plan/plan/currency/testPut'),
          name: 'testPut_currency',
          meta: { title: '测评实施', roles: ['router_plan'] }
        },
        {
          path: 'testMethod',
          component: () =>
            import('@/views/router_plan/plan/currency/testMethod'),
          name: 'testMethod_currency',
          meta: { title: '测评方法', roles: ['router_plan'] }
        }
      ]
    }
  ]
}

export default planObjRouter
