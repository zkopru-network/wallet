export default {
  state: {
    width: window.innerWidth,
    height: window.innerHeight,
    isMobile: false,
  },
  mutations: {
    updateViewportSize: (state) => {
      state.width = window.innerWidth
      state.height = window.innerHeight
      state.isMobile = state.width < 800
    },
  },
  actions: {}
}
