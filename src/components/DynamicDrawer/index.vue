<template>
  <div class="drawer-container" v-if="showContainer">
    <div v-if="showParallel">
      <div class="demo-drawer__content">
        <el-row gutter="20">
          <el-col span="24">
            <el-form :model="form" ref="dynamicTableRef" label-position="top" size="small">
              <!-- el-row 每行最多两个输入框 -->

              <div v-for="(item, index) in drawerData" :key="index">
                <!-- <el-row gutter="24" :key="index" v-if="index % 2 == 0"> -->
                <!-- query类型(只可选择)--选择框 ↓↓↓-->
                <el-col span="12" v-if="item.otherProperties.textType === 'query' && item.otherProperties.otherCon === 'readonly'">
                  <el-form-item :rules="requiredRules(item)" :prop="item.valueFldName" :label="item.fldAlais">
                    <el-select
                      v-model="form[item.valueFldName]"
                      placeholder="请选择"
                      clearable
                      style="display: block"
                      :loading="optionLoading"
                      @focus="queryOption(item)"
                      @change="getChange($event, item, index)"
                    >
                      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <!-- query类型(只可选择)--选择框 end ↑↑↑-->
                <!-- query类型（可创建）--选择框 ↓↓↓-->
                <el-col span="12" v-else-if="item.otherProperties.textType === 'query' && item.otherProperties.otherCon === ''">
                  <el-form-item :rules="requiredRules(item)" :prop="item.valueFldName" :label="item.fldAlais">
                    <el-select
                      v-model="form[item.valueFldName]"
                      placeholder="请选择"
                      style="width: 100%"
                      clearable
                      filterable
                      allow-create
                      default-first-option
                      :loading="optionLoading"
                      @focus="queryOption(item)"
                      @change="getChange($event, item, index)"
                    >
                      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <!-- query类型（可创建）--选择框 end ↑↑↑-->
                <!-- dateTime类型--日期选择框 ↓↓↓-->
                <el-col span="12" v-else-if="item.otherProperties.textType === 'dateTime'">
                  <el-form-item :rules="requiredRules(item)" :prop="item.valueFldName" :label="item.fldAlais">
                    <el-date-picker
                      v-model="form[item.valueFldName]"
                      :value-format="item.otherProperties.dateFmt"
                      clearable
                      type="date"
                      placeholder="选择日期"
                      @change="dateChange($event, item)"
                    >
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <!-- dateTime类型--日期选择框 end ↑↑↑-->
                <!-- enum类型--枚举选择框 ↓↓↓-->
                <el-col span="12" v-else-if="item.otherProperties.textType === 'enum'">
                  <el-form-item :rules="requiredRules(item)" :prop="item.valueFldName" :label="item.fldAlais">
                    <el-select
                      v-model="form[item.valueFldName]"
                      placeholder="请选择"
                      style="width: 100%"
                      clearable
                      :loading="optionLoading"
                      @focus="queryOption(item)"
                      @change="getChange($event, item, index)"
                    >
                      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <!-- enum类型--枚举选择框 end ↑↑↑-->
                <!-- queryArea 类型--地区选择框 ↓↓↓-->
                <el-col span="12" v-else-if="item.otherProperties.textType === 'queryArea'">
                  <el-form-item :rules="requiredRules(item)" :prop="item.valueFldName" :label="item.fldAlais">
                    <el-select
                      v-model="form[item.valueFldName]"
                      placeholder="请选择"
                      clearable
                      style="width: 100%"
                      :loading="optionLoading"
                      @focus="queryOption(item)"
                      @change="getChange($event, item, index)"
                    >
                      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <!-- queryArea 类型--地区选择框 end ↑↑↑-->
                <!-- multirow 类型--多行输入框 ↓↓↓-->
                <el-col span="12" v-else-if="item.otherProperties.textType === 'multirow'">
                  <el-form-item :rules="requiredRules(item)" :prop="item.valueFldName" :label="item.fldAlais">
                    <el-popover placement="bottom" width="300" trigger="click">
                      <el-input
                        v-model="form[item.valueFldName]"
                        autocomplete="off"
                        :placeholder="item.fldAlais"
                        clearable
                        autofocus
                        type="textarea"
                        :autosize="{ minRows: 4, maxRows: 6 }"
                      ></el-input>
                      <!-- <el-button slot="reference">click 激活</el-button> -->
                      <el-input
                        slot="reference"
                        v-model="form[item.valueFldName]"
                        autocomplete="off"
                        clearable
                        suffix-icon="el-icon-full-screen"
                        type="text"
                        autosize
                      ></el-input>
                    </el-popover>
                  </el-form-item>
                </el-col>
                <!-- multirow 类型--多行输入框 end ↑↑↑-->

                <!-- readOnly 类型--只读不可修改框 ↓↓↓-->
                <el-col span="12" v-else-if="item.otherProperties.textType === 'notshow' || item.otherProperties.textType.match(/readOnly/gi)">
                  <el-form-item :label="item.fldAlais">
                    <el-input v-model="form[item.valueFldName]" autocomplete="off" clearable type="text" :disabled="true" autosize></el-input>
                  </el-form-item>
                </el-col>
                <!-- readOnly 类型--只读不可修改框 end ↑↑↑-->

                <!-- 普通类型--输入框 ↓↓↓-->
                <el-col span="12" v-else>
                  <el-form-item :rules="requiredRules(item)" :prop="item.valueFldName" :label="item.fldAlais">
                    <el-input v-model="form[item.valueFldName]" autocomplete="off" clearable></el-input>
                  </el-form-item>
                </el-col>
                <!-- 普通类型--输入框 end ↑↑↑-->
              </div>
            </el-form>
          </el-col>
        </el-row>
        <div class="demo-drawer__footer">
          <!-- <el-button @click="cancelForm">取 消</el-button> -->
          <el-button type="primary" @click="submitForm" :loading="loading" v-if="requestData.itemName !== '查询' || requestData.operationID !== 48">{{
            loading ? '提交中 ...' : '修 改'
          }}</el-button>
        </div>
      </div>
    </div>
    <el-drawer
      :title="drawerTitle"
      :before-close="handleClose"
      :visible.sync="dialog"
      custom-class="drawerBox"
      direction="rtl"
      size="720px"
      ref="drawer"
      :append-to-body="true"
      destroy-on-close
      v-else
    >
      <div class="demo-drawer__content">
        <el-row gutter="20">
          <el-col span="24">
            <el-form :model="form" ref="dynamicTableRef" label-position="top" size="small">
              <!-- el-row 每行最多两个输入框 -->

              <div v-for="(item, index) in drawerData" :key="index">
                <!-- <el-row gutter="24" :key="index" v-if="index % 2 == 0"> -->
                <!-- query类型(只可选择)--选择框 ↓↓↓-->
                <el-col span="12" v-if="item.otherProperties.textType === 'query' && item.otherProperties.otherCon === 'readonly'">
                  <el-form-item :rules="requiredRules(item)" :prop="item.valueFldName" :label="item.fldAlais">
                    <el-select
                      v-model="form[item.valueFldName]"
                      placeholder="请选择"
                      clearable
                      style="display: block"
                      :loading="optionLoading"
                      @focus="queryOption(item)"
                      @change="getChange($event, item, index)"
                    >
                      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <!-- query类型(只可选择)--选择框 end ↑↑↑-->
                <!-- query类型（可创建）--选择框 ↓↓↓-->
                <el-col span="12" v-else-if="item.otherProperties.textType === 'query' && item.otherProperties.otherCon === ''">
                  <el-form-item :rules="requiredRules(item)" :prop="item.valueFldName" :label="item.fldAlais">
                    <el-select
                      v-model="form[item.valueFldName]"
                      placeholder="请选择"
                      style="width: 100%"
                      clearable
                      filterable
                      allow-create
                      default-first-option
                      :loading="optionLoading"
                      @focus="queryOption(item)"
                      @change="getChange($event, item, index)"
                    >
                      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <!-- query类型（可创建）--选择框 end ↑↑↑-->
                <!-- dateTime类型--日期选择框 ↓↓↓-->
                <el-col span="12" v-else-if="item.otherProperties.textType === 'dateTime'">
                  <el-form-item :rules="requiredRules(item)" :prop="item.valueFldName" :label="item.fldAlais">
                    <el-date-picker
                      v-model="form[item.valueFldName]"
                      :value-format="item.otherProperties.dateFmt"
                      clearable
                      type="date"
                      placeholder="选择日期"
                      @change="dateChange($event, item)"
                    >
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <!-- dateTime类型--日期选择框 end ↑↑↑-->
                <!-- enum类型--枚举选择框 ↓↓↓-->
                <el-col span="12" v-else-if="item.otherProperties.textType === 'enum'">
                  <el-form-item :rules="requiredRules(item)" :prop="item.valueFldName" :label="item.fldAlais">
                    <el-select
                      v-model="form[item.valueFldName]"
                      placeholder="请选择"
                      style="width: 100%"
                      clearable
                      :loading="optionLoading"
                      @focus="queryOption(item)"
                      @change="getChange($event, item, index)"
                    >
                      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <!-- enum类型--枚举选择框 end ↑↑↑-->
                <!-- queryArea 类型--地区选择框 ↓↓↓-->
                <el-col span="12" v-else-if="item.otherProperties.textType === 'queryArea'">
                  <el-form-item :rules="requiredRules(item)" :prop="item.valueFldName" :label="item.fldAlais">
                    <el-select
                      v-model="form[item.valueFldName]"
                      placeholder="请选择"
                      clearable
                      style="width: 100%"
                      :loading="optionLoading"
                      @focus="queryOption(item)"
                      @change="getChange($event, item, index)"
                    >
                      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <!-- queryArea 类型--地区选择框 end ↑↑↑-->
                <!-- multirow 类型--多行输入框 ↓↓↓-->
                <el-col span="12" v-else-if="item.otherProperties.textType === 'multirow'">
                  <el-form-item :rules="requiredRules(item)" :prop="item.valueFldName" :label="item.fldAlais">
                    <el-popover placement="bottom" width="300" trigger="click">
                      <el-input
                        v-model="form[item.valueFldName]"
                        autocomplete="off"
                        :placeholder="item.fldAlais"
                        clearable
                        autofocus
                        type="textarea"
                        :autosize="{ minRows: 4, maxRows: 6 }"
                      ></el-input>
                      <!-- <el-button slot="reference">click 激活</el-button> -->
                      <el-input
                        slot="reference"
                        v-model="form[item.valueFldName]"
                        autocomplete="off"
                        clearable
                        suffix-icon="el-icon-full-screen"
                        type="text"
                        autosize
                      ></el-input>
                    </el-popover>
                  </el-form-item>
                </el-col>
                <!-- multirow 类型--多行输入框 end ↑↑↑-->

                <!-- readOnly 类型--只读不可修改框 ↓↓↓-->
                <el-col span="12" v-else-if="item.otherProperties.textType === 'notshow' || item.otherProperties.textType.match(/readOnly/gi)">
                  <el-form-item :label="item.fldAlais">
                    <el-input v-model="form[item.valueFldName]" autocomplete="off" clearable type="text" :disabled="true" autosize></el-input>
                  </el-form-item>
                </el-col>
                <!-- readOnly 类型--只读不可修改框 end ↑↑↑-->

                <!-- 普通类型--输入框 ↓↓↓-->
                <el-col span="12" v-else>
                  <el-form-item :rules="requiredRules(item)" :prop="item.valueFldName" :label="item.fldAlais">
                    <el-input v-model="form[item.valueFldName]" autocomplete="off" clearable></el-input>
                  </el-form-item>
                </el-col>
                <!-- 普通类型--输入框 end ↑↑↑-->
              </div>
            </el-form>
          </el-col>
        </el-row>
        <div class="demo-drawer__footer">
          <el-button @click="cancelForm">取 消</el-button>
          <el-button type="primary" @click="submitForm" :loading="loading" v-if="requestData.operationID !== 48">{{
            loading ? '提交中 ...' : '确 定'
          }}</el-button>
        </div>
      </div>
    </el-drawer>

    <show-file-content ref="showFileContent"></show-file-content>
  </div>
