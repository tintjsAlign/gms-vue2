<template>
  <div class="login-container">
    <img src="@/assets/img/loginimg.png" alt="" class="loginBG" />
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">
      <div class="title-container">
        <h3 class="title">密评工具平台</h3>
        <h5 class="title1">用户登录 USER LOGIN</h5>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input ref="username" v-model="loginForm.username" placeholder="请输入账号" name="username" type="text" tabindex="1" auto-complete="on" />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="请输入密码"
          name="password"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>

      <el-button :loading="loading" type="primary" style="width: 100%; margin-bottom: 30px" @click.native.prevent="handleLogin">登录</el-button>

      <!-- <div class="tips">
        <span style="margin-right: 20px">username: admin</span>
        <span> password: any</span>
      </div> -->
    </el-form>
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'

import { getRsaParams, getMenuLv1 } from '@/api/main'

export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('请输入用户名'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码不能少于6位'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: 'mpAdmin',
        password: '123456'
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  created() {
    this.rsaEncryption()
    let o = this.getParams('keySvrName')
    console.log(o)
  },
  methods: {
    /**
     * @param string 参数名
     * @return string | string[] 参数值
     **/
    getParams(name) {
      //获取拼接的参数
      const paramStr = window.location.search.substring(1)
      //第一次分割
      const paramsArr = paramStr.split('&')
      const obj = {}
      paramsArr.forEach((param) => {
        //第二次分割
        const paramArr = param.split('=')
        const pKey = paramArr[0]
        const pValue = paramArr[1]
        if (!obj[pKey]) {
          obj[pKey] = pValue
        } else {
          //考虑下数组参数
          if (Array.isArray(obj[pKey])) {
            obj[pKey].push(pValue)
          } else {
            obj[pKey] = [obj[pKey], pValue]
          }
        }
      })
      return obj[name]
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true
          // console.log('rsaParams:', this.rsaParams)
          this.$store
            .dispatch('user/login', { userInfo: this.loginForm, rsaParams: this.rsaParams })
            .then(() => {
              // this.$router.push({ path: this.redirect || '/' })
              // this.testPassword()
              this.init()
              // this.$router.push({ path: '/' })
              this.$message({
                message: '登录成功',
                type: 'success'
              })
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    rsaEncryption() {
      getRsaParams().then((res) => {
        this.rsaParams = { ...res }
      })
    },
    init() {
      window.sessionStorage.removeItem('gatInfoRoles')
      window.sessionStorage.removeItem('gatInfoTree')

      let data = {
        SYSTEMKEYNAME: window.sessionStorage.getItem('SYSTEMKEYNAME'),
        SYSTEMTELLERNO: window.sessionStorage.getItem('SYSTEMTELLERNO')
      }
      getMenuLv1(data).then((res) => {
        console.log('login:getMenuLv1:', res)
        this.menuLv1 = res
        let menuRouterLists = [
          {
            path: '/',
            component: 'layout',
            redirect: '/dashboard',
            children: [
              {
                breadcrumb: false,
                path: 'dashboard',
                name: '首页',
                component: 'dashboard',
                meta: { title: '首页', icon: 'dashboard' }
              }
            ]
          }
        ]
        this.menuLv1.forEach((item) => {
          let role = 'admin'
          menuRouterLists.push({
            path: `/${item.menuGrpName}`,
            component: 'layout',
            alwaysShow: true,
            redirect: 'noRedirect',
            meta: {
              title: item.menuGrpName,
              // icon: this.getIcon(item.itemName),
              icon: '',
              roles: [role],
              menuGrpName: item.menuGrpName,
              menuName: item.menuName,
              otherProperties: item.otherProperties
            }
          })
        })
        // this.menuLv1.forEach((item) => {
        //   let componentOf
        //   let role = 'admin'
        //   if (item.itemName === '登记被测系统') {
        //     componentOf = 'drawer'
        //   } else {
        //     if (item.resId === 990) {
        //       componentOf = ''
        //     } else {
        //       componentOf = 'main'
        //     }
        //   }
        //   let children = [
        //     {
        //       path: '',
        //       // component: `() => import('@/views/currency')`,
        //       //如果menuRouterLists中itemName为登记被测系统,则component为drawer
        //       component: componentOf,
        //       name: item.itemName,
        //       meta: {
        //         title: item.itemName,
        //         // icon: this.getIcon(item.itemName),
        //         icon: '',
        //         roles: [role],
        //         itemName: item.itemName,
        //         tblAlias: item.tblAlias,
        //         operationID: item.operationID,
        //         resId: item.resId,
        //         otherProperties: item.otherProperties
        //       }
        //     }
        //   ]
        //   if (item.resId === 990) {
        //     menuRouterLists.push({
        //       path: `/${item.itemName}`,
        //       component: 'layout',
        //       alwaysShow: true,
        //       redirect: 'noRedirect',
        //       meta: {
        //         title: item.itemName,
        //         // icon: this.getIcon(item.itemName),
        //         icon: '',
        //         roles: [role],
        //         itemName: item.itemName,
        //         tblAlias: item.tblAlias,
        //         operationID: item.operationID,
        //         resId: item.resId,
        //         otherProperties: item.otherProperties
        //       }
        //     })
        //   } else {
        //     menuRouterLists.push({
        //       path: `/${item.itemName}`,
        //       component: 'layout',
        //       name: item.tblAlias,
        //       meta: {
        //         breadcrumb: false,
        //         title: item.itemName,
        //         // icon: this.getIcon(item.itemName),
        //         icon: '',
        //         roles: [role]
        //       },
        //       children: children
        //     })
        //   }

        // })

        // menuRouterLists.forEach((item) => {
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

        console.log('*****menuRouterLists*****1级:', menuRouterLists)
        this.routerListsss = menuRouterLists

        this.$store.commit('user/SET_ROUTERS', JSON.parse(JSON.stringify(menuRouterLists)))

        window.sessionStorage.setItem('gatInfoTree', JSON.stringify(this.routerListsss))
        this.$store
          .dispatch('user/changeRoles', {
            roles: ['admin'],
            // role: [role],
            tree: this.routerListsss
          })
          .then(() => {
            this.$emit('change')
            // this.$router.push(`/?${role}`)
            this.$router.push('/')
          })
      })
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
// $bg: #2d3a4b;
$bg: #1c2333;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;

  .loginBG {
    width: 40%;
    height: 80%;
    margin-left: 10%;
  }

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 0px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 36px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }

    .title1 {
      font-size: 24px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
