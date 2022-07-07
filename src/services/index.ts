import api, { client } from '@/api';

const generateAccessToken = async (config: any): Promise <any>  => {
  return client({
    url: "/generateShopifyAccessToken",
    method: "post",
    ...config
  });
}

const getShopifyConfigId = async (payload: any): Promise <any>  => {
  return api({
    url: "performFind",
    method: "post",
    data: payload
  });
}

const checkPreorderItemAvailability = async (payload: any): Promise <any>  => {
  return api({
    url: "/checkPreorderItemAvailability",
    method: "get",
    data: payload
  });
}

export {
  generateAccessToken,
  getShopifyConfigId,
  checkPreorderItemAvailability
}