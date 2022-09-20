import { login, loginOfTass, logout, getInfo } from '@/api/user'
import { loginByUsername } from '@/api/main'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'
import { MessageBox, Message, Loading } from 'element-ui'

import { encryption } from '@/utils/encryption'

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
  login({ commit }, { userInfo, rsaParams }) {
    const { username, password } = userInfo
    const { pkbase64, modulus, exponent } = rsaParams
    return new Promise((resolve, reject) => {
      let encryptionPsw = encryption(pkbase64, modulus, exponent, password)
      // console.log('encryptionPsw:', encryptionPsw)
      let data = {
        userID: username.trim(),
        password: encryptionPsw,
        keySvrName: 'SevaluationManagement_TASS',
        svrName: '密评辅助工具',
        svrMainMenuName: 'Splenwise密评工具平台主工作界面',
        useMenuItemButton: '2'
      }
      loginByUsername(data)
        .then((response) => {
          if (response.错误原因) {
            Message.error(response.错误原因)
            reject(response.错误原因)
            return
          }
          console.log(response)
          window.localStorage.setItem('SYSTEMKEYNAME', response.SYSTEMKEYNAME)
          window.localStorage.setItem('SYSTEMTELLERNO', response.SYSTEMTELLERNO)
          window.localStorage.setItem('userRole', response.TELLERROLE)

          window.sessionStorage.setItem('sessionToken', response.SERVICELOGSSN)
          // const { data } = response
          // console.log('login成功:', data)
          // commit('SET_TOKEN', data.token)
          // commit('SET_TOKEN', response.SERVICELOGSSN)
          // setToken(data.token)
          let token = response.SERVICELOGSSN + '_token'
          setToken(token)
          commit('SET_TOKEN', token)
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
  },

  // get user info
  getInfo({ commit, state }) {
    console.log('getInfo!!!!', state)
    return new Promise((resolve, reject) => {
      resolve(state)
      getInfo(state.token)
        .then((response) => {
          const { data } = response

          if (!data) {
            return reject('验证失败，请重新登录.')
          }
          if (!data) {
            reject('验证失败，请重新登录.')
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
      // logout(state.token)
      //   .then(() => {
      removeToken() // must remove  token  first
      resetRouter()
      commit('RESET_STATE')
      window.localStorage.removeItem('SYSTEMKEYNAME')
      window.localStorage.removeItem('SYSTEMTELLERNO')
      window.localStorage.removeItem('userRole')
      window.sessionStorage.removeItem('sessionToken')
      resolve()
      // })
      // .catch((error) => {
      //   reject(error)
      // })
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
