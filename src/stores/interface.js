export default {
  state: {
    width: window.innerWidth,
    height: window.innerHeight,
  },
  mutations: {
    updateViewportSize: (state) => {
      state.width = window.innerWidth
      state.height = window.innerHeight
    }
  },
  actions: {}
}
