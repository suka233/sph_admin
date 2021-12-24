import request from '@/utils/request'

const API_NAME = '/admin/product/baseTrademark'

export default {
// GET /admin/product/baseTrademark/findBaseTrademarkByKeyword/{keyword}
// findBaseTrademarkByKeyword 根据关键字查找品牌
//
// GET /admin/product/baseTrademark/get/{id}
// 根据id获取BaseTrademark
  getTrademarkById(id) {
    return request.get(`${API_NAME}/get/${id}`)
  },
// GET /admin/product/baseTrademark/getTrademarkList
// getTrademarkList 获取品牌列表
  getTrademarkList() {
    return request.get(`${API_NAME}/getTrademarkList`)
  },
// POST /admin/product/baseTrademark/inner/findBaseTrademarkByTrademarkIdList
// findBaseTrademarkByTrademarkIdList
//
// DELETE /admin/product/baseTrademark/remove/{id}
// 删除BaseTrademark
  deleteTrademarkById(id) {
    return request.delete(`${API_NAME}/remove/${id}`)
  },
// POST /admin/product/baseTrademark/save
// 新增BaseTrademark
//   addTrademark(tmName, logoUrl) {
//     return request.post(`${API_NAME}/save`, {tmName, logoUrl})
//   },
// PUT /admin/product/baseTrademark/update
// 修改BaseTrademark
//   updateTrademark(id,tmName,logoUrl){
//     return request.put(`${API_NAME}/update`,{id,tmName,logoUrl})
//   },
  //修改或新增,data里有id就修改,没id就新增
  addOrUpdateTrademark(data){
    if(data.id){
      //如果有id,就修改
      return request.put(`${API_NAME}/update`,data)
    }else {
      //如果没有id,就新增
      return request.post(`${API_NAME}/save`, data)
    }
  },
// GET /admin/product/baseTrademark/{page}/{limit}
// 分页列表
  getPageList(page,limit){
    return request.get(`${API_NAME}/${page}/${limit}`)
  }
}

// {default: {}}
