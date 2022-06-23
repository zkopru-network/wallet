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
const Wallet = () => import(/* webpackChunkName: "group-wallet" */ './Wallet')
const Transfer = () => import(/* webpackChunkName: "group-wallet" */ './Transfer')
const Deposit = () => import(/* webpackChunkName: "group-wallet" */ './Deposit')
const DepositType = () => import(/* webpackChunkName: "group-wallet" */ './DepositType')
const Withdraw  = () => import(/* webpackChunkName: "group-wallet" */ './Withdraw')
const History = () => import(/* webpackChunkName: "group-wallet" */ './History')
const WithdrawType = () => import(/* webpackChunkName: "group-wallet" */ './WithdrawType')
const Receive = () => import(/* webpackChunkName: "group-wallet" */ './Receive')
const Library = () => import(/* webpackChunkName: "group-wallet" */ './Library')

Vue.use(VueRouter)
Vue.use(Vuex)
Vue.use(Meta)
const store = new Vuex.Store({
  state: {
    chainId: -1,
    // TODO: desiredChainId for network changing by two ways, by network change button, and metamask network change.
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
