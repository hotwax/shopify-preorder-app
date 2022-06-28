import { ActionTree } from 'vuex'
import RootState from '@/store/RootState'
import OrderState from './orderState'
import * as types from './mutation-types'
import { getOrder } from '@/services'

const actions: ActionTree<OrderState, RootState> = {
  async fetchDraftOrder({ commit }){
    const payload = {
      draftOrderId: "1051037040804",
      shopifyConfigId: "SH_NN_CONFIG"
    }
    try{
      const resp = await getOrder(payload);
      console.log(JSON.parse(resp.data.draftOrder));
    } catch(err){
      console.log(err)
    }
    
  }
}
export default actions;