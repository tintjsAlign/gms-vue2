<template>
  <div class="table-container">
    <!-- <el-card class="box-card"> -->
    <div class="dynamic-search">
      <div style="width: 500px">
        <el-input
          v-model="searchContent"
          placeholder="请输入搜索内容"
          class="input-with-select"
          @keyup.enter.native="search"
        >
          <el-select
            v-model="select"
            slot="prepend"
            placeholder="请选择搜索项"
            filterable
          >
            <el-option
              v-for="(item, index) in formThead"
              :key="index"
              :label="item.fldAlais"
              :value="item.queryFldName"
            ></el-option>
          </el-select>
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="search"
          ></el-button>
        </el-input>
      </div>
    </div>
    <div class="dynamic-table">
      <el-table
        :data="paginationData"
        border
        fit
        highlight-current-row
        style="width: 100%"
      >
        <!-- <el-table-column prop="name" label="fruitName" width="180" /> -->
        <el-table-column
          v-for="(fruit, index) in formThead"
          :key="index"
          :label="fruit.fldAlais"
          :prop="fruit.queryFldName"
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
            <span>
              <el-button
                size="mini"
                type="text"
                @click="handleDetails(scope.row)"
              >
                详情
              </el-button>
            </span>
            <span>
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
            </span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- </el-card> -->
    <div class="pagination-container">
      <el-pagination
        background
        layout="total, sizes, prev, pager, next, jumper"
        :current-page="currentPage"
        :page-sizes="[5, 10, 20, 50]"
        :page-size="pageSize"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        style="margin: 10px 0"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: 'table-container',
  components: {},
  props: {
    tableData: {
      type: Array,
      default: () => []
    },
    formThead: {
      type: Array,
      default: () => []
    },
    moreButton: {
      type: Array,
      default: () => []
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
      pageSize: 5 //每页数据
    }
  },
  computed: {},
  watch: {},
  created() {
    this.tableList = this.tableData
    this.handleCurrentChange(this.currentPage)
    this.stashList = this.tableData //暂存数组  当搜索为空时候  数组展示所有数据
  },
  mounted() {},
  methods: {
    search() {
      // 配合watchSearch自动搜索
      // if (this.watchSearch) {
      //   this.tableData = this.stashList
      //   this.tableData = this.tableData.filter((item) => {
      //     return item[this.select].includes(this.watchSearch)
      //   })
      // } else {
      //   this.tableData = this.stashList
      // }
      // this.afreshTableList()
      // select 为空时候 提示选择搜索项
      if (this.select === '') {
        this.$message.error('请选择搜索项')
        return
      }

      if (this.searchContent) {
        this.tableList = this.tableData
        this.tableList = this.tableList.filter((item) => {
          return item[this.select].includes(this.searchContent)
        })
      } else {
        this.tableList = this.stashList
      }
      this.afreshTableList()
    },
    afreshTableList() {
      this.paginationData = [] //分页数组  tableData 所有的数据
      for (
        var j = this.pageSize * (this.currentPage - 1);
        j < this.pageSize * this.currentPage;
        j++
      ) {
        if (this.tableList[j]) {
          this.paginationData.push(this.tableList[j])
        }
      }
      this.total = this.tableList.length
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.afreshTableList()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.afreshTableList()
    },
    handleDetails(row) {
      console.log(row)
    },
    handleMoreCommand(command, row) {
      console.log(command, row)
      this.$notify({
        title: '成功',
        message: '点击了按钮' + command,
        type: 'success'
      })
    }
  }
}
</script>

<style scoped lang="scss">
.table-container {
  padding: 20px;

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
  width: 130px;
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
