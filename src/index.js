import Vue from 'vue'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import Meta from 'vue-meta'
import App from './App'
import Home from './Home'

Vue.use(VueRouter)
Vue.use(Vuex)
Vue.use(Meta)
const store = new Vuex.Store({
  state: {

  },
  mutations: {

  },
  actions: {},
  modules: {},
})
const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/', component: Home },
  ]
})
const app = new Vue({
  router,
  store,
  render: h => h(App),
})
app.$mount('#app')
