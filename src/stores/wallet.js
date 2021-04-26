export default {
  state: {
    autosyncPromptShown: false,
    autosyncEnabled: true,
  },
  mutations: {},
  actions: {
    loadState: ({ state }) => {
      if (typeof window === 'undefined') {
        // executing in non-browser environment
        return
      }
      const stateString = window.localStorage.getItem('walletState')
      if (!stateString) return
      const savedState = JSON.parse(stateString)
      Object.assign(state, savedState)
    },
    saveState: ({ state }) => {
      // state is completely serialized into insecure storage, make sure no
      // sensitive data is present
      const stateString = JSON.stringify(state)
      window.localStorage.setItem('walletState', stateString)
    }
  }
}
