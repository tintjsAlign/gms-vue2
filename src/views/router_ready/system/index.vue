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
            <span>{{ item.unitName }}</span>
            <!-- <el-button
              style="float: right; padding: 3px 0"
              type="text"
              @click="checkSystem(item)"
              >展开</el-button
            > -->
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
                  <template slot-scope="scope">
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
}
</style>
