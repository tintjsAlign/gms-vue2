<template>
  <div class="app-container">
    <el-dialog :title="title" :visible.sync="dialogVisible" style="height: auto" :before-close="handleClose">
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
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" :loading="loading" @click="submitUpload">{{ loading ? '上传中 ...' : '上 传' }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import { requestMain } from '@/api/main'
import qs from 'qs' //引入qs模块，用于序列化post请求参数
export default {
  name: '',
  components: {},
  props: {},
  data() {
    return {
      dialogVisible: false,
      loading: false,
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
    handleClose() {
      if (this.loading) {
        this.loading = false
      }
      this.$refs.upload.abort()
      this.$refs.upload.clearFiles()
      this.dialogVisible = false
    },
    uploadFile(row) {
      let data = {
        SYSTEMKEYNAME: window.localStorage.getItem('SYSTEMKEYNAME'),
        SYSTEMTELLERNO: window.localStorage.getItem('SYSTEMTELLERNO')
      }
      // Object.assign(data, row)

      console.log('uploadFile row:', row)
      console.log('uploadFile row.condition:', row.condition)
      let conditionOri = ''
      let conditionOri2 = ''
      let conditionObj = {}
      if (row.condition.indexOf('|') > -1) {
        conditionOri = row.condition.split('|')[0]
        conditionOri2 = row.condition.split('fileName=upload.file|')[1]

        let conditionArr2 = conditionOri2.split('|').filter((i) => i !== '')

        conditionArr2.forEach((i) => {
          if (i.indexOf('=') > -1) {
            let key = i.split('=')[0]
            let value = i.split('=')[1]
            conditionObj[key] = value
          }
        })

        console.log('uploadFile conditionArr2:', conditionArr2)
        console.log('uploadFile conditionObj:', conditionObj)
      } else {
        conditionOri = row.condition
      }
      console.log('上传文件conditionOri:', conditionOri)
      let conditionArr = conditionOri.split(',').filter((i) => i !== '')
      console.log('上传文件conditionArr:', conditionArr)
      let condition = ''
      conditionArr.forEach((i) => {
        if (i.indexOf('=this.') > -1) {
          let key = i.split('=this.')[1]
          let key1 = i.split('=this.')[0]
          if (conditionObj[key]) {
            condition += key1 + '=' + conditionObj[key] + '|'
          } else {
            condition += key1 + '=' + row[key] + '|'
          }
        } else {
          condition += i + '|'
        }
      })

      console.log('uploadFile condition:', condition)

      data.type = 'file'
      data.operationID2 = row.operationID
      delete data.operationID
      data.operationID = 1205
      data.fileName = this.fileName
      data.upfile = this.upfile

      data.tblAlias = row.tblAlias
      data.condition = condition
      data.resId = row.resId
      // this.uploadData = data
      // 序列化上传数据
      // qs.stringify(object, [options]) 字符串化时，默认情况下，qs 对输出进行 URI 编码，以避免某些特殊字符对某些接口的调用造成请求失败。
      //encode: false 禁用encode编码
      // 剔除掉config.data中的值是对象的字段
      for (const key in data) {
        if (typeof data[key] === 'object' || typeof data[key] === 'function') {
          delete data[key]
        }
      }
      console.log('uploadFile data: ', data)
      this.uploadData = qs.stringify(data)
      console.log('uploadData:', this.uploadData)
      this.uploadURL = this.uploadURL + '?' + this.uploadData
    },
    submitUpload() {
      this.loading = true
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
      console.log('上传成功:', response)
      this.loading = false
      if (response.statusCode === '200') {
        this.$message({
          message: '上传成功',
          type: 'success'
        })
        this.dialogVisible = false
      } else {
        let errorMsg = response.substring(response.indexOf('{') + 1, response.lastIndexOf('|SERVICELOGSSN'))
        this.$message({
          message: errorMsg,
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
      this.upfile = formData
      console.log('formData:', formData.get('file'))

      this.uploadFile(this.row)
    }
  }
}
</script>

<style scoped lang="scss">
.app-container {
  height: 100%;
}
::v-deep .upload-demo {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
