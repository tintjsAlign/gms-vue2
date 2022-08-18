import { login, loginOfTass, logout, getInfo } from '@/api/user'
import { loginByUsername } from '@/api/main'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    introduction: '',
    roles: [],
    routers: []
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_ROUTERS: (state, routers) => {
    state.routers = routers
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      let data = {
        userID: username.trim(),
        // password: password,
        password:
          '0d566b8160e9fd8ccc2d1f3e19ccad9e6dd37b8b8ddfe5a49ff83db0d768d2530c813676c47a54c5ce092e582db1a5b3e7214edfe202b757285bf396109a7655653b63b40bf7ebe7c7d4f8d2e7a8a0b8076f47a3feedaf56c579e8dbc6228d9b667bbb33f70ef7706b161239ba9a13f67195d0a94f1cb49774653039546144ac',
        keySvrName: 'SevaluationManagement_TASS',
        svrName: '密评辅助工具',
        svrMainMenuName: 'Splenwise密评工具平台主工作界面',
        useMenuItemButton: '2'
      }
      loginByUsername(data)
        .then((response) => {
          console.log(response)
          window.localStorage.setItem('SYSTEMKEYNAME', response.SYSTEMKEYNAME)
          window.localStorage.setItem('SYSTEMTELLERNO', response.SYSTEMTELLERNO)
          window.localStorage.setItem('userRole', response.TELLERROLE)
          // const { data } = response
          // console.log('login成功:', data)
          // commit('SET_TOKEN', data.token)
          // commit('SET_TOKEN', data.SERVICELOGSSN)
          // setToken(data.token)
          // setToken(data.SERVICELOGSSN)
          resolve()
        })
        .catch((error) => {
          reject(error)
        })

      //   login({ username: username.trim(), password: password })
      //     .then((response) => {
      //       const { data } = response
      //       commit('SET_TOKEN', data.token)
      //       setToken(data.token)
      //       resolve()
      //     })
      //     .catch((error) => {
      //       reject(error)
      //     })
    })
    //   login({ username: username.trim(), password: password })
    //     .then((response) => {
    //       const { data } = response
    //       commit('SET_TOKEN', data.token)
    //       setToken(data.token)
    //       resolve()
    //     })
    //     .catch((error) => {
    //       reject(error)
    //     })
    // })
  },

  // get user info
  getInfo({ commit, state }) {
    console.log('getInfo!!!!')
    return new Promise((resolve, reject) => {
      getInfo(state.token)
        .then((response) => {
          const { data } = response

          if (!data) {
            return reject('Verification failed, please Login again.')
          }
          if (!data) {
            reject('Verification failed, please Login again.')
          }

          const { roles, name, avatar, introduction } = data

          // const { name, avatar } = data
          // roles must be a non-empty array
          if (!roles || roles.length <= 0) {
            reject('getInfo: roles must be a non-null array!')
          }

          commit('SET_ROLES', roles)
          commit('SET_NAME', name)
          commit('SET_AVATAR', avatar)
          commit('SET_INTRODUCTION', introduction)
          resolve(data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token)
        .then(() => {
          removeToken() // must remove  token  first
          resetRouter()
          commit('RESET_STATE')
          resolve()
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise((resolve) => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  },

  // dynamically modify permissions
  async changeRoles({ commit, dispatch }, { roles, tree }) {
    console.log('changeRoles:', roles)
    const token = roles[0] + '-token'

    commit('SET_TOKEN', token)
    setToken(token)

    // const { roles } = await dispatch('getInfo')
    // let roles = [role]
    commit('SET_ROLES', roles)
    // commit('SET_ROUTERS', tree)

    resetRouter()

    // generate accessible routes map based on roles
    const accessRoutes = await dispatch(
      'permission/generateRoutes',
      { roles, tree },
      {
        root: true
      }
    )
    // console.log('changeRoles accessRoutes:', accessRoutes)

    // 处理tree
    // dynamically add accessible routes
    router.addRoutes(accessRoutes)
    // router.addRoutes(tree)

    // reset visited views and cached views
    dispatch('tagsView/delAllViews', null, { root: true })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
