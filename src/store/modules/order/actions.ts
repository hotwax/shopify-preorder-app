import { ActionTree } from 'vuex'
import RootState from '@/store/RootState'
import OrderState from './orderState'
import * as types from './mutation-types'
import { OrderService } from '@/services/OrderService'
import { hasError, showToast } from '@/utils'
import { translate } from '@/i18n'

const actions: ActionTree<OrderState, RootState> = {
  async getDraftOrder ({ commit }, id) {
    const payload = {
      draftOrderId: id,
      shopifyConfigId: process.env.VUE_APP_SHOPIFY_SHOP
    }
    try {
      const resp = await OrderService.getDraftOrder(payload);
      if (resp.status === 200 && !hasError(resp) && resp.data.response.draft_order) {
        const order = resp.data.response.draft_order;
        commit(types.DRAFT_ORDER_UPDATED, order);
      }
    } catch (err) {
      console.error(err)
    }
  },

  async updateDraftOrder ({dispatch}, payload) {
    let resp;
    const params = {
      draftOrderId: payload.id,
      payload: {"draft_order": {"line_items": payload.lineItems}},
      shopifyConfigId: process.env.VUE_APP_SHOPIFY_SHOP
    }
    try {
      resp = await OrderService.updateDraftOrder(params);
      if(resp.status === 200 && !hasError(resp)){
        showToast(translate("Order Updated successfully."));
        dispatch('getDraftOrder', payload.id);
      } 
    } catch (err) {
      console.error(err);
      showToast(translate("Something went wrong"));
    }
  },

  setRouteParams({commit}, payload){
    commit(types.DRAFT_ORDER_ROUTE_PARAMS_UPDATED, payload);
  }
}
export default actions;