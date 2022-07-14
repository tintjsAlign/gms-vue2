<template>
  <div class="tested">
    <div class="top">
      <div class="title">被测单位信息</div>
      <div class="createUnit">
        <el-button type="primary" @click="addUnit">新增被测单位</el-button>
      </div>
    </div>
    <div class="cardBox" v-for="item in cardForm">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>{{ item.unitName }}</span>
          <el-button
            style="float: right; padding: 3px 0"
            type="text"
            @click="checkSystem(item)"
            >查看被测信息系统</el-button
          >
        </div>
        <div class="card-body">
          <el-descriptions direction="vertical" :column="4">
            <el-descriptions-item label="测评委托单位">{{
              item.entrustUnit
            }}</el-descriptions-item>
            <el-descriptions-item label="地址">{{
              item.address
            }}</el-descriptions-item>
            <el-descriptions-item label="联系人">{{
              item.contact
            }}</el-descriptions-item>
            <el-descriptions-item label="备案">{{
              item.keep
            }}</el-descriptions-item>
          </el-descriptions>
        </div>
      </el-card>
    </div>
    <footer class="footer">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-size="pageSize"
        layout="total, prev, pager, next"
        :total="50"
      >
      </el-pagination>
    </footer>

    <add-unit ref="addUnitRef"></add-unit>
    <see-info ref="seeInfoRef"></see-info>
  </div>
</template>

<script>
import AddUnit from './components/AddUnit'
import SeeInfo from './components/SeeInfo.vue'
export default {
  name: 'tested',
  components: {
    AddUnit,
    SeeInfo
  },
  props: {},
  data() {
    return {
      currentPage: 1,
      pageSize: 5,
      cardForm: [
        {
          unitName: '湖南省工商银行',
          entrustUnit: '湖南省工商银行',
          address: '湖南省/长沙市/天心区',
          contact: '张三',
          keep: '否'
        },
        {
          unitName: '中国银行广东省分行',
          entrustUnit: '中国银行广东省分行',
          address: '广东省/广州市/越秀区',
          contact: '李四',
          keep: '否'
        }
      ]
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    addUnit() {
      this.$refs.addUnitRef.show()
    },
    checkSystem(item) {
      this.$refs.seeInfoRef.show(item)
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
    }
  }
}
</script>

<style scoped lang="scss">
.tested {
  padding: 20px;
  .top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    text-align: center;
  }
  .title {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 20px;
  }
  .cardBox {
    margin-bottom: 20px;
  }
  // 固定在右下角的分页条
  .footer {
    position: fixed;
    bottom: 0;
    right: 0;
    padding: 20px;
    background: #fff;
  }
}
</style>
