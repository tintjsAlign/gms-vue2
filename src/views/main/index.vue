<template>
  <div class="globalPageTemplate">
    <div class="dynamic-search">
      <dynamic-search :searchData="searchLists" @searchResult="searchResult"></dynamic-search>
    </div>
    <dynamic-table
      :tableData="tableData"
      :formThead="formThead"
      :moreButton="moreButton"
      :requestData="routeParams"
    ></dynamic-table>
    <div class="pagination-container">
      <el-pagination
        background
        layout="total, sizes, prev, pager, next, jumper"
        :current-page="currentPage"
        :page-sizes="[5, 10, 20, 50]"
        :page-size.sync="pageSize"
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
import { requestMain } from '@/api/main'
import dynamicTable from '@/components/dynamicTable/index.vue'
import dynamicSearch from '@/components/dynamicSearch/index.vue'
export default {
  name: 'globalPageTemplate',
  inject: ['reload'],
  components: {
    dynamicTable,
    dynamicSearch
  },
  props: {},
  data() {
    return {
      routeParams: {},
      formThead: [],
      tableData: [],
      moreButton: [
        {
          buttonValue: '管理',
          buttonID: 'manage'
        },
        {
          buttonValue: '其它',
          buttonID: 'other'
        }
      ],
      total: 0, //数组总数
      currentPage: 1, //当前页
      pageSize: 5, //每页数据
      paginationData: [] //分页数组
    }
  },
  computed: {},
  watch: {
    $route() {
      // 此处写router变化时，想要初始化或者是执行的方法......
      this.reload()
    }
  },
  created() {
    // 获取路由的参数
    this.routeParams = this.$route.meta
    console.log('routeParams:', this.routeParams)
    this.currentPage = 1
    this.pageSize = 5
    this.init()
  },
  mounted() {},
  methods: {
    init() {
      let requestMainData = {
        pageNum: this.currentPage,
        numPerPage: this.pageSize,
        operationID: this.routeParams.operationID,
        resId: this.routeParams.resId,
        // rel: this.routeParams.rel,
        tblAlias: this.routeParams.tblAlias,
        // isOperatorSingleRec: '0',
        SYSTEMKEYNAME: window.localStorage.getItem('SYSTEMKEYNAME'),
        SYSTEMTELLERNO: window.localStorage.getItem('SYSTEMTELLERNO')
      }
      requestMain(requestMainData).then((res) => {
        console.log('requestMain:', res)
        if (res.list.length > this.pageSize) {
          this.init()
        } else {
          this.tableData = res.list
          this.thead = res.sqlFlag
          this.searchLists = res.queryFlag
          this.total = Number(res.totalRecNum)
          console.log('tableData:', this.tableData)
          // console.log('thead:', this.thead)
          console.log('total:', this.total)

          this.formThead = this.formatThead(this.thead)

          console.log('formThead:', this.formThead)
        }
        // this.thead.forEach((item) => {
        //   this[item.key] = item.value
        // })
      })
    },
    formatThead(theadPending) {
      // 处理表头数据格式,改键名
      let thead = []
      theadPending.forEach((item) => {
        thead.push({
          fldAlais: item.remark,
          queryFldName: item.FldName
        })
      })
      return thead
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.init()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.init()
    },
    searchResult(searchData) {
      this.tableData = searchData.list
      this.total = Number(searchData.totalRecNum)
    }
  }
}
</script>

<style scoped lang="scss">
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
  z-index: 100;
  // border-top: 1px solid #ebeef5;
  .el-pagination {
    margin: 0;
  }
}
</style>
