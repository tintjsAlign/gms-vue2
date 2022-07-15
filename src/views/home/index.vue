<template>
  <div class="home-container">
    <div class="home-text">
      <h3 class="title">密评工具平台</h3>
    </div>

    <el-row type="flex" justify="center">
      <el-col :span="5">
        <div
          class="grid-content bg-purple"
          @click="toDashboard('router_ready')"
        >
          <el-image
            style="width: 100px; height: 100px"
            :src="require('@/assets/img/pczb.png')"
            fit="fit"
          ></el-image>
          <div class="titleName">评测准备</div>
        </div>
      </el-col>
      <el-col :span="5">
        <div class="grid-content bg-purple" @click="toDashboard('router_plan')">
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
          @click="toDashboard('router_scene')"
        >
          <el-image
            style="width: 100px; height: 100px"
            :src="require('@/assets/img/xcpc.png')"
            fit="fit"
          ></el-image>
          <div class="titleName">现场评测</div>
        </div>
      </el-col>
      <el-col :span="5">
        <div
          class="grid-content bg-purple"
          @click="toDashboard('router_result')"
        >
          <el-image
            style="width: 100px; height: 100px"
            :src="require('@/assets/img/pcjg.png')"
            fit="fit"
          ></el-image>
          <div class="titleName">评测结果</div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// import { resetRouter } from '@/permission'

export default {
  name: 'home',
  computed: {
    ...mapGetters(['name', 'roles'])
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {
    toDashboard(role) {
      // 根据点击的按钮，赋予不同的权限,加入this.roles中,并打开浏览器新窗口
      this.$store.commit('user/SET_ROLES', [role])
      this.$store.dispatch('user/changeRoles', role).then(() => {
        this.$emit('change')
        this.$router.push(`/?${role}`)
      })
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
