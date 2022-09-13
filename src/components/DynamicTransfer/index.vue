<template>
  <div class="container">
    <el-drawer
      :visible.sync="innerDrawer"
      ref="innerDrawer"
      :title="drawerTitle"
      destroyOnClose
      :append-to-body="true"
      size="720px"
      direction="rtl"
      :before-close="handleClose"
    >
      <div class="drawer__top">
        <el-button type="primary" size="small" @click="submitForm" :loading="loading">{{ loading ? '提交中 ...' : '确 定' }}</el-button>
        <el-button size="small" @click="cancelForm">取 消</el-button>
      </div>
      <div class="transferBox">
        <el-transfer
          v-model="value"
          filterable
          :titles="['可选择项', '已选择项']"
          :format="{
            noChecked: '${total}',
            hasChecked: '${checked}/${total}'
          }"
          :data="data"
          :props="props"
          :render-content="renderFunc"
        ></el-transfer>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { requestMain } from '@/api/main'
export default {
  name: '',
  components: {},
  props: {},
  data() {
    const generateData = (_) => {
      const data = []
      for (let i = 1; i <= 15; i++) {
        data.push({
          key: i,
          label: `备选项 ${i}`
          // disabled: i % 4 === 0
        })
      }
      data.push(
        {
          key: 16,
          label: 'IPSEC/SSL协议检测工具'
        },
        {
          key: 17,
          label: '报文测试工具'
        }
      )
      return data
    }
    return {
      innerDrawer: false,
      loading: false,
      // data: generateData(),
      data: [],
      value: [],
      props: {
        label: 'label',
        key: 'key'
      }
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    show(data, params, value) {
      console.log('transfer参数', data, params, value)
      this.itemName = params.valueFldName
      this.drawerTitle = params.fldAlais
      let requestData = {
        SYSTEMKEYNAME: window.localStorage.getItem('SYSTEMKEYNAME'),
        SYSTEMTELLERNO: window.localStorage.getItem('SYSTEMTELLERNO')
        // queryTransferFlag: '1'
      }
      Object.assign(requestData, data)
      requestData.operationID = params.otherProperties.operationID
      requestData.condition = params.value

      // this.data = [
      //   {
      //     key: 1,
      //     label: 'IPSEC/SSL协议检测工具'
      //   },
      //   {
      //     key: 2,
      //     label: '报文测试工具'
      //   },
      //   {
      //     key: 3,
      //     label: '密码安全配置检查工具'
      //   },
      //   {
      //     key: 4,
      //     label: '密码基线检查工具'
      //   },
      //   {
      //     key: 5,
      //     label: '数据读取工具'
      //   },
      //   {
      //     key: 6,
      //     label: '算法检测工具'
      //   },
      //   {
      //     key: 7,
      //     label: '网络抓包工具'
      //   },
      //   {
      //     key: 8,
      //     label: '协议分析工具'
      //   }
      // ]

      requestMain(requestData).then((res) => {
        console.log('穿梭框:', typeof res)
        if (typeof res !== 'string') {
          console.log('穿梭框:', res.dataList)
          this.data = []
          let i = 0
          res.dataList.forEach((item) => {
            this.data.push({
              key: ++i,
              label: item.attr128LenValue1 ? item.attr128LenValue1 : item.compName
            })
          })
          console.log('穿梭框数据:', this.data)

          this.oriData = this.$_.cloneDeep(this.data)
          // 已选
          if (value) {
            this.value = []
            value.split(',').forEach((item) => {
              this.data.forEach((i) => {
                if (item === i.label) {
                  this.value.push(i.key)
                }
              })
            })
            console.log('transfer默认已选', this.value)
          } else {
            this.value = []
          }
          this.innerDrawer = true
        }
      })
      // 通过参数查询全部

      // let i = 0
      // this.data.map((item) => {
      //   item.key = ++i
      //   return item
      // })
    },
    handleClose(done) {
      if (this.loading) {
        return
      }
      done()
    },
    renderFunc(h, option) {
      // 目前 return 返回的使用了 jsx语法
      return (
        // <el-tooltip class="item" effect="dark" content={option.label} placement="top-start">
        <span on-dblclick={() => this.dblclick(this.value, option)}>{option.label}</span>
        // </el-tooltip>
      )
    },
    dblclick(modelV, option) {
      // 双击 穿梭
      // 简单的逻辑  如果不在 v-model值数组里面，则push，否则从数组中删除
      if (modelV.includes(option.key)) {
        const index = modelV.indexOf(option.key)
        modelV.splice(index, 1)
      } else {
        modelV.push(option.key)
      }
    },
    submitForm() {
      this.loading = true
      setTimeout(() => {
        let value = ''
        this.value.forEach((v) => {
          this.oriData.forEach((o) => {
            if (v === o.key) {
              value += o.label + ','
            }
          })
        })
        this.$emit('reSelect', value, this.itemName)

        this.data = []
        this.value = []
        this.loading = false
        this.innerDrawer = false
      }, 300)
    },
    cancelForm() {
      this.data = []
      this.value = []
      this.loading = false
      this.innerDrawer = false
    }
  }
}
</script>

<style scoped lang="scss">
.transferBox {
  display: flex;
  justify-content: center;
}
// Transfer Element
::v-deep .el-transfer__buttons {
  padding: 0 10px;
}
::v-deep .el-transfer-panel {
  width: 250px;
  // &__header {
  // }
  &__body {
    height: 65vh !important;
    .el-transfer-panel__list {
      height: 60vh !important;
    }
  }
}
.drawer__top {
  // 向右对齐
  text-align: right;
  // 底部按钮
  .el-button {
    margin: 20px 40px 20px -30px;
  }
}
</style>