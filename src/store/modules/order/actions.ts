import { ActionTree } from 'vuex'
import RootState from '@/store/RootState'
import OrderState from './orderState'
import * as types from './mutation-types'
import { getOrder } from '@/services'

const actions: ActionTree<OrderState, RootState> = {
  getOrders({ commit }){
    const payload = {
      
      shopifyConfigId: "SH_NN_CONFIG"
    }
    try{
      const resp = getOrder(payload);
      console.log(resp);
    } catch(err){
      console.log(err)
    }
    
  }
}
export default actions;