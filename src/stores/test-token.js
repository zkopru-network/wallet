import { ABI, address, decimals } from '../utils/TestToken'

export default {
  state: {
  },
  actions: {
    mint: async ({ state, rootState }, amount) => {
      const tokenContract = new ethers.Contract(ABI, address,rootState.zkopru.client.node.layer1.provider)
      const decimalAmount = ((+amount)*(10**decimals))
      const data = await tokenContract.interface.encodeFunctionData('mint',[decimalAmount])
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
