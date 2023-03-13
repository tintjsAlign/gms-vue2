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
        @select="handleSelect"
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

import { getMenuLvAfter, getMenuLv2, getMenuLv1 } from '@/api/main'
export default {
  components: { SidebarItem, Logo },
  computed: {
    ...mapGetters(['permission_routes', 'routers', 'sidebar']),
    routes() {
      return this.$router.options.routes
    },
    activeMenu() {
      const route = this.$route
      const { meta, path, params } = route
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
  created() {
    //加载第一层路由
    this.updateRouterTable(this.routers, { level: 0, path: '/', itemName: '', tblAlias: '' })
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log('handleSelect点击侧边栏', key, keyPath)
      console.log('routers', this.routers)
      console.log('点击侧边栏 activeMenu :', this.activeMenu)
      console.log('点击侧边栏 this.$route :', this.$route)
      // this.$router.push({
      //   keyPath,
      //   query: {
      //     t: +new Date() //保证每次点击路由的query项都是不一样的，确保会重新刷新view
      //   }
      // })
      const { fullPath, path } = this.$route
      this.$router.replace({
        path: '/redirect' + key,
        query: {
          t: +new Date(), //保证每次点击路由的query项都是不一样的，确保会重新刷新view
          activeMenu: key
        }
      })

      console.log('点击侧边栏 activeMenu ppp:', this.activeMenu)
    },
    handleOpen(key, keyPath) {
      console.log('点击侧边栏', key, keyPath)
      console.log('点击侧边栏 旧路由表 ALL:', this.permission_routes)
      console.log('点击侧边栏 旧路由表 :', this.routes)
      console.log('点击侧边栏 原始路由表 :', this.routers)
      console.log('点击侧边栏 activeMenu :', this.activeMenu)
      console.log('点击侧边栏 this.$route :', this.$route)

      // 新路由表=this.permission_routes-this.routes
      // this.permission_routes = this.unique(this.permission_routes)
      this.routesArray = this.routers
      // 获取当前路由的参数
      this.getRouteParams(this.permission_routes, key)
      console.log('点击侧边栏 当前路由参数:', this.routeParams)
      // 若resId不存在,则查第二层菜单； 若resId == 990,则查子路由
      let node = {
        level: this.routeParams.menuLevel + 1,
        path: key,
        itemName: this.routeParams.itemName,
        tblAlias: this.routeParams.tblAlias
      }
      console.log('node', node)
      this.updateRouterTable(this.routers, node)
      // if(!this.routeParams.resId){
      //   let role = this.routeParams.roles[0]
      //   this.getLv2Menu(this.routeParams, key, role)
      // }
      // else if (this.routeParams.resId === 990) {
      //   console.log("990");
      //   let role = this.routeParams.roles[0]
      //   this.getChildrenMenu(this.routeParams, key, role)
      // }
    },
    getRouteParams(routes, key) {
      // let arr = this.$_.cloneDeep(routes)
      // let obj = {}
      // let params = key.split('/');
      // //删除第一个空元素
      // params.shift()
      // let first = true
      // params.forEach((item) => {
      //   if(first){
      //     item = '/' + item
      //     first = false
      //   }
      //   obj = arr[this.$_.findIndex(arr, (o) => { return o.path === item})]
      //   if(obj){
      //     arr = obj.children
      //     this.routeParams = obj.meta
      //   }
      // })
      routes.forEach((item) => {
        if (item.path === key) {
          this.routeParams = item.meta
        }
        if (item.children && item.children.length > 0) {
          this.getRouteParams(item.children, key)
        }
      })
    },

    unique(arr) {
      const res = new Map()
      return arr.filter((arr) => !res.has(arr.path) && res.set(arr.path, 1))
    },

    //更新路由表
    async updateRouterTable(routerTable, node) {
      //新路由列表
      let routerList = []

      //加载新路由列表
      routerList = await this.loadRouterList(node)

      console.log('routerList', routerList)
      console.log('routerTableOld', routerTable)

      //设置路由表
      if (node.level === 0) {
        routerTable = routerList
      } else {
        routerTable = this.setRouterTable(routerTable, node, routerList)
      }

      console.log('routerTable', routerTable)

      //提交更新
      this.$store.commit('user/SET_ROUTERS', JSON.parse(JSON.stringify(routerTable)))
      this.$store.dispatch('user/changeRoles', {
        roles: ['admin'],
        tree: routerTable
      })
    },

    //加载路由列表
    async loadRouterList(node) {
      let routerList = []
      let result = []

      if (node.level == 0) {
        let res = await getMenuLv1({
          SYSTEMKEYNAME: window.sessionStorage.getItem('SYSTEMKEYNAME'),
          SYSTEMTELLERNO: window.sessionStorage.getItem('SYSTEMTELLERNO')
        })
        //返回结果转统一格式
        // [
        //   {
        //     level:"9",
        //     menuGrpName: "业务梳理",
        //     menuName: "业务梳理二级菜单",
        //     otherProperties: {},
        //     remark: null
        //   }
        // ]
        if (res.length > 0) {
          res.forEach((obj) => {
            let templ = {
              isOperatorSingleRec: null,
              showProgressBar: null,
              showStyle: null,
              resId: 990,
              tblAlias: obj.menuName,
              operationID: 0,
              isNeedConfirm: null,
              itemName: obj.menuGrpName,
              level: obj.level,
              condition: null,
              otherProperties: obj.otherProperties,
              remark: null,
              menuLevel: 0 //新增一个菜单级别
            }
            result.push(templ)
          })
        }
      } else if (node.level == 1) {
        let res = await getMenuLv2({
          menuGrpName: node.tblAlias,
          SYSTEMKEYNAME: window.sessionStorage.getItem('SYSTEMKEYNAME'),
          SYSTEMTELLERNO: window.sessionStorage.getItem('SYSTEMTELLERNO')
        })
        //返回结果转统一格式
        // [
        //   {
        //     "isOperatorSingleRec": "0",
        //     "showProgressBar": "0",
        //     "showStyle": "0",
        //     "resId": 3002,
        //     "tblAlias": "密码应用-梳理的项目-业主界面",
        //     "operationID": 51,
        //     "isNeedConfirm": "0",
        //     "itemName": "项目",
        //     "level": "9",
        //     "condition": null,
        //     "otherProperties": {
        //       "urlParam": "isOperatorSingleRec=0&showProgressBar=0&showStyle=0&resId=3002&tblAlias=密码应用-梳理的项目-业主界面&operationID=51&isNeedConfirm=0&itemName=项目&level=9&&EDITALAIS=项目&&menuGrpName=业务梳理二级菜单&"
        //     }
        //   }
        // ]
        if (res.length > 0) {
          res.forEach((obj) => {
            obj.menuLevel = 1
            result.push(obj)
          })
        }
      } else {
        let res = await getMenuLvAfter({
          tblAlias: node.tblAlias,
          SYSTEMKEYNAME: window.sessionStorage.getItem('SYSTEMKEYNAME'),
          SYSTEMTELLERNO: window.sessionStorage.getItem('SYSTEMTELLERNO')
        })
        //返回结果转统一格式
        // [
        //   {
        //     "isOperatorSingleRec": "0",
        //     "showProgressBar": "0",
        //     "showStyle": "0",
        //     "resId": 990,
        //     "tblAlias": "应用和数据安全身份鉴别管理入口",
        //     "operationID": 51,
        //     "isNeedConfirm": "0",
        //     "itemName": "身份鉴别",
        //     "level": "9",
        //     "condition": null,
        //     "otherProperties": {
        //       "urlParam": "isOperatorSingleRec=0&showProgressBar=0&showStyle=0&resId=990&tblAlias=应用和数据安全身份鉴别管理入口&operationID=51&isNeedConfirm=0&itemName=身份鉴别&level=9&&EDITALAIS=身份鉴别&&menuGrpName=应用和数据安全管理入口界面右键菜单&"
        //     }
        //   }
        // ]
        if (res.length > 0) {
          res.forEach((obj) => {
            obj.menuLevel = 2
            result.push(obj)
          })
        }
      }

      //对返回值操作
      result.forEach((item) => {
        routerList.push({
          path: node.level === 0 ? `/${item.itemName}` : `${node.path}_${item.itemName}`,
          component: node.level === 0 ? 'layout' : item.resId === 990 ? 'main' : 'main',
          alwaysShow: item.resId === 990 ? true : false,
          name: node.level === 0 ? `/${item.itemName}` : `${node.path}_${item.itemName}`,
          meta: {
            title: item.itemName,
            icon: item.itemName,
            roles: ['admin'],
            itemName: item.itemName,
            tblAlias: item.tblAlias,
            operationID: item.operationID,
            resId: item.resId,
            otherProperties: item.otherProperties,
            menuLevel: item.menuLevel,
            activeMenu: ''
            // activeMenu: node.level === 0 ? `/${item.itemName}` : `${node.path}_${item.itemName}`
          },
          children: [
            // {
            //   path: `tree`,
            //   component: 'tree',
            //   name: 'tree',
            //   meta: { activeMenu: node.level === 0 ? `/${item.itemName}` : `${node.path}_${item.itemName}` },
            //   hidden: true
            // },
            // {
            //   path: `iframe`,
            //   component: 'iframe',
            //   name: 'iframe',
            //   meta: { activeMenu: node.level === 0 ? `/${item.itemName}` : `${node.path}_${item.itemName}` },
            //   hidden: true
            // }
          ]
        })
      })

      return routerList
    },

    //设置路由表
    setRouterTable(routerTable, node, routerList) {
      routerTable.forEach((router) => {
        if (router.path === node.path) {
          router.children = routerList
        } else if (router.children && router.children.length > 0) {
          router.children = this.setRouterTable(router.children, node, routerList)
        }
      })
      return routerTable
    },

    getChildrenMenu(route, key, role) {
      let menuRouterLists = []
      getMenuLvAfter({
        tblAlias: route.tblAlias,
        SYSTEMKEYNAME: window.sessionStorage.getItem('SYSTEMKEYNAME'),
        SYSTEMTELLERNO: window.sessionStorage.getItem('SYSTEMTELLERNO')
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
              // {
              //   // path: `tree/:id(\\d+)`,
              //   path: `tree`,
              //   component: 'tree',
              //   name: 'tree',
              //   meta: { activeMenu: `/${route.itemName}_${item.itemName}` },
              //   hidden: true
              // },
              // {
              //   // path: `tree/:id(\\d+)`,
              //   path: `iframe`,
              //   component: 'iframe',
              //   name: 'iframe',
              //   meta: { activeMenu: `/${route.itemName}_${item.itemName}` },
              //   hidden: true
              // }
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
          if (item.children) {
            item.children.forEach((item2) => {
              if (item2.path === key) {
                item2.children = menuRouterLists
                console.log('menuRouterLists children:', item2.children)
              }
            })
          }
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
    },
    getLv2Menu(route, key, role) {
      let menuRouterListsLv2 = []
      getMenuLv2({
        SYSTEMKEYNAME: window.sessionStorage.getItem('SYSTEMKEYNAME'),
        SYSTEMTELLERNO: window.sessionStorage.getItem('SYSTEMTELLERNO'),
        menuGrpName: route.itemName
      }).then((res) => {
        console.log('getMenuLv2:', res)
        let menuLv2 = res
        // 生成菜单树
        menuLv2.forEach((item) => {
          let componentOf
          if (item.itemName === '登记被测系统') {
            componentOf = 'drawer'
          } else {
            if (item.resId === 990) {
              componentOf = ''
            } else {
              componentOf = 'main'
            }
          }
          let children = [
            {
              path: '',
              //如果menuRouterLists中itemName为登记被测系统,则component为drawer
              component: componentOf,
              name: item.itemName,
              meta: {
                title: item.itemName,
                // icon: this.getIcon(item.itemName),
                roles: [role],
                itemName: item.itemName,
                tblAlias: item.tblAlias,
                operationID: item.operationID,
                resId: item.resId,
                otherProperties: item.otherProperties
              }
            }
          ]
          if (item.resId === 990) {
            menuRouterListsLv2.push({
              path: `/${item.itemName}`,
              component: '',
              alwaysShow: true,
              redirect: 'noRedirect',
              meta: {
                title: item.itemName,
                // icon: this.getIcon(item.itemName),
                roles: [role],
                itemName: item.itemName,
                tblAlias: item.tblAlias,
                operationID: item.operationID,
                resId: item.resId,
                otherProperties: item.otherProperties
              }
            })
          } else {
            menuRouterListsLv2.push({
              path: `/${item.itemName}`,
              component: 'main',
              name: item.tblAlias,
              meta: {
                breadcrumb: false,
                title: item.itemName,
                // icon: this.getIcon(item.itemName),
                roles: [role]
              },
              children: children
            })
          }

          // 如果有子菜单，则生成子菜单树

          //如果menuRouterLists中resId为1128和operationID为216,则component为drawer
        })

        // console.log('*****menuTree*****1级:', menuTree)
        // menuRouterLists某一项中若有children的话，则children中加多一项
        // menuRouterListsLv2.forEach((item) => {
        //   if (item.children) {
        //     item.children.push(
        //       {
        //         // path: `tree/:id(\\d+)`,
        //         path: `tree`,
        //         component: 'tree',
        //         name: 'tree',
        //         meta: { activeMenu: item.path },
        //         hidden: true
        //       },
        //       {
        //         // path: `tree/:id(\\d+)`,
        //         path: `iframe`,
        //         component: 'iframe',
        //         name: 'iframe',
        //         meta: { activeMenu: item.path },
        //         hidden: true
        //       }
        //     )
        //   }
        // })

        // 修改路由表,将子路由添加到父路由下
        this.routesArray.forEach((item) => {
          if (item.children) {
            item.children.forEach((item2) => {
              if (item2.path === key) {
                item2.children = menuRouterListsLv2
                console.log('Lv2 menuRouterLists children:', item2.children)
              }
            })
          }
          if (item.path === key) {
            item.children = menuRouterListsLv2
            console.log('Lv2 menuRouterLists children:', item.children)
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
