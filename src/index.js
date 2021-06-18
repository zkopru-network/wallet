import Vue from 'vue'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import Meta from 'vue-meta'
import App from './App'
import Home from './Home'
import WalletOld from './WalletOld'
import Wallet from './Wallet'
import ZkopruStore from './stores/zkopru'
import EthAccountStore from './stores/eth-account'
import TestTokenStore from './stores/test-token'
import WalletStore from './stores/wallet'
import Transfer from './Transfer'
import Deposit from './Deposit'
import AddressBookStore from './stores/address-book'

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
    testToken: TestTokenStore,
    addressBook: AddressBookStore,
  },
})
store.dispatch('loadState')
const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/', component: Home },
    { path: '/wallet_old', component: WalletOld },
    { path: '/wallet', component: Wallet },
    { path: '/wallet/transfer', component: Transfer },
    { path: '/wallet/deposit', component: Deposit }
  ]
})
const app = new Vue({
  router,
  store,
  render: h => h(App),
})
app.$mount('#app')
