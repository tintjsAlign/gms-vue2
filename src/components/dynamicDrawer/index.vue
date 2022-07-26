<template>
  <div class="drawer-container">
    <el-drawer
      :title="drawerTitle"
      :before-close="handleClose"
      :visible.sync="dialog"
      direction="rtl"
      size="60%"
      custom-class="demo-drawer"
      ref="drawer"
    >
      <div class="demo-drawer__content">
        <el-row gutter="24">
          <el-col span="24">
            <el-form
              :model="form"
              label-position="top"
              size="small"
              :label-width="formLabelWidth"
            >
              <!-- el-row 每行最多两个输入框 -->

              <div v-for="(item, index) in drawerData" :key="index">
                <!-- <el-row gutter="24" :key="index" v-if="index % 2 == 0"> -->
                <!-- query类型--选择框 ↓↓↓-->
                <el-col
                  span="12"
                  v-if="item.otherProperties.textType === 'query'"
                >
                  <el-form-item :label="item.fldAlais">
                    <el-select
                      v-model="form[item.valueFldName]"
                      placeholder="请选择"
                      style="width: 100%"
                      @focus="queryOption(item)"
                      @change="getChange(item, index)"
                    >
                      <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <!-- query类型--选择框 end ↑↑↑-->
                <!-- dateTime类型--日期选择框 ↓↓↓-->
                <el-col
                  span="12"
                  v-else-if="item.otherProperties.textType === 'dateTime'"
                >
                  <el-form-item :label="item.fldAlais">
                    <el-date-picker
                      v-model="form[item.valueFldName]"
                      :value-format="item.otherProperties.dateFmt"
                      type="date"
                      placeholder="选择日期"
                      @change="dateChange"
                    >
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <!-- dateTime类型--日期选择框 end ↑↑↑-->
                <!-- enum类型--枚举选择框 ↓↓↓-->
                <el-col
                  span="12"
                  v-else-if="item.otherProperties.textType === 'enum'"
                >
                  <el-form-item :label="item.fldAlais">
                    <el-select
                      v-model="form[item.valueFldName]"
                      placeholder="请选择"
                      style="width: 100%"
                      @focus="queryOption(item)"
                      @change="getChange(item, index)"
                    >
                      <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <!-- enum类型--枚举选择框 end ↑↑↑-->
                <!-- queryArea 类型--地区选择框 ↓↓↓-->
                <el-col
                  span="12"
                  v-else-if="item.otherProperties.textType === 'queryArea'"
                >
                  <el-form-item :label="item.fldAlais">
                    <el-select
                      v-model="form[item.valueFldName]"
                      placeholder="请选择"
                      style="width: 100%"
                      @focus="queryOption(item)"
                      @change="getChange(item, index)"
                    >
                      <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <!-- queryArea 类型--地区选择框 end ↑↑↑-->
                <!-- multirow 类型--多行输入框 ↓↓↓-->
                <el-col
                  span="12"
                  v-else-if="item.otherProperties.textType === 'multirow'"
                >
                  <el-form-item :label="item.fldAlais">
                    <el-input
                      v-model="form[item.valueFldName]"
                      autocomplete="off"
                      type="textarea"
                      autosize
                    ></el-input>
                  </el-form-item>
                </el-col>
                <!-- multirow 类型--多行输入框 end ↑↑↑-->
                <!-- 普通类型--输入框 ↓↓↓-->
                <el-col span="12" v-else>
                  <el-form-item :label="item.fldAlais">
                    <el-input
                      v-model="form[item.valueFldName]"
                      autocomplete="off"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <!-- 普通类型--输入框 end ↑↑↑-->
              </div>

              <!-- <el-form-item>
              <div class="demo-drawer__footer">
                <el-button @click="cancelForm">取 消</el-button>
                <el-button
                  type="primary"
                  @click="submitForm"
                  :loading="loading"
                  >{{ loading ? '提交中 ...' : '确 定' }}</el-button
                >
              </div>
            </el-form-item> -->
            </el-form>
          </el-col>
        </el-row>
        <div class="demo-drawer__footer">
          <el-button @click="cancelForm">取 消</el-button>
          <el-button
            type="primary"
            @click="$refs.drawer.submitForm()"
            :loading="loading"
            >{{ loading ? '提交中 ...' : '确 定' }}</el-button
          >
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { requestMain } from '@/api/main'
export default {
  name: 'drawer-container',
  components: {},
  props: {
    drawerData: {
      type: Array,
      default: () => []
    },
    drawerTitle: {
      type: String,
      default: ''
    },
    preCondition: {
      type: String,
      default: ''
    },
    requestData: {
      type: Object,
      default: () => {}
    },
    moreButton: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      dialog: true,
      loading: false,
      form: {},
      formLabelWidth: '100px',
      timer: null,
      options: [],
      printerSelect: []
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    handleClose(done) {
      if (this.loading) {
        return
      }
      this.loading = false
      this.$router.go(-1)
      // this.$confirm('确定要提交表单吗？')
      //   .then((_) => {
      //     this.loading = true
      //     this.timer = setTimeout(() => {
      //       done()
      //       // 动画关闭需要一定的时间
      //       setTimeout(() => {
      //         this.loading = false
      //         this.$router.go(-1)
      //       }, 400)
      //     }, 1000)
      //   })
      //   .catch((_) => {})
    },
    cancelForm() {
      this.loading = false
      this.dialog = false
      this.$router.go(-1)
      clearTimeout(this.timer)
    },
    queryOption(item) {
      console.log(item)
      this.readName = item.otherProperties.readFld
      let data = {
        SYSTEMKEYNAME: window.localStorage.getItem('SYSTEMKEYNAME'),
        SYSTEMTELLERNO: window.localStorage.getItem('SYSTEMTELLERNO'),
        operationID: item.otherProperties.operationIDForSuggest,
        readName: item.otherProperties.readFld,
        condition: item.value
      }
      // 根据类型修改data
      if (item.otherProperties.textType === 'queryArea') {
        // 查询省份
        // 查询市
        data.province = this.form.province
        // 查询区县
        data.city = this.form.city
      }
      requestMain(data).then((res) => {
        console.log(res)
        let options = []
        if (item.otherProperties.textType === 'enum') {
          // 拼装枚举options
          res.forEach((item) => {
            options.push({
              value: item.value,
              label: item.remark
            })
          })
        } else {
          // 拼装options
          res.forEach((item) => {
            options.push({
              value: item[this.readName],
              label: item[this.readName]
            })
          })
        }
        this.options = options
      })
    },
    getChange(item, index) {},
    dateChange(date) {
      console.log('dateChange:', date)
    },
    submitForm() {
      this.$confirm('确定要提交表单吗？')
        .then((_) => {
          this.loading = true
          // this.timer = setTimeout(() => {
          // 动画关闭需要一定的时间
          setTimeout(() => {
            // 拼接form数据为字符串
            let formData = ''
            for (let key in this.form) {
              formData += `${key}=${this.form[key]},`
            }
            formData = formData.substring(0, formData.length - 1)
            // 拼接preCondition和formData
            let condition = `${this.preCondition},${formData}`
            console.log('true condition:', condition)

            // 发送请求
            let data = {
              SYSTEMKEYNAME: window.localStorage.getItem('SYSTEMKEYNAME'),
              SYSTEMTELLERNO: window.localStorage.getItem('SYSTEMTELLERNO'),
              operationID: this.requestData.operationID,
              resId: this.requestData.resId,
              tblAlias: this.requestData.tblAlias,
              condition: condition
            }
            requestMain(data).then((res) => {
              console.log(res)
              if (res === 'statusCode:200') {
                this.loading = false
                this.dialog = false
                this.$router.go(-1)
              } else {
                // 截取错误信息
                // reference to view with name 'template/main'; model is {message=错误原因=被测单位的名称不能为空|SERVICELOGSSN=202207261031511220210016|, statusCode=300}
                let error = res.split('|')[0].split('message=')[1]
                this.$message.error(error)
              }
              // clearTimeout(this.timer)
            })
            // this.$refs.drawer.closeDrawer()
          }, 400)
          // }, 1000)
        })
        .catch((_) => {})
      // clearTimeout(this.timer)
    }
  }
}
</script>

<style scoped lang="scss">
.drawer-container {
  .demo-drawer__content {
    padding: 20px;
  }
  .demo-drawer__footer {
    // 向右对齐
    text-align: right;
  }

  .dynamic-table {
    margin-top: 20px;
    margin-bottom: 20px;
  }
  .pagination-container {
    // 固定在右侧底部
    position: fixed;
    bottom: 0;
    right: 0;
    // width: 100%;
    margin-right: 10px;
    margin-bottom: 5px;
    height: 50px;
    background: #fff;
    // border-top: 1px solid #ebeef5;
    .el-pagination {
      margin: 0;
    }
  }
}
::v-deep .el-select .el-input {
  width: 100%;
}
::v-deep .el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 100%;
}
::v-deep .el-dropdown-link {
  cursor: pointer;
  color: #409eff;
  margin-left: 10px;
}
::v-deep .el-icon-arrow-down {
  font-size: 12px;
}
</style>
