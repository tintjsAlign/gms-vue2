<template>
  <div class="iframe-container">
    <div class="header" v-if="dialogVisible">
      <div class="title">{{ title }}</div>
      <div class="close">
        <el-button type="info" plain circle icon="el-icon-close" @click="handleClose"></el-button>
      </div>
    </div>
    <el-dialog
      :visible.sync="dialogVisible"
      width="100%"
      :modal-append-to-body="false"
      :modal="false"
      top="0"
      fullscreen
      :show-close="false"
      destroy-on-close
      :before-close="handleClose"
    >
      <!-- <iframe
        :src="html"
        scrolling="auto"
        frameborder="0"
        style="width: 100%;"
      ></iframe> -->
      <div v-html="html"></div>
    </el-dialog>
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
    // this.init()
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
      this.dialogVisible = false
    }
  }
}
</script>

<style scoped lang="scss">
.iframe-container {
  width: 100%;
}
::v-deep .el-dialog {
  height: 100%;
}
::v-deep .el-dialog__wrapper {
  position: absolute !important;
}
// ::v-deep .v-modal {
//   position: absolute !important;
// }
.header {
  // 固定在顶部
  position: fixed;
  top: 50px;
  // position: relative;
  width: 80%;
  height: 50px;
  background-color: #fff;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 3000;

  .title {
    font-size: 18px;
    font-weight: bold;
  }
}
</style>
