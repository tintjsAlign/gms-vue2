<template>
  <div class="iframe-container">
    <div class="iframe-header">
      <el-page-header @back="handleClose" title="" :content="title"> </el-page-header>
    </div>
    <div v-html="html"></div>

    <!-- <iframe :srcdoc="html" width="100%" :height="iframeH" scrolling="no" frameborder="0" ></iframe> -->
  </div>
</template>

<script>
import { requestMain } from '@/api/main'
export default {
  name: '',
  components: {},
  props: {},
  data() {
    return {
      dialogVisible: false,
      html: ''
    }
  },
  computed: {},
  watch: {},
  created() {
    // 获取路由的参数
    this.routeRow = this.$route.query.row
    console.log('iframe this.routeRow:::', this.routeRow)
    this.show(this.routeRow)
  },
  mounted() {},
  methods: {
    show(row) {
      this.dialogVisible = true
      this.title = row.itemName
      this.init(row)
    },
    init(row) {
      let data = {
        SYSTEMKEYNAME: window.localStorage.getItem('SYSTEMKEYNAME'),
        SYSTEMTELLERNO: window.localStorage.getItem('SYSTEMTELLERNO')
      }
      Object.assign(data, row)
      requestMain(data).then((res) => {
        // console.log('报表HTML res:', res)
        // 找到res中的包含'<a href="main?'的全部字符串，并且替换
        this.requestTarget = process.env.VUE_APP_BASE_API
        let html = res.replace(/<a href="main\?/g, '<a href="' + this.requestTarget + '/main?')
        html = html.replace(/body {background/g, '.main {background')
        html = html.replace(/img {/g, '.main img{')

        this.html = html
        // console.log('报表HTML html:', html)
      })
    },
    handleClose() {
      this.html = ''
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped lang="scss">
.iframe-container {
  width: 100%;
  padding: 20px;
  // overflow: hidden;
  .iframe-header {
    position: fixed;
    height: 50px;
  }
}
</style>
