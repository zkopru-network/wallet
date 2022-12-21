import { ethers } from 'ethers'
import { ABI, address } from '../utils/AddressBook'
import namehash from 'eth-ens-namehash'

export default {
  state: {},
  actions: {
    registerAddress: async ({ state, rootState }) => {
      const addressBookContract = new ethers.Contract(ABI, address, rootState.zkopru.client.node.layer1.provider)
      const data = await addressBookContract.interface.encodeFunctionData('registerAddress',[
        rootState.zkopru.client.node.layer1.address,
        rootState.zkopru.wallet.wallet.account.zkAddress.toBuffer(),
        false,
      ])
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
      const addressBookContract = new ethers.Contract(ABI, address, rootState.zkopru.client.node.layer1.provider)
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
        const { default: Zkopru } = await import('@zkopru/client/browser')
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
      const addressBookContract = new ethers.Contract(ABI, address, rootState.zkopru.client.node.layer1.provider)
      try {
        const resolvedAddr = await addressBookContract.resolveENS(hash)
        if (!resolvedAddr) return
        return {
          ethAddress: resolvedAddr,
          zkAddress: await dispatch('resolveAddress', resolvedAddr)
        }
      } catch (_) {}
    },
  }
}
