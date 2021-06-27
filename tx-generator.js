const Zkopru = require('@zkopru/client').default
const { sha512_256 } = require('js-sha512')
const BN = require('bn.js')

// const URL = 'wss://goerli.infura.io/ws/v3/5b122dbc87ed4260bf9a2031e8a0e2aa'
const URL = 'ws://localhost:8546'
const PRIVATE_KEY = '0x6e6f631356ddbd240abf2ccfe67c3f5dfbd1f4ce950aaab6f45dd7d7816e8171'
const PUBLIC_KEY = '0x3537256fFB47da602871bE7FB26d9fe7e42dD055'

;(async () => {
  const client = new Zkopru.Node({
    websocket: URL,
  })
  const key = sha512_256('test')
  await client.start(':memory:')
  const wallet = new Zkopru.Wallet(
    client,
    key
  )
  for (;;) {
    try {
    await new Promise(r => setTimeout(r, 45000))
      const { web3 } = client.node.layer1
      const gasPrice = Math.ceil(2 * +(await web3.eth.getGasPrice()))
      if (+gasPrice > 50000000000) {
        console.log(`Current gas price: ${+gasPrice / 10**9} gwei, skipping...`)
        continue
      }
      console.log(`Current gas price: ${+gasPrice / 10**9} gwei`)
      const { to, data, value, onComplete } = wallet.wallet.depositEtherTx(
        toWei('0.0001'),
        toWei('0.0004')
      )
      // sign/send tx
      console.log(gasPrice, to, data, value)
      const { rawTransaction } = await web3.eth.accounts.signTransaction({
        gasPrice,
        gas: 300000,
        to,
        data,
        value: `0x${value}`,
        from: PUBLIC_KEY,
      }, PRIVATE_KEY)
      console.log('Sending deposit...')
      await web3.eth.sendSignedTransaction(rawTransaction)
      console.log('Done!')
      await onComplete()
    } catch (err) {
      console.log(err)
    }
  }
})()

function fromWei(amount, decimals = 3) {
  let bnAmount
  if (typeof amount === 'string' && amount.indexOf('0x') === 0) {
    bnAmount = new BN(amount.slice(2), 16)
  } else {
    bnAmount = new BN(amount)
  }
  const finney = bnAmount.div(new BN(`${10 ** (18 - decimals)}`)).toString()
  const ether = +finney / (10 ** decimals)
  return ether
}

function toWei(amount) {
  const decimalIndex = amount.toString().indexOf('.')
  let decimalCount = 0
  if (decimalIndex !== -1) {
    decimalCount = amount.toString().length - decimalIndex
  }
  const baseAmount = +amount.toString() * (10 ** decimalCount)
  const wei = new BN(baseAmount.toString()).mul(new BN('10').pow(new BN(18 - decimalCount)))
  return wei.toString()
}
