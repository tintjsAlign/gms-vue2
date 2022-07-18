<template>
  <div class="testTools">
    <div class="top">
      <div class="block">
        <span class="demonstration">{{ cardTitle }}</span>
        <el-cascader
          v-model="value"
          :options="options"
          @change="handleChange"
        ></el-cascader>
      </div>
      <div class="createPersonnel">
        <el-button type="primary" @click="addTools">新增现场测试工具</el-button>
      </div>
    </div>
    <div class="main">
      <div class="cardBox" v-for="item in toolsTypes">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>{{ item }}</span>
            <!-- <el-button
              style="float: right; padding: 3px 0"
              type="text"
              @click="checkSystem(item)"
              >查看被测信息系统</el-button
            > -->
          </div>
          <div class="card-body">
            <!-- <el-descriptions direction="vertical" :column="4">
              <el-descriptions-item label="现场测试工具类别">{{
                item.toolsType
              }}</el-descriptions-item>
              <el-descriptions-item label="现场测试工具">{{
                item.tool
              }}</el-descriptions-item>
              <el-descriptions-item label="版本">{{
                item.version
              }}</el-descriptions-item>
              <el-descriptions-item label="生产厂商">{{
                item.manufacturer
              }}</el-descriptions-item>
            </el-descriptions> -->
            <el-table :data="filterCardForm(item)" style="width: 100%">
              <el-table-column prop="toolsType" label="现场测试工具类别">
              </el-table-column>
              <el-table-column prop="tool" label="现场测试工具">
              </el-table-column>
              <el-table-column prop="version" label="版本"> </el-table-column>
              <el-table-column prop="manufacturer" label="生产厂商">
              </el-table-column>
              <el-table-column prop="instructions" label="说明">
              </el-table-column>
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
        </el-card>
      </div>
    </div>

    <add-tool ref="addToolRef"></add-tool>
  </div>
</template>

<script>
import AddTool from './components/AddTool.vue'
export default {
  name: 'testTools',
  components: {
    AddTool
  },
  props: {},
  data() {
    return {
      cardTitle: '选择信息系统查看现场评测工具',
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
      toolsTypes: [],
      cardForm: [
        {
          toolsType: '报文测试工具',
          tool: 'TCPIP报文测试工具',
          version: '1.0',
          manufacturer: '北京江南天安科技有限公司',
          instructions: ''
        },
        {
          toolsType: '算法测试工具',
          tool: '对称算法测试工具',
          version: '1.0',
          manufacturer: '北京江南天安科技有限公司',
          instructions: ''
        },
        {
          toolsType: '算法测试工具',
          tool: '非对称算法测试工具',
          version: '1.0',
          manufacturer: '北京江南天安科技有限公司',
          instructions: ''
        }
      ]
    }
  },
  computed: {},
  watch: {},
  created() {
    this.formatData()
  },
  mounted() {},
  methods: {
    // 处理data
    formatData() {
      // 提取this.cardForm里的toolsType,并去重
      this.toolsTypes = []
      this.cardForm.forEach((item) => {
        this.toolsTypes.push(item.toolsType)
      })
      this.toolsTypes = Array.from(new Set(this.toolsTypes))
      console.log(this.toolsTypes)
    },
    // 根据toolsType过滤cardForm
    filterCardForm(toolsType) {
      return this.cardForm.filter((item) => {
        return item.toolsType === toolsType
      })
    },
    handleChange(value) {
      console.log(value)
      this.cardTitle = value[0] + ' / ' + value[1]
      this.personnelLists = this.tableData
    },
    addTools() {
      console.log('新增系统测评人员')
      this.$refs.addToolRef.show()
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
.testTools {
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
  .cardBox {
    margin-bottom: 20px;
  }
}
</style>
