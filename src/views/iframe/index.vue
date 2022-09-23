<template>
  <div class="iframe-container">
    <div class="iframe-header">
      <el-page-header @back="handleClose" title="" :content="title"> </el-page-header>
    </div>
    <!-- <div v-html="html"></div> -->

    <iframe :srcdoc="html" width="100%" :height="iframeH" scrolling="yes" frameborder="0"></iframe>
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
      html: '',
      iframeH: '600px'
    }
  },
  computed: {},
  watch: {},
  created() {
    // 获取路由的参数
    this.routeRow = this.$route.query.row
    console.log('iframe this.routeRow:::', this.routeRow)
    this.show(this.routeRow)

    let mainHeight = document.querySelector('.app-main').offsetHeight - 50
    console.log('mainHeight高度:', mainHeight)
    this.iframeH = mainHeight + 'px'
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
        SYSTEMKEYNAME: window.sessionStorage.getItem('SYSTEMKEYNAME'),
        SYSTEMTELLERNO: window.sessionStorage.getItem('SYSTEMTELLERNO')
      }
      let objCondition = row.condition.split(',').filter((i) => i !== '')
      let conditionArr = ''
      objCondition.forEach((e) => {
        if (!e.split('=')[1]) {
          if (row[e.split('=')[0]]) {
            e = e.split('=')[0] + '=' + row[e.split('=')[0]]
          }
        }
        conditionArr += e + ','
      })
      console.log('conditionArr:', conditionArr)
      Object.assign(data, row)
      data.condition = conditionArr
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
