import Zkopru from '@zkopru/client/browser'
import { sha512_256 } from 'js-sha512'
import { fromWei } from '../utils/wei'

const URL = 'wss://goerli.infura.io/ws/v3/5b122dbc87ed4260bf9a2031e8a0e2aa'

export default {
  state: {
    client: null,
    latestBlock: 0,
    proposalCount: 0,
    syncPercent: 0,
    status: 'Not synchronizing',
    syncing: false,
    wallet: null,
    zkAddress: null,
    shortZkAddress: null,
    lockedBalance: null,
    balance: null,
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
        state.client.node.blockProcessor.on('processed', async () => dispatch('updateStatus'))
        await dispatch('loadWallet')
      }
    },
    resetWallet: async ({ state, dispatch }) => {
      state.wallet = null
      state.zkAddress = null
      state.shortZkAddress = null
      state.lockedBalance = null
      state.balance = null
      await dispatch('loadWallet').catch(console.log)
    },
    updateStatus: async ({ state, dispatch }) => {
      const { status } = state.client.node.synchronizer
      if (status === 'on syncing') {
        state.status = 'Checking validity using L1Provider'
      } else if (status === 'fully synced') {
        state.status = 'Fully synced'
      }
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
      const newPercent = 100 * +state.latestBlock / +state.proposalCount
      if (newPercent === 100 && state.syncPercent < 100) {
        // load the l2 balance
        dispatch('loadL2Balance')
      }
      state.syncPercent = newPercent
    },
    loadWallet: async ({ state, rootState, commit, dispatch }) => {
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
        'https://zkopru.goerli.rollupscan.io'
      )
      const { address } = state.wallet.wallet.account.zkAddress
      commit('setZkAddress', address)
      await dispatch('loadL2Balance')
    },
    loadL2Balance: async ({ state, dispatch }) => {
      const [
        spendable,
        locked,
      ] = await Promise.all([
        state.wallet.wallet.getSpendableAmount(),
        state.wallet.wallet.getLockedAmount(),
      ])
      {
        const { erc20, erc721, eth } = spendable
        state.balance = fromWei(eth.toString())
      }
      {
        const { erc20, erc721, eth } = locked
        state.lockedBalance = fromWei(eth.toString())
      }
    }
  },
}
