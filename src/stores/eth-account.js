export default {
  state: {
    metamaskConnected: false,
    chainId: -1,
    accounts: [],
  },
  actions: {
    connectMetamask: async ({ state }) => {
      if (!window.ethereum) {
        throw new Error('Metamask not detected')
      }
      state.metamaskConnected = window.ethereum.isConnected()
      state.chainId = window.ethereum.chainId
      window.ethereum.removeAllListeners('chainChanged')
      window.ethereum.removeAllListeners('connect')
      window.ethereum.removeAllListeners('disconnect')
      window.ethereum.removeAllListeners('accountsChanged')
      window.ethereum.on('chainChanged', (chainId) => {
        state.chainId = chainId
      })
      window.ethereum.on('connect', () => {
        state.metamaskConnected = window.ethereum.isConnected()
      })
      window.ethereum.on('disconnect', () => {
        state.metamaskConnected = window.ethereum.isConnected()
      })
      window.ethereum.on('accountsChanged', (accounts) => {
        state.accounts = accounts
      })
      state.accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      })
    }
  }
}
