import api, { client } from '@/api';

const generateAccessToken = async (config: any): Promise <any>  => {
  return client({
    url: "/generateShopifyAccessToken",
    method: "post",
    ...config
  });
}
const getOrder = async (payload: any): Promise <any>  => {
  return api({
    url: "service/getShopifyDraftOrder",
    method: "post",
    data: payload
  });
}

export {
  generateAccessToken,
  getOrder
}