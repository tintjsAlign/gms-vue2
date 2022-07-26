<template>
  <div class="home-container">
    <div class="home-text">
      <h3 class="title">密评工具平台</h3>
    </div>

    <el-row type="flex" justify="center">
      <el-col :span="5">
        <div
          class="grid-content bg-purple"
          @click="toDashboard('测评准备', 'router_ready')"
        >
          <el-image
            style="width: 100px; height: 100px"
            :src="require('@/assets/img/pczb.png')"
            fit="fit"
          ></el-image>
          <div class="titleName">测评准备</div>
        </div>
      </el-col>
      <el-col :span="5">
        <div
          class="grid-content bg-purple"
          @click="toDashboard('方案编制', 'router_plan')"
        >
          <el-image
            style="width: 100px; height: 100px"
            :src="require('@/assets/img/fabz.png')"
            fit="fit"
          ></el-image>
          <div class="titleName">方案编制</div>
        </div>
      </el-col>
    </el-row>
    <el-row type="flex" justify="center">
      <el-col :span="5">
        <div
          class="grid-content bg-purple"
          @click="toDashboard('现场测评', 'router_scene')"
        >
          <el-image
            style="width: 100px; height: 100px"
            :src="require('@/assets/img/xcpc.png')"
            fit="fit"
          ></el-image>
          <div class="titleName">现场测评</div>
        </div>
      </el-col>
      <el-col :span="5">
        <div
          class="grid-content bg-purple"
          @click="toDashboard('结果分析', 'router_result')"
        >
          <el-image
            style="width: 100px; height: 100px"
            :src="require('@/assets/img/pcjg.png')"
            fit="fit"
          ></el-image>
          <div class="titleName">结果分析</div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getMenuLv1, getMenuLv2, getMenuLvAfter } from '@/api/main'

import { menuTreeRouter } from '@/utils/menuTreeRouter'
export default {
  name: 'home',
  data() {
    return {
      menuTree: []
    }
  },
  computed: {
    ...mapGetters(['name', 'roles'])
  },
  watch: {},
  created() {
    this.init()
  },
  mounted() {},
  methods: {
    init() {
      let data = {
        SYSTEMKEYNAME: window.localStorage.getItem('SYSTEMKEYNAME'),
        SYSTEMTELLERNO: window.localStorage.getItem('SYSTEMTELLERNO')
      }
      getMenuLv1(data).then((res) => {
        console.log('getMenuLv1:', res)
        this.menuLv1 = res
      })
    },
    toDashboard(name, role) {
      // 遍历this.menuLv1 找到对应的菜单menuName
      this.menuLv1.forEach((item) => {
        if (item.menuGrpName === name) {
          this.menuLv1Name = item.menuName
        }
      })
      console.log('menuLv1Name:', this.menuLv1Name)
      // this.getMenu(this.menuLv1Name)
      // let tree = menuTreeRouter(this.menuLv1Name)
      this.menuTreeRouter(this.menuLv1Name, role)
      // tree.forEach((item) => {
      //   console.log('item:', item)
      // })
      // console.log('home: tree', tree)
    },
    routerGo(role) {
      // 根据点击的按钮，赋予不同的权限
      this.$store.commit('user/SET_ROLES', [role])
      this.$store
        .dispatch('user/changeRoles', {
          role: role,
          tree: this.routerListsss
        })
        .then(() => {
          this.$emit('change')
          this.$router.push(`/?${role}`)
        })
    },

    menuTreeRouter(menuLv1Name, role) {
      let menuTree = []
      let menuRouterLists = []
      getMenuLv2({
        SYSTEMKEYNAME: window.localStorage.getItem('SYSTEMKEYNAME'),
        SYSTEMTELLERNO: window.localStorage.getItem('SYSTEMTELLERNO'),
        menuGrpName: menuLv1Name
      }).then((res) => {
        // console.log('getMenuLv2:', res)
        let menuLv2 = res
        // 生成菜单树
        menuLv2.forEach((item) => {
          menuTree.push({
            itemName: item.itemName,
            tblAlias: item.tblAlias,
            operationID: item.operationID,
            resId: item.resId,
            otherProperties: item.otherProperties,
            children: []
          })
          menuRouterLists.push({
            path: `/${item.itemName}`,
            component: 'layout',
            meta: { roles: [role] },
            children: [
              {
                path: '',
                // component: `() => import('@/views/currency')`,
                //如果menuRouterLists中resId为1128和operationID为216,则component为drawer
                component:
                  item.resId === 1128 && item.operationID === 216
                    ? 'drawer'
                    : 'main',
                name: item.itemName,
                meta: {
                  title: item.itemName,
                  icon: item.itemName,
                  roles: [role],
                  itemName: item.itemName,
                  tblAlias: item.tblAlias,
                  operationID: item.operationID,
                  resId: item.resId,
                  otherProperties: item.otherProperties
                }
              }
            ]
          })
          // 如果有子菜单，则生成子菜单树

          //如果menuRouterLists中resId为1128和operationID为216,则component为drawer
        })

        console.log('*****menuTree*****1级:', menuTree)
        console.log('*****menuRouterLists*****1级:', menuRouterLists)
        this.routerListsss = menuRouterLists

        // 跳转界面
        this.routerGo(role)

        return menuRouterLists
        // this.$store.dispatch('router/changeRouterLv1', menuTree)

        // 遍历menuTree resId为990时,继续查询下级菜单
        // menuTree.forEach((item) => {
        //   if (item.resId === 990) {
        //     getMenuToLvAfter(menuTree, item.tblAlias, item.itemName)
        //   }
        // })
      })
      console.log('*****RETURN*****:', menuRouterLists)
      return menuRouterLists
    }
  }
}
</script>

<style lang="scss" scoped>
.home {
  &-container {
    height: 100%;
    background-image: url('bg.png');
    background-repeat: no-repeat;
    background-position: left top;
    background-size: cover;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
    color: #fff;
    position: relative;
    top: 50px;
    bottom: 30px;
    text-align: center;
    margin-bottom: 150px;
  }
}
.el-row {
  margin-top: 50px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  width: 360px;
  height: 210px;
  border-radius: 4px;
  margin: 0px 50px;
  background-image: url('borderBg.png');
  background-repeat: no-repeat;
  background-position: left top;
  background-size: cover;
  /* 鼠标悬浮时 */
  :hover {
    // box-shadow: 1px 3px 10px #d3dce6;
    // 变成小手
    cursor: pointer;
  }
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  padding: 30px 20px;
  // border: 1px solid #99a9bf;
  // background: #d3dce6;

  text-align: center;

  .titleName {
    font-size: 20px;
    line-height: 30px;
    color: #fff;
    margin-bottom: 10px;
  }
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
</style>
