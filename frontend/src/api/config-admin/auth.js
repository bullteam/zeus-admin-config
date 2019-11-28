import request from './request'

/**
 * 获取授权的菜单接口
 */
export function getMenu() {
  return request({
    url: 'v1/user/menu',
    method: 'GET',
    params: {
      domain: 'zeus-config'
    }
  })
}

/**
 * 获取用户权限列表接口
 */
export function permList() {
  return request({
    url: 'v1/user/perm/list',
    method: 'GET',
    params: {
      code: 'zeus-config'
    }
  })
}

