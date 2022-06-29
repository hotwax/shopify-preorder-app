import api from '@/api'

const getOrder = async (payload: any): Promise <any>  => {
    return api({
      url: "service/getShopifyDraftOrder",
      method: "post",
      data: payload
    });
  }
  
  const updateOrder = async (payload: any): Promise <any>  => {
    return api({
      url: "service/updateShopifyDraftOrder",
      method: "post",
      data: payload
    });
  }

export const OrderService = {
    getOrder,
    updateOrder
}