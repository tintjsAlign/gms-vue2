<template>
  <div class="app-container">
    <v-contextmenu ref="contextmenu">
      <div v-for="(item, index) in recordMenuGrp" :key="index">
        <v-contextmenu-submenu :title="item.itemName" :key="index" v-if="item.resId === 990" @mouseenter="subMouseenter(item)">
          <template #title>
            <span><svg-icon icon-class="wenjian1" /> {{ item.itemName }}</span>
          </template>
          <template v-for="(s, index) in item.children">
            <!-- <Recursion :recordMenuGrp="item.children"></Recursion> -->
            <v-contextmenu-item :key="index" @click="submenuClick(s)">{{ s.itemName }}</v-contextmenu-item>
          </template>
        </v-contextmenu-submenu>
        <v-contextmenu-item :key="index" v-else-if="item.itemId === 'refresh'" @click="refresh()">
          <span><svg-icon icon-class="refresh" /> {{ item.itemName }}</span>
        </v-contextmenu-item>
        <v-contextmenu-item :key="index" v-else @click="submenuClick(item)">
          <span><svg-icon icon-class="shezhi01" /> {{ item.itemName }}</span>
        </v-contextmenu-item>
      </div>
    </v-contextmenu>
  </div>
</template>

<script>
import { requestMain, getMenuLvAfter } from '@/api/main'

