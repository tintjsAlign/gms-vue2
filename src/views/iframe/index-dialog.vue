<template>
  <div class="iframe-container">
    <!-- <div class="header" v-if="dialogVisible">
      <div class="title">{{ title }}</div>
      <div class="close">
        <el-button type="info" plain circle icon="el-icon-close" @click="handleClose"></el-button>
      </div>
    </div> -->
    <el-dialog
      :visible.sync="dialogVisible"
      class="abow_dialog"
      :title="title"
      width="100%"
      :modal-append-to-body="false"
      :modal="false"
      top="0"
      fullscreen
      :show-close="true"
      destroy-on-close
      lock-scroll
      :before-close="handleClose"
    >
      <!-- <div style="height:50px"></div> -->
      <!-- <div v-html="html"></div> -->
      <iframe :srcdoc="html" width="100%" :height="iframeH" scrolling="yes" frameborder="0"></iframe>
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
      html: '',
      iframeH: '600px'
    }
  },
  computed: {},
  watch: {},
  created() {
    let mainHeight = document.querySelector('.app-main').offsetHeight - 150
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
      Object.assign(data, row)
      requestMain(data, '.el-dialog__body').then((res) => {
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
  // overflow: hidden;
}
// ::v-deep .el-dialog {
//   height: 100%;
// }
::v-deep .el-dialog__wrapper {
  position: absolute !important;
  margin-top: 50px;
}

//  ::v-deep .iframe-dialog {
//     height: 100%;
//     overflow: hidden;
//     overflow-y: scroll;
//  }
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
  z-index: 2004;

  .title {
    font-size: 18px;
    font-weight: bold;
  }
}
.abow_dialog {
  display: flex;
  justify-content: center;
  align-items: Center;
  overflow: hidden;
  ::v-deep .el-dialog {
    margin: 0 auto !important;
    height: 100%;
    overflow: hidden;
    ::v-deep .el-dialog__body {
      position: absolute;
      left: 0;
      top: 54px;
      bottom: 0;
      right: 0;
      padding: 0;
      z-index: 1;
      overflow: hidden;
      overflow-y: scroll;
    }
  }
}
</style>
