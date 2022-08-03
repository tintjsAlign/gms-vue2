<template>
  <div class="app-container">
    <el-dialog :title="title" :visible.sync="dialogVisible">
      <el-upload
        class="upload-demo"
        ref="upload"
        drag
        :action="uploadURL"
        multiple
        name="upfile"
        :auto-upload="false"
        :with-credentials="true"
        :on-success="success"
        :on-change="handleChange"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitUpload">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { requestMain } from '@/api/main'
import qs from 'qs' //引入qs模块，用于序列化post请求参数
export default {
  name: '',
  components: {},
  props: {},
  data() {
    return {
      dialogVisible: false,
      uploadURL: '',
      uploadData: {}
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    show(row) {
      this.title = row.title
      this.row = row
      this.uploadURL = process.env.VUE_APP_BASE_API + '/main'

      this.dialogVisible = true
    },
    uploadFile(row) {
      let data = {
        SYSTEMKEYNAME: window.localStorage.getItem('SYSTEMKEYNAME'),
        SYSTEMTELLERNO: window.localStorage.getItem('SYSTEMTELLERNO')
      }
      Object.assign(data, row)

      data.type = 'file'
      data.operationID2 = data.operationID
      delete data.operationID
      data.operationID = 1205
      data.fileName = this.fileName
      // data.upfile = this.upfile
      // this.uploadData = data
      // 序列化上传数据
      // qs.stringify(object, [options]) 字符串化时，默认情况下，qs 对输出进行 URI 编码，以避免某些特殊字符对某些接口的调用造成请求失败。
      //encode: false 禁用encode编码
      this.uploadData = qs.stringify(data)
      console.log('uploadData:', this.uploadData)
      this.uploadURL = this.uploadURL + '?' + this.uploadData
    },
    submitUpload() {
      this.$refs.upload.submit()
      // console.log('submitUpload upfile:', this.upfile)
      // requestMain(
      //   {
      //     fileName: this.fileName,
      //     upfile: this.upfile
      //   },
      //   this.uploadData
      // ).then((res) => {
      //   console.log('上传文件 res:', res)
      // })
    },
    success(response, file, fileList) {
      console.log(response, file, fileList)
      if (response.statusCode === '200') {
        this.$message({
          message: '上传成功',
          type: 'success'
        })
      } else {
        this.$message({
          message: response.message,
          type: 'error'
        })
      }
    },
    handleChange(file, fileList) {
      console.log(file, fileList)
      this.fileName = file.name
      // 创建表单对象 用于数据的格式  + 用于添加流文件！
      // 获取预览信息
      const formData = new FormData()
      //文件
      formData.append('file', file.raw)
      //文件名
      formData.append('fileName', file.name)
      console.log('formData:', formData.get('file'))
      this.upfile = formData

      this.uploadFile(this.row)
    }
  }
}
</script>

<style scoped lang="scss">
::v-deep .upload-demo {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
