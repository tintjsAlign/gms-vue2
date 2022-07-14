<template>
  <div class="AddUnit">
    <el-drawer
      title="新增被测单位"
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
            <el-input v-model="form.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="单位类型" :label-width="formLabelWidth">
            <el-select v-model="form.region" placeholder="请选择单位类型">
              <el-option label="国有企业" value="guoyou"></el-option>
              <el-option label="私营企业" value="siying"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="单位地址"
            prop="address"
            :label-width="formLabelWidth"
          >
            <address-cascader @areaValue="selectArea"></address-cascader>
          </el-form-item>
          <el-form-item label="单位详情" :label-width="formLabelWidth">
            <el-input type="textarea" v-model="form.desc"></el-input>
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
  name: 'AddUnit',
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
        name: '',
        region: '',
        resource: '',
        address: '',
        desc: ''
      },
      formLabelWidth: '80px',
      timer: null
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
.AddUnit {
  .demo-drawer__content {
    padding: 20px;
  }
  .demo-drawer__footer {
    // 向右对齐
    text-align: right;
  }
}
</style>
