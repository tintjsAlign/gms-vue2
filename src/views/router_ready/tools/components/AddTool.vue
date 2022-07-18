<template>
  <div class="AddPersonnel">
    <el-drawer
      title="新增现场测评工具"
      :before-close="handleClose"
      :visible.sync="dialog"
      direction="rtl"
      custom-class="demo-drawer"
      ref="drawer"
      size="50%"
    >
      <div class="demo-drawer__content">
        <el-form :model="form">
          <el-form-item label="单位名称" :label-width="formLabelWidth">
            <el-select v-model="form.unitName" placeholder="请选择">
              <el-option
                v-for="item in unitNameOption"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="信息系统" :label-width="formLabelWidth">
            <el-select v-model="form.region" placeholder="请选择">
              <el-option
                v-for="item in systemOption"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="测评标准" :label-width="formLabelWidth">
            <el-select v-model="form.standard" placeholder="请选择">
              <el-option
                v-for="item in standardOption"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="姓名" :label-width="formLabelWidth">
            <el-input v-model="form.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="担任角色" :label-width="formLabelWidth">
            <el-select v-model="form.role" placeholder="请选择">
              <el-option
                v-for="item in roleOption"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="任务分工" :label-width="formLabelWidth">
            <el-input type="textarea" v-model="form.division"></el-input>
          </el-form-item>
          <el-form-item label="是否负责人" :label-width="formLabelWidth">
            <el-select v-model="form.charge" placeholder="请选择">
              <el-option label="否" value="否"></el-option>
              <el-option label="是" value="是"></el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item
            label="单位地址"
            prop="address"
            :label-width="formLabelWidth"
          >
            <address-cascader @areaValue="selectArea"></address-cascader>
          </el-form-item> -->
          <el-form-item label="备注" :label-width="formLabelWidth">
            <el-input type="textarea" v-model="form.remark"></el-input>
          </el-form-item>
          <el-form-item>
            <div class="demo-drawer__footer">
              <el-button @click="cancelForm">取 消</el-button>
              <el-button
                type="primary"
                @click="submitForm"
                :loading="loading"
                >{{ loading ? '提交中 ...' : '确 定' }}</el-button
              >
            </div>
          </el-form-item>
        </el-form>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import AddressCascader from '@/components/AddressCascader'

export default {
  name: 'AddPersonnel',
  emits: ['areaValue'],
  components: {
    AddressCascader
  },
  props: {},
  data() {
    return {
      dialog: false,
      loading: false,
      form: {
        unitName: '',
        name: '',
        // region: '',
        // resource: '',
        role: '',
        division: '',
        standard: '',
        charge: '',
        remark: ''
      },
      formLabelWidth: '100px',
      timer: null,
      unitNameOption: [
        {
          value: '湖南省工商银行',
          label: '湖南省工商银行'
        },
        {
          value: '中国银行广东省分行',
          label: '中国银行广东省分行'
        }
      ],
      systemOption: [
        {
          value: '电话银行系统',
          label: '电话银行系统'
        },
        {
          value: '网上银行系统',
          label: '网上银行系统'
        }
      ],
      standardOption: [
        {
          value: 'GB/T 39786-2021 信息安全技术 信息系统密码应用基本要求',
          label: 'GB/T 39786-2021 信息安全技术 信息系统密码应用基本要求'
        }
      ],
      roleOption: [
        {
          value: '系统测评人员',
          label: '系统测评人员'
        },
        {
          value: '系统测评管理员',
          label: '系统测评管理员'
        }
      ]
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    show() {
      this.dialog = true
    },
    handleClose(done) {
      if (this.loading) {
        return
      }
      this.$confirm('确定要提交表单吗？')
        .then((_) => {
          this.loading = true
          this.timer = setTimeout(() => {
            done()
            // 动画关闭需要一定的时间
            setTimeout(() => {
              this.loading = false
            }, 400)
          }, 2000)
        })
        .catch((_) => {})
    },
    cancelForm() {
      this.loading = false
      this.dialog = false
      clearTimeout(this.timer)
    },
    selectArea(area) {
      console.log('地区:', area)
      this.form.address = area
    },
    submitForm() {
      this.$confirm('确定要提交表单吗？')
        .then((_) => {
          this.loading = true
          this.timer = setTimeout(() => {
            // 动画关闭需要一定的时间
            setTimeout(() => {
              console.log(this.form)
              this.loading = false
              // this.$refs.drawer.closeDrawer()
            }, 400)
          }, 2000)
        })
        .catch((_) => {})
      // clearTimeout(this.timer)
    }
  }
}
</script>

<style scoped lang="scss">
.AddPersonnel {
  .demo-drawer__content {
    padding: 20px;
  }
  .demo-drawer__footer {
    // 向右对齐
    text-align: right;
  }
}
</style>
