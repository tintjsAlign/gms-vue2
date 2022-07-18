<template>
  <div class="personnel">
    <div class="top">
      <div class="block">
        <span class="demonstration">{{ title }}</span>
        <el-cascader
          v-model="value"
          :options="options"
          @change="handleChange"
        ></el-cascader>
      </div>
      <div class="createPersonnel">
        <el-button type="primary" @click="addPersonnel"
          >新增系统测评人员</el-button
        >
      </div>
    </div>
    <div class="main">
      <el-table :data="personnelLists" style="width: 100%">
        <el-table-column prop="name" label="姓名" width="180">
        </el-table-column>
        <el-table-column prop="role" label="担任角色"> </el-table-column>
        <el-table-column prop="division" label="任务分工"> </el-table-column>
        <el-table-column prop="charge" label="是否负责人"> </el-table-column>
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="handleEdit(scope.$index, scope.row)"
            >
              修改
            </el-button>
            <el-button
              type="text"
              size="small"
              @click="handleDelete(scope.$index, scope.row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <add-personnel ref="addPersonnelRef"></add-personnel>
  </div>
</template>

<script>
import AddPersonnel from './components/AddPersonnel.vue'
export default {
  name: 'personnel',
  components: {
    AddPersonnel
  },
  props: {},
  data() {
    return {
      title: '选择信息系统查看评测人员',
      value: [],
      options: [
        {
          value: '湖南省工商银行',
          label: '湖南省工商银行',
          children: [
            {
              value: '网上银行系统',
              label: '网上银行系统'
            },
            {
              value: '电话银行系统',
              label: '电话银行系统'
            }
          ]
        },
        {
          value: '中国银行广东省分行',
          label: '中国银行广东省分行',
          children: [
            {
              value: '密钥管理系统',
              label: '密钥管理系统'
            }
          ]
        }
      ],
      personnelLists: [],
      tableData: [
        {
          name: '王五',
          role: '测试负责人',
          division: '应用和数据安全',
          charge: '是'
        },
        {
          name: '王小五',
          role: '测试员',
          division: '应用和数据安全',
          charge: '否'
        }
      ]
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    handleChange(value) {
      console.log(value)
      this.title = value[0] + ' / ' + value[1]
      this.personnelLists = this.tableData
    },
    addPersonnel() {
      console.log('新增系统测评人员')
      this.$refs.addPersonnelRef.show()
    },
    handleEdit(index, row) {
      this.dialog = true
      this.form = row
    },
    handleDelete(index, row) {
      this.$confirm('确定要删除吗？')
        .then((_) => {
          this.form.splice(index, 1)
        })
        .catch((_) => {})
    }
  }
}
</script>

<style scoped lang="scss">
.personnel {
  padding: 20px;
  .top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    text-align: center;
  }
  .demonstration {
    font-size: 16px;
    color: rgb(30, 28, 28);
    margin: 10px;
  }
}
</style>
