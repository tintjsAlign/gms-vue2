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
    <split-pane split="vertical" @resize="resize" style="height: 95vh" :min-percent="20" :default-percent="30">
      <template slot="paneL">
        <div class="left-container">
          <el-tree ref="elTree" id="el-tree" :props="defaultProps" lazy :load="loadNode" highlight-current node-key="id" @node-click="nodeClick">
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <svg-icon v-if="data.childNum === 0" icon-class="floder" />
              <svg-icon v-else-if="node.expanded" icon-class="floder_open" />
              <svg-icon v-else icon-class="file" />
              <span class="fontSize14" :title="node.label || '-'">{{ ' ' + node.label }}</span>
            </span>
          </el-tree>
          <VueContextMenu
            class="right-menu"
            :target="contextMenuTarget"
            :show="contextMenuVisible"
            @update:show="(show) => (contextMenuVisible = show)"
          >
            <el-cascader-panel :options="options" :props="{ expandTrigger: 'hover' }"></el-cascader-panel>
          </VueContextMenu>
        </div>
      </template>
      <template slot="paneR">
        <!-- <v-contextmenu ref="contextmenu">
          <v-contextmenu-item>菜单1</v-contextmenu-item>
          <v-contextmenu-item>菜单2</v-contextmenu-item>
          <v-contextmenu-submenu title="菜单3">
            <v-contextmenu-item>子菜单1</v-contextmenu-item>
            <v-contextmenu-item>子菜单2</v-contextmenu-item>
          </v-contextmenu-submenu>
        </v-contextmenu>

        <div v-contextmenu:contextmenu>右键点击此区域</div> -->
        <dynamic-drawer ref="drawer" @refresh="refresh"></dynamic-drawer>
      </template>
    </split-pane>
    <!-- </el-dialog> -->
  </div>
</template>

<script>
// 直接在组件中引入使用
import { component as VueContextMenu } from '@xunlei/vue-context-menu'
import splitPane from 'vue-splitpane'

import { requestMain, getTreeMenu } from '@/api/main'

import dynamicDrawer from '@/components/DynamicDrawer/index.vue'

