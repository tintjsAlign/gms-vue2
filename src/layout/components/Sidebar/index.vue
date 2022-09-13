<template>
  <div :class="{ 'has-logo': showLogo }">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="true"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="true"
        mode="vertical"
        @open="handleOpen"
      >
        <sidebar-item v-for="(route, index) in permission_routes" :key="index" :item="route" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'

import { getMenuLvAfter } from '@/api/main'
export default {
  components: { SidebarItem, Logo },
  computed: {
    ...mapGetters(['permission_routes', 'routers', 'sidebar']),
    routes() {
      return this.$router.options.routes
    },
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  methods: {
    handleOpen(key, keyPath) {
      // console.log('点击侧边栏', key, keyPath)
      // console.log('点击侧边栏 旧路由表 ALL:', this.permission_routes)
      // console.log('点击侧边栏 旧路由表 :', this.routes)
      // console.log('点击侧边栏 原始路由表 :', this.routers)
      // 新路由表=this.permission_routes-this.routes
      this.routesArray = this.routers
      // 获取当前路由的参数
      this.getRouteParams(this.permission_routes, key)
      // console.log('点击侧边栏 当前路由参数:', this.routeParams)
      // 若resId == 990,则查子路由
      if (this.routeParams.resId && this.routeParams.resId === 990) {
        let role = this.routeParams.roles[0]
        this.getChildrenMenu(this.routeParams, key, role)
      }
    },
    getRouteParams(routes, key) {
      routes.forEach((item) => {
        if (item.path === key) {
          this.routeParams = item.meta
        }
        if (item.children && item.children.length > 0) {
          this.getRouteParams(item.children, key)
        }
      })
    },
    getChildrenMenu(route, key, role) {
      let menuRouterLists = []
      getMenuLvAfter({
        tblAlias: route.tblAlias,
        SYSTEMKEYNAME: window.localStorage.getItem('SYSTEMKEYNAME'),
        SYSTEMTELLERNO: window.localStorage.getItem('SYSTEMTELLERNO')
      }).then((res) => {
        // console.log('查子路由getMenuLvAfter:', res)
        // 处理子路由
        res.forEach((item) => {
          let componentOf
          if (item.itemName === '登记被测系统') {
            componentOf = 'drawer'
          } else if (item.itemName === '编辑本视图') {
            return
          } else {
            if (item.resId === 990) {
              componentOf = ''
            } else {
              componentOf = 'main'
            }
          }
          menuRouterLists.push({
            path: `/${route.itemName}_${item.itemName}`,
            component: componentOf,
            // name:`${route.itemName}_${item.itemName}`,
            name: item.tblAlias,
            meta: {
              title: item.itemName,
              icon: item.itemName,
              roles: [role],
              itemName: item.itemName,
              tblAlias: item.tblAlias,
              operationID: item.operationID,
              resId: item.resId,
              otherProperties: item.otherProperties
            },
            children: [
              {
                // path: `tree/:id(\\d+)`,
                path: `tree`,
                component: 'tree',
                name: 'tree',
                meta: { activeMenu: `/${route.itemName}_${item.itemName}` },
                hidden: true
              },
              {
                // path: `tree/:id(\\d+)`,
                path: `iframe`,
                component: 'iframe',
                name: 'iframe',
                meta: { activeMenu: `/${route.itemName}_${item.itemName}` },
                hidden: true
              }
            ]
          })
        })
        // console.log('查子路由menuRouterLists:', menuRouterLists)
        // 修改路由表,将子路由添加到父路由下
        this.routesArray.forEach((item) => {
          // 处理dashboard
          // if (item.path === '/') {
          //   item.component = 'layout'
          //   item.children.component = 'dashboard'
          // }
          if (item.path === key) {
            item.children = menuRouterLists
            console.log('menuRouterLists children:', item.children)
          }
        })
        // console.log('点击侧边栏 新路由表:', this.routesArray)
        this.$store.commit('user/SET_ROUTERS', JSON.parse(JSON.stringify(this.routesArray)))

        // 更新路由表
        this.$store.dispatch('user/changeRoles', {
          roles: this.routeParams.roles,
          tree: this.routesArray
        })
      })
    }
  }
}
</script>