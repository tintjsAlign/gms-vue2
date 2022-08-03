<template>
  <div class="table-container" v-click-outside="clickOutSide">
    <!-- <el-card class="box-card"> -->
    <!-- 按钮组 -->
    <div class="button-group">
      <dynamic-button
        ref="dynamicButton"
        :requestData="requestData"
        @openDrawer="openDrawer"
        @queryAllData="queryAllData"
        @getRecordBtn="getRecordBtn"
        @openReport="openReport"
        @refresh="refresh"
      ></dynamic-button>
    </div>
    <div class="dynamic-table">
      <el-table
        v-fit-columns
        :data="tableData"
        ref="dynamicTable"
        border
        fit
        highlight-current-row
        style="width: 100%"
        size="mini"
        @current-change="handleCurrentChange"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column
          v-for="(fruit, index) in formThead"
          :key="index"
          :label="fruit.fldAlais"
          :prop="fruit.queryFldName"
          min-width="80px"
        >
          <template slot-scope="scope">
            {{ scope.row[fruit.queryFldName] }}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="180"
          align="center"
          fixed="right"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span v-for="(btn, i) in recordBtnGroup" :key="i" class="btnsClass">
              <el-tooltip class="item" effect="dark" :content="btn.itemName" open-delay="700" placement="top-start">
              <el-button
                size="mini"
                :type="btn.type"
                :icon="btn.icon"
                circle
                @click.native="handleMain(scope.row, btn)"
              >
                <!-- {{ btn.itemName }} -->
              </el-button>
            </span>
            <!-- <span>
              <el-dropdown
                trigger="click"
                @command="handleMoreCommand($event, scope.row)"
              >
                <span class="el-dropdown-link">
                  更多<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    v-for="(item, index) in moreButton"
                    :key="index"
                    :command="item.buttonID"
                    >{{ item.buttonValue }}</el-dropdown-item
                  >
                </el-dropdown-menu>
              </el-dropdown>
            </span> -->
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- </el-card> -->

    <dynamic-drawer ref="drawer" @refresh="refresh"></dynamic-drawer>
    <app-iframe ref="iframe" ></app-iframe>

  </div>
</template>

<script>
import dynamicButton from '@/components/DynamicButton/index.vue'
import dynamicDrawer from '@/components/DynamicDrawer/index.vue'
import appIframe from '@/views/iframe'

