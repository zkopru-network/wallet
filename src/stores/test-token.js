import { ABI, address, decimals } from '../utils/TestToken'

export default {
  state: {
  },
  actions: {
    mint: async ({ state, rootState }, amount) => {
      const { web3 } = rootState.zkopru.client.node.layer1
      const tokenContract = new web3.eth.Contract(ABI, address)
      const decimalAmount = ((+amount)*(10**decimals))
      const data = await tokenContract.methods.mint(`${decimalAmount}`).encodeABI()
      await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [{
          data,
          to: address,
          value: '0',
          from: rootState.account.accounts[0],
        }]
      })
    }
  }
}