export default {
  name: 'Recursion',
  components: {},
  props: {
    recordMenuGrp: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {}
  },
  computed: {},
  watch: {
    recordMenuGrp(newData) {
      this.recordMenuGrp = newData
    }
  },
  created() {},
  mounted() {},
  methods: {
    hide() {
      this.$refs.contextmenu.hide()
    },
    show(topY, leftX, data, node) {
      this.btnRequest = data
      this.node = node
      this.$refs.contextmenu.show({ top: topY, left: leftX })
    },
    subMouseenter(sub) {
      let reqData = {
        tblAlias: sub.tblAlias,
        SYSTEMKEYNAME: window.localStorage.getItem('SYSTEMKEYNAME'),
        SYSTEMTELLERNO: window.localStorage.getItem('SYSTEMTELLERNO')
      }
      getMenuLvAfter(reqData).then((res) => {
        console.log('子菜单res', res)
        // 过滤编辑本视图
        let newSub = res.filter((item) => item.itemName !== '编辑本视图')
        // 将res值赋值给recordMenuGrp对应item.children
        this.recordMenuGrp[this.recordMenuGrp.findIndex((item) => item.tblAlias === sub.tblAlias)].children = newSub

        // 将recordMenuGrp赋值给子菜单
        console.log('recordMenuGrp', this.recordMenuGrp)
      })
    },
    refresh(remove) {
      if (remove && remove === 'remove') {
        this.$emit('refreshNode', this.node, remove)
      } else {
        this.$emit('refreshNode', this.node)
      }
    },
    submenuClick(btn) {
      console.log('btn', btn)
      this.mainEnter(btn)
    },
    mainEnter(btnOri) {
      console.log('mainEnter:', btnOri)
      console.log(btnOri.itemName, 'operationID:', btnOri.operationID, 'resId:', btnOri.resId)
      // 合并this.btnRequest和btn的数据
      // Object.assign(btn, this.btnRequest)
      console.log('this.btnRequest 数据:', this.btnRequest)
      let btn = Object.assign({}, this.btnRequest, btnOri)
      if (this.btnRequest.priKey) {
        btn.condition = btn.condition + '|' + this.btnRequest.priKey
      }
      console.log('mainEnter 数据:', btn)
      // 1 || 2 || 48 || 49 || 50
      let operationIDs = [1, 48, 49, 50]

      if (operationIDs.includes(btn.operationID)) {
        // 打开抽屉-填表单
        if (btn.operationID === 1) {
          let name = `INPUTVAROF${btn.INNODEID}`
          let newInputvarof = ''
          let inputvarofs = btn.INPUTVAROF.split(';')
          inputvarofs = inputvarofs.filter((item) => item !== '')
          console.log('inputvarofs', inputvarofs)
          inputvarofs.forEach((item) => {
            if (item.indexOf('=') === -1) {
              newInputvarof = newInputvarof + item + '=' + btn[item] + ';'
            } else {
              if (btn[item.split('=')[1]]) {
                newInputvarof = newInputvarof + item.split('=')[0] + '=' + btn[item.split('=')[1]] + ';'
              } else {
                newInputvarof = newInputvarof + item + ';'
              }
            }
          })
          console.log('newInputvarof', newInputvarof)
          // ;改为|
          let endCondition = newInputvarof.replace(/;/g, '|')
          btn[name] = newInputvarof
          btn.condition = btn.condition + '|' + endCondition
        }
        this.$emit('openDrawer', btn, this.node)
      } else if (btn.operationID === 51) {
        // 查询所有数据,重新渲染表格
        // this.$emit('queryAllData', btn)
        this.queryAllData(btn)
      } else if (btn.operationID === 135 && btn.resId === 587) {
        // 打开报表
        // 合并this.btnRequest和btn的数据
        // Object.assign(btn, this.btnRequest)
        this.$emit('openReport', btn)
        // this.openIframeManage(btn)
      } else if (btn.operationID === 203) {
        // 下载文件
        btn.queryFilePath = '1'
        this.mainEnterConfirm(btn)
      } else if (btn.operationID === 204) {
        // 上传文件
        this.$emit('uploadFile', btn)
        // this.$emit('uploadFile', btnOri)
      } else if (btn.operationID === 16) {
        // 管理树界面
        this.openTreeManage(btn)
      } else {
        console.log('其它按钮功能')

        if (btn.otherProperties.urlParam) {
          // 判断urlParam字符串中是否有=append.
          if (btn.otherProperties.urlParam.indexOf('=append.') > -1) {
            // 若有, 打开抽屉-填表单
            this.$emit('openDrawer', btn, this.node)
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
      // this.reqLoading = this.$loading({
      //   lock: true,
      //   text: '请求中,请稍后···',
      //   target: '.app-main'
      // })

      let data = {
        SYSTEMKEYNAME: window.localStorage.getItem('SYSTEMKEYNAME'),
        SYSTEMTELLERNO: window.localStorage.getItem('SYSTEMTELLERNO')
      }
      Object.assign(data, row)

      if (data.priKey) {
        let priKey = data.priKey.split('|').filter((i) => i !== '')
        console.log('priKey:', priKey)
        priKey.forEach((item) => {
          let key = item.split('=')[0]
          let value = item.slice(item.indexOf('=') + 1)
          if (data[key]) {
            data[key] = value
          }
        })
      }
      requestMain(data).then((res) => {
        console.log('按钮通用请求 res:', res)
        if (typeof res === 'string' && res === 'statusCode:200') {
          this.$notify({
            title: '成功',
            message: '操作成功!',
            offset: 50,
            type: 'success'
          })
          // 刷新
          // this.$emit('refreshNode')
          if (data.operationID === 2) {
            // 删除操作,刷新父节点
            this.refresh('remove')
          } else {
            this.refresh()
          }
        } else if (typeof res === 'string' && res.indexOf('错误原因') > -1) {
          // ModelAndView: reference to view with name 'template/main'; model is {message=错误原因=表记录没有找到|SERVICELOGSSN=202208031017080807980003|, statusCode=300}
          // 提取错误原因
          let errorMsg = res.match(/错误原因=(.*?)\|/)[1]
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
              console.log('展示文件 res:', res)
              // 弹出dialog层
              let name = data.itemName
              let type = 'tree'
              this.$emit('fileContentShow', res, name, type)
            })
          }
        }
        // this.reqLoading.close()
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
    },
    openTreeManage(row) {
      // 打开树管理界面
      const { fullPath } = this.$route
      this.$router.replace({
        path: '/redirect' + fullPath,
        query: {
          row: row
        }
      })
    },
    openIframeManage(row) {
      // 打开树管理界面
      // const { fullPath } = this.$route
      // this.$router.replace({
      //   path: '/redirect' + fullPath,
      //   query: {
      //     row: row
      //   }
      // })
      this.$router.push({
        path: `/iframe`,
        query: {
          row: row
        }
      })
    },
    queryAllData(btn) {
      console.log('查询所有,', btn)
      // keyName--  ''+tableName
      let conofName = 'CONOF' + btn.tableName
      let inputvarofName = 'INPUTVAROF' + btn.tableName

      let conof = ''
      if (btn.CONOF) {
        let conofValue = this.synthesisString(btn.CONOF, btn)
        conof = `${conofName}=${conofValue}|`
      }
      let inputvarof = ''
      if (btn.INPUTVAROF) {
        let inputvarofValue = this.synthesisString(btn.INPUTVAROF, btn)
        inputvarof = `${inputvarofName}=${inputvarofValue}|`
      }

      // condition
      let url = this.btnRequest.otherProperties.urlParam
      let urlParam = url.split('&')
      console.log('urlParam:', urlParam)
      // 获取condition
      let conditionOriginal
      urlParam.forEach((element) => {
        if (element.indexOf('condition=') > -1) {
          conditionOriginal = element.replace('condition=', '')
        }
      })
      console.log('conditionOriginal:', conditionOriginal)
      let condition1 = conditionOriginal.split(',')
      let conditionNext = ''
      condition1.forEach((e) => {
        if (e.indexOf('=this.') > -1) {
          let key = e.split('=this.')[0]
          let value = e.split('=this.')[1]
          conditionNext += key + '=' + btn[value] + '|'
        } else {
          let key = e.split('=')[0]
          if (key === 'NODEID') {
            conditionNext += key + '=' + btn.tableName + '|'
          } else {
            conditionNext += e + '|'
          }
        }
      })
      console.log('conditionNext:', conditionNext)

      let btnData = this.$_.cloneDeep(btn)
      delete btnData.CONOF

      let conofType
      for (const key in btnData) {
        if (key.match(/CONOF/g)) {
          conofType = key + '=' + btnData[key]
        }
      }
      console.log('conofType:', conofType)

      // let condition = `${conditionNext}${conofType}|${conof}${inputvarof}`
      let condition = `${conditionNext}${conofType}|${inputvarof}`

      btnData.condition = condition

      // this.$router.push({
      //   path: `/main`,
      //   query: {
      //     meta: btnData
      //   }
      // })
      this.$emit('queryAllData', btnData)
    },
    synthesisString(origin, data) {
      let oriArr = origin.split(';').filter((i) => i !== '')
      let stringStrand = ''
      oriArr.forEach((item) => {
        if (item.indexOf('=') === -1) {
          stringStrand += item + '=' + data[item] + ';'
        } else {
          let key = item.split('=')[1]
          let key0 = item.split('=')[0]
          if (data[key]) {
            stringStrand += key0 + '=' + data[key] + ';'
          } else {
            stringStrand += item + ';'
          }
        }
      })
      return stringStrand
    }
  }
}
</script>

<style scoped lang="less"></style>