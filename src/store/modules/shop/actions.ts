import { ActionTree } from 'vuex'
import RootState from '@/store/RootState'
import ShopState from './ShopState'
import * as types from './mutation-types'
import { checkPreorderItemAvailability, getShopifyConfigId } from "@/services"
import { hasError, showToast } from '@/utils'
import { translate } from '@/i18n'

const actions: ActionTree<ShopState, RootState> = {
  setShopToken({ commit }, payload) {
    commit(types.SHOP_TOKEN_UPDATED, { token: payload.token })
  },
  setShop({ commit }, payload) {
    commit(types.SHOP_UPDATED, payload)
  },
  async getShopifyConfigId({commit}, shop){
    let resp;
    const payload = {
      'inputFields': {
        'apiUrl': 'https://'+shop+'/'
      },
      "entityName": "ShopifyConfig",
      "noConditionFind": "Y",
      "fieldList": ['shopifyConfigId']
    }
    try {
      resp = await getShopifyConfigId(payload);
      if(resp.status == 200 && !hasError(resp) && resp.data.docs){
        commit(types.SHOP_CONFIG_ID_UPDATED, resp.data.docs[0].shopifyConfigId)
      } else {
        console.error(resp);
      }
    } catch (err) {
      console.error(err);
    }
  },
  async checkPreorderItemAvailability ({commit}, productIds) {
    let resp;
    const payload = {
      "viewIndex": 0,
      "viewSize": productIds.length,
      "filters": {
        "sku": productIds,
        "sku_op": "in"
      }
    }
    try {
      resp = await checkPreorderItemAvailability(payload);
      if (resp.status == 200 && !hasError(resp) && resp.data?.docs) {
        return resp.data.docs
      } else {
        return [];
      }
    } catch (err) {
      console.error(err);
      return [];
    }
  }
}
export default actions;