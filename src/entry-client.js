import Vue from 'vue'
import { createApp } from '.'

const { app, router, store } = createApp()

if (window.__INITIAL_STATE__) {
  store.replaceState(window.__INITIAL_STATE__)
}

// store.dispatch('load')

router.onReady(() => {
  app.$mount('#app')
})
