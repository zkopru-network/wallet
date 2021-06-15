import Vue from 'vue'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import Meta from 'vue-meta'
import App from './App'
import Home from './Home'
import Wallet from './Wallet'
import WalletNew from './WalletNew'
import ZkopruStore from './stores/zkopru'
import EthAccountStore from './stores/eth-account'
import WalletStore from './stores/wallet'
import Transfer from './Transfer'

Vue.use(VueRouter)
Vue.use(Vuex)
Vue.use(Meta)
const store = new Vuex.Store({
  state: {

  },
  mutations: {

  },
  actions: {
    loadState: () => {},
    saveState: () => {},
  },
  modules: {
    zkopru: ZkopruStore,
    account: EthAccountStore,
    wallet: WalletStore,
  },
})
store.dispatch('loadState')
const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/', component: Home },
    { path: '/wallet_old', component: Wallet },
    { path: '/wallet', component: WalletNew },
    { path: '/wallet/transfer', component: Transfer },
  ]
})
const app = new Vue({
  router,
  store,
  render: h => h(App),
})
app.$mount('#app')