import { requestMain } from '@/api/main'
export default {
  name: 'table-container',
  inject: ['reload'],
  components: {
    dynamicButton,
    dynamicDrawer,
    appIframe
  },
  props: {
    tableData: {
      type: Array,
      default: () => []
    },
    formThead: {
      type: Array,
      default: () => []
    },
    requestData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      searchContent: '', //搜索内容
      watchSearch: '',
      stashList: [],
      tableList: [],
      select: '',
      total: this.tableData.length, //数组总数
      currentPage: 1, //当前页
      paginationData: [], //分页数组
      pageSize: 5, //每页数据
      currentRow: null, //当前行数据
      multipleSelection: [], //多选数据
      recordBtnGroup: [] //操作按钮组
    }
  },
  computed: {
    operationTarget() {
      return this.$store.state.settings.operationTarget
    }
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {
    refresh() {
      this.reload()
    },
    // 点击空白处时触发的事件
    clickOutSide() {
      // 取消选中
      this.$refs.dynamicTable.setCurrentRow()
      // 替换回原来的按钮组
      this.$refs.dynamicButton.replaceButtonGroup('')
    },
    getRecordBtn(data) {
      console.log('记录管理 按钮 父', data)
      // 数组中添加对应的icon
      data.forEach((item) => {
        // 根据按钮名字,自定义按钮图标和按钮状态
        switch (item.itemName) {
          case '查看':
            item.icon = 'el-icon-view'
            item.type = 'primary'
            break
          case '修改':
            item.icon = 'el-icon-edit'
            item.type = 'success'
            break
          case '删除':
            item.icon = 'el-icon-delete'
            item.type = 'danger'
            break
          case '添加':
            item.icon = 'el-icon-plus'
            item.type = 'success'
            break
          case '提交':
            item.icon = 'el-icon-check'
            item.type = 'success'
            break
          case '审核':
            item.icon = 'el-icon-check'
            item.type = 'success'
            break
          case '取消':
            item.icon = 'el-icon-close'
            item.type = 'danger'
            break
          case '打印':
            item.icon = 'el-icon-printer'
            item.type = 'success'
            break
          case '导出':
            item.icon = 'el-icon-download'
            item.type = 'success'
            break
          case '导入':
            item.icon = 'el-icon-upload'
            item.type = 'success'
            break
          case '刷新':
            item.icon = 'el-icon-refresh'
            item.type = 'success'
            break
          case '查询':
            item.icon = 'el-icon-view'
            item.type = 'primary'
            break
          case '重置':
            item.icon = 'el-icon-refresh'
            item.type = 'success'
            break
          case '新增':
            item.icon = 'el-icon-plus'
            item.type = 'success'
            break
          case '保存':
            item.icon = 'el-icon-save'
            item.type = 'success'
            break
          case '复制':
            item.icon = 'el-icon-document-copy'
            item.type = 'info'
            break
          default:
            item.icon = 'el-icon-view'
            item.type = 'primary'
            break
        }
      })
      // 替换表格操作按钮组
      this.recordBtnGroup = data
    },
    handleMain(row, btn) {
      console.log('当前行数据:', row)
      console.log('操作id对照:', this.operationTarget)
      console.log('btn参数:', btn)
      // 根据操作id对照,进行不同的操作
      // 以btn.operationID对应this.operationTarget对象中的key,获取对应的值
      // 如果没有对应的key,则默认为空字符串
      let key = this.operationTarget[btn.operationID] || ''
      console.log('key:', key)
      // 处理btn参数,全部加入row中
      for (let i in btn) {
        row[i] = btn[i]
      }
      btn.objectID = row.objectID
      switch (key) {
        case 'ajaxTodo': // ajaxTodo 删除?
          // 删除操作
          this.deleteRow(row)
          break
        case 'dialog': // dialog 弹框
          // 打开抽屉
          console.log('打开抽屉')
          this.openDrawer(row)
          break
        default: // 默认操作
          break
      }
    },
    handleMoreCommand(command, row) {
      console.log(command, row)
      this.$notify({
        title: '成功',
        message: '点击了按钮' + command,
        type: 'success'
      })
    },
    queryAllData(btn) {
      let data = {
        SYSTEMKEYNAME: window.localStorage.getItem('SYSTEMKEYNAME'),
        SYSTEMTELLERNO: window.localStorage.getItem('SYSTEMTELLERNO')
      }
      // 合并参数
      Object.assign(data, btn)
      data.pageNum = 1
      data.numPerPage = 5
      requestMain(data).then((res) => {
        console.log('查询所有数据', res)
        this.$emit('searchResult', res)
      })
    },
    handleCurrentChange(val) {
      this.currentRow = val
      console.log('单选数据', this.currentRow)
      this.$refs.dynamicButton.replaceButtonGroup(val)
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
      console.log('多选数据multipleSelection', this.multipleSelection)
    },
    openDrawer(row) {
      this.$refs.drawer.show(row)
    },
    deleteRow(row) {
      this.$confirm(`${row.otherProperties.operationTitle}`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // 删除操作
          let data = {
            SYSTEMKEYNAME: window.localStorage.getItem('SYSTEMKEYNAME'),
            SYSTEMTELLERNO: window.localStorage.getItem('SYSTEMTELLERNO')
          }
          // 合并data和row
          Object.assign(data, row)
          console.log('删除数据:', data)
          requestMain(data)
            .then((res) => {
              console.log('删除结果:', res)
              this.$message({
                message: '删除成功',
                type: 'success'
              })
              this.reload()
            })
            .catch((err) => {
              console.log('删除错误:', err)
              this.$message({
                message: err,
                type: 'error'
              })
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    openReport(row) {
      this.$refs.iframe.show(row)
    }
  }
}
</script>

<style scoped lang="scss">
.table-container {
  padding: 0 20px 20px;

  .dynamic-table {
    margin-top: 10px;
    margin-bottom: 20px;
  }

  .button-group {
    height: 35px;
    margin-bottom: 0px;
    display: flex;
    justify-content: flex-start;
  }
}
::v-deep .el-dropdown-link {
  cursor: pointer;
  color: #409eff;
  margin-left: 10px;
}
::v-deep .el-icon-arrow-down {
  font-size: 12px;
}
.btnsClass {
  margin-left: 10px;
}
</style>
