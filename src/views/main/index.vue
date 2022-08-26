<template>
  <div class="globalPageTemplate">
    <div class="dynamic-search">
      <dynamic-search :searchData="searchLists" :currentPage="currentPage" :pageSize="pageSize" @searchResult="searchResult"></dynamic-search>
    </div>
    <dynamic-table
      :tableData="tableDataFinal"
      :originTableData="originTableData"
      :formThead="formThead"
      :requestData="routeParams"
      @searchResult="searchResult"
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
import dynamicTable from '@/components/DynamicTable/index.vue'
import dynamicSearch from '@/components/DynamicSearch/index.vue'
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
      treeQuery: false,
      routeParams: {},
      formThead: [],
      tableData: [],
      total: 0, //数组总数
      currentPage: 1, //当前页
      pageSize: 10, //每页数据
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
    console.log('this.$route::', this.$route)
    if (this.$route.query.meta) {
      this.routeParams = this.$route.query.meta
      this.treeQuery = true
      this.title = this.routeParams.itemName
    } else {
      this.routeParams = this.$route.meta
    }
    console.log('MAIN routeParams:', this.routeParams)
    this.currentPage = 1
    this.pageSize = 10
    this.init()
  },
  mounted() {},
  methods: {
    show(data) {
      console.log('MAIN show:', data)
      this.routeParams = data
      this.title = this.routeParams.itemName
      this.currentPage = 1
      this.pageSize = 10
      this.init()
    },
    goBack() {
      this.$router.go(-1)
    },
    init(searchReqData) {
      let requestMainData = {
        pageNum: this.currentPage,
        numPerPage: this.pageSize,
        SYSTEMKEYNAME: window.localStorage.getItem('SYSTEMKEYNAME'),
        SYSTEMTELLERNO: window.localStorage.getItem('SYSTEMTELLERNO')
      }
      Object.assign(requestMainData, this.routeParams)

      if (searchReqData) {
        // 合并requestMainData
        requestMainData = Object.assign(requestMainData, searchReqData)
        requestMainData.pageNum = this.currentPage
        requestMainData.numPerPage = this.pageSize
      }
      requestMain(requestMainData).then((res) => {
        console.log('requestMain:', res)
        if (res[0].list.length > this.pageSize) {
          this.init()
        } else {
          this.tableData = res[0].list
          this.formThead = res[1].sqlFlag
          this.searchLists = res[1].queryFlag
          this.total = Number(res[0].totalRecNum)

          this.originTableData = this.$_.cloneDeep(this.tableData)
          console.log('初始tableData:', this.originTableData)
          console.log('searchLists:', this.searchLists)
          console.log('total:', this.total)
          let originSearchLists = JSON.parse(JSON.stringify(this.searchLists))
          this.formatEnum(originSearchLists)

          this.searchLists = this.formatSearchLists(this.searchLists)

          console.log('searchLists:', this.searchLists)
          this.tableDataFinal = this.tableData
        }
        // this.thead.forEach((item) => {
        //   this[item.key] = item.value
        // })
      })
    },
    formatSearchLists(list) {
      // 处理搜索列表,去掉remark的冒号
      list.forEach((item) => {
        if (item.remark) {
          item.remark = item.remark.replace(':', '')
        }
      })
      return list
    },
    formatEnum(data) {
      console.log('formatEnum data:', data)

      data.forEach((item) => {
        if (item.otherProperties.textType === 'enum') {
          // console.log('item value:', value)
          requestMain({
            SYSTEMKEYNAME: window.localStorage.getItem('SYSTEMKEYNAME'),
            SYSTEMTELLERNO: window.localStorage.getItem('SYSTEMTELLERNO'),
            operationID: item.otherProperties.operationIDForSuggest,
            condition: item.condition
          }).then((res) => {
            console.log('queryEnum枚举:', res)
            this.enumRes = res
            this.queryEnum(item)
          })
        }
      })
    },
    queryEnum(item) {
      // 对枚举数据进行处理
      this.tableData.forEach((table) => {
        let value
        value = table[item.fldName]
        this.enumRes.forEach((item2) => {
          if (value === item2.value) {
            this.text = item2.remark
          }
        })
        // 替换tableData中的值
        table[item.fldName] = this.text
      })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.init(this.searchReqData)
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.init(this.searchReqData)
    },
    searchResult(searchData, data) {
      this.tableDataFinal = []
      if (data) {
        this.searchReqData = data
      }
      console.log('查询结果:', searchData)
      this.originTableData = this.$_.cloneDeep(searchData[0].list)
      console.log('初始tableData:', this.originTableData)
      this.tableData = searchData[0].list
      this.formatEnum(searchData[1].queryFlag)
      this.tableDataFinal = this.tableData
      this.total = Number(searchData[0].totalRecNum)
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