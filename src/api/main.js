import request from '@/utils/request'

export function loginOfTass(data) {
  return request({
    url: 'http://www.paytunnel.cn/secretassessment/loginEvlation',
    method: 'post',
    data
  })
}
export function queryMain(data) {
  return request({
    url: 'http://www.paytunnel.cn/secretassessment/main',
    method: 'post',
    data
  })
}
