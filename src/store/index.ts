import { createStore, useStore as useVuexStore } from "vuex"
import mutations  from './mutations'
import getters  from './getters'
import actions from './actions'
import RootState from './RootState'
import shopModule from "./modules/shop"
import orderModule from "./modules/order"
import userModule from "./modules/user"
import createPersistedState from "vuex-persistedstate";


// TODO check how to register it from the components only
// Handle same module registering multiple time on page refresh
//store.registerModule('shop', shopModule);


const state: any = {

}

const persistState = createPersistedState({
    paths: ['user', 'shop.configId'],
    fetchBeforeUse: true
})

// Added modules here so that hydration takes place before routing
const store = createStore<RootState>({
    state,
    actions,
    mutations,
    getters,
    plugins: [ persistState ],
    modules: {
        'shop': shopModule,
        'order': orderModule,
        'user': userModule
    }
})

export default store
export function useStore(): typeof store {
    return useVuexStore()
}