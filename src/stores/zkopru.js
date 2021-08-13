import Zkopru, { ZkAccount } from '@zkopru/client/browser'
import { sha512_256 } from 'js-sha512'
import { fromWei } from '../utils/wei'
import dayjs from 'dayjs'

const URL = 'wss://goerli.infura.io/ws/v3/5b122dbc87ed4260bf9a2031e8a0e2aa'
// const URL = 'ws://localhost:8546'

export default {
  state: {
    client: null,
    latestBlock: 0,
    proposalCount: 0,
    uncleCount: 0,
    syncPercent: 0,
    status: 'Not synchronizing',
    syncing: false,
    wallet: null,
    walletKey: null,
    zkAddress: null,
    shortZkAddress: null,
    lockedBalance: null,
    balance: null,
    tokenBalances: {},
    registeredTokens: [],
    tokensByAddress: {},
    history: [],
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
        await dispatch('loadWalletKey')
        // initialize the client if it doesn't already exist
        state.client = new Zkopru.Node({
          websocket: URL,
          accounts: [new ZkAccount(state.walletKey)],
        })
        state.syncing = true
        state.status = 'Preparing to synchronize'
        await state.client.initNode()
        await dispatch('loadWallet')
        await state.client.start()
        state.client.node.synchronizer.on('onFetched', async () => dispatch('updateStatus'))
        state.client.node.synchronizer.on('status', async () => dispatch('updateStatus'))
        state.client.node.blockProcessor.on('processed', async () => dispatch('updateStatus'))
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
      const uncleCount = await state.client.node.db.count('Proposal', {
        isUncle: true,
      })
      state.proposalCount = highestProposal.proposalNum
      state.uncleCount = uncleCount
      const latestBlockHash = await state.client.node.layer2.latestBlock()
      const latestBlock = await state.client.node.layer2.getProposal(
        latestBlockHash,
      )
      if (!latestBlock) throw new Error(`Unable to find hash: ${latestBlockHash}`)
      if (typeof latestBlock.canonicalNum !== 'number') {
        throw new Error('Latest block does not include canonical number')
      }
      state.latestBlock = latestBlock.canonicalNum
      // if (newPercent === 100 && state.syncPercent < 100) {
        // load the l2 balance
        dispatch('loadL2Balance')
        dispatch('loadHistory')
      // }
      if (state.latestBlock > 0) {
        const newPercent = 100 * +state.latestBlock / (+state.proposalCount - state.uncleCount)
        state.syncPercent = newPercent.toFixed(2)
      } else {
        state.syncPercent = 100
      }
    },
    loadWalletKey: async ({ state, rootState }) => {
      if (state.walletKey) {
        return state.walletKey
      }
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
      state.walletKey = sha512_256(signedData)
      return state.walletKey
    },
    loadWallet: async ({ state, commit, dispatch }) => {
      const key = await dispatch('loadWalletKey')
      state.wallet = new Zkopru.Wallet(
        state.client,
        key
      )
      const { address } = state.wallet.wallet.account.zkAddress
      commit('setZkAddress', address)
      await dispatch('loadL2Balance')
      await dispatch('loadHistory')
    },
    loadL2Balance: async ({ state, dispatch }) => {
      const [
        spendable,
        locked,
        erc20Info,
      ] = await Promise.all([
        state.wallet.wallet.getSpendableAmount(),
        state.wallet.wallet.getLockedAmount(),
        state.client.node.loadERC20Info(),
      ])
      {
        // DEV: skip the bugged test token contract
        const tokenBlacklist = [
          '0x560bd972e69f4dc15abf6093fcff2bc7e14f9239'.toLowerCase()
        ]
        state.registeredTokens = erc20Info.filter(({ address }) => {
          return tokenBlacklist.indexOf(address.toLowerCase()) === -1
        })
        state.tokensByAddress = erc20Info.reduce((acc, token) => {
          // DEV: skip the bugged test token contract
          if (tokenBlacklist.indexOf(token.address.toLowerCase()) !== -1) return acc
          return {
            [token.address.toLowerCase()]: token,
            ...acc
          }
        }, {})
        const { erc20, erc721, eth } = spendable
        state.balance = fromWei(eth.toString())
        for (const _address of Object.keys(erc20)) {
          const token = state.tokensByAddress[_address.toLowerCase()]
          if (!token) continue
          state.tokenBalances = {
            ...state.tokenBalances,
            [token.symbol]: (+erc20[_address].toString()/(10**(+token.decimals)))
          }
        }
        // state.tokenBalances = erc20
        // load l1 token balances
        dispatch('loadTokenBalances', { root: true })
      }
      {
        const { erc20, erc721, eth } = locked
        state.lockedBalance = fromWei(eth.toString())
      }
    },
    loadCurrentWeiPerByte: async ({ state, dispatch }) => {
      if (!state.wallet) {
        await dispatch('loadWallet')
      }
      return state.wallet.loadCurrentPrice()
    },
    resetDB: async ({ state, dispatch }) => {
      // take the db and empty it
      if (!state.client) {
        state.client = new Zkopru.Node({
          websocket: URL,
        })
      }
      await state.client.stop()
      await state.client.resetDB()
      state.syncing = false
      state.latestBlock = 0
      state.proposalCount = 0
      state.syncPercent = 0
      state.status = 'Not synchronizing'
      window.location.reload(false)
    },
    registerERC20: async ({ state, rootState }, address) => {
      const data = await state.client.registerERC20Tx(address)
      await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [{
          data,
          to: state.client.node.layer1.address,
          from: rootState.account.accounts[0],
        }]
      })
    },
    loadHistory: async ({ state, rootState }) => {
      const { layer2, db } = state.client.node
      const { web3 } = state.client.node.layer1
      const l2Address = state.wallet.wallet.account.zkAddress.toString()
      const l1Address = rootState.account.accounts[0]
      const deposits = await db.findMany('Deposit', {
        where: {
          ownerAddress: [l2Address],
        }
      })

      // because case sensitivity differes in l1Address and database,
      // need to filter after querying all records in database.
      const withdrawals = (await db.findMany('Withdrawal', { where: {}, include: { proposal: true } }))
        .filter(withdraw => withdraw.to.toLocaleLowerCase() === l1Address)
      const sendTxs = await db.findMany('Tx', {
        where: { senderAddress: l2Address },
        include: { proposal: true }
      })
      const receiveTxs = await db.findMany('Tx', {
        where: { receiverAddress: l2Address },
        include: { proposal: true }
      })
      const pendingTxs = await db.findMany('PendingTx', {
        where: { senderAddress: l2Address },
      })

      // use utxos to get deposit amount
      const utxos = await db.findMany('Utxo', {
        where: {
          owner: [l2Address],
        }
      })

      const history = [
        ...await Promise.all(deposits.map(async (deposit) => {
          const utxo = utxos.find(utxo => utxo.hash === deposit.note)
          const block = await web3.eth.getBlock(deposit.blockNumber)
          return {
            type: 'Deposit',
            ...deposit,
            ...utxo,
            timestamp: block.timestamp
          }
        })),
        ...pendingTxs.map((tx) => ({
          type: 'Send',
          ...tx,
          timestamp: dayjs().unix()
        })),
        ...receiveTxs.map((tx) => ({
            type: 'Receive',
            ...tx,
            timestamp: (tx.proposal || {}).timestamp
          })
        ),
        ...sendTxs.map((tx) => ({
          type: 'Send',
          ...tx,
          timestamp: (tx.proposal || {}).timestamp
        })),
        ...withdrawals.map((withdraw) => ({
          type: 'Withdraw',
          ...withdraw,
          timestamp: (withdraw.proposal || {}).timestamp
        }))
      ]
      state.history = history.sort((a, b) => b.timestamp - a.timestamp)
    }
  },
}
