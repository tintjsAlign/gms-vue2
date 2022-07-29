<template>
  <div class="search-container">
    <el-row :gutter="20" style="margin: 10px;width:100%" >
      <el-col
        :span="5"
        v-for="(input, index) in searchData"
        :key="index"
        style="margin-top: 10px"
      >
        <el-tooltip class="item" effect="dark" :content="input.remark" placement="top-start">
        <el-input
          v-model="form[input.FldName]"
          :placeholder="input.remark"
          size="mini"
          clearable
        >
        <!-- <el-input
          v-model="form[input.FldName]"
          :placeholder="input.remark"
          size="mini"
          @focus="onFocus(input,index)"
          @blur="onBlur(input,index)"
        > -->
          <!-- <template slot="prepend" v-if="showInputName[index]">{{
            input.remark
          }}</template> -->
        </el-input>
      </el-col>
    </el-row>
    <el-row :gutter="5" style="margin: 10px" class="bottonBox">
      <el-col :span="12">
        <el-dropdown size="small" placement="bottom" @command="handleCommand">
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          plain
          @click="search"
          style="margin-top: 10px"
        >
          搜索
        </el-button>

        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item icon="el-icon-search" command="accurate">精确搜索</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      </el-col>
        <!-- 重置 -->
      <el-col :span="12">
        <el-button
          type="info"
          icon="el-icon-refresh"
          size="mini"
          plain
          @click="reset"
          style="margin-top: 10px"
        >
          重置
        </el-button>
      </el-col>
      
  </div>
</template>

<script>
import { requestMain } from '@/api/main'
import DropdownMenu from '@/components/Share/DropdownMenu'
export default {
  name: '',
  components: { DropdownMenu },
  props: {
    searchData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      searchLists: [],
      form: {},
      showInputName: [],
    }
  },
  computed: {},
  watch: {},
  created() {
    // 获取路由的参数
    this.routeParams = this.$route.meta
    console.log('搜索routeParams:', this.routeParams)
  },
  mounted() {},
  methods: {
    onFocus(input, index) {
      // 获取焦点时,展示当前prepend
      this.showInputName[index] = false
    },
    onBlur(input, index) {
      // 失去焦点时,展示当前prepend
      this.showInputName[index] = true
    },
    mainEnter(item) {
      console.log('mainEnter:', item)
      // 判断按钮功能
      if (item.operationID === 1 && item.condition) {
        // 打开抽屉-填表单
        this.$emit('openDrawer', item)
      } else if (item.operationID === 51) {
        // 查询所有数据,重新渲染表格
        this.$emit('queryAllData')
      }
    },
    search(command) {
      console.log('search:', this.form)
      let data = {
        SYSTEMKEYNAME: window.localStorage.getItem('SYSTEMKEYNAME'),
        SYSTEMTELLERNO: window.localStorage.getItem('SYSTEMTELLERNO'),
      }
      // 合并表单数据
      Object.assign(data, this.form)
      // 合并路由参数
      Object.assign(data, this.routeParams)
      data.pageNum = 1
      data.numPerPage = 5
      data.operationID = 51
      data.isBlur= '1'
      if (command === 'accurate') {
        data.UI_ACCURATEQUERY = '1'
        
      }
      console.log('searchData:', data)
      // 发送请求
      requestMain(data).then(res => {
        console.log('search:', res)
        this.$emit('searchResult', res)
      })
    },
    handleCommand(command) {
      if (command === 'accurate') {
        this.search(command)
      }
    },
    reset() {
      this.form = {}
    }
  }
}
</script>

<style scoped lang="scss">
.search-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  .bottonBox {
    // 从上到下排列
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    
  }
}
</style>
