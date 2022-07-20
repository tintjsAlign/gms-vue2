<template>
  <div class="app-container">
    <dynamic-table
      :tableData="tableData"
      :formThead="formThead"
      :moreButton="moreButton"
    ></dynamic-table>
  </div>
</template>

<script>
import dynamicTable from '@/components/dynamicTable/index.vue'
export default {
  name: '',
  components: {
    dynamicTable
  },
  props: {},
  data() {
    return {
      formThead: [
        {
          fldAlais: '单位名称',
          queryFldName: 'companyName'
        },
        {
          fldAlais: '信息系统',
          queryFldName: 'projectName'
        },
        {
          fldAlais: '测评标准别名',
          queryFldName: 'compAlais'
        },
        {
          fldAlais: '安全层面',
          queryFldName: 'attr128LenValue1'
        },
        {
          fldAlais: '信息系统测评对象',
          queryFldName: 'attr128LenValue2'
        },
        {
          fldAlais: '备注',
          queryFldName: 'remark'
        }
      ],
      tableData: [
        {
          companyName: '湖南省工商银行',
          projectName: '电话银行系统',
          compAlais: 'GB/T 39786-2021 信息系统密码应用基本要求',
          attr128LenValue1: '物理和环境安全',
          attr128LenValue2: '机房',
          remark: ''
        },
        {
          companyName: '湖南省工商银行',
          projectName: '电话银行系统',
          compAlais: 'GB/T 39786-2021 信息系统密码应用基本要求',
          attr128LenValue1: '网络和通信安全',
          attr128LenValue2: '内部网络',
          remark: ''
        },
        {
          companyName: '湖南省工商银行',
          projectName: '电话银行系统',
          compAlais: 'GB/T 39786-2021 信息系统密码应用基本要求',
          attr128LenValue1: '设备和计算安全',
          attr128LenValue2: '服务器',
          remark: ''
        },
        {
          companyName: '湖南省工商银行',
          projectName: '电话银行系统',
          compAlais: 'GB/T 39786-2021 信息系统密码应用基本要求',
          attr128LenValue1: '应用和数据安全',
          attr128LenValue2: '用户登录',
          remark: ''
        },
        {
          companyName: '湖南省工商银行',
          projectName: '网上银行系统',
          compAlais: 'GB/T 39786-2021 信息系统密码应用基本要求',
          attr128LenValue1: '物理和环境安全',
          attr128LenValue2: '机房',
          remark: ''
        },
        {
          companyName: '湖南省工商银行',
          projectName: '网上银行系统',
          compAlais: 'GB/T 39786-2021 信息系统密码应用基本要求',
          attr128LenValue1: '网络和通信安全',
          attr128LenValue2: '内部网络',
          remark: ''
        },
        {
          companyName: '湖南省工商银行',
          projectName: '网上银行系统',
          compAlais: 'GB/T 39786-2021 信息系统密码应用基本要求',
          attr128LenValue1: '设备和计算安全',
          attr128LenValue2: '服务器',
          remark: ''
        },
        {
          companyName: '湖南省工商银行',
          projectName: '网上银行系统',
          compAlais: 'GB/T 39786-2021 信息系统密码应用基本要求',
          attr128LenValue1: '应用和数据安全',
          attr128LenValue2: '用户登录',
          remark: ''
        }
      ],
      moreButton: [
        {
          buttonValue: '管理',
          buttonID: 'manage'
        },
        {
          buttonValue: '其它',
          buttonID: 'other'
        }
      ]
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {}
}
</script>

<style scoped lang="less"></style>
