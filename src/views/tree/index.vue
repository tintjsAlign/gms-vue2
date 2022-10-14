<template>
  <div class="tree-container">
    <el-page-header @back="goBack" title="" :content="title"> </el-page-header>
    <!-- <el-dialog
      :visible.sync="dialogVisible"
      width="100%"
      :modal-append-to-body="false"
      :modal="false"
      top="0"
      fullscreen
      destroy-on-close
      :before-close="handleClose"
    > -->
    <split-pane split="vertical" @resize="resize" :min-percent="20" :max-percent="50" :default-percent="30">
      <template slot="paneL">
        <div class="left-container">
          <el-tree
            ref="elTree"
            id="el-tree"
            :props="defaultProps"
            lazy
            :load="loadNode"
            :default-expanded-keys="expandedKeys"
            highlight-current
            node-key="id"
            @node-click="nodeClick"
            @node-contextmenu="nodeContextmenu"
          >
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <svg-icon v-if="data.childNum === 0" icon-class="file" />
              <svg-icon v-else-if="node.expanded" icon-class="floder_open" />
              <svg-icon v-else icon-class="floder" />
              <span class="fontSize14" :title="node.label || '-'">{{ ' ' + node.label }}</span>
            </span>
          </el-tree>
          <recursion-contextmenu
            ref="contextmenu"
            :recordMenuGrp="recordMenuGrp"
            @openDrawer="openDrawer"
            @openReport="openReport"
            @queryAllData="queryAllData"
            @refreshNode="refreshNode"
            @uploadFile="uploadFile"
            @fileContentShow="fileContentShow"
          ></recursion-contextmenu>
          <!-- <v-contextmenu ref="contextmenu" @show="contextmenuShow">
            <template v-for="(item, index) in recordMenuGrp">
              <v-contextmenu-submenu :title="item.itemName" :key="index" v-if="item.resId === 990">
                <v-contextmenu-item>子菜单1</v-contextmenu-item>
              </v-contextmenu-submenu>
              <v-contextmenu-item :key="index" v-else>{{ item.itemName }}</v-contextmenu-item>
            </template>
          </v-contextmenu> -->

          <!-- <VueContextMenu
            class="right-menu"
            :target="contextMenuTarget"
            :show="contextMenuVisible"
            @update:show="(show) => (contextMenuVisible = show)"
          >
            <el-cascader-panel :props="cascaderProps"></el-cascader-panel>
          </VueContextMenu> -->
        </div>
      </template>
      <template slot="paneR">
        <div class="right-container">
          <!-- <v-contextmenu ref="contextmenu">
          <v-contextmenu-item v-for="(item,index) in recordMenuGrp" :key="index">{{item.itemName}}</v-contextmenu-item>
          <v-contextmenu-submenu title="菜单3">
            <v-contextmenu-item>子菜单1</v-contextmenu-item>
            <v-contextmenu-item>子菜单2</v-contextmenu-item>
          </v-contextmenu-submenu>
        </v-contextmenu>

        <div v-contextmenu:contextmenu>右键点击此区域</div> -->
          <dynamic-drawer ref="drawer" @refresh="refresh" @refreshNode="refreshNode" @getDrawerForm="getDrawerForm"></dynamic-drawer>
          <dynamic-drawer-parallel
            ref="drawerParallel"
            @refresh="refresh"
            @refreshNode="refreshNode"
            @getDrawerForm="getDrawerForm"
          ></dynamic-drawer-parallel>
        </div>
      </template>
    </split-pane>
    <!-- </el-dialog> -->
    <show-file-content ref="showFileContent"></show-file-content>
    <upload-file ref="uploadFile"></upload-file>
    <app-iframe ref="iframe"></app-iframe>
    <drawer-main ref="appMain"></drawer-main>
  </div>
</template>

<script>
// 直接在组件中引入使用
import { component as VueContextMenu } from '@xunlei/vue-context-menu'
import splitPane from 'vue-splitpane'

import { requestMain, getTreeMenu, getRecordMenuGrp, getMenuLvAfter } from '@/api/main'

