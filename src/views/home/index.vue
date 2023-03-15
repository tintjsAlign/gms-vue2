<template>
  <div class="home-container" ref="homeContainer">
    <div class="home-text">
      <h3 class="title">密评工具平台</h3>
    </div>
    <div class="avatar">
      <el-dropdown>
        <el-avatar icon="el-icon-user-solid"></el-avatar>
        <el-dropdown-menu slot="dropdown">
          <!-- <el-dropdown-item>
            <div class="">
              <div class="slotAvatar"></div>
              <div class="userName">
                <p>{{ userName }}</p>
                <p>{{ userRole }}</p>
              </div>
            </div>
          </el-dropdown-item> -->
          <el-dropdown-item @click.native="refresh">
            <span><i class="el-icon-refresh-right"></i> 刷新配置</span>
          </el-dropdown-item>
          <el-dropdown-item divided @click.native="logout">
            <span><i class="el-icon-switch-button"></i> 退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div class="row-container">
      <div>
        <el-col :span="5" v-for="(project, i) in projectList" :key="i">
          <div class="grid-content bg-purple" @click="toDashboard(project.projectName)">
            <!-- <el-image style="width: 60px; height: 60px" :src="require('@/assets/img/cpzb.png')" fit="fit"></el-image> -->
            <div class="titleName">{{ project.projectName }}</div>
          </div>
        </el-col>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { requestMain, getProjectList } from '@/api/main'

export default {
  name: 'home',
  data() {
    return {
      projectList: []
    }
  },
  computed: {
    ...mapGetters(['name', 'roles'])
  },
  watch: {},
  created() {
    this.init()
  },
  mounted() {
    this.$nextTick(function () {
      window.onresize = () => {
        return (() => {
          if (this.$refs.homeContainer) {
            this.detectZoom()
          } else {
            return false
          }
        })()
      }
    })
  },
  methods: {
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    refresh() {
      requestMain(
        {
          operationID: 9990,
          SYSTEMKEYNAME: window.sessionStorage.getItem('SYSTEMKEYNAME'),
          SYSTEMTELLERNO: window.sessionStorage.getItem('SYSTEMTELLERNO')
        },
        '.home-container'
      ).then((res) => {
        console.log('刷新配置', res)
        if (res.statusCode === '200') {
          this.$notify({
            title: '刷新配置',
            message: res.message,
            type: 'success',
            offset: 50,
            duration: 2000
          })
          this.showCPZB = false
          this.showFABZ = false
          this.showXCCP = false
          this.showJGFX = false
          this.init()
        }
      })
    },
    detectZoom() {
      // js 检测浏览器是否缩放并返回缩放的比例
      var ratio = 0,
        screen = window.screen,
        ua = navigator.userAgent.toLowerCase()
      if (window.devicePixelRatio !== undefined) {
        ratio = window.devicePixelRatio
      } else if (~ua.indexOf('msie')) {
        if (screen.deviceXDPI && screen.logicalXDPI) {
          ratio = screen.deviceXDPI / screen.logicalXDPI
        }
      } else if (window.outerWidth !== undefined && window.innerWidth !== undefined) {
        ratio = window.outerWidth / window.innerWidth
      }

      if (ratio) {
        ratio = Math.round(ratio * 100)
      }
      //ratio就是获取到的百分比
      console.log(ratio)
      // this.onresize_height = ratio
      ratio = ratio >= 100 ? ratio : 100
      // 设置高度
      let container = this.$refs.homeContainer
      container.style.height = ratio + '%'
      // return ratio;
    },
    init() {
      let data = {
        SYSTEMKEYNAME: window.sessionStorage.getItem('SYSTEMKEYNAME'),
        SYSTEMTELLERNO: window.sessionStorage.getItem('SYSTEMTELLERNO')
      }
      getProjectList(data).then((res) => {
        console.log('projectList:', res)
        if (res && res.errCode === 200) {
          this.projectList = res.data.queryProjectList
          console.log('projectList', this.projectList)
        }
      })
    },
    toDashboard(projectName) {
      window.sessionStorage.setItem('projectName', projectName)
      this.$router.push({ path: '/' })
    }
  }
}
</script>

<style lang="scss" scoped>
.home {
  &-container {
    height: 100%;
    // background-color: #202a3c;
    background-color: #181515;
    background-image: url('bg.png');
    background-repeat: repeat;
    background-position: left top;
    background-size: auto;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
    color: #fff;
    /* position: relative; */
    /* top: 50px; */
    /* bottom: 30px; */
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    height: 10%;
  }
}
.row-container {
  height: 90%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.el-row {
  // margin-top: 50px;
  // 上下左右居中
  // height: 50%;
  display: flex;
  justify-content: center;
  align-items: center;

  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  width: 300px;
  height: 250px;
  border-radius: 4px;
  // box-shadow: '0 0 15px 10px #1c2333';
  margin: 30px 50px;
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
    font-size: 16px;
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
.avatar {
  position: absolute;
  right: 50px;
  :hover {
    cursor: pointer;
  }
}
</style>
