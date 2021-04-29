import BN from 'bn.js'

function fromWei(amount) {
  let bnAmount
  if (typeof amount === 'string' && amount.indexOf('0x') === 0) {
    bnAmount = new BN(amount.slice(2), 16)
  } else {
    bnAmount = new BN(amount)
  }
  const finney = bnAmount.div(new BN(`${10 ** 15}`)).toString()
  const ether = +finney / (10 ** 3)
  return ether
}

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
      await dispatch('loadBalance')
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
