import BigNumber from "bignumber.js"

export function fromWei(amount, decimals = 3) {
  let bnAmount
  if (typeof amount === 'string' && amount.indexOf('0x') === 0) {
    bnAmount = new BigNumber(amount.slice(2), 16)
  } else {
    bnAmount = new BigNumber(amount.toString())
  }
  const finney = bnAmount.div(new BigNumber(`${10 ** (18 - decimals)}`)).toString()
  const ether = +finney / (10 ** decimals)
  return new BigNumber(ether.toString()).toString(10)
}

export function toWei(amount) {
  const decimalIndex = amount.toString().indexOf('.')
  let decimalCount = 0
  if (decimalIndex !== -1) {
    decimalCount = amount.toString().length - decimalIndex
  }
  const baseAmount = Math.floor(+amount.toString() * (10 ** decimalCount))
  const wei = new BigNumber(baseAmount.toString()).multipliedBy(new BigNumber('10').pow(18 - decimalCount))
  return wei.toString(10)
}
