<template>
  <div class="globalPageTemplate">
    <dynamic-table
      :tableData="tableData"
      :formThead="formThead"
      :moreButton="moreButton"
    ></dynamic-table>
  </div>
</template>

<script>
import { requestMain } from '@/api/main'
import dynamicTable from '@/components/dynamicTable/index.vue'
export default {
  name: 'globalPageTemplate',
  components: {
    dynamicTable
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
      ]
    }
  },
  computed: {},
  watch: {},
  created() {
    // 获取路由的参数
    this.routeParams = this.$route.meta
    console.log('routeParams:', this.routeParams)
    this.init()
  },
  mounted() {},
  methods: {
    init() {
      let requestMainData = {
        operationID: this.routeParams.operationID,
        resId: this.routeParams.resId,
        rel: this.routeParams.rel,
        tblAlias: this.routeParams.tblAlias,
        isOperatorSingleRec: '0',
        SYSTEMKEYNAME: window.localStorage.getItem('SYSTEMKEYNAME'),
        SYSTEMTELLERNO: window.localStorage.getItem('SYSTEMTELLERNO')
      }
      requestMain(requestMainData).then((res) => {
        console.log('requestMain:', res)
        this.tableData = res.list
        this.thead = res.sqlFlag
        console.log('tableData:', this.tableData)
        console.log('thead:', this.thead)

        this.formThead = this.formatThead(this.thead)

        console.log('formThead:', this.formThead)
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
    }
  }
}
</script>

<style scoped lang="less"></style>
