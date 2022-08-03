<template>
  <div class="app-container">
    <el-drawer :title="title" size="50%" :visible.sync="drawer" :direction="rtl" :before-close="handleClose">
      <!-- 展示区域 -->
      <!-- 根据文件后缀判断展示图片还是文本 -->
      <div v-if="fileType === 'image'">
        <el-image style="width: 100%;" :src="fileUrl" fit="cover"></el-image>
      </div>
      <div v-else>
        <div v-html="fileContent"></div>
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
      drawer: false
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    show(res, title) {
      this.title = title
      // 根据文件后缀判断展示图片还是文本
      // res=data/f48ada695dfb4bd787998be6d8d12bc1.jpg
      let fileType = res.substring(res.lastIndexOf('.') + 1)
      if (fileType === 'jpg' || fileType === 'png' || fileType === 'jpeg') {
        this.fileType = 'image'
        this.fileUrl = process.env.VUE_APP_BASE_API + '/' + res
      } else {
        this.fileType = 'text'
        this.fileContent = res
      }
      this.drawer = true
    }
  }
}
</script>

<style scoped lang="scss"></style>
