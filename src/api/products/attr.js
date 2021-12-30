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
  },

// GET /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}
// 根据三个categoryid获取详情
  getAttr(category1Id,category2Id,category3Id){
    return request.get(`${API_NAME}/attrInfoList/${category1Id}/${category2Id}/${category3Id}`
    )
  },

  //修改或新增POST /admin/product/saveAttrInfo
  addOrUpdateAttr(data){
    return request.post(`${API_NAME}/saveAttrInfo`,data)
  },

  //删除 DELETE /admin/product/deleteAttr/{attrId}
  deleteAttr(attrId){
    return request.delete(`${API_NAME}/deleteAttr/${attrId}`)
  }
}
