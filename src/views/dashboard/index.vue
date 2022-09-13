<template>
  <div class="app-container">
    <!-- <switch-roles @change="handleRolesChange" /> -->
    <!-- <h1>{{ routeParams.title }}</h1> -->
    <div class="imgBG">
      <el-image style="width: 100%" :src="imageSrc" fit="fit"></el-image>
    </div>
  </div>
</template>

<script>
import permission from '@/directive/permission/index.js' // 权限判断指令
import checkPermission from '@/utils/permission' // 权限判断函数
import SwitchRoles from './components/SwitchRoles'

export default {
  name: 'DirectivePermission',
  components: { SwitchRoles },
  directives: { permission },
  data() {
    return {
      key: 1, // 为了能每次切换权限的时候重新初始化指令
      imageSrc: '' 
    }
  },
  created() {
    // 获取路由的参数
    this.routeParams = this.$route.meta
    console.log('routeParams:', this.routeParams)
    if (this.routeParams.title === '测评准备') {
      this.imageSrc = require('@/assets/img/CPZB.png')
    }else if (this.routeParams.title === '方案编制') {
      this.imageSrc = require('@/assets/img/FABZ.png')
    }else if (this.routeParams.title === '现场测评') {
      this.imageSrc = require('@/assets/img/XCCP.png')
    }else if (this.routeParams.title === '结果分析') {
      this.imageSrc = require('@/assets/img/JGFX.png')
    }
  },
  methods: {
    checkPermission,
    handleRolesChange() {
      this.key++
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  width: 100%;
  height: 90vh;
  // 上下左右居中
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
}
.imgBG {
  width: 70%;
  // height: 100%;
  
  // margin-top: 50px;
}
</style>
