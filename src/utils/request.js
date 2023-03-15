import axios from 'axios'
import { MessageBox, Message, Loading } from 'element-ui'
import router from '@/router'
import _ from 'lodash'
import store from '@/store'
import { getToken, removeToken } from '@/utils/auth'
import qs from 'qs' //引入qs模块，用于序列化post请求参数

// loading对象
let loadingInstance

// 请求合并只出现一次loading
// 当前正在请求的数量
let loadingRequestCount = 0

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 120000 // request timeout
})

// request interceptor 请求拦截器
service.interceptors.request.use(
  (config) => {
    let loadingTarget = '.app-main'
    if (config.headers.loadingTarget) {
      loadingTarget = config.headers.loadingTarget
    }
    if (config.headers.showLoading) {
      let target = document.querySelector(loadingTarget)
      if (target) {
        // 请求拦截进来调用显示loading效果
        showLoading(loadingTarget)
      }
    }

    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['X-Token'] = getToken()
    }

    // 如果是多项目
    let hasDataSet = window.sessionStorage.getItem('hasDataSet')
    if (hasDataSet === 'true' && config.data && config.data.operationID === 51) {
      let resId
      if (config.data.resId) {
        resId = config.data.resId
      }
      let projectName = window.sessionStorage.getItem('projectName')
      let headParameter = 'CURRESID=' + resId + '|CURPRIKEY=projectName=' + projectName + '~|HASDATAQUERYPK=1|'
      config.headers['headParameter'] = encodeURIComponent(headParameter, 'UTF-8')
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
        // 剔除掉config.data中的值是对象的字段
        for (const key in config.data) {
          if (typeof config.data[key] === 'object') {
            delete config.data[key]
          }
        }
        // console.log('old config.data', config.data)
        // 设置请求头 发送的数据是x-www-form-urlencoded 格式
        config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
        // qs.stringify(object, [options]) 字符串化时，默认情况下，qs 对输出进行 URI 编码，以避免某些特殊字符对某些接口的调用造成请求失败。
        //encode: false 禁用encode编码
        config.data = qs.stringify(config.data, { encode: false })
      }
    }
    // 取到本地存储中的用户信息 getItem
    // 再还原成 JSON格式，就可用点方法调用
    // var user = JSON.parse(window.sessionStorage.getItem('user'))
    // 如果有登录用户信息（不为空），则统一设置 token

    // 属性名和值一般看接口的要求
    // 如以下
    // 属性名： Authorization
    // 属性值：'Bearer空格token数据'  （这里为测试，暂时写死）
    // `Bearer ${user.token}`  反引号里面${}  ES6里面的字符串拼接

    // if (user) {
    //   // config.headers.Authorization = `Bearer ${user.token}`
    //   config.headers.res_token = `${user.res_token}`
    //   config.headers['X-CSRF-TOKEN'] = `${user.token.token}`
    // } else {
    //   // 暂时使用通用res_token
    //   // config.headers.res_token = 'adeebd32-5f54-4a88-9821-f38c44538dca'
    // }

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
    if (typeof res === 'string' && res.indexOf('message=') > -1) {
      // ModelAndView: reference to view with name 'template/main'; model is {message=错误原因=表记录没有找到|SERVICELOGSSN=202208031017080807980003|, statusCode=300}
      // 提取错误原因 截取{}包裹着的内容(不包括{})
      let errorMsg
      if (res.indexOf('|SERVICELOGSSN=') > -1) {
        errorMsg = res.substring(res.indexOf('{') + 1, res.lastIndexOf('|SERVICELOGSSN='))
      } else {
        errorMsg = res.substring(res.indexOf('{') + 1, res.lastIndexOf('}'))
      }
      console.log('请求响应错误:', errorMsg)
      Message.error(errorMsg)
      if (errorMsg.indexOf('登录') > -1) {
        removeToken()
        router.push('/login')
      }
      setTimeout(() => {
        hideLoading()
      }, 200)
      return Promise.resolve(res)
    } else if (res.statusCode === '301') {
      // 跳转到登录页面
      MessageBox.alert(res.message, '提示', {
        confirmButtonText: '确定',
        callback: (action) => {
          router.push('/login')
        }
      })
      setTimeout(() => {
        hideLoading()
      }, 200)
      return res
    }
    setTimeout(() => {
      hideLoading()
    }, 200)
    return Promise.resolve(res)
  },
  (error) => {
    Message.error(`请求错误: ${error}`)
    setTimeout(() => {
      hideLoading()
    }, 200)
    if (error.response.status) {
      return Promise.reject(error.response)
    }
  }
)

// 显示loading的函数 并且记录请求次数 ++
const showLoading = (target) => {
  if (loadingRequestCount === 0) {
    loadingInstance = Loading.service({
      lock: true,
      text: '加载中...',
      target: target
    })
  }
  loadingRequestCount++
}

// 隐藏loading的函数，并且记录请求次数
const hideLoading = () => {
  if (loadingRequestCount <= 0) return
  loadingRequestCount--
  if (loadingRequestCount === 0) {
    loadingInstance.close()
    // toHideLoading()
  }
}

// 防抖：将 300ms 间隔内的关闭 loading 便合并为一次. 防止连续请求时, loading闪烁的问题。
var toHideLoading = _.debounce(() => {
  console.log('hideLoading关闭loading~~~', loadingRequestCount)
  loadingInstance.close()
  loadingInstance = null
}, 300)

export default service
