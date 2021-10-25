import { createStore, useStore as useVuexStore } from "vuex"
import mutations  from './mutations'
import getters  from './getters'
import actions from './actions'
import RootState from './RootState'
// import createPersistedState from "vuex-persistedstate";


// TODO check how to register it from the components only
// Handle same module registering multiple time on page refresh
//store.registerModule('shop', shopModule);


const state: any = {

}

// Added modules here so that hydration takes place before routing
const store = createStore<RootState>({
    state,
    actions,
    mutations,
    getters
})

export default store
export function useStore(): typeof store {
    return useVuexStore()
}