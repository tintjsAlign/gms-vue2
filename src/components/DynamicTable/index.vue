<template>
  <div class="table-container" v-click-outside="clickOutSide">
    <!-- <el-card class="box-card"> -->
    <!-- 按钮组 -->
    <div class="button-group">
      <div class="dynamic">
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
      <div class="otherBotton">
        <el-row>
          <el-tooltip class="item" effect="dark" content="删除选中" placement="top">
            <el-button v-if="showDeleteBtn" type="danger" icon="el-icon-delete" size="small" circle @click="batchDeleteRow"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="清空选中" placement="top">
            <el-button icon="el-icon-refresh-left" size="small" circle @click="clickOutSide"></el-button>
          </el-tooltip>
        </el-row>
      </div>
    </div>
    <div class="dynamic-table">
      <el-table
        :data="tableData"
        ref="dynamicTable"
        border
        stripe
        fit
        highlight-current-row
        style="width: 100%"
        class="table-fixed"
        size="mini"
        :max-height="elTableHeight"
        :header-cell-style="{ background: '#f5f7fa', color: '#606266' }"
        @current-change="handleCurrentChange"
        @selection-change="handleSelectionChange"
      >
        <af-table-column type="selection" width="55"> </af-table-column>
        <af-table-column
          v-for="(fruit, index) in formThead"
          align="center"
          show-overflow-tooltip
          :sortable="false"
          :key="index"
          :label="fruit.fldAlais"
          :prop="fruit.queryFldName"
        >
          <template slot-scope="scope">
            {{ scope.row[fruit.queryFldName] }}
          </template>
        </af-table-column>
        <af-table-column
          label="操作"
          width="180"
          align="center"
          fixed="right"
          v-if="tableData.length > 0 && recordBtnGroup.length > 0"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <el-button-group>
              <span v-for="(btn, i) in recordBtnGroup" :key="i" class="btnsClass">
                <!-- <el-tooltip class="item" effect="dark" :content="btn.itemName" open-delay="700" placement="top-start"> -->
                <el-button size="mini" type="text" @click.native="handleMain(scope.row, btn)">
                  {{ btn.itemName }}
                </el-button>
              </span>
            </el-button-group>
          </template>
        </af-table-column>
      </el-table>
    </div>
    <!-- </el-card> -->

    <dynamic-drawer ref="drawer" @refresh="refresh"></dynamic-drawer>
    <!-- <app-iframe ref="iframe"></app-iframe> -->
  </div>
</template>

<script>
import dynamicButton from '@/components/DynamicButton/index.vue'
import dynamicDrawer from '@/components/DynamicDrawer/index.vue'
// import appIframe from '@/views/iframe'

