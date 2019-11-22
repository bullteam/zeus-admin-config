import request from './request'

/**
 * 获取用户信息接口
 */
export function getInfo() {
  return request({
    url: 'v1/user/info',
    method: 'GET',
    params: {
      domain: 'zeus-config'
    }
  })
}

export function login() {
  return request({
    url: 'v1/user/login',
    method: 'GET',
    params: {
      domain: 'zeus-config'
    }
  })
}

export function logout() {
  return request({
    url: 'v1/user/logout',
    method: 'GET',
    params: {
      domain: 'zeus-config'
    }
  })
}

