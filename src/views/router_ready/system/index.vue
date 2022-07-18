<template>
  <div class="testedSystem">
    <div class="top">
      <div>
        <span class="title">被测信息系统</span>
        <el-select v-model="value" placeholder="请选择" @change="handleChange">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
      <div class="createSystem">
        <el-button type="primary" @click="addSystem"
          >新增被测信息系统</el-button
        >
      </div>
    </div>
    <div class="main">
      <div class="cardBox" v-for="item in cardForm">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <div class="cardHeader">
              <div>
                <span>{{ item.unitName }}</span>
              </div>
              <div>
                <el-dropdown style="padding: 0px 10px" @command="handleCommand">
                  <el-button type="primary" size="small" plain>
                    密码应用方案<i
                      class="el-icon-arrow-down el-icon--right"
                    ></i>
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="uploadPlan"
                      >上传密码应用方案</el-dropdown-item
                    >
                    <el-dropdown-item command="downloadPlan"
                      >下载密码应用方案</el-dropdown-item
                    >
                    <el-dropdown-item command="managePlan" divided
                      >管理密码应用方案</el-dropdown-item
                    >
                  </el-dropdown-menu>
                </el-dropdown>
                <el-dropdown @command="handleCommand">
                  <el-button type="primary" size="small" plain>
                    专家评审意见<i
                      class="el-icon-arrow-down el-icon--right"
                    ></i>
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="uploadOpinion"
                      >上传专家评审意见</el-dropdown-item
                    >
                    <el-dropdown-item command="downloadOpinion"
                      >下载专家评审意见</el-dropdown-item
                    >
                    <el-dropdown-item command="manageOpinion" divided
                      >管理专家评审意见</el-dropdown-item
                    >
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
            </div>
          </div>
          <div class="card-body">
            <div class="table-container">
              <el-table :data="item.gridData">
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
                <el-table-column fixed="right" label="操作">
                  <!-- <template slot="header" slot-scope="scope">
                    <el-button
                      type="primary"
                      size="mini"
                      @click="handleAddSystem"
                      >新增</el-button
                    >
                  </template> -->
                  <template slot-scope="scope" class="btnBox">
                    <el-button
                      @click.native.prevent="
                        reviewToPrepare(scope.$index, item.gridData)
                      "
                      type="text"
                      size="small"
                    >
                      评测准备
                    </el-button>
                    <el-button
                      @click.native.prevent="
                        reviewToPrepare(scope.$index, item.gridData)
                      "
                      type="text"
                      size="small"
                    >
                      预览评测准备
                    </el-button>

                    <el-popover
                      placement="left"
                      width="700"
                      trigger="click"
                      title="系统标准等级"
                    >
                      <el-table :data="sysLvData">
                        <el-table-column
                          width="250"
                          property="unit"
                          label="标准制定单位"
                        ></el-table-column>
                        <el-table-column
                          width="500"
                          property="standard"
                          label="评测标准"
                        ></el-table-column>
                        <el-table-column
                          width="200"
                          property="lv"
                          label="安全要求等级"
                        ></el-table-column>
                      </el-table>
                      <el-button
                        slot="reference"
                        @click.native.prevent="
                          systemStandardLevel(scope.$index, item.gridData)
                        "
                        type="text"
                        size="small"
                      >
                        系统标准等级
                      </el-button>
                    </el-popover>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'testedSystem',
  components: {},
  props: {},
  data() {
    return {
      options: [
        {
          value: '湖南省工商银行',
          label: '湖南省工商银行'
        },
        {
          value: '中国银行广东省分行',
          label: '中国银行广东省分行'
        }
      ],
      value: '',
      cardForm: [
        {
          unitName: '电话银行系统',
          gridData: [
            {
              name: '电话银行系统',
              abbr: '电话银行系统',
              state: '是'
            }
          ]
        },
        {
          unitName: '网上银行系统',
          gridData: [
            {
              name: '网上银行系统',
              abbr: '网上银行系统',
              state: '是'
            }
          ]
        }
      ],
      sysLvData: [
        {
          unit: '中国国家标准化管理委员会',
          standard: 'GB/T 39786-2021 信息安全技术 信息系统密码应用基本要求',
          lv: '第二级'
        }
      ],
      show: false
    }
  },
  computed: {},
  watch: {},
  created() {
    this.value = this.options[0].value
  },
  mounted() {},
  methods: {
    handleChange(value) {
      console.log(value)
    },
    addSystem() {
      console.log('新增被测信息系统')
    },
    reviewToPrepare(index, data) {
      console.log(index, data)
    },
    handleCommand(command) {
      this.$message('click on item ' + command)
    },
    systemStandardLevel(index, data) {
      console.log(index, data)
    }
  }
}
</script>

<style scoped lang="scss">
.testedSystem {
  padding: 20px;
  .top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    text-align: center;
  }
  .title {
    font-size: 16px;
    font-weight: bold;
    margin: 20px;
  }
  .cardBox {
    margin-top: 20px;
  }
  .cardHeader {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .collapseTitle {
    font-size: 20px;
    font-weight: bold;
    margin: 50px;
  }
}
.el-button {
  margin-left: 10px;
}
</style>
