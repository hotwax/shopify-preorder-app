import { GetterTree } from 'vuex'
import OrderState from './orderState'
import RootState from '@/store/RootState'

const getters: GetterTree <OrderState, RootState> = {
  getShopToken (state) {
    return state.token
  },
  getShop (state) {
    return state.shop;
  }
}
export default getters;