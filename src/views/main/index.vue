<template>
  <div class="globalPageTemplate">
    <div class="dynamic-search">
      <dynamic-search :searchData="searchLists" :currentPage="currentPage" :pageSize="pageSize" @searchResult="searchResult"></dynamic-search>
    </div>
    <dynamic-table
      v-if="tableShow"
      :tableData="tableDataFinal"
      :originTableData="originTableData"
      :formThead="formThead"
      :requestData="routeParams"
      :searchReqData="searchReqData"
      @searchResult="searchResult"
      @refreshMain="refreshMain"
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

    <show-file-content ref="showFileContent"></show-file-content>
  </div>
</template>

<script>
import { Notification } from 'element-ui'
import { requestMain } from '@/api/main'
import dynamicTable from '@/components/DynamicTable/index.vue'
import dynamicSearch from '@/components/DynamicSearch/index.vue'
import showFileContent from '@/components/ShowFileContent'
export default {
  name: 'globalPageTemplate',
  inject: ['reload'],
  components: {
    dynamicTable,
    dynamicSearch,
    showFileContent
  },
  props: {},
  data() {
    return {
      tableShow: true,
      treeQuery: false,
      routeParams: {},
      formThead: [],
      tableData: [],
      searchLists: [],
      searchReqData: {},
      tableDataFinal: [],
      total: 0, //数组总数
      currentPage: 1, //当前页
      pageSize: 10, //每页数据
      paginationData: [] //分页数组
    }
  },
  computed: {},
  watch: {
    $route(newValue, oldValue) {
      // 此处写router变化时，想要初始化或者是执行的方法......
      // console.log('Main router变化:', newValue, oldValue)
      this.reload()
    }
  },
  created() {
    Notification.closeAll()
    // 获取路由的参数
    console.log('this.$route::', this.$route)
    if (this.$route.query.meta) {
      this.routeParams = this.$route.query.meta
      this.treeQuery = true
      this.title = this.routeParams.itemName
    } else if (this.$route.params.metaMain && this.$route.params.metaMain !== '[object Object]') {
      console.log('MAIN routeParams this.$route.params.metaMain:', this.$route.params.metaMain)
      this.routeParams = this.$route.params.metaMain
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
      this.tableShow = false
      let requestMainData = {
        pageNum: this.currentPage,
        numPerPage: this.pageSize,
        SYSTEMKEYNAME: window.sessionStorage.getItem('SYSTEMKEYNAME'),
        SYSTEMTELLERNO: window.sessionStorage.getItem('SYSTEMTELLERNO')
        // tblAlias: this.routeParams.tblAlias,
        // resId: this.routeParams.resId,
        // operationID: this.routeParams.operationID,
      }
      Object.assign(requestMainData, this.routeParams)

      if (searchReqData) {
        // 合并requestMainData
        requestMainData = Object.assign(requestMainData, searchReqData)
        requestMainData.pageNum = this.currentPage
        requestMainData.numPerPage = this.pageSize
      }

      console.log('requestMainData!!!', requestMainData)
      requestMain(requestMainData)
        .then((res) => {
          console.log('requestMain:', res)
          // if (res[0].list.length > this.pageSize) {
          //   this.init()
          // } else {
          this.tableData = res[0].list
          this.formThead = res[1].sqlFlag
          this.searchLists = res[1].queryFlag
          this.total = Number(res[0].totalRecNum)

          this.tableShow = true

          this.originTableData = this.$_.cloneDeep(this.tableData)
          console.log('初始tableData:', this.originTableData)
          console.log('searchLists:', this.searchLists)
          console.log('total:', this.total)
          let originSearchLists = JSON.parse(JSON.stringify(this.searchLists))
          this.formatEnum(originSearchLists)
          this.formatDate(this.formThead)

          this.searchLists = this.formatSearchLists(this.searchLists)

          console.log('searchLists:', this.searchLists)
          this.tableDataFinal = this.tableData
          // }
          // this.thead.forEach((item) => {
          //   this[item.key] = item.value
          // })
        })
        .catch((err) => {
          this.tableShow = true
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
          requestMain(
            {
              SYSTEMKEYNAME: window.sessionStorage.getItem('SYSTEMKEYNAME'),
              SYSTEMTELLERNO: window.sessionStorage.getItem('SYSTEMTELLERNO'),
              operationID: item.otherProperties.operationIDForSuggest,
              condition: item.condition
            },
            'unshow'
          ).then((res) => {
            console.log(`queryEnum枚举[${item.remark}]:`, res)
            this.enumRes = res
            this.queryEnum(item)
          })
        }

        // if (item.remark.indexOf('日期') > -1) {
        //   console.log('formatEnum日期格式化:',item)
        //   // 对日期数据进行处理
        //   this.tableData.forEach((table) => {
        //     // 替换tableData中的值
        //     if (table[item.fldName]) {
        //       let value = table[item.fldName]
        //       table[item.fldName] = this.$dayjs(value).format('YYYY-MM-DD')
        //     } else {
        //       return
        //     }
        //   })
        // }
      })
    },
    formatDate(data) {
      console.log('formatDate data:', data)
      data.forEach((item) => {
        if (item.fldAlais.indexOf('日期') > -1) {
          console.log('formatDate日期格式化:', item)
          // 对日期数据进行处理
          this.tableData.forEach((table) => {
            // 替换tableData中的值
            if (table[item.queryFldName]) {
              let value = table[item.queryFldName]
              table[item.queryFldName] = this.$dayjs(value).format('YYYY-MM-DD')
            } else {
              return
            }
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
    refreshMain() {
      this.init()
    },
    searchResult(searchData, data) {
      this.tableShow = false
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
      this.tableShow = true
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
