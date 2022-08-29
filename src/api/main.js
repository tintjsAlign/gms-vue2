import request from '@/utils/request'

// 登录
export function loginByUsername(data) {
  return request({
    url: '/loginEvlation',
    method: 'post',
    data
  })
}
// 密码加密 getRsaParams
export function getRsaParams(data) {
  return request({
    url: '/getRsaParams',
    method: 'post',
    data
  })
}
// 通用
export function requestMain(data, loadFlag) {
  return request({
    url: '/main',
    headers: {
      showLoading: loadFlag === 'unshow' ? false : true,
      loadingTarget: loadFlag !== 'unshow' ? loadFlag : '.app-main'
    },
    method: 'post',
    data
  })
}

// 获取菜单1级别
export function getMenuLv1(data) {
  return request({
    url: '/getMenuGrp',
    method: 'post',
    data
  })
}

// 获取菜单2级别
export function getMenuLv2(data) {
  return request({
    url: '/genSubMenu',
    method: 'post',
    data
  })
}

// 获取菜单3级别
export function getMenuLvAfter(data) {
  return request({
    url: '/genVirtualMenu',
    method: 'post',
    data
  })
}

// 点击记录获取操作按钮
export function getRecordMenuGrp(data) {
  return request({
    url: '/getRecordMenuGrp',
    method: 'post',
    data
  })
}

// 获取树形结构菜单
export function getTreeMenu(data, loadFlag) {
  return request({
    url: '/getTreeMenu',
    headers: {
      showLoading: loadFlag === 'unshow' ? false : true,
      loadingTarget: loadFlag !== 'unshow' ? loadFlag : '.app-main'
    },
    method: 'post',
    data
  })
}
