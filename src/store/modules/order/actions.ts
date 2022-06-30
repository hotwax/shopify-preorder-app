import { ActionTree } from 'vuex'
import RootState from '@/store/RootState'
import OrderState from './orderState'
import * as types from './mutation-types'
import { OrderService } from '@/services/OrderService'
import { hasError, showToast } from '@/utils'
import { translate } from '@/i18n'

const actions: ActionTree<OrderState, RootState> = {
  async fetchDraftOrder ({ commit }) {
    const payload = {
      draftOrderId: "1008063086756",
      shopifyConfigId: "SH_NN_CONFIG"
    }
    try {
      const resp = await OrderService.getOrder(payload);
      if (resp.status === 200 && !hasError(resp) && resp.data.draftOrder) {
        const order = JSON.parse(resp.data.draftOrder);
        commit(types.ORDER_UPDATED, order.draft_order);
      }
    } catch(err){
      console.error(err)
    }
  },

  async updateDraftOrder ({dispatch}, payload) {
    let resp;
    const params = {
      draftOrderId: "1008063086756",
      payload: {"draft_order": {"line_items": payload}},
      shopifyConfigId: "SH_NN_CONFIG"
    }
    try {
      resp = await OrderService.updateOrder(params);
      if(resp.status === 200 && !hasError(resp)){
        showToast(translate("Order Updated successfully."));
        dispatch('fetchDraftOrder');
      } 
    } catch (err) {
      console.error(err);
    }
  }
}
export default actions;