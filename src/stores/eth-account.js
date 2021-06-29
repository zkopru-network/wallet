import { fromWei } from '../utils/wei'

export default {
  state: {
    metamaskConnected: false,
    chainId: -1,
    accounts: [],
    balance: 0,
    tokenBalances: {},
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
      dispatch('loadBalance').catch(console.log)
      dispatch('loadTokenBalances').catch(console.log)
    },
    reloadState: async ({ state, dispatch }) => {
      await Promise.all([
        dispatch('loadBalance'),
        dispatch('loadTokenBalances'),
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
    },
    loadTokenBalances: async ({ state, rootState }) => {
      for (const { address, symbol } of rootState.zkopru.registeredTokens) {
        const tokenContract = await rootState.zkopru.client.getERC20Contract(address)
        const myAddress = state.accounts[0]
        const [balance, decimals] = await Promise.all([
          tokenContract.methods.balanceOf(myAddress).call(),
          tokenContract.methods.decimals().call(),
        ])
        const balanceDecimal = +balance.toString() / (10**+decimals.toString())
        state.tokenBalances = { ...state.tokenBalances, [symbol]: balanceDecimal }
      }
    }
  }
}
