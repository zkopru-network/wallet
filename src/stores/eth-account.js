import { fromWei } from '../utils/wei'

export default {
  state: {
    metamaskConnected: false,
    chainId: -1,
    accounts: [],
    balance: null,
  },
  actions: {
    connectMetamask: async ({ state, dispatch }) => {
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
        dispatch('reloadState')
      })
      window.ethereum.on('connect', () => {
        state.metamaskConnected = window.ethereum.isConnected()
      })
      window.ethereum.on('disconnect', () => {
        state.metamaskConnected = window.ethereum.isConnected()
      })
      window.ethereum.on('accountsChanged', (accounts) => {
        state.accounts = accounts
        dispatch('reloadState')
      })
      state.accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      })
      await dispatch('loadBalance')
    },
    reloadState: async ({ state, dispatch }) => {
      await Promise.all([
        dispatch('loadBalance'),
        // reset the zkopru wallet state
        dispatch('resetWallet', null, { root: true }),
      ])
    },
    loadBalance: async ({ state }) => {
      const hexBalance = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [state.accounts[0], 'latest'],
      })
      state.balance = fromWei(hexBalance).toString()
    }
  }
}
