<template>
  <div class="button-container">
    <el-row :gutter="10" type="flex">
      <el-col v-for="(item, index) in btnLists" :key="index">
        <el-dropdown trigger="click" v-if="item.resId === 990" @command="batchMainEnter" placement="bottom">
          <el-button :type="!typeChange ? 'primary' : 'success'" @click="getDropdownBtn(item)" plain size="small">
            {{ item.itemName }}<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown" v-if="dropdownBtnList">
            <el-dropdown-item v-for="(btn, i) in dropdownBtnList" :key="i" :command="btn">{{ btn.itemName }}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-button
          :type="!typeChange ? 'primary' : 'success'"
          plain
          size="small"
          @click="batchMainEnter(item)"
          v-if="item.resId !== 990 && !batchFlag"
          >{{ item.itemName }}</el-button
        >
      </el-col>
    </el-row>

    <show-file-content ref="showFileContent"></show-file-content>
    <upload-file ref="uploadFile"></upload-file>
  </div>
</template>

<script>
import { requestMain, getRecordMenuGrp, getMenuLvAfter } from '@/api/main'

import showFileContent from '@/components/ShowFileContent'
import uploadFile from '@/components/UploadFile'
export default {
  name: '',
  components: {
    showFileContent,
    uploadFile
  },
  props: {
    requestData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      btnLists: [],
      dropdownBtnList: [],
      typeChange: false,
      batchFlag: false
    }
  },
  computed: {
    operationTarget() {
      return this.$store.state.settings.operationTarget
    }
  },
  watch: {},
  created() {
    this.init()
  },
  mounted() {},
  methods: {
    init() {
      console.log('requestData:', this.requestData)
      this.btnLists = []
      this.queryPermanentButtonList()
    },
    // 查询常驻按钮列表
    queryPermanentButtonList() {
      let requestMainData = {
        operationID: this.requestData.operationID,
        resId: this.requestData.resId,
        rel: this.requestData.itemName,
        tblAlias: this.requestData.tblAlias,
        // isOperatorSingleRec: '0',
        SYSTEMKEYNAME: window.localStorage.getItem('SYSTEMKEYNAME'),
        SYSTEMTELLERNO: window.localStorage.getItem('SYSTEMTELLERNO'),
        isBtn: '1'
      }
      requestMain(requestMainData).then((res) => {
        console.log('requestMain Btn:', res)
        // 剔除'编辑本视图'按钮
        let btnLists = res.filter((item) => {
          return item.itemName !== '编辑本视图'
        })
        // 对比数组中的对象进行去重
        var a = {}
        btnLists.map((item) => {
          a[Object.values(item).sort() + ''] ? null : (a[Object.values(item).sort() + ''] = item)
        })
        a = Object.values(a)
        // this.mainBtnLists = [...new Set(btnLists)]
        this.mainBtnLists = a
        this.btnLists = this.mainBtnLists
        console.log('去重后this.btnLists:', this.btnLists)

        this.querySelectItemButtonList()
      })
    },
    // 查询选择记录按钮列表
    querySelectItemButtonList() {
      let requestMainData = {
        tblAlias: this.requestData.tblAlias,
        SYSTEMKEYNAME: window.localStorage.getItem('SYSTEMKEYNAME'),
        SYSTEMTELLERNO: window.localStorage.getItem('SYSTEMTELLERNO')
      }
      getRecordMenuGrp(requestMainData).then((res) => {
        console.log('getRecordMenuGrp Btn:', res)
        // 单独拎出'记录管理'按钮, 其它合并为一份,并且去重
        let operationBtn = res.filter((item) => {
          return item.itemName === '记录管理'
        })
        this.operationBtn = operationBtn[0]
        console.log('operationBtn:', this.operationBtn)
        // 通过this.operationBtn查询通用操作按钮列表
        this.queryCommonButtonList(this.operationBtn)

        let btnLists = res.filter((item) => {
          return item.itemName !== '记录管理'
        })
        this.recordMenuGrp = [...new Set(btnLists)]
        console.log('选择记录按钮组recordMenuGrp:', this.recordMenuGrp)
      })
    },
    queryCommonButtonList(condition) {
      let requestMainData = {
        resId: condition.resId,
        operationID: condition.operationID,
        tblAlias: condition.tblAlias,
        SYSTEMKEYNAME: window.localStorage.getItem('SYSTEMKEYNAME'),
        SYSTEMTELLERNO: window.localStorage.getItem('SYSTEMTELLERNO'),
        isBtn: '1'
      }
      requestMain(requestMainData).then((res) => {
        console.log('记录操作 Btn:', res)
        // 传回给父组件
        this.$emit('getRecordBtn', res)
      })
    },
    replaceButtonGroup(flag) {
      if (flag) {
        // console.log('以选中,替换按钮组')
        // 改变按钮颜色
        this.typeChange = true
        if (flag && flag.length > 1) {
          this.batchFlag = true
        }
        this.btnLists = [...new Set(this.recordMenuGrp)]
      } else {
        this.batchFlag = false
        // console.log('取消选中,替换按钮组')
        this.$emit('replaceButtonGroup')
        this.typeChange = false
        this.btnLists = [...new Set(this.mainBtnLists)]
      }
      this.currentRow = flag
      console.log('currentRow::', this.currentRow)
    },
    batchMainEnter(btn) {
      if (this.currentRow && this.currentRow.length > 1) {
        console.log('批量操作')
        // 多记录操作
        this.currentRow.forEach((item) => {
          this.currentRowData = item
          this.mainEnter(btn)
        })
      } else {
        this.currentRowData = this.currentRow
        this.mainEnter(btn)
      }
    },
    mainEnter(btn) {
      console.log('mainEnter:', btn)
      console.log(btn.itemName, 'operationID:', btn.operationID, 'resId:', btn.resId)
      // 合并this.currentRow和btn的数据

      Object.assign(btn, this.currentRowData)
      console.log('mainEnter合并后:', btn)
      // 判断按钮功能
      // 1 || 2 || 48 || 49 || 50
      let operationIDs = [1, 48, 49, 50]

      if (operationIDs.includes(btn.operationID)) {
        // 打开抽屉-填表单
        this.$emit('openDrawer', btn)
      } else if (btn.operationID === 51) {
        // 查询所有数据,重新渲染表格
        this.$emit('queryAllData', btn)
      } else if (btn.operationID === 135 && btn.resId === 587) {
        // 打开报表
        // this.$emit('openReport', btn)
        this.openIframeManage(btn)
      } else if (btn.operationID === 203) {
        // 下载文件
        btn.queryFilePath = '1'
        this.mainEnterConfirm(btn)
      } else if (btn.operationID === 204) {
        // 上传文件
        this.uploadFile(btn)
      } else if (btn.operationID === 16) {
        // 管理树界面
        this.openTreeManage(btn)
      } else {
        console.log('其它按钮功能')

        if (btn.otherProperties.urlParam) {
          // 判断urlParam字符串中是否有=append.
          if (btn.otherProperties.urlParam.indexOf('=append.') > -1) {
            // 若有, 打开抽屉-填表单
            this.$emit('openDrawer', btn)
            return
          }
        }
        // 其它普通操作
        if (btn.isNeedConfirm === '1') {
          // 判断是否需要确认
          this.$confirm(btn.otherProperties.operationTitle, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.mainEnterConfirm(btn)
          })
        } else {
          this.mainEnterConfirm(btn)
        }
      }
    },
    // 需要确定的按钮事件 forwardUrl:跳转页面,isNeedConfirm:是否需要确认,operationTitle:提示信息,operationID:操作ID,resId:资源ID,tblAlias:表别名,SYSTEMKEYNAME:系统秘钥名,SYSTEMTELLERNO:系统柜员号,isBtn:是否按钮
    mainEnterConfirm(row) {
      let data = {
        SYSTEMKEYNAME: window.localStorage.getItem('SYSTEMKEYNAME'),
        SYSTEMTELLERNO: window.localStorage.getItem('SYSTEMTELLERNO')
      }
      Object.assign(data, row)
      requestMain(data).then((res) => {
        console.log('按钮通用请求 res:', res)
        if (typeof res === 'string' && res === 'statusCode:200') {
          this.$notify({
            title: '成功',
            message: '操作成功!',
            type: 'success'
          })
          // 刷新
          this.$emit('refresh')
        } else if (typeof res === 'string' && res.indexOf('message=') > -1) {
          // ModelAndView: reference to view with name 'template/main'; model is {message=错误原因=表记录没有找到|SERVICELOGSSN=202208031017080807980003|, statusCode=300}
          // 提取错误原因
          let errorMsg = res.match(/message=(.*?)\|/)[1]
          this.$message.error(errorMsg)
        } else {
          // 处理res.fileMessage
          let name = res.fileMessage.split('&')[0].split('=')[0]
          let value = res.fileMessage.split('&')[0].split('=')[1]
          let typeName = res.fileMessage.split('&')[1].split('=')[0]
          let typeValue = res.fileMessage.split('&')[1].split('=')[1]

          data[name] = value
          data[typeName] = typeValue
          data.queryOnlyFileData = '1'
          if (res.statusCode == '666') {
            // “666”后台返回statusCode为操作后有文件带回，并且下载该文件

            // value 中最后一个 / 后面的值
            let fileName = value.split('/')[value.split('/').length - 1]
            console.log('fileName:', fileName)

            if (typeValue === 'download') {
              // data[typeName] = typeValue
              data[typeName] = 'showFileContent'
            }
            requestMain(data).then((res) => {
              // console.log('下载文件 res:', res)
              // 处理数据并下载
              // res数据中文乱码
              this.downloadFile(res, fileName)
            })
          } else if (res.statusCode === '555') {
            //“555”后台返回statusCode为操作后有文件带回，并且展示该文件内容；弹出dialog层
            requestMain(data).then((res) => {
              // console.log('展示文件 res:', res)
              // 弹出dialog层
              this.$refs.showFileContent.show(res, data.itemName)
            })
          }
        }
      })
    },
    openTreeManage(row) {
      // 打开树管理界面
      this.$router.push({
        path: `/tree`,
        query: {
          row: row
        }
      })
      // this.$refs.treeManage.show(row)
    },
    openIframeManage(row) {
      // 打开树管理界面
      this.$router.push({
        path: `/iframe`,
        query: {
          row: row
        }
      })
      // this.$refs.treeManage.show(row)
    },
    // 上传文件
    uploadFile(row) {
      // 弹出dialog
      this.$refs.uploadFile.show(row)
    },
    // 下载文件
    downloadFile(res, file_Name) {
      let blob = new Blob([res])
      let fileName = file_Name
      let link = document.createElement('a')
      link.href = window.URL.createObjectURL(blob)
      link.download = fileName
      link.click()
    },
    getDropdownBtn(item) {
      this.dropdownBtnList = []
      let data = {
        SYSTEMKEYNAME: window.localStorage.getItem('SYSTEMKEYNAME'),
        SYSTEMTELLERNO: window.localStorage.getItem('SYSTEMTELLERNO'),
        tblAlias: item.tblAlias
      }
      getMenuLvAfter(data).then((res) => {
        console.log('getMenuLvAfter:', res)
        if (this.currentRow.length && this.currentRow.length > 1) {
          console.log('支持批处理的选项')
          // 只显示支持批量操作的  isOperatorSingleRec !== '1'
          this.dropdownBtnList = res.filter((item) => {
            return item.isOperatorSingleRec !== '1' && item.itemName !== '编辑本视图'
          })
        } else {
          this.dropdownBtnList = res.filter((item) => {
            return item.itemName !== '编辑本视图'
          })
        }
      })
    }
  }
}
</script>
isNeedConfirm

<style scoped lang="scss"></style>