import Vue from 'vue'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import Meta from 'vue-meta'
import App from './App'
import ZkopruStore from './stores/zkopru'
import EthAccountStore from './stores/eth-account'
import TestTokenStore from './stores/test-token'
import WalletStore from './stores/wallet'
import AddressBookStore from './stores/address-book'
import InterfaceStore from './stores/interface'
import HomeNew from './HomeNew'
const Home = () => import('./Home')
const Wallet = () => import(/* webpackChunkName: "wallet-group" */ './Wallet')
const Transfer = () => import(/* webpackChunkName: "wallet-group" */ './Transfer')
const Deposit = () => import(/* webpackChunkName: "wallet-group" */ './Deposit')
const DepositType = () => import(/* webpackChunkName: "wallet-group" */ './DepositType')
const Withdraw  = () => import(/* webpackChunkName: "wallet-group" */ './Withdraw')
const History = () => import(/* webpackChunkName: "wallet-group" */ './History')
const WithdrawType = () => import(/* webpackChunkName: "wallet-group" */ './WithdrawType')
const Receive = () => import(/* webpackChunkName: "wallet-group" */ './Receive')
const Library = () => import(/* webpackChunkName: "wallet-group" */ './Library')

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
    interface: InterfaceStore,
  },
})
store.dispatch('loadState')
store.commit('updateViewportSize')
window.addEventListener('resize', () => store.commit('updateViewportSize'))
const pathComponents = window.location.pathname.split('/')
const isIpfs = pathComponents.indexOf('ipfs') === pathComponents.length - 2
const router = new VueRouter({
  mode: isIpfs ? 'hash' : 'history',
  routes: [
    { path: '/', component: HomeNew },
    { path: '/home', component: Home },
    { path: '/wallet', component: Wallet },
    { path: '/wallet/transfer', component: Transfer },
    { path: '/wallet/deposit', component: Deposit },
    { path: '/wallet/deposit/type', component: DepositType },
    { path: '/wallet/withdraw', component: Withdraw },
    { path: '/wallet/withdraw/type', component: WithdrawType },
    { path: '/wallet/history', component: History },
    { path: '/wallet/receive', component: Receive },
    { path: '/wallet/library', component: Library },
  ]
})
const app = new Vue({
  router,
  store,
  render: h => h(App),
})
app.$mount('#app')
