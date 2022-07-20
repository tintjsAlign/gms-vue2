<template>
  <div class="planSystem">
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
  name: 'planSystem',
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
          fldAlais: '标准制定单位',
          queryFldName: 'attr128LenValue1'
        },
        {
          fldAlais: '测评标准',
          queryFldName: 'compName'
        },
        {
          fldAlais: '安全要求等级',
          queryFldName: 'attr128LenValue3'
        }
      ],
      tableData: [
        {
          companyName: '湖南省工商银行',
          projectName: '网上银行系统',
          attr128LenValue1: '中国国家标准化管理委员会',
          compName: 'GB/T 39786-2021 信息安全技术 信息系统密码应用基本要求',
          attr128LenValue3: '第三级'
        },
        {
          companyName: '湖南省工商银行',
          projectName: '电话银行系统',
          attr128LenValue1: '中国国家标准化管理委员会',
          compName: 'GB/T 39786-2021 信息安全技术 信息系统密码应用基本要求',
          attr128LenValue3: '第三级'
        },
        {
          companyName: '湖南省工商银行',
          projectName: '柜面前置系统',
          attr128LenValue1: '中国国家标准化管理委员会',
          compName: 'GB/T 39786-2021 信息安全技术 信息系统密码应用基本要求',
          attr128LenValue3: '第三级'
        },
        {
          companyName: '中国银行广东省分行',
          projectName: '密钥管理系统',
          attr128LenValue1: '中国国家标准化管理委员会',
          compName: 'GB/T 39786-2021 信息安全技术 信息系统密码应用基本要求',
          attr128LenValue3: '第三级'
        },
        {
          companyName: '湖南省工商银行',
          projectName: '网上银行系统',
          attr128LenValue1: '中国国家标准化管理委员会',
          compName: 'GB/T 39786-2021 信息安全技术 信息系统密码应用基本要求',
          attr128LenValue3: '第三级'
        },
        {
          companyName: '湖南省工商银行',
          projectName: '电话银行系统',
          attr128LenValue1: '中国国家标准化管理委员会',
          compName: 'GB/T 39786-2021 信息安全技术 信息系统密码应用基本要求',
          attr128LenValue3: '第三级'
        },
        {
          companyName: '湖南省工商银行',
          projectName: '柜面前置系统',
          attr128LenValue1: '中国国家标准化管理委员会',
          compName: 'GB/T 39786-2021 信息安全技术 信息系统密码应用基本要求',
          attr128LenValue3: '第三级'
        },
        {
          companyName: '中国银行广东省分行',
          projectName: '密钥管理系统',
          attr128LenValue1: '中国国家标准化管理委员会',
          compName: 'GB/T 39786-2021 信息安全技术 信息系统密码应用基本要求',
          attr128LenValue3: '第三级'
        },
        {
          companyName: '湖南省工商银行',
          projectName: '网上银行系统',
          attr128LenValue1: '中国国家标准化管理委员会',
          compName: 'GB/T 39786-2021 信息安全技术 信息系统密码应用基本要求',
          attr128LenValue3: '第三级'
        },
        {
          companyName: '湖南省工商银行',
          projectName: '电话银行系统',
          attr128LenValue1: '中国国家标准化管理委员会',
          compName: 'GB/T 39786-2021 信息安全技术 信息系统密码应用基本要求',
          attr128LenValue3: '第三级'
        },
        {
          companyName: '湖南省工商银行',
          projectName: '柜面前置系统',
          attr128LenValue1: '中国国家标准化管理委员会',
          compName: 'GB/T 39786-2021 信息安全技术 信息系统密码应用基本要求',
          attr128LenValue3: '第三级'
        },
        {
          companyName: '中国银行广东省分行',
          projectName: '密钥管理系统',
          attr128LenValue1: '中国国家标准化管理委员会',
          compName: 'GB/T 39786-2021 信息安全技术 信息系统密码应用基本要求',
          attr128LenValue3: '第三级'
        },
        {
          companyName: '湖南省工商银行',
          projectName: '网上银行系统',
          attr128LenValue1: '中国国家标准化管理委员会',
          compName: 'GB/T 39786-2021 信息安全技术 信息系统密码应用基本要求',
          attr128LenValue3: '第三级'
        },
        {
          companyName: '湖南省工商银行',
          projectName: '电话银行系统',
          attr128LenValue1: '中国国家标准化管理委员会',
          compName: 'GB/T 39786-2021 信息安全技术 信息系统密码应用基本要求',
          attr128LenValue3: '第三级'
        },
        {
          companyName: '湖南省工商银行',
          projectName: '柜面前置系统',
          attr128LenValue1: '中国国家标准化管理委员会',
          compName: 'GB/T 39786-2021 信息安全技术 信息系统密码应用基本要求',
          attr128LenValue3: '第三级'
        },
        {
          companyName: '中国银行广东省分行',
          projectName: '密钥管理系统',
          attr128LenValue1: '中国国家标准化管理委员会',
          compName: 'GB/T 39786-2021 信息安全技术 信息系统密码应用基本要求',
          attr128LenValue3: '第三级'
        },
        {
          companyName: '湖南省工商银行',
          projectName: '网上银行系统',
          attr128LenValue1: '中国国家标准化管理委员会',
          compName: 'GB/T 39786-2021 信息安全技术 信息系统密码应用基本要求',
          attr128LenValue3: '第三级'
        },
        {
          companyName: '湖南省工商银行',
          projectName: '电话银行系统',
          attr128LenValue1: '中国国家标准化管理委员会',
          compName: 'GB/T 39786-2021 信息安全技术 信息系统密码应用基本要求',
          attr128LenValue3: '第三级'
        },
        {
          companyName: '湖南省工商银行',
          projectName: '柜面前置系统',
          attr128LenValue1: '中国国家标准化管理委员会',
          compName: 'GB/T 39786-2021 信息安全技术 信息系统密码应用基本要求',
          attr128LenValue3: '第三级'
        },
        {
          companyName: '中国银行广东省分行',
          projectName: '密钥管理系统',
          attr128LenValue1: '中国国家标准化管理委员会',
          compName: 'GB/T 39786-2021 信息安全技术 信息系统密码应用基本要求',
          attr128LenValue3: '第三级'
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
