import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/auth-redirect', '/home'] // no redirect whitelist

router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()
  // const hasToken = window.sessionStorage.getItem('sessionToken')
  console.log('hasToken::', hasToken)
  console.log('to::', to.path, 'from::', from.path)
  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next()
      NProgress.done() // hack: https://github.com/PanJiaChen/vue-element-admin/pull/2939
    } else if (to.path === '/') {
      next()
      NProgress.done()
    } else if (to.path === '/dashboard') {
      next()
      NProgress.done()
    } else {
      // determine whether the user has obtained his permission roles through getInfo
      // console.log('store.getters.roles::', store.getters.roles)
      const hasRoles = store.getters.roles && store.getters.roles.length > 0 && store.getters.roles != ''
      if (hasRoles) {
        //
        if (to.path.indexOf('/tree/tree') > -1) {
          // to.path = from.path
          console.log('go 套娃tree:', to, from)
          next({
            ...to,
            path: from.path
          })
        }
        next()
      } else {
        try {
          // get user info
          // note: roles must be a object array! such as: ['admin'] or ,['developer','editor']

          if (window.sessionStorage.getItem('gatInfoRoles')) {
            const roles = await JSON.parse(window.sessionStorage.getItem('gatInfoRoles'))
            const tree = await JSON.parse(window.sessionStorage.getItem('gatInfoTree'))
            console.log('getInfo roles::', roles)
            console.log('getInfo tree::', tree)
            await store.commit('user/SET_ROLES', roles)

            const accessRoutes = await store.dispatch('permission/generateRoutes', { roles, tree })
            router.addRoutes(accessRoutes)
          } else {
            console.log('无gatInfoRoles')
            next(`/login`)
            return false
          }
          // const { roles } = await store.dispatch('user/getInfo')
          // console.log('roles::', roles)
          // // generate accessible routes map based on roles
          // const accessRoutes = await store.dispatch('permission/generateRoutes', { roles })
          // // const accessRoutes = await store.dispatch(
          // //   'permission/generateRoutes',
          // //   roles
          // // )
          // // dynamically add accessible routes
          // router.addRoutes(accessRoutes)
          // }
          next({ ...to, replace: true })

          // hack method to ensure that addRoutes is complete
          // set the replace: true, so the navigation will not leave a history record
        } catch (error) {
          console.log('error 4:', error)
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }

      // next({ path: from.path })
      // NProgress.done() // hack:
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
