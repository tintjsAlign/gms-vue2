import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
// import pinia from './pinia'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

import contentmenu from 'v-contextmenu'
import 'v-contextmenu/dist/index.css'
import _ from 'lodash'
// main.js (需要先引入 Vue 和 Element-UI 依赖库, 并在 <el-table></el-table> 组件下使用该组件)
import AFTableColumn from 'af-table-column'
Vue.use(AFTableColumn)

Object.defineProperty(Vue.prototype, '$_', { value: _ })
Vue.use(contentmenu)
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}

// 添加点击空白处的指令
Vue.directive('click-outside', {
  bind: function (el, binding, vnode) {
    el.clickOutsideEvent = function (event) {
      // here I check that click was outside the el and his childrens
      if (!(el == event.target || el.contains(event.target))) {
        // and if it did, call method provided in attribute value
        vnode.context[binding.expression](event)
      }
    }
    document.body.addEventListener('click', el.clickOutsideEvent)
  },
  unbind: function (el) {
    document.body.removeEventListener('click', el.clickOutsideEvent)
  }
})
// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI)
// Vue.use(pinia)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  // pinia,
  render: (h) => h(App)
})
