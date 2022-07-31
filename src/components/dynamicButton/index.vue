<template>
  <div class="button-container">
    <el-row :gutter="10" type="flex">
      <el-col v-for="(item, index) in btnLists" :key="index">
        <el-button
          type="primary"
          plain
          size="small"
          @click="mainEnter(item)"
          v-if="item.resId !== 990"
          >{{ item.itemName }}</el-button
        >
        <el-dropdown trigger="click" v-else @command="mainCommand">
          <el-button
            type="primary"
            @click="getDropdownBtn(item)"
            plain
            size="small"
          >
            {{ item.itemName }}<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              v-for="(btn, i) in dropdownBtnList"
              :key="i"
              :command="btn.itemName"
              >{{ btn.itemName }}</el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { requestMain, getRecordMenuGrp, getMenuLvAfter } from '@/api/main'
export default {
  name: '',
  components: {},
  props: {
    requestData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      btnLists: [],
      dropdownBtnList: []
    }
  },
  computed: {
    operationTarget() {
      return this.$store.state.settings.operationTarget
    }
  },
  watch: {},
  created() {
    this.init()
  },
  mounted() {},
  methods: {
    init() {
      console.log('requestData:', this.requestData)
      this.btnLists = []
      this.queryPermanentButtonList()
    },
    // 查询常驻按钮列表
    queryPermanentButtonList() {
      let requestMainData = {
        operationID: this.requestData.operationID,
        resId: this.requestData.resId,
        rel: this.requestData.itemName,
        tblAlias: this.requestData.tblAlias,
        // isOperatorSingleRec: '0',
        SYSTEMKEYNAME: window.localStorage.getItem('SYSTEMKEYNAME'),
        SYSTEMTELLERNO: window.localStorage.getItem('SYSTEMTELLERNO'),
        isBtn: '1'
      }
      requestMain(requestMainData).then((res) => {
        console.log('requestMain Btn:', res)
        // 剔除'编辑本视图'按钮
        let btnLists = res.filter((item) => {
          return item.itemName !== '编辑本视图'
        })
        // 对比数组中的对象进行去重
        var a = {}
        btnLists.map((item) => {
          a[Object.values(item).sort() + '']
            ? null
            : (a[Object.values(item).sort() + ''] = item)
        })
        a = Object.values(a)
        // this.mainBtnLists = [...new Set(btnLists)]
        this.mainBtnLists = a
        this.btnLists = this.mainBtnLists
        console.log('去重后this.btnLists:', this.btnLists)

        this.querySelectItemButtonList()
      })
    },
    // 查询选择记录按钮列表
    querySelectItemButtonList() {
      let requestMainData = {
        tblAlias: this.requestData.tblAlias,
        SYSTEMKEYNAME: window.localStorage.getItem('SYSTEMKEYNAME'),
        SYSTEMTELLERNO: window.localStorage.getItem('SYSTEMTELLERNO')
      }
      getRecordMenuGrp(requestMainData).then((res) => {
        console.log('getRecordMenuGrp Btn:', res)
        // 单独拎出'记录管理'按钮, 其它合并为一份,并且去重
        let operationBtn = res.filter((item) => {
          return item.itemName === '记录管理'
        })
        this.operationBtn = operationBtn[0]
        console.log('operationBtn:', this.operationBtn)
        // 通过this.operationBtn查询通用操作按钮列表
        this.queryCommonButtonList(this.operationBtn)

        let btnLists = res.filter((item) => {
          return item.itemName !== '记录管理'
        })
        this.recordMenuGrp = [...new Set(btnLists)]
        console.log('选择记录按钮组recordMenuGrp:', this.recordMenuGrp)
      })
    },
    queryCommonButtonList(condition) {
      let requestMainData = {
        resId: condition.resId,
        operationID: condition.operationID,
        tblAlias: condition.tblAlias,
        SYSTEMKEYNAME: window.localStorage.getItem('SYSTEMKEYNAME'),
        SYSTEMTELLERNO: window.localStorage.getItem('SYSTEMTELLERNO'),
        isBtn: '1'
      }
      requestMain(requestMainData).then((res) => {
        console.log('记录操作 Btn:', res)
        // 传回给父组件
        this.$emit('getRecordBtn', res)
      })
    },
    replaceButtonGroup(flag) {
      if (flag) {
        console.log('以选中,替换按钮组')
        this.btnLists = [...new Set(this.recordMenuGrp)]
      } else {
        console.log('取消选中,替换按钮组')
        this.$emit('replaceButtonGroup')
        this.btnLists = [...new Set(this.mainBtnLists)]
      }
    },

    mainEnter(btn) {
      console.log('mainEnter:', btn)
      // 判断按钮功能
      if (btn.operationID === 1 && btn.condition) {
        // 打开抽屉-填表单
        this.$emit('openDrawer', btn)
      } else if (btn.operationID === 51) {
        // 查询所有数据,重新渲染表格
        this.$emit('queryAllData', btn)
      }
    },
    getDropdownBtn(item) {
      let data = {
        SYSTEMKEYNAME: window.localStorage.getItem('SYSTEMKEYNAME'),
        SYSTEMTELLERNO: window.localStorage.getItem('SYSTEMTELLERNO'),
        tblAlias: item.tblAlias
      }
      getMenuLvAfter(data).then((res) => {
        console.log('getMenuLvAfter:', res)
        this.dropdownBtnList = res.filter((item) => {
          return item.itemName !== '编辑本视图'
        })
      })
    },
    mainCommand(command) {
      console.log('mainCommand:', command)
    }
  }
}
</script>

<style scoped lang="scss"></style>
