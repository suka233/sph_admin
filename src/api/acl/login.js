import request from '@/utils/request'

const API_NAME = '/admin/acl/index'

export default {
  /*
  根据用户名和密码请求登陆
  */

  //原本是username,password 通过查看发送请求的地方,发现它是封装成对象传过来的,所以这里传入data即可
  login(data) {
    return request({
      url: `${API_NAME}/login`,
      method: 'post',
      data,
    })
  },

  /*
  获取当前用户信息
  */

  //原本没有加入token 通过我自己看store里面的请求,发现要加token,于是加上
  getInfo(token) {
    return request({
      url: `${API_NAME}/info`,
      method: 'get',
      params: {token}
    })
  },

  /*
  获取当前用户的菜单权限列表
  */
  getMenu() {
    return request(`${API_NAME}/menu`)
  },

  /*
  退出登陆
  */
  logout() {
    return request({
      url: `${API_NAME}/logout`,
      method: 'post'
    })
  },
}

// {default: {}}
