<template>
  <div class="drawer-container">
    <el-drawer
      :title="drawerTitle"
      :before-close="handleClose"
      :visible.sync="dialog"
      custom-class="drawerBox"
      direction="rtl"
      size="50%"
      ref="drawer"
    >
      <div class="demo-drawer__content">
        <el-row gutter="20">
          <el-col span="24">
            <el-form
              :model="form"
              ref="dynamicTableRef"
              label-position="top"
              size="small"
            >
              <!-- el-row 每行最多两个输入框 -->

              <div v-for="(item, index) in drawerData" :key="index">
                <!-- <el-row gutter="24" :key="index" v-if="index % 2 == 0"> -->
                <!-- query类型(只可选择)--选择框 ↓↓↓-->
                <el-col
                  span="12"
                  v-if="
                    item.otherProperties.textType === 'query' &&
                    item.otherProperties.otherCon === 'readonly'
                  "
                >
                  <el-form-item
                    :required="isRequired(item)"
                    :label="item.fldAlais"
                  >
                    <el-select
                      v-model="form[item.valueFldName]"
                      placeholder="请选择"
                      style="display: block"
                      @focus="queryOption(item)"
                      @change="getChange($event, item, index)"
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
                <!-- query类型(只可选择)--选择框 end ↑↑↑-->
                <!-- query类型（可创建）--选择框 ↓↓↓-->
                <el-col
                  span="12"
                  v-else-if="
                    item.otherProperties.textType === 'query' &&
                    item.otherProperties.otherCon === ''
                  "
                >
                  <el-form-item
                    :required="isRequired(item)"
                    :label="item.fldAlais"
                  >
                    <el-select
                      v-model="form[item.valueFldName]"
                      placeholder="请选择"
                      style="width: 100%"
                      filterable
                      allow-create
                      default-first-option
                      @focus="queryOption(item)"
                      @change="getChange($event, item, index)"
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
                <!-- query类型（可创建）--选择框 end ↑↑↑-->
                <!-- dateTime类型--日期选择框 ↓↓↓-->
                <el-col
                  span="12"
                  v-else-if="item.otherProperties.textType === 'dateTime'"
                >
                  <el-form-item
                    :required="isRequired(item)"
                    :label="item.fldAlais"
                  >
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
                  v-else-if="item.otherProperties.textType.match(/enum/g)"
                >
                  <el-form-item
                    :required="isRequired(item)"
                    :label="item.fldAlais"
                  >
                    <el-select
                      v-model="form[item.valueFldName]"
                      placeholder="请选择"
                      style="width: 100%"
                      @focus="queryOption(item)"
                      @change="getChange($event, item, index)"
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
                  <el-form-item
                    :required="isRequired(item)"
                    :label="item.fldAlais"
                  >
                    <el-select
                      v-model="form[item.valueFldName]"
                      placeholder="请选择"
                      style="width: 100%"
                      @focus="queryOption(item)"
                      @change="getChange($event, item, index)"
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
                  <el-form-item
                    :required="isRequired(item)"
                    :label="item.fldAlais"
                  >
                    <el-input
                      v-model="form[item.valueFldName]"
                      autocomplete="off"
                      type="text"
                      autosize
                      @focus="changeType"
                      v-if="!isTextarea"
                    ></el-input>
                    <el-input
                      v-model="form[item.valueFldName]"
                      autocomplete="off"
                      type="textarea"
                      :autosize="{ minRows: 2, maxRows: 4 }"
                      v-if="isTextarea"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <!-- multirow 类型--多行输入框 end ↑↑↑-->

                <!-- readOnly 类型--只读不可修改框 ↓↓↓-->
                <el-col
                  span="12"
                  v-else-if="
                    item.otherProperties.textType.match(/readOnly/g) &&
                    item.otherProperties.otherCon === 'readonly'
                  "
                >
                  <el-form-item
                    :required="isRequired(item)"
                    :label="item.fldAlais"
                  >
                    <el-input
                      v-model="form[item.valueFldName]"
                      autocomplete="off"
                      type="text"
                      :disabled="true"
                      autosize
                    ></el-input>
                  </el-form-item>
                </el-col>
                <!-- readOnly 类型--只读不可修改框 end ↑↑↑-->

                <!-- 普通类型--输入框 ↓↓↓-->
                <el-col span="12" v-else>
                  <el-form-item
                    :required="isRequired(item)"
                    :label="item.fldAlais"
                  >
                    <el-input
                      v-model="form[item.valueFldName]"
                      autocomplete="off"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <!-- 普通类型--输入框 end ↑↑↑-->
              </div>
            </el-form>
          </el-col>
        </el-row>
        <div class="demo-drawer__footer">
          <el-button @click="cancelForm">取 消</el-button>
          <el-button
            type="primary"
            @click="submitForm"
            :loading="loading"
            v-if="
              requestData.itemName !== '查询' || requestData.operationID !== 48
            "
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
  props: {},
  data() {
    return {
      dialog: false,
      loading: false,
      drawerData: [],
      drawerTitle: '',
      preCondition: '',
      requestData: {},
      moreButton: [],
      form: {},
      // formLabelWidth: '100px',
      timer: null,
      options: [],
      printerSelect: [],
      isTextarea: false
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    show(data) {
      this.isTextarea = false
      this.form = {}

      // this.loadingInstance = this.$loading({
      //   target: '.drawerBox',
      //   fullscreen: true
      // })
      console.log('openDrawer####', data)
      this.requestData = data

      let tblAlias
      if (this.requestData.itemName !== '登记被测系统') {
        this.preCondition = this.requestData.condition
        this.drawerTitle = this.requestData.itemName
        tblAlias = this.requestData.tblAlias
      } else {
        let url = this.requestData.otherProperties.urlParam
        // url中以&分割，每个参数都是key=value的形式
        let urlParam = url.split('&')
        // console.log('urlParam:', urlParam)
        // 获取condition
        urlParam.forEach((element) => {
          if (element.indexOf('condition=') > -1) {
            this.preCondition = element
              .replace('condition=', '')
              .split(',appendFld')[0]
          }
        })
        console.log('preCondition:', this.preCondition)
        // 将urlParam中的每个参数都拆分成key和value，并存入对象中

        // 截取url中以'appendFld=append.'开头和';'结尾的字符串(掐头去尾)
        let appendFld = url
          .match(/appendFld=append.[^&]+/g)[0]
          .replace('appendFld=append.', '')
        // 截取appendFld中以';'分割的字符串
        let appendFldArr = appendFld.split(';')

        tblAlias = appendFldArr[0]
        this.drawerTitle = appendFldArr[1]
        // console.log('drawerTitle:', this.drawerTitle)
      }

      let requestMainData = {
        // operationID: this.requestData.operationID,
        // operationID: this.requestData.itemName === '登记被测系统' ? '1' : this.requestData.operationID,
        // resId: this.requestData.resId,
        // resId: this.requestData.itemName === '登记被测系统' ? '1056' : this.requestData.resId,
        // rel: this.requestData.rel,
        // tblAlias: tblAlias,
        // isOperatorSingleRec: '0',
        // queryOnlyFlag: '1',
        SYSTEMKEYNAME: window.localStorage.getItem('SYSTEMKEYNAME'),
        SYSTEMTELLERNO: window.localStorage.getItem('SYSTEMTELLERNO'),
        queryOnlyFlag: '1'
      }
      if (this.requestData.itemName === '登记被测系统') {
        requestMainData.tblAlias = tblAlias
        requestMainData.resId = '1056'
        requestMainData.operationID = '1'
      } else {
        // this.requestData的所以属性都存入requestMainData中
        for (let key in this.requestData) {
          requestMainData[key] = this.requestData[key]
        }
      }

      requestMain(requestMainData).then((res) => {
        console.log('抽屉requestMain:', res)
        if (this.requestData.itemName === '登记被测系统') {
          this.trueRes = res
        } else {
          // ###########暂时测试用####
          if (this.requestData.operationID === 1) {
            this.trueRes = res
          } else {
            this.trueRes = res.showfield
            this.resMap = res.resMap
            // 去除res.showfield最后一个字段
            this.trueRes = this.trueRes.slice(0, -1)
          }
        }
        // 过滤 类型为notshow的字段
        let drawerData = this.trueRes.filter(
          (item) => item.otherProperties.textType !== 'notshow'
        )
        this.drawerData = drawerData
        console.log('drawerData:', this.drawerData)

        // 根据来源数据,给表单赋初始值(深拷贝)
        // key=this.drawerData.valueFldName  value=this.drawerData.otherProperties.fldRemark
        if (
          this.requestData.itemName !== '登记被测系统' &&
          this.requestData.operationID !== 1
        ) {
          let form = {}
          this.drawerData.forEach((item) => {
            if (item.otherProperties.textType === 'enum') {
              // 枚举类型特殊处理
              form[item.valueFldName] = item.otherProperties.fldRemark
              form[item.valueFldName + '_enum'] = item.otherProperties.fldValue
            } else {
              // 其它默认值,与resMap对应
              form[item.valueFldName] = this.resMap[item.valueFldName]
              // form[item.valueFldName] = item.otherProperties.fldRemark
            }
          })
          this.form = JSON.parse(JSON.stringify(form))
        } else {
          let form = {}
          this.drawerData.forEach((item) => {
            if (item.otherProperties.textType) {
              if (item.otherProperties.textType === 'enum') {
                // 枚举类型特殊处理
                form[item.valueFldName] = item.otherProperties.fldRemark
                form[item.valueFldName + '_enum'] =
                  item.otherProperties.fldValue
              } else {
                // 其它默认值
                form[item.valueFldName] = item.otherProperties.defaultValue
              }
            }
          })
          this.form = JSON.parse(JSON.stringify(form))
        }

        this.dialog = true
        // this.loadingInstance.close()
        // this.thead.forEach((item) => {
        //   this[item.key] = item.value
        // })
      })
    },
    isRequired(item) {
      console.log('isRequired:', item)
      if (item.otherProperties.checkClass.includes('required')) {
        return true
      } else {
        return false
      }
    },
    handleClose(done) {
      if (this.loading) {
        return
      }
      this.loading = false
      if (this.requestData.itemName === '登记被测系统') {
        done()
        this.$router.go(-1)
      } else {
        done()
        // this.$emit('refresh')
      }
      // this.$router.go(-1)
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
      clearTimeout(this.timer)
    },
    changeType(e) {
      this.isTextarea = !this.isTextarea
    },
    queryOption(item) {
      // 过滤掉this.form对象中的含有'_enum'的字段
      let form = JSON.parse(JSON.stringify(this.form))
      for (let key in form) {
        if (key.indexOf('_enum') !== -1) {
          delete form[key]
        }
      }
      this.form = form

      this.options = []
      // console.log('查询选择框参数', item)
      this.readName = item.otherProperties.readFld
      let data = {
        SYSTEMKEYNAME: window.localStorage.getItem('SYSTEMKEYNAME'),
        SYSTEMTELLERNO: window.localStorage.getItem('SYSTEMTELLERNO')
        // operationID: item.otherProperties.operationIDForSuggest,
        // readName: item.otherProperties.readFld,
        // condition:
      }
      // 如果this.form有值,则加入到data中
      if (this.form) {
        for (let key in this.form) {
          data[key] = this.form[key]
        }
      }
      data.operationID = item.otherProperties.operationIDForSuggest
      data.condition = encodeURI(item.value)
      data.readName = item.otherProperties.readFld
      requestMain(data).then((res) => {
        if (res === []) {
          // 清空选择框和输入框
          this.options = []
          this.form[item.valueFldName] = ''
        }
        console.log('查询选择框数据', res)
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
    getChange(e, item, index) {
      console.log('选择框变化', item)
      console.log('选择框变化值', e)
    },
    dateChange(date) {
      console.log('dateChange:', date)
    },
    submitForm() {
      this.$refs.dynamicTableRef.validate((valid) => {
        if (!valid) {
          console.log('error submit!!')
          return false
        } else {
          this.$confirm('确定要提交表单吗？')
            .then((_) => {
              this.loading = true
              // this.timer = setTimeout(() => {
              // 动画关闭需要一定的时间
              setTimeout(() => {
                if (this.requestData.itemName === '登记被测系统') {
                  // 拼接form数据为字符串
                  let formData = ''
                  for (let key in this.form) {
                    if (this.form[key + '_enum']) {
                      this.form[key] = this.form[key + '_enum']
                    } else {
                      this.form[key] = this.form[key]
                    }
                  }
                  for (let key in this.form) {
                    formData += `${key}=${this.form[key]},`
                  }
                  formData = formData.substring(0, formData.length - 1)
                  // 拼接preCondition和formData
                  this.condition = `${this.preCondition},${formData}`
                  console.log('true condition:', this.condition)
                }

                // 发送请求
                let data = {
                  SYSTEMKEYNAME: window.localStorage.getItem('SYSTEMKEYNAME'),
                  SYSTEMTELLERNO: window.localStorage.getItem('SYSTEMTELLERNO')
                }
                if (this.requestData.itemName === '登记被测系统') {
                  data.condition = encodeURI(this.condition)
                  data.operationID = '216'
                  data.resId = '1128'
                  data.tblAlias = '业务功能执行过程管理界面-运行'
                } else {
                  // this.form和this.requestData的值合并放入到data中

                  // this.requestData
                  for (let key in this.requestData) {
                    data[key] = this.requestData[key]
                  }
                  // 处理this.form中的枚举类型
                  for (let key in this.form) {
                    if (this.form[key + '_enum']) {
                      data[key] = this.form[key + '_enum']
                    } else {
                      data[key] = this.form[key]
                    }
                  }
                  // for (let key in this.form) {
                  //   data[key] = this.form[key]
                  // }

                  data.condition = encodeURI(this.preCondition)
                  // operationID
                  if (
                    this.requestData.operationID === 1 ||
                    this.requestData.itemName.indexOf('新增') > -1
                  ) {
                    data.operationID = '1001'
                  } else if (
                    this.requestData.operationID === 50 ||
                    this.requestData.itemName.indexOf('修改') > -1
                  ) {
                    data.operationID = '1003'
                  } else if (
                    this.requestData.operationID === 49 ||
                    this.requestData.itemName.indexOf('复制') > -1
                  ) {
                    data.operationID = '1001'
                  }

                  // 把所有的值拼接成字符串,以#START开头,以#ENDFLAG结尾,以|分割

                  let formData = ''
                  for (let key in data) {
                    formData += `${key}=${data[key]}|`
                  }
                  data.allResponseFields = `#START${formData}#ENDFLAG`
                }
                requestMain(data).then((res) => {
                  console.log(res)
                  if (res === 'statusCode:200') {
                    // 提交成功后关闭dialog,并刷新页面

                    this.$notify({
                      title: '成功',
                      message: '提交成功',
                      type: 'success',
                      duration: 2000
                    })
                    this.loading = false
                    this.dialog = false
                    if (this.requestData.itemName === '登记被测系统') {
                      this.$router.push('/被测信息系统')
                    } else {
                      this.$emit('refresh')
                    }
                  } else {
                    // 截取错误信息
                    // reference to view with name 'template/main'; model is {message=错误原因=被测单位的名称不能为空|SERVICELOGSSN=202207261031511220210016|, statusCode=300}
                    let error = res.split('|')[0].split('message=')[1]
                    this.$message.error(error)
                    this.loading = false
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
      })
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
::v-deep .el-input {
  width: 100%;
}
::v-deep .el-select .el-input {
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
::v-deep .el-input.is-disabled .el-input__inner {
  color: #81827b;
}
</style>