import dynamicDrawer from '@/components/DynamicDrawer/index.vue'
import dynamicDrawerParallel from '@/components/DynamicDrawer/index-parallel.vue'
import RecursionContextmenu from '@/components/RecursionContextmenu/index.vue'
import showFileContent from '@/components/ShowFileContent'
import uploadFile from '@/components/UploadFile'
import appIframe from '@/views/iframe/index-dialog.vue'
import drawerMain from '@/views/main/drawer/index.vue'

export default {
  name: 'treeContainer',
  components: {
    VueContextMenu,
    splitPane,
    dynamicDrawer,
    dynamicDrawerParallel,
    RecursionContextmenu,
    showFileContent,
    uploadFile,
    appIframe,
    drawerMain
  },
  props: {},
  data() {
    return {
      dialogVisible: false,
      treeData: [],
      contextMenuTarget: null,
      contextMenuVisible: false,
      defaultProps: {
        children: 'children',
        label: 'label',
        isLeaf: 'leaf'
      },
      options: [],
      recordMenuGrp: [],
      expandedKeys: [],
      fileFlag: false
    }
  },
  computed: {
    // cascaderProps() {
    //   return {
    //     lazy: true,
    //     lazyLoad: this.lazyLoad,
    //     expandTrigger: 'hover'
    //   }
    // }
  },
  watch: {},
  created() {
    // 获取路由的参数
    this.routeRow = this.$route.query.row
    console.log('routeRow:', this.routeRow)
    this.title = this.routeRow.itemName
    let pre = this.routeRow.condition
    // 剔除掉routeRow的condition属性放到新
    this.routeRowNO = this.$_.cloneDeep(this.routeRow)
    this.$_.omit(this.routeRowNO, 'condition')
    console.log('routeRowNO:', this.routeRowNO)
    // 去掉(NODEID=定级对象,displayRecInfo=0,CHILDCMDID=1)重新拼接
    let preCondition = pre.split(',')
    let newPreCondition = []
    for (let i = 0; i < preCondition.length; i++) {
      if (
        preCondition[i].indexOf('NODEID') === -1 &&
        preCondition[i].indexOf('displayRecInfo') === -1 &&
        preCondition[i].indexOf('CHILDCMDID') === -1
      ) {
        newPreCondition.push(preCondition[i])
      }
    }
    this.preCondition = newPreCondition.join(',')
    console.log('preCondition:', this.preCondition)
    // this.requestTree(this.routeRow)
  },
  mounted() {
    this.$nextTick(() => {
      // vue-context-menu 需要传入一个触发右键事件的元素，等页面 dom 渲染完毕后才可获取
      this.contextMenuTarget = document.querySelector('#el-tree')
      // 获取所有的 treeitem，循环监听右键事件
      const tree = document.querySelectorAll('#el-tree [role="treeitem"]')
      tree.forEach((i) => {
        i.addEventListener('contextmenu', (event) => {
          // 如果右键了，则模拟点击这个treeitem
          event.target.click()
        })
      })

      let mainHeight = document.querySelector('.app-main').offsetHeight - 100
      console.log('mainHeight高度:', mainHeight)
      // console.log(this.$refs.treeContainer)
      // this.$refs.treeContainer.$el.clientHeight = mainHeight + 'px'
      document.querySelector('.splitter-pane-resizer.vertical').style.height = mainHeight + 'px'
      document.querySelector('.splitter-pane.vertical.splitter-paneL').style.height = mainHeight + 'px'
      document.querySelector('.splitter-pane.vertical.splitter-paneR').style.height = mainHeight + 'px'
      document.querySelector('.splitter-pane.vertical.splitter-paneL').style.overflow = 'auto'
      document.querySelector('.splitter-pane.vertical.splitter-paneR').style.overflow = 'auto'
    })
  },
  methods: {
    resize() {
      console.log('resize')
    },
    goBack() {
      this.$router.go(-1)
    },
    loadNode(node, resolve) {
      //如果展开第一级节点，从后台加载一级节点列表
      if (node.level == 0) {
        this.loadFirstNode(node, resolve)
      }
      //如果展开其他级节点，动态从后台加载下一级节点列表
      if (node.level >= 1) {
        this.loadchildNode(node, resolve)
      }
    },
    //加载第一级节点
    async loadFirstNode(node, resolve) {
      let data = {
        SYSTEMKEYNAME: window.sessionStorage.getItem('SYSTEMKEYNAME'),
        SYSTEMTELLERNO: window.sessionStorage.getItem('SYSTEMTELLERNO')
      }
      Object.assign(data, this.routeRow)
      const res = await getTreeMenu(data)
      console.log('第一级节点res:', res)
      let list = res.records
      this.NODEID = res.tableName
      this.conofName = 'CONOF' + res.tableName
      // 将res的不为空和不是condition的键值 用'|'拼接字符串
      // for (let i in res) {
      //   if (res[i] && i !== 'CONOF' && i !== 'records' && i !== 'INPUTVAROF') {
      //     this.endCondition += '|' + `${i}=${res[i]}`
      //   }
      // }
      let rowCondition = ''
      let preCondition = this.preCondition.split(',').filter((i) => i !== '')
      preCondition.forEach((item) => {
        if (item.indexOf('=this.') > -1){
          let key = item.split('=this.')[0]
          let value = item.split('=this.')[1]
          rowCondition += key + '=' + this.routeRow[value] + '|'
        }else {
          rowCondition += item + '|'
        }
      })
      // 把this.preCondition(string)中的全部逗号换成|
      // this.rowCondition = this.preCondition.replace(/,/g, '|')
      // // 截取取出DISPLAYFIRSTNODE后面的值(包括DISPLAYFIRSTNODE)
      // let displayFirstNode = this.rowCondition.substring(this.rowCondition.indexOf('DISPLAYFIRSTNODE'))
      // this.rowCondition = displayFirstNode
      this.rowCondition = rowCondition
      console.log('rowCondition:', this.rowCondition)
      // 处理res.CONOF 或 INPUTVAROF
      let conof
      if (res.CONOF) {
        conof = res.CONOF.split(';')
        console.log('conof1:', conof)
        // 某一项没有'=',则添加'='
        let conofNew = []
        conof.forEach((i) => {
          if (i && i.indexOf('=') === -1) {
            i = i + '=' + i
          }
          conofNew.push(i)
        })
        this.conof = conofNew.join(';')
        console.log('conof:', this.conof)
      } else {
        this.conof = ''
      }

      // 每一项list加上label: list.display
      if (list.length > 0) {
        list.forEach((i) => {
          i.label = i.display
          i.leaf = false
          i.tblAlias = res.VIEWDEF
          i[this.conofName] = this.conof
          i.fatherCondition = { ...res, node, resolve }
        })
        if (res.tableName === 'fileLibrary') {
          this.fileFlag = true
          let treeList = [
            {
              label: res.display,
              leaf: false,
              tableName: res.tableName,
              children: list
            }
          ]
          this.expandedKeys.push(1)
          this.treeData = treeList
        } else {
          this.treeData = list
        }
      } else {
        list = [
          {
            label: res.display ? res.display : '',
            leaf: true // 不走第二级节点
          }
        ]

        this.treeData = list
      }

      console.log('树treeData:', this.treeData)
      return resolve(this.treeData)
    },
    //加载节点的子节点集合
    async loadchildNode(node, resolve) {
      console.log('超过二级的', node)
      if (node.data.children) return resolve(node.data.children)

      // 文件格式处理
      let tableName = ['fileLibrary', 'fileBakLibrary']
      if (tableName.includes(node.data.tableName) || tableName.includes(node.data.fatherCondition.tableName)) {
        // if (node.data.fatherCondition.tableName === 'fileLibrary') {
        // 处理condition
        let condition1 = this.routeRow.condition
        let conditionArr = condition1.split(',').filter((i) => i !== '')
        console.log('文档 condition1:', condition1)
        console.log('文档 conditionArr:', conditionArr)
        let condition2 = []
        let endCondition = ''
        let topCondition = ''
        let strEndCondition = ''
        conditionArr.forEach((i) => {
          if (i.indexOf('=this.') > -1) {
            let i0 = i.split('=this.')[0]
            let i1 = i.split('=this.')[1]
            let value = this.routeRow[i1]
            condition2.push({
              [i0]: value
            })
          }
          // else if (i.indexOf('=') > -1) {
          //   i.split('=')[0] = i.split('=')[1]
          // }
          else {
            if (i.indexOf('resID') > -1) {
              this.fileResID = i.split('=')[1]
            }
            // CHILDCMDID需要动态获取,不拼接
            if (i.indexOf('CHILDCMDID') === -1) {
              // 其它的直接用'|'拼接成字符串
              if (node.data.childNum === 0) {
                endCondition += '|' + i
              } else {
                if (i.indexOf('INPUTVAROFfileBakLibrary=') > -1) {
                  let str = i.split('INPUTVAROFfileBakLibrary=')[1]
                  let strArr = str.split(';').filter((i) => i !== '')
                  strArr.forEach((s) => {
                    if (s.indexOf('=') === -1) {
                      let value = node.data[s] ? node.data[s] : node.data.fatherCondition[s]
                      strEndCondition += s + '=' + value + ';'
                    } else {
                      strEndCondition += s + ';'
                    }
                  })
                  strEndCondition = '|INPUTVAROFfileBakLibrary=' + strEndCondition
                } else {
                  endCondition += '|' + i
                }
              }
            }

            if (i.indexOf('tableList') > -1 || i.indexOf('displayRecInfo') > -1) {
              topCondition += ',' + i
            }
          }
        })
        // condition2每一项键值用'|'拼接成字符串
        let condition3 = ''
        condition2.forEach((i) => {
          for (let j in i) {
            condition3 += '|' + `${j}=${i[j]}`
          }
        })
        endCondition = condition3 + endCondition + strEndCondition

        console.log('文档 condition3:', condition3)
        console.log('文档 endCondition:', endCondition)

        let CHILDCMDID
        if (node.data.childNum === 0) {
          CHILDCMDID = 2
        } else {
          CHILDCMDID = 1
        }
        let nodeName = ''
        if (node.data.tableName) {
          nodeName = node.data.tableName
        } else {
          nodeName = node.data.fatherCondition.tableName
        }
        topCondition = topCondition + ',' + `NODEID=${nodeName},CHILDCMDID=${CHILDCMDID}`
        console.log('文档 topCondition:', topCondition)
        let priKey = node.data.priKey ? node.data.priKey : node.data.fatherCondition.priKey
        let fileCondition = `${topCondition}${endCondition}|${priKey}`
        console.log('fileCondition:', fileCondition)
        // 文件处理
        // let resId = ''
        // if (this.fileResID) {
        //   resId = this.fileResID
        // } else {
        //   if (node.data.resID) {resId = node.data.resID}
        //   if (node.data.fatherCondition.resID) {resId = node.data.fatherCondition.resID}
        // }
        let fileData = {
          SYSTEMKEYNAME: window.sessionStorage.getItem('SYSTEMKEYNAME'),
          SYSTEMTELLERNO: window.sessionStorage.getItem('SYSTEMTELLERNO'),
          objectID: node.data.objectID,
          condition: fileCondition,
          operationID: this.routeRow.operationID,
          docFileName: node.data.docFileName,
          // resId: resId
          resId: 3002
        }
        console.log('文档 fileData:', fileData)
        const res = await getTreeMenu(fileData, 'unshow')
        console.log('超过二级的fileLibrary:', res)
        let list = res.records
        if (list.length > 0) {
          list.forEach((i) => {
            i.label = i.display
            i.leaf = false
            i.tblAlias = res.VIEWDEF
            i.fatherCondition = { ...res, node, resolve }
          })
          this.treeData = list
        } else {
          list = [
            // {
            //   // label: res.display ? res.display : '',
            //   label: '',
            //   leaf: true // 不走第二级节点
            // }
          ]

          this.treeData = list
        }
        console.log('树treeData:', this.treeData)
        return resolve(this.treeData)
      }

      this.resMap = node.data.fatherCondition
      this.priKey = node.data.fatherCondition.priKey
      this.listMap = node.data
      if (node.data.tableName) {
        this.NODEID = node.data.tableName
      }
      if (!this.priKey) {
        this.priKey = node.data.priKey
      }

      if (this.resMap) {
        let inputvarof, conofTM
        if (node.data.childNum === 0) {
          console.log('有子节点', this.resMap)
          this.deepMap = this.resMap

          if (this.resMap.INPUTVAROF) {
            inputvarof = this.resMap.INPUTVAROF.split(';')
            // 去掉空的
            inputvarof = inputvarof.filter((i) => {
              return i !== ''
            })
            this.inputvarofName = 'INPUTVAROF' + this.resMap.tableName
            this.isInputvarof = true
          } else {
            this.inputvarofName = ''
            this.isInputvarof = false
          }

          if (this.resMap.CONOF) {
            conofTM = this.resMap.CONOF.split(';')
            // 去掉空的
            conofTM = conofTM.filter((i) => {
              return i !== ''
            })
            this.conofTMName = 'CONOF' + this.resMap.tableName
            this.isConof = true
          } else {
            this.isConof = false
          }
        } else {
          console.log('没有子节点', this.listMap)
          this.deepMap = this.listMap

          if (node.data.INPUTVAROF) {
            inputvarof = node.data.INPUTVAROF.split(';')
            // 去掉空的
            inputvarof = inputvarof.filter((i) => {
              return i !== ''
            })
            this.inputvarofName = 'INPUTVAROF' + node.data.tableName
            this.isInputvarof = true
          } else {
            this.inputvarofName = ''
            this.isInputvarof = false
          }

          if (node.data.CONOF) {
            conofTM = node.data.CONOF.split(';')
            conofTM = conofTM.filter((i) => {
              return i !== ''
            })
            this.conofTMName = 'CONOF' + node.data.tableName
            this.isConof = true
          } else {
            this.conofTMName = ''
            this.isConof = false
          }
          // conof = node.data.CONOF.split(';')
          // this.conofName = 'CONOF' + node.data.tableName
        }
        // 将res的不为空和不是condition的键值 用'|'拼接字符串
        this.endCondition = ''

        for (let i in this.deepMap) {
          // if (this.deepMap[i] && i !== 'CONOF' && i !== 'records' && i !== 'INPUTVAROF' && i !== 'priKey') {
          // 判断是否全部大写
          if (i === i.toUpperCase() && i !== 'CONOF' && i !== 'INPUTVAROF') {
            this.endCondition += `${i}=${this.deepMap[i]}` + '|'
          }
        }
        console.log('endCondition:', this.endCondition)

        let priKeyLists = this.priKey.split('|')
        priKeyLists = priKeyLists.filter((i) => {
          return i !== ''
        })
        let priKeyList = {}
        priKeyLists.forEach((i) => {
          let key, value
          if (i && i.indexOf('=') !== -1) {
            // 键值对 i.split('=')[0] = i.split('=')[1]
            key = i.split('=')[0]
            value = i.split('=')[1]
            priKeyList[key] = value
          }
        })
        console.log('priKeyList:', priKeyList)

        if (this.isInputvarof) {
          // 处理INPUTVAROF
          console.log('inputvarof:', inputvarof)
          // 某一项没有'=',则添加'='
          // let inputvarofNew = []
          // inputvarof.forEach((i) => {
          //   if (i && i.indexOf('=') === -1) {
          //     // 取this.resMap键相同的值
          //     if (this.resMap[i]) {
          //       i = i + '=' + this.resMap[i]
          //     } else {
          //       i = i + '=' + this.listMap[i]
          //     }
          //   }
          //   inputvarofNew.push(i)
          // })

          let inputvarofNew = []
          inputvarof.forEach((i) => {
            if (i && i.indexOf('=') !== -1) {
              i = i.split('=')[0] + '=' + i.split('=')[1]
            } else {
              if (this.resMap[i]) {
                i = i + '=' + this.resMap[i]
              } else {
                i = i + '=' + priKeyList[i]
              }
            }
            inputvarofNew.push(i)
          })
          console.log('inputvarofNew:', inputvarofNew)
          this.inputvarof = inputvarofNew.join(';')
          console.log('inputvarof:', this.inputvarof)
        } else {
          this.inputvarof = ''
        }

        // 处理res.CONOF 或 INPUTVAROF
        // if (node.data.childNum === 0) {
        // 某一项没有'=',则添加'='
        if (this.isConof) {
          // let conofTMNew = []
          // conofTM.forEach((i) => {
          //   if (i && i.indexOf('=') === -1) {
          //     if (this.resMap[i]) {
          //       i = i + '=' + this.resMap[i]
          //     } else {
          //       i = i + '=' + this.listMap[i]
          //     }
          //   }
          //   conofTMNew.push(i)
          // })
          // this.conofTM = conofTMNew.join(';')
          // console.log('conofTM:', this.conofTM)

          let conofTMNew = []
          conofTM.forEach((i) => {
            if (i && i.indexOf('=') !== -1) {
              i = i.split('=')[0] + '=' + i.split('=')[1]
            } else {
              if (this.resMap[i]) {
                i = i + '=' + this.resMap[i]
              } else {
                i = i + '=' + priKeyList[i]
              }
            }
            conofTMNew.push(i)
          })
          console.log('conofTMNew:', conofTMNew)
          this.conofTM = conofTMNew.join(';')
          console.log('conofTM:', this.conofTM)
        } else {
          this.conofTM = ''
        }

        // } else {
        //   this.conofTM = ''
        //   this.conofTMName = ''
        // }
      }

      let data = {
        SYSTEMKEYNAME: window.sessionStorage.getItem('SYSTEMKEYNAME'),
        SYSTEMTELLERNO: window.sessionStorage.getItem('SYSTEMTELLERNO')
      }
      // 判断node.data.childNum是否为0，如果为0，则加载子节点
      let CHILDCMDID
      if (node.data.childNum === 0) {
        CHILDCMDID = 2
      } else {
        CHILDCMDID = 1
      }
      // 将node.data companyName;projectName;compName;attrID=415;attr128LenValue1;attr128LenValue2;
      // 变成==> companyName=companyName;projectName=projectName;compName=compName;attrID=415;attr128LenValue1;attr128LenValue2;

      // data.condition = 'displayRecInfo=0,' + 'NODEID=' + this.NODEID + ',' + 'CHILDCMDID=' + CHILDCMDID + ',' + this.preCondition
      data.condition =
        'displayRecInfo=0,' +
        'NODEID=' +
        this.NODEID +
        ',' +
        'CHILDCMDID=' +
        CHILDCMDID +
        ',' +
        this.priKey +
        '|' +
        this.rowCondition +
        this.conofName +
        '=' +
        this.conof +
        '|' +
        this.conofTMName +
        '=' +
        this.conofTM +
        '|' +
        this.inputvarofName +
        '=' +
        this.inputvarof +
        '|' +
        this.endCondition
      // delete data.condition
      // let routeRowNO = JSON.parse(JSON.stringify(this.routeRowNO))
      // delete routeRowNO.condition
      // Object.assign(data, routeRowNO)
      // 合并两个对象
      Object.assign(data, this.routeRowNO)
      // reqData.condition = 'displayRecInfo=0,' + 'NODEID=' + this.NODEID + ',' + 'CHILDCMDID='+ CHILDCMDID + ',' + this.preCondition
      this.reqData = {
        ...data,
        condition:
          'displayRecInfo=0,' +
          'NODEID=' +
          this.NODEID +
          ',' +
          'CHILDCMDID=' +
          CHILDCMDID +
          ',' +
          this.priKey +
          '|' +
          this.rowCondition +
          this.conofName +
          '=' +
          this.conof +
          '|' +
          this.conofTMName +
          '=' +
          this.conofTM +
          '|' +
          this.inputvarofName +
          '=' +
          this.inputvarof +
          '|' +
          this.endCondition
      }
      // 将这几个参数拼接在this.preCondition中，以便后台获取数据
      const res = await getTreeMenu(this.reqData, 'unshow')
      // this.resMap = res
      console.log('超过二级的', res)
      let list = res.records
      // this.listMap = res.records

      // this.priKey = res.priKey

      // 处理res.CONOF 或 INPUTVAROF
      // // 处理res.CONOF 或 INPUTVAROF
      // let conof
      // if (res.CONOF) {
      //   conof = res.CONOF.split(';')
      //   console.log('conof1:', conof)
      //   // 某一项没有'=',则添加'='
      //   let conofNew = []
      //   conof.forEach((i) => {
      //     if (i && i.indexOf('=') === -1) {
      //       i = i + '=' + i
      //     }
      //     conofNew.push(i)
      //   })
      //   this.conof = conofNew.join(';')
      //   console.log('conof:', this.conof)
      // } else {
      //   this.conof = ''
      // }

      // 每一项list加上label: list.display
      list.forEach((i) => {
        i.label = i.display
        i.leaf = false
        i.tblAlias = res.VIEWDEF
        i[this.conofName] = this.conof
        i[this.inputvarofName] = this.inputvarof
        i.fatherCondition = { ...res, node, resolve }
      })
      this.treeData = list
      console.log('树treeData:', this.treeData)
      return resolve(this.treeData)
    },
    nodeClick(data, node) {
      this.$refs.contextmenu.hide()
      console.log('nodeClick data:', data)
      let nodeData = this.$_.cloneDeep(data)
      if (nodeData.childNum === 0) {
        let tableName = ['fileLibrary', 'fileBakLibrary']
        if (tableName.includes(data.tableName) || tableName.includes(data.fatherCondition.tableName)) {
          delete nodeData.fatherCondition

          let reqData = {
            // ...this.routeRowNO,
            ...nodeData,
            SYSTEMKEYNAME: window.sessionStorage.getItem('SYSTEMKEYNAME'),
            SYSTEMTELLERNO: window.sessionStorage.getItem('SYSTEMTELLERNO'),
            operationID: 50,
            tblAlias: data.docFileName ? '文件档案管理界面' : '文件档案备份管理界面',
            condition: data.docFileName ? `docFileName=${data.docFileName}` : data.priKey
          }
          // this.$refs.drawer.show(reqData, 'parallel')
          this.$refs.drawerParallel.show(reqData, 'parallel')
        } else {
          delete nodeData.fatherCondition
          delete nodeData.childNum
          // delete nodeData.priKey
          delete nodeData.condition
          // delete nodeData.objectID
          // delete nodeData[this.conofName]
          let reqData = {
            // ...this.routeRowNO,
            ...nodeData,
            SYSTEMKEYNAME: window.sessionStorage.getItem('SYSTEMKEYNAME'),
            SYSTEMTELLERNO: window.sessionStorage.getItem('SYSTEMTELLERNO'),
            condition: data.priKey,
            operationID: 50
          }

          console.log('单击reqData:', reqData)
          // this.$refs.drawer.show(reqData, 'parallel')
          this.$refs.drawerParallel.show(reqData, 'parallel')
        }
      } else {
        // this.$refs.drawer.show()
        this.$refs.drawerParallel.show()
      }
    },
    // getDrawerForm(data) {
    //   console.log('getDrawerForm data:', data)
    //   this.drawerForm = data
    // },
    async nodeContextmenu(event, data, node) {
      console.log('右键 event:', event)
      console.log('右键 data:', data)
      console.log('右键 node:', node)
      let nodeData = this.$_.cloneDeep(data)
      // 合并this.routeRowNO中不同与nodeData且不为空的参数
      let routeRowNO1 = this.$_.cloneDeep(this.routeRowNO)
      const { operationID, condition, ...routeRowNO } = routeRowNO1
      // delete routeRowNO.operationID
      // delete routeRowNO.condition
      console.log('右键 routeRowNO:', routeRowNO)

      let prikeyNew = {}
      let priKeyOriginal = {}

      if (nodeData.priKey) {
        priKeyOriginal = nodeData.priKey
      } else {
        if (nodeData.fatherCondition && nodeData.fatherCondition.priKey) {
          priKeyOriginal = nodeData.fatherCondition.priKey
        }
      }
      if (priKeyOriginal.length > 0) {
        let prikey = priKeyOriginal.split('|').filter((i) => i !== '')
        prikey.forEach((i) => {
          if (i.indexOf('=') !== -1) {
            prikeyNew[i.split('=')[0]] = i.split('=')[1]
          }
        })
        console.log('prikeyNew:', prikeyNew)
      }

      for (let key in nodeData.fatherCondition) {
        if (nodeData.fatherCondition[key] && !nodeData[key]) {
          nodeData[key] = nodeData.fatherCondition[key]
        }
      }
      delete nodeData.fatherCondition

      for (let key in routeRowNO) {
        if (routeRowNO[key] && !nodeData[key]) {
          nodeData[key] = routeRowNO[key]
        }
      }
      for (let key in prikeyNew) {
        if (prikeyNew[key] && !nodeData[key]) {
          nodeData[key] = prikeyNew[key]
        }
      }

      // delete nodeData.priKey

      this.topY = event.pageY
      this.leftX = event.pageX

      let reqData = {
        SYSTEMKEYNAME: window.sessionStorage.getItem('SYSTEMKEYNAME'),
        SYSTEMTELLERNO: window.sessionStorage.getItem('SYSTEMTELLERNO'),
        meumType: 'form'
      }
      if (nodeData.childNum === 0) {
        delete reqData.meumType
      }
      let tblAlias
      if (this.fileFlag) {
        tblAlias = '文件档案管理界面'
        if (data.tableName === 'fileBakLibrary') {
          tblAlias = '文件档案备份管理界面'
        }
        reqData.tblAlias = tblAlias
      } else {
        tblAlias = data.tblAlias
        reqData.tblAlias = tblAlias
        if (nodeData.VIEWDEF) {
          reqData.tblAlias = nodeData.VIEWDEF
        }
      }

      // Object.assign(nodeData, this.drawerForm)
      let res = await getRecordMenuGrp(reqData)
      console.log('getRecordMenuGrp:', res)
      // resId=990 的,加上children
      res.forEach((i) => {
        if (i.resId === 990) {
          i.children = []
        }
      })
      let newRes = res.filter((i) => i.itemName !== '编辑本视图')
      // 添加'刷新该节点'，位置在第一个
      newRes.unshift({
        ...data,
        itemName: '刷新该节点',
        itemId: 'refresh'
      })

      this.recordMenuGrp = newRes

      console.log('右键 nodeData:', nodeData)

      await this.$refs.contextmenu.show(this.topY, this.leftX, nodeData, node)
      //  getRecordMenuGrp(reqData).then((res) => {
      //   console.log('右键菜单 res:', res)
      //   this.recordMenuGrp = res
      //   console.log('refs v-contextmenu',this.$refs.contextmenu)
      // })
    },
    refreshNode(nodeOri, remove) {
      console.log('refreshNode nodeOri:', nodeOri)
      let node
      if (remove) {
        this.$refs.elTree.remove(nodeOri)
      } else {
        node = this.$refs.elTree.getNode(nodeOri)
        console.log('refreshNode node:', node)
        if (node) {
          node.loaded = false
          node.expand() // 主动调用展开节点方法，重新查询该节点下的所有子节点
        }
      }

      // this.refreshTree()
    },
    openDrawer(data, node) {
      this.$refs.drawer.show(data, 'float', node)
    },
    openReport(data) {
      this.$refs.iframe.show(data)
    },
    queryAllData(data) {
      console.log('queryAllData data:', data)
      this.$refs.appMain.show(data)
    },
    fileContentShow(res, name, type) {
      console.log('fileContentShow res:', res)
      this.$refs.showFileContent.show(res, name, type)
    },
    // 上传文件
    uploadFile(row) {
      // 弹出dialog
      this.$refs.uploadFile.show(row)
    }
  }
}
</script>

