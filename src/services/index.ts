import api from '@/api';

const generateAccessToken = async (query: any): Promise <any>  => {
  return api({
    url: "/getShopifyAccessToken", 
    method: "post",
    data: query,
    cache: true
  });
}

export default {
  generateAccessToken
}