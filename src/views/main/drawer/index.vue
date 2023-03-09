<template>
  <div class="app-container">
    <el-drawer :title="title" :before-close="handleClose" :visible.sync="dialog" custom-class="drawerBox" direction="rtl" size="80%" ref="drawer">
      <div v-if="dialog">
        <app-main ref="drawerRef"></app-main>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import merge from 'webpack-merge'
import appMain from '@/views/main/index.vue'
export default {
  name: '',
  components: {
    appMain
  },
  props: {},
  data() {
    return {
      title: '',
      dialog: false
    }
  },
  computed: {},
  watch: {},
  created() {
    // 获取路由的参数
  },
  mounted() {
    // this.$nextTick(() => {
    //   this.init()
    // })
  },
  methods: {
    show(data) {
      this.routeParams = data
      this.title = this.routeParams.itemName
      console.log('routeParams:', this.routeParams)
      this.dialog = true
      // this.$refs.drawerRef.show(this.routeParams)
      // this.$router.push({ query: { meta: data } })
      this.$router.push({
        query: merge({}, { meta: data })
      })
    },
    handleClose(done) {
      done()
    },
    goBack() {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped lang="scss"></style>
