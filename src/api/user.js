//此文件备用,暂时没有任何作用,功能已经移植到 @/api/acl/login文件里
import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/admin/acl/index/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/admin/acl/index/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/admin/acl/index/logout',
    method: 'post'
  })
}
