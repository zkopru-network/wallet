import Zkopru from '@zkopru/client/browser'
import { sha512_256 } from 'js-sha512'

const URL = 'wss://goerli.infura.io/ws/v3/5b122dbc87ed4260bf9a2031e8a0e2aa'

export default {
  state: {
    client: null,
    latestBlock: 0,
    proposalCount: 0,
    syncPercent: 0,
    status: 'on syncing',
    syncing: false,
    wallet: null,
    zkAddress: null,
    shortZkAddress: null,
  },
  getters: {
    percent: state => {
      const { latestBlock, proposalCount } = state
      if (!proposalCount) return 0
      return 100 * latestBlock / proposalCount
    }
  },
  mutations: {
    setZkAddress: (state, address) => {
      state.zkAddress = address
      const length = 7
      state.shortZkAddress = `${address.slice(0, length)}...${address.slice(-1 * length)}`
    }
  },
  actions: {
    startSync: async ({ state, dispatch }) => {
      if (!state.client) {
        // initialize the client if it doesn't already exist
        state.client = new Zkopru.Node({
          websocket: URL,
        })
        state.syncing = true
        await state.client.start()
        state.client.node.synchronizer.on('onFetched', async () => dispatch('updateStatus'))
        state.client.node.synchronizer.on('status', async () => dispatch('updateStatus'))
        await dispatch('loadWallet')
      }
    },
    updateStatus: async ({ state }) => {
      state.status = state.client.node.synchronizer.status
      const highestProposal = await state.client.node.db.findOne('Proposal', {
        where: {},
        orderBy: { proposalNum: 'desc' },
      })
      state.proposalCount = highestProposal.proposalNum
      const latestBlockHash = await state.client.node.layer2.latestBlock()
      const latestBlock = await state.client.node.layer2.getProposal(
        latestBlockHash,
      )
      if (!latestBlock) throw new Error(`Unable to find hash: ${latestBlockHash}`)
      if (typeof latestBlock.canonicalNum !== 'number') {
        throw new Error('Latest block does not include canonical number')
      }
      state.latestBlock = latestBlock.canonicalNum
      state.syncPercent = 100 * state.latestBlock / state.proposalCount
    },
    loadWallet: async ({ state, rootState, commit }) => {
      const msgParams = JSON.stringify({
        domain: {
          chainId: 5,
          name: 'Zkopru Testnet',
          version: '0',
        },
        message: {
          info: 'Unlock Zkopru wallet',
          warning: 'This signature is your private key, only sign on official Zkopru websites!',
        },
        primaryType: 'ZkopruKey',
        types: {
          ZkopruKey: [
            { name: 'info', type: 'string', },
            { name: 'warning', type: 'string', },
          ]
        }
      })
      const signedData = await window.ethereum.request({
        method: 'eth_signTypedData_v4',
        params: [rootState.account.accounts[0], msgParams]
      })
      const key = sha512_256(signedData)
      state.wallet = new Zkopru.Wallet(
        state.client,
        key,
        'http://localhost:8888'
      )
      const { address } = state.wallet.wallet.account.zkAddress
      commit('setZkAddress', address)
    },
  },
}
