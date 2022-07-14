import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import qs from 'qs' //引入qs模块，用于序列化post请求参数

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor 请求拦截器
service.interceptors.request.use(
  (config) => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['X-Token'] = getToken()
    }
    // 如果是 post 请求,并且请求的数据是对象格式
    if (config.method === 'post' && config.data) {
      if (config.headers['myType']) {
        if (config.headers['myType'] === 'none') {
          return
        }
        config.headers['Content-Type'] = config.headers['myType']
        config.data = JSON.stringify(config.data)
      } else {
        // console.log('old config.data', config.data)
        // 设置请求头 发送的数据是x-www-form-urlencoded 格式
        config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
        // qs.stringify(object, [options]) 字符串化时，默认情况下，qs 对输出进行 URI 编码，以避免某些特殊字符对某些接口的调用造成请求失败。
        //encode: false 禁用encode编码
        config.data = qs.stringify(config.data, { encode: false })
        // console.log('new config.data', config.data)
      }
    }
    // 取到本地存储中的用户信息 getItem
    // 再还原成 JSON格式，就可用点方法调用
    var user = JSON.parse(window.localStorage.getItem('user'))
    // 如果有登录用户信息（不为空），则统一设置 token

    // 属性名和值一般看接口的要求
    // 如以下
    // 属性名： Authorization
    // 属性值：'Bearer空格token数据'  （这里为测试，暂时写死）
    // `Bearer ${user.token}`  反引号里面${}  ES6里面的字符串拼接

    if (user) {
      // config.headers.Authorization = `Bearer ${user.token}`
      config.headers.res_token = `${user.res_token}`
      config.headers['X-CSRF-TOKEN'] = `${user.token.token}`
    } else {
      // 暂时使用通用res_token
      // config.headers.res_token = 'adeebd32-5f54-4a88-9821-f38c44538dca'
    }
    return config
  },
  (error) => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor 响应拦截器
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  (response) => {
    const res = response.data

    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 20000) {
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        // to re-login
        MessageBox.confirm(
          'You have been logged out, you can cancel to stay on this page, or log in again',
          'Confirm logout',
          {
            confirmButtonText: 'Re-Login',
            cancelButtonText: 'Cancel',
            type: 'warning'
          }
        ).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  (error) => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
