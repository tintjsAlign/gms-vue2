import request from '@/utils/request'

// 登录
export function loginOfTass(data) {
  return request({
    url: '/loginEvlation',
    method: 'post',
    data
  })
}

// 通用查询
export function requestMain(data) {
  return request({
    url: '/main',
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
