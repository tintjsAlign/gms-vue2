import { asyncRoutes, constantRoutes, routerMap } from '@/router'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some((role) => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach((route) => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, { roles, tree }) {
    return new Promise((resolve) => {
      // console.log('generateRoutes:tree', tree)
      // console.log(JSON.stringify(tree))
      let accessedRoutes
      //然后在actions中GenerateRoutes方法合适的地方将后端请求的路由表映射到routerMap,并筛选出可访问的路由,serverRouterMap是我定义的从后台请求路由表的方法
      // serverRouterMap().then((response) => {
      var asyncRouterMap = generateAsyncRouter(routerMap, tree)
      // console.log('generateRoutes:asyncRouterMap', asyncRouterMap)
      if (roles.indexOf('admin') >= 0) {
        accessedRoutes = asyncRouterMap
      } else {
        accessedRoutes = filterAsyncRoutes(asyncRouterMap, roles)
      }
      console.log('generateRoutes:accessedRoutes', accessedRoutes)
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
      // })

      // let accessedRoutes
      // if (roles.includes('admin')) {
      //   accessedRoutes = asyncRoutes || []
      // } else {
      //   accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      // }
      // commit('SET_ROUTES', accessedRoutes)
      // resolve(accessedRoutes)
    })
  }
}

// 将本地routerMap映射到ajax获取到的serverRouterMap;
function generateAsyncRouter(routerMap, serverRouterMap) {
  console.log('generateAsyncRouter:routerMap', routerMap)
  console.log('generateAsyncRouter:serverRouterMap', serverRouterMap)
  // console.log(JSON.stringify(serverRouterMap))
  serverRouterMap.forEach((item) => {
    item.component = routerMap[item.component]
    if (item.children && item.children.length > 0) {
      generateAsyncRouter(routerMap, item.children)
    }
  })
  return serverRouterMap
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
