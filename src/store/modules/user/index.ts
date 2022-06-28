import actions from './actions'
import getters from './getters'
import mutations from './mutations'
import { Module } from 'vuex'
import UserState from './UserState'
import RootState from '@/store/RootState'

const shopModule: Module<UserState, RootState> = {
  namespaced: true,
  state: {
    token: '',
    instanceUrl: '',
    current: null,
    currentFacility: {},
  },
  getters,
  actions,
  mutations,
}

export default shopModule;

// TODO
// store.registerModule('user', userModule);
