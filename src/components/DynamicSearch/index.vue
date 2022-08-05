<template>
  <div class="search-container">
    <el-row :gutter="20" style="margin: 10px;width:100%" >
      <el-col
        :span="5"
        v-for="(input, index) in searchData"
        :key="index"
        style="margin-top: 10px"
      >
        <el-tooltip class="item" effect="dark" :content="input.remark" open-delay="500" placement="top-start">
        
         <!-- enum类型--枚举选择框 ↓↓↓-->

          <el-select
            v-model="form[input.fldName]"
            :placeholder="input.remark"
            style="width: 100%"
            size="mini"
            @focus="queryOption(input)"
            @change="getChange($event, input, index)"
            v-if="input.otherProperties.textType.match(/enum/g)"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              ></el-option>
            </el-select>
        <!-- enum类型--枚举选择框 end ↑↑↑-->
        <!-- 普通类型--输入框 ↓↓↓-->
        <el-input
          v-model="form[input.fldName]"
          :placeholder="input.remark"
          size="mini"
          clearable
          v-else
        >
        </el-input>
        <!-- 普通类型--输入框 end ↑↑↑-->
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
export default {
  name: '',
  components: {  },
  props: {
    searchData: {
      type: Object,
      default: () => {}
    },
    currentPage: {
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number,
      default: 10
    },
  },
  data() {
    return {
      searchLists: [],
      form: {},
      showInputName: [],
      options: [],
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
      // data.pageNum = 1
      data.pageNum = this.currentPage
      data.numPerPage = this.pageSize
      data.operationID = 51
      data.isBlur= '1'
      if (command === 'accurate') {
        data.UI_ACCURATEQUERY = '1'
        
      }
      console.log('searchData:', data)
      // 发送请求
      requestMain(data).then(res => {
        console.log('search:', res)
        this.$emit('searchResult', res, data)
      })
    },
    handleCommand(command) {
      if (command === 'accurate') {
        this.search(command)
      }
    },
    reset() {
      this.form = {}
    },
    queryOption(item) {
      this.options = []
      // console.log('查询选择框参数', item)
      this.readName = item.otherProperties.fldName
      let data = {
        SYSTEMKEYNAME: window.localStorage.getItem('SYSTEMKEYNAME'),
        SYSTEMTELLERNO: window.localStorage.getItem('SYSTEMTELLERNO')
        // operationID: item.otherProperties.operationIDForSuggest,
        // readName: item.otherProperties.readFld,
        // condition:
      }
      // 如果this.form有值,则加入到data中
      if (this.form) {
        for (let key in this.form) {
          data[key] = this.form[key]
        }
      }
      data.operationID = item.otherProperties.operationIDForSuggest
      data.condition = encodeURI(item.condition)
      data.readName = item.otherProperties.fldName
      requestMain(data).then((res) => {
        if (res === []) {
          // 清空选择框和输入框
          this.options = []
          this.form[item.fldName] = ''
        }
        console.log('查询选择框数据', res)
        let options = []
        if (item.otherProperties.textType === 'enum') {
          // 拼装枚举options
          res.forEach((item) => {
            options.push({
              value: item.value,
              label: item.remark
            })
          })
        } else {
          // 拼装options
          res.forEach((item) => {
            options.push({
              value: item[this.readName],
              label: item[this.readName]
            })
          })
        }
        this.options = options
      })
    },
    getChange(e, item, index) {
      console.log('选择框变化', item)
      console.log('选择框变化值', e)
    },
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
