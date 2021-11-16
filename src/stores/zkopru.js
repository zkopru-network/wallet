import { fromWei } from '../utils/wei'
import dayjs from 'dayjs'
import BN from 'bn.js'

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
    lockedTokenBalances: {},
    l2BalanceLoaded: false,
    registeredTokens: [],
    tokensByAddress: {},
    history: [],
    // dev only
    noteInfo: {},
  },
  getters: {
    percent: state => {
      const { latestBlock, proposalCount } = state
      if (!proposalCount) return 0
      return 100 * latestBlock / proposalCount
    },
    balance: (state) => (assetSymbol) => {
      if (assetSymbol.toUpperCase() === 'ETH') {
        return state.balance || '0'
      }
      return state.tokenBalances[assetSymbol.toUpperCase()] || '0'
    },
    lockedBalance: (state) => (assetSymbol) => {
      if (assetSymbol.toUpperCase() === 'ETH') {
        return state.lockedBalance || '0'
      }
      return state.lockedTokenBalances[assetSymbol.toUpperCase()] || '0'
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
      const ZkopruPromise = import(/* webpackPrefetch: true */ '@zkopru/client/browser')
      if (!state.client) {
        await dispatch('loadWalletKey')
        const { default: Zkopru, ZkAccount } = await ZkopruPromise
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
      const { sha512_256 } = await import(/* webpackPrefetch: true */ 'js-sha512')
      state.walletKey = sha512_256(signedData)
      return state.walletKey
    },
    loadWallet: async ({ state, commit, dispatch }) => {
      const key = await dispatch('loadWalletKey')
      const { default: Zkopru } = await import(/* webpackPrefetch: true */ '@zkopru/client/browser')
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
      const { default: Zkopru, UtxoStatus } = await import(/* webpackPrefetch: true */ '@zkopru/client/browser')
      const [
        spendable,
        locked,
        erc20Info,
        notes
      ] = await Promise.all([
        state.wallet.wallet.getSpendableAmount(),
        state.wallet.wallet.getLockedAmount(),
        state.client.node.loadERC20Info(),
        state.wallet.wallet.getUtxos(null, [UtxoStatus.UNSPENT, UtxoStatus.SPENDING])
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
            [token.symbol]: (+erc20[_address].toString()/(10**(+token.decimals))),
          }
        }
        state.lockedTokenBalances = {}
        for (const _address of Object.keys(locked.erc20)) {
          const token = state.tokensByAddress[_address.toLowerCase()]
          if (!token) continue
          state.lockedTokenBalances = {
            ...state.lockedTokenBalances,
            [token.symbol]: (+locked.erc20[_address].toString()/(10**(+token.decimals))),
          }
        }
        const info = {}
        for (const { asset } of notes) {
          // TODO: handle notes that have both an ERC20 balance and an eth balance
          const token = state.tokensByAddress[`0x${asset.tokenAddr.toString(16)}`]
          const key = token ? token.symbol : 'ETH'
          const existing = info[key] || {}
          const count = existing.count ?? 0;
          const total = existing.total ?? new BN('0');
          const largestNotes = existing.largestNotes || []
          const amount = key === 'ETH' ? asset.eth : asset.erc20Amount.add(asset.nft)
          if (largestNotes.length < 4) {
            largestNotes.push(amount)
          } else {
            largestNotes.sort((a, b) => {
              if (a.eq(b)) return 0
              if (a.gt(b)) return 1
              return -1
            })
            if (largestNotes[0].lt(amount)) {
              largestNotes[0] = amount
            }
          }
          const maxSpend = largestNotes.reduce((total, current) => {
            return total.add(current)
          }, new BN('0'))
          const decimals = token ? token.decimals : 18
          const offsetDecimals = Math.min(3, decimals)
          const maxSpendDecimal = +maxSpend.div(new BN(`${10**(decimals - offsetDecimals)}`)).toString() / (10**offsetDecimals)
          info[key] = {
            count: count + 1,
            total: total.add(amount),
            largestNotes,
            maxSpend,
            maxSpendDecimal,
          }
        }

        state.noteInfo = info
        // state.tokenBalances = erc20
        // load l1 token balances
        dispatch('loadTokenBalances', { root: true })
      }
      {
        const { erc20, erc721, eth } = locked
        state.lockedBalance = fromWei(eth.toString())
      }
      state.l2BalanceLoaded = true
    },
    loadCurrentWeiPerByte: async ({ state, dispatch }) => {
      if (!state.wallet) {
        await dispatch('loadWallet')
      }
      return state.wallet.loadCurrentPrice()
    },
    resetDB: async ({ state, dispatch }) => {
      // take the db and empty it
      const { default: Zkopru } = await import(/* webpackPrefetch: true */ '@zkopru/client/browser')
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
      return await window.ethereum.request({
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
      const { history, pending } = await state.wallet.transactionsFor(l2Address, l1Address)
      state.history =
        [
          ...pending,
          ...history
            .filter(h => !!h.proposal)
            .sort((a, b) => b.proposal.timestamp - a.proposal.timestamp),
        ]
    }
  },
}
