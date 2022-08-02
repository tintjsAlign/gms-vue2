<template>
  <div class="iframe-container">
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="100%"
      :modal-append-to-body="false"
      :modal="false"
      top="0"
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

        this.html = html
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
</style>
