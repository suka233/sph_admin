import request from '@/utils/request'

const API_NAME = '/admin/product'

export default {

// GET /admin/product/getCategory1
// getCategory1
// 获取1级分类列表
  getCategory1List() {
    return request.get(`${API_NAME}/getCategory1`)
  },
// GET /admin/product/getCategory2/{category1Id}
// getCategory2
// 获取2级分类列表
  getCategory2List(category1Id) {
    return request.get(`${API_NAME}/getCategory2/${category1Id}`)
  },
// GET /admin/product/getCategory3/{category2Id}
// getCategory3
// 获取3级分类列表
  getCategory3List(category2Id) {
    return request.get(`${API_NAME}/getCategory3/${category2Id}`)
  }
}
