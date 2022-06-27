import actions from './actions'
import getters from './getters'
import mutations from './mutations'
import { Module } from 'vuex'
import OrderState from './orderState'
import RootState from '@/store/RootState'

const shopModule: Module<OrderState, RootState> = {
  namespaced: true,
  state: {
    token: '',
    shop: ''
  },
  getters,
  actions,
  mutations,
}

export default shopModule;

// TODO
// store.registerModule('user', userModule);
