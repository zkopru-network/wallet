const ethers = require('ethers');

export default {
  state: {
    metamaskConnected: false,
    accounts: [],
    balance: 0,
    tokenBalances: {},
  },
  actions: {
    connectMetamask: async ({ state, dispatch, rootState }) => {
      if (!window.ethereum) {
        throw new Error('Metamask not detected')
      }
      state.metamaskConnected = window.ethereum.isConnected()
      rootState.chainId = parseInt(window.ethereum.chainId)
      window.ethereum.removeAllListeners('chainChanged')
      window.ethereum.removeAllListeners('connect')
      window.ethereum.removeAllListeners('disconnect')
      window.ethereum.removeAllListeners('accountsChanged')
      window.ethereum.on('chainChanged', (chainId) => {
        rootState.chainId = parseInt(chainId)
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
      await dispatch('stopSync')
      await Promise.all([
        dispatch('loadBalance'),
        // reset the zkopru wallet state
        dispatch('resetWallet', null, { root: true }),
      ])
      await dispatch(`startSync`)
      await dispatch('loadTokenBalances')
    },
    loadBalance: async ({ state }) => {
      const hexBalance = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [state.accounts[0], 'latest'],
      })
      state.balance = ethers.utils.formatEther(hexBalance)
    },
    loadTokenBalances: async ({ state, rootState }) => {
      for (const { address, symbol } of rootState.zkopru.registeredTokens) {
        const tokenContract = await rootState.zkopru.client.getERC20Contract(address)
        const myAddress = state.accounts[0]
        const [balance, decimals] = await Promise.all([
          tokenContract.balanceOf(myAddress),
          tokenContract.decimals(),
        ])
        const balanceDecimal = +balance.toString() / (10 ** +decimals.toString())
        state.tokenBalances = { ...state.tokenBalances, [symbol]: balanceDecimal }
      }
    },
    loadTokenAllowance: async ({ state, rootState }, address) => {
      const tokenContract = await rootState.zkopru.client.getERC20Contract(address)
      const myAddress = state.accounts[0]
      const allowance = await tokenContract.allowance(
        myAddress,
        rootState.zkopru.client.node.layer1.address
      )
      return allowance
    }
  }
}
