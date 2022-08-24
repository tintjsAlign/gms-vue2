import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'
import permission from './modules/permission'
import tagsView from './modules/tagsView'

import createPersistedState from 'vuex-persistedstate' // vuex-persistedstate默认持久化所有state，指定需要持久化的state

Vue.use(Vuex)

const store = new Vuex.Store({
  getters,
  modules: {
    app,
    settings,
    user,
    permission,
    tagsView
  },
  // plugins: [
  //   createPersistedState({
  //     // storage: window.localStorage,
  //     storage: window.sessionStorage,
  //     // vuex-persistedstate默认持久化所有state，指定需要持久化的state
  //     reducer(val) {
  //       return {
  //         // 只储存state中的user
  //         user: val.user
  //         // adImagesLink: val.adImagesLink
  //         // unitToken: val.unitToken,
  //         // personalToken: val.personalToken,
  //       }
  //     }
  //   })
  // ],
})

export default store
