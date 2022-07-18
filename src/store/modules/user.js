import { login, loginOfTass, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    introduction: '',
    roles: []
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
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      let data = {
        userID: username.trim(),
        password: password,
        keySvrName: 'SevaluationManagement_TASS',
        svrName: '密评辅助工具',
        svrMainMenuName: 'Splenwise密评工具平台主工作界面',
        useMenuItemButton: '2'
      }
      loginOfTass(data)
        .then((response) => {
          console.log(response)
          const { data } = response
          console.log('login成功:', data)
          // commit('SET_TOKEN', data.token)
          // setToken(data.token)
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
    return new Promise((resolve, reject) => {
      getInfo(state.token)
        .then((response) => {
          const { data } = response
          console.log('getInfo:', data)

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
  async changeRoles({ commit, dispatch }, role) {
    const token = role + '-token'

    commit('SET_TOKEN', token)
    setToken(token)

    // const { roles } = await dispatch('getInfo')
    let roles = [role]
    commit('SET_ROLES', roles)

    resetRouter()

    // generate accessible routes map based on roles
    const accessRoutes = await dispatch('permission/generateRoutes', roles, {
      root: true
    })
    // dynamically add accessible routes
    router.addRoutes(accessRoutes)

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
