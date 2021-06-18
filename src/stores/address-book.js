import { ABI, address } from '../utils/AddressBook'
import Zkopru from '@zkopru/client/browser'
import namehash from 'eth-ens-namehash'

export default {
  state: {},
  actions: {
    registerAddress: async ({ state, rootState }) => {
      const { web3 } = rootState.zkopru.client.node.layer1
      const addressBookContract = new web3.eth.Contract(ABI, address)
      const data = await addressBookContract.methods.registerAddress(
        rootState.zkopru.client.node.layer1.address,
        rootState.zkopru.wallet.wallet.account.zkAddress.toBuffer(),
        false,
      ).encodeABI()
      await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [{
          data,
          to: address,
          value: '0',
          from: rootState.account.accounts[0],
        }]
      })
    },
    resolveAddress: async ({ state, rootState }, _address) => {
      const { web3 } = rootState.zkopru.client.node.layer1
      const addressBookContract = new web3.eth.Contract(ABI, address)
      const events = await addressBookContract.getPastEvents('L2AddrChanged', {
        filter: {
          ownerAddr: _address,
          contractAddr: rootState.zkopru.client.node.layer1.address,
        },
          fromBlock: 'earliest',
          toBlock: 'latest'
      })
      if (events.length === 0) {
        console.log('No bindings found')
      } else {
        const { l2Addr } = events.pop().returnValues
        const buf = Buffer.from(l2Addr.replace('0x', ''), 'hex')
        try {
          const zkAddress = Zkopru.ZkAddress.fromBuffer(buf)
          return zkAddress.address
        } catch (_) {
          return
        }
      }
    },
    resolveENS: async ({ state, rootState, dispatch }, ensAddress) => {
      const hash = namehash.hash(ensAddress)
      const { web3 } = rootState.zkopru.client.node.layer1
      const addressBookContract = new web3.eth.Contract(ABI, address)
      try {
        const resolvedAddr = await addressBookContract.methods.resolveENS(hash).call()
        if (!resolvedAddr) return
        return dispatch('resolveAddress', resolvedAddr)
      } catch (_) {}
    },
  }
}
