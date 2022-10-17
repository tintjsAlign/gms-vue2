<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <template>
        <div class="right-menu-item">
          <div class="right-menu-list">
            <span class="nameTag">{{ userName }}</span>
            <span class="roleTag"
              ><el-tag size="mini">{{ userRole }}</el-tag></span
            >
          </div>
        </div>
      </template>
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <!-- <span class="userName">user</span> -->
          <img :src="avatar + '?imageView2/1/w/80/h/80'" class="user-avatar" />
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/home">
            <el-dropdown-item><i class="el-icon-house"></i> 首页 </el-dropdown-item>
          </router-link>
          <!-- <a
            target="_blank"
            href="https://github.com/PanJiaChen/vue-admin-template/"
          >
            <el-dropdown-item>Github</el-dropdown-item>
          </a>
          <a
            target="_blank"
            href="https://panjiachen.github.io/vue-element-admin-site/#/"
          >
            <el-dropdown-item>Docs</el-dropdown-item>
          </a> -->
          <el-dropdown-item @click.native="refresh">
            <span style="display: block"><i class="el-icon-refresh-right"></i> 刷新配置</span>
          </el-dropdown-item>
          <el-dropdown-item divided @click.native="logout">
            <span style="display: block"><i class="el-icon-switch-button"></i> 退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { requestMain } from '@/api/main'
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  data() {
    return {}
  },
  computed: {
    ...mapGetters([
      'sidebar'
      // 'avatar'
    ])
  },
  created() {
    this.avatar = require('@/assets/img/touxiang.png')

    this.userName = window.sessionStorage.getItem('SYSTEMTELLERNO')
    this.userRole = window.sessionStorage.getItem('userRole')
    // this.avatar =
    //   'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif'
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    refresh() {
      requestMain({
        operationID: 9990,
        SYSTEMKEYNAME: window.sessionStorage.getItem('SYSTEMKEYNAME'),
        SYSTEMTELLERNO: window.sessionStorage.getItem('SYSTEMTELLERNO')
      }).then((res) => {
        console.log('刷新配置', res)
        if (res.statusCode === '200') {
          this.$notify({
            title: '刷新配置',
            message: res.message,
            type: 'success',
            offset: 50,
            duration: 2000
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
      .right-menu-list {
        .nameTag {
          color: #80858b;
        }
        .roleTag {
          margin: 5px;
          // vertical-align: sub;
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;
        .userName {
          position: absolute;
          top: 0;
          right: 60px;
          font-size: 16px;
          color: #9b9b9b;
          margin: 0 auto;
        }
        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>