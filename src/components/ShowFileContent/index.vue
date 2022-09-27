<template>
  <div class="app-container">
    <el-drawer :title="title" size="50%" :visible.sync="drawer" :append-to-body="true" :direction="rtl" :before-close="handleClose">
      <!-- 展示区域 -->
      <!-- 根据文件后缀判断展示图片还是文本 -->
      <div class="content">
        <div v-if="fileType === 'image'">
          <el-image style="width: 100%" :src="fileUrl" fit="cover"></el-image>
        </div>
        <div v-else-if="fileType === 'doc'">
          <el-alert :closable="false" :title="title" show-icon>
          <el-alert :closable="false">
            <div v-html="fileContent"></div>
          </el-alert>
        </div>
        <div v-else>
          <el-alert :closable="false" :title="title" :type="alertType" show-icon>
          </el-alert>
          <el-alert :closable="false" :type="alertType">
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
  inject: ['reload'],
  props: {},
  data() {
    return {
      title: '',
      drawer: false,
      alertType: '',
      isTree:''
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    show(res, title, isTree) {
      console.log('isTree:', isTree)
      console.log('展示文件 title:', title)
      if (isTree) {
        this.isTree = isTree
      }
      if (title.indexOf('|continuityAdd') > -1) {
        this.continuityAdd = title.split('|')[1]
        this.title = title.split('|')[0]
      }else {
        this.title = title
      }
      // 根据文件后缀判断展示图片还是文件或者文本
      if (res.match(/\.(jpg|jpeg|png|gif|bmp|svg)$/)) {
        this.fileType = 'image'
        this.fileUrl = process.env.VUE_APP_BASE_API + '/' + res
      } else if (res.match(/\.(txt|doc|docx|xls|xlsx|ppt|pptx|pdf)$/)) {
        this.fileType = 'doc'
        this.fileContent = res
      } else {
        this.fileType = 'text'
        this.fileContent = res
        // 分行
        this.fileContent = this.fileContent.replace(/\n/g, '<br>')
        // 控制alertType
        if (res.match(/成功::/g)) {
          this.alertType = 'success'
        } else {
          this.alertType = 'info'
        }
      }
      this.drawer = true
    },
    handleClose(done) {
      if (this.isTree) {
        if (this.isTree === 'tree') {
          done()
        }else {
          // this.reloadOfSearch(this.isTree)
          this.$emit('reloadOfSearch', this.isTree)
          done()
        }
      }else{
        if (this.title === '登记被测系统') {
          this.$router.push('/被测信息系统')
          done()
        }else if(this.continuityAdd){
          done()
        }
        else{
          // this.reload()
          this.$emit('reloadOfSearch')
          done()
        }
      }
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
