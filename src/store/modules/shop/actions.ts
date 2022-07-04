import { ActionTree } from 'vuex'
import RootState from '@/store/RootState'
import ShopState from './ShopState'
import * as types from './mutation-types'
import { getShopifyConfigId } from "@/services"
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
      if(resp.data.docs && !hasError(resp)){
        commit(types.SHOP_CONFIG_ID_UPDATED, resp.data.docs[0].shopifyConfigId)
      }
    } catch (err) {
      console.error(err);
    }
  }
}
export default actions;