</template>

<script>
import { requestMain } from '@/api/main'
import showFileContent from '@/components/ShowFileContent'

export default {
  name: 'drawer-container',
  components: { showFileContent },
  props: {},
  data() {
    return {
      showContainer: true,
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
      isTextarea: false,
      showParallel: false,
      levelFlag: false,
      optionLoading: false,
      OPENREQMAINDATA: {},
      REQMAINDATA: {}
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    show(data, level) {
      if (!data) {
        this.showContainer = false
        return
      }
      this.showContainer = true
      this.form = {}
      this.OPENREQMAINDATA = {}
      this.REQMAINDATA = {}
      this.isTextarea = false

      if (level) {
        this.levelFlag = true
        if (level === 'parallel') {
          this.showParallel = true
        } else {
          this.showParallel = false
        }
      } else {
        this.levelFlag = false
        this.showParallel = false
      }

      // this.loadingInstance = this.$loading({
      //   target: '.drawerBox',
      //   fullscreen: true
      // })
      console.log('openDrawer####', data)
      this.requestData = data
      if (data.otherProperties && data.otherProperties.urlParam.indexOf('=append.') > -1) {
        this.specialInstructFlag = true
      } else {
        this.specialInstructFlag = false
      }

      let tblAlias
      // if (this.requestData.itemName !== '登记被测系统') {
      if (this.specialInstructFlag === false) {
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
            this.preCondition = element.replace('condition=', '').split(',append')[0]
          }
        })
        console.log('preCondition:', this.preCondition)
        // 将urlParam中的每个参数都拆分成key和value，并存入对象中

        // 截取url中以'=append.'开头和';'结尾的字符串(掐头去尾)
        let append = url.match(/=append.[^&]+/g)[0].replace('=append.', '')
        // 截取appendFld中以';'分割的字符串
        let appendArr = append.split(';')

        tblAlias = appendArr[0]
        this.drawerTitle = appendArr[1]
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
      // if (this.requestData.itemName === '登记被测系统') {
      if (this.specialInstructFlag === true) {
        // requestMainData.tblAlias = tblAlias
        // requestMainData.resId = this.requestData.resId

        // 根据append特例化operationID
        if (this.requestData.otherProperties.urlParam.indexOf('appendFld=') > -1) {
          requestMainData.operationID = '1056'
          Object.assign(requestMainData, this.requestData)
          delete requestMainData.operationID
          delete requestMainData.condition
          this.OPENREQMAINDATA = {
            ...requestMainData,
            tblAlias: tblAlias,
            resId: this.requestData.resId,
            operationID: '1056'
          }
        } else if (this.requestData.otherProperties.urlParam.indexOf('appendRec=') > -1) {
          requestMainData.operationID = '1067'
          Object.assign(requestMainData, this.requestData)
          delete requestMainData.operationID
          delete requestMainData.condition
          this.OPENREQMAINDATA = {
            ...requestMainData,
            tblAlias: tblAlias,
            resId: this.requestData.resId,
            operationID: '1067'
          }
        }
      } else {
        // this.requestData的所以属性都存入requestMainData中
        // for (let key in this.requestData) {
        //   requestMainData[key] = this.requestData[key]
        // }
        Object.assign(requestMainData, this.requestData)
        this.OPENREQMAINDATA = {
          ...requestMainData
        }
      }

      let loadingtag = '.app-main'
      if (this.showParallel) {
        loadingtag = 'unshow'
      } else {
        // delete this.OPENREQMAINDATA.condition
      }
      console.log('抽屉form请求数据:', this.OPENREQMAINDATA)

      if (this.requestData.itemName === '增加风险项') {
        let value1 = this.OPENREQMAINDATA.attr128LenValue1
        let value2 = this.OPENREQMAINDATA.attr128LenValue2
        let value6 = this.OPENREQMAINDATA.attr128LenValue6
        this.OPENREQMAINDATA.attr128LenValue1 = value1 ? value1 : '中国国家标准化管理委员会'
        this.OPENREQMAINDATA.attr128LenValue6 = value6 ? value6 : 'GB/T 39786-2021 信息安全技术 信息系统密码应用基本要求'
        this.OPENREQMAINDATA.attr128LenValue2 = value2 ? value2 : '信息系统安全等级保护标准'
      }

      requestMain(this.OPENREQMAINDATA, loadingtag).then((res) => {
        console.log('抽屉requestMain:', res)
        if (typeof res === 'string' && res.indexOf('message=') > -1) {
          // ModelAndView: reference to view with name 'template/main'; model is {message=错误原因=表记录没有找到|SERVICELOGSSN=202208031017080807980003|, statusCode=300}
          // 提取错误原因
          let errorMsg = res.match(/message=(.*?)\|/)[1]
          this.$message.error(errorMsg)
          return
        }
        // if (this.requestData.itemName === '登记被测系统') {
        if (this.specialInstructFlag === true) {
          this.trueRes = res
        } else {
          // ###########暂时测试用####
          if (this.requestData.operationID === 1) {
            this.trueRes = res
          } else {
            this.trueRes = res.showfield
            this.resMap = res.resMap
            console.log('初始值对照:', this.resMap)
            // 去除res.showfield最后一个字段
            this.trueRes = this.trueRes.slice(0, -1)
          }
        }
        if (!this.levelFlag || this.requestData.operationID === 1) {
          // 过滤 类型为notshow的字段
          let drawerData = this.trueRes.filter((item) => item.otherProperties.textType !== 'notshow')
          this.drawerData = drawerData
        } else {
          this.drawerData = this.trueRes
        }
        console.log('drawerData:', this.drawerData)

        // 根据来源数据,给表单赋初始值(深拷贝)
        // key=this.drawerData.valueFldName  value=this.drawerData.otherProperties.fldRemark
        // if (this.requestData.itemName !== '登记被测系统' && this.requestData.operationID !== 1) {
        if (this.specialInstructFlag === false && this.requestData.operationID !== 1) {
          let form = {}
          this.drawerData.forEach((item) => {
            let type = item.otherProperties.textType
            if (type.match(/enum/gi)) {
              // 枚举类型特殊处理
              form[item.valueFldName] = item.otherProperties.fldRemark
              form[item.valueFldName + '_enum'] = item.otherProperties.fldValue
            } else if (type.match(/date/gi)) {
              // 日期类型特殊处理(去掉-)
              let dateValue = this.resMap[item.valueFldName].replace(/-/g, '')
              form[item.valueFldName] = this.resMap[item.valueFldName]
              form[item.valueFldName + '_enum'] = dateValue
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
            let type = item.otherProperties.textType
            if (item.otherProperties.textType) {
              if (item.otherProperties.textType.match(/enum/gi)) {
                // 枚举类型特殊处理
                form[item.valueFldName] = item.otherProperties.fldRemark
                form[item.valueFldName + '_enum'] = item.otherProperties.defaultValue
              } else if (type.match(/date/gi)) {
                // 日期类型特殊处理(去掉-)
                let dateValue = item.otherProperties.defaultValue.replace(/-/g, '')
                form[item.valueFldName] = item.otherProperties.defaultValue
                form[item.valueFldName + '_enum'] = dateValue
              } else {
                // 其它默认值
                form[item.valueFldName] = item.otherProperties.defaultValue
              }
            }
          })
          this.form = JSON.parse(JSON.stringify(form))
        }
        console.log('抽屉form:', this.form)

        if (this.showParallel) {
          // this.drawerForm = this.$_.cloneDeep(this.form)
          // // this.form传回给父组件
          // this.$emit('getDrawerForm', this.drawerForm)
          this.$refs.dynamicTableRef.clearValidate()
        } else {
          this.dialog = true
        }
        // this.loadingInstance.close()
        // this.thead.forEach((item) => {
        //   this[item.key] = item.value
        // })
      })
      // .catch((err) => {
      //   console.log('抽屉requestMain err:', err)
      //   this.$message.error('请求失败')
      // })
    },
    requiredRules(item) {
      if (item.otherProperties.checkClass.includes('required') || item.valueConstraint.includes('notnull')) {
        return { required: true, message: '必填项不能为空' }
      } else {
        return { required: false, message: '' }
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
    async queryOption(item) {
      this.options = []
      this.optionLoading = true
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
      requestMain(data, 'unshow').then((res) => {
        if (res === []) {
          // 清空选择框和输入框
          this.options = []
          this.form[item.valueFldName] = ''
        }
        console.log('查询选择框数据', res)
        let options = []
        if (item.otherProperties.textType.match(/enum/gi)) {
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
        this.optionLoading = false
      })
    },
    getChange(e, item, index) {
      // console.log('选择框变化', item)
      // console.log('选择框变化值', e)
      // 过滤掉this.form对象当前字段中的含有'_enum'的字段
      if (item.otherProperties.textType === 'enum') {
        let enumKey = item.valueFldName + '_enum'
        if (this.form[enumKey]) {
          delete this.form[enumKey]
        }
      }
    },
    dateChange(date, item) {
      console.log('dateChange:', date)
      // 格式化date
      let dateValue = date.replace(/-/g, '')
      this.form[item.valueFldName + '_enum'] = dateValue
    },
    async submitForm() {
      this.$refs.dynamicTableRef.validate((valid) => {
        if (!valid) {
          console.log('error submit!!')
          return false
        } else {
          let subTip = '确定要提交吗？'
          if (this.requestData.otherProperties && this.requestData.otherProperties.operationTitle) {
            subTip = this.requestData.otherProperties.operationTitle
          }
          this.$confirm(`${subTip}`)
            .then((_) => {
              this.loading = true
              // this.timer = setTimeout(() => {
              // 动画关闭需要一定的时间
              setTimeout(() => {
                // if (this.requestData.itemName === '登记被测系统') {
                if (this.specialInstructFlag === true) {
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
                // if (this.requestData.itemName === '登记被测系统') {
                if (this.specialInstructFlag === true) {
                  // 替换掉condition
                  data.queryFilePath = '1'
                  data.condition = this.condition
                  Object.assign(data, this.requestData)
                  // let newData = this.$_.cloneDeep(this.requestData)
                  // delete newData.operationID
                  this.REQMAINDATA = {
                    ...data,
                    // ...newData,
                    condition: encodeURI(this.condition)
                  }
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
                  // if ( this.requestData.operationID === 1 || this.requestData.itemName.indexOf('新增') > -1) {
                  if (this.requestData.operationID === 1) {
                    // 新增
                    data.operationID = '1001'
                    // } else if ( this.requestData.operationID === 50 || this.requestData.itemName.indexOf('修改') > -1) {
                  } else if (this.requestData.operationID === 50) {
                    // 修改
                    data.operationID = '1003'
                    data.operationType = 'update'
                    // } else if ( this.requestData.operationID === 49 || this.requestData.itemName.indexOf('复制') > -1) {
                  } else if (this.requestData.operationID === 49) {
                    // 复制
                    data.operationID = '1001'
                  }

                  // 把所有的值拼接成字符串,以#START开头,以#ENDFLAG结尾,以|分割
                  if (!this.levelFlag) {
                    let formData = ''
                    for (let key in data) {
                      formData += `${key}=${data[key]}|`
                    }
                    data.allResponseFields = `#START${formData}#ENDFLAG`
                  }
                  if (!data.resId && data.objectID) {
                    let resId = data.objectID.split('-')[0]
                    data.resId = resId
                  }
                  this.REQMAINDATA = data
                }
                console.log('$$$$ REQMAINDATA:', this.REQMAINDATA)
                requestMain(this.REQMAINDATA).then((res) => {
                  console.log(res)
                  if (typeof res === 'string' && res === 'statusCode:200') {
                    this.$notify({
                      title: '成功',
                      message: '操作成功!',
                      type: 'success',
                      duration: 2000
                    })
                    this.loading = false
                    this.dialog = false
                    if (this.requestData.itemName === '登记被测系统') {
                      this.$router.push('/被测信息系统')
                    } else {
                      // 刷新
                      this.$emit('refresh')
                    }
                  } else if (typeof res === 'string' && res.indexOf('message=') > -1) {
                    // ModelAndView: reference to view with name 'template/main'; model is {message=错误原因=表记录没有找到|SERVICELOGSSN=202208031017080807980003|, statusCode=300}
                    // 提取错误原因
                    let errorMsg = res.match(/message=(.*?)\|/)[1]
                    this.$message.error(errorMsg)
                    this.loading = false
                  } else {
                    // 处理res.fileMessage
                    let name = res.fileMessage.split('&')[0].split('=')[0]
                    let value = res.fileMessage.split('&')[0].split('=')[1]
                    let typeName = res.fileMessage.split('&')[1].split('=')[0]
                    let typeValue = res.fileMessage.split('&')[1].split('=')[1]

                    this.REQMAINDATA[name] = value
                    this.REQMAINDATA[typeName] = typeValue
                    this.REQMAINDATA.queryOnlyFileData = '1'
                    if (res.statusCode == '666') {
                      // “666”后台返回statusCode为操作后有文件带回，并且下载该文件

                      // value 中最后一个 / 后面的值
                      let fileName = value.split('/')[value.split('/').length - 1]
                      console.log('fileName:', fileName)

                      if (typeValue === 'download') {
                        // data[typeName] = typeValue
                        this.REQMAINDATA[typeName] = 'showFileContent'
                      }
                      requestMain(this.REQMAINDATA).then((res) => {
                        // console.log('下载文件 res:', res)
                        // 处理数据并下载
                        // res数据中文乱码
                        this.downloadFile(res, fileName)
                      })
                    } else if (res.statusCode === '555') {
                      //“555”后台返回statusCode为操作后有文件带回，并且展示该文件内容；弹出dialog层
                      requestMain(this.REQMAINDATA).then((res) => {
                        // console.log('展示文件 res:', res)
                        // 弹出dialog层
                        this.loading = false
                        this.dialog = false
                        this.$refs.showFileContent.show(res, this.REQMAINDATA.itemName)
                        if (this.requestData.itemName === '登记被测系统') {
                          this.$router.push('/被测信息系统')
                        } else {
                          // 刷新
                          // this.$emit('refresh')
                        }
                      })
                    }
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
    },
    // 下载文件
    downloadFile(res, file_Name) {
      let blob = new Blob([res])
      let fileName = file_Name
      let link = document.createElement('a')
      link.href = window.URL.createObjectURL(blob)
      link.download = fileName
      link.click()

      this.loading = false
      this.dialog = false
    }
  }
}
</script>

<style scoped lang="scss">
.drawerBox {
  .demo-drawer__footer {
    // 向右对齐
    text-align: right;
    // 固定在底部
    position: fixed;
    bottom: 10px;
    right: 20px;
    width: 100%;
    // 底部按钮
    .el-button {
      margin-top: 10px;
    }
  }
}

.drawer-container {
  .demo-drawer__content {
    padding: 20px;
  }
  .demo-drawer__footer {
    // 向右对齐
    text-align: right;
    // 固定在底部
    position: fixed;
    bottom: 10px;
    right: 20px;
    width: 100%;
    // 底部按钮
    .el-button {
      margin-top: 10px;
    }
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
::v-deep .el-form .el-col {
  display: flex;
  justify-content: center;
  align-items: center;
}
::v-deep .el-form-item {
  max-width: 290px;
  min-width: 290px;
}
::v-deep .el-input {
  width: 100%;
}
::v-deep .el-input--small .el-input__inner {
  height: 33px !important;
  line-height: 33px !important;
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
::v-deep .el-drawer__body {
  overflow-x: hidden;
  overflow-y: auto;
}
</style>