import { requestMain } from '@/api/main'
export default {
  name: 'table-container',
  inject: ['reload'],
  components: {
    dynamicButton,
    dynamicDrawer
    // appIframe
  },
  props: {
    tableData: {
      type: Array,
      default: () => []
    },
    originTableData: {
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
      recordBtnGroup: [], //操作按钮组
      // table 高度
      elTableHeight: 450,
      showDeleteBtn: false //是否显示删除按钮
    }
  },
  computed: {},
  watch: {
    tableData: {
      handler() {
        this.$nextTick(() => {
          this.$refs.dynamicTable.doLayout()
        })
      },
      deep: true
    }
  },
  created() {},
  mounted() {
    this.$nextTick(() => {
      let mainHeight = document.querySelector('.app-main').offsetHeight
      console.log('mainHeight高度:', mainHeight)
      // 减去search-container高度和button-group高度和pagination-container高度
      this.elTableHeight =
        mainHeight - document.querySelector('.button-group').offsetHeight - document.querySelector('.pagination-container').offsetHeight - 180
      console.log('elTableHeight高度:', this.elTableHeight)
    })
  },
  methods: {
    refresh() {
      this.reload()
    },
    // 点击空白处时触发的事件
    clickOutSide() {
      // 取消选中
      this.$refs.dynamicTable.setCurrentRow()
      this.$refs.dynamicTable.clearSelection()
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
    handleMain(oriRow, oriBtn) {
      console.log('当前行数据:', oriRow)
      console.log('btn参数:', oriBtn)
      let row = this.$_.cloneDeep(oriRow)
      let btn = this.$_.cloneDeep(oriBtn)
      // 处理btn参数,全部加入row中
      for (let i in btn) {
        row[i] = btn[i]
      }
      // btn.objectID = row.objectID
      let operationIDs = [1, 48, 49, 50]

      if (operationIDs.includes(btn.operationID)) {
        // 打开抽屉-填表单
        this.openDrawer(row)
      } else if (btn.operationID === 2) {
        // 删除操作
        this.deleteRow(row)
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
      if (!val) {
        return
      }
      this.currentRow = val
      console.log('单选数据', val)
      // 用this.originTableData原始数据传递
      let oriVal
      if (val.objectID) {
        this.originTableData.find((item) => {
          if (item.objectID === val.objectID) {
            oriVal = item
          }
        })
      }
      console.log('原始单选数据', oriVal)
      this.$refs.dynamicButton.replaceButtonGroup(oriVal)
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
      console.log('多选数据multipleSelection(非原始)', this.multipleSelection)
      // 所选数据只有一条时,
      if (val.length === 1) {
        this.currentRow = val[0]
        this.$refs.dynamicButton.replaceButtonGroup(val[0])
        this.showDeleteBtn = false
      } else {
        this.$refs.dynamicButton.replaceButtonGroup(val)
        if (val.length > 1) {
          // 显示多选删除按钮 this.recordBtnGroup 中有删除时才显示
          // this.showDeleteBtn = this.recordBtnGroup.some(item => item.itemName === '删除')
          this.showDeleteBtn = this.recordBtnGroup.some((item) => item.operationID === 2)
        } else {
          this.showDeleteBtn = false
        }
      }
    },
    openDrawer(row) {
      this.$refs.drawer.show(row)
    },
    //批量删除
    batchDeleteRow() {
      console.log('多选数据:', this.multipleSelection)
      let row = this.multipleSelection
      console.log('按钮数据recordBtnGroup:', this.recordBtnGroup)
      // 获取删除按钮的数据
      let deleteBtnData = this.recordBtnGroup.find((item) => item.operationID === 2)
      console.log('删除按钮数据:', deleteBtnData)

      this.$confirm(`${deleteBtnData.otherProperties.operationTitle}`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 删除操作
        let data = {
          SYSTEMKEYNAME: window.localStorage.getItem('SYSTEMKEYNAME'),
          SYSTEMTELLERNO: window.localStorage.getItem('SYSTEMTELLERNO')
        }

        // 循环发送删除请求
        let successCount = 0
        let rowLength = row.length
        row.forEach((item, index) => {
          Object.assign(data, item, deleteBtnData)
          requestMain(data).then((res) => {
            console.log('删除结果:', res)
            if (res === 'statusCode:200') {
              successCount++
              this.$notify({
                title: '成功',
                message: `成功删除${successCount}条记录`,
                type: 'success',
                duration: 1500,
                onClose: () => {
                  if (index === rowLength - 1) {
                    this.reload()
                  }
                }
              })
            }
          })
        })
      })
    },
    // 删除操作
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
              if (res === 'statusCode:200') {
                this.$notify({
                  title: '成功',
                  message: '成功删除一条记录',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.reload()
                  }
                })
              } else {
                if (typeof res === 'string' && res.indexOf('message=') > -1) {
                  // ModelAndView: reference to view with name 'template/main'; model is {message=错误原因=表记录没有找到|SERVICELOGSSN=202208031017080807980003|, statusCode=300}
                  // 提取错误原因
                  let errorMsg = res.match(/message=(.*?)\|/)[1]

                  this.$notify({
                    title: '失败',
                    message: errorMsg,
                    type: 'error',
                    duration: 2500,
                    onClose: () => {
                      // this.reload()
                    }
                  })
                }
              }
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
      // this.$refs.iframe.show(row)
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
    justify-content: space-between;
    // align-items: center;
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
::v-deep .el-table__body tr.current-row > td {
  background: #d5eafe !important;
}

.btnsClass {
  margin-left: 10px;
}

.table-fixed {
  ::v-deep .el-table__fixed-right {
    height: 100% !important;
  }
  ::v-deep .el-table__fixed {
    height: 100% !important;
  }
}
</style>
