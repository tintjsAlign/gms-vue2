<template>
  <div class="app-container">
    <el-drawer :title="title" size="50%" :visible.sync="drawer" :direction="rtl" :before-close="handleClose">
      <!-- 展示区域 -->
      <!-- 根据文件后缀判断展示图片还是文本 -->
      <div class="content">
        <div v-if="fileType === 'image'">
          <el-image style="width: 100%" :src="fileUrl" fit="cover"></el-image>
        </div>
        <div v-else-if="fileType === 'doc'">
          <div v-html="fileContent"></div>
        </div>
        <div v-else>
          <!-- <div>{{ fileContent }}</div> -->
          <el-alert :closable="false" :title="title" :type="alertType" show-icon>
            <div v-html="fileContent"></div>
          </el-alert>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: '',
  components: {},
  props: {},
  data() {
    return {
      title: '',
      drawer: false,
      alertType: '',
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    show(res, title) {
      this.title = title
      // 根据文件后缀判断展示图片还是文件或者文本
      if (res.match(/\.(jpg|jpeg|png|gif|bmp|svg)$/)) {
        this.fileType = 'image'
        this.fileUrl = res
      } else if (res.match(/\.(txt|doc|docx|xls|xlsx|ppt|pptx|pdf)$/)) {
        this.fileType = 'doc'
        this.fileContent = res
      } else {
        this.fileType = 'text'
        this.fileContent = res
        // 分行
        this.fileContent = this.fileContent.replace(/\n/g, '<br>')
        // 控制alertType
        if (res.match(/成功/g)) {
          this.alertType = 'success'
        } else {
          this.alertType = 'warning'
        }
      }
      this.drawer = true
    }
  }
}
</script>

<style scoped lang="scss">
.content {
  padding: 20px;
  line-height: 35px;
}
</style>
