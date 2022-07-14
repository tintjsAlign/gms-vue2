<template>
  <div class="SeeInfo">
    <el-drawer
      :title="unitName"
      :visible.sync="table"
      direction="rtl"
      size="50%"
    >
      <div class="table-container">
        <el-table :data="gridData">
          <el-table-column
            property="name"
            label="信息系统名称"
          ></el-table-column>
          <el-table-column
            property="abbr"
            label="信息系统简称"
          ></el-table-column>
          <el-table-column
            property="state"
            label="启动"
            width="100"
          ></el-table-column>
          <el-table-column fixed="right" label="操作" width="120">
            <template slot="header" slot-scope="scope">
              <el-button type="primary" size="mini" @click="handleAddSystem"
                >新增</el-button
              >
            </template>
            <template slot-scope="scope">
              <el-button
                @click.native.prevent="deleteRow(scope.$index, gridData)"
                type="text"
                size="small"
              >
                移除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: 'SeeInfo',
  components: {},
  props: {},
  data() {
    return {
      table: false,
      unitName: '',
      gridData: [
        {
          name: '电话银行系统',
          abbr: '电话银行系统',
          state: '是'
        },
        {
          name: '网上银行系统',
          abbr: '网上银行系统',
          state: '是'
        },
        {
          name: '密钥管理系统',
          abbr: '密钥管理系统',
          state: '是'
        }
      ]
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    show(item) {
      this.unitName = item.unitName
      this.table = true
    },
    deleteRow(index, rows) {
      rows.splice(index, 1)
    },
    handleAddSystem() {
      console.log('新增信息系统')
    }
  }
}
</script>

<style scoped lang="scss">
.SeeInfo {
  .table-container {
    margin: 20px;
  }
}
</style>