export default {
  name: 'treeContainer',
  components: { VueContextMenu, splitPane, dynamicDrawer },
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
      options: [
        {
          value: 'zhinan',
          label: '指南',
          children: [
            {
              value: 'shejiyuanze',
              label: '设计原则',
              children: [
                {
                  value: 'yizhi',
                  label: '一致'
                },
                {
                  value: 'fankui',
                  label: '反馈'
                },
                {
                  value: 'xiaolv',
                  label: '效率'
                },
                {
                  value: 'kekong',
                  label: '可控'
                }
              ]
            },
            {
              value: 'daohang',
              label: '导航',
              children: [
                {
                  value: 'cexiangdaohang',
                  label: '侧向导航'
                },
                {
                  value: 'dingbudaohang',
                  label: '顶部导航'
                }
              ]
            }
          ]
        },
        {
          value: 'zujian',
          label: '组件',
          children: [
            {
              value: 'basic',
              label: 'Basic',
              children: [
                {
                  value: 'layout',
                  label: 'Layout 布局'
                },
                {
                  value: 'color',
                  label: 'Color 色彩'
                },
                {
                  value: 'typography',
                  label: 'Typography 字体'
                },
                {
                  value: 'icon',
                  label: 'Icon 图标'
                },
                {
                  value: 'button',
                  label: 'Button 按钮'
                }
              ]
            },
            {
              value: 'form',
              label: 'Form',
              children: [
                {
                  value: 'radio',
                  label: 'Radio 单选框'
                },
                {
                  value: 'checkbox',
                  label: 'Checkbox 多选框'
                },
                {
                  value: 'input',
                  label: 'Input 输入框'
                },
                {
                  value: 'input-number',
                  label: 'InputNumber 计数器'
                },
                {
                  value: 'select',
                  label: 'Select 选择器'
                },
                {
                  value: 'cascader',
                  label: 'Cascader 级联选择器'
                },
                {
                  value: 'switch',
                  label: 'Switch 开关'
                },
                {
                  value: 'slider',
                  label: 'Slider 滑块'
                },
                {
                  value: 'time-picker',
                  label: 'TimePicker 时间选择器'
                },
                {
                  value: 'date-picker',
                  label: 'DatePicker 日期选择器'
                },
                {
                  value: 'datetime-picker',
                  label: 'DateTimePicker 日期时间选择器'
                },
                {
                  value: 'upload',
                  label: 'Upload 上传'
                },
                {
                  value: 'rate',
                  label: 'Rate 评分'
                },
                {
                  value: 'form',
                  label: 'Form 表单'
                }
              ]
            },
            {
              value: 'data',
              label: 'Data',
              children: [
                {
                  value: 'table',
                  label: 'Table 表格'
                },
                {
                  value: 'tag',
                  label: 'Tag 标签'
                },
                {
                  value: 'progress',
                  label: 'Progress 进度条'
                },
                {
                  value: 'tree',
                  label: 'Tree 树形控件'
                },
                {
                  value: 'pagination',
                  label: 'Pagination 分页'
                },
                {
                  value: 'badge',
                  label: 'Badge 标记'
                }
              ]
            },
            {
              value: 'notice',
              label: 'Notice',
              children: [
                {
                  value: 'alert',
                  label: 'Alert 警告'
                },
                {
                  value: 'loading',
                  label: 'Loading 加载'
                },
                {
                  value: 'message',
                  label: 'Message 消息提示'
                },
                {
                  value: 'message-box',
                  label: 'MessageBox 弹框'
                },
                {
                  value: 'notification',
                  label: 'Notification 通知'
                }
              ]
            },
            {
              value: 'navigation',
              label: 'Navigation',
              children: [
                {
                  value: 'menu',
                  label: 'NavMenu 导航菜单'
                },
                {
                  value: 'tabs',
                  label: 'Tabs 标签页'
                },
                {
                  value: 'breadcrumb',
                  label: 'Breadcrumb 面包屑'
                },
                {
                  value: 'dropdown',
                  label: 'Dropdown 下拉菜单'
                },
                {
                  value: 'steps',
                  label: 'Steps 步骤条'
                }
              ]
            },
            {
              value: 'others',
              label: 'Others',
              children: [
                {
                  value: 'dialog',
                  label: 'Dialog 对话框'
                },
                {
                  value: 'tooltip',
                  label: 'Tooltip 文字提示'
                },
                {
                  value: 'popover',
                  label: 'Popover 弹出框'
                },
                {
                  value: 'card',
                  label: 'Card 卡片'
                },
                {
                  value: 'carousel',
                  label: 'Carousel 走马灯'
                },
                {
                  value: 'collapse',
                  label: 'Collapse 折叠面板'
                }
              ]
            }
          ]
        },
        {
          value: 'ziyuan',
          label: '资源',
          children: [
            {
              value: 'axure',
              label: 'Axure Components'
            },
            {
              value: 'sketch',
              label: 'Sketch Templates'
            },
            {
              value: 'jiaohu',
              label: '组件交互文档'
            }
          ]
        }
      ]
    }
  },
  computed: {},
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
      // this.contextMenuTarget = this.$refs.elTree
      console.log('tree refs:', this.contextMenuTarget)
      // 获取所有的 treeitem，循环监听右键事件
      const tree = document.querySelectorAll('#el-tree [role="treeitem"]')
      tree.forEach((i) => {
        i.addEventListener('contextmenu', (event) => {
          // 如果右键了，则模拟点击这个treeitem
          event.target.click()
        })
      })
    })
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    loadNode(node, resolve) {
      //如果展开第一级节点，从后台加载一级节点列表
      if (node.level == 0) {
        this.loadFirstNode(resolve)
      }
      //如果展开其他级节点，动态从后台加载下一级节点列表
      if (node.level >= 1) {
        this.loadchildNode(node, resolve)
      }
    },
    //加载第一级节点
    async loadFirstNode(resolve) {
      let data = {
        SYSTEMKEYNAME: window.localStorage.getItem('SYSTEMKEYNAME'),
        SYSTEMTELLERNO: window.localStorage.getItem('SYSTEMTELLERNO')
      }
      Object.assign(data, this.routeRow)
      const res = await getTreeMenu(data)
      let list = res.records
      this.NODEID = res.INNODEID
      this.conofName = 'CONOF' + res.INNODEID
      // 将res的不为空和不是condition的键值 用'|'拼接字符串
      // for (let i in res) {
      //   if (res[i] && i !== 'CONOF' && i !== 'records' && i !== 'INPUTVAROF') {
      //     this.endCondition += '|' + `${i}=${res[i]}`
      //   }
      // }
      // 把this.preCondition(string)中的全部逗号换成|
      this.rowCondition = this.preCondition.replace(/,/g, '|')
      // 截取取出DISPLAYFIRSTNODE后面的值(包括DISPLAYFIRSTNODE)
      let displayFirstNode = this.rowCondition.substring(this.rowCondition.indexOf('DISPLAYFIRSTNODE'))
      this.rowCondition = displayFirstNode
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
      list.forEach((i) => {
        i.label = i.display
        i.leaf = false
        i.tblAlias = res.VIEWDEF
        i.fatherCondition = { ...res }
      })
      this.treeData = list
      console.log('树treeData:', this.treeData)
      return resolve(this.treeData)
    },
    //加载节点的子节点集合
    async loadchildNode(node, resolve) {
      console.log('超过二级的', node, node.level)
      this.resMap = node.data.fatherCondition
      this.priKey = node.data.fatherCondition.priKey
      this.listMap = node.data
      if (node.data.INNODEID) {
        this.NODEID = node.data.INNODEID
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
            this.inputvarofName = 'INPUTVAROF' + this.resMap.INNODEID
            this.isInputvarof = true
          } else {
            this.inputvarofName = ''
            this.isInputvarof = false
          }

          if (this.resMap.CONOF) {
            conofTM = this.resMap.CONOF.split(';')
            this.conofTMName = 'CONOF' + this.resMap.INNODEID
            this.isConof = true
          } else {
            this.isConof = false
          }
        } else {
          console.log('没有子节点', this.listMap)
          this.deepMap = this.listMap

          if (node.data.INPUTVAROF) {
            inputvarof = node.data.INPUTVAROF.split(';')
            this.inputvarofName = 'INPUTVAROF' + node.data.INNODEID
            this.isInputvarof = true
          } else {
            this.inputvarofName = ''
            this.isInputvarof = false
          }

          if (node.data.CONOF) {
            conofTM = node.data.CONOF.split(';')
            this.conofTMName = 'CONOF' + node.data.INNODEID
            this.isConof = true
          } else {
            this.conofTMName = ''
            this.isConof = false
          }
          // conof = node.data.CONOF.split(';')
          // this.conofName = 'CONOF' + node.data.INNODEID
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
        if (this.isInputvarof) {
          // 处理INPUTVAROF
          console.log('inputvarof:', inputvarof)
          // 某一项没有'=',则添加'='
          let inputvarofNew = []
          inputvarof.forEach((i) => {
            if (i && i.indexOf('=') === -1) {
              // 取this.resMap键相同的值
              if (this.resMap[i]) {
                i = i + '=' + this.resMap[i]
              } else {
                i = i + '=' + this.listMap[i]
              }
            }
            inputvarofNew.push(i)
          })
          this.inputvarof = inputvarofNew.join(';')
          console.log('inputvarof:', this.inputvarof)
        } else {
          this.inputvarof = ''
        }

        // 处理res.CONOF 或 INPUTVAROF
        // if (node.data.childNum === 0) {
        // 某一项没有'=',则添加'='
        if (this.isConof) {
          let conofTMNew = []
          conofTM.forEach((i) => {
            if (i && i.indexOf('=') === -1) {
              if (this.resMap[i]) {
                i = i + '=' + this.resMap[i]
              } else {
                i = i + '=' + this.listMap[i]
              }
            }
            conofTMNew.push(i)
          })
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
        SYSTEMKEYNAME: window.localStorage.getItem('SYSTEMKEYNAME'),
        SYSTEMTELLERNO: window.localStorage.getItem('SYSTEMTELLERNO')
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
      const res = await getTreeMenu(this.reqData)
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
        i.fatherCondition = { ...res }
      })
      this.treeData = list
      console.log('树treeData:', this.treeData)
      return resolve(this.treeData)
    },
    nodeClick(data, node) {
      console.log('nodeClick data:', data)
      let nodeData = this.$_.cloneDeep(data)
      let routerData = this.$_.cloneDeep(data)
      if (nodeData.childNum === 0) {
        delete nodeData.fatherCondition
        delete nodeData.childNum
        delete nodeData.priKey
        delete nodeData.condition
        let reqData = {
          ...nodeData,
          SYSTEMKEYNAME: window.localStorage.getItem('SYSTEMKEYNAME'),
          SYSTEMTELLERNO: window.localStorage.getItem('SYSTEMTELLERNO'),
          condition: data.priKey,
          operationID: 50,
          resId: this.routeRow.resId,
          itemName: this.routeRow.itemName,
          otherProperties: this.routeRow.otherProperties
        }
        this.$refs.drawer.show(reqData, 'parallel')
      } else {
        this.$refs.drawer.show()
      }
    },
    handleClose() {
      this.dialogVisible = false
    }
  }
}
</script>

<style scoped lang="scss">
.tree-container {
  padding: 20px;
  width: 100%;
}
::v-deep .el-page-header {
  margin-bottom: 20px;
}
::v-deep .el-dialog {
  height: 100%;
}
::v-deep .el-dialog__wrapper {
  position: absolute !important;
}
// ::v-deep .v-modal {
//   position: absolute !important;
// }

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
.left-container {
  // background-color: #f38181;
  height: 100%;
}
.right-container {
  background-color: #fce38a;
  height: 200px;
}
.top-container {
  background-color: #fce38a;
  width: 100%;
  height: 100%;
}
.bottom-container {
  width: 100%;
  background-color: #95e1d3;
  height: 100%;
}
</style>
