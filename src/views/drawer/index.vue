<template>
  <div class="app-container">
    <dynamic-drawer ref="drawerRef"></dynamic-drawer>
  </div>
</template>

<script>
import { requestMain } from '@/api/main'
import dynamicDrawer from '@/components/DynamicDrawer/index.vue'
export default {
  name: '',
  components: {
    dynamicDrawer
  },
  props: {},
  data() {
    return {}
  },
  computed: {},
  watch: {},
  created() {
    // 获取路由的参数
    this.routeParams = this.$route.meta
    console.log('routeParams:', this.routeParams)
  },
  mounted() {
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    init() {
      this.$refs.drawerRef.show(this.routeParams)
      // let tblAlias
      // if (
      //   (this.routeParams.resId === 1128 && this,
      //   this.routeParams.operationID === 216)
      // ) {
      //   let url = this.routeParams.otherProperties.urlParam
      //   // url中以&分割，每个参数都是key=value的形式
      //   let urlParam = url.split('&')
      //   // console.log('urlParam:', urlParam)
      //   // 获取condition
      //   urlParam.forEach((element) => {
      //     if (element.indexOf('condition=') > -1) {
      //       this.condition = element
      //         .replace('condition=', '')
      //         .split(',appendFld')[0]
      //     }
      //   })
      //   // console.log('condition:', this.condition)
      //   // 将urlParam中的每个参数都拆分成key和value，并存入对象中

      //   // 截取url中以'appendFld=append.'开头和';'结尾的字符串(掐头去尾)
      //   let appendFld = url
      //     .match(/appendFld=append.[^&]+/g)[0]
      //     .replace('appendFld=append.', '')
      //   // 截取appendFld中以';'分割的字符串
      //   let appendFldArr = appendFld.split(';')
      //   tblAlias = appendFldArr[0]
      //   this.drawerTitle = appendFldArr[1]
      // } else {
      //   tblAlias = this.routeParams.tblAlias
      // }
      // let requestMainData = {
      //   // operationID: this.routeParams.operationID,
      //   operationID: '1',
      //   // resId: this.routeParams.resId,
      //   resId: '1056',
      //   rel: this.routeParams.rel,
      //   tblAlias: tblAlias,
      //   // isOperatorSingleRec: '0',
      //   queryOnlyFlag: '1',
      //   SYSTEMKEYNAME: window.sessionStorage.getItem('SYSTEMKEYNAME'),
      //   SYSTEMTELLERNO: window.sessionStorage.getItem('SYSTEMTELLERNO')
      // }
      // requestMain(requestMainData).then((res) => {
      //   console.log('requestMain:', res)
      //   this.drawerData = res
      //   console.log('drawerData:', this.drawerData)

      //   // this.thead.forEach((item) => {
      //   //   this[item.key] = item.value
      //   // })
      // })
    }
  }
}
</script>

<style scoped lang="scss"></style>