<style scoped lang="scss">
.tree-container {
  padding: 20px;
  width: 100%;
  // height: 100%;
  // 不能滚动
  // overflow: hidden;
}
::v-deep .el-page-header {
  margin-bottom: 20px;
}
// ::v-deep .el-dialog {
//   height: 100%;
// }
::v-deep .el-dialog__wrapper {
  position: absolute !important;
}
// ::v-deep .v-modal {
//   position: absolute !important;
// }
.splitter-pane.vertical.splitter-paneL, .splitter-pane.vertical.splitter-paneR {
  overflow: auto !important;
}
// 右键会选中文字，为了美观将它禁用
#el-tree {
  user-select: none;
}

.right-menu {
  font-size: 14px;
  position: fixed;
  background: #fff;
  border: solid 1px rgba(0, 0, 0, 0.2);
  border-radius: 3px;
  z-index: 999;
  display: none;
}

.right-menu a {
  width: 150px;
  height: 28px;
  line-height: 28px;
  text-align: center;
  display: block;
  color: #1a1a1a;
}

.right-menu a:hover {
  background: #eee;
  color: #fff;
}

.right-menu {
  border: 1px solid #eee;
  box-shadow: 0 0.5em 1em 0 rgba(0, 0, 0, 0.1);
  border-radius: 1px;
}

a {
  text-decoration: none;
}

.right-menu a {
  padding: 2px;
}

.right-menu a:hover {
  background: #99a9bf;
}
</style